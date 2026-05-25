import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Clock, CheckCircle, XCircle,
  Upload, Download, Send, Paperclip, MoreVertical,
  DollarSign, Shield, AlertCircle, Calendar,
  FileText, MessageSquare, BarChart2, CreditCard,
  Check, X, Star, Users, Briefcase, ArrowLeft,
  Lock, Unlock, Eye, TrendingUp, Zap, Circle,
  ChevronDown, Image, File, Film, Archive
} from 'lucide-react';

const EngagementWorkspace = () => {
  const navigate = useNavigate();
  const { engagementId } = useParams();

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
  const [messageText, setMessageText] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'expert',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?u=david',
      text: 'Hi team, I have completed the initial financial model draft. Please review the attached document and let me know your feedback.',
      time: '10:30 AM',
      date: 'Today',
      read: true,
    },
    {
      id: 2,
      sender: 'company',
      name: 'Acme Corp',
      avatar: '',
      text: 'Thanks David! We will review it today and get back to you with feedback by EOD.',
      time: '11:15 AM',
      date: 'Today',
      read: true,
    },
    {
      id: 3,
      sender: 'expert',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?u=david',
      text: 'Perfect. Also, I wanted to flag that the investor deck needs to be updated with Q4 numbers before the next board meeting. Should we schedule a call this week?',
      time: '2:45 PM',
      date: 'Today',
      read: true,
    },
    {
      id: 4,
      sender: 'company',
      name: 'Acme Corp',
      avatar: '',
      text: 'Yes, let us schedule Thursday 3pm. I will send a calendar invite.',
      time: '3:10 PM',
      date: 'Today',
      read: true,
    },
  ]);

  const tabs = [
    { id: 'Overview', icon: BarChart2 },
    { id: 'Milestones', icon: CheckCircle },
    { id: 'Messages', icon: MessageSquare },
    { id: 'Documents', icon: FileText },
    { id: 'Payments', icon: CreditCard },
  ];

  // ── ENGAGEMENT DATA ──
  const engagement = {
    id: engagementId || '1',
    title: 'Series B Funding Strategy',
    status: 'IN PROGRESS',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
    expert: {
      name: 'David Chen',
      title: 'Interim CFO',
      avatar: 'https://i.pravatar.cc/150?u=david',
      rating: 5.0,
      exRole: 'Ex-CFO at Meesho & OYO',
    },
    type: 'Interim',
    startDate: '1 Feb 2025',
    endDate: '31 Jul 2025',
    duration: '6 months',
    commitment: '40 hrs/wk',
    budget: '₹3L/mo',
    totalValue: '₹18L',
    escrowBalance: '₹6L',
    spent: '₹9L',
    progress: 65,
    nextMilestone: 'Financial Model Draft',
    daysLeft: 87,
    pmContact: 'Riya Sharma',
    pmEmail: 'riya@cxoconnect.com',
  };

  const milestones = [
    {
      id: 1,
      title: 'Discovery & Assessment',
      desc: 'Initial business assessment, stakeholder interviews, and financial health review',
      dueDate: 'Feb 28, 2025',
      completedDate: 'Feb 25, 2025',
      status: 'completed',
      payment: '₹1.5L',
      paymentStatus: 'released',
      deliverables: [
        { name: 'Business Assessment Report.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Financial Health Summary.xlsx', size: '1.1 MB', type: 'excel' },
      ],
    },
    {
      id: 2,
      title: 'Financial Model Development',
      desc: 'Build 3-year financial model, unit economics analysis, and fundraising materials',
      dueDate: 'Mar 31, 2025',
      completedDate: 'Mar 28, 2025',
      status: 'completed',
      payment: '₹2L',
      paymentStatus: 'released',
      deliverables: [
        { name: 'Financial Model v2.xlsx', size: '3.8 MB', type: 'excel' },
        { name: 'Unit Economics Analysis.pdf', size: '1.6 MB', type: 'pdf' },
        { name: 'Fundraising Narrative.pptx', size: '5.2 MB', type: 'ppt' },
      ],
    },
    {
      id: 3,
      title: 'Investor Deck & Data Room',
      desc: 'Create investor presentation, prepare data room, and investor outreach list',
      dueDate: 'Apr 30, 2025',
      completedDate: null,
      status: 'pending_approval',
      payment: '₹2.5L',
      paymentStatus: 'in_escrow',
      deliverables: [
        { name: 'Investor Deck Final.pptx', size: '8.4 MB', type: 'ppt' },
        { name: 'Data Room Index.pdf', size: '0.8 MB', type: 'pdf' },
      ],
    },
    {
      id: 4,
      title: 'Investor Outreach & Roadshow',
      desc: 'Lead investor outreach, manage roadshow schedule, and prepare management for meetings',
      dueDate: 'May 31, 2025',
      completedDate: null,
      status: 'in_progress',
      payment: '₹3L',
      paymentStatus: 'locked',
      deliverables: [],
    },
    {
      id: 5,
      title: 'Term Sheet & Due Diligence Support',
      desc: 'Negotiate term sheets, support legal due diligence, and close the round',
      dueDate: 'Jul 31, 2025',
      completedDate: null,
      status: 'upcoming',
      payment: '₹2.5L',
      paymentStatus: 'locked',
      deliverables: [],
    },
  ];

  const documents = [
    { id: 1, name: 'Engagement Agreement.pdf', size: '1.2 MB', type: 'pdf', uploadedBy: 'CXO Connect', date: 'Feb 1, 2025', category: 'Legal', signed: true },
    { id: 2, name: 'NDA — Acme Corp & David Chen.pdf', size: '0.6 MB', type: 'pdf', uploadedBy: 'CXO Connect', date: 'Feb 1, 2025', category: 'Legal', signed: true },
    { id: 3, name: 'Financial Model v2.xlsx', size: '3.8 MB', type: 'excel', uploadedBy: 'David Chen', date: 'Mar 28, 2025', category: 'Deliverable', signed: false },
    { id: 4, name: 'Investor Deck Final.pptx', size: '8.4 MB', type: 'ppt', uploadedBy: 'David Chen', date: 'Apr 25, 2025', category: 'Deliverable', signed: false },
    { id: 5, name: 'Data Room Index.pdf', size: '0.8 MB', type: 'pdf', uploadedBy: 'David Chen', date: 'Apr 25, 2025', category: 'Deliverable', signed: false },
    { id: 6, name: 'Business Assessment Report.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'David Chen', date: 'Feb 25, 2025', category: 'Deliverable', signed: false },
  ];

  const payments = [
    { id: 1, milestone: 'Discovery & Assessment', amount: '₹1,50,000', date: 'Feb 25, 2025', status: 'released', txId: 'TXN-001-2025' },
    { id: 2, milestone: 'Financial Model Development', amount: '₹2,00,000', date: 'Mar 28, 2025', status: 'released', txId: 'TXN-002-2025' },
    { id: 3, milestone: 'Investor Deck & Data Room', amount: '₹2,50,000', date: '—', status: 'in_escrow', txId: 'TXN-003-2025' },
    { id: 4, milestone: 'Investor Outreach & Roadshow', amount: '₹3,00,000', date: '—', status: 'locked', txId: '—' },
    { id: 5, milestone: 'Term Sheet & Due Diligence', amount: '₹2,50,000', date: '—', status: 'locked', txId: '—' },
  ];

  // ── HELPERS ──
  const getMilestoneStatus = (status) => {
    switch (status) {
      case 'completed': return { label: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };
      case 'pending_approval': return { label: 'Pending Approval', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertCircle };
      case 'in_progress': return { label: 'In Progress', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
      case 'upcoming': return { label: 'Upcoming', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Circle };
      default: return { label: status, color: 'text-gray-400 bg-gray-50', icon: Circle };
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
      case 'excel': return { icon: BarChart2, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'ppt': return { icon: Image, color: 'text-orange-500', bg: 'bg-orange-50' };
      default: return { icon: File, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  const getPaymentStatus = (status) => {
    switch (status) {
      case 'released': return { label: 'Released', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: Unlock };
      case 'in_escrow': return { label: 'In Escrow', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Lock };
      case 'locked': return { label: 'Locked', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Lock };
      default: return { label: status, color: 'text-gray-400 bg-gray-50', icon: Lock };
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'company',
      name: 'Acme Corp',
      avatar: '',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      read: true,
    }]);
    setMessageText('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <button onClick={() => navigate('/company-dashboard')} className="hover:text-[#0eb59a] font-semibold transition-colors">Dashboard</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/company-dashboard')} className="hover:text-[#0eb59a] font-semibold transition-colors">Engagements</button>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-bold">{engagement.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => navigate('/company-dashboard')}
                className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 transition-all"
              >
                <ArrowLeft size={16} />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={engagement.expert.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-black text-gray-900">{engagement.title}</h1>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${engagement.statusColor}`}>
                      <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-current"
                      />
                      {engagement.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold">
                    with <span className="font-bold text-gray-600">{engagement.expert.name}</span>
                    <span className="mx-1">·</span>
                    {engagement.expert.title}
                    <span className="mx-1">·</span>
                    {engagement.daysLeft} days remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Progress */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400 font-semibold">Overall Progress</span>
                  <span className="font-black text-[#134e40]">{engagement.progress}%</span>
                </div>
                <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${engagement.progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl">
                <Shield size={14} className="text-[#0eb59a]" />
                <span className="text-xs font-black text-[#134e40]">PMO: {engagement.pmContact}</span>
              </div>
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -1 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-[#134e40]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={14} />
                {tab.id}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="wsTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0eb59a] rounded-full"
                  />
                )}
                {tab.id === 'Milestones' && milestones.filter(m => m.status === 'pending_approval').length > 0 && (
                  <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {milestones.filter(m => m.status === 'pending_approval').length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-16">
        <AnimatePresence mode="wait">

          {/* ══ TAB 1: OVERVIEW ══ */}
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left — Main overview */}
              <div className="lg:col-span-2 space-y-5">

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Value', value: engagement.totalValue, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]' },
                    { label: 'Escrow Balance', value: engagement.escrowBalance, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400' },
                    { label: 'Released', value: engagement.spent, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400' },
                    { label: 'Days Left', value: engagement.daysLeft, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-400' },
                  ].map((kpi, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ y: -4 }}
                      className={`bg-white rounded-2xl p-4 border border-gray-100 border-l-4 ${kpi.border} shadow-sm`}
                    >
                      <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <kpi.icon size={15} className={kpi.color} />
                      </div>
                      <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{kpi.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Overall Progress */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                      <BarChart2 size={16} className="text-[#0eb59a]" /> Engagement Progress
                    </h3>
                    <span className="text-2xl font-black text-[#134e40]">{engagement.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${engagement.progress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      />
                    </motion.div>
                  </div>

                  {/* Timeline */}
                  <div className="flex justify-between text-xs font-semibold text-gray-400">
                    <span className="flex flex-col items-start gap-1">
                      <span className="text-[#134e40] font-black">Start</span>
                      {engagement.startDate}
                    </span>
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-amber-500 font-black">Next Milestone</span>
                      {engagement.nextMilestone}
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      <span className="text-gray-400 font-black">End</span>
                      {engagement.endDate}
                    </span>
                  </div>
                </div>

                {/* Milestone summary */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#0eb59a]" /> Milestone Summary
                    </h3>
                    <button onClick={() => setActiveTab('Milestones')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                    >
                      View All <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {milestones.map((ms, idx) => {
                      const statusInfo = getMilestoneStatus(ms.status);
                      return (
                        <motion.div
                          key={ms.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setActiveTab('Milestones')}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            ms.status === 'completed' ? 'bg-emerald-500' :
                            ms.status === 'pending_approval' ? 'bg-amber-500' :
                            ms.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-200'
                          }`}>
                            {ms.status === 'completed' ? (
                              <Check size={13} className="text-white" strokeWidth={3} />
                            ) : ms.status === 'pending_approval' ? (
                              <AlertCircle size={13} className="text-white" />
                            ) : ms.status === 'in_progress' ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                <Clock size={13} className="text-white" />
                              </motion.div>
                            ) : (
                              <Circle size={13} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{ms.title}</p>
                            <p className="text-xs text-gray-400">Due {ms.dueDate} · {ms.payment}</p>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right — Sidebar info */}
              <div className="space-y-5">

                {/* Expert Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                    <Users size={14} className="text-[#0eb59a]" /> Expert
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <img src={engagement.expert.avatar} className="w-12 h-12 rounded-2xl object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{engagement.expert.name}</p>
                      <p className="text-xs text-gray-500">{engagement.expert.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} fill="#F59E0B" className="text-amber-400" />
                        <span className="text-xs font-black text-gray-800">{engagement.expert.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { label: 'Type', value: engagement.type },
                      { label: 'Commitment', value: engagement.commitment },
                      { label: 'Duration', value: engagement.duration },
                      { label: 'Budget', value: engagement.budget },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-400 font-semibold">{item.label}</span>
                        <span className="font-bold text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('Messages')}
                    className="w-full mt-4 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={13} /> Message David
                  </motion.button>
                </motion.div>

                {/* PMO Governance */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={16} className="text-[#0eb59a]" />
                      <h3 className="font-black text-sm">PMO Governance</h3>
                    </div>
                    <p className="text-xs text-white/60 mb-3 leading-relaxed">
                      Your engagement is managed and monitored by our CXO Connect PMO team.
                    </p>
                    <div className="space-y-2">
                      {[
                        { label: 'PMO Manager', value: engagement.pmContact },
                        { label: 'Contact', value: engagement.pmEmail },
                        { label: 'SLA', value: '< 4 hours response' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-white/50 font-semibold">{item.label}</span>
                          <span className="text-white font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Quick actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="font-black text-gray-900 text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'View Documents', icon: FileText, action: () => setActiveTab('Documents') },
                      { label: 'Payment History', icon: CreditCard, action: () => setActiveTab('Payments') },
                      { label: 'View Expert Profile', icon: Users, action: () => navigate('/experts/2') },
                    ].map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#0eb59a] transition-all"
                      >
                        <item.icon size={15} className={item.id === 1 ? 'text-blue-500' : 'text-[#0eb59a]'} />
                        {item.label}
                        <ChevronRight size={13} className="ml-auto text-gray-300" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ══ TAB 2: MILESTONES ══ */}
          {activeTab === 'Milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Pending approval banner */}
              {milestones.some(m => m.status === 'pending_approval') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3"
                >
                  <AlertCircle size={20} className="text-amber-500 shrink-0" />
                  <div className="flex-1">
                    <p className="font-black text-amber-800 text-sm">Action Required</p>
                    <p className="text-xs text-amber-600">
                      {milestones.filter(m => m.status === 'pending_approval').length} milestone(s) are awaiting your approval. Review and approve to release payment.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const pending = milestones.find(m => m.status === 'pending_approval');
                      if (pending) setShowApproveModal(pending);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shrink-0"
                  >
                    Review Now
                  </motion.button>
                </motion.div>
              )}

              {/* Milestone Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gray-100 rounded-full" />

                <div className="space-y-4">
                  {milestones.map((ms, idx) => {
                    const statusInfo = getMilestoneStatus(ms.status);
                    return (
                      <motion.div
                        key={ms.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`relative flex gap-4 ${ms.status === 'upcoming' ? 'opacity-60' : ''}`}
                      >
                        {/* Timeline dot */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm ${
                          ms.status === 'completed' ? 'bg-emerald-500' :
                          ms.status === 'pending_approval' ? 'bg-amber-500' :
                          ms.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-100 border border-gray-200'
                        }`}>
                          {ms.status === 'completed' ? (
                            <Check size={22} className="text-white" strokeWidth={3} />
                          ) : ms.status === 'pending_approval' ? (
                            <AlertCircle size={22} className="text-white" />
                          ) : ms.status === 'in_progress' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                              <Clock size={22} className="text-white" />
                            </motion.div>
                          ) : (
                            <span className="text-sm font-black text-gray-400">{idx + 1}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-gray-900 text-base">{ms.title}</h4>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 leading-relaxed">{ms.desc}</p>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <p className="font-black text-[#134e40] text-lg">{ms.payment}</p>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${getPaymentStatus(ms.paymentStatus).color}`}>
                                {getPaymentStatus(ms.paymentStatus).label}
                              </span>
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="flex gap-4 text-xs font-semibold text-gray-400 mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-[#0eb59a]" /> Due: {ms.dueDate}
                            </span>
                            {ms.completedDate && (
                              <span className="flex items-center gap-1.5 text-emerald-600">
                                <CheckCircle size={11} /> Completed: {ms.completedDate}
                              </span>
                            )}
                          </div>

                          {/* Deliverables */}
                          {ms.deliverables.length > 0 && (
                            <div className="mb-4">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Deliverables</p>
                              <div className="space-y-2">
                                {ms.deliverables.map((del, dIdx) => {
                                  const fileInfo = getFileIcon(del.type);
                                  return (
                                    <div key={dIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-teal-50 hover:border-teal-100 transition-all cursor-pointer">
                                      <div className={`w-8 h-8 ${fileInfo.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                        <fileInfo.icon size={15} className={fileInfo.color} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">{del.name}</p>
                                        <p className="text-[10px] text-gray-400">{del.size}</p>
                                      </div>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1.5 rounded-lg text-gray-300 hover:text-[#0eb59a] transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                        <Download size={13} />
                                      </motion.button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {ms.status === 'pending_approval' && (
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(16,185,129,0.2)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowApproveModal(ms)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-2xl transition-all shadow-md"
                              >
                                <Check size={15} strokeWidth={3} /> Approve & Release ₹{ms.payment.replace('₹', '')}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowRejectModal(ms)}
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-black rounded-2xl transition-all border border-red-100"
                              >
                                <X size={15} /> Reject
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ TAB 3: MESSAGES ══ */}
          {activeTab === 'Messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-[calc(100vh-280px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                  <img src={engagement.expert.avatar} className="w-10 h-10 rounded-2xl object-cover" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{engagement.expert.name}</p>
                  <p className="text-xs text-emerald-500 font-semibold">Online · Responds in {engagement.expert.rating > 4.5 ? '< 2 hrs' : '< 4 hrs'}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
                    {engagement.title}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 [&::-webkit-scrollbar]:hidden">
                {messages.map((msg, idx) => {
                  const isCompany = msg.sender === 'company';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex gap-3 ${isCompany ? 'flex-row-reverse' : ''}`}
                    >
                      {isCompany ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white text-xs font-black shrink-0">
                          AC
                        </div>
                      ) : (
                        <img src={msg.avatar} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                      )}
                      <div className={`max-w-md ${isCompany ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isCompany
                            ? 'bg-gradient-to-br from-[#134e40] to-[#0eb59a] text-white rounded-tr-sm'
                            : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold px-1">{msg.time}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-end gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#0eb59a] transition-colors shrink-0"
                  >
                    <Paperclip size={16} />
                  </motion.button>
                  <div className="flex-1 relative">
                    <textarea
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Type a message... (Enter to send)"
                      rows={1}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none [&::-webkit-scrollbar]:hidden"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className={`p-3 rounded-2xl shrink-0 transition-all ${
                      messageText.trim()
                        ? 'bg-[#134e40] hover:bg-[#0eb59a] text-white shadow-md'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ TAB 4: DOCUMENTS ══ */}
          {activeTab === 'Documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Upload area */}
              <motion.div
                whileHover={{ borderColor: '#0eb59a' }}
                className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center cursor-pointer transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-100"
                >
                  <Upload size={22} className="text-[#0eb59a]" />
                </motion.div>
                <p className="font-black text-gray-700 text-sm mb-1">Upload Document</p>
                <p className="text-xs text-gray-400">Drag & drop or click to upload — PDF, DOCX, XLSX, PPTX up to 25MB</p>
              </motion.div>

              {/* Document categories */}
              {['Legal', 'Deliverable'].map(category => {
                const catDocs = documents.filter(d => d.category === category);
                return (
                  <div key={category}>
                    <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                      {category === 'Legal' ? <Shield size={15} className="text-blue-500" /> : <FileText size={15} className="text-[#0eb59a]" />}
                      {category} Documents
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                        {catDocs.length}
                      </span>
                    </h3>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      {catDocs.map((doc, idx) => {
                        const fileInfo = getFileIcon(doc.type);
                        return (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group cursor-pointer ${
                              idx < catDocs.length - 1 ? 'border-b border-gray-50' : ''
                            }`}
                          >
                            <div className={`w-10 h-10 ${fileInfo.bg} rounded-xl flex items-center justify-center shrink-0`}>
                              <fileInfo.icon size={18} className={fileInfo.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 text-sm truncate">{doc.name}</p>
                              <p className="text-xs text-gray-400 font-semibold">
                                {doc.uploadedBy} · {doc.date} · {doc.size}
                              </p>
                            </div>
                            {doc.signed && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                                <Check size={9} strokeWidth={3} /> Signed
                              </span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all"
                              >
                                <Eye size={14} />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                              >
                                <Download size={14} />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ══ TAB 5: PAYMENTS ══ */}
          {activeTab === 'Payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Engagement Value', value: engagement.totalValue, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', desc: 'Full contract value' },
                  { label: 'Released to Expert', value: engagement.spent, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400', desc: '2 milestones paid' },
                  { label: 'In Escrow', value: engagement.escrowBalance, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400', desc: 'Secured by CXO Connect' },
                ].map((kpi, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${kpi.border} shadow-sm`}
                  >
                    <div className={`w-9 h-9 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <kpi.icon size={17} className={kpi.color} />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{kpi.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{kpi.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Escrow info */}
              <div className="bg-teal-50 rounded-2xl border border-teal-100 p-4 flex items-start gap-3">
                <Shield size={18} className="text-[#0eb59a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-[#134e40]">Escrow-backed payments</p>
                  <p className="text-xs text-teal-700 mt-0.5 leading-relaxed">
                    All payments are held in escrow by CXO Connect and released only after you approve each milestone. Your money is always secure.
                  </p>
                </div>
              </div>

              {/* Payment Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm">Payment Schedule</h3>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0eb59a] transition-colors"
                  >
                    <Download size={13} /> Export
                  </motion.button>
                </div>

                <div className="divide-y divide-gray-50">
                  {payments.map((payment, idx) => {
                    const payStatus = getPaymentStatus(payment.status);
                    return (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          payment.status === 'released' ? 'bg-emerald-50' :
                          payment.status === 'in_escrow' ? 'bg-amber-50' : 'bg-gray-50'
                        }`}>
                          <payStatus.icon size={16} className={
                            payment.status === 'released' ? 'text-emerald-500' :
                            payment.status === 'in_escrow' ? 'text-amber-500' : 'text-gray-300'
                          } />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{payment.milestone}</p>
                          <p className="text-xs text-gray-400 font-semibold">
                            {payment.txId !== '—' ? `TX: ${payment.txId}` : 'Pending'} · {payment.date}
                          </p>
                        </div>
                        <p className="font-black text-gray-900 text-base shrink-0">{payment.amount}</p>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${payStatus.color}`}>
                          {payStatus.label}
                        </span>
                        {payment.status === 'in_escrow' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowPaymentModal(payment)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-all shadow-sm shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            Release
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══ APPROVE MILESTONE MODAL ══ */}
      <AnimatePresence>
        {showApproveModal && (
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
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Approve Milestone</h3>
              <p className="text-sm text-gray-400 text-center mb-4 leading-relaxed">
                You are approving <span className="font-bold text-gray-700">{showApproveModal.title}</span>.
                This will release <span className="font-bold text-emerald-600">{showApproveModal.payment}</span> from escrow to {engagement.expert.name}.
              </p>

              {/* Rating */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5">
                <p className="text-xs font-black text-gray-700 text-center mb-3 uppercase tracking-wider">
                  Rate this milestone delivery
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={28}
                        fill={star <= (hoveredStar || rating) ? '#F59E0B' : 'none'}
                        className={star <= (hoveredStar || rating) ? 'text-amber-400' : 'text-gray-300'}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowApproveModal(null); setRating(0); }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowApproveModal(null); setRating(0); }}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-md transition-all"
                >
                  <Check size={15} className="inline mr-1.5" strokeWidth={3} />
                  Approve & Release
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ REJECT MILESTONE MODAL ══ */}
      <AnimatePresence>
        {showRejectModal && (
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
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <XCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Reject Milestone</h3>
              <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                Please provide feedback on what needs to be revised for <span className="font-bold text-gray-700">{showRejectModal.title}</span>.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Describe what needs to be changed or improved..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: rejectReason.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: rejectReason.trim() ? 0.98 : 1 }}
                  disabled={!rejectReason.trim()}
                  onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                    rejectReason.trim()
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <X size={15} className="inline mr-1.5" />
                  Send Rejection
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ RELEASE PAYMENT MODAL ══ */}
      <AnimatePresence>
        {showPaymentModal && (
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
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <DollarSign size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Release Payment</h3>
              <p className="text-sm text-gray-400 text-center mb-2 leading-relaxed">
                Release escrow payment for
              </p>
              <p className="text-center font-black text-gray-800 text-base mb-1">{showPaymentModal.milestone}</p>
              <p className="text-center text-3xl font-black text-emerald-600 mb-6">{showPaymentModal.amount}</p>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-5 text-center">
                <p className="text-xs text-emerald-700 font-semibold leading-relaxed">
                  Funds will be transferred to {engagement.expert.name}'s account within 24 hours after release.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-md transition-all"
                >
                  Confirm Release
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EngagementWorkspace;
