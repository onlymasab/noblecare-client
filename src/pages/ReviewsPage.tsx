import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Star, MessageSquareText, ThumbsUp, TrendingUp, Users, Sparkles } from "lucide-react"; // Added Sparkles for AI icon
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';

// Define an interface for a Patient Review
interface PatientReview {
    id: string;
    quote: string;
    author: string;
    rating: number; // e.g., 5 for 5 stars
    date: string; // YYYY-MM-DD
}

export default function ReviewsPage() {
    // Dummy data for patient reviews with more varied dates for trend analysis
    const [reviews, setReviews] = useState<PatientReview[]>([
        { id: 'pr1', quote: "The cardiology team here is exceptional. Dr. Smith was incredibly thorough and compassionate. I felt completely at ease.", author: "Eleanor R.", rating: 5, date: '2024-06-18' },
        { id: 'pr2', quote: "From the moment I walked in, I knew I was in good hands. The staff is so caring, and the advanced technology gave me peace of mind.", author: "James P.", rating: 5, date: '2024-06-15' },
        { id: 'pr3', quote: "My experience was seamless. Scheduling was easy, and the care I received for my heart condition was top-notch. Highly recommend!", author: "Maria K.", rating: 4, date: '2024-06-12' },
        { id: 'pr4', quote: "I'm so grateful for the expertise of this department. They accurately diagnosed and treated my condition with great professionalism.", author: "Robert D.", rating: 5, date: '2024-06-10' },
        { id: 'pr5', quote: "The doctors were great, but the wait times were a bit long.", author: "Sophia L.", rating: 3, date: '2024-06-01' },
        { id: 'pr6', quote: "Excellent follow-up care and clear explanations. Very happy with the service.", author: "William B.", rating: 5, date: '2024-05-28' },
        { id: 'pr7', quote: "Could improve on communication regarding appointment changes.", author: "Olivia M.", rating: 2, date: '2024-05-25' },
        { id: 'pr8', quote: "Life-saving treatment, profound gratitude to the entire team.", author: "Noah J.", rating: 5, date: '2024-05-20' },
        { id: 'pr9', quote: "A little disappointed with the initial consultation, but subsequent visits were much better.", author: "Emma W.", rating: 3, date: '2024-05-15' },
        { id: 'pr10', quote: "The best cardiology department, truly caring and professional.", author: "Liam T.", rating: 5, date: '2024-05-10' },
        { id: 'pr11', quote: "The front desk staff was a bit unhelpful.", author: "Ava F.", rating: 2, date: '2024-04-28' },
        { id: 'pr12', quote: "Very detailed explanation of my condition and treatment plan.", author: "Mason G.", rating: 4, date: '2024-04-20' },
        { id: 'pr13', quote: "Good overall, but parking was an issue.", author: "Chloe S.", rating: 3, date: '2024-04-15' },
        { id: 'pr14', quote: "Outstanding care from start to finish. Highly recommend.", author: "Ethan K.", rating: 5, date: '2024-04-10' },
        { id: 'pr15', quote: "The nurse was very kind and made me feel comfortable.", author: "Harper P.", rating: 4, date: '2024-03-25' },
        { id: 'pr16', quote: "Diagnosis was quick and treatment effective.", author: "Aiden N.", rating: 5, date: '2024-03-20' },
        { id: 'pr17', quote: "Long wait times in the waiting room.", author: "Sofia R.", rating: 2, date: '2024-03-10' },
        { id: 'pr18', quote: "Grateful for the thorough check-up.", author: "Logan V.", rating: 5, date: '2024-02-15' },
    ]);

    // --- Analytics Calculations ---
    const { averageRating, totalReviews, fiveStarCount, ratingDistribution, reviewsOverTimeData, positiveSentimentPercentage } = useMemo(() => {
        const total = reviews.length;
        const sumRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avg = total > 0 ? (sumRatings / total) : 0;

        // Rating Distribution
        const distribution = Array(5).fill(0); // [0, 0, 0, 0, 0] for 1 to 5 stars
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });
        const chartData = distribution.map((count, index) => ({
            name: `${index + 1} Star${index === 0 ? '' : 's'}`,
            Reviews: count,
        })).reverse(); // Reverse to show 5 stars first

        // Reviews Over Time (Monthly aggregation for simplicity)
        const monthlyReviewsMap = new Map<string, number>();
        reviews.forEach(review => {
            const month = review.date.substring(0, 7); // YYYY-MM
            monthlyReviewsMap.set(month, (monthlyReviewsMap.get(month) || 0) + 1);
        });
        const sortedMonths = Array.from(monthlyReviewsMap.keys()).sort();
        const reviewsOverTimeData = sortedMonths.map(month => ({
            name: month,
            Reviews: monthlyReviewsMap.get(month),
        }));

        // Simple Sentiment Analysis (Placeholder based on rating)
        // In a real app, you'd use NLP for actual sentiment from `quote`
        const positiveReviews = reviews.filter(review => review.rating >= 4).length;
        const positivePercent = total > 0 ? (positiveReviews / total) * 100 : 0;


        return {
            averageRating: avg.toFixed(1),
            totalReviews: total,
            fiveStarCount: distribution[4], // Index 4 is for 5 stars
            ratingDistribution: chartData,
            reviewsOverTimeData: reviewsOverTimeData,
            positiveSentimentPercentage: positivePercent.toFixed(1),
        };
    }, [reviews]);

    // Function to render star rating SVG icons
    const renderStars = (rating: number) => {
        return (
            <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
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

    // AI Star Animation Component
    const AiStarAnimation = () => (
        <svg className="w-10 h-10 text-blue-500 animate-pulse-custom" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <style >{`
                @keyframes pulse-custom {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }
                .animate-pulse-custom {
                    animation: pulse-custom 2s infinite ease-in-out;
                }
            `}</style>
            <path d="M12 2L9.19 8.63L2 9.24L7.54 13.5L5.82 20.5L12 17.27L18.18 20.5L16.46 13.5L22 9.24L14.81 8.63L12 2Z" />
        </svg>
    );

    return (
        // The main container now assumes it's within a padded layout (like your MainLayout's <Outlet /> div)
        // Removed header as requested. Background set here.
        <div className="flex flex-col flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-900 text-gray-900 dark:text-gray-100 font-inter rounded-lg overflow-auto p-4 md:p-6 lg:p-8">
            <div className="container mx-auto max-w-full flex flex-col gap-6">

                {/* Grid for Key Metrics and Analytics Charts */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Row: Key Metrics Cards (spanning 2 columns on large screens) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</CardTitle>
                                <Star className="h-5 w-5 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{averageRating} / 5.0</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Based on {totalReviews} reviews</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</CardTitle>
                                <MessageSquareText className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalReviews}</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Across all patients</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">5-Star Reviews</CardTitle>
                                <ThumbsUp className="h-5 w-5 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{fiveStarCount}</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{((fiveStarCount / totalReviews) * 100 || 0).toFixed(1)}% of total</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Positive Sentiment</CardTitle>
                                <TrendingUp className="h-5 w-5 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{positiveSentimentPercentage}%</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Of high-rated reviews</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI-Powered Insights Card (spanning 1 column on large screens) */}
                    <Card className="rounded-xl shadow-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900 p-6 flex flex-col items-center justify-center text-center">
                        <AiStarAnimation />
                        <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-4 mb-2">AI Insights</CardTitle>
                        <CardDescription className="text-center text-blue-600 dark:text-blue-400 text-sm">
                            Harnessing AI to understand patient feedback trends and key areas for improvement.
                        </CardDescription>
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300">
                            Explore Trends
                        </Button>
                    </Card>
                </section>

                {/* Charts Section: Rating Distribution and Reviews Over Time */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                    {/* Rating Distribution Chart */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={ratingDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" allowDecimals={false} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ color: '#333', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#555' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Reviews" fill="#6366F1" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Reviews Over Time Chart */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Reviews Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={reviewsOverTimeData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" allowDecimals={false} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ color: '#333', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#555' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="Reviews" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </section>

                {/* Recent Patient Testimonials Section - now a larger, dedicated scrollable card */}
                <section>
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Latest Patient Testimonials</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto custom-scrollbar h-[400px] lg:h-[500px]"> {/* Adjusted height for better scrolling */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {reviews.map((review) => ( // Display all reviews here
                                    <Card
                                        key={review.id}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm p-4 flex flex-col justify-between border border-gray-200 dark:border-gray-600"
                                    >
                                        {renderStars(review.rating)}
                                        <p className="text-sm italic mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                                            "{review.quote}"
                                        </p>
                                        <div className="w-full text-left mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <p className="font-semibold text-blue-600 dark:text-blue-400 text-base">- {review.author}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            {reviews.length === 0 && (
                                <p className="text-center text-gray-500 mt-8">No reviews available.</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

            </div>
            {/* Custom Scrollbar CSS */}
            <style>{`
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
