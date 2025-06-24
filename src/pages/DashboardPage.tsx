"use client"; // Important for shadcn/ui components that rely on client-side interactivity

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"; // Assuming you have a Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // For date picker
import { format } from "date-fns";
import {
    CalendarIcon, TrendingUp, DollarSign, Wallet, Percent, Banknote, Users,
    BarChart as BarChartIcon, MessageSquareText, ThumbsUp, Star, Sparkles, TrendingDown, HeartPulse, Stethoscope // Added cardiology specific icons
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

// Dummy data for dashboard metrics
interface DashboardMetric {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    description: string;
    icon: React.ElementType; // Lucide icon component
    valueColor?: string; // Tailwind color class for value
}

// Data for Total Visitors/Patients - hardcoded for demo
const totalVisitorsData = [
    { name: 'Jan', count: 400 },
    { name: 'Feb', count: 450 },
    { name: 'Mar', count: 420 },
    { name: 'Apr', count: 500 },
    { name: 'May', count: 480 },
    { name: 'Jun', count: 550 },
    { name: 'Jul', count: 600 },
];

// Dummy data for general data table - hardcoded for demo
interface DataTableRow {
    id: string;
    item: string;
    status: string;
    amount: number;
    date: string;
}

const generalTableData: DataTableRow[] = [
    { id: 'dt1', item: 'New Patient Onboarding', status: 'Completed', amount: 1200.00, date: '2024-06-20' },
    { id: 'dt2', item: 'Q2 Performance Report', status: 'Pending Review', amount: 0, date: '2024-06-18' },
    { id: 'dt3', item: 'Supplier Payment', status: 'Paid', amount: -500.00, date: '2024-06-15' },
    { id: 'dt4', item: 'Equipment Maintenance', status: 'Scheduled', amount: -150.00, date: '2024-06-12' },
    { id: 'dt5', item: 'Marketing Campaign Launch', status: 'In Progress', amount: 0, date: '2024-06-10' },
    { id: 'dt6', item: 'Annual Software License', status: 'Due', amount: -800.00, date: '2024-07-01' },
];

// Type for a Patient Review
interface PatientReview {
    id: string;
    quote: string;
    author: string;
    rating: number; // e.g., 5 for 5 stars
    date: string; // YYYY-MM-DD
}

// Type for Finance Transaction
interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
    date: string;
}


