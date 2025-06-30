"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Star, MessageSquareText, ThumbsUp, TrendingUp, Sparkles, ChevronRight, Filter, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientReview {
    id: string;
    quote: string;
    author: string;
    rating: number;
    date: string;
    department: string;
    helpfulCount: number;
    verified?: boolean;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<PatientReview[]>([
        { 
            id: 'pr1', 
            quote: "The cardiology team here is exceptional. Dr. Smith was incredibly thorough and compassionate. I felt completely at ease.", 
            author: "Eleanor R.", 
            rating: 5, 
            date: '2024-06-18',
            department: "Cardiology",
            helpfulCount: 12,
            verified: true
        },
        { 
            id: 'pr2', 
            quote: "From the moment I walked in, I knew I was in good hands. The staff is so caring, and the advanced technology gave me peace of mind.", 
            author: "James P.", 
            rating: 5, 
            date: '2024-06-15',
            department: "Neurology",
            helpfulCount: 8,
            verified: true
        },
        { 
            id: 'pr3', 
            quote: "My experience was seamless. Scheduling was easy, and the care I received for my heart condition was top-notch. Highly recommend!", 
            author: "Maria K.", 
            rating: 4, 
            date: '2024-06-12',
            department: "Cardiology",
            helpfulCount: 5
        },
        { 
            id: 'pr4', 
            quote: "I'm so grateful for the expertise of this department. They accurately diagnosed and treated my condition with great professionalism.", 
            author: "Robert D.", 
            rating: 5, 
            date: '2024-06-10',
            department: "Oncology",
            helpfulCount: 15,
            verified: true
        },
        { 
            id: 'pr5', 
            quote: "The doctors were great, but the wait times were a bit long.", 
            author: "Sophia L.", 
            rating: 3, 
            date: '2024-06-01',
            department: "Pediatrics",
            helpfulCount: 2
        },
        { 
            id: 'pr6', 
            quote: "Excellent follow-up care and clear explanations. Very happy with the service.", 
            author: "William B.", 
            rating: 5, 
            date: '2024-05-28',
            department: "Cardiology",
            helpfulCount: 7
        },
        { 
            id: 'pr7', 
            quote: "Could improve on communication regarding appointment changes.", 
            author: "Olivia M.", 
            rating: 2, 
            date: '2024-05-25',
            department: "Orthopedics",
            helpfulCount: 1
        },
        { 
            id: 'pr8', 
            quote: "Life-saving treatment, profound gratitude to the entire team.", 
            author: "Noah J.", 
            rating: 5, 
            date: '2024-05-20',
            department: "Emergency",
            helpfulCount: 20,
            verified: true
        },
    ]);

    // State for filters and sorting
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

    // Get unique departments for filter
    const departments = useMemo(() => {
        const depts = new Set(reviews.map(review => review.department));
        return Array.from(depts).sort();
    }, [reviews]);

    // Filter and sort reviews
    const filteredReviews = useMemo(() => {
        let result = [...reviews];
        
        // Apply rating filter
        if (ratingFilter !== null) {
            result = result.filter(review => review.rating === ratingFilter);
        }
        
        // Apply department filter
        if (departmentFilter) {
            result = result.filter(review => review.department === departmentFilter);
        }
        
        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return sortDirection === 'asc' 
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (sortBy === 'rating') {
                return sortDirection === 'asc' 
                    ? a.rating - b.rating
                    : b.rating - a.rating;
            } else { // helpful
                return sortDirection === 'asc' 
                    ? a.helpfulCount - b.helpfulCount
                    : b.helpfulCount - a.helpfulCount;
            }
        });
        
        return result;
    }, [reviews, ratingFilter, departmentFilter, sortBy, sortDirection]);

    // Analytics calculations
    const { averageRating, totalReviews, fiveStarCount, ratingDistribution, reviewsOverTimeData, positiveSentimentPercentage } = useMemo(() => {
        const total = filteredReviews.length;
        const sumRatings = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
        const avg = total > 0 ? (sumRatings / total) : 0;

        // Rating Distribution
        const distribution = Array(5).fill(0);
        filteredReviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });
        const chartData = distribution.map((count, index) => ({
            name: `${index + 1} Star${index === 0 ? '' : 's'}`,
            Reviews: count,
        })).reverse();

        // Reviews Over Time (Monthly)
        const monthlyReviewsMap = new Map<string, number>();
        filteredReviews.forEach(review => {
            const month = review.date.substring(0, 7); // YYYY-MM
            monthlyReviewsMap.set(month, (monthlyReviewsMap.get(month) || 0) + 1);
        });
        const sortedMonths = Array.from(monthlyReviewsMap.keys()).sort();
        const reviewsOverTimeData = sortedMonths.map(month => ({
            name: month,
            Reviews: monthlyReviewsMap.get(month),
        }));

        // Sentiment Analysis
        const positiveReviews = filteredReviews.filter(review => review.rating >= 4).length;
        const positivePercent = total > 0 ? (positiveReviews / total) * 100 : 0;

        return {
            averageRating: avg.toFixed(1),
            totalReviews: total,
            fiveStarCount: distribution[4],
            ratingDistribution: chartData,
            reviewsOverTimeData: reviewsOverTimeData,
            positiveSentimentPercentage: positivePercent.toFixed(1),
        };
    }, [filteredReviews]);

    const renderStars = (rating: number, size = 4) => {
        return (
            <div className={`flex`}>
                {Array.from({ length: 5 }, (_, i) => (
                    <svg
                        key={i}
                        className={`w-${size} h-${size} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600 fill-current'}`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.691h4.17c.969 0 1.371 1.24.588 1.81l-3.373 2.45a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.373-2.45a1 1 0 00-1.176 0l-3.373 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.385c-.783-.57-.381-1.81.588-1.81h4.17a1 1 0 00.95-.691l1.286-3.957z" />
                    </svg>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleHelpfulClick = (reviewId: string) => {
        if (helpfulClicked.has(reviewId)) return;
        
        setReviews(prevReviews => 
            prevReviews.map(review => 
                review.id === reviewId 
                    ? { ...review, helpfulCount: review.helpfulCount + 1 }
                    : review
            )
        );
        
        setHelpfulClicked(prev => new Set(prev).add(reviewId));
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const clearFilters = () => {
        setRatingFilter(null);
        setDepartmentFilter(null);
    };

    return (
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans rounded-lg overflow-auto p-4 md:p-6 lg:p-8">
            <div className="container mx-auto max-w-full flex flex-col gap-8">

                {/* Header with Summary */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Reviews</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {totalReviews} reviews with an average rating of {averageRating} out of 5
                        </p>
                    </div>
                </div>

                {/* Rating Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Rating</CardTitle>
                            <Star className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating}</div>
                            <div className="flex items-center mt-1">
                                {renderStars(Number(averageRating), 5)}
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ 5.0</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</CardTitle>
                            <MessageSquareText className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalReviews}</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Patient feedback</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">5-Star Reviews</CardTitle>
                            <ThumbsUp className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{fiveStarCount}</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {totalReviews > 0 ? ((fiveStarCount / totalReviews) * 100).toFixed(1) : 0}% of total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Positive Feedback</CardTitle>
                            <TrendingUp className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{positiveSentimentPercentage}%</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Positive experiences</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Reviews */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Review Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">Filters:</span>
                            </div>
                            
                            <Button 
                                variant={ratingFilter === null ? "outline" : "default"}
                                className="rounded-full px-4 py-2 text-sm"
                                onClick={() => setRatingFilter(null)}
                            >
                                All Ratings
                            </Button>
                            
                            {[5, 4, 3, 2, 1].map(rating => (
                                <Button
                                    key={rating}
                                    variant={ratingFilter === rating ? "default" : "outline"}
                                    className="rounded-full px-4 py-2 text-sm flex items-center gap-1"
                                    onClick={() => setRatingFilter(rating)}
                                >
                                    {renderStars(rating, 3)}
                                    <span>{rating}</span>
                                </Button>
                            ))}
                            
                            <Select value={departmentFilter || ""} onValueChange={val => setDepartmentFilter(val || null)}>
                                <SelectTrigger className="w-[180px] rounded-full">
                                    <div className="flex items-center gap-2">
                                        <span>{departmentFilter ? departmentFilter : "All Departments"}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {(ratingFilter !== null || departmentFilter) && (
                                <Button 
                                    variant="ghost" 
                                    className="text-sm text-blue-600 dark:text-blue-400"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                        
                        {/* Sort Controls */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {filteredReviews.length} of {reviews.length} reviews
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                                <Select value={sortBy} onValueChange={val => setSortBy(val as 'date' | 'rating' | 'helpful')}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="helpful">Helpful</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-9 w-9"
                                    onClick={toggleSortDirection}
                                >
                                    {sortDirection === 'asc' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m3 16 4 4 4-4" />
                                            <path d="M7 20V4" />
                                            <path d="m21 8-4-4-4 4" />
                                            <path d="M17 4v16" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m21 16-4 4-4-4" />
                                            <path d="M17 20V4" />
                                            <path d="m3 8 4-4 4 4" />
                                            <path d="M7 4v16" />
                                        </svg>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <Card key={review.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    {renderStars(review.rating, 5)}
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(review.date)}
                                                    </span>
                                                    {review.verified && (
                                                        <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                <path d="m9 11 3 3L22 4" />
                                                            </svg>
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full mt-2">
                                                    {review.department}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        <CardContent className="p-0 mt-4">
                                            <p className="text-gray-800 dark:text-gray-200">
                                                "{review.quote}"
                                            </p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="font-medium text-gray-900 dark:text-white">- {review.author}</p>
                                                <Button 
                                                    variant={helpfulClicked.has(review.id) ? "default" : "outline"}
                                                    size="sm" 
                                                    className="rounded-full"
                                                    onClick={() => handleHelpfulClick(review.id)}
                                                    disabled={helpfulClicked.has(review.id)}
                                                >
                                                    Helpful ({review.helpfulCount})
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No reviews match your filters.</p>
                                    <Button 
                                        variant="ghost" 
                                        className="mt-2 text-blue-600 dark:text-blue-400"
                                        onClick={clearFilters}
                                    >
                                        Clear filters
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Analytics */}
                    <div className="space-y-6">
                        {/* Rating Distribution */}
                        <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <CardHeader className="p-0">
                                <CardTitle className="text-lg font-semibold">Rating Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ratingDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b7280' }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b7280' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                border: '1px solid #e5e7eb'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="Reviews" 
                                            fill="#3b82f6" 
                                            radius={[4, 4, 0, 0]} 
                                            barSize={24}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* AI Insights */}
                        <Card className="rounded-xl border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-900 p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                        AI-Powered Insights
                                    </CardTitle>
                                    <CardDescription className="text-blue-800 dark:text-blue-200 mt-2">
                                        {filteredReviews.length > 0 ? (
                                            <>
                                                Our analysis shows {positiveSentimentPercentage}% of recent reviews are positive.
                                                {filteredReviews.some(r => r.department === "Cardiology") && " Cardiology receives the most praise."}
                                            </>
                                        ) : "Apply filters to see insights about specific reviews."}
                                    </CardDescription>
                                    <Button 
                                        variant="ghost" 
                                        className="mt-4 text-blue-600 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50"
                                    >
                                        View detailed analysis
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Reviews Over Time */}
                        <Card className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <CardHeader className="p-0">
                                <CardTitle className="text-lg font-semibold">Reviews Over Time</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={reviewsOverTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b7280' }}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b7280' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                border: '1px solid #e5e7eb'
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="Reviews" 
                                            stroke="#3b82f6" 
                                            strokeWidth={2} 
                                            dot={{ r: 4 }} 
                                            activeDot={{ r: 6, stroke: '#1d4ed8' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}