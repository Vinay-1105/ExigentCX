import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Briefcase, Clock, Users,
  ChevronRight, MoreVertical, Copy, X, CheckCircle,
  AlertCircle, Archive, Eye, Edit, Trash2, ArrowUpRight,
  Target, DollarSign, Calendar, MapPin, Zap, TrendingUp
} from 'lucide-react';

const Requirements = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  // ── DATA ──
  const filters = ['All', 'Active', 'Draft', 'Shortlisting', 'Closed'];

  const requirements = [
    {
      id: 1,
      title: 'Interim CFO',
      type: 'Interim',
      status: 'Active',
      functionalArea: 'Finance',
      budget: '₹2L - ₹3.5L/mo',
      duration: '6 months',
      commitment: '40 hrs/wk',
      urgency: 'Immediate',
      location: 'Remote',
      postedDate: '3 days ago',
      matchedExperts: 12,
      shortlisted: 4,
      invited: 2,
      skills: ['Financial Modeling', 'Fundraising', 'M&A', 'Investor Relations'],
      description: 'Looking for an experienced CFO to lead our Series B fundraising and build financial infrastructure.',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      urgencyColor: 'text-red-600 bg-red-50'
    },
    {
      id: 2,
      title: 'Fractional CMO',
      type: 'Fractional',
      status: 'Shortlisting',
      functionalArea: 'Growth',
      budget: '₹1.2L - ₹2L/mo',
      duration: '3 months',
      commitment: '20 hrs/wk',
      urgency: 'Planned',
      location: 'Hybrid | Mumbai',
      postedDate: '1 week ago',
      matchedExperts: 8,
      shortlisted: 6,
      invited: 3,
      skills: ['Brand Strategy', 'Growth Marketing', 'B2B Marketing', 'Product Marketing'],
      description: 'Need a senior marketing leader to define our GTM strategy and build the marketing function.',
      statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
      urgencyColor: 'text-amber-600 bg-amber-50'
    },
    {
      id: 3,
      title: 'VP Engineering',
      type: 'Fractional',
      status: 'Draft',
      functionalArea: 'Technology',
      budget: '₹1.5L - ₹2.5L/mo',
      duration: '4 months',
      commitment: '15 hrs/wk',
      urgency: 'Planned',
      location: 'Remote',
      postedDate: '2 weeks ago',
      matchedExperts: 0,
      shortlisted: 0,
      invited: 0,
      skills: ['Engineering Leadership', 'System Architecture', 'Team Scaling'],
      description: 'Draft requirement for a VP Engineering to help scale our tech team and architecture.',
      statusColor: 'text-gray-500 bg-gray-50 border-gray-200',
      urgencyColor: 'text-gray-500 bg-gray-50'
    },
    {
      id: 4,
      title: 'Advisory Board Member — Sales',
      type: 'Advisory',
      status: 'Active',
      functionalArea: 'Sales',
      budget: '₹40K - ₹80K/mo',
      duration: '12 months',
      commitment: '8 hrs/wk',
      urgency: 'Planned',
      location: 'Remote',
      postedDate: '2 weeks ago',
      matchedExperts: 15,
      shortlisted: 2,
      invited: 1,
      skills: ['Enterprise Sales', 'B2B SaaS', 'Revenue Strategy'],
      description: 'Seeking an experienced sales leader to advise on enterprise sales strategy and key account acquisition.',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      urgencyColor: 'text-amber-600 bg-amber-50'
    },
    {
      id: 5,
      title: 'Interim COO',
      type: 'Interim',
      status: 'Closed',
      functionalArea: 'Operations',
      budget: '₹2.5L - ₹4L/mo',
      duration: '3 months',
      commitment: '40 hrs/wk',
      urgency: 'Immediate',
      location: 'In Office | Bangalore',
      postedDate: '2 months ago',
      matchedExperts: 20,
      shortlisted: 8,
      invited: 5,
      skills: ['Operations', 'Supply Chain', 'Process Optimization', 'OKRs'],
      description: 'Closed role — successfully placed Interim COO for 3-month engagement.',
      statusColor: 'text-gray-400 bg-gray-50 border-gray-200',
      urgencyColor: 'text-gray-400 bg-gray-50'
    }
  ];

  // ── COMPUTED ──
  const filteredRequirements = requirements.filter(req => {
    const matchesFilter = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.functionalArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: requirements.length,
    active: requirements.filter(r => r.status === 'Active').length,
    draft: requirements.filter(r => r.status === 'Draft').length,
    shortlisting: requirements.filter(r => r.status === 'Shortlisting').length,
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Interim': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Fractional': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Advisory': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── BACKGROUND DECORATION ── */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-8 pb-16 space-y-6">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
              <span className="text-sm font-bold text-gray-700">My Requirements</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              My Requirements
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage all your posted roles and track expert matches
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/requirements/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-900/15 shrink-0"
          >
            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
              <Plus size={16} />
            </motion.div>
            New Requirement
          </motion.button>
        </motion.div>

        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Posted', value: stats.total, icon: Briefcase, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-l-gray-400' },
            { label: 'Active', value: stats.active, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
            { label: 'Shortlisting', value: stats.shortlisting, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
            { label: 'Drafts', value: stats.draft, icon: Edit, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + idx * 0.06 }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl p-4 border border-gray-100 border-l-4 ${stat.border} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={15} className={stat.color} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── SEARCH + FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors"
            />
            <input
              type="text"
              placeholder="Search requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-[#134e40] text-white shadow-md shadow-teal-900/15'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0eb59a]/40 hover:text-[#0eb59a]'
                }`}
              >
                {filter}
                {filter !== 'All' && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    activeFilter === filter ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {requirements.filter(r => r.status === filter).length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── REQUIREMENTS LIST ── */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRequirements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <h3 className="font-black text-gray-700 text-lg mb-2">No requirements found</h3>
                <p className="text-gray-400 text-sm mb-6">
                  {searchQuery ? `No results for "${searchQuery}"` : `No ${activeFilter.toLowerCase()} requirements yet`}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/requirements/create')}
                  className="px-6 py-2.5 bg-[#134e40] text-white text-sm font-bold rounded-xl"
                >
                  + Create New Requirement
                </motion.button>
              </motion.div>
            ) : (
              filteredRequirements.map((req, idx) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 group ${req.status === 'Closed' ? 'opacity-70' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">

                      {/* Left — Main Info */}
                      <div className="flex-1 min-w-0">

                        {/* Top Row */}
                        <div className="flex items-start gap-3 mb-3 flex-wrap">
                          {/* Type badge */}
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getTypeColor(req.type)}`}>
                            {req.type}
                          </span>
                          {/* Status badge */}
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${req.statusColor}`}>
                            {req.status === 'Active' && (
                              <motion.span
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                              />
                            )}
                            {req.status}
                          </span>
                          {/* Urgency */}
                          {req.urgency === 'Immediate' && (
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1 ${req.urgencyColor}`}>
                              <Zap size={10} fill="currentColor" /> Immediate
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => navigate(`/requirements/${req.id}`)}
                          className="text-lg font-black text-gray-900 group-hover:text-[#0eb59a] transition-colors cursor-pointer mb-1 leading-tight"
                        >
                          {req.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">
                          {req.description}
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-semibold mb-4">
                          <span className="flex items-center gap-1.5">
                            <DollarSign size={12} className="text-[#0eb59a]" /> {req.budget}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-blue-400" /> {req.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Target size={12} className="text-purple-400" /> {req.commitment}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-rose-400" /> {req.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-300" /> Posted {req.postedDate}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {req.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-1 rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                      </div>

                      {/* Right — Stats + Actions */}
                      <div className="flex flex-row lg:flex-col gap-4 lg:items-end shrink-0">

                        {/* Match Stats */}
                        {req.status !== 'Draft' && (
                          <div className="flex lg:flex-col gap-3">
                            {[
                              { label: 'Matched', value: req.matchedExperts, color: 'text-teal-600 bg-teal-50', icon: Users },
                              { label: 'Shortlisted', value: req.shortlisted, color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
                              { label: 'Invited', value: req.invited, color: 'text-purple-600 bg-purple-50', icon: ArrowUpRight },
                            ].map((stat, sIdx) => (
                              <div key={sIdx} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${stat.color}`}>
                                <stat.icon size={13} />
                                <span className="text-xs font-black">{stat.value}</span>
                                <span className="text-[10px] font-semibold opacity-70">{stat.label}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 lg:mt-2">
                          {req.status === 'Draft' ? (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => navigate(`/requirements/create?draft=${req.id}`)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#134e40] text-white text-xs font-bold rounded-xl hover:bg-[#0eb59a] transition-all shadow-sm"
                            >
                              <Edit size={13} /> Continue Draft
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => navigate(`/requirements/${req.id}`)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#134e40] text-white text-xs font-bold rounded-xl hover:bg-[#0eb59a] transition-all shadow-sm"
                            >
                              <Eye size={13} /> View Details
                            </motion.button>
                          )}

                          {/* More options dropdown */}
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                            >
                              <MoreVertical size={14} />
                            </motion.button>

                            <AnimatePresence>
                              {activeDropdown === req.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                                >
                                  {[
                                    { label: 'View Details', icon: Eye, action: () => navigate(`/requirements/${req.id}`) },
                                    { label: 'Edit', icon: Edit, action: () => navigate(`/requirements/create?edit=${req.id}`) },
                                    { label: 'Duplicate', icon: Copy, action: () => {} },
                                    { label: 'Archive', icon: Archive, action: () => {} },
                                    { label: 'Delete', icon: Trash2, action: () => { setShowDeleteModal(req.id); setActiveDropdown(null); }, danger: true },
                                  ].map((item, iIdx) => (
                                    <motion.button
                                      key={iIdx}
                                      whileHover={{ backgroundColor: item.danger ? '#fef2f2' : '#f9fafb' }}
                                      onClick={() => { item.action(); setActiveDropdown(null); }}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
                                        item.danger ? 'text-red-500' : 'text-gray-600'
                                      }`}
                                    >
                                      <item.icon size={14} />
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
                  </div>

                  {/* Bottom Progress Bar for active */}
                  {req.status === 'Shortlisting' && (
                    <div className="px-6 pb-4">
                      <div className="flex justify-between text-xs text-gray-400 font-semibold mb-1.5">
                        <span>Shortlisting Progress</span>
                        <span className="font-black text-[#134e40]">{Math.round((req.shortlisted / req.matchedExperts) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(req.shortlisted / req.matchedExperts) * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {showDeleteModal && (
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
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">
                Delete Requirement?
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                This will permanently delete this requirement and all associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close dropdown on outside click */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}

    </div>
  );
};

export default Requirements;
