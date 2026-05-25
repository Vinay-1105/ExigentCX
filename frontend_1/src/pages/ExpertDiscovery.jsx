import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, Clock, MapPin, DollarSign,
  ChevronRight, Heart, X, Check, SlidersHorizontal,
  Users, Briefcase, ArrowUpRight, MessageSquare,
  BarChart2, ChevronDown, ChevronUp, Zap, Shield,
  Grid, List, RefreshCw
} from 'lucide-react';

const ExpertDiscovery = () => {
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

  // ── STATE ──
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [shortlisted, setShortlisted] = useState([]);
  const [compareTray, setCompareTray] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [expandedFilter, setExpandedFilter] = useState('role');
  const [activeFilters, setActiveFilters] = useState({
    role: [],
    industry: [],
    availability: [],
    budget: '',
    location: [],
    experience: '',
  });

  // ── DATA ──
  const experts = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      title: 'Chief Marketing Officer',
      exRole: 'Ex-CMO at TechCorp & Razorpay',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      rating: 4.9,
      reviews: 23,
      match: 98,
      availability: '15 hrs/wk',
      availabilityType: 'Part-time',
      location: 'Remote',
      budget: '₹1.5L - ₹2.5L/mo',
      budgetNum: 200000,
      experience: '14 years',
      industries: ['SaaS', 'Fintech', 'E-commerce'],
      skills: ['Brand Strategy', 'Growth Marketing', 'B2B Marketing', 'Product Marketing', 'GTM'],
      roles: ['CMO', 'VP Marketing', 'Growth'],
      engagementTypes: ['Fractional', 'Advisory'],
      verified: true,
      topExpert: true,
      responseTime: '< 2 hours',
      bio: 'Former CMO at two unicorns with proven track record in B2B SaaS growth. Led marketing from 0 to $50M ARR.',
      completedEngagements: 12,
    },
    {
      id: 2,
      name: 'David Chen',
      title: 'Chief Financial Officer',
      exRole: 'Ex-CFO at Meesho & OYO',
      avatar: 'https://i.pravatar.cc/150?u=david',
      rating: 5.0,
      reviews: 18,
      match: 95,
      availability: 'Full-time',
      availabilityType: 'Full-time',
      location: 'Hybrid | Delhi',
      budget: '₹2.5L - ₹4L/mo',
      budgetNum: 350000,
      experience: '18 years',
      industries: ['E-commerce', 'Hospitality', 'BFSI'],
      skills: ['Fundraising', 'M&A', 'Financial Modeling', 'Investor Relations', 'IPO Readiness'],
      roles: ['CFO', 'Finance Head', 'VP Finance'],
      engagementTypes: ['Interim', 'Fractional'],
      verified: true,
      topExpert: true,
      responseTime: '< 4 hours',
      bio: 'Serial CFO with 3 successful fundraising rounds totaling $200M+. IPO experience with two companies.',
      completedEngagements: 8,
    },
    {
      id: 3,
      name: 'Priya Patel',
      title: 'Chief Technology Officer',
      exRole: 'Ex-VP Engineering at Flipkart',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      rating: 4.8,
      reviews: 31,
      match: 92,
      availability: '20 hrs/wk',
      availabilityType: 'Part-time',
      location: 'Remote',
      budget: '₹1.8L - ₹3L/mo',
      budgetNum: 250000,
      experience: '16 years',
      industries: ['E-commerce', 'SaaS', 'Logistics'],
      skills: ['Engineering Leadership', 'System Architecture', 'Team Scaling', 'Cloud', 'Platform'],
      roles: ['CTO', 'VP Engineering', 'Head of Tech'],
      engagementTypes: ['Fractional', 'Advisory', 'Interim'],
      verified: true,
      topExpert: false,
      responseTime: '< 6 hours',
      bio: 'Built and scaled engineering teams from 10 to 500+ engineers. Deep expertise in distributed systems and platform engineering.',
      completedEngagements: 15,
    },
    {
      id: 4,
      name: 'Marcus Johnson',
      title: 'Chief Operating Officer',
      exRole: 'Ex-COO at Delhivery & BigBasket',
      avatar: 'https://i.pravatar.cc/150?u=marcus',
      rating: 4.9,
      reviews: 14,
      match: 89,
      availability: '10 hrs/wk',
      availabilityType: 'Advisory',
      location: 'Remote',
      budget: '₹80K - ₹1.5L/mo',
      budgetNum: 120000,
      experience: '20 years',
      industries: ['Logistics', 'FMCG', 'Manufacturing'],
      skills: ['Operations', 'Supply Chain', 'Process Optimization', 'OKRs', 'P&L Management'],
      roles: ['COO', 'Operations Head', 'GM Operations'],
      engagementTypes: ['Advisory', 'Fractional'],
      verified: true,
      topExpert: false,
      responseTime: '< 24 hours',
      bio: 'Operations veteran who has managed $1B+ supply chains. Expert in rapid scaling and operational turnarounds.',
      completedEngagements: 6,
    },
    {
      id: 5,
      name: 'Ananya Krishnan',
      title: 'Chief Product Officer',
      exRole: 'Ex-CPO at Swiggy & Myntra',
      avatar: 'https://i.pravatar.cc/150?u=ananya',
      rating: 4.7,
      reviews: 27,
      match: 85,
      availability: '15 hrs/wk',
      availabilityType: 'Part-time',
      location: 'Hybrid | Bangalore',
      budget: '₹1.2L - ₹2L/mo',
      budgetNum: 160000,
      experience: '12 years',
      industries: ['Consumer Tech', 'E-commerce', 'EdTech'],
      skills: ['Product Strategy', 'Agile', 'UX Design', 'Product Analytics', 'Roadmapping'],
      roles: ['CPO', 'VP Product', 'Head of Product'],
      engagementTypes: ['Fractional', 'Advisory'],
      verified: true,
      topExpert: false,
      responseTime: '< 8 hours',
      bio: 'Product leader who shipped 50+ products used by millions. Passionate about data-driven product development.',
      completedEngagements: 9,
    },
    {
      id: 6,
      name: 'Rahul Sharma',
      title: 'Chief Revenue Officer',
      exRole: 'Ex-CRO at Freshworks & Chargebee',
      avatar: 'https://i.pravatar.cc/150?u=rahul',
      rating: 4.9,
      reviews: 19,
      match: 82,
      availability: '20 hrs/wk',
      availabilityType: 'Part-time',
      location: 'Remote',
      budget: '₹1.5L - ₹2.8L/mo',
      budgetNum: 220000,
      experience: '15 years',
      industries: ['SaaS', 'B2B Tech', 'Professional Services'],
      skills: ['Enterprise Sales', 'Revenue Strategy', 'CRM', 'Partnership Development', 'Sales Ops'],
      roles: ['CRO', 'VP Sales', 'Sales Head'],
      engagementTypes: ['Fractional', 'Interim'],
      verified: true,
      topExpert: true,
      responseTime: '< 3 hours',
      bio: 'Revenue leader who built $0 to $100M ARR sales engines. Expert in enterprise SaaS sales and channel partnerships.',
      completedEngagements: 11,
    },
  ];

  const requirements = [
    { id: 1, title: 'Interim CFO' },
    { id: 2, title: 'Fractional CMO' },
    { id: 3, title: 'VP Engineering' },
    { id: 4, title: 'Advisory Board Member — Sales' },
  ];

  const filterSections = [
    {
      id: 'role',
      label: 'Role Type',
      icon: Briefcase,
      options: ['CMO', 'CFO', 'CTO', 'COO', 'CPO', 'CRO', 'VP Marketing', 'VP Engineering', 'VP Sales', 'Head of Product']
    },
    {
      id: 'industry',
      label: 'Industry',
      icon: BarChart2,
      options: ['SaaS', 'Fintech', 'E-commerce', 'BFSI', 'Logistics', 'Healthcare', 'EdTech', 'Consumer Tech', 'Manufacturing']
    },
    {
      id: 'availability',
      label: 'Availability',
      icon: Clock,
      options: ['Full-time', 'Part-time', 'Advisory']
    },
    {
      id: 'location',
      label: 'Location',
      icon: MapPin,
      options: ['Remote', 'Hybrid', 'In Office']
    },
  ];

  const experienceOptions = ['Any', '5+ years', '10+ years', '15+ years', '20+ years'];
  const budgetOptions = ['Any', 'Under ₹1L/mo', '₹1L - ₹2L/mo', '₹2L - ₹3L/mo', '₹3L+/mo'];

  // ── HELPERS ──
  const toggleFilter = (section, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter(v => v !== value)
        : [...prev[section], value]
    }));
  };

  const toggleShortlist = (id) => {
    setShortlisted(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id) => {
    if (compareTray.includes(id)) {
      setCompareTray(prev => prev.filter(i => i !== id));
    } else if (compareTray.length < 3) {
      setCompareTray(prev => [...prev, id]);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({ role: [], industry: [], availability: [], budget: '', location: [], experience: '' });
    setSearchQuery('');
  };

  const totalActiveFilters =
    activeFilters.role.length +
    activeFilters.industry.length +
    activeFilters.availability.length +
    activeFilters.location.length +
    (activeFilters.budget ? 1 : 0) +
    (activeFilters.experience ? 1 : 0);

  const filteredExperts = experts.filter(expert => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!expert.name.toLowerCase().includes(q) &&
        !expert.title.toLowerCase().includes(q) &&
        !expert.skills.some(s => s.toLowerCase().includes(q)) &&
        !expert.industries.some(i => i.toLowerCase().includes(q))) {
        return false;
      }
    }
    if (activeFilters.availability.length > 0 &&
      !activeFilters.availability.includes(expert.availabilityType)) return false;
    if (activeFilters.location.length > 0) {
      const locMatch = activeFilters.location.some(l => expert.location.includes(l));
      if (!locMatch) return false;
    }
    if (activeFilters.industry.length > 0) {
      const indMatch = activeFilters.industry.some(i => expert.industries.includes(i));
      if (!indMatch) return false;
    }
    return true;
  });

  const getCompareExperts = () => compareTray.map(id => experts.find(e => e.id === id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 py-8 pb-32">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
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
              <span className="text-sm font-bold text-gray-700">Expert Discovery</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Find Experts
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {filteredExperts.length} vetted senior professionals available
            </p>
          </div>

          {/* View Toggle + Filter Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {[
                { id: 'grid', icon: Grid },
                { id: 'list', icon: List },
              ].map(({ id, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(id)}
                  className={`p-2 rounded-lg transition-all ${viewMode === id ? 'bg-[#134e40] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Icon size={16} />
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${showFilters ? 'bg-[#134e40] text-white border-[#134e40]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0eb59a]/40'}`}
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

        {/* ── SEARCH BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative mb-6 group"
        >
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors" />
          <input
            type="text"
            placeholder="Search by name, skill, role, or industry..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-13 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          )}
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

                  {/* Filter Header */}
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

                  {/* Filter Sections */}
                  <div className="space-y-4">
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
                            : <ChevronDown size={14} className="text-gray-400" />}
                        </button>

                        <AnimatePresence>
                          {expandedFilter === section.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden space-y-2"
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

                    {/* Experience */}
                    <div className="border-b border-gray-50 pb-4">
                      <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Zap size={13} className="text-[#0eb59a]" /> Experience
                      </p>
                      <div className="space-y-2">
                        {experienceOptions.map(exp => (
                          <motion.button
                            key={exp}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveFilters(prev => ({ ...prev, experience: exp === 'Any' ? '' : exp }))}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              (exp === 'Any' && !activeFilters.experience) || activeFilters.experience === exp
                                ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {exp}
                            {((exp === 'Any' && !activeFilters.experience) || activeFilters.experience === exp) && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 bg-[#0eb59a] rounded-full flex items-center justify-center">
                                <Check size={9} className="text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <DollarSign size={13} className="text-[#0eb59a]" /> Budget Range
                      </p>
                      <div className="space-y-2">
                        {budgetOptions.map(bud => (
                          <motion.button
                            key={bud}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveFilters(prev => ({ ...prev, budget: bud === 'Any' ? '' : bud }))}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                              (bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud
                                ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {bud}
                            {((bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud) && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 bg-[#0eb59a] rounded-full flex items-center justify-center">
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

          {/* ── EXPERT GRID ── */}
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
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-[#134e40] text-xs font-bold rounded-xl border border-teal-100"
                    >
                      {item}
                      <button onClick={() => {
                        if (Array.isArray(activeFilters[key])) {
                          toggleFilter(key, item);
                        } else {
                          setActiveFilters(prev => ({ ...prev, [key]: '' }));
                        }
                      }}>
                        <X size={11} />
                      </button>
                    </motion.span>
                  ));
                })}
              </motion.div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-500">
                Showing <span className="text-gray-900 font-black">{filteredExperts.length}</span> experts
              </p>
              <select className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20">
                <option>Best Match</option>
                <option>Highest Rated</option>
                <option>Most Reviews</option>
                <option>Budget: Low to High</option>
              </select>
            </div>

            {/* Grid / List view */}
            <AnimatePresence mode="popLayout">
              {filteredExperts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users size={24} className="text-gray-300" />
                  </div>
                  <h3 className="font-black text-gray-700 text-lg mb-2">No experts found</h3>
                  <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search query</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-[#134e40] text-white text-sm font-bold rounded-xl"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
                }>
                  {filteredExperts.map((expert, idx) => (
                    <motion.div
                      key={expert.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ y: viewMode === 'grid' ? -6 : -2, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                      className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group transition-all duration-300 ${viewMode === 'list' ? 'flex gap-0' : ''}`}
                    >
                      {viewMode === 'grid' ? (
                        // ── GRID CARD ──
                        <div className="p-5">
                          {/* Top badges */}
                          <div className="flex items-center gap-2 mb-4">
                            {expert.topExpert && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                                <Star size={9} fill="currentColor" /> Top Expert
                              </span>
                            )}
                            {expert.verified && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                <Shield size={9} /> Verified
                              </span>
                            )}
                            <span className="ml-auto text-[10px] font-black text-[#134e40] bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
                              {expert.match}% Match
                            </span>
                          </div>

                          {/* Avatar + Name */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="relative shrink-0">
                              <motion.img
                                whileHover={{ scale: 1.08 }}
                                src={expert.avatar}
                                alt={expert.name}
                                className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3
                                onClick={() => navigate(`/experts/${expert.id}`)}
                                className="font-black text-gray-900 text-sm group-hover:text-[#0eb59a] transition-colors cursor-pointer leading-tight truncate"
                              >
                                {expert.name}
                              </h3>
                              <p className="text-xs font-bold text-gray-600 mt-0.5">{expert.title}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{expert.exRole}</p>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                            {expert.bio}
                          </p>

                          {/* Meta */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {[
                              { icon: Clock, label: expert.availability, color: 'text-blue-400' },
                              { icon: MapPin, label: expert.location.split(' | ')[0], color: 'text-rose-400' },
                              { icon: DollarSign, label: expert.budget, color: 'text-[#0eb59a]' },
                              { icon: Zap, label: expert.experience, color: 'text-purple-400' },
                            ].map((meta, mIdx) => (
                              <div key={mIdx} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                                <meta.icon size={11} className={meta.color} />
                                <span className="truncate">{meta.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {expert.skills.slice(0, 3).map(skill => (
                              <span key={skill} className="text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded-lg">
                                {skill}
                              </span>
                            ))}
                            {expert.skills.length > 3 && (
                              <span className="text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2 py-1 rounded-lg">
                                +{expert.skills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Rating + Response */}
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-1.5">
                              <Star size={13} fill="#F59E0B" className="text-amber-400" />
                              <span className="font-black text-gray-900 text-sm">{expert.rating}</span>
                              <span className="text-xs text-gray-400">({expert.reviews})</span>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-400">
                              Responds {expert.responseTime}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => navigate(`/experts/${expert.id}`)}
                              className="flex-1 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all shadow-sm"
                            >
                              View Profile
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowInviteModal(expert)}
                              className="px-3 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#134e40] text-xs font-black rounded-xl transition-all border border-teal-100"
                            >
                              Invite
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleShortlist(expert.id)}
                              className={`p-2.5 rounded-xl transition-all border ${
                                shortlisted.includes(expert.id)
                                  ? 'bg-red-50 text-red-500 border-red-100'
                                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-red-50 hover:text-red-400'
                              }`}
                            >
                              <Heart size={14} fill={shortlisted.includes(expert.id) ? 'currentColor' : 'none'} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleCompare(expert.id)}
                              className={`p-2.5 rounded-xl transition-all border text-xs font-black ${
                                compareTray.includes(expert.id)
                                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                                  : compareTray.length >= 3
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-blue-50 hover:text-blue-500'
                              }`}
                            >
                              <BarChart2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        // ── LIST CARD ──
                        <div className="flex items-center gap-5 p-5 w-full">
                          <div className="relative shrink-0">
                            <img src={expert.avatar} alt={expert.name} className="w-14 h-14 rounded-2xl object-cover" />
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                onClick={() => navigate(`/experts/${expert.id}`)}
                                className="font-black text-gray-900 text-sm group-hover:text-[#0eb59a] transition-colors cursor-pointer"
                              >
                                {expert.name}
                              </h3>
                              {expert.topExpert && <Star size={12} fill="#F59E0B" className="text-amber-400" />}
                              {expert.verified && <Shield size={12} className="text-blue-500" />}
                              <span className="ml-auto text-[10px] font-black text-[#134e40] bg-teal-50 px-2 py-0.5 rounded-lg">
                                {expert.match}% Match
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold mb-2">{expert.exRole}</p>
                            <div className="flex items-center gap-4 text-[11px] text-gray-400 font-semibold">
                              <span className="flex items-center gap-1"><Clock size={10} />{expert.availability}</span>
                              <span className="flex items-center gap-1"><MapPin size={10} />{expert.location.split(' | ')[0]}</span>
                              <span className="flex items-center gap-1 text-[#0eb59a] font-bold"><DollarSign size={10} />{expert.budget}</span>
                              <span className="flex items-center gap-1"><Star size={10} fill="#F59E0B" className="text-amber-400" />{expert.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                              onClick={() => navigate(`/experts/${expert.id}`)}
                              className="px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all"
                            >
                              View Profile
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => setShowInviteModal(expert)}
                              className="px-3 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100"
                            >
                              Invite
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => toggleShortlist(expert.id)}
                              className={`p-2 rounded-xl border transition-all ${shortlisted.includes(expert.id) ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                            >
                              <Heart size={14} fill={shortlisted.includes(expert.id) ? 'currentColor' : 'none'} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => toggleCompare(expert.id)}
                              className={`p-2 rounded-xl border transition-all ${compareTray.includes(expert.id) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                            >
                              <BarChart2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── COMPARE TRAY ── */}
      <AnimatePresence>
        {compareTray.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl px-6 py-4"
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-black text-gray-900">
                  Compare Experts
                  <span className="ml-2 text-[#0eb59a]">({compareTray.length}/3)</span>
                </p>
                <div className="flex gap-3">
                  {compareTray.map(id => {
                    const expert = experts.find(e => e.id === id);
                    return (
                      <motion.div
                        key={id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-3 py-2 rounded-xl"
                      >
                        <img src={expert?.avatar} className="w-6 h-6 rounded-lg object-cover" />
                        <span className="text-xs font-bold text-[#134e40]">{expert?.name}</span>
                        <button onClick={() => toggleCompare(id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <X size={12} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCompareTray([])}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl"
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCompareModal(true)}
                  disabled={compareTray.length < 2}
                  className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                    compareTray.length >= 2
                      ? 'bg-[#134e40] text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Compare Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COMPARE MODAL ── */}
      <AnimatePresence>
        {showCompareModal && (
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-lg">Expert Comparison</h3>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowCompareModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-auto flex-1 p-6">
                <div className={`grid gap-4 ${getCompareExperts().length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {getCompareExperts().map((expert) => (
                    <div key={expert.id} className="space-y-4">
                      {/* Header */}
                      <div className="text-center p-4 bg-teal-50 rounded-2xl border border-teal-100">
                        <img src={expert.avatar} className="w-14 h-14 rounded-2xl object-cover mx-auto mb-3 shadow-sm" />
                        <h4 className="font-black text-gray-900 text-sm">{expert.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{expert.title}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Star size={12} fill="#F59E0B" className="text-amber-400" />
                          <span className="font-black text-gray-900 text-sm">{expert.rating}</span>
                        </div>
                        <div className="mt-2 text-[10px] font-black text-[#134e40] bg-white px-3 py-1 rounded-full inline-block border border-teal-100">
                          {expert.match}% Match
                        </div>
                      </div>

                      {/* Comparison rows */}
                      {[
                        { label: 'Experience', value: expert.experience },
                        { label: 'Availability', value: expert.availability },
                        { label: 'Budget', value: expert.budget },
                        { label: 'Location', value: expert.location },
                        { label: 'Response Time', value: expert.responseTime },
                        { label: 'Engagements', value: `${expert.completedEngagements} completed` },
                      ].map((row) => (
                        <div key={row.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{row.label}</p>
                          <p className="text-sm font-bold text-gray-800">{row.value}</p>
                        </div>
                      ))}

                      {/* Skills */}
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Top Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {expert.skills.slice(0, 4).map(s => (
                            <span key={s} className="text-[10px] font-bold bg-white text-gray-600 border border-gray-200 px-2 py-1 rounded-lg">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setShowCompareModal(false); navigate(`/experts/${expert.id}`); }}
                        className="w-full py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-black rounded-2xl transition-all shadow-md"
                      >
                        View Full Profile
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INVITE MODAL ── */}
      <AnimatePresence>
        {showInviteModal && (
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
              {/* Expert mini-card */}
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100 mb-6">
                <img src={showInviteModal.avatar} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-black text-gray-900 text-sm">{showInviteModal.name}</h4>
                  <p className="text-xs text-gray-500">{showInviteModal.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} fill="#F59E0B" className="text-amber-400" />
                    <span className="text-xs font-black text-gray-800">{showInviteModal.rating}</span>
                  </div>
                </div>
                <span className="ml-auto text-xs font-black text-[#134e40] bg-white px-2.5 py-1 rounded-xl border border-teal-100">
                  {showInviteModal.match}% Match
                </span>
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-1">
                Invite {showInviteModal.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                Select which requirement you'd like to invite this expert for.
              </p>

              {/* Requirement selector */}
              <div className="space-y-2 mb-6">
                {requirements.map((req) => (
                  <motion.button
                    key={req.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRequirement(req.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
                      selectedRequirement === req.id
                        ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase size={14} />
                      {req.title}
                    </span>
                    {selectedRequirement === req.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-5 h-5 bg-[#0eb59a] rounded-full flex items-center justify-center"
                      >
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                  Personal Message <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  placeholder={`Hi ${showInviteModal.name.split(' ')[0]}, we'd love to discuss an opportunity with you...`}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowInviteModal(null); setSelectedRequirement(''); }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: selectedRequirement ? 1.02 : 1, boxShadow: selectedRequirement ? '0 8px 30px rgba(20,78,64,0.25)' : 'none' }}
                  whileTap={{ scale: selectedRequirement ? 0.98 : 1 }}
                  disabled={!selectedRequirement}
                  onClick={() => { setShowInviteModal(null); setSelectedRequirement(''); }}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                    selectedRequirement
                      ? 'bg-[#134e40] hover:bg-[#0eb59a] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Send Invite
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertDiscovery;
