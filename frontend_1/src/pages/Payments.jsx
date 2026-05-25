import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, DollarSign, TrendingUp, Lock,
  Unlock, Shield, Download, Search, Filter,
  X, Check, AlertCircle, Calendar, Briefcase,
  ArrowUpRight, ArrowDownLeft, Clock, CreditCard,
  Plus, Eye, RefreshCw, CheckCircle, Zap,
  Building, FileText, ChevronDown, Users,
  IndianRupee, Wallet, BarChart2, Target
} from 'lucide-react';

const Payments = () => {
  const navigate = useNavigate();

  // Authentication Guard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/signin?role=company');
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [addFundsSent, setAddFundsSent] = useState(false);
  const [releaseSent, setReleaseSent] = useState(false);

  const tabs = ['Overview', 'Transactions', 'Invoices', 'Escrow'];

  // ── DATA ──
  const escrowSummary = {
    totalBalance: '₹6,0,000',
    totalBalanceNum: 600000,
    totalSpent: '₹9,0,000',
    totalSpentNum: 900000,
    pendingRelease: '₹2,50,000',
    pendingReleaseNum: 250000,
    totalEngagementValue: '₹18,00,000',
  };

  const escrowAccounts = [
    {
      id: 1,
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      balance: '₹2,50,000',
      balanceNum: 250000,
      status: 'Active',
      pendingMilestone: 'Investor Deck & Data Room',
      totalValue: '₹18,00,000',
      released: '₹3,50,000',
    },
    {
      id: 2,
      engagement: 'Go-to-Market Expansion',
      expert: 'Sarah Jenkins',
      expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
      balance: '₹3,50,000',
      balanceNum: 350000,
      status: 'Active',
      pendingMilestone: 'Campaign Launch',
      totalValue: '₹9,00,000',
      released: '₹5,50,000',
    },
  ];

  const transactions = [
    {
      id: 'TXN-005-2025',
      type: 'milestone_release',
      description: 'Milestone Payment — Financial Model Development',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '-₹2,00,000',
      amountNum: -200000,
      date: 'Mar 28, 2025',
      time: '3:45 PM',
      status: 'Completed',
      method: 'Escrow Release',
      txRef: 'TXN-005-2025',
    },
    {
      id: 'TXN-004-2025',
      type: 'escrow_add',
      description: 'Funds Added to Escrow',
      engagement: 'Go-to-Market Expansion',
      expert: 'Sarah Jenkins',
      expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
      amount: '+₹9,00,000',
      amountNum: 900000,
      date: 'Feb 27, 2025',
      time: '11:20 AM',
      status: 'Completed',
      method: 'Net Banking',
      txRef: 'TXN-004-2025',
    },
    {
      id: 'TXN-003-2025',
      type: 'milestone_release',
      description: 'Milestone Payment — Discovery & Assessment',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '-₹1,50,000',
      amountNum: -150000,
      date: 'Feb 25, 2025',
      time: '5:00 PM',
      status: 'Completed',
      method: 'Escrow Release',
      txRef: 'TXN-003-2025',
    },
    {
      id: 'TXN-002-2025',
      type: 'escrow_add',
      description: 'Funds Added to Escrow',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '+₹18,00,000',
      amountNum: 1800000,
      date: 'Feb 1, 2025',
      time: '10:00 AM',
      status: 'Completed',
      method: 'NEFT',
      txRef: 'TXN-002-2025',
    },
    {
      id: 'TXN-001-2025',
      type: 'platform_fee',
      description: 'Platform Fee — Engagement Setup',
      engagement: 'Series B Funding Strategy',
      expert: '—',
      expertAvatar: null,
      amount: '-₹27,000',
      amountNum: -27000,
      date: 'Feb 1, 2025',
      time: '10:05 AM',
      status: 'Completed',
      method: 'Auto-debit',
      txRef: 'TXN-001-2025',
    },
    {
      id: 'TXN-006-2025',
      type: 'milestone_release',
      description: 'Milestone Payment — Campaign Strategy',
      engagement: 'Go-to-Market Expansion',
      expert: 'Sarah Jenkins',
      expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
      amount: '-₹1,50,000',
      amountNum: -150000,
      date: 'Apr 1, 2025',
      time: '2:30 PM',
      status: 'Completed',
      method: 'Escrow Release',
      txRef: 'TXN-006-2025',
    },
    {
      id: 'TXN-007-2025',
      type: 'milestone_release',
      description: 'Milestone Payment — Pending Approval',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '-₹2,50,000',
      amountNum: -250000,
      date: '—',
      time: '—',
      status: 'Pending',
      method: 'Escrow Release',
      txRef: 'TXN-007-2025',
    },
  ];

  const invoices = [
    {
      id: 'INV-2025-006',
      title: 'March 2025 — Financial Model Development',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '₹2,00,000',
      date: 'Mar 28, 2025',
      dueDate: 'Mar 28, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-2025-005',
      title: 'Campaign Strategy Completion',
      engagement: 'Go-to-Market Expansion',
      expert: 'Sarah Jenkins',
      expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
      amount: '₹1,50,000',
      date: 'Apr 1, 2025',
      dueDate: 'Apr 1, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-2025-004',
      title: 'Investor Deck & Data Room',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '₹2,50,000',
      date: 'Apr 25, 2025',
      dueDate: 'May 5, 2025',
      status: 'Pending',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-2025-003',
      title: 'Platform Service Fee — Q1 2025',
      engagement: 'All Engagements',
      expert: 'CXO Connect',
      expertAvatar: null,
      amount: '₹27,000',
      date: 'Feb 1, 2025',
      dueDate: 'Feb 1, 2025',
      status: 'Paid',
      type: 'Platform Fee',
    },
    {
      id: 'INV-2025-002',
      title: 'February 2025 — Discovery & Assessment',
      engagement: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      amount: '₹1,50,000',
      date: 'Feb 25, 2025',
      dueDate: 'Feb 25, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
  ];

  const quickAmounts = ['₹1,0,000', '₹2,50,000', '₹5,0,000', '₹10,00,000'];
  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: '🔵', desc: 'Instant transfer' },
    { id: 'neft', label: 'NEFT / IMPS', icon: '🏦', desc: '2-4 hours' },
    { id: 'netsbanking', label: 'Net Banking', icon: '💻', desc: 'Instant' },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: '+ 2% fee' },
  ];

  // ── HELPERS ──
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'Paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const getTxIcon = (type) => {
    switch (type) {
      case 'milestone_release': return { icon: Unlock, color: 'text-red-500', bg: 'bg-red-50' };
      case 'escrow_add': return { icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'platform_fee': return { icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: DollarSign, color: 'text-gray-400', bg: 'bg-gray-50' };
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.engagement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.expert.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'All' || tx.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const handleAddFunds = () => {
    setAddFundsSent(true);
    setTimeout(() => {
      setShowAddFundsModal(false);
      setAddFundsSent(false);
      setSelectedAmount('');
      setCustomAmount('');
      setPaymentMethod('upi');
    }, 2000);
  };

  const handleRelease = () => {
    setReleaseSent(true);
    setTimeout(() => {
      setShowReleaseModal(null);
      setReleaseSent(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 pb-16 space-y-6">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/company-dashboard')}
                className="text-gray-400 hover:text-[#0eb59a] text-sm font-semibold transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-700">Payments</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Payments & Escrow
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage escrow funds, milestone payments, and invoices
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
              onClick={() => setShowAddFundsModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg"
            >
              <Plus size={15} /> Add Funds
            </motion.button>
          </div>
        </motion.div>

        {/* ── SUMMARY CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: 'Total Escrow Balance',
              value: escrowSummary.totalBalance,
              icon: Wallet,
              color: 'text-teal-500',
              bg: 'bg-teal-50',
              border: 'border-l-[#0eb59a]',
              desc: 'Secured funds',
              trend: null,
            },
            {
              label: 'Total Released',
              value: escrowSummary.totalSpent,
              icon: Unlock,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
              border: 'border-l-emerald-400',
              desc: '4 milestones paid',
              trend: '+₹2L this month',
            },
            {
              label: 'Pending Release',
              value: escrowSummary.pendingRelease,
              icon: Clock,
              color: 'text-amber-500',
              bg: 'bg-amber-50',
              border: 'border-l-amber-400',
              desc: 'Awaiting approval',
              trend: '1 milestone',
            },
            {
              label: 'Total Committed',
              value: escrowSummary.totalEngagementValue,
              icon: Target,
              color: 'text-purple-500',
              bg: 'bg-purple-50',
              border: 'border-l-purple-400',
              desc: 'Across 2 engagements',
              trend: null,
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + idx * 0.07 }}
              whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}
              className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${card.border} shadow-sm transition-all duration-300 cursor-default group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight pr-2">
                    {card.label}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <card.icon size={17} className={card.color} />
                  </motion.div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{card.value}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{card.desc}</p>
                {card.trend && (
                  <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-lg">
                    <ArrowUpRight size={10} /> {card.trend}
                  </div>
                )}
              </div>
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#0eb59a] to-transparent`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left — Escrow accounts + spend chart */}
              <div className="lg:col-span-2 space-y-5">

                {/* Escrow Accounts */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                      <Lock size={16} className="text-[#0eb59a]" /> Active Escrow Accounts
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAddFundsModal(true)}
                      className="flex items-center gap-2 text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors"
                    >
                      <Plus size={13} /> Add Funds
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {escrowAccounts.map((account, idx) => (
                      <motion.div
                        key={account.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -3 }}
                        className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100 hover:border-[#0eb59a]/30 hover:shadow-md transition-all"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={account.expertAvatar}
                                className="w-10 h-10 rounded-xl object-cover shadow-sm"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                              />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm">{account.engagement}</p>
                              <p className="text-xs text-gray-400 font-semibold">with {account.expert}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-[#134e40]">{account.balance}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">in escrow</p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-400 font-semibold">
                              Released: {account.released} of {account.totalValue}
                            </span>
                            <span className="font-black text-[#134e40]">
                              {Math.round((parseInt(account.released.replace(/[₹,]/g, '')) / parseInt(account.totalValue.replace(/[₹,]/g, ''))) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.round((parseInt(account.released.replace(/[₹,]/g, '')) / parseInt(account.totalValue.replace(/[₹,]/g, ''))) * 100)}%`
                              }}
                              transition={{ duration: 1.2, delay: 0.3 + idx * 0.1 }}
                              className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full relative overflow-hidden"
                            >
                              <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                              />
                            </motion.div>
                          </div>
                        </div>

                        {/* Pending milestone */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                            <Target size={11} className="text-amber-500" />
                            Next: {account.pendingMilestone}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowReleaseModal(account)}
                            className="text-xs font-black text-[#0eb59a] hover:text-[#134e40] border border-teal-100 hover:border-teal-200 bg-teal-50 px-3 py-1.5 rounded-xl transition-all"
                          >
                            Release Payment
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Monthly spend visual */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 text-base flex items-center gap-2 mb-5">
                    <BarChart2 size={16} className="text-[#0eb59a]" /> Monthly Spend
                  </h3>
                  <div className="flex items-end gap-3 h-32">
                    {[
                      { month: 'Feb', amount: 350, label: '₹3.5L' },
                      { month: 'Mar', amount: 200, label: '₹2L' },
                      { month: 'Apr', amount: 400, label: '₹4L' },
                      { month: 'May', amount: 0, label: '—' },
                      { month: 'Jun', amount: 0, label: '—' },
                      { month: 'Jul', amount: 0, label: '—' },
                    ].map((bar, idx) => (
                      <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">{bar.label}</span>
                        <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(bar.amount / 500) * 80}px` }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                            className={`w-full rounded-xl ${
                              bar.amount > 0
                                ? 'bg-gradient-to-t from-[#134e40] to-[#0eb59a]'
                                : 'bg-gray-100'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Recent activity + escrow info */}
              <div className="space-y-5">

                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                      <Clock size={14} className="text-[#0eb59a]" /> Recent Activity
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
                            tx.amountNum > 0 ? 'text-emerald-600' : 'text-gray-700'
                          }`}>
                            {tx.amount}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Escrow Protection */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="absolute -right-2 -bottom-4 w-16 h-16 bg-[#0eb59a]/10 rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#0eb59a]/20 rounded-xl flex items-center justify-center">
                        <Shield size={16} className="text-[#0eb59a]" />
                      </div>
                      <h4 className="font-black text-sm">Escrow Protection</h4>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed mb-4">
                      Your funds are held securely in an RBI-compliant escrow account. Released only when you approve milestones.
                    </p>
                    <div className="space-y-2">
                      {[
                        'RBI-compliant escrow',
                        'Instant release on approval',
                        'Full dispute protection',
                        'Platform PMO monitoring',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/70 font-semibold">
                          <Check size={11} className="text-[#0eb59a] shrink-0" strokeWidth={3} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Quick actions */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-black text-gray-900 text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Add Funds to Escrow', icon: Plus, action: () => setShowAddFundsModal(true), color: 'text-[#0eb59a]' },
                      { label: 'View Invoices', icon: FileText, action: () => setActiveTab('Invoices'), color: 'text-blue-500' },
                      { label: 'Download Statement', icon: Download, action: () => {}, color: 'text-purple-500' },
                      { label: 'View Contracts', icon: Lock, action: () => navigate('/contracts'), color: 'text-amber-500' },
                    ].map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                      >
                        <item.icon size={15} className={item.color} />
                        {item.label}
                        <ChevronRight size={13} className="ml-auto text-gray-300" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TRANSACTIONS TAB ── */}
          {activeTab === 'Transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Search + Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm"
                  />
                </div>
                <div className="flex gap-2">
                  {['All', 'Completed', 'Pending'].map(f => (
                    <motion.button
                      key={f}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setFilterStatus(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterStatus === f
                          ? 'bg-[#134e40] text-white shadow-md'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0eb59a]/40'
                      }`}
                    >
                      {f}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Transactions Table */}
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
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`w-10 h-10 ${txIcon.bg} rounded-xl flex items-center justify-center shrink-0`}>
                          <txIcon.icon size={17} className={txIcon.color} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{tx.description}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-xs text-gray-400 font-semibold">{tx.engagement}</p>
                            {tx.expertAvatar && (
                              <div className="flex items-center gap-1">
                                <img src={tx.expertAvatar} className="w-4 h-4 rounded-full object-cover" />
                                <span className="text-[10px] text-gray-400 font-semibold">{tx.expert}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`font-black text-base ${
                            tx.amountNum > 0 ? 'text-emerald-600' : 'text-gray-800'
                          }`}>
                            {tx.amount}
                          </p>
                          <p className="text-[10px] text-gray-400 font-semibold">{tx.date} {tx.time !== '—' ? `· ${tx.time}` : ''}</p>
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

          {/* ── INVOICES TAB ── */}
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
                  All Invoices
                  <span className="ml-2 text-sm font-bold text-gray-400">({invoices.length})</span>
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
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-blue-500" />
                  </div>

                  {/* Info */}
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
                      <span className="flex items-center gap-1">
                        {invoice.expertAvatar && <img src={invoice.expertAvatar} className="w-3.5 h-3.5 rounded-full object-cover" />}
                        {invoice.expert}
                      </span>
                      <span>·</span>
                      <span>{invoice.type}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {invoice.date}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-900 text-xl">{invoice.amount}</p>
                    {invoice.status === 'Pending' && (
                      <p className="text-[10px] text-amber-500 font-bold">Due {invoice.dueDate}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowInvoiceModal(invoice)}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all"
                    >
                      <Eye size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Download size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── ESCROW TAB ── */}
          {activeTab === 'Escrow' && (
            <motion.div
              key="escrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Escrow explainer */}
              <div className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#0eb59a]/10 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={20} className="text-[#0eb59a]" />
                      <h3 className="font-black text-lg">How Escrow Works</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      CXO Connect uses an RBI-compliant escrow mechanism to ensure both parties are protected throughout the engagement.
                    </p>
                    <div className="flex items-center gap-2">
                      {[
                        { step: '1', label: 'You Add Funds' },
                        { step: '→', label: '' },
                        { step: '2', label: 'Held Securely' },
                        { step: '→', label: '' },
                        { step: '3', label: 'You Approve' },
                        { step: '→', label: '' },
                        { step: '4', label: 'Expert Paid' },
                      ].map((item, idx) => (
                        item.step === '→' ? (
                          <ChevronRight key={idx} size={14} className="text-white/30" />
                        ) : (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <div className="w-7 h-7 bg-[#0eb59a]/20 border border-[#0eb59a]/30 rounded-full flex items-center justify-center">
                              <span className="text-[10px] font-black text-[#0eb59a]">{item.step}</span>
                            </div>
                            <span className="text-[9px] font-bold text-white/50 whitespace-nowrap">{item.label}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAddFundsModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-sm font-black rounded-2xl transition-all shadow-lg shrink-0"
                  >
                    <Plus size={15} /> Add Funds Now
                  </motion.button>
                </div>
              </div>

              {/* Escrow accounts detail */}
              <div className="space-y-4">
                {escrowAccounts.map((account, idx) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <img src={account.expertAvatar} className="w-11 h-11 rounded-2xl object-cover" />
                        <div>
                          <h4 className="font-black text-gray-900 text-sm">{account.engagement}</h4>
                          <p className="text-xs text-gray-400 font-semibold">with {account.expert}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#134e40]">{account.balance}</p>
                        <p className="text-xs text-gray-400 font-semibold">current escrow balance</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-5">
                      {[
                        { label: 'Total Value', value: account.totalValue, color: 'text-gray-700' },
                        { label: 'Released', value: account.released, color: 'text-emerald-600' },
                        { label: 'In Escrow', value: account.balance, color: 'text-[#134e40]' },
                      ].map((item, iIdx) => (
                        <div key={iIdx} className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center">
                          <p className={`font-black text-base ${item.color}`}>{item.value}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowReleaseModal(account)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-2xl shadow-md transition-all"
                      >
                        <Unlock size={15} /> Release Milestone Payment
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAddFundsModal(true)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-600 text-sm font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                      >
                        <Plus size={15} /> Top Up
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══ ADD FUNDS MODAL ══ */}
      <AnimatePresence>
        {showAddFundsModal && (
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
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <AnimatePresence mode="wait">
                {!addFundsSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">Add Funds to Escrow</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Funds are secured immediately on transfer</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setShowAddFundsModal(false); setSelectedAmount(''); setCustomAmount(''); }}
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
                            onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                            className={`py-3 rounded-2xl text-sm font-black border-2 transition-all ${
                              selectedAmount === amount
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
                          value={customAmount}
                          onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(''); }}
                          className="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Payment method */}
                    <div className="mb-6">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                        Payment Method
                      </label>
                      <div className="space-y-2">
                        {paymentMethods.map(method => (
                          <motion.button
                            key={method.id}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                              paymentMethod === method.id
                                ? 'border-[#0eb59a] bg-teal-50'
                                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                            }`}
                          >
                            <span className="text-xl shrink-0">{method.icon}</span>
                            <div className="flex-1">
                              <p className={`text-sm font-black ${paymentMethod === method.id ? 'text-[#134e40]' : 'text-gray-700'}`}>
                                {method.label}
                              </p>
                              <p className="text-xs text-gray-400 font-semibold">{method.desc}</p>
                            </div>
                            {paymentMethod === method.id && (
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

                    {/* Security notice */}
                    <div className="flex items-start gap-2 p-3 bg-teal-50 rounded-xl border border-teal-100 mb-5">
                      <Shield size={14} className="text-[#0eb59a] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-teal-700 leading-relaxed">
                        Funds are transferred to an RBI-compliant escrow account. You retain full control and can request a refund for unused balances.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowAddFundsModal(false); setSelectedAmount(''); setCustomAmount(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: (selectedAmount || customAmount) ? 1.02 : 1 }}
                        whileTap={{ scale: (selectedAmount || customAmount) ? 0.98 : 1 }}
                        disabled={!selectedAmount && !customAmount}
                        onClick={handleAddFunds}
                        className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                          selectedAmount || customAmount
                            ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={14} className="inline mr-1.5" />
                        Add {selectedAmount || (customAmount ? `₹${customAmount}` : 'Funds')}
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
                    <h3 className="text-xl font-black text-gray-900 mb-2">Funds Added!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {selectedAmount || `₹${customAmount}`} has been added to your escrow account and is ready for milestone releases.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ RELEASE PAYMENT MODAL ══ */}
      <AnimatePresence>
        {showReleaseModal && (
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
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
            >
              <AnimatePresence mode="wait">
                {!releaseSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                      <Unlock size={28} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 text-center mb-2">Release Payment</h3>
                    <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                      You are releasing payment for the pending milestone in
                      <span className="font-bold text-gray-700"> {showReleaseModal.engagement}</span>
                    </p>

                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 text-center mb-5">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">Releasing</p>
                      <p className="text-4xl font-black text-emerald-700">{showReleaseModal.balance}</p>
                      <p className="text-xs text-emerald-600 mt-1 font-semibold">
                        to {showReleaseModal.expert}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs mb-5">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Milestone</span>
                        <span className="font-bold text-gray-700">{showReleaseModal.pendingMilestone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Transfer to</span>
                        <span className="font-bold text-gray-700">{showReleaseModal.expert}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Estimated arrival</span>
                        <span className="font-bold text-emerald-600">Within 24 hours</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowReleaseModal(null)}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRelease}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-2xl shadow-md transition-all"
                      >
                        <Unlock size={14} className="inline mr-1.5" />
                        Confirm Release
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
                      className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-500"
                    >
                      <Check size={36} className="text-emerald-500" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Payment Released!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {showReleaseModal?.balance} will be transferred to {showReleaseModal?.expert} within 24 hours.
                    </p>
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
              {/* Invoice header */}
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

              {/* Invoice details */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Description</span>
                  <span className="font-bold text-gray-800 text-right max-w-[200px]">{showInvoiceModal.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Expert</span>
                  <div className="flex items-center gap-1.5">
                    {showInvoiceModal.expertAvatar && (
                      <img src={showInvoiceModal.expertAvatar} className="w-5 h-5 rounded-full object-cover" />
                    )}
                    <span className="font-bold text-gray-800">{showInvoiceModal.expert}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Engagement</span>
                  <span className="font-bold text-gray-800">{showInvoiceModal.engagement}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Invoice Date</span>
                  <span className="font-bold text-gray-800">{showInvoiceModal.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Due Date</span>
                  <span className="font-bold text-gray-800">{showInvoiceModal.dueDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Type</span>
                  <span className="font-bold text-gray-800">{showInvoiceModal.type}</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between">
                  <span className="font-black text-gray-900">Total Amount</span>
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
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInvoiceModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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

export default Payments;