export default function DashboardPage() {
    // --- Finance Data & State ---
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', description: 'Monthly Salary', amount: 3500.00, type: 'income', category: 'Salary', date: '2024-06-15' },
        { id: '2', description: 'Rent Payment', amount: -1200.00, type: 'expense', category: 'Housing', date: '2024-06-10' },
        { id: '3', description: 'Groceries', amount: -150.75, type: 'expense', category: 'Food', date: '2024-06-08' },
        { id: '4', description: 'Freelance Project', amount: 500.00, type: 'income', category: 'Freelance', date: '2024-06-05' },
        { id: '5', description: 'Internet Bill', amount: -60.00, type: 'expense', category: 'Utilities', date: '2024-06-01' },
        { id: '6', description: 'Dinner with friends', amount: -75.50, type: 'expense', category: 'Entertainment', date: '2024-05-28' },
        { id: '7', description: 'Dividend Payout', amount: 120.00, type: 'income', category: 'Investments', date: '2024-05-25' },
        { id: '8', description: 'Electricity Bill', amount: -90.20, type: 'expense', category: 'Utilities', date: '2024-05-20' },
        { id: '9', description: 'Cardiology Consultation', amount: -250.00, type: 'expense', category: 'Medical', date: '2024-06-12' },
        { id: '10', description: 'Prescription Refill', amount: -45.00, type: 'expense', category: 'Medical', date: '2024-06-13' },
        { id: '11', description: 'Medical Insurance Claim', amount: 800.00, type: 'income', category: 'Insurance', date: '2024-06-20' },
        { id: '12', description: 'Gym Membership', amount: -40.00, type: 'expense', category: 'Health & Fitness', date: '2024-05-01' },
        { id: '13', description: 'Transportation', amount: -30.00, type: 'expense', category: 'Transport', date: '2024-06-03' },
        { id: '14', description: 'Heart Check-up Co-pay', amount: -50.00, type: 'expense', category: 'Medical', date: '2024-05-18' },
        { id: '15', description: 'Online Course', amount: -100.00, type: 'expense', category: 'Education', date: '2024-04-20' },
        { id: '16', description: 'Side Gig Payment', amount: 200.00, type: 'income', category: 'Freelance', date: '2024-04-10' },
    ]);

    // State for the new transaction form
    const [newDescription, setNewDescription] = useState<string>('');
    const [newAmount, setNewAmount] = useState<string>('');
    const [newType, setNewType] = useState<'income' | 'expense'>('expense');
    const [newCategory, setNewCategory] = useState<string>('');
    const [newDate, setNewDate] = useState<Date>(new Date());

    // Filters for transactions table
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
    const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);

    // List of all unique categories from dummy data
    const allCategories = useMemo(() => {
        const categories = new Set<string>();
        transactions.forEach(t => {
            if (t.category) {
                categories.add(t.category);
            }
        });
        if (!categories.has('Medical')) {
            categories.add('Medical');
        }
        return Array.from(categories).sort();
    }, [transactions]);

    // Calculate financial summaries and chart data
    const { totalBalance, monthlyIncome, monthlyExpenses, monthlyNetSavings, totalTransactionsCount, averageTransactionAmount, incomeExpenseData, categoryExpenseData, aiFinancialInsight } = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let balance = 0;
        let incomeThisMonth = 0;
        let expensesThisMonth = 0;
        let totalAmountSum = 0;
        let transactionCount = 0;

        const monthlyDataMap = new Map<string, { income: number, expense: number }>();
        const categoryExpensesMap = new Map<string, number>();

        transactions.forEach(t => {
            balance += t.amount;
            totalAmountSum += Math.abs(t.amount);
            transactionCount++;

            const transactionDate = new Date(t.date);
            const monthKey = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!monthlyDataMap.has(monthKey)) {
                monthlyDataMap.set(monthKey, { income: 0, expense: 0 });
            }
            const monthData = monthlyDataMap.get(monthKey)!;

            if (t.type === 'income') {
                monthData.income += t.amount;
                if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                    incomeThisMonth += t.amount;
                }
            } else { // expense
                monthData.expense += Math.abs(t.amount);
                if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                    expensesThisMonth += Math.abs(t.amount);
                }
                if (t.category) {
                    categoryExpensesMap.set(t.category, (categoryExpensesMap.get(t.category) || 0) + Math.abs(t.amount));
                }
            }
        });

        const sortedMonthKeys = Array.from(monthlyDataMap.keys()).sort();
        const incomeExpenseData = sortedMonthKeys.map(key => ({
            name: key,
            Income: monthlyDataMap.get(key)!.income,
            Expenses: monthlyDataMap.get(key)!.expense,
        }));

        const categoryExpenseData = Array.from(categoryExpensesMap.entries()).map(([category, amount]) => ({
            name: category,
            value: amount,
        }));

        const net = incomeThisMonth - expensesThisMonth;
        const avgTransaction = transactionCount > 0 ? (totalAmountSum / transactionCount) : 0;

        let aiInsight = "Analyzing your financial data...";
        if (net > 0) {
            aiInsight = `Excellent! You have a positive net income of $${net.toFixed(2)} this month. Consider investing your surplus or building your savings.`;
        } else if (net < 0) {
            aiInsight = `Your expenses this month currently exceed your income by $${Math.abs(net).toFixed(2)}. Review your spending, especially in categories like Medical, to identify areas for adjustment.`;
        } else {
            aiInsight = "Your income and expenses are currently balanced. Keep tracking your spending for future insights.";
        }
        if (categoryExpensesMap.get('Medical') && categoryExpensesMap.get('Medical')! > 300) {
            aiInsight += " Note: Your medical expenses are significant this month. Ensure all claims are processed or explore alternative options if applicable to your cardiology care.";
        }


        return {
            totalBalance: balance,
            monthlyIncome: incomeThisMonth,
            monthlyExpenses: expensesThisMonth,
            monthlyNetSavings: net,
            totalTransactionsCount: transactionCount,
            averageTransactionAmount: avgTransaction,
            incomeExpenseData: incomeExpenseData,
            categoryExpenseData: categoryExpenseData,
            aiFinancialInsight: aiInsight,
        };
    }, [transactions]);

    // Filtered transactions for the table
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesType = filterType === 'all' || t.type === filterType;
            const matchesCategory = filterCategory === 'all' || t.category === filterCategory;

            const transactionDate = new Date(t.date);
            const matchesStartDate = filterStartDate ? transactionDate >= filterStartDate : true;
            const matchesEndDate = filterEndDate ? transactionDate <= filterEndDate : true;

            return matchesType && matchesCategory && matchesStartDate && matchesEndDate;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, filterType, filterCategory, filterStartDate, filterEndDate]);


    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(newAmount);

        if (isNaN(parsedAmount) || newDescription.trim() === '' || !newCategory.trim()) {
            console.error('Please fill in all fields correctly.');
            return;
        }

        const newTransaction: Transaction = {
            id: String(Date.now()),
            description: newDescription.trim(),
            amount: newType === 'expense' ? -parsedAmount : parsedAmount,
            type: newType,
            category: newCategory.trim(),
            date: format(newDate, 'yyyy-MM-dd'),
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setNewDescription('');
        setNewAmount('');
        setNewType('expense');
        setNewCategory('');
        setNewDate(new Date());

        console.log('Transaction added:', newTransaction);
    };

    // --- Reviews Data & State ---
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

    const { averageRating, totalReviews, fiveStarCount, ratingDistribution, reviewsOverTimeData, positiveSentimentPercentage } = useMemo(() => {
        const total = reviews.length;
        const sumRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avg = total > 0 ? (sumRatings / total) : 0;

        const distribution = Array(5).fill(0);
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });
        const chartData = distribution.map((count, index) => ({
            name: `${index + 1} Star${index === 0 ? '' : 's'}`,
            Reviews: count,
        })).reverse();

        const monthlyReviewsMap = new Map<string, number>();
        reviews.forEach(review => {
            const month = review.date.substring(0, 7);
            monthlyReviewsMap.set(month, (monthlyReviewsMap.get(month) || 0) + 1);
        });
        const sortedMonths = Array.from(monthlyReviewsMap.keys()).sort();
        const reviewsOverTimeData = sortedMonths.map(month => ({
            name: month,
            Reviews: monthlyReviewsMap.get(month),
        }));

        const positiveReviews = reviews.filter(review => review.rating >= 4).length;
        const positivePercent = total > 0 ? (positiveReviews / total) * 100 : 0;

        return {
            averageRating: avg.toFixed(1),
            totalReviews: total,
            fiveStarCount: distribution[4],
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
        <svg className="w-12 h-12 text-blue-500 animate-pulse-custom" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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

    // Color palette for Pie Chart
    const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00bcd4', '#ff4d4d', '#c25555', '#95c623', '#23c695'];

    // Data for the main dashboard SectionCards
    const sectionCardsData: DashboardMetric[] = [
        {
            title: 'Total Revenue',
            value: `$${(125000 + monthlyIncome).toFixed(2)}`, // Placeholder combined with income
            change: '+12.5%',
            trend: 'up',
            description: 'Trending up this month',
            icon: DollarSign,
            valueColor: 'text-green-600',
        },
        {
            title: 'New Patients', // Changed to "New Patients"
            value: '1,234',
            change: '-20%',
            trend: 'down',
            description: 'Acquisition needs attention',
            icon: Users,
            valueColor: 'text-red-600',
        },
        {
            title: 'Active Patients', // Changed to "Active Patients"
            value: '45,678',
            change: '+12.5%',
            trend: 'up',
            description: 'Strong patient retention',
            icon: Users,
            valueColor: 'text-blue-600',
        },
        {
            title: 'Clinic Growth Rate', // Changed to "Clinic Growth Rate"
            value: '4.5%',
            change: '+4.5%',
            trend: 'up',
            description: 'Meets growth projections',
            icon: TrendingUp,
            valueColor: 'text-purple-600',
        },
        {
            title: 'Cardiology Consults', // New cardiology specific metric
            value: '850',
            change: '+5%',
            trend: 'up',
            description: 'Increased consultations',
            icon: HeartPulse, // Cardiology icon
            valueColor: 'text-red-500',
        },
        {
            title: 'Successful Procedures', // New cardiology specific metric
            value: '180',
            change: '+8%',
            trend: 'up',
            description: 'High success rate',
            icon: Stethoscope, // Cardiology icon
            valueColor: 'text-green-500',
        },
    ];

    return (
        // Main container with full height and background
        <div className="flex flex-col flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-900 text-gray-900 dark:text-gray-100 font-inter rounded-lg overflow-auto p-4 md:p-6 lg:p-8">
            <div className="container mx-auto max-w-full flex flex-col gap-6">

                {/* Section: Business & Cardiology Overview Metrics */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Increased grid columns for more cards */}
                        {sectionCardsData.map((metric, index) => (
                            <Card key={index} className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</CardTitle>
                                    <metric.icon className="h-5 w-5 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-3xl font-bold ${metric.valueColor || 'text-gray-900'} dark:${metric.valueColor || 'text-gray-100'}`}>
                                        {metric.value}
                                    </div>
                                    <div className="flex items-center text-xs mt-1">
                                        <span className={`font-semibold ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`}>{metric.change}</span>
                                        <p className="text-gray-500 dark:text-gray-400">{metric.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Section: Financial Analytics & AI Insights */}
                <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Financial Summary Cards */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</CardTitle>
                            <Wallet className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">${totalBalance.toFixed(2)}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Overall financial standing</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</CardTitle>
                            <Banknote className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">${monthlyIncome.toFixed(2)}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">This month's earnings</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</CardTitle>
                            <DollarSign className="h-5 w-5 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">${monthlyExpenses.toFixed(2)}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">This month's spending</p>
                        </CardContent>
                    </Card>
                    {/* AI-Powered Financial Insights Card */}
                    <Card className="rounded-xl shadow-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900 p-6 flex flex-col items-center justify-center text-center">
                        <AiStarAnimation />
                        <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-4 mb-2">AI Financial Insights</CardTitle>
                        <CardDescription className="text-center text-blue-600 dark:text-blue-400 text-sm">
                            {aiFinancialInsight}
                        </CardDescription>
                    </Card>
                </section>

                {/* Section: Main Charts (Patient/Visitors, Income/Expense, Reviews) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Total Visitors/Patients Chart */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Patient Visits Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={totalVisitorsData}
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
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Patients" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Income vs Expense Over Time Chart */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Financial Flow Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={incomeExpenseData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        formatter={(value: number) => `$${value.toFixed(2)}`}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ color: '#333', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#555' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="Income" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Rating Distribution Chart (from Reviews Page) */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Patient Feedback Rating Distribution</CardTitle>
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

                    {/* Reviews Over Time Chart (from Reviews Page) */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Patient Reviews Over Time</CardTitle>
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

                {/* Section: Financial Breakdown & Transactions / Recent Testimonials */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Expense by Category Chart */}
                    <Card className="lg:col-span-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Expenses by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
                            {categoryExpenseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryExpenseData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {categoryExpenseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ color: '#333', fontWeight: 'bold' }}
                                            itemStyle={{ color: '#555' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No expense data for categories.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Add New Transaction Form */}
                    <Card className="lg:col-span-2 rounded-xl shadow-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">Add New Transaction</CardTitle>
                            <CardDescription className="text-center text-blue-600 dark:text-blue-400">
                                Record income or expenses to track your finances.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label htmlFor="newDescription" className="mb-1">Description</Label>
                                    <Input
                                        type="text" id="newDescription" value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="e.g., Coffee, Salary, Medical Bill" required
                                        className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="newAmount" className="mb-1">Amount</Label>
                                    <Input
                                        type="number" id="newAmount" value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                        placeholder="e.g., 50.00" step="0.01" required
                                        className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="newType" className="mb-1">Type</Label>
                                    <Select value={newType} onValueChange={(value) => setNewType(value as 'income' | 'expense')}>
                                        <SelectTrigger id="newType" className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                                            <SelectItem value="expense">Expense</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="newCategory" className="mb-1">Category</Label>
                                    <Select value={newCategory} onValueChange={setNewCategory}>
                                        <SelectTrigger id="newCategory" className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                                            {allCategories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-full"> {/* Date input spans full width */}
                                    <Label htmlFor="newDate" className="mb-1">Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={`w-full justify-start text-left font-normal rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                                                    !newDate && "text-muted-foreground"
                                                }`}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                            <Calendar
                                                mode="single" selected={newDate}
                                                onSelect={(date) => date && setNewDate(date)} initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Button
                                    type="submit" className="w-full col-span-full py-2.5 px-5 text-lg font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-md"
                                >
                                    Add Transaction
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Transactions Table */}
                    <Card className="lg:col-span-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader className="mb-4">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">All Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1">
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder="Filter by Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder="Filter by Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {allCategories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={`flex-1 justify-start text-left font-normal rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                                                    !filterStartDate && "text-muted-foreground"
                                                }`}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filterStartDate ? format(filterStartDate, "PPP") : <span>Start Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                            <Calendar
                                                mode="single" selected={filterStartDate}
                                                onSelect={setFilterStartDate} initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={`flex-1 justify-start text-left font-normal rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                                                    !filterEndDate && "text-muted-foreground"
                                                }`}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filterEndDate ? format(filterEndDate, "PPP") : <span>End Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                            <Calendar
                                                mode="single" selected={filterEndDate}
                                                onSelect={setFilterEndDate} initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Transactions List/Table */}
                            <div className="overflow-auto flex-1 custom-scrollbar">
                                {filteredTransactions.length > 0 ? (
                                    <table className="w-full text-left table-auto">
                                        <thead className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
                                            <tr>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Description</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.map(transaction => (
                                                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{new Date(transaction.date).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{transaction.description}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{transaction.category || 'N/A'}</td>
                                                    <td className={`py-3 px-4 text-sm font-semibold text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {transaction.type === 'income' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions found matching your criteria.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section: Patient Reviews Analytics */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Overall Review Metrics */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Review Rating</CardTitle>
                            <Star className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{averageRating} / 5.0</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Based on {totalReviews} reviews</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patient Reviews</CardTitle>
                            <MessageSquareText className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalReviews}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Overall feedback count</p>
                        </CardContent>
                    </Card>

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

                     {/* Recent Patient Testimonials Section - now a larger, dedicated scrollable card */}
                    <Card className="lg:col-span-2 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Latest Patient Testimonials</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto custom-scrollbar h-[400px]"> {/* Adjusted height for better scrolling */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Adjusted to 2 columns for wider view */}
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

                {/* Section: General Data Table */}
                <section>
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader className="mb-4">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">General Data Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 overflow-auto custom-scrollbar h-[300px]">
                            {generalTableData.length > 0 ? (
                                <table className="w-full text-left table-auto">
                                    <thead className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
                                        <tr>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Item</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Amount</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generalTableData.map(row => (
                                            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                                <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{row.item}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{row.status}</td>
                                                <td className={`py-3 px-4 text-sm font-semibold text-right ${row.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {row.amount >= 0 ? '+' : ''}{row.amount.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{row.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No general data available.</p>
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
