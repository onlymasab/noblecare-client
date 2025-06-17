"use client"; // Important for shadcn/ui components that rely on client-side interactivity

import React, { useState } from 'react';

// Import shadcn/ui components (adjust paths based on your shadcn setup)
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

// Define a type for your transaction object for better type safety
interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}

export default function FinancePage() {
    // Dummy data for demonstration purposes
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', description: 'Monthly Salary', amount: 3500.00, type: 'income', date: '2024-06-15' },
        { id: '2', description: 'Rent Payment', amount: -1200.00, type: 'expense', date: '2024-06-10' },
        { id: '3', description: 'Groceries', amount: -150.75, type: 'expense', date: '2024-06-08' },
        { id: '4', description: 'Freelance Project', amount: 500.00, type: 'income', date: '2024-06-05' },
        { id: '5', description: 'Internet Bill', amount: -60.00, type: 'expense', date: '2024-06-01' },
        { id: '6', description: 'Dinner with friends', amount: -75.50, type: 'expense', date: '2024-05-28' },
        { id: '7', description: 'Dividend Payout', amount: 120.00, type: 'income', date: '2024-05-25' },
        { id: '8', description: 'Electricity Bill', amount: -90.20, type: 'expense', date: '2024-05-20' },
    ]);

    // State for the new transaction form
    const [newDescription, setNewDescription] = useState<string>('');
    const [newAmount, setNewAmount] = useState<string>(''); // Keep as string for input
    const [newType, setNewType] = useState<'income' | 'expense'>('expense');

    // Calculate financial summaries
    const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((acc, t) => acc + t.amount, 0);
    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((acc, t) => acc + Math.abs(t.amount), 0); // Use Math.abs for expenses

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(newAmount);

        if (isNaN(parsedAmount) || newDescription.trim() === '') {
            // In a real app, use a shadcn/ui Toast or Dialog for notification
            // For example: toast({ title: "Error", description: "Please enter a valid amount and description." });
            console.error('Please enter a valid amount and description.');
            return;
        }

        const newTransaction: Transaction = {
            id: String(Date.now()), // Simple unique ID
            description: newDescription.trim(),
            amount: newType === 'expense' ? -parsedAmount : parsedAmount, // Ensure expense is negative
            type: newType,
            date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        };

        setTransactions(prev => [newTransaction, ...prev]); // Add to top
        setNewDescription('');
        setNewAmount('');
        setNewType('expense'); // Reset to default

        // In a real app, use a shadcn/ui Toast or Dialog for notification
        // For example: toast({ title: "Success", description: "Transaction added successfully!" });
        console.log('Transaction added:', newTransaction);
    };

    return (
        <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 md:gap-8">
                {/* Header */}
                <header className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                        My Finance Dashboard
                    </h1>
                    {/* Could add a user avatar or settings button here */}
                </header>

                {/* Overview Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Balance</CardDescription>
                            <CardTitle className="text-4xl font-bold text-green-600 dark:text-green-400">
                                ${totalBalance.toFixed(2)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Across all accounts</p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-lg font-semibold text-gray-500 dark:text-gray-400">Monthly Income</CardDescription>
                            <CardTitle className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                ${monthlyIncome.toFixed(2)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 dark:text-gray-500">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-lg font-semibold text-gray-500 dark:text-gray-400">Monthly Expenses</CardDescription>
                            <CardTitle className="text-4xl font-bold text-red-600 dark:text-red-400">
                                ${monthlyExpenses.toFixed(2)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 dark:text-gray-500">This month</p>
                        </CardContent>
                    </Card>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <section className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</CardTitle>
                            </CardHeader>
                            <CardContent className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {transactions.length > 0 ? (
                                    <ul className="space-y-3">
                                        {transactions.map(transaction => (
                                            <Card
                                                key={transaction.id}
                                                className="flex items-center justify-between p-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                                            >
                                                <div className="flex flex-col">
                                                    <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                        {transaction.description}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                <span
                                                    className={`font-semibold text-lg ${
                                                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                                    }`}
                                                >
                                                    {transaction.type === 'income' ? '+' : '-'}$
                                                    {Math.abs(transaction.amount).toFixed(2)}
                                                </span>
                                            </Card>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet. Add one above!</p>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Quick Add Transaction Form */}
                    <section className="lg:col-span-1">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Quick Add Transaction</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
                                    <div>
                                        <Label htmlFor="description" className="mb-1">
                                            Description
                                        </Label>
                                        <Input
                                            type="text"
                                            id="description"
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            placeholder="e.g., Coffee, Salary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="amount" className="mb-1">
                                            Amount
                                        </Label>
                                        <Input
                                            type="number"
                                            id="amount"
                                            value={newAmount}
                                            onChange={(e) => setNewAmount(e.target.value)}
                                            placeholder="e.g., 50.00"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="type" className="mb-1">
                                            Type
                                        </Label>
                                        <Select value={newType} onValueChange={(value) => setNewType(value as 'income' | 'expense')}>
                                            <SelectTrigger id="type" className="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="expense">Expense</SelectItem>
                                                <SelectItem value="income">Income</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Add Transaction
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* You could add a Chart section here */}
                {/* <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Spending Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                            [Chart goes here]
                        </CardContent>
                    </Card>
                </section> */}
            </div>
        </div>
    );
}
