"use client";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon, TrendingUp, DollarSign, Wallet, Percent, Banknote, Users,
  BarChart as BarChartIcon, MessageSquareText, ThumbsUp, Star, Sparkles, TrendingDown, 
  HeartPulse, Stethoscope, ArrowUp, ArrowDown
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon: React.ElementType;
  valueColor?: string;
}

interface DataTableRow {
  id: string;
  item: string;
  status: string;
  amount: number;
  date: string;
}

interface PatientReview {
  id: string;
  quote: string;
  author: string;
  rating: number;
  date: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  date: string;
}

const totalVisitorsData = [
  { name: 'Jan', count: 400 },
  { name: 'Feb', count: 450 },
  { name: 'Mar', count: 420 },
  { name: 'Apr', count: 500 },
  { name: 'May', count: 480 },
  { name: 'Jun', count: 550 },
  { name: 'Jul', count: 600 },
];

const generalTableData: DataTableRow[] = [
  { id: 'dt1', item: 'New Patient Onboarding', status: 'Completed', amount: 1200.00, date: '2024-06-20' },
  { id: 'dt2', item: 'Q2 Performance Report', status: 'Pending Review', amount: 0, date: '2024-06-18' },
  { id: 'dt3', item: 'Supplier Payment', status: 'Paid', amount: -500.00, date: '2024-06-15' },
  { id: 'dt4', item: 'Equipment Maintenance', status: 'Scheduled', amount: -150.00, date: '2024-06-12' },
  { id: 'dt5', item: 'Marketing Campaign Launch', status: 'In Progress', amount: 0, date: '2024-06-10' },
  { id: 'dt6', item: 'Annual Software License', status: 'Due', amount: -800.00, date: '2024-07-01' },
];

export default function DashboardPage() {
  // Financial State
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

  const [newDescription, setNewDescription] = useState<string>('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newCategory, setNewCategory] = useState<string>('');
  const [newDate, setNewDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);

  // Reviews State
  const [reviews, setReviews] = useState<PatientReview[]>([
    { id: 'pr1', quote: "The cardiology team here is exceptional. Dr. Smith was incredibly thorough and compassionate. I felt completely at ease.", author: "Eleanor R.", rating: 5, date: '2024-06-18' },
    { id: 'pr2', quote: "From the moment I walked in, I knew I was in good hands. The staff is so caring, and the advanced technology gave me peace of mind.", author: "James P.", rating: 5, date: '2024-06-15' },
    { id: 'pr3', quote: "My experience was seamless. Scheduling was easy, and the care I received for my heart condition was top-notch. Highly recommend!", author: "Maria K.", rating: 4, date: '2024-06-12' },
    { id: 'pr4', quote: "I'm so grateful for the expertise of this department. They accurately diagnosed and treated my condition with great professionalism.", author: "Robert D.", rating: 5, date: '2024-06-10' },
    { id: 'pr5', quote: "The doctors were great, but the wait times were a bit long.", author: "Sophia L.", rating: 3, date: '2024-06-01' },
    { id: 'pr6', quote: "Excellent follow-up care and clear explanations. Very happy with the service.", author: "William B.", rating: 5, date: '2024-05-28' },
  ]);

  // Financial Calculations
  const { 
    totalBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    monthlyNetSavings, 
    totalTransactionsCount, 
    averageTransactionAmount, 
    incomeExpenseData, 
    categoryExpenseData, 
    aiFinancialInsight 
  } = useMemo(() => {
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
      } else {
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

  // Reviews Calculations
  const { 
    averageRating, 
    totalReviews, 
    fiveStarCount, 
    ratingDistribution, 
    reviewsOverTimeData, 
    positiveSentimentPercentage 
  } = useMemo(() => {
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

  // Transaction Handlers
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
  };

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

  // Dashboard Metrics
  const sectionCardsData: DashboardMetric[] = [
    {
      title: 'Total Revenue',
      value: `$${(125000 + monthlyIncome).toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      description: 'Trending up this month',
      icon: DollarSign,
      valueColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'New Patients',
      value: '1,234',
      change: '-20%',
      trend: 'down',
      description: 'Acquisition needs attention',
      icon: Users,
      valueColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Active Patients',
      value: '45,678',
      change: '+12.5%',
      trend: 'up',
      description: 'Strong patient retention',
      icon: Users,
      valueColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Clinic Growth Rate',
      value: '4.5%',
      change: '+4.5%',
      trend: 'up',
      description: 'Meets growth projections',
      icon: TrendingUp,
      valueColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Cardiology Consults',
      value: '850',
      change: '+5%',
      trend: 'up',
      description: 'Increased consultations',
      icon: HeartPulse,
      valueColor: 'text-red-500 dark:text-red-400',
    },
    {
      title: 'Successful Procedures',
      value: '180',
      change: '+8%',
      trend: 'up',
      description: 'High success rate',
      icon: Stethoscope,
      valueColor: 'text-green-500 dark:text-green-400',
    },
  ];

  // Color palette for charts
  const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00bcd4', '#ff4d4d', '#c25555', '#95c623', '#23c695'];

  return (
    <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Overview of your cardiology practice</p>
      </header>

      {/* Key Metrics Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {sectionCardsData.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</h3>
                <div className={`p-2 rounded-lg ${metric.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  <metric.icon className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-2xl font-light ${metric.valueColor || 'text-gray-900 dark:text-white'}`}>
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400 mr-1" />
                    )}
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Visits Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Patient Visits</CardTitle>
              <CardDescription className="text-sm">Last 7 months trend</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={totalVisitorsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
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
                      border: 'none'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Financial Flow Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Financial Flow</CardTitle>
              <CardDescription className="text-sm">Income vs expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
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
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`]}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Income" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-900 dark:text-white">${totalBalance.toFixed(2)}</div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-light text-gray-900 dark:text-white">${monthlyIncome.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-light text-gray-900 dark:text-white">${monthlyExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Insights Card */}
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">{aiFinancialInsight}</p>
            </CardContent>
          </Card>

          {/* Quick Add Transaction */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <Label htmlFor="newDescription" className="sr-only">Description</Label>
                  <Input
                    type="text" 
                    id="newDescription" 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newAmount" className="sr-only">Amount</Label>
                    <Input
                      type="number" 
                      id="newAmount" 
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="Amount"
                    />
                  </div>
                  <Select value={newType} onValueChange={(value) => setNewType(value as 'income' | 'expense')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !newDate && "text-muted-foreground"
                        }`}
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
                <Button type="submit" className="w-full">Add Transaction</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Patient Reviews */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Patient Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-light">{averageRating}</div>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(Number(averageRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</div>
                  <div className="text-xl font-light">{totalReviews}</div>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
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
                    <Bar 
                      dataKey="Reviews" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-normal">Recent Transactions</CardTitle>
                <div className="flex space-x-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
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
              <div className="space-y-4">
                {filteredTransactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {transaction.type === 'income' ? (
                          <Banknote className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No transactions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="mt-8">
        <h2 className="text-xl font-light mb-4">Patient Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.slice(0, 6).map((review) => (
            <Card key={review.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  "{review.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.author}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* General Data Table */}
      <section className="mt-8">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-normal">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Item</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {generalTableData.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{row.item}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          row.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          row.status === 'Paid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          row.status === 'Scheduled' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                          row.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium text-right ${
                        row.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {row.amount >= 0 ? '+' : ''}{row.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}