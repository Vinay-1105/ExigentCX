import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Clock, CheckCircle, Upload,
  Download, Send, Paperclip, MoreVertical,
  DollarSign, Shield, AlertCircle, Calendar,
  FileText, MessageSquare, BarChart2, CreditCard,
  Check, X, Star, Users, Briefcase, ArrowLeft,
  Lock, Unlock, Eye, TrendingUp, Zap, Circle,
  Image, File, Building, Target, Activity,
  ChevronDown, Plus, ArrowUpRight, Award
} from 'lucide-react';

const ExpertEngagements = () => {
  const navigate = useNavigate();
  const { engagementId } = useParams();

  // ── STATE ──
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedEngagement, setSelectedEngagement] = useState(engagementId || '1');
  const [messageText, setMessageText] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [showEngagementList, setShowEngagementList] = useState(!engagementId);
  const [deliverableNote, setDeliverableNote] = useState('');
  const [submitSent, setSubmitSent] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'company',
      name: 'Acme Corp',
      text: 'Hi David, welcome aboard! We\'re excited to have you join us for the Series B Funding Strategy engagement.',
      time: '9:00 AM',
      date: 'Feb 1, 2025',
    },
    {
      id: 2,
      sender: 'expert',
      name: 'David Chen',
      text: 'Thank you! I\'ve reviewed the brief and I\'m ready to start. I\'ll begin with the discovery session this week.',
      time: '10:30 AM',
      date: 'Feb 1, 2025',
    },
    {
      id: 3,
      sender: 'company',
      name: 'Acme Corp',
      text: 'Perfect. Our CFO and CEO will be available Thursday 3pm for the kickoff call. Does that work?',
      time: '11:00 AM',
      date: 'Feb 1, 2025',
    },
    {
      id: 4,
      sender: 'expert',
      name: 'David Chen',
      text: 'Thursday 3pm works perfectly. I\'ll send a calendar invite with the agenda shortly.',
      time: '11:15 AM',
      date: 'Feb 1, 2025',
    },
    {
      id: 5,
      sender: 'company',
      name: 'Acme Corp',
      text: 'The financial model draft looks great! A few questions on the unit economics assumptions — can we discuss?',
      time: '2:45 PM',
      date: 'Today',
    },
  ]);

  const tabs = [
    { id: 'Overview', icon: BarChart2 },
    { id: 'Milestones', icon: CheckCircle },
    { id: 'Messages', icon: MessageSquare },
    { id: 'Documents', icon: FileText },
    { id: 'Payments', icon: CreditCard },
  ];

  // ── ENGAGEMENTS LIST ──
  const engagementsList = [
    {
      id: '1',
      title: 'Series B Funding Strategy',
      company: 'Acme Corp',
      logo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      status: 'IN PROGRESS',
      statusColor: 'text-blue-600 bg-blue-50',
      progress: 65,
      monthlyRate: '₹3L/mo',
      nextAction: 'Submit Investor Deck',
      dueDate: 'Apr 30, 2025',
    },
    {
      id: '2',
      title: 'Financial Due Diligence',
      company: 'TechScale Ventures',
      logo: 'TV',
      logoColor: 'from-blue-600 to-indigo-500',
      status: 'ON TRACK',
      statusColor: 'text-emerald-600 bg-emerald-50',
      progress: 40,
      monthlyRate: '₹2.5L/mo',
      nextAction: 'Submit Due Diligence Report',
      dueDate: 'May 15, 2025',
    },
  ];

  const currentEngagement = engagementsList.find(e => e.id === selectedEngagement) || engagementsList[0];

  // ── ENGAGEMENT DETAIL DATA ──
  const engagement = {
    id: selectedEngagement,
    title: currentEngagement.title,
    company: currentEngagement.company,
    companyLogo: currentEngagement.logo,
    logoColor: currentEngagement.logoColor,
    status: currentEngagement.status,
    statusColor: currentEngagement.statusColor,
    type: 'Interim',
    startDate: 'Feb 1, 2025',
    endDate: 'Jul 31, 2025',
    duration: '6 months',
    commitment: '40 hrs/wk',
    monthlyRate: currentEngagement.monthlyRate,
    totalValue: '₹18,00,000',
    received: '₹3,50,000',
    pending: '₹2,50,000',
    progress: currentEngagement.progress,
    nextMilestone: currentEngagement.nextAction,
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
      status: 'approved',
      payment: '₹1.5L',
      paymentStatus: 'received',
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
      status: 'approved',
      payment: '₹2L',
      paymentStatus: 'received',
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
      status: 'in_progress',
      payment: '₹2.5L',
      paymentStatus: 'in_escrow',
      deliverables: [],
    },
    {
      id: 4,
      title: 'Investor Outreach & Roadshow',
      desc: 'Lead investor outreach, manage roadshow schedule, and prepare management for meetings',
      dueDate: 'May 31, 2025',
      completedDate: null,
      status: 'upcoming',
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
    { id: 1, name: 'Engagement Agreement.pdf', size: '1.2 MB', type: 'pdf', uploadedBy: 'CXO Connect', date: 'Feb 1, 2025', category: 'Legal' },
    { id: 2, name: 'NDA — Acme Corp & David Chen.pdf', size: '0.6 MB', type: 'pdf', uploadedBy: 'CXO Connect', date: 'Feb 1, 2025', category: 'Legal' },
    { id: 3, name: 'Financial Model v2.xlsx', size: '3.8 MB', type: 'excel', uploadedBy: 'You', date: 'Mar 28, 2025', category: 'Deliverable' },
    { id: 4, name: 'Business Assessment Report.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'You', date: 'Feb 25, 2025', category: 'Deliverable' },
    { id: 5, name: 'Fundraising Narrative.pptx', size: '5.2 MB', type: 'ppt', uploadedBy: 'You', date: 'Mar 28, 2025', category: 'Deliverable' },
  ];

  const payments = [
    { id: 1, milestone: 'Discovery & Assessment', amount: '₹1,50,000', date: 'Feb 25, 2025', status: 'received', txId: 'TXN-003-2025' },
    { id: 2, milestone: 'Financial Model Development', amount: '₹2,00,000', date: 'Mar 28, 2025', status: 'received', txId: 'TXN-005-2025' },
    { id: 3, milestone: 'Investor Deck & Data Room', amount: '₹2,50,000', date: '—', status: 'in_escrow', txId: 'TXN-007-2025' },
    { id: 4, milestone: 'Investor Outreach & Roadshow', amount: '₹3,00,000', date: '—', status: 'locked', txId: '—' },
    { id: 5, milestone: 'Term Sheet & Due Diligence', amount: '₹2,50,000', date: '—', status: 'locked', txId: '—' },
  ];

  // ── HELPERS ──
  const getMilestoneStatus = (status) => {
    switch (status) {
      case 'approved': return { label: 'Approved', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };
      case 'submitted': return { label: 'Submitted', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
      case 'in_progress': return { label: 'In Progress', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock };
      case 'upcoming': return { label: 'Upcoming', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Circle };
      case 'rejected': return { label: 'Needs Revision', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle };
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
      case 'received': return { label: 'Received', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: Unlock };
      case 'in_escrow': return { label: 'In Escrow', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Lock };
      case 'locked': return { label: 'Locked', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Lock };
      default: return { label: status, color: 'text-gray-400 bg-gray-50', icon: Lock };
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'expert',
      name: 'David Chen',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
    }]);
    setMessageText('');
  };

  const handleSubmit = () => {
    setSubmitSent(true);
    setTimeout(() => {
      setShowSubmitModal(null);
      setSubmitSent(false);
      setDeliverableNote('');
    }, 2000);
  };

  // ── ENGAGEMENT LIST VIEW ──
  if (showEngagementList) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-8 pb-16">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
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
                <span className="text-sm font-bold text-gray-700">My Engagements</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                My Engagements
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {engagementsList.length} active engagement{engagementsList.length > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: 'Active', value: engagementsList.length, icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]' },
              { label: 'This Month', value: '₹5.5L', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400' },
              { label: 'Avg Progress', value: '52%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-400' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + idx * 0.07 }}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${stat.border} shadow-sm`}
              >
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon size={17} className={stat.color} />
                </div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Engagement Cards */}
          <div className="space-y-5">
            {engagementsList.map((eng, idx) => (
              <motion.div
                key={eng.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.07)' }}
                onClick={() => { setSelectedEngagement(eng.id); setShowEngagementList(false); setActiveTab('Overview'); }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 cursor-pointer group transition-all"
              >
                <div className="flex items-start gap-4">

                  {/* Logo */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${eng.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                    <span className="text-white font-black text-base">{eng.logo}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-black text-gray-900 text-base group-hover:text-[#0eb59a] transition-colors">
                            {eng.title}
                          </h3>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${eng.statusColor}`}>
                            <motion.span
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-current"
                            />
                            {eng.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-semibold">{eng.company}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-black text-[#134e40] text-lg">{eng.monthlyRate}</p>
                        <p className="text-xs text-gray-400 font-semibold">{eng.dueDate}</p>
                      </div>
                    </div>

                    {/* Next action */}
                    <div className="flex items-center gap-2 mb-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                      <p className="text-xs font-bold text-amber-700">
                        Next: <span className="font-black">{eng.nextAction}</span>
                      </p>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400 font-semibold">Overall Progress</span>
                        <span className="font-black text-[#134e40]">{eng.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${eng.progress}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + idx * 0.15 }}
                          className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-teal-50 group-hover:border-teal-200 transition-all"
                  >
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-[#0eb59a] transition-colors" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── WORKSPACE VIEW ──
  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <button onClick={() => navigate('/expert-dashboard')} className="hover:text-[#0eb59a] font-semibold transition-colors">Dashboard</button>
            <ChevronRight size={14} />
            <button onClick={() => setShowEngagementList(true)} className="hover:text-[#0eb59a] font-semibold transition-colors">My Engagements</button>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-bold truncate">{engagement.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => setShowEngagementList(true)}
                className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 transition-all"
              >
                <ArrowLeft size={16} />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${engagement.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                  <span className="text-white font-black text-base">{engagement.companyLogo}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-black text-gray-900">{engagement.title}</h1>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${engagement.statusColor}`}>
                      <motion.span
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-current"
                      />
                      {engagement.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold">
                    {engagement.company} · {engagement.monthlyRate} · {engagement.daysLeft} days remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 font-semibold">Progress</span>
                  <span className="font-black text-[#134e40]">{engagement.progress}%</span>
                </div>
                <div className="w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${engagement.progress}%` }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl">
                <Shield size={14} className="text-[#0eb59a]" />
                <span className="text-xs font-black text-[#134e40]">PMO: {engagement.pmContact}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -1 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-[#134e40]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={14} />
                {tab.id}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="expertWsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0eb59a] rounded-full"
                  />
                )}
                {tab.id === 'Milestones' && milestones.filter(m => m.status === 'in_progress').length > 0 && (
                  <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {milestones.filter(m => m.status === 'in_progress').length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-16">
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
              {/* Left */}
              <div className="lg:col-span-2 space-y-5">

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Value', value: engagement.totalValue, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]' },
                    { label: 'Received', value: engagement.received, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400' },
                    { label: 'In Escrow', value: engagement.pending, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400' },
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

                {/* Progress */}
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
                  <div className="flex justify-between text-xs font-semibold text-gray-400">
                    <span className="flex flex-col gap-1">
                      <span className="text-[#134e40] font-black">Started</span>
                      {engagement.startDate}
                    </span>
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-amber-500 font-black">Next Due</span>
                      {engagement.nextMilestone}
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      <span className="text-gray-400 font-black">Ends</span>
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
                    <button
                      onClick={() => setActiveTab('Milestones')}
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
                          transition={{ delay: idx * 0.06 }}
                          onClick={() => setActiveTab('Milestones')}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            ms.status === 'approved' ? 'bg-emerald-500' :
                            ms.status === 'in_progress' ? 'bg-amber-500' :
                            ms.status === 'submitted' ? 'bg-blue-500' : 'bg-gray-200'
                          }`}>
                            {ms.status === 'approved'
                              ? <Check size={13} className="text-white" strokeWidth={3} />
                              : ms.status === 'in_progress'
                              ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                  <Clock size={13} className="text-white" />
                                </motion.div>
                              : <Circle size={13} className="text-white" />
                            }
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

              {/* Right */}
              <div className="space-y-5">

                {/* Company Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                    <Building size={14} className="text-[#0eb59a]" /> Client Company
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${engagement.logoColor} flex items-center justify-center shadow-sm`}>
                      <span className="text-white font-black text-base">{engagement.companyLogo}</span>
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{engagement.company}</p>
                      <p className="text-xs text-gray-400 font-semibold">{engagement.type} Engagement</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { label: 'Commitment', value: engagement.commitment },
                      { label: 'Duration', value: engagement.duration },
                      { label: 'Monthly Rate', value: engagement.monthlyRate },
                      { label: 'Total Value', value: engagement.totalValue },
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
                    <MessageSquare size={13} /> Message {engagement.company}
                  </motion.button>
                </motion.div>

                {/* PMO */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-[#0eb59a]" />
                      <h3 className="font-black text-sm">PMO Support</h3>
                    </div>
                    <p className="text-xs text-white/60 mb-3 leading-relaxed">
                      Your engagement is supported by our CXO Connect PMO team.
                    </p>
                    {[
                      { label: 'Your PMO', value: engagement.pmContact },
                      { label: 'Contact', value: engagement.pmEmail },
                      { label: 'Response', value: '< 4 hours' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/50 font-semibold">{item.label}</span>
                        <span className="text-white font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <h3 className="font-black text-gray-900 text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Submit Deliverable', icon: Upload, action: () => { const ms = milestones.find(m => m.status === 'in_progress'); if (ms) setShowSubmitModal(ms); } },
                      { label: 'View Documents', icon: FileText, action: () => setActiveTab('Documents') },
                      { label: 'Check Payments', icon: CreditCard, action: () => setActiveTab('Payments') },
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
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ══ MILESTONES TAB ══ */}
          {activeTab === 'Milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Submit reminder */}
              {milestones.some(m => m.status === 'in_progress') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3"
                >
                  <AlertCircle size={20} className="text-amber-500 shrink-0" />
                  <div className="flex-1">
                    <p className="font-black text-amber-800 text-sm">Deliverable Due Soon</p>
                    <p className="text-xs text-amber-600">Submit your deliverables for the current milestone before the due date.</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const ms = milestones.find(m => m.status === 'in_progress');
                      if (ms) setShowSubmitModal(ms);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shrink-0"
                  >
                    Submit Now
                  </motion.button>
                </motion.div>
              )}

              {/* Timeline */}
              <div className="relative">
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
                        {/* Dot */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm ${
                          ms.status === 'approved' ? 'bg-emerald-500' :
                          ms.status === 'in_progress' ? 'bg-amber-500' :
                          ms.status === 'submitted' ? 'bg-blue-500' : 'bg-gray-100 border border-gray-200'
                        }`}>
                          {ms.status === 'approved'
                            ? <Check size={22} className="text-white" strokeWidth={3} />
                            : ms.status === 'in_progress'
                            ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                <Clock size={22} className="text-white" />
                              </motion.div>
                            : ms.status === 'submitted'
                            ? <CheckCircle size={22} className="text-white" />
                            : <span className="text-sm font-black text-gray-400">{idx + 1}</span>
                          }
                        </div>

                        {/* Card */}
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
                          <div className="flex gap-4 text-xs text-gray-400 font-semibold mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-[#0eb59a]" /> Due: {ms.dueDate}
                            </span>
                            {ms.completedDate && (
                              <span className="flex items-center gap-1.5 text-emerald-600">
                                <CheckCircle size={11} /> Submitted: {ms.completedDate}
                              </span>
                            )}
                          </div>

                          {/* Deliverables */}
                          {ms.deliverables.length > 0 && (
                            <div className="mb-4">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                                Submitted Deliverables
                              </p>
                              <div className="space-y-2">
                                {ms.deliverables.map((del, dIdx) => {
                                  const fileInfo = getFileIcon(del.type);
                                  return (
                                    <div
                                      key={dIdx}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-teal-50 hover:border-teal-100 transition-all cursor-pointer"
                                    >
                                      <div className={`w-8 h-8 ${fileInfo.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                        <fileInfo.icon size={15} className={fileInfo.color} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">{del.name}</p>
                                        <p className="text-[10px] text-gray-400">{del.size}</p>
                                      </div>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
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

                          {/* Submit button for in_progress */}
                          {ms.status === 'in_progress' && (
                            <motion.button
                              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(20,78,64,0.2)' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowSubmitModal(ms)}
                              className="flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl transition-all shadow-md w-full"
                            >
                              <Upload size={15} /> Submit Deliverables
                            </motion.button>
                          )}

                          {/* Approved message */}
                          {ms.status === 'approved' && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                              <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                              <p className="text-xs text-emerald-700 font-bold">
                                Approved by {engagement.company} — payment released ✓
                              </p>
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

          {/* ══ MESSAGES TAB ══ */}
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
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${engagement.logoColor} flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-black text-sm">{engagement.companyLogo}</span>
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{engagement.company}</p>
                  <p className="text-xs text-emerald-500 font-semibold">Active Engagement · {engagement.title}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 [&::-webkit-scrollbar]:hidden">
                {messages.map((msg, idx) => {
                  const isExpert = msg.sender === 'expert';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`flex gap-3 ${isExpert ? 'flex-row-reverse' : ''}`}
                    >
                      {isExpert ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white text-xs font-black shrink-0">
                          DC
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${engagement.logoColor} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                          {engagement.companyLogo}
                        </div>
                      )}
                      <div className={`max-w-md flex flex-col gap-1 ${isExpert ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isExpert
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#0eb59a] transition-colors shrink-0"
                  >
                    <Paperclip size={16} />
                  </motion.button>
                  <div className="flex-1">
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

          {/* ══ DOCUMENTS TAB ══ */}
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
                <p className="font-black text-gray-700 text-sm mb-1">Upload Deliverable</p>
                <p className="text-xs text-gray-400">
                  Drag & drop or click to upload — PDF, DOCX, XLSX, PPTX up to 25MB
                </p>
              </motion.div>

              {/* Documents by category */}
              {['Deliverable', 'Legal'].map(category => {
                const catDocs = documents.filter(d => d.category === category);
                return (
                  <div key={category}>
                    <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                      {category === 'Deliverable'
                        ? <Upload size={15} className="text-[#0eb59a]" />
                        : <Shield size={15} className="text-blue-500" />
                      }
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
                                {doc.uploadedBy === 'You' ? (
                                  <span className="text-[#0eb59a] font-bold">Uploaded by you</span>
                                ) : doc.uploadedBy} · {doc.date} · {doc.size}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all"
                              >
                                <Eye size={14} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
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

          {/* ══ PAYMENTS TAB ══ */}
          {activeTab === 'Payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Engagement Value', value: engagement.totalValue, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', desc: 'Full contract value' },
                  { label: 'Already Received', value: engagement.received, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400', desc: '2 milestones paid' },
                  { label: 'Pending in Escrow', value: engagement.pending, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400', desc: 'Released on approval' },
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
                  <p className="text-sm font-black text-[#134e40]">How you get paid</p>
                  <p className="text-xs text-teal-700 mt-0.5 leading-relaxed">
                    Payments are held in escrow by CXO Connect. When you submit a milestone and the company approves it, the payment is automatically released to your account within 24 hours.
                  </p>
                </div>
              </div>

              {/* Payment table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm">Payment Schedule</h3>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors"
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
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          payment.status === 'received' ? 'bg-emerald-50' :
                          payment.status === 'in_escrow' ? 'bg-amber-50' : 'bg-gray-50'
                        }`}>
                          <payStatus.icon size={16} className={
                            payment.status === 'received' ? 'text-emerald-500' :
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
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══ SUBMIT DELIVERABLE MODAL ══ */}
      <AnimatePresence>
        {showSubmitModal && (
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
                {!submitSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-teal-100">
                      <Upload size={28} className="text-[#0eb59a]" />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 text-center mb-1">
                      Submit Deliverables
                    </h3>
                    <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                      You are submitting deliverables for
                      <span className="font-bold text-gray-700"> {showSubmitModal.title}</span>.
                      The company will review and approve within 48 hours.
                    </p>

                    {/* File upload zone */}
                    <motion.div
                      whileHover={{ borderColor: '#0eb59a' }}
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center mb-4 cursor-pointer transition-all group"
                    >
                      <Upload size={20} className="text-gray-300 mx-auto mb-2 group-hover:text-[#0eb59a] transition-colors" />
                      <p className="text-sm font-bold text-gray-500 group-hover:text-[#0eb59a] transition-colors">
                        Click to upload files
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF, XLSX, PPTX, DOCX up to 25MB each</p>
                    </motion.div>

                    {/* Note */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Submission Notes <span className="text-gray-400 font-normal normal-case">(optional)</span>
                      </label>
                      <textarea
                        value={deliverableNote}
                        onChange={e => setDeliverableNote(e.target.value)}
                        placeholder="Add any context or notes for the client about this submission..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 resize-none transition-all"
                      />
                    </div>

                    {/* Payment reminder */}
                    <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-5">
                      <DollarSign size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-emerald-700 leading-relaxed font-semibold">
                        Upon approval, <span className="font-black">{showSubmitModal.payment}</span> will be released from escrow to your account within 24 hours.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowSubmitModal(null); setDeliverableNote(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-lg transition-all"
                      >
                        <Upload size={14} className="inline mr-1.5" />
                        Submit for Approval
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
                    <h3 className="text-xl font-black text-gray-900 mb-2">Submitted!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Your deliverables for <span className="font-bold text-gray-700">{showSubmitModal.title}</span> have been submitted. {engagement.company} will review and respond within 48 hours.
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: 2 }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100"
                    >
                      <DollarSign size={12} /> {showSubmitModal.payment} pending approval
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertEngagements;
