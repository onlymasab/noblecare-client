import React, { useState } from 'react';

// Define an interface for a Patient Review
interface PatientReview {
    id: string;
    quote: string;
    author: string;
    rating: number; // e.g., 5 for 5 stars
    date: string;
}

export default function ReviewsPage() {
    // Dummy data for patient reviews
    const [reviews, setReviews] = useState<PatientReview[]>([
        {
            id: 'pr1',
            quote: "The cardiology team here is exceptional. Dr. Smith was incredibly thorough and compassionate. I felt completely at ease.",
            author: "Eleanor R.",
            rating: 5,
            date: '2024-06-10'
        },
        {
            id: 'pr2',
            quote: "From the moment I walked in, I knew I was in good hands. The staff is so caring, and the advanced technology gave me peace of mind.",
            author: "James P.",
            rating: 5,
            date: '2024-06-05'
        },
        {
            id: 'pr3',
            quote: "My experience was seamless. Scheduling was easy, and the care I received for my heart condition was top-notch. Highly recommend!",
            author: "Maria K.",
            rating: 4,
            date: '2024-05-28'
        },
        {
            id: 'pr4',
            quote: "I'm so grateful for the expertise of this department. They accurately diagnosed and treated my condition with great professionalism.",
            author: "Robert D.",
            rating: 5,
            date: '2024-05-20'
        },
    ]);

    // State for the new review form
    const [newAuthor, setNewAuthor] = useState<string>('');
    const [newQuote, setNewQuote] = useState<string>('');
    const [newRating, setNewRating] = useState<number>(5); // Default to 5 stars

    // Function to render star rating SVG icons
    const renderStars = (rating: number) => {
        return (
            <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.691h4.17c.969 0 1.371 1.24.588 1.81l-3.373 2.45a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.373-2.45a1 1 0 00-1.176 0l-3.373 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.385c-.783-.57-.381-1.81.588-1.81h4.17a1 1 0 00.95-.691l1.286-3.957z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Handle new review submission
    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAuthor.trim() === '' || newQuote.trim() === '') {
            alert('Please fill in your name and review.');
            return;
        }

        const newReview: PatientReview = {
            id: String(Date.now()), // Simple unique ID
            author: newAuthor.trim(),
            quote: newQuote.trim(),
            rating: newRating,
            date: new Date().toISOString().split('T')[0], // Current date
        };

        setReviews(prev => [newReview, ...prev]); // Add new review to the top
        setNewAuthor('');
        setNewQuote('');
        setNewRating(5); // Reset rating
        alert('Thank you for your review! It has been submitted.');
    };

    return (
        <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-900 text-gray-900 dark:text-gray-100 min-h-screen font-inter">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-12 md:gap-16">
                {/* Hero Section */}
                <section className="text-center py-16 sm:py-20 lg:py-24 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-blue-100 dark:border-blue-900">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 tracking-tight leading-tight">
                        Your Heartfelt Stories Matter
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Read what our patients say about their experience with our Cardiology Department.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                        Schedule An Appointment
                    </button>
                </section>

                {/* Patient Testimonials Section */}
                <section className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Our Patient Experiences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between items-center border border-gray-100 dark:border-gray-700"
                            >
                                {renderStars(review.rating)}
                                <p className="text-gray-700 dark:text-gray-300 italic mb-4 mt-2 flex-grow">
                                    "{review.quote}"
                                </p>
                                <div className="w-full text-left mt-auto">
                                    <p className="font-semibold text-blue-600 dark:text-blue-400">- {review.author}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Share Your Experience Form */}
                <section className="bg-blue-50 dark:bg-blue-900 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 text-center mb-8">Share Your Experience</h2>
                    <form onSubmit={handleSubmitReview} className="max-w-2xl mx-auto flex flex-col gap-6">
                        <div>
                            <label htmlFor="authorName" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="authorName"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                                placeholder="e.g., Jane Doe"
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="reviewQuote" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Review
                            </label>
                            <textarea
                                id="reviewQuote"
                                value={newQuote}
                                onChange={(e) => setNewQuote(e.target.value)}
                                placeholder="Share your experience with our Cardiology Department..."
                                rows={5}
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="reviewRating" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Rating
                            </label>
                            <select
                                id="reviewRating"
                                value={newRating}
                                onChange={(e) => setNewRating(parseInt(e.target.value))}
                                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value={5}>5 Stars - Excellent</option>
                                <option value={4}>4 Stars - Very Good</option>
                                <option value={3}>3 Stars - Good</option>
                                <option value={2}>2 Stars - Fair</option>
                                <option value={1}>1 Star - Poor</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300 dark:focus:ring-offset-gray-900 dark:focus:ring-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Submit Your Review
                        </button>
                    </form>
                </section>

                {/* Why Choose Our Cardiology Department Section */}
                <section className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Why Choose Our Cardiology Department?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 shadow-md">
                                {/* Heart icon */}
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Expert Cardiologists</h3>
                            <p className="text-gray-600 dark:text-gray-300">Leading heart specialists committed to your well-being.</p>
                        </div>
                        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 shadow-md">
                                {/* Stethoscope icon */}
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c0 2.871.823 5.462 2.258 7.648a12.07 12.07 0 0014.288 0c1.435-2.186 2.258-4.777 2.258-7.648a12.007 12.007 0 00-3.091-8.056z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Advanced Technology</h3>
                            <p className="text-gray-600 dark:text-gray-300">State-of-the-art equipment for precise diagnosis and treatment.</p>
                        </div>
                        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 shadow-md">
                                {/* Hands holding heart icon */}
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354c-1.189-2.071-4.73-2.071-5.918 0C4.908 5.753 3 8.358 3 12s1.908 6.247 3.082 7.646c1.188 1.399 4.729 1.399 5.918 0C13.092 18.642 15 16.037 15 12s-1.908-6.247-3.082-7.646z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10.5h.01M17 10.5h.01M7 10.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Compassionate Care</h3>
                            <p className="text-gray-600 dark:text-gray-300">A supportive environment focused on your comfort and recovery.</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action Footer */}
                <section className="text-center py-12 rounded-3xl bg-blue-600 dark:bg-blue-800 text-white shadow-xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prioritize Your Heart Health</h2>
                    <p className="text-lg mb-8">
                        Connect with our Cardiology Department today for expert care and peace of mind.
                    </p>
                    <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Contact Us
                    </button>
                </section>

                {/* Simple Footer */}
                <footer className="text-center text-gray-500 dark:text-gray-400 py-6">
                    <p>&copy; {new Date().getFullYear()} Our Cardiology Department. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
