// FinancePage.tsx

import React, { useState } from 'react';

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
            alert('Please enter a valid amount and description.');
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Balance</h2>
                        <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                            ${totalBalance.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Across all accounts</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Monthly Income</h2>
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                            ${monthlyIncome.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This month</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Monthly Expenses</h2>
                        <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-2">
                            ${monthlyExpenses.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This month</p>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Transactions</h2>
                        <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar */}
                            {transactions.length > 0 ? (
                                <ul className="space-y-3">
                                    {transactions.map(transaction => (
                                        <li
                                            key={transaction.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {transaction.description}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span
                                                className={`font-semibold text-lg ${
                                                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                                }`}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}$
                                                {Math.abs(transaction.amount).toFixed(2)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet. Add one above!</p>
                            )}
                        </div>
                    </section>

                    {/* Quick Add Transaction Form */}
                    <section className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Add Transaction</h2>
                        <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="e.g., Coffee, Salary"
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    placeholder="e.g., 50.00"
                                    step="0.01"
                                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Type
                                </label>
                                <select
                                    id="type"
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition duration-150"
                            >
                                Add Transaction
                            </button>
                        </form>
                    </section>
                </div>

                {/* You could add a Chart section here */}
                {/* <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Spending Trends</h2>
                    {/* Placeholder for your chart component (e.g., from Chart.js, Recharts) }
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                        [Chart goes here]
                    </div>
                </section> */}
            </div>
        </div>
    );
}