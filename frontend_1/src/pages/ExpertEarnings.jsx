import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, DollarSign, TrendingUp, Lock,
  Unlock, Download, Search, X, Check,
  AlertCircle, Calendar, Briefcase, ArrowUpRight,
  Clock, CreditCard, Plus, Eye, Shield,
  FileText, ChevronDown, Target, Wallet,
  BarChart2, IndianRupee, Building, Star,
  CheckCircle, ArrowDownLeft, Landmark, Send
} from 'lucide-react';

const ExpertEarnings = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSent, setWithdrawSent] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState('bank');

  const tabs = ['Overview', 'Transactions', 'Invoices', 'Payouts'];

  // ── DATA ──
  const summary = {
    totalEarned: '₹12,40,000',
    thisMonth: '₹3,50,000',
    inEscrow: '₹5,50,000',
    availableToWithdraw: '₹3,50,000',
    nextPayment: '₹2,50,000',
    nextPaymentDate: 'Apr 30, 2025',
    avgMonthly: '₹3.1L',
    totalEngagements: 2,
  };

  const monthlyData = [
    { month: 'Oct', amount: 0, label: '—' },
    { month: 'Nov', amount: 150, label: '₹1.5L' },
    { month: 'Dec', amount: 150, label: '₹1.5L' },
    { month: 'Jan', amount: 200, label: '₹2L' },
    { month: 'Feb', amount: 300, label: '₹3L' },
    { month: 'Mar', amount: 350, label: '₹3.5L' },
    { month: 'Apr', amount: 350, label: '₹3.5L' },
  ];

  const transactions = [
    {
      id: 'TXN-007-2025',
      type: 'milestone_received',
      description: 'Milestone Payment — Financial Model Development',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      amount: '+₹2,00,000',
      amountNum: 200000,
      date: 'Mar 28, 2025',
      time: '3:45 PM',
      status: 'Received',
      txRef: 'TXN-007-2025',
    },
    {
      id: 'TXN-006-2025',
      type: 'milestone_received',
      description: 'Milestone Payment — Campaign Strategy',
      engagement: 'Go-to-Market Expansion',
      company: 'TechScale Ventures',
      amount: '+₹1,50,000',
      amountNum: 150000,
      date: 'Apr 1, 2025',
      time: '2:30 PM',
      status: 'Received',
      txRef: 'TXN-006-2025',
    },
    {
      id: 'TXN-005-2025',
      type: 'withdrawal',
      description: 'Withdrawal to HDFC Bank ••••4321',
      engagement: '—',
      company: '—',
      amount: '-₹3,00,000',
      amountNum: -300000,
      date: 'Mar 30, 2025',
      time: '10:15 AM',
      status: 'Completed',
      txRef: 'TXN-005-2025',
    },
    {
      id: 'TXN-004-2025',
      type: 'milestone_received',
      description: 'Milestone Payment — Discovery & Assessment',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      amount: '+₹1,50,000',
      amountNum: 150000,
      date: 'Feb 25, 2025',
      time: '5:00 PM',
      status: 'Received',
      txRef: 'TXN-004-2025',
    },
    {
      id: 'TXN-003-2025',
      type: 'platform_fee',
      description: 'Platform Service Fee (10%)',
      engagement: 'Series B Funding Strategy',
      company: 'CXO Connect',
      amount: '-₹15,000',
      amountNum: -15000,
      date: 'Feb 25, 2025',
      time: '5:01 PM',
      status: 'Deducted',
      txRef: 'TXN-003-2025',
    },
    {
      id: 'TXN-002-2025',
      type: 'milestone_pending',
      description: 'Milestone Payment — Investor Deck & Data Room',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      amount: '+₹2,50,000',
      amountNum: 250000,
      date: '—',
      time: '—',
      status: 'In Escrow',
      txRef: 'TXN-002-2025',
    },
  ];

  const invoices = [
    {
      id: 'INV-EXP-006',
      title: 'Financial Model Development — March 2025',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      amount: '₹2,00,000',
      date: 'Mar 28, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-EXP-005',
      title: 'Campaign Strategy Completion',
      engagement: 'Go-to-Market Expansion',
      company: 'TechScale Ventures',
      companyLogo: 'TV',
      logoColor: 'from-blue-600 to-indigo-500',
      amount: '₹1,50,000',
      date: 'Apr 1, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-EXP-004',
      title: 'Investor Deck & Data Room',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      amount: '₹2,50,000',
      date: 'Apr 25, 2025',
      status: 'Pending',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-EXP-003',
      title: 'Discovery & Assessment — February 2025',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      amount: '₹1,50,000',
      date: 'Feb 25, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
  ];

  const payoutAccounts = [
    {
      id: 'bank',
      label: 'HDFC Bank',
      detail: 'Savings ••••4321',
      icon: '🏦',
      verified: true,
      default: true,
    },
    {
      id: 'upi',
      label: 'UPI',
      detail: 'david@hdfcbank',
      icon: '🔵',
      verified: true,
      default: false,
    },
  ];

  const payoutHistory = [
    { date: 'Mar 30, 2025', amount: '₹3,00,000', method: 'HDFC Bank ••••4321', status: 'Completed', days: 1 },
    { date: 'Feb 28, 2025', amount: '₹1,50,000', method: 'HDFC Bank ••••4321', status: 'Completed', days: 1 },
    { date: 'Jan 31, 2025', amount: '₹1,50,000', method: 'HDFC Bank ••••4321', status: 'Completed', days: 1 },
  ];

  const quickAmounts = ['₹50,000', '₹1,00,000', '₹2,00,000', '₹3,50,000'];

  // ── HELPERS ──
  const getTxIcon = (type) => {
    switch (type) {
      case 'milestone_received': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'withdrawal': return { icon: Landmark, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'platform_fee': return { icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50' };
      case 'milestone_pending': return { icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50' };
      default: return { icon: DollarSign, color: 'text-gray-400', bg: 'bg-gray-50' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Received': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'In Escrow': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Deducted': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.engagement.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWithdraw = () => {
    setWithdrawSent(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSent(false);
      setWithdrawAmount('');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 pb-16 space-y-6">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/expert-dashboard')}
                className="text-gray-400 hover:text-[#0eb59a] text-sm font-semibold transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-700">Earnings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Earnings & Payouts
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Track your income, invoices, and payment history
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={15} /> Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg"
            >
              <Landmark size={15} /> Withdraw Funds
            </motion.button>
          </div>
        </motion.div>

        {/* ── HERO EARNINGS CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-[#0d1f2d] via-[#134e40] to-[#0eb59a]/80 rounded-3xl p-7 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-[#0eb59a]/20 rounded-full" />
          <div className="absolute left-1/2 -bottom-16 w-64 h-64 bg-white/3 rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">

            {/* Left — Total earned */}
            <div className="flex-1">
              <p className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-1">
                Total Lifetime Earnings
              </p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-black mb-2 tracking-tight"
              >
                {summary.totalEarned}
              </motion.p>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-xl">
                  <ArrowUpRight size={13} className="text-emerald-300" />
                  <span className="font-black text-emerald-300">{summary.thisMonth} this month</span>
                </div>
                <span className="text-white/40 text-xs font-semibold">Avg {summary.avgMonthly}/mo</span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-24 bg-white/10" />

            {/* Right — Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:pl-2">
              {[
                { label: 'Available to Withdraw', value: summary.availableToWithdraw, icon: Wallet, accent: true },
                { label: 'In Escrow', value: summary.inEscrow, icon: Lock, accent: false },
                { label: 'Next Payment', value: summary.nextPayment, icon: Calendar, accent: false },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.07 }}
                  className={`flex flex-col gap-1.5 p-3 rounded-2xl ${
                    item.accent ? 'bg-[#0eb59a]/20 border border-[#0eb59a]/30' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <item.icon size={12} className={item.accent ? 'text-[#0eb59a]' : 'text-white/50'} />
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wide">{item.label}</p>
                  </div>
                  <p className={`text-lg font-black ${item.accent ? 'text-[#0eb59a]' : 'text-white'}`}>
                    {item.value}
                  </p>
                  {idx === 2 && (
                    <p className="text-[10px] text-white/40 font-semibold">{summary.nextPaymentDate}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SUMMARY CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: 'This Month', value: summary.thisMonth, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', trend: '+12% vs last month' },
            { label: 'In Escrow', value: summary.inEscrow, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400', trend: '3 milestones pending' },
            { label: 'Withdrawable', value: summary.availableToWithdraw, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400', trend: 'Available now' },
            { label: 'Active Clients', value: summary.totalEngagements, icon: Building, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-l-purple-400', trend: '2 engagements' },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.07 }}
              whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}
              className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${card.border} shadow-sm transition-all cursor-default group`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-2 leading-tight">
                  {card.label}
                </span>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}
                >
                  <card.icon size={17} className={card.color} />
                </motion.div>
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tight mb-1">{card.value}</p>
              <p className="text-[10px] text-gray-400 font-semibold">{card.trend}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── TABS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit"
        >
          {tabs.map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[#134e40] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left — Chart + recent */}
              <div className="lg:col-span-2 space-y-5">

                {/* Monthly earnings chart */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                      <BarChart2 size={16} className="text-[#0eb59a]" /> Monthly Earnings
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#134e40] to-[#0eb59a]" />
                      Milestone Payments
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="flex items-end gap-3 h-36 mb-4">
                    {monthlyData.map((bar, idx) => (
                      <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + idx * 0.08 }}
                          className="text-[10px] font-bold text-gray-400"
                        >
                          {bar.label}
                        </motion.span>
                        <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(bar.amount / 400) * 96}px` }}
                            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                            className={`w-full rounded-xl ${
                              bar.amount > 0
                                ? bar.month === 'Apr'
                                  ? 'bg-gradient-to-t from-[#134e40] to-[#0eb59a] ring-2 ring-[#0eb59a]/30'
                                  : 'bg-gradient-to-t from-[#134e40] to-[#0eb59a]'
                                : 'bg-gray-100'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-black text-gray-500">{bar.month}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">Year to Date (2025)</p>
                      <p className="text-lg font-black text-gray-900">₹10,50,000</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">Avg Monthly</p>
                      <p className="text-lg font-black text-gray-900">{summary.avgMonthly}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">Best Month</p>
                      <p className="text-lg font-black text-gray-900">₹3,50,000</p>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                      <Clock size={16} className="text-[#0eb59a]" /> Recent Activity
                    </h3>
                    <button
                      onClick={() => setActiveTab('Transactions')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {transactions.slice(0, 4).map((tx, idx) => {
                      const txIcon = getTxIcon(tx.type);
                      return (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-9 h-9 ${txIcon.bg} rounded-xl flex items-center justify-center shrink-0`}>
                            <txIcon.icon size={15} className={txIcon.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate leading-tight">{tx.description}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{tx.date}</p>
                          </div>
                          <span className={`text-xs font-black shrink-0 ${
                            tx.amountNum > 0 ? 'text-emerald-600' : 'text-gray-600'
                          }`}>
                            {tx.amount}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-5">

                {/* Withdraw CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="font-black text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Wallet size={15} className="text-[#0eb59a]" /> Available to Withdraw
                  </h3>
                  <p className="text-3xl font-black text-[#134e40] mb-1">{summary.availableToWithdraw}</p>
                  <p className="text-xs text-gray-400 font-semibold mb-4">From 2 completed milestones</p>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Landmark size={15} /> Withdraw Now
                  </motion.button>
                </motion.div>

                {/* Upcoming Payments */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                    <Target size={15} className="text-[#0eb59a]" /> Upcoming Payments
                  </h3>
                  <div className="space-y-3">
                    {[
                      { milestone: 'Investor Deck & Data Room', company: 'Acme Corp', amount: '₹2,50,000', date: 'Apr 30, 2025', logo: 'AC', logoColor: 'from-[#134e40] to-[#0eb59a]' },
                      { milestone: 'Investor Outreach', company: 'Acme Corp', amount: '₹3,00,000', date: 'May 31, 2025', logo: 'AC', logoColor: 'from-[#134e40] to-[#0eb59a]' },
                      { milestone: 'Due Diligence Report', company: 'TechScale', amount: '₹1,25,000', date: 'May 15, 2025', logo: 'TV', logoColor: 'from-blue-600 to-indigo-500' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + idx * 0.07 }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-[10px] font-black">{item.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.milestone}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{item.company} · {item.date}</p>
                        </div>
                        <p className="font-black text-[#134e40] text-sm shrink-0">{item.amount}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Platform fees note */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-gray-50 rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-2">
                    <Shield size={14} className="text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-gray-800 text-xs mb-1">Platform Fee</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        CXO Connect charges a <span className="font-black text-gray-700">10% platform fee</span> on each milestone payment. This covers PMO support, legal protection, and escrow management.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick actions */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-black text-gray-900 text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'View Invoices', icon: FileText, action: () => setActiveTab('Invoices') },
                      { label: 'Payout Settings', icon: Landmark, action: () => setActiveTab('Payouts') },
                      { label: 'Download Statement', icon: Download, action: () => {} },
                    ].map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#0eb59a] transition-all"
                      >
                        <item.icon size={15} className="text-[#0eb59a]" />
                        {item.label}
                        <ChevronRight size={13} className="ml-auto text-gray-300" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ TRANSACTIONS TAB ══ */}
          {activeTab === 'Transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm max-w-md"
                />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm">
                    All Transactions
                    <span className="ml-2 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                      {filteredTransactions.length}
                    </span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors"
                  >
                    <Download size={13} /> Export CSV
                  </motion.button>
                </div>

                <div className="divide-y divide-gray-50">
                  {filteredTransactions.map((tx, idx) => {
                    const txIcon = getTxIcon(tx.type);
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-10 h-10 ${txIcon.bg} rounded-xl flex items-center justify-center shrink-0`}>
                          <txIcon.icon size={17} className={txIcon.color} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{tx.description}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-xs text-gray-400 font-semibold">{tx.engagement !== '—' ? tx.engagement : tx.company}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-black text-base ${
                            tx.amountNum > 0 ? 'text-emerald-600' : 'text-gray-700'
                          }`}>
                            {tx.amount}
                          </p>
                          <p className="text-[10px] text-gray-400 font-semibold">
                            {tx.date !== '—' ? `${tx.date} · ${tx.time}` : 'Pending'}
                          </p>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getStatusStyle(tx.status)}`}>
                            {tx.status}
                          </span>
                          <span className="text-[10px] text-gray-300 font-semibold">{tx.txRef}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ INVOICES TAB ══ */}
          {activeTab === 'Invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-base">
                  All Invoices <span className="text-sm font-bold text-gray-400">({invoices.length})</span>
                </h3>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors"
                >
                  <Download size={13} /> Export All
                </motion.button>
              </div>

              {invoices.map((invoice, idx) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 group transition-all"
                >
                  {/* Company logo */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${invoice.logoColor} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-black text-sm">{invoice.companyLogo}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-gray-900 text-sm truncate">{invoice.title}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${getStatusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-semibold">
                      <span>{invoice.id}</span>
                      <span>·</span>
                      <span>{invoice.company}</span>
                      <span>·</span>
                      <span>{invoice.type}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {invoice.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-900 text-xl">{invoice.amount}</p>
                    {invoice.status === 'Pending' && (
                      <p className="text-[10px] text-amber-500 font-bold">Awaiting approval</p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowInvoiceModal(invoice)}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all"
                    >
                      <Eye size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Download size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ══ PAYOUTS TAB ══ */}
          {activeTab === 'Payouts' && (
            <motion.div
              key="payouts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left — Payout accounts */}
              <div className="lg:col-span-2 space-y-5">

                {/* Withdraw CTA banner */}
                <div className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-6 text-white relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Ready to Withdraw</p>
                      <p className="text-3xl font-black mb-1">{summary.availableToWithdraw}</p>
                      <p className="text-white/60 text-xs">Clears to your bank in 1-2 business days</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowWithdrawModal(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-sm font-black rounded-2xl transition-all shadow-lg shrink-0"
                    >
                      <Landmark size={15} /> Withdraw Now
                    </motion.button>
                  </div>
                </div>

                {/* Payout accounts */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-gray-900 text-base">Payout Accounts</h3>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-2 text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors"
                    >
                      <Plus size={13} /> Add Account
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {payoutAccounts.map((account) => (
                      <motion.div
                        key={account.id}
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#0eb59a]/30 hover:bg-teal-50/30 transition-all cursor-pointer"
                      >
                        <span className="text-2xl shrink-0">{account.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-gray-900 text-sm">{account.label}</p>
                            {account.verified && (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                                <Check size={8} strokeWidth={3} /> Verified
                              </span>
                            )}
                            {account.default && (
                              <span className="text-[9px] font-black text-[#134e40] bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">{account.detail}</p>
                        </div>
                        <ChevronRight size={15} className="text-gray-300" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Payout history */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h3 className="font-black text-gray-900 text-sm">Payout History</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {payoutHistory.map((payout, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                          <Landmark size={16} className="text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{payout.method}</p>
                          <p className="text-xs text-gray-400 font-semibold">{payout.date} · Cleared in {payout.days} day</p>
                        </div>
                        <p className="font-black text-gray-900">{payout.amount}</p>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {payout.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Info */}
              <div className="space-y-5">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                    <Shield size={14} className="text-[#0eb59a]" /> Payout Policy
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Processing Time', value: '1-2 business days' },
                      { label: 'Minimum Withdrawal', value: '₹10,000' },
                      { label: 'Platform Fee', value: '10% per milestone' },
                      { label: 'TDS Deduction', value: '10% (Form 16A issued)' },
                      { label: 'GST', value: 'Applicable as per slab' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-gray-400 font-semibold">{item.label}</span>
                        <span className="font-bold text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-50 rounded-2xl border border-teal-100 p-4">
                  <p className="font-black text-[#134e40] text-sm mb-2 flex items-center gap-2">
                    <Star size={13} fill="#0eb59a" className="text-[#0eb59a]" /> Tax Benefits
                  </p>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    All invoices are GST-compliant. Form 16A is issued each quarter for TDS deductions. Download your tax statement from the Invoices tab.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══ WITHDRAW MODAL ══ */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <AnimatePresence mode="wait">
                {!withdrawSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">Withdraw Funds</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Available: {summary.availableToWithdraw}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(''); }}
                        className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>

                    {/* Quick amounts */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {quickAmounts.map(amount => (
                          <motion.button
                            key={amount}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setWithdrawAmount(amount)}
                            className={`py-3 rounded-2xl text-sm font-black border-2 transition-all ${
                              withdrawAmount === amount
                                ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            {amount}
                          </motion.button>
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="text"
                          placeholder="Enter custom amount..."
                          value={withdrawAmount.startsWith('₹') ? '' : withdrawAmount}
                          onChange={e => setWithdrawAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Payout method */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                        Payout To
                      </label>
                      <div className="space-y-2">
                        {payoutAccounts.map(account => (
                          <motion.button
                            key={account.id}
                            whileHover={{ x: 3 }}
                            onClick={() => setSelectedPayout(account.id)}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                              selectedPayout === account.id
                                ? 'border-[#0eb59a] bg-teal-50'
                                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                            }`}
                          >
                            <span className="text-xl shrink-0">{account.icon}</span>
                            <div className="flex-1">
                              <p className={`text-sm font-black ${selectedPayout === account.id ? 'text-[#134e40]' : 'text-gray-700'}`}>
                                {account.label}
                              </p>
                              <p className="text-xs text-gray-400 font-semibold">{account.detail}</p>
                            </div>
                            {selectedPayout === account.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-[#0eb59a] rounded-full flex items-center justify-center shrink-0"
                              >
                                <Check size={11} className="text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-teal-50 rounded-xl border border-teal-100 mb-5">
                      <Clock size={14} className="text-[#0eb59a] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-teal-700 leading-relaxed">
                        Funds will appear in your account within <span className="font-black">1-2 business days</span>. TDS of 10% will be deducted as per Income Tax Act.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: withdrawAmount ? 1.02 : 1, boxShadow: withdrawAmount ? '0 8px 25px rgba(20,78,64,0.25)' : 'none' }}
                        whileTap={{ scale: withdrawAmount ? 0.98 : 1 }}
                        disabled={!withdrawAmount}
                        onClick={handleWithdraw}
                        className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                          withdrawAmount
                            ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Landmark size={14} className="inline mr-1.5" />
                        Withdraw {withdrawAmount || 'Funds'}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#0eb59a]"
                    >
                      <Check size={36} className="text-[#0eb59a]" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Withdrawal Initiated!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      <span className="font-bold text-gray-700">{withdrawAmount}</span> is being transferred to your account. It will appear within 1-2 business days.
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: 2 }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100"
                    >
                      <Shield size={12} /> Secured by CXO Connect
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ INVOICE PREVIEW MODAL ══ */}
      <AnimatePresence>
        {showInvoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-0.5">Invoice</p>
                  <h3 className="text-lg font-black text-gray-900">{showInvoiceModal.id}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowInvoiceModal(null)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-5 space-y-3">
                {[
                  { label: 'Description', value: showInvoiceModal.title },
                  { label: 'Company', value: showInvoiceModal.company },
                  { label: 'Engagement', value: showInvoiceModal.engagement },
                  { label: 'Invoice Date', value: showInvoiceModal.date },
                  { label: 'Type', value: showInvoiceModal.type },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400 font-semibold">{item.label}</span>
                    <span className="font-bold text-gray-800 text-right max-w-[200px]">{item.value}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between">
                  <span className="font-black text-gray-900">Amount</span>
                  <span className="font-black text-2xl text-[#134e40]">{showInvoiceModal.amount}</span>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border mb-5 ${getStatusStyle(showInvoiceModal.status)}`}>
                {showInvoiceModal.status === 'Paid' ? <Check size={11} strokeWidth={3} /> : <Clock size={11} />}
                {showInvoiceModal.status}
              </span>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowInvoiceModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download PDF
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertEarnings;
