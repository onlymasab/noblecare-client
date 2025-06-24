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
import { CalendarIcon, TrendingUp, DollarSign, Wallet, Percent, Banknote, Users, BarChartIcon } from "lucide-react"; // Icons for new cards/features
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Define a type for your transaction object for better type safety
interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string; // Added category field
    date: string; // YYYY-MM-DD
}

export default function FinancePage() {
    // Dummy data for demonstration purposes, now with categories and more dates
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
    const [filterType, setFilterType] = useState<string>('all'); // 'all', 'income', 'expense'
    const [filterCategory, setFilterCategory] = useState<string>('all'); // 'all' or specific category
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
        // Ensure Medical category is always an option if relevant to cardiology finance
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
        let totalAmountSum = 0; // For average transaction amount
        let transactionCount = 0;

        // Data for Income vs Expense Chart (monthly)
        const monthlyDataMap = new Map<string, { income: number, expense: number }>();
        const categoryExpensesMap = new Map<string, number>();

        transactions.forEach(t => {
            balance += t.amount;
            totalAmountSum += Math.abs(t.amount); // Sum of absolute amounts for average
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
                monthData.expense += Math.abs(t.amount); // Ensure expenses are positive for sum
                if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                    expensesThisMonth += Math.abs(t.amount);
                }
                // Aggregate expenses by category
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

        // Simple AI Financial Insight (Placeholder for more complex logic)
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
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
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


    return (
        // The main container for the dashboard, filling the Outlet area
        <div className="flex flex-col flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-900 text-gray-900 dark:text-gray-100 font-inter rounded-lg overflow-auto p-4 md:p-6 lg:p-8">
            <div className="container mx-auto max-w-full flex flex-col gap-6">

                {/* Top Row: Key Metrics & AI Insights Card */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                {/* Middle Section: More Metrics & Charts */}
                <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* New Card: Monthly Net Savings */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Net Savings</CardTitle>
                            <Percent className="h-5 w-5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${monthlyNetSavings >= 0 ? 'text-green-600' : 'text-red-600'} dark:${monthlyNetSavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${monthlyNetSavings.toFixed(2)}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">This month's surplus/deficit</p>
                        </CardContent>
                    </Card>
                    {/* New Card: Total Transactions Count */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</CardTitle>
                            <BarChartIcon className="h-5 w-5 text-cyan-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalTransactionsCount}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">All recorded transactions</p>
                        </CardContent>
                    </Card>
                    {/* New Card: Average Transaction Amount */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Transaction</CardTitle>
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">${averageTransactionAmount.toFixed(2)}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Average amount per transaction</p>
                        </CardContent>
                    </Card>
                    {/* Placeholder for another chart or specific metric (e.g., Medical Expenses Trend) */}
                     <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center">
                        <Users className="h-10 w-10 text-gray-400 mb-2" />
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">Patient Financial Profiles</CardTitle>
                        <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-sm">
                            Analyze spending patterns per patient.
                        </CardDescription>
                        <Button className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full text-sm">
                            View Profiles
                        </Button>
                    </Card>
                </section>


                {/* Charts Section: Income vs Expense & Category Breakdown */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                    {/* Income vs Expense Over Time Chart */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Income vs. Expenses Over Time</CardTitle>
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

                    {/* Expense by Category Chart */}
                    <Card className="rounded-xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col">
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
                </section>

                {/* Transactions Table with Filters and Add Form */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add New Transaction Form */}
                    <Card className="lg:col-span-1 rounded-xl shadow-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900 p-6 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">Add New Transaction</CardTitle>
                            <CardDescription className="text-center text-blue-600 dark:text-blue-400">
                                Record income or expenses.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="newDescription" className="mb-1">
                                        Description
                                    </Label>
                                    <Input
                                        type="text"
                                        id="newDescription"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="e.g., Coffee, Salary, Medical Bill"
                                        className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newAmount" className="mb-1">
                                        Amount
                                    </Label>
                                    <Input
                                        type="number"
                                        id="newAmount"
                                        value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                        placeholder="e.g., 50.00"
                                        step="0.01"
                                        className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newType" className="mb-1">
                                        Type
                                    </Label>
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
                                <div>
                                    <Label htmlFor="newCategory" className="mb-1">
                                        Category
                                    </Label>
                                    <Select value={newCategory} onValueChange={setNewCategory}>
                                        <SelectTrigger id="newCategory" className="w-full rounded-lg shadow-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                                            {allCategories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                            {/* Allow adding custom categories if needed in a real app */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="newDate" className="mb-1">
                                        Date
                                    </Label>
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
                                                mode="single"
                                                selected={newDate}
                                                onSelect={(date) => date && setNewDate(date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full py-2.5 px-5 text-lg font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-md"
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
                                                mode="single"
                                                selected={filterStartDate}
                                                onSelect={setFilterStartDate}
                                                initialFocus
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
                                                mode="single"
                                                selected={filterEndDate}
                                                onSelect={setFilterEndDate}
                                                initialFocus
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

            </div>
            {/* Custom Scrollbar CSS */}
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
