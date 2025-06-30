"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon, TrendingUp, DollarSign, Wallet, Percent, Banknote, Users,
  BarChart as BarChartIcon, ArrowUp, ArrowDown, Plus, Filter, Sparkles, Loader2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI - Vite uses import.meta.env instead of process.env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCZm31IoQ4urVA2ORarvDAGu6XqAuxRAzo");

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  date: string;
}

export default function FinancePage() {
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("Analyzing your financial data...");
  const [aiAnimation, setAiAnimation] = useState(false);

  // Form state
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newCategory, setNewCategory] = useState('');
  const [newDate, setNewDate] = useState<Date>(new Date());

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // Load sample data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const sampleData: Transaction[] = [
        { id: '1', description: 'Monthly Salary', amount: 3500.00, type: 'income', category: 'Salary', date: '2024-06-15' },
        { id: '2', description: 'Rent Payment', amount: -1200.00, type: 'expense', category: 'Housing', date: '2024-06-10' },
        { id: '3', description: 'Groceries', amount: -150.75, type: 'expense', category: 'Food', date: '2024-06-08' },
        { id: '4', description: 'Freelance Project', amount: 500.00, type: 'income', category: 'Freelance', date: '2024-06-05' },
        { id: '5', description: 'Internet Bill', amount: -60.00, type: 'expense', category: 'Utilities', date: '2024-06-01' },
        { id: '6', description: 'Dinner with friends', amount: -75.50, type: 'expense', category: 'Entertainment', date: '2024-05-28' },
        { id: '7', description: 'Dividend Payout', amount: 120.00, type: 'income', category: 'Investments', date: '2024-05-25' },
        { id: '8', description: 'Electricity Bill', amount: -90.20, type: 'expense', category: 'Utilities', date: '2024-05-20' },
        { id: '9', description: 'Medical Consultation', amount: -250.00, type: 'expense', category: 'Medical', date: '2024-06-12' },
      ];
      
      setTransactions(sampleData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Get AI insights whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      getAiInsights();
    }
  }, [transactions]);

  const getAiInsights = async () => {
    setAiLoading(true);
    setAiAnimation(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Prepare transaction history for AI
      const transactionHistory = transactions
        .map(t => `${t.date}: ${t.description} (${t.type === 'income' ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)})`)
        .join('\n');
      
      const prompt = `
        Analyze this financial data and provide concise, actionable insights:
        
        Transaction History:
        ${transactionHistory}
        
        Current Financial Summary:
        - Total Balance: $${totalBalance.toFixed(2)}
        - Monthly Income: $${monthlyIncome.toFixed(2)}
        - Monthly Expenses: $${monthlyExpenses.toFixed(2)}
        - Net Savings: $${monthlyNetSavings.toFixed(2)}
        
        Provide specific recommendations based on spending patterns. 
        Focus on opportunities to save money and optimize finances.
        Keep response under 3 sentences and very concise.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("Unable to generate insights at this time. Please try again later.");
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiAnimation(false), 1000);
    }
  };

  // Calculate financial data
  const { 
    totalBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    monthlyNetSavings,
    incomeExpenseData,
    categoryExpenseData,
    allCategories
  } = useMemo(() => {
    let balance = 0;
    let incomeThisMonth = 0;
    let expensesThisMonth = 0;
    const categories = new Set<string>();
    const monthlyData = new Map<string, { income: number, expense: number }>();
    const categoryExpenses = new Map<string, number>();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    transactions.forEach(t => {
      balance += t.amount;
      if (t.category) categories.add(t.category);

      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expense: 0 });
      }
      const month = monthlyData.get(monthKey)!;

      if (t.type === 'income') {
        month.income += t.amount;
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          incomeThisMonth += t.amount;
        }
      } else {
        month.expense += Math.abs(t.amount);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          expensesThisMonth += Math.abs(t.amount);
        }
        if (t.category) {
          categoryExpenses.set(t.category, (categoryExpenses.get(t.category) || 0) + Math.abs(t.amount));
        }
      }
    });

    // Prepare chart data
    const incomeExpenseChartData = Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        name: month,
        Income: data.income,
        Expenses: data.expense
      }));

    const categoryChartData = Array.from(categoryExpenses.entries())
      .map(([category, amount]) => ({
        name: category,
        value: amount
      }));

    return {
      totalBalance: balance,
      monthlyIncome: incomeThisMonth,
      monthlyExpenses: expensesThisMonth,
      monthlyNetSavings: incomeThisMonth - expensesThisMonth,
      incomeExpenseData: incomeExpenseChartData,
      categoryExpenseData: categoryChartData,
      allCategories: Array.from(categories).sort()
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const date = new Date(t.date);
      const matchesStart = !filterStartDate || date >= filterStartDate;
      const matchesEnd = !filterEndDate || date <= filterEndDate;
      
      return matchesType && matchesCategory && matchesStart && matchesEnd;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory, filterStartDate, filterEndDate]);

  // Add new transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);

    if (isNaN(amount) || !newDescription.trim() || !newCategory.trim()) {
      alert('Please fill all fields correctly');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: newDescription.trim(),
      amount: newType === 'income' ? amount : -amount,
      type: newType,
      category: newCategory.trim(),
      date: format(newDate, 'yyyy-MM-dd')
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Reset form
    setNewDescription('');
    setNewAmount('');
    setNewType('expense');
    setNewCategory('');
    setNewDate(new Date());
  };

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your income and expenses</p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Balance" 
          value={totalBalance} 
          icon={Wallet}
          isCurrency
        />
        <MetricCard 
          title="Monthly Income" 
          value={monthlyIncome} 
          icon={Banknote}
          isCurrency
          trend="up"
        />
        <MetricCard 
          title="Monthly Expenses" 
          value={monthlyExpenses} 
          icon={DollarSign}
          isCurrency
          trend="down"
        />
        <MetricCard 
          title="Net Savings" 
          value={monthlyNetSavings} 
          icon={TrendingUp}
          isCurrency
          trend={monthlyNetSavings >= 0 ? "up" : "down"}
        />
      </div>

      {/* AI Insights */}
      <Card className={`mb-6 transition-all duration-500 ${aiAnimation ? 'scale-105 bg-blue-100 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${aiLoading ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
              <Sparkles className={`h-5 w-5 ${aiLoading ? 'text-blue-600 animate-pulse' : 'text-blue-500'}`} />
            </div>
            <CardTitle className="text-lg">AI Financial Insights</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={getAiInsights}
            disabled={aiLoading}
          >
            {aiLoading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            {aiLoading ? 'Analyzing your financial data...' : aiResponse}
          </p>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <Label>Description</Label>
                <Input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Salary, Rent, Groceries..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={newType} 
                    onValueChange={(v) => setNewType(v as 'income' | 'expense')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Category</Label>
                <Select 
                  value={newCategory} 
                  onValueChange={setNewCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newDate}
                      onSelect={(date) => date && setNewDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex space-x-2">
                <Select 
                  value={filterType} 
                  onValueChange={setFilterType}
                >
                  <SelectTrigger className="w-[120px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filterCategory} 
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <div 
                    key={t.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        t.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {t.type === 'income' ? (
                          <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t.category} • {new Date(t.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium ${
                      t.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No transactions found matching your filters
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  isCurrency = false, 
  trend 
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  isCurrency?: boolean;
  trend?: 'up' | 'down';
}) {
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value.toString();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold mt-1">
              {formattedValue}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${
            trend === 'up' 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : trend === 'down' 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Icon className={`h-5 w-5 ${
              trend === 'up' 
                ? 'text-green-600 dark:text-green-400' 
                : trend === 'down' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}