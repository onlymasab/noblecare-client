import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, ArrowRight, Paperclip } from "lucide-react";

// Base URL for Gemini API (will be overridden by runtime for actual calls)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
// API Key will be provided by the Canvas runtime. Leave it as an empty string.
const API_KEY = ""; // Canvas will inject the actual API key at runtime

// Define types for better code readability and maintainability
type Attachment = {
  name: string;
  // Add other fields if needed (e.g., url, type)
};

type Message = {
  id: string;
  sender: "patient" | "doctor";
  text: string;
  time: string;
  attachments: Attachment[];
};

type Patient = {
  id: string;
  name: string;
  avatar: string;
  condition: string;
};

type ConversationMeta = {
  id: string;
  patient: Patient;
  lastMessage: string;
  time: string;
  unread: boolean;
};

type ActiveConversationState = {
  patient: Patient | null; // Allow null for 'New Message' state
  messages: Message[];
};

type PendingAiResponsesState = {
  [conversationId: string]: {
    text: string;
    generatedAt: number; // Timestamp in milliseconds when the draft was generated
  };
};

export default function MessagesPage() {
  // State for the list of conversations in the sidebar
  const [conversations, setConversations] = useState<ConversationMeta[]>([
    {
      id: "C001",
      patient: {
        id: "P001",
        name: "John Smith",
        avatar: "https://placehold.co/100x100/ADD8E6/000000?text=JS", // Placeholder image
        condition: "Hypertension"
      },
      lastMessage: "I've been experiencing chest pains after my medication",
      time: "2 hours ago",
      unread: true
    },
    {
      id: "C002",
      patient: {
        id: "P002",
        name: "Jane Doe",
        avatar: "https://placehold.co/100x100/FFB6C1/000000?text=JD", // Placeholder image
        condition: "Arrhythmia"
      },
      lastMessage: "My palpitations are more frequent today.",
      time: "Yesterday",
      unread: false
    },
    {
      id: "C003",
      patient: {
        id: "P003",
        name: "Peter Jones",
        avatar: "https://placehold.co/100x100/90EE90/000000?text=PJ", // Placeholder image
        condition: "Post-surgery recovery"
      },
      lastMessage: "When can I resume light exercise?",
      time: "3 days ago",
      unread: true
    }
  ]);

  // State for the currently active conversation, including its full message history
  const [activeConversation, setActiveConversation] = useState<ActiveConversationState>({
    patient: {
      id: "P001",
      name: "John Smith",
      avatar: "https://placehold.co/100x100/ADD8E6/000000?text=JS",
      condition: "Hypertension"
    },
    messages: [
      {
        id: "M001",
        sender: "patient",
        text: "Dr. I've been experiencing chest pains after taking my new medication",
        time: "Yesterday, 2:30 PM",
        attachments: []
      },
      {
        id: "M002",
        sender: "doctor",
        text: "I understand your concern. Can you describe your symptoms in more detail?",
        time: "Yesterday, 2:35 PM",
        attachments: []
      },
      {
        id: "M003",
        sender: "patient",
        text: "It's a dull ache, mostly on my left side, and I feel a bit lightheaded sometimes.",
        time: "Today, 10:00 AM",
        attachments: []
      }
    ]
  });

  // State for the message being typed by the admin
  const [newMessage, setNewMessage] = useState<string>("");
  // State to indicate if the AI is currently generating a draft response
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  // State for the search term in the conversations sidebar
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Ref for auto-scrolling the messages container
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // New state to hold AI-generated responses that are pending admin review/auto-send
  const [pendingAiResponses, setPendingAiResponses] = useState<PendingAiResponsesState>({});

  // New state to control the "New Messages" filter
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);


  // Effect to auto-scroll to the bottom of the messages whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to generate an AI draft response using the Gemini API (conceptual)
  // This function is called when a new patient message comes in and generates a draft.
  const generateAiDraftResponse = useCallback(async (conversationId: string, messagesContext: Message[]) => {
    setIsAiTyping(true); // Show AI typing indicator globally

    try {
      // Prepare chat history for the Gemini API call
      const chatHistory = messagesContext.map(msg => ({
        role: msg.sender === "patient" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Construct a detailed prompt to guide the AI towards cardiology and appointment-related responses
      const lastPatientMessage = messagesContext[messagesContext.length - 1]?.text || "No specific message.";
      const prompt = `As an AI doctor specializing in cardiology, please draft a professional, concise, and helpful response to the patient's latest message, which is: "${lastPatientMessage}". Focus strictly on heart health, potential medication side effects, advice related to cardiology symptoms, or guidance on doctor appointments. Limit the response to approximately 500 words.`;

      // Payload for the Gemini API request
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // Controls randomness: lower for more deterministic, higher for more creative
          topP: 0.95, // Nucleus sampling: higher for more diverse, lower for more focused
          topK: 40, // Top-k sampling: limits the sampling pool
          maxOutputTokens: 700 // Roughly corresponds to 500 words (1 token is approx 4 chars or 0.75 words)
        }
      };

      const apiUrl = `${GEMINI_API_URL}${API_KEY}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      let aiResponseText = "Sorry, I couldn't generate a response at this time. Please try again later or compose your own reply.";
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiResponseText = result.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", result);
      }

      // Store the generated response as pending for this conversation
      setPendingAiResponses(prev => ({
        ...prev,
        [conversationId]: {
          text: aiResponseText,
          generatedAt: Date.now() // Timestamp when the draft was created
        }
      }));

    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Store an error message as a pending response if the API call fails
      setPendingAiResponses(prev => ({
        ...prev,
        [conversationId]: {
          text: "AI draft generation failed. Please check your connection or try again later.",
          generatedAt: Date.now()
        }
      }));
    } finally {
      setIsAiTyping(false); // Hide AI typing indicator
    }
  }, []); // useCallback dependencies: only setPendingAiResponses, as other data is passed as arguments.

  // Handle sending a new message from the admin (doctor)
  const handleSendMessage = () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages
    if (!activeConversation.patient) { // If no patient is selected for 'New Message' mode
        // In a real app, you'd handle selecting/creating a patient here
        console.warn("No patient selected for sending a new message.");
        // For now, let's just clear the message and stay in 'New Message' mode
        setNewMessage("");
        return;
    }

    const doctorMessage: Message = { // Now from the doctor's side
      id: `M${Date.now()}`,
      sender: "doctor", // Now explicitly from the doctor/admin's side
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: []
    };

    // Add the new message to the active conversation's messages
    setActiveConversation(prev => ({
      ...prev,
      messages: [...(prev.messages || []), doctorMessage] // Ensure messages array exists
    }));

    setNewMessage(""); // Clear the input field immediately after sending

    // Important: This function no longer triggers AI drafting.
    // AI drafting is now triggered by a separate useEffect when patient messages arrive.
  };

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter for new line if needed
      e.preventDefault(); // Prevent default new line behavior
      handleSendMessage();
    }
  };

  // Handle clicking on a conversation in the sidebar to make it active
  const handleConversationClick = useCallback((conversation: ConversationMeta) => {
    setActiveConversation({
      patient: conversation.patient,
      // In a real application, you would fetch the full message history
      // for this conversation ID from your backend/database here.
      // For this simulation, we're just setting an initial message based on lastMessage.
      messages: [
        {
          id: `M_initial_${conversation.id}`, // Unique ID for initial message when switching
          sender: "patient", // Assuming the last message shown in sidebar is from patient
          text: conversation.lastMessage,
          time: conversation.time,
          attachments: []
        }
      ]
    });
    // Mark the clicked conversation as read
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      )
    );
    // Clear any pending AI responses for other conversations when switching
    setPendingAiResponses({});
    // Clear newMessage input
    setNewMessage("");
  }, []);

  // Handle "New Message" button click
  const handleNewMessage = useCallback(() => {
    setActiveConversation({
      patient: null, // Indicate that no specific patient is selected yet
      messages: [] // Start with an empty message history
    });
    setNewMessage(""); // Clear message input
    setPendingAiResponses({}); // Clear any pending AI responses
  }, []);

  // Filter conversations based on the search term and unread status
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnreadFilter = showUnreadOnly ? conv.unread : true;
    return matchesSearch && matchesUnreadFilter;
  });

  // Function to send a pending AI draft immediately
  const handleSendAiDraft = (conversationId: string) => {
    const pending = pendingAiResponses[conversationId];
    if (pending && activeConversation.patient?.id === conversationId) { // Ensure draft is for active convo
      const aiMessage: Message = {
        id: `M${Date.now()}-manual`, // Unique ID for manually sent AI message
        sender: "doctor",
        text: pending.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachments: []
      };
      // Add the AI message to the active conversation's messages
      setActiveConversation(prev => ({
        ...prev,
        messages: [...(prev.messages || []), aiMessage]
      }));
      // Remove the draft from pending responses
      setPendingAiResponses(prev => {
        const newState = { ...prev };
        delete newState[conversationId];
        return newState;
      });
      // Update the last message and time in the conversations list
      setConversations(prevConvs =>
          prevConvs.map(conv =>
              conv.id === conversationId ? { ...conv, lastMessage: pending.text, time: aiMessage.time, unread: false } : conv
          )
      );
    }
  };

  // Function to load a pending AI draft into the input field for editing
  const handleEditAiDraft = (conversationId: string) => {
    const pending = pendingAiResponses[conversationId];
    if (pending && activeConversation.patient?.id === conversationId) { // Ensure draft is for active convo
      setNewMessage(pending.text); // Set the draft text to the input field
      // Remove the draft from pending responses as it's now being edited manually
      setPendingAiResponses(prev => {
        const newState = { ...prev };
        delete newState[conversationId];
        return newState;
      });
    }
  };

  // Effect to automatically send pending AI responses after 15 minutes
  useEffect(() => {
    const autoSendInterval = setInterval(() => {
      setPendingAiResponses(prevPending => {
        const updatedPending = { ...prevPending };

        for (const convId in updatedPending) {
          const pending = updatedPending[convId];
          const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

          // Check if the draft is older than 15 minutes
          if (Date.now() - pending.generatedAt > fifteenMinutes) {
            const autoSentMessage: Message = {
              id: `M${Date.now()}-auto-${convId}`, // Unique ID for auto-sent AI message
              sender: "doctor",
              text: pending.text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              attachments: []
            };

            // Remove the draft from pending responses
            delete updatedPending[convId];

            // Update the main conversations list to reflect the new last message and time
            setConversations(prevConvs =>
              prevConvs.map(conv => {
                if (conv.id === convId) {
                  // Mark as unread for the admin, as it was auto-sent
                  return { ...conv, lastMessage: pending.text, time: autoSentMessage.time, unread: true };
                }
                return conv;
              })
            );

            // If the auto-sent message belongs to the currently active conversation,
            // update its messages directly to reflect the change immediately in UI.
            if (activeConversation.patient?.id === convId) {
              setActiveConversation(prev => ({
                ...prev,
                messages: [...(prev.messages || []), autoSentMessage]
              }));
            }
          }
        }
        return updatedPending; // Return the updated pending responses state
      });
    }, 60 * 1000); // Check every minute (adjust frequency as needed)

    // Cleanup function: clear the interval when the component unmounts
    return () => clearInterval(autoSendInterval);
  }, [activeConversation.patient, setConversations, setActiveConversation]); // Dependencies for useEffect

  // Effect to trigger AI draft response (when a new patient message arrives)
  useEffect(() => {
    // Only proceed if active conversation and its messages are available
    if (!activeConversation || activeConversation.messages.length === 0 || !activeConversation.patient) {
      return;
    }

    const latestMessage = activeConversation.messages[activeConversation.messages.length - 1];

    // Check if the latest message is from the patient AND
    // if there isn't already a pending AI response for this conversation AND
    // if AI is not currently typing (to prevent duplicate drafts)
    if (latestMessage.sender === "patient" && !pendingAiResponses[activeConversation.patient.id] && !isAiTyping) {
      console.log("New patient message received, triggering AI draft...");
      generateAiDraftResponse(activeConversation.patient.id, activeConversation.messages);
    }
  }, [activeConversation.messages, activeConversation.patient, pendingAiResponses, isAiTyping, generateAiDraftResponse]);


  // SVG for AI typing animation (dots bouncing)
  const AiTypingSVG = () => (
    <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
      <style >{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .dot {
          animation: bounce 1.4s infinite ease-in-out both;
          transform-origin: center center;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }
      `}</style>
      <circle className="dot" cx="7" cy="10" r="4" fill="#60A5FA" />
      <circle className="dot" cx="20" cy="10" r="4" fill="#60A5FA" />
      <circle className="dot" cx="33" cy="10" r="4" fill="#60A5FA" />
    </svg>
  );

  // SVG for AI hovering animation (used for pending draft indicator)
  const AiHoveringSVG = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <style >{`
        @keyframes hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .ai-icon-hover {
          animation: hover 1.5s ease-in-out infinite;
        }
      `}</style>
      <path className="ai-icon-hover" fill="#888888" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-7h4v2H8v-2zM8 7h4v2H8V7z"/>
    </svg>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] font-sans bg-gray-50 antialiased rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar with conversations */}
      <div className="w-80 border-r bg-white p-4 flex flex-col rounded-l-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <Button variant="outline" size="sm" className="rounded-md border-blue-400 text-blue-600 hover:bg-blue-50"
            onClick={handleNewMessage}>
            <Mail className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients..."
            className="pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex justify-around mb-4 space-x-2">
          <Button
            variant={!showUnreadOnly ? "default" : "outline"}
            size="sm"
            className={`flex-1 rounded-md ${!showUnreadOnly ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setShowUnreadOnly(false)}
          >
            All Messages
          </Button>
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            className={`flex-1 rounded-md ${showUnreadOnly ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setShowUnreadOnly(true)}
          >
            New Messages
            {conversations.filter(c => c.unread).length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {conversations.filter(c => c.unread).length}
              </span>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200
                  ${activeConversation.patient?.id === conversation.patient.id ? "bg-blue-100 border border-blue-300 shadow-sm" : "bg-white border border-transparent"}`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={conversation.patient.avatar} alt={conversation.patient.name} />
                    <AvatarFallback className="bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm">
                      {conversation.patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate text-gray-900">{conversation.patient.name}</h4>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${conversation.unread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {conversation.lastMessage}
                    </p>
                    <span className="text-xs text-blue-500 font-medium">{conversation.patient.condition}</span>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8 text-sm">No conversations found matching "{searchTerm}".</p>
          )}
        </div>
      </div>

      {/* Main message area */}
      <div className="flex-1 flex flex-col bg-white rounded-r-lg">
        {/* Message header */}
        <div className="border-b p-4 bg-white shadow-sm flex items-center rounded-tr-lg">
          {activeConversation.patient ? (
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activeConversation.patient.avatar} alt={activeConversation.patient.name} />
                <AvatarFallback className="bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-lg">
                  {activeConversation.patient.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg text-gray-900">{activeConversation.patient.name}</h3>
                <p className="text-sm text-gray-600">{activeConversation.patient.condition}</p>
              </div>
            </div>
          ) : (
            <h3 className="font-medium text-lg text-gray-900">New Message</h3>
          )}
        </div>

        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-gray-50">
          {activeConversation.messages.length > 0 ? (
            activeConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "patient" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[70%] sm:max-w-[60%] md:max-w-[50%] rounded-lg p-3 shadow-md
                    ${message.sender === "patient" ? "bg-white border border-gray-200" : "bg-blue-600 text-white"}`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="p-2 border rounded flex items-center bg-gray-100 text-gray-800 text-xs">
                          <Paperclip className="h-3 w-3 mr-1.5" />
                          <span className="truncate">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={`text-xs mt-1 text-right ${message.sender === "patient" ? "text-gray-500" : "text-blue-200"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            activeConversation.patient === null ? (
              <p className="text-center text-gray-500 mt-8 text-sm">Start a new conversation by typing a message or select a patient from the left sidebar.</p>
            ) : (
              <p className="text-center text-gray-500 mt-8 text-sm">No messages in this conversation yet.</p>
            )
          )}


          {/* AI Typing Indicator */}
          {isAiTyping && activeConversation.patient && ( // Only show if a patient is selected
            <div className="flex justify-end">
              <div className="max-w-[70%] sm:max-w-[60%] md:max-w-[50%] rounded-lg p-3 bg-blue-100 text-gray-800 shadow-md flex items-center">
                <AiTypingSVG /> <span className="ml-2 text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Pending AI Response Display */}
          {activeConversation.patient && pendingAiResponses[activeConversation.patient.id] && (
            <div className="flex justify-end">
              <div className="max-w-[70%] sm:max-w-[60%] md:max-w-[50%] rounded-lg p-3 shadow-md bg-yellow-100 border border-yellow-300 flex flex-col">
                <div className="flex items-center text-yellow-800 mb-2">
                  <AiHoveringSVG />
                  <span className="ml-2 font-semibold">AI Draft (Pending Send)</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-800">{pendingAiResponses[activeConversation.patient.id].text}</p>
                <div className="flex justify-end space-x-2 mt-3">
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                    onClick={() => handleSendAiDraft(activeConversation.patient?.id || '')}>
                    Send Now
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white text-gray-600 hover:bg-gray-100 rounded-md border-gray-300"
                    onClick={() => handleEditAiDraft(activeConversation.patient?.id || '')}>
                    Edit
                  </Button>
                </div>
                <p className="text-xs mt-1 text-right text-gray-500">
                  Drafted {new Date(pendingAiResponses[activeConversation.patient.id].generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="border-t p-4 bg-white shadow-lg flex items-center rounded-br-lg">
          <div className="relative flex-1 flex items-center space-x-2">
            <Button variant="ghost" size="icon" disabled={isAiTyping} className="flex-shrink-0 text-gray-500 hover:bg-gray-100 rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder={activeConversation.patient ? "Type your message..." : "Select a patient or type to start a new message..."}
              className="flex-1 rounded-full px-4 py-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAiTyping || !activeConversation.patient} // Disable if no patient selected
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isAiTyping || !activeConversation.patient} // Disable if no patient selected
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Custom Scrollbar CSS (global for demo) */}
      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
