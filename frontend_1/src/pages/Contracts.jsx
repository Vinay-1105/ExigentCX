import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, FileText, Download, Eye, Check,
  Clock, AlertCircle, Shield, Search, Filter,
  X, CheckCircle, ArrowLeft, Calendar, DollarSign,
  Users, Briefcase, Lock, Unlock, MoreVertical,
  PenLine, RefreshCw, ExternalLink, Copy, Zap,
  Building, ChevronDown
} from 'lucide-react';

const Contracts = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();

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

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showSignModal, setShowSignModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [signatureText, setSignatureText] = useState('');
  const [signatureSent, setSignatureSent] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // ── DATA ──
  const filters = ['All', 'Pending Signature', 'Signed', 'Under Review', 'Expired'];

  const contracts = [
    {
      id: 1,
      title: 'Engagement Agreement — Interim CFO',
      type: 'Engagement Agreement',
      status: 'Pending Signature',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      expertTitle: 'Interim CFO',
      engagement: 'Series B Funding Strategy',
      value: '₹18,00,000',
      duration: '6 months',
      startDate: 'Feb 1, 2025',
      endDate: 'Jul 31, 2025',
      createdDate: 'Jan 28, 2025',
      expiresAt: 'Feb 3, 2025',
      signedByExpert: true,
      signedByCompany: false,
      generatedBy: 'CXO Connect Platform',
      pages: 8,
      fileSize: '1.2 MB',
      urgency: 'high',
    },
    {
      id: 2,
      title: 'Non-Disclosure Agreement — David Chen',
      type: 'NDA',
      status: 'Signed',
      expert: 'David Chen',
      expertAvatar: 'https://i.pravatar.cc/150?u=david',
      expertTitle: 'Interim CFO',
      engagement: 'Series B Funding Strategy',
      value: '—',
      duration: '2 years',
      startDate: 'Feb 1, 2025',
      endDate: 'Feb 1, 2027',
      createdDate: 'Jan 28, 2025',
      expiresAt: null,
      signedByExpert: true,
      signedByCompany: true,
      signedDate: 'Feb 1, 2025',
      generatedBy: 'CXO Connect Platform',
      pages: 4,
      fileSize: '0.6 MB',
      urgency: null,
    },
    {
      id: 3,
      title: 'Engagement Agreement — Fractional CMO',
      type: 'Engagement Agreement',
      status: 'Signed',
      expert: 'Sarah Jenkins',
      expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
      expertTitle: 'Fractional CMO',
      engagement: 'Go-to-Market Expansion',
      value: '₹9,00,000',
      duration: '3 months',
      startDate: 'Mar 1, 2025',
      endDate: 'May 31, 2025',
      createdDate: 'Feb 25, 2025',
      expiresAt: null,
      signedByExpert: true,
      signedByCompany: true,
      signedDate: 'Feb 28, 2025',
      generatedBy: 'CXO Connect Platform',
      pages: 8,
      fileSize: '1.1 MB',
      urgency: null,
    },
    {
      id: 4,
      title: 'Non-Disclosure Agreement — Sarah Jenkins',
      type: 'NDA',
      status: 'Signed',
      expert: 'Sarah Jenkins',
      expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
      expertTitle: 'Fractional CMO',
      engagement: 'Go-to-Market Expansion',
      value: '—',
      duration: '2 years',
      startDate: 'Feb 28, 2025',
      endDate: 'Feb 28, 2027',
      createdDate: 'Feb 25, 2025',
      expiresAt: null,
      signedByExpert: true,
      signedByCompany: true,
      signedDate: 'Feb 28, 2025',
      generatedBy: 'CXO Connect Platform',
      pages: 4,
      fileSize: '0.6 MB',
      urgency: null,
    },
    {
      id: 5,
      title: 'Engagement Agreement — VP Engineering',
      type: 'Engagement Agreement',
      status: 'Under Review',
      expert: 'Priya Patel',
      expertAvatar: 'https://i.pravatar.cc/150?u=priya',
      expertTitle: 'Fractional VP Engineering',
      engagement: 'Tech Infrastructure Scale-up',
      value: '₹7,20,000',
      duration: '4 months',
      startDate: 'May 1, 2025',
      endDate: 'Aug 31, 2025',
      createdDate: 'Apr 20, 2025',
      expiresAt: 'Apr 30, 2025',
      signedByExpert: false,
      signedByCompany: false,
      generatedBy: 'CXO Connect Platform',
      pages: 8,
      fileSize: '1.0 MB',
      urgency: 'medium',
    },
    {
      id: 6,
      title: 'Advisory Agreement — Interim COO',
      type: 'Advisory Agreement',
      status: 'Expired',
      expert: 'Marcus Johnson',
      expertAvatar: 'https://i.pravatar.cc/150?u=marcus',
      expertTitle: 'Interim COO',
      engagement: 'Operations Restructuring',
      value: '₹4,50,000',
      duration: '3 months',
      startDate: 'Nov 1, 2024',
      endDate: 'Jan 31, 2025',
      createdDate: 'Oct 28, 2024',
      expiresAt: null,
      signedByExpert: true,
      signedByCompany: true,
      signedDate: 'Oct 30, 2024',
      generatedBy: 'CXO Connect Platform',
      pages: 6,
      fileSize: '0.9 MB',
      urgency: null,
    },
  ];

  // ── CONTRACT PREVIEW CONTENT ──
  const contractPreview = `
ENGAGEMENT AGREEMENT

This Engagement Agreement ("Agreement") is entered into as of February 1, 2025, between:

COMPANY: Acme Corp Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at [Address] ("Company")

AND

EXPERT: David Chen, an independent professional ("Expert")

FACILITATED BY: CXO Connect Platform ("Platform")

1. SCOPE OF ENGAGEMENT
The Expert agrees to provide Interim CFO services to the Company for the purposes of Series B Funding Strategy, including but not limited to:
  a) Financial modeling and 3-year projections
  b) Investor relations and fundraising support
  c) Data room preparation and due diligence management
  d) Board reporting and governance

2. TERM
This Agreement shall commence on February 1, 2025, and shall continue for a period of 6 months, ending on July 31, 2025, unless terminated earlier in accordance with the terms hereof.

3. COMPENSATION
The Company agrees to pay the Expert ₹3,00,000 per month, payable on a milestone basis as defined in Schedule A, held in escrow by the Platform and released upon Company approval.

4. CONFIDENTIALITY
The Expert agrees to maintain strict confidentiality of all Company information and has separately executed a Non-Disclosure Agreement dated February 1, 2025.

5. INTELLECTUAL PROPERTY
All work product, deliverables, and materials created by the Expert during this engagement shall be the sole property of the Company.

6. GOVERNING LAW
This Agreement shall be governed by the laws of India and subject to the jurisdiction of courts in Mumbai, Maharashtra.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
  `;

  // ── HELPERS ──
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Signed':
        return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' };
      case 'Pending Signature':
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock, dot: 'bg-amber-500' };
      case 'Under Review':
        return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Eye, dot: 'bg-blue-500' };
      case 'Expired':
        return { color: 'text-gray-400 bg-gray-50 border-gray-200', icon: X, dot: 'bg-gray-400' };
      default:
        return { color: 'text-gray-400 bg-gray-50 border-gray-200', icon: FileText, dot: 'bg-gray-400' };
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'NDA': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Engagement Agreement': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Advisory Agreement': return 'text-teal-700 bg-teal-50 border-teal-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredContracts = contracts.filter(c => {
    const matchFilter = activeFilter === 'All' || c.status === activeFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: contracts.length,
    pending: contracts.filter(c => c.status === 'Pending Signature').length,
    signed: contracts.filter(c => c.status === 'Signed').length,
    review: contracts.filter(c => c.status === 'Under Review').length,
  };

  const handleSign = () => {
    setSignatureSent(true);
    setTimeout(() => {
      setShowSignModal(null);
      setSignatureSent(false);
      setSignatureText('');
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
              <span className="text-sm font-bold text-gray-700">Contracts</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Contracts & NDAs
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              All agreements generated and managed by CXO Connect
            </p>
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0d1f2d] to-[#134e40] text-white px-5 py-3 rounded-2xl shadow-lg"
          >
            <Shield size={16} className="text-[#0eb59a]" />
            <div>
              <p className="text-xs font-black">Platform Protected</p>
              <p className="text-[10px] text-white/60">All contracts auto-generated & legally binding</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Contracts', value: stats.total, icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-l-gray-400' },
            { label: 'Pending Signature', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-500' },
            { label: 'Fully Signed', value: stats.signed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
            { label: 'Under Review', value: stats.review, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + idx * 0.06 }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${stat.border} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={15} className={stat.color} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── PENDING SIGNATURE ALERT ── */}
        <AnimatePresence>
          {stats.pending > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-black text-amber-800 text-sm">
                  {stats.pending} contract{stats.pending > 1 ? 's' : ''} awaiting your signature
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Please sign before the expiry date to activate your engagement.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveFilter('Pending Signature');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shrink-0"
              >
                View Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SEARCH + FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {filters.map(filter => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0eb59a]/40 hover:text-[#0eb59a]'
                }`}
              >
                {filter}
                {filter !== 'All' && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${
                    activeFilter === filter ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {contracts.filter(c => c.status === filter).length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── CONTRACTS LIST ── */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredContracts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <FileText size={24} className="text-gray-300" />
                </div>
                <h3 className="font-black text-gray-700 text-lg mb-2">No contracts found</h3>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? `No results for "${searchQuery}"` : `No ${activeFilter.toLowerCase()} contracts`}
                </p>
              </motion.div>
            ) : (
              filteredContracts.map((contract, idx) => {
                const statusStyle = getStatusStyle(contract.status);
                return (
                  <motion.div
                    key={contract.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
                    className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group transition-all duration-300 ${
                      contract.status === 'Expired' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                        {/* Document icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          contract.type === 'NDA' ? 'bg-purple-50' :
                          contract.type === 'Advisory Agreement' ? 'bg-teal-50' : 'bg-blue-50'
                        }`}>
                          <FileText size={24} className={
                            contract.type === 'NDA' ? 'text-purple-500' :
                            contract.type === 'Advisory Agreement' ? 'text-teal-500' : 'text-blue-500'
                          } />
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getTypeStyle(contract.type)}`}>
                              {contract.type}
                            </span>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${statusStyle.color}`}>
                              {contract.status === 'Pending Signature' && (
                                <motion.span
                                  animate={{ scale: [1, 1.4, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                                />
                              )}
                              {contract.status === 'Signed' && <Check size={9} strokeWidth={3} />}
                              {contract.status}
                            </span>
                            {contract.urgency === 'high' && (
                              <span className="text-[10px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1">
                                <Zap size={9} fill="currentColor" /> Expires Soon
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-black text-gray-900 text-base group-hover:text-[#0eb59a] transition-colors cursor-pointer leading-tight mb-1 truncate"
                            onClick={() => setShowViewModal(contract)}
                          >
                            {contract.title}
                          </h3>

                          {/* Meta */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-semibold mb-3">
                            <span className="flex items-center gap-1.5">
                              <Users size={11} className="text-[#0eb59a]" />
                              {contract.expert} · {contract.expertTitle}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Briefcase size={11} className="text-blue-400" />
                              {contract.engagement}
                            </span>
                            {contract.value !== '—' && (
                              <span className="flex items-center gap-1.5">
                                <DollarSign size={11} className="text-purple-400" />
                                {contract.value}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-rose-400" />
                              {contract.startDate} → {contract.endDate}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileText size={11} className="text-gray-300" />
                              {contract.pages} pages · {contract.fileSize}
                            </span>
                          </div>

                          {/* Signature status */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {/* Expert signature */}
                              <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border ${
                                contract.signedByExpert
                                  ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                  : 'text-gray-400 bg-gray-50 border-gray-100'
                              }`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  contract.signedByExpert ? 'bg-emerald-500' : 'bg-gray-200'
                                }`}>
                                  {contract.signedByExpert
                                    ? <Check size={9} className="text-white" strokeWidth={3} />
                                    : <Clock size={9} className="text-gray-400" />
                                  }
                                </div>
                                {contract.expert.split(' ')[0]}
                              </div>

                              {/* Arrow */}
                              <ChevronRight size={12} className="text-gray-300" />

                              {/* Company signature */}
                              <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border ${
                                contract.signedByCompany
                                  ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                  : 'text-amber-600 bg-amber-50 border-amber-100'
                              }`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  contract.signedByCompany ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}>
                                  {contract.signedByCompany
                                    ? <Check size={9} className="text-white" strokeWidth={3} />
                                    : <Clock size={9} className="text-white" />
                                  }
                                </div>
                                Acme Corp
                              </div>
                            </div>

                            {contract.signedDate && (
                              <span className="text-[10px] text-gray-400 font-semibold">
                                Fully signed on {contract.signedDate}
                              </span>
                            )}
                            {contract.expiresAt && !contract.signedByCompany && (
                              <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                <AlertCircle size={10} /> Sign before {contract.expiresAt}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Primary action */}
                          {contract.status === 'Pending Signature' ? (
                            <motion.button
                              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(20,78,64,0.25)' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowSignModal(contract)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-xs font-black rounded-xl shadow-md"
                            >
                              <PenLine size={13} /> Sign Now
                            </motion.button>
                          ) : contract.status === 'Signed' ? (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowViewModal(contract)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                            >
                              <Eye size={13} /> View
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowViewModal(contract)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                            >
                              <Eye size={13} /> Preview
                            </motion.button>
                          )}

                          {/* Download */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 bg-white border border-gray-200 text-gray-400 hover:text-[#0eb59a] hover:border-teal-200 rounded-xl transition-all shadow-sm"
                          >
                            <Download size={14} />
                          </motion.button>

                          {/* More options */}
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveDropdown(activeDropdown === contract.id ? null : contract.id)}
                              className="p-2.5 bg-white border border-gray-200 text-gray-400 hover:text-gray-600 rounded-xl transition-all shadow-sm"
                            >
                              <MoreVertical size={14} />
                            </motion.button>

                            <AnimatePresence>
                              {activeDropdown === contract.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                                >
                                  {[
                                    { label: 'View Contract', icon: Eye, action: () => { setShowViewModal(contract); setActiveDropdown(null); } },
                                    { label: 'Download PDF', icon: Download, action: () => setActiveDropdown(null) },
                                    { label: 'Copy Link', icon: Copy, action: () => setActiveDropdown(null) },
                                    ...(contract.status === 'Pending Signature' ? [{ label: 'Sign Now', icon: PenLine, action: () => { setShowSignModal(contract); setActiveDropdown(null); } }] : []),
                                    ...(contract.status === 'Expired' ? [{ label: 'Request Renewal', icon: RefreshCw, action: () => setActiveDropdown(null) }] : []),
                                  ].map((item, iIdx) => (
                                    <motion.button
                                      key={iIdx}
                                      whileHover={{ backgroundColor: '#f9fafb' }}
                                      onClick={item.action}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors"
                                    >
                                      <item.icon size={14} className="text-[#0eb59a]" />
                                      {item.label}
                                    </motion.button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent for pending */}
                    {contract.status === 'Pending Signature' && (
                      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400">
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                      </div>
                    )}
                    {contract.status === 'Signed' && (
                      <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* ── INFO SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Shield size={15} className="text-[#0eb59a]" /> How CXO Connect Manages Your Contracts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: 'Auto-Generated',
                desc: 'All contracts are automatically generated when an engagement is confirmed — no manual drafting needed.',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                icon: Shield,
                title: 'Legally Binding',
                desc: 'Every agreement is legally vetted by our legal team and compliant with Indian contract law.',
                color: 'text-purple-500',
                bg: 'bg-purple-50',
              },
              {
                icon: Lock,
                title: 'Escrow-Linked',
                desc: 'Contracts are linked to milestone-based escrow payments — funds release only after your approval.',
                color: 'text-teal-500',
                bg: 'bg-teal-50',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon size={17} className={item.color} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Close dropdown */}
      {activeDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}

      {/* ══ VIEW CONTRACT MODAL ══ */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    showViewModal.type === 'NDA' ? 'bg-purple-50' : 'bg-blue-50'
                  }`}>
                    <FileText size={18} className={showViewModal.type === 'NDA' ? 'text-purple-500' : 'text-blue-500'} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm leading-tight">{showViewModal.title}</h3>
                    <p className="text-xs text-gray-400 font-semibold">{showViewModal.pages} pages · {showViewModal.fileSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <Download size={13} /> Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowViewModal(null)}
                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Status bar */}
              <div className={`flex items-center gap-3 px-6 py-3 border-b border-gray-50 ${
                showViewModal.status === 'Signed' ? 'bg-emerald-50' :
                showViewModal.status === 'Pending Signature' ? 'bg-amber-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-4 flex-1">
                  {[
                    { label: showViewModal.expert.split(' ')[0], signed: showViewModal.signedByExpert },
                    { label: 'Acme Corp', signed: showViewModal.signedByCompany },
                    { label: 'CXO Connect', signed: true },
                  ].map((party, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-xs font-bold">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        party.signed ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}>
                        {party.signed
                          ? <Check size={10} className="text-white" strokeWidth={3} />
                          : <Clock size={10} className="text-white" />
                        }
                      </div>
                      <span className={party.signed ? 'text-emerald-700' : 'text-amber-700'}>
                        {party.label}
                      </span>
                    </div>
                  ))}
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${getStatusStyle(showViewModal.status).color}`}>
                  {showViewModal.status}
                </span>
              </div>

              {/* Contract Content */}
              <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden">
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <pre className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">
                    {contractPreview}
                  </pre>
                </div>
              </div>

              {/* Footer actions */}
              <div className="p-5 border-t border-gray-100 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowViewModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Close
                </motion.button>
                {showViewModal.status === 'Pending Signature' && (
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setShowViewModal(null); setShowSignModal(showViewModal); }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-md"
                  >
                    <PenLine size={14} className="inline mr-1.5" /> Sign This Contract
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SIGN CONTRACT MODAL ══ */}
      <AnimatePresence>
        {showSignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <AnimatePresence mode="wait">
                {!signatureSent ? (
                  <motion.div
                    key="sign-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-teal-100">
                      <PenLine size={28} className="text-[#0eb59a]" />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 text-center mb-1">Sign Contract</h3>
                    <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                      You are signing <span className="font-bold text-gray-700">{showSignModal.title}</span>.
                      Type your full name below to apply your digital signature.
                    </p>

                    {/* Contract summary */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5 space-y-2">
                      {[
                        { label: 'Expert', value: `${showSignModal.expert} · ${showSignModal.expertTitle}` },
                        { label: 'Engagement', value: showSignModal.engagement },
                        { label: 'Value', value: showSignModal.value },
                        { label: 'Duration', value: `${showSignModal.startDate} → ${showSignModal.endDate}` },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-400 font-semibold">{item.label}</span>
                          <span className="font-bold text-gray-700">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Signature input */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Your Full Name (Digital Signature)
                      </label>
                      <input
                        type="text"
                        value={signatureText}
                        onChange={e => setSignatureText(e.target.value)}
                        placeholder="Type your full name exactly..."
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        style={{ fontFamily: 'cursive', fontSize: '16px' }}
                      />
                      {signatureText && (
                        <p className="text-[10px] text-gray-400 mt-2 font-semibold text-center">
                          Preview: <span style={{ fontFamily: 'cursive', fontSize: '14px' }} className="text-[#134e40] font-bold">{signatureText}</span>
                        </p>
                      )}
                    </div>

                    {/* Legal notice */}
                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-5">
                      <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        By signing, you agree to all terms of this contract. Your digital signature is legally binding under the Information Technology Act, 2000.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowSignModal(null); setSignatureText(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: signatureText.trim() ? 1.02 : 1, boxShadow: signatureText.trim() ? '0 8px 25px rgba(20,78,64,0.25)' : 'none' }}
                        whileTap={{ scale: signatureText.trim() ? 0.98 : 1 }}
                        disabled={!signatureText.trim()}
                        onClick={handleSign}
                        className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                          signatureText.trim()
                            ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <PenLine size={14} className="inline mr-1.5" />
                        Sign & Submit
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sign-success"
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
                    <h3 className="text-xl font-black text-gray-900 mb-2">Contract Signed!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Your signature has been applied successfully. The engagement is now officially active.
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

    </div>
  );
};

export default Contracts;
