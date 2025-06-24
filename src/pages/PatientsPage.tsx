import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiUser, FiCalendar, FiActivity, FiArrowRight, FiEdit2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';

// AI Assistant Component
const AIAssistant = ({ isActive, onToggle, onQuery }: { isActive: boolean, onToggle: () => void, onQuery: (query: string) => void }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    onQuery(query);
    
    // Simulate AI processing
    setTimeout(() => {
      setResponse(`I've analyzed the patient data. ${query.includes('trend') ? 
        'The most common condition is Hypertension, followed by Diabetes. Active patients have increased by 12% this month.' : 
        'Here are the relevant patient records matching your query.'}`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute right-4 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10"
        >
          <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <button onClick={onToggle} className="text-white hover:text-blue-200">
              &times;
            </button>
          </div>
          
          <div className="p-4 h-60 overflow-y-auto">
            {response ? (
              <div className="text-sm text-gray-700">
                <div className="flex items-start mb-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                    <FiUser className="h-4 w-4" />
                  </div>
                  <p>{query}</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full p-1 mr-2">
                    <FiActivity className="h-4 w-4" />
                  </div>
                  <p>{response}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="bg-blue-100 text-blue-800 rounded-full p-3 mb-3">
                  <FiActivity className="h-6 w-6" />
                </div>
                <p className="text-center text-sm">
                  {isProcessing ? 'Analyzing patient data...' : 'Ask me anything about your patients'}
                </p>
                {isProcessing && (
                  <div className="mt-2">
                    <PulseLoader size={8} color="#3b82f6" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t p-3">
            <div className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about patients..."
                className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isProcessing || !query}
              >
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Patient Card Component
const PatientCard = ({ patient, onView, onEdit }: { 
  patient: any, 
  onView: () => void, 
  onEdit: () => void 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
            ${patient.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}
          >
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{patient.name}</h3>
            <p className="text-xs text-gray-500">{patient.age} years • {patient.gender}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full 
            ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {patient.status}
          </span>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {patient.condition}
          </span>
          <div className="text-xs text-gray-500">
            Last visit: {patient.lastVisit}
          </div>
        </div>
      </div>
      
      <div className="border-t px-4 py-2 bg-gray-50 flex justify-end space-x-2">
        <button 
          onClick={onView}
          className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
        >
          <FiEye className="inline mr-1" /> View
        </button>
        <button 
          onClick={onEdit}
          className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
        >
          <FiEdit2 className="inline mr-1" /> Edit
        </button>
      </div>
    </motion.div>
  );
};

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAIActive, setIsAIActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  
  // Mock patient data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setPatients([
        {
          id: 1,
          name: "Sarah Johnson",
          age: 32,
          gender: "Female",
          lastVisit: "May 15, 2023",
          status: "Active",
          condition: "Hypertension"
        },
        {
          id: 2,
          name: "Michael Chen",
          age: 45,
          gender: "Male",
          lastVisit: "Jun 2, 2023",
          status: "Active",
          condition: "Diabetes"
        },
        {
          id: 3,
          name: "Emma Williams",
          age: 28,
          gender: "Female",
          lastVisit: "Apr 20, 2023",
          status: "Inactive",
          condition: "Asthma"
        },
        {
          id: 4,
          name: "David Kim",
          age: 60,
          gender: "Male",
          lastVisit: "Jun 10, 2023",
          status: "Active",
          condition: "Arthritis"
        },
        {
          id: 5,
          name: "Olivia Martinez",
          age: 38,
          gender: "Female",
          lastVisit: "Mar 15, 2023",
          status: "Inactive",
          condition: "Migraine"
        },
        {
          id: 6,
          name: "James Wilson",
          age: 52,
          gender: "Male",
          lastVisit: "Jun 5, 2023",
          status: "Active",
          condition: "Hypertension"
        },
        {
          id: 7,
          name: "Sophia Brown",
          age: 41,
          gender: "Female",
          lastVisit: "May 22, 2023",
          status: "Active",
          condition: "Diabetes"
        },
        {
          id: 8,
          name: "Robert Taylor",
          age: 35,
          gender: "Male",
          lastVisit: "Apr 30, 2023",
          status: "Inactive",
          condition: "Back Pain"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const patientsPerPage = viewMode === 'grid' ? 8 : 5;
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );
  
  const stats = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.status === 'Active').length,
    newThisMonth: 15,
    upcomingAppointments: 7
  };
  
  const handleAIAssistantQuery = (query: string) => {
    // In a real app, this would call an AI service
    console.log('AI Query:', query);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage and monitor your patients</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          
          <button 
            onClick={() => setIsAIActive(!isAIActive)}
            className={`p-2 rounded-lg ${isAIActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}
          >
            <FiActivity className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            {viewMode === 'grid' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>
          
          <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
            <FiPlus className="h-4 w-4" />
            <span className="hidden md:inline">Add Patient</span>
          </button>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          { 
            title: 'Total Patients', 
            value: stats.totalPatients, 
            change: '+12% from last month',
            icon: <FiUser className="h-5 w-5" />,
            color: 'bg-blue-100 text-blue-600'
          },
          { 
            title: 'Active Patients', 
            value: stats.activePatients, 
            change: '+8% from last month',
            icon: <FiActivity className="h-5 w-5" />,
            color: 'bg-green-100 text-green-600'
          },
          { 
            title: 'New This Month', 
            value: stats.newThisMonth, 
            change: '+3 from last month',
            icon: <FiPlus className="h-5 w-5" />,
            color: 'bg-purple-100 text-purple-600'
          },
          { 
            title: 'Upcoming Appointments', 
            value: stats.upcomingAppointments, 
            change: 'Today: 2 appointments',
            icon: <FiCalendar className="h-5 w-5" />,
            color: 'bg-yellow-100 text-yellow-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Patients List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <PulseLoader size={12} color="#3b82f6" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No patients found matching your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedPatients.map(patient => (
                  <PatientCard 
                    key={patient.id}
                    patient={patient}
                    onView={() => console.log('View', patient.id)}
                    onEdit={() => console.log('Edit', patient.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age/Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No patients found matching your search
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map(patient => (
                    <motion.tr 
                      key={patient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                            ${patient.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}
                          >
                            {patient.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">ID: {patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.age} years</div>
                        <div className="text-sm text-gray-500">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {patient.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.lastVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => console.log('View', patient.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEye className="inline mr-1" /> View
                        </button>
                        <button 
                          onClick={() => console.log('Edit', patient.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FiEdit2 className="inline mr-1" /> Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredPatients.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * patientsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * patientsPerPage, filteredPatients.length)}</span> of{' '}
                  <span className="font-medium">{filteredPatients.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                          ${currentPage === pageNum ? 
                            'z-10 bg-blue-50 border-blue-500 text-blue-600' : 
                            'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* AI Assistant */}
      <AIAssistant 
        isActive={isAIActive} 
        onToggle={() => setIsAIActive(false)}
        onQuery={handleAIAssistantQuery}
      />
    </div>
  );
}