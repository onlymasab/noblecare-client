
// Define an interface for a Massage Service
interface MassageService {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string; // Placeholder for image URL
    altText: string;
}

// Define an interface for a Testimonial
interface Testimonial {
    id: string;
    quote: string;
    author: string;
    rating: number; // e.g., 5 for 5 stars
}

export default function MassagesPage() {
    // Dummy data for massage services
    const services: MassageService[] = [
        {
            id: '1',
            name: 'Swedish Massage',
            description: 'A gentle, relaxing massage using long strokes, kneading, deep circular movements, vibration, and tapping.',
            price: '$75 / 60 min',
            imageUrl: 'https://placehold.co/400x300/a3e635/000?text=Swedish+Massage', // Placeholder image
            altText: 'Person receiving a relaxing Swedish massage',
        },
        {
            id: '2',
            name: 'Deep Tissue Massage',
            description: 'Focuses on realigning deeper layers of muscles and connective tissue. Ideal for chronic aches and pains.',
            price: '$90 / 60 min',
            imageUrl: 'https://placehold.co/400x300/818cf8/000?text=Deep+Tissue', // Placeholder image
            altText: 'Close up of hands performing deep tissue massage',
        },
        {
            id: '3',
            name: 'Hot Stone Massage',
            description: 'Heated, smooth stones are placed on specific points on the body to warm and relax muscles, allowing for deeper pressure.',
            price: '$95 / 75 min',
            imageUrl: 'https://placehold.co/400x300/fde047/000?text=Hot+Stone', // Placeholder image
            altText: 'Hot stones placed on a person\'s back',
        },
        {
            id: '4',
            name: 'Aromatherapy Massage',
            description: 'Combines soft, gliding strokes with the use of essential oils to enhance relaxation and address specific needs.',
            price: '$80 / 60 min',
            imageUrl: 'https://placehold.co/400x300/93c5fd/000?text=Aromatherapy', // Placeholder image
            altText: 'Aromatherapy oils and flowers next to a massage setup',
        },
        {
            id: '5',
            name: 'Sports Massage',
            description: 'Designed for athletes of every kind. Focuses on preventing and treating injury and enhancing athletic performance.',
            price: '$85 / 60 min',
            imageUrl: 'https://placehold.co/400x300/c084fc/000?text=Sports+Massage', // Placeholder image
            altText: 'Athlete\'s leg receiving a sports massage',
        },
        {
            id: '6',
            name: 'Prenatal Massage',
            description: 'Gentle and nurturing massage for expectant mothers, alleviating pregnancy discomforts and promoting relaxation.',
            price: '$80 / 60 min',
            imageUrl: 'https://placehold.co/400x300/fda47a/000?text=Prenatal', // Placeholder image
            altText: 'Pregnant woman receiving a massage',
        },
    ];

    // Dummy data for testimonials
    const testimonials: Testimonial[] = [
        {
            id: 't1',
            quote: "Absolutely incredible experience! I felt so relaxed and refreshed after my deep tissue massage. Highly recommend!",
            author: "Sarah J.",
            rating: 5
        },
        {
            id: 't2',
            quote: "The Swedish massage was pure bliss. The therapist was professional and the ambiance was perfect. I'll be back!",
            author: "Mark T.",
            rating: 5
        },
        {
            id: 't3',
            quote: "As an athlete, the sports massage helped me recover faster and improved my flexibility. Top-notch service!",
            author: "David L.",
            rating: 4
        }
    ];

    // Function to render star rating
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

    return (
        <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-blue-950 text-gray-900 dark:text-gray-100 min-h-screen font-inter">
            {/* Tailwind's `@apply` for a custom font could be added in CSS */}
            {/* Example of adding Inter font via global CSS or public/index.html */}
            {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}

            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-12 md:gap-16">
                {/* Hero Section */}
                <section className="text-center py-16 sm:py-20 lg:py-24 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-blue-100 dark:border-blue-900">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 tracking-tight leading-tight">
                        Experience Ultimate Relaxation
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Rejuvenate your mind, body, and spirit with our expert massage therapies.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                        Book Your Massage Now
                    </button>
                </section>

                {/* Our Services Section */}
                <section className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Our Signature Massages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl border border-gray-100 dark:border-gray-700"
                            >
                                <img
                                    src={service.imageUrl}
                                    alt={service.altText}
                                    className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
                                    onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/cccccc/000?text=Image+Error`; }} // Fallback
                                />
                                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-center mb-4 flex-grow">
                                    {service.description}
                                </p>
                                <div className="mt-auto w-full"> {/* Ensure button is at bottom */}
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                                        {service.price}
                                    </p>
                                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800">
                                        Learn More & Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us / Benefits Section */}
                <section className="bg-blue-50 dark:bg-blue-900 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 text-center mb-8">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 shadow-md">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Flexible Scheduling</h3>
                            <p className="text-gray-600 dark:text-gray-300">Book at your convenience with easy online scheduling.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 shadow-md">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.002 2.002A3.992 3.992 0 0118 7V5c0-1.105-.895-2-2-2h-5c-1.105 0-2 .895-2 2v2a3.992 3.992 0 01-2.002 2.002L5 12"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Certified Therapists</h3>
                            <p className="text-gray-600 dark:text-gray-300">Experienced and highly trained professionals committed to your well-being.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 shadow-md">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Serene Environment</h3>
                            <p className="text-gray-600 dark:text-gray-300">A peaceful and calming atmosphere designed for your ultimate escape.</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">What Our Clients Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between items-center border border-gray-100 dark:border-gray-700"
                            >
                                {renderStars(testimonial.rating)}
                                <p className="text-gray-700 dark:text-gray-300 italic mb-4 mt-2">
                                    "{testimonial.quote}"
                                </p>
                                <p className="font-semibold text-blue-600 dark:text-blue-400">- {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action Footer */}
                <section className="text-center py-12 rounded-3xl bg-blue-600 dark:bg-blue-800 text-white shadow-xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Relax?</h2>
                    <p className="text-lg mb-8">Book your personalized massage session today and embark on a journey of tranquility.</p>
                    <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Schedule Your Appointment
                    </button>
                </section>

                {/* Simple Footer (Optional) */}
                <footer className="text-center text-gray-500 dark:text-gray-400 py-6">
                    <p>&copy; {new Date().getFullYear()} Our Massage Spa. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
