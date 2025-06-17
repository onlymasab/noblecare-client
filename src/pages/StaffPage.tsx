import React from 'react';

// Define an interface for a Staff Member
interface StaffMember {
    id: string;
    name: string;
    title: string;
    specialty?: string; // Optional for doctors
    imageUrl: string; // Placeholder for image URL
    altText: string;
    bio: string;
}

export default function StaffPage() {
    // Dummy data for cardiology department staff members
    const staffMembers: StaffMember[] = [
        {
            id: 'd1',
            name: 'Dr. Eleanor Vance',
            title: 'Chief Cardiologist',
            specialty: 'Interventional Cardiology',
            imageUrl: 'https://placehold.co/400x400/94a3b8/000?text=Dr.+Vance', // Placeholder image
            altText: 'Dr. Eleanor Vance, Chief Cardiologist',
            bio: 'Dr. Vance is a highly respected expert in interventional cardiology with over 20 years of experience. She is dedicated to innovative treatments and patient well-being.',
        },
        {
            id: 'd2',
            name: 'Dr. Marcus Chen',
            title: 'Senior Cardiologist',
            specialty: 'Electrophysiology',
            imageUrl: 'https://placehold.co/400x400/94a3b8/000?text=Dr.+Chen', // Placeholder image
            altText: 'Dr. Marcus Chen, Senior Cardiologist',
            bio: 'Specializing in electrophysiology, Dr. Chen is at the forefront of diagnosing and treating heart rhythm disorders. His research contributes significantly to cardiac science.',
        },
        {
            id: 'd3',
            name: 'Dr. Sophia Ramirez',
            title: 'Pediatric Cardiologist',
            specialty: 'Pediatric Cardiology',
            imageUrl: 'https://placehold.co/400x400/94a3b8/000?text=Dr.+Ramirez', // Placeholder image
            altText: 'Dr. Sophia Ramirez, Pediatric Cardiologist',
            bio: 'Dr. Ramirez brings compassionate and specialized care to our youngest patients, focusing on congenital heart defects and pediatric cardiac health.',
        },
        {
            id: 'n1',
            name: 'Nurse Emily White',
            title: 'Lead Cardiac Nurse',
            imageUrl: 'https://placehold.co/400x400/a78bfa/000?text=Nurse+Emily', // Placeholder image
            altText: 'Nurse Emily White, Lead Cardiac Nurse',
            bio: 'Emily is an invaluable member of our team, providing exceptional pre- and post-operative care and patient education with a warm, comforting approach.',
        },
        {
            id: 'n2',
            name: 'Nurse David Kim',
            title: 'Cardiac Intensive Care Nurse',
            imageUrl: 'https://placehold.co/400x400/a78bfa/000?text=Nurse+David', // Placeholder image
            altText: 'Nurse David Kim, Cardiac Intensive Care Nurse',
            bio: 'David specializes in critical care for cardiac patients, ensuring vigilant monitoring and rapid response in the most sensitive situations.',
        },
        {
            id: 'a1',
            name: 'Sarah Brooks',
            title: 'Patient Coordinator',
            imageUrl: 'https://placehold.co/400x400/fbbf24/000?text=Sarah+Brooks', // Placeholder image
            altText: 'Sarah Brooks, Patient Coordinator',
            bio: 'Sarah is your first point of contact, helping patients navigate appointments, insurance, and ensuring a smooth experience from start to finish.',
        },
    ];

    return (
        <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-900 text-gray-900 dark:text-gray-100 min-h-screen font-inter">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-12 md:gap-16">
                {/* Hero Section */}
                <section className="text-center py-16 sm:py-20 lg:py-24 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-blue-100 dark:border-blue-900">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 tracking-tight leading-tight">
                        Meet Our Dedicated Cardiology Team
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Our team of expert cardiologists, nurses, and support staff is committed to providing compassionate and advanced heart care.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                        Learn More About Our Clinic
                    </button>
                </section>

                {/* Our Team Section */}
                <section className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12">Our Specialists & Support Staff</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {staffMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100 dark:border-gray-700"
                            >
                                <img
                                    src={member.imageUrl}
                                    alt={member.altText}
                                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-md border-4 border-blue-100 dark:border-blue-700"
                                    onError={(e) => { e.currentTarget.src = `https://placehold.co/400x400/cccccc/000?text=Staff+Image`; }} // Fallback
                                />
                                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
                                    {member.title}
                                </p>
                                {member.specialty && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                        Specialty: <span className="font-medium">{member.specialty}</span>
                                    </p>
                                )}
                                <p className="text-gray-600 dark:text-gray-300 text-base flex-grow">
                                    {member.bio}
                                </p>
                                {/* Optional: Add a 'View Profile' button */}
                                {/* <button className="mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg text-sm transition duration-200">
                                    View Profile
                                </button> */}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our Philosophy Section */}
                <section className="bg-blue-50 dark:bg-blue-900 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 text-center mb-8">Our Collaborative Approach to Heart Care</h2>
                    <div className="max-w-4xl mx-auto text-center text-lg text-gray-700 dark:text-gray-300 space-y-4">
                        <p>
                            At our Cardiology Department, we believe in a holistic and patient-centered approach. Our multidisciplinary team works seamlessly together, leveraging diverse expertise to create personalized treatment plans.
                        </p>
                        <p>
                            From diagnosis to recovery, we prioritize clear communication, compassionate support, and the most advanced medical techniques to ensure the best possible outcomes for every patient. Your health and peace of mind are our utmost priority.
                        </p>
                    </div>
                </section>

                {/* Call to Action Footer */}
                <section className="text-center py-12 rounded-3xl bg-blue-600 dark:bg-blue-800 text-white shadow-xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Connect?</h2>
                    <p className="text-lg mb-8">
                        Our friendly team is here to answer your questions and help you schedule an appointment.
                    </p>
                    <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Contact Our Team
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
