import React, { useState } from 'react';

interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: 'Cardiology' | 'Radiology' | 'Neurology' | 'Administration';
  specialty?: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  imageUrl: string;
  bio: string;
}

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'doctors' | 'nurses' | 'admin'>('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const staffMembers: StaffMember[] = [
    {
      id: 'd1',
      name: 'Dr. Eleanor Vance',
      title: 'Chief Cardiologist',
      department: 'Cardiology',
      specialty: 'Interventional Cardiology',
      email: 'evance@cardiohospital.org',
      phone: '(555) 123-4567',
      status: 'Active',
      imageUrl: 'https://placehold.co/400x400/94a3b8/000?text=Dr.+Vance',
      bio: '20+ years experience in interventional cardiology. Specializes in complex coronary interventions.'
    },
    {
      id: 'd2',
      name: 'Dr. Marcus Chen',
      title: 'Senior Cardiologist',
      department: 'Cardiology',
      specialty: 'Electrophysiology',
      email: 'mchen@cardiohospital.org',
      phone: '(555) 123-4568',
      status: 'Active',
      imageUrl: 'https://placehold.co/400x400/94a3b8/000?text=Dr.+Chen',
      bio: 'Specializes in heart rhythm disorders and advanced ablation techniques.'
    },
    {
      id: 'n1',
      name: 'Emily White',
      title: 'Lead Cardiac Nurse',
      department: 'Cardiology',
      email: 'ewhite@cardiohospital.org',
      phone: '(555) 123-4570',
      status: 'Active',
      imageUrl: 'https://placehold.co/400x400/a78bfa/000?text=Nurse+Emily',
      bio: 'Provides exceptional pre- and post-operative care with 15 years of cardiac nursing experience.'
    },
    {
      id: 'n2',
      name: 'David Kim',
      title: 'Cardiac Intensive Care Nurse',
      department: 'Cardiology',
      email: 'dkim@cardiohospital.org',
      phone: '(555) 123-4571',
      status: 'Active',
      imageUrl: 'https://placehold.co/400x400/a78bfa/000?text=Nurse+David',
      bio: 'Specializes in critical care for cardiac patients with expertise in hemodynamic monitoring.'
    },
    {
      id: 'a1',
      name: 'Sarah Brooks',
      title: 'Patient Coordinator',
      department: 'Administration',
      email: 'sbrooks@cardiohospital.org',
      phone: '(555) 123-4572',
      status: 'Active',
      imageUrl: 'https://placehold.co/400x400/fbbf24/000?text=Sarah+Brooks',
      bio: 'Helps patients navigate appointments, insurance, and ensures smooth clinic experience.'
    }
  ];

  const filteredStaff = staffMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'doctors' && member.title.includes('Dr.')) ||
      (selectedCategory === 'nurses' && member.title.includes('Nurse')) ||
      (selectedCategory === 'admin' && member.department === 'Administration');
    
    return matchesSearch && matchesCategory;
  });

  const doctors = filteredStaff.filter(m => m.title.includes('Dr.'));
  const nurses = filteredStaff.filter(m => m.title.includes('Nurse'));
  const admin = filteredStaff.filter(m => m.department === 'Administration');

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search staff by name or title..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            All Staff
          </button>
          <button
            onClick={() => setSelectedCategory('doctors')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === 'doctors' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Doctors
          </button>
          <button
            onClick={() => setSelectedCategory('nurses')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === 'nurses' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Nurses
          </button>
          <button
            onClick={() => setSelectedCategory('admin')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Doctors Section */}
      {doctors.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">Cardiology Physicians</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <StaffCard 
                key={doctor.id} 
                member={doctor} 
                onClick={() => setSelectedStaff(doctor)}
                badgeColor="bg-blue-100 text-blue-800"
              />
            ))}
          </div>
        </section>
      )}

      {/* Nurses Section */}
      {nurses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">Nursing Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nurses.map(nurse => (
              <StaffCard 
                key={nurse.id} 
                member={nurse} 
                onClick={() => setSelectedStaff(nurse)}
                badgeColor="bg-purple-100 text-purple-800"
              />
            ))}
          </div>
        </section>
      )}

      {/* Admin Section */}
      {admin.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">Administrative Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admin.map(admin => (
              <StaffCard 
                key={admin.id} 
                member={admin} 
                onClick={() => setSelectedStaff(admin)}
                badgeColor="bg-amber-100 text-amber-800"
              />
            ))}
          </div>
        </section>
      )}

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h3>
                  <p className="text-lg text-gray-600">{selectedStaff.title}</p>
                  {selectedStaff.specialty && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedStaff.specialty}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedStaff(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <img 
                    src={selectedStaff.imageUrl} 
                    alt={selectedStaff.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Bio</h4>
                      <p className="text-gray-600">{selectedStaff.bio}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Contact</h4>
                      <p className="text-gray-600">{selectedStaff.email}</p>
                      <p className="text-gray-600">{selectedStaff.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Status</h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedStaff.status === 'Active' ? 'bg-green-100 text-green-800' :
                        selectedStaff.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedStaff.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffCard({ member, onClick, badgeColor }: { 
  member: StaffMember, 
  onClick: () => void,
  badgeColor: string
}) {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <img 
            src={member.imageUrl} 
            alt={member.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 mb-4"
          />
          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
          <p className="text-gray-600 mb-2">{member.title}</p>
          {member.specialty && (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColor} mb-3`}>
              {member.specialty}
            </span>
          )}
          <p className="text-gray-500 text-sm line-clamp-2">{member.bio}</p>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
          member.status === 'Active' ? 'bg-green-100 text-green-800' :
          member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {member.status}
        </span>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
}