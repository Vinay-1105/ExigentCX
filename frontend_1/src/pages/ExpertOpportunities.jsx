import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Search, Filter, Briefcase, Clock,
  MapPin, DollarSign, Star, Check, X, Heart,
  SlidersHorizontal, ChevronDown, ChevronUp,
  Zap, Shield, Users, Building, Calendar,
  ArrowUpRight, RefreshCw, Send, FileText,
  CheckCircle, AlertCircle, Eye, TrendingUp,
  Grid, List, BookOpen, Award, Target
} from 'lucide-react';

const ExpertOpportunities = () => {
  const navigate = useNavigate();
  const { opportunityId } = useParams();

  // ── STATE ──
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(true);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [expandedFilter, setExpandedFilter] = useState('type');
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [proposalText, setProposalText] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [applySent, setApplySent] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    industry: [],
    commitment: [],
    budget: '',
    location: [],
    urgency: [],
  });

  // ── DATA ──
  const statusFilters = ['All', 'Best Match', 'New', 'Saved', 'Applied'];

  const opportunities = [
    {
      id: 1,
      title: 'Fractional CFO',
      company: 'HealthTech Startup',
      companySize: 'Series A · 50-200 employees',
      industry: 'Healthcare',
      type: 'Fractional',
      match: 96,
      budget: '₹2L - ₹3L/mo',
      budgetNum: 250000,
      commitment: '20 hrs/wk',
      duration: '6 months',
      location: 'Remote',
      postedDate: '2 days ago',
      urgency: 'Immediate',
      skills: ['Financial Modeling', 'Fundraising', 'M&A', 'Investor Relations'],
      description: 'We are a Series A HealthTech company looking for an experienced CFO to lead our Series B fundraising and build our financial infrastructure. The ideal candidate has prior experience raising $10M+ rounds.',
      logo: 'HT',
      logoColor: 'from-blue-500 to-cyan-400',
      status: 'new',
      applicants: 4,
      verified: true,
    },
    {
      id: 2,
      title: 'Interim CFO',
      company: 'D2C Brand',
      companySize: 'Series B · 200-500 employees',
      industry: 'E-commerce',
      type: 'Interim',
      match: 91,
      budget: '₹2.5L - ₹4L/mo',
      budgetNum: 350000,
      commitment: '40 hrs/wk',
      duration: '3 months',
      location: 'Hybrid | Mumbai',
      postedDate: '1 week ago',
      urgency: 'Immediate',
      skills: ['P&L Management', 'Investor Relations', 'IPO Readiness', 'Treasury'],
      description: 'Fast-growing D2C brand looking for an Interim CFO to support our IPO preparation process. You will work closely with the founding team and investment bankers.',
      logo: 'DC',
      logoColor: 'from-purple-500 to-violet-400',
      status: 'featured',
      applicants: 7,
      verified: true,
    },
    {
      id: 3,
      title: 'Advisory Board — Finance',
      company: 'Logistics Startup',
      companySize: 'Seed · 10-50 employees',
      industry: 'Logistics',
      type: 'Advisory',
      match: 88,
      budget: '₹60K - ₹1L/mo',
      budgetNum: 80000,
      commitment: '8 hrs/wk',
      duration: '12 months',
      location: 'Remote',
      postedDate: '3 days ago',
      urgency: 'Planned',
      skills: ['Supply Chain Finance', 'Working Capital', 'Unit Economics'],
      description: 'Early-stage logistics startup seeking an experienced finance advisor to help us build our financial model and prepare for our Seed round.',
      logo: 'LS',
      logoColor: 'from-amber-500 to-orange-400',
      status: 'new',
      applicants: 2,
      verified: false,
    },
    {
      id: 4,
      title: 'Fractional VP Finance',
      company: 'SaaS Platform',
      companySize: 'Series B · 100-300 employees',
      industry: 'SaaS',
      type: 'Fractional',
      match: 84,
      budget: '₹1.5L - ₹2.5L/mo',
      budgetNum: 200000,
      commitment: '15 hrs/wk',
      duration: '9 months',
      location: 'Remote',
      postedDate: '5 days ago',
      urgency: 'Planned',
      skills: ['SaaS Metrics', 'Board Reporting', 'Revenue Forecasting', 'FP&A'],
      description: 'B2B SaaS company looking for a Fractional VP Finance to own our financial planning, board reporting, and revenue operations.',
      logo: 'SP',
      logoColor: 'from-teal-500 to-emerald-400',
      status: 'normal',
      applicants: 9,
      verified: true,
    },
    {
      id: 5,
      title: 'Interim Group CFO',
      company: 'Manufacturing Conglomerate',
      companySize: 'Listed · 1000+ employees',
      industry: 'Manufacturing',
      type: 'Interim',
      match: 79,
      budget: '₹5L - ₹8L/mo',
      budgetNum: 650000,
      commitment: '40 hrs/wk',
      duration: '6 months',
      location: 'In Office | Pune',
      postedDate: '2 weeks ago',
      urgency: 'Immediate',
      skills: ['Group Finance', 'IFRS', 'M&A Integration', 'Capital Markets'],
      description: 'Listed manufacturing group seeking a seasoned Group CFO for a 6-month interim engagement to manage a major acquisition integration.',
      logo: 'MC',
      logoColor: 'from-gray-600 to-gray-500',
      status: 'normal',
      applicants: 12,
      verified: true,
    },
    {
      id: 6,
      title: 'Finance Advisory — Pre-IPO',
      company: 'EdTech Unicorn',
      companySize: 'Series D · 500-1000 employees',
      industry: 'EdTech',
      type: 'Advisory',
      match: 75,
      budget: '₹1L - ₹1.8L/mo',
      budgetNum: 140000,
      commitment: '10 hrs/wk',
      duration: '18 months',
      location: 'Remote',
      postedDate: '1 week ago',
      urgency: 'Planned',
      skills: ['IPO Preparation', 'Investor Relations', 'Regulatory Compliance', 'ESOP'],
      description: 'India\'s leading EdTech platform preparing for IPO in 2026. Looking for a seasoned financial advisor with prior public market experience.',
      logo: 'EU',
      logoColor: 'from-rose-500 to-pink-400',
      status: 'featured',
      applicants: 15,
      verified: true,
    },
  ];

  const filterSections = [
    {
      id: 'type',
      label: 'Engagement Type',
      icon: Briefcase,
      options: ['Fractional', 'Interim', 'Advisory', 'Project']
    },
    {
      id: 'industry',
      label: 'Industry',
      icon: Building,
      options: ['SaaS', 'Fintech', 'Healthcare', 'E-commerce', 'Manufacturing', 'Logistics', 'EdTech', 'BFSI']
    },
    {
      id: 'commitment',
      label: 'Commitment',
      icon: Clock,
      options: ['Under 10 hrs/wk', '10-20 hrs/wk', '20-30 hrs/wk', 'Full-time (40 hrs)']
    },
    {
      id: 'location',
      label: 'Location',
      icon: MapPin,
      options: ['Remote', 'Hybrid', 'In Office']
    },
    {
      id: 'urgency',
      label: 'Urgency',
      icon: Zap,
      options: ['Immediate', 'Planned']
    },
  ];

  const budgetOptions = ['Any', 'Under ₹1L/mo', '₹1L - ₹2L/mo', '₹2L - ₹4L/mo', '₹4L+/mo'];

  // ── HELPERS ──
  const toggleFilter = (section, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter(v => v !== value)
        : [...prev[section], value]
    }));
  };

  const toggleSaved = (id) => {
    setSavedOpportunities(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters({ type: [], industry: [], commitment: [], budget: '', location: [], urgency: [] });
    setSearchQuery('');
  };

  const totalActiveFilters =
    activeFilters.type.length +
    activeFilters.industry.length +
    activeFilters.commitment.length +
    activeFilters.location.length +
    activeFilters.urgency.length +
    (activeFilters.budget ? 1 : 0);

  const filteredOpportunities = opportunities.filter(opp => {
    if (activeFilter === 'Saved' && !savedOpportunities.includes(opp.id)) return false;
    if (activeFilter === 'Best Match' && opp.match < 85) return false;
    if (activeFilter === 'New' && opp.status !== 'new') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!opp.title.toLowerCase().includes(q) &&
        !opp.company.toLowerCase().includes(q) &&
        !opp.industry.toLowerCase().includes(q) &&
        !opp.skills.some(s => s.toLowerCase().includes(q))) return false;
    }
    if (activeFilters.type.length > 0 && !activeFilters.type.includes(opp.type)) return false;
    if (activeFilters.industry.length > 0 && !activeFilters.industry.includes(opp.industry)) return false;
    if (activeFilters.location.length > 0) {
      const locMatch = activeFilters.location.some(l => opp.location.includes(l));
      if (!locMatch) return false;
    }
    if (activeFilters.urgency.length > 0 && !activeFilters.urgency.includes(opp.urgency)) return false;
    return true;
  });

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Fractional': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Interim': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Advisory': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Project': return 'text-teal-700 bg-teal-50 border-teal-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleApply = () => {
    setApplySent(true);
    setTimeout(() => {
      setShowApplyModal(null);
      setApplySent(false);
      setProposalText('');
      setProposedRate('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 py-8 pb-16">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
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
              <span className="text-sm font-bold text-gray-700">Opportunities</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Browse Opportunities
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {filteredOpportunities.length} roles matched to your profile
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {[
                { id: 'grid', icon: Grid },
                { id: 'list', icon: List },
              ].map(({ id, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(id)}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === id
                      ? 'bg-[#134e40] text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon size={16} />
                </motion.button>
              ))}
            </div>

            {/* Filter toggle */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                showFilters
                  ? 'bg-[#134e40] text-white border-[#134e40]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#0eb59a]/40'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {totalActiveFilters > 0 && (
                <span className="bg-[#0eb59a] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {totalActiveFilters}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ── SEARCH ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative mb-5 group"
        >
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors"
          />
          <input
            type="text"
            placeholder="Search by title, company, skill, or industry..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-13 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>

        {/* ── STATUS FILTER TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex gap-2 flex-wrap mb-6"
        >
          {statusFilters.map(filter => (
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
              {filter === 'Saved' && savedOpportunities.length > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${
                  activeFilter === filter ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                }`}>
                  {savedOpportunities.length}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* ── MAIN LAYOUT ── */}
        <div className="flex gap-6">

          {/* ── FILTER PANEL ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 260, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-[260px] bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sticky top-6">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                      <Filter size={14} className="text-[#0eb59a]" /> Filters
                    </h3>
                    {totalActiveFilters > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={clearAllFilters}
                        className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw size={11} /> Clear all
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic filter sections */}
                    {filterSections.map((section) => (
                      <div key={section.id} className="border-b border-gray-50 pb-4">
                        <button
                          onClick={() => setExpandedFilter(expandedFilter === section.id ? null : section.id)}
                          className="w-full flex items-center justify-between mb-3 group"
                        >
                          <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <section.icon size={13} className="text-[#0eb59a]" />
                            {section.label}
                            {activeFilters[section.id]?.length > 0 && (
                              <span className="bg-[#0eb59a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                {activeFilters[section.id].length}
                              </span>
                            )}
                          </span>
                          {expandedFilter === section.id
                            ? <ChevronUp size={14} className="text-gray-400" />
                            : <ChevronDown size={14} className="text-gray-400" />
                          }
                        </button>

                        <AnimatePresence>
                          {expandedFilter === section.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden space-y-1.5"
                            >
                              {section.options.map((option) => {
                                const isActive = activeFilters[section.id]?.includes(option);
                                return (
                                  <motion.button
                                    key={option}
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => toggleFilter(section.id, option)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                      isActive
                                        ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                                  >
                                    {option}
                                    {isActive && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-4 h-4 bg-[#0eb59a] rounded-full flex items-center justify-center"
                                      >
                                        <Check size={9} className="text-white" strokeWidth={3} />
                                      </motion.div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    {/* Budget */}
                    <div>
                      <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <DollarSign size={13} className="text-[#0eb59a]" /> Budget Range
                      </p>
                      <div className="space-y-1.5">
                        {budgetOptions.map(bud => (
                          <motion.button
                            key={bud}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveFilters(prev => ({
                              ...prev,
                              budget: bud === 'Any' ? '' : bud
                            }))}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              (bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud
                                ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {bud}
                            {((bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4 bg-[#0eb59a] rounded-full flex items-center justify-center"
                              >
                                <Check size={9} className="text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── OPPORTUNITIES LIST ── */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {totalActiveFilters > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                {Object.entries(activeFilters).map(([key, val]) => {
                  if (!val || (Array.isArray(val) && val.length === 0)) return null;
                  const items = Array.isArray(val) ? val : [val];
                  return items.map(item => (
                    <motion.span
                      key={`${key}-${item}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-[#134e40] text-xs font-bold rounded-xl border border-teal-100"
                    >
                      {item}
                      <button onClick={() => {
                        if (Array.isArray(activeFilters[key])) toggleFilter(key, item);
                        else setActiveFilters(prev => ({ ...prev, [key]: '' }));
                      }}>
                        <X size={11} />
                      </button>
                    </motion.span>
                  ));
                })}
              </motion.div>
            )}

            {/* Results count + sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-500">
                Showing <span className="text-gray-900 font-black">{filteredOpportunities.length}</span> opportunities
              </p>
              <select className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20">
                <option>Best Match</option>
                <option>Newest First</option>
                <option>Highest Budget</option>
                <option>Fewest Applicants</option>
              </select>
            </div>

            {/* Opportunities */}
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Briefcase size={24} className="text-gray-300" />
                  </div>
                  <h3 className="font-black text-gray-700 text-lg mb-2">No opportunities found</h3>
                  <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search query</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-[#134e40] text-white text-sm font-bold rounded-xl"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredOpportunities.map((opp, idx) => (
                    <motion.div
                      key={opp.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group transition-all duration-300"
                    >
                      {/* Card top accent */}
                      {opp.status === 'featured' && (
                        <div className="h-1 bg-gradient-to-r from-[#134e40] to-[#0eb59a]" />
                      )}
                      {opp.status === 'new' && (
                        <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
                      )}

                      <div className="p-5">
                        {/* Top badges */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getTypeStyle(opp.type)}`}>
                            {opp.type}
                          </span>
                          {opp.status === 'featured' && (
                            <span className="text-[10px] font-black text-[#134e40] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1">
                              <Star size={9} fill="currentColor" /> Featured
                            </span>
                          )}
                          {opp.status === 'new' && (
                            <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                              New
                            </span>
                          )}
                          <span className="ml-auto text-[10px] font-black text-[#134e40] bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
                            {opp.match}% Match
                          </span>
                        </div>

                        {/* Company + title */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                            <span className="text-white font-black text-sm">{opp.logo}</span>
                          </div>
                          <div className="min-w-0">
                            <h3
                              onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                              className="font-black text-gray-900 text-sm group-hover:text-[#0eb59a] transition-colors cursor-pointer leading-tight"
                            >
                              {opp.title}
                            </h3>
                            <p className="text-xs font-bold text-gray-600 mt-0.5">{opp.company}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{opp.companySize}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                          {opp.description}
                        </p>

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { icon: DollarSign, label: opp.budget, color: 'text-[#0eb59a]' },
                            { icon: Clock, label: opp.commitment, color: 'text-blue-400' },
                            { icon: MapPin, label: opp.location.split(' | ')[0], color: 'text-rose-400' },
                            { icon: Calendar, label: opp.duration, color: 'text-purple-400' },
                          ].map((meta, mIdx) => (
                            <div key={mIdx} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                              <meta.icon size={11} className={meta.color} />
                              <span className="truncate">{meta.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {opp.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded-lg">
                              {skill}
                            </span>
                          ))}
                          {opp.skills.length > 3 && (
                            <span className="text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2 py-1 rounded-lg">
                              +{opp.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                            <span className="flex items-center gap-1">
                              <Users size={10} /> {opp.applicants} applied
                            </span>
                            <span>{opp.postedDate}</span>
                          </div>
                          {opp.urgency === 'Immediate' && (
                            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Zap size={9} fill="currentColor" /> Urgent
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-3">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowApplyModal(opp)}
                            className="flex-1 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all shadow-sm"
                          >
                            Apply Now
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                            className="px-3 py-2.5 bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 rounded-xl transition-all"
                          >
                            <Eye size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSaved(opp.id)}
                            className={`px-3 py-2.5 rounded-xl transition-all border ${
                              savedOpportunities.includes(opp.id)
                                ? 'bg-red-50 text-red-500 border-red-100'
                                : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-red-50 hover:text-red-400'
                            }`}
                          >
                            <Heart size={14} fill={savedOpportunities.includes(opp.id) ? 'currentColor' : 'none'} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // ── LIST VIEW ──
                <div className="flex flex-col gap-4">
                  {filteredOpportunities.map((opp, idx) => (
                    <motion.div
                      key={opp.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-5 group transition-all"
                    >
                      {/* Logo */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                        <span className="text-white font-black text-base">{opp.logo}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${getTypeStyle(opp.type)}`}>
                            {opp.type}
                          </span>
                          {opp.urgency === 'Immediate' && (
                            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 flex items-center gap-1">
                              <Zap size={9} fill="currentColor" /> Urgent
                            </span>
                          )}
                          <span className="ml-auto text-[10px] font-black text-[#134e40] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                            {opp.match}% Match
                          </span>
                        </div>

                        <h3
                          onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                          className="font-black text-gray-900 text-base group-hover:text-[#0eb59a] transition-colors cursor-pointer leading-tight mb-0.5"
                        >
                          {opp.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold mb-3">
                          {opp.company} · {opp.companySize}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-semibold mb-3">
                          <span className="flex items-center gap-1.5 text-[#0eb59a] font-bold">
                            <DollarSign size={11} /> {opp.budget}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} /> {opp.commitment}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={11} /> {opp.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} /> {opp.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users size={11} /> {opp.applicants} applied
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {opp.skills.slice(0, 4).map(skill => (
                            <span key={skill} className="text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded-lg">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowApplyModal(opp)}
                          className="px-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all shadow-sm"
                        >
                          Apply Now
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-50 transition-all"
                        >
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleSaved(opp.id)}
                          className={`py-2.5 rounded-xl transition-all border flex items-center justify-center gap-1.5 text-xs font-bold ${
                            savedOpportunities.includes(opp.id)
                              ? 'bg-red-50 text-red-500 border-red-100'
                              : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-red-50 hover:text-red-400'
                          }`}
                        >
                          <Heart size={13} fill={savedOpportunities.includes(opp.id) ? 'currentColor' : 'none'} />
                          {savedOpportunities.includes(opp.id) ? 'Saved' : 'Save'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══ APPLY MODAL ══ */}
      <AnimatePresence>
        {showApplyModal && (
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
                {!applySent ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Opportunity mini card */}
                    <div className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-white border border-teal-100 mb-6`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${showApplyModal.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                        <span className="text-white font-black text-sm">{showApplyModal.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-900 text-sm leading-tight">{showApplyModal.title}</h4>
                        <p className="text-xs text-gray-500 font-semibold">{showApplyModal.company}</p>
                        <p className="text-[10px] text-[#0eb59a] font-black mt-0.5">{showApplyModal.budget}</p>
                      </div>
                      <span className="text-xs font-black text-[#134e40] bg-teal-100 px-2.5 py-1.5 rounded-xl shrink-0">
                        {showApplyModal.match}% Match
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-1">Submit Proposal</h3>
                    <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                      Introduce yourself and explain why you're the right fit for this role.
                    </p>

                    {/* Proposed Rate */}
                    <div className="mb-4">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Your Proposed Monthly Rate
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                        <input
                          type="text"
                          value={proposedRate}
                          onChange={e => setProposedRate(e.target.value)}
                          placeholder={`Budget: ${showApplyModal.budget}`}
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Proposal Text */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Cover Letter / Proposal *
                      </label>
                      <textarea
                        value={proposalText}
                        onChange={e => setProposalText(e.target.value)}
                        placeholder={`Hi, I'm a CFO with 18 years of experience at Meesho and OYO. I've led $200M+ in fundraising and have deep expertise in the areas you're looking for...`}
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none"
                      />
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold text-right">
                        {proposalText.length}/500 characters
                      </p>
                    </div>

                    {/* Availability confirmation */}
                    <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 mb-5 flex items-start gap-2">
                      <CheckCircle size={15} className="text-[#0eb59a] shrink-0 mt-0.5" />
                      <p className="text-xs text-teal-700 font-semibold leading-relaxed">
                        By applying, you confirm you are available for <span className="font-black">{showApplyModal.commitment}</span> starting <span className="font-black">immediately</span>.
                        The company will review your profile and respond within 48 hours.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowApplyModal(null); setProposalText(''); setProposedRate(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: proposalText.trim() ? 1.02 : 1, boxShadow: proposalText.trim() ? '0 8px 25px rgba(20,78,64,0.25)' : 'none' }}
                        whileTap={{ scale: proposalText.trim() ? 0.98 : 1 }}
                        disabled={!proposalText.trim()}
                        onClick={handleApply}
                        className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                          proposalText.trim()
                            ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send size={14} className="inline mr-1.5" />
                        Submit Proposal
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
                    <h3 className="text-xl font-black text-gray-900 mb-2">Proposal Submitted!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Your proposal for <span className="font-bold text-gray-700">{showApplyModal.title}</span> at <span className="font-bold text-gray-700">{showApplyModal.company}</span> has been sent. Expect a response within 48 hours.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100">
                      <Shield size={12} /> Reviewed by CXO Connect PMO
                    </div>
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

export default ExpertOpportunities;
