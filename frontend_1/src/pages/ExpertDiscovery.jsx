import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, Clock, MapPin, DollarSign,
  ChevronRight, Heart, X, Check, SlidersHorizontal,
  Users, Briefcase, ArrowUpRight, MessageSquare,
  BarChart2, ChevronDown, ChevronUp, Zap, Shield,
  Grid, List, RefreshCw, Calendar, Award, TrendingUp,
  CheckCircle, LayoutDashboard, CreditCard, FileText,
  LogOut, Settings, ShieldCheck, Bell, ChevronLeft,
  UserPlus, UserCheck, Send, Eye
} from 'lucide-react';


const ExpertDiscovery = () => {
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState(null);

  // Authentication Guard
  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    const checkAuth = async () => {
      if (isDemo) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isDemo) {
        navigate('/signin?role=company');
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  // Fetch experts from backend
  useEffect(() => {
    const fetchExperts = async () => {
      const isDemo = localStorage.getItem('demo_company') === 'true';
      if (isDemo) {
        setExperts(MOCK_EXPERTS);
        setCompanyProfile({ company_name: 'Acme Corp.' });
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/company/experts`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setExperts(data);
          } else {
            setExperts(MOCK_EXPERTS);
          }
        } else {
          console.error("Failed to fetch experts");
          setExperts(MOCK_EXPERTS);
        }

        // Fetch company profile
        const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCompanyProfile(profileData);
        }
      } catch (err) {
        console.error("Error fetching experts:", err);
        setExperts(MOCK_EXPERTS);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  // ── STATE ──
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [shortlisted, setShortlisted] = useState([]);
  const [following, setFollowing] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cxo_following') || '[]');
    } catch { return []; }
  });
  const [followBurst, setFollowBurst] = useState(null);
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

  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const cardRefs = useRef({});

  const getPanelSide = (expertId) => {
    const cardEl = cardRefs.current[expertId];
    if (!cardEl) return 'right';
    const rect = cardEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;
    return spaceRight >= spaceLeft ? 'right' : 'left';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts', active: true },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];

  // ── DATA ──
  const MOCK_EXPERTS = [
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

  const toggleFollow = (id) => {
    setFollowing(prev => {
      const isFollowing = prev.includes(id);
      const updated = isFollowing ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('cxo_following', JSON.stringify(updated));
      if (!isFollowing) {
        setFollowBurst(id);
        setTimeout(() => setFollowBurst(null), 600);
      }
      return updated;
    });
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

  const RadialRing = ({ percent, color, size = 56, stroke = 5, label }) => {
    const radius = (size - stroke * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="#E3E8E4"
              strokeWidth={stroke}
            />
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-[#1C3627]">{percent}%</span>
          </div>
        </div>
        <span className="text-[9px] font-semibold text-gray-400 text-center leading-tight max-w-[56px]">{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0d1a14]">

      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white dark:bg-[#0a1810] border-r border-gray-100 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 dark:border-white/10 justify-between">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer shrink-0" onClick={() => navigate('/company-dashboard')}>
            <Logo variant="light" className="h-8 shrink-0" />
            <motion.span
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap text-sm font-black text-[#134e40] dark:text-[#0eb59a] tracking-tight"
            >
              ExigentCX
            </motion.span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-gray-100 transition-all shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = item.active || window.location.pathname === item.path || (item.path === '/experts' && window.location.pathname.startsWith('/experts'));
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
                  />
                )}
                <item.icon size={17} className="shrink-0" />
                <motion.span
                  animate={{ 
                    opacity: isSidebarOpen ? 1 : 0, 
                    width: isSidebarOpen ? 'auto' : 0 
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Separated Settings option pinned to the bottom */}
        <div className="p-3 border-t border-gray-50 dark:border-white/10 space-y-1">
          {/* Theme Toggle */}
          <div className={`flex items-center gap-3 px-3 py-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && (
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Theme</span>
            )}
            <ThemeToggle />
          </div>

          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
              window.location.pathname === '/settings'
                ? 'bg-[#134e40] text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
            }`}
          >
            {window.location.pathname === '/settings' && (
              <motion.div
                layoutId="activeNav"
                className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
              />
            )}
            <Settings size={17} className="shrink-0" />
            <motion.span
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
            >
              Settings
            </motion.span>
          </motion.button>

          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              const isDemo = localStorage.getItem('demo_company') === 'true';
              if (isDemo) {
                localStorage.removeItem('demo_company');
              } else {
                await supabase.auth.signOut();
              }
              navigate('/signin?role=company');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 font-bold"
          >
            <LogOut size={17} className="shrink-0" />
            <motion.span
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
            >
              Sign Out
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex flex-col min-h-screen overflow-x-hidden"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#0a1810] border-b border-gray-100 dark:border-white/10 px-6 py-3 flex items-center gap-4 shadow-sm">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skill, role, or industry..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#0eb59a] focus:ring-2 focus:ring-[#0eb59a]/15 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <button className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] transition-all">
                <Bell size={17} />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">3</span>
            </div>
            <button className="w-9 h-9 bg-[#134e40] rounded-xl flex items-center justify-center text-white text-xs font-black hover:ring-2 hover:ring-[#0eb59a] hover:ring-offset-2 transition-all overflow-hidden">
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </button>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="flex-1">
          <div className="px-8 pt-7 pb-32">

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">

              {/* Left — Title + live stats */}
              <div>
                <h1 className="text-[28px] font-black text-[#1C3627] tracking-tight leading-none mb-3">
                  Find Experts
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Live expert count */}
                  <div className="flex items-center gap-1.5 bg-[#134e40] px-3 py-1.5 rounded-xl">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#0eb59a]"
                    />
                    <span className="text-white text-xs font-bold">
                      {filteredExperts.length} Verified Experts
                    </span>
                  </div>
                  {/* Shortlisted count — only if any */}
                  {shortlisted.length > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl"
                    >
                      <Heart size={11} className="text-rose-500" fill="currentColor" />
                      <span className="text-rose-600 text-xs font-bold">
                        {shortlisted.length} Shortlisted
                      </span>
                    </motion.div>
                  )}
                  {following.length > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl"
                    >
                      <UserCheck size={11} className="text-[#0eb59a]" />
                      <span className="text-[#134e40] text-xs font-bold">
                        {following.length} Following
                      </span>
                    </motion.div>
                  )}
                  {/* Compare count — only if any */}
                  {compareTray.length > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl"
                    >
                      <BarChart2 size={11} className="text-blue-500" />
                      <span className="text-blue-600 text-xs font-bold">
                        {compareTray.length} Comparing
                      </span>
                    </motion.div>
                  )}
                  {/* Active filters count */}
                  {totalActiveFilters > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl"
                    >
                      <SlidersHorizontal size={11} className="text-amber-500" />
                      <span className="text-amber-600 text-xs font-bold">
                        {totalActiveFilters} Filter{totalActiveFilters > 1 ? 's' : ''} Active
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right — Filters toggle button */}
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
                  <span className="bg-[#0eb59a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {totalActiveFilters}
                  </span>
                )}
              </motion.button>

            </div>

            {/* Active filter chips */}
            {totalActiveFilters > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-5"
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

            {/* ── THREE COLUMN LAYOUT ── */}
            <div className="flex gap-5">

              {/* ── LEFT FILTER PANEL ── */}
              <AnimatePresence>
                {showFilters && (
                  <motion.aside
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 240 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="shrink-0 overflow-hidden"
                  >
                    <div className="w-[240px] bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">

                      {/* Filter Header */}
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2">
                          <Filter size={13} className="text-[#0eb59a]" /> Filters
                        </h3>
                        {totalActiveFilters > 0 && (
                          <button
                            onClick={clearAllFilters}
                            className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1"
                          >
                            <RefreshCw size={10} /> Clear
                          </button>
                        )}
                      </div>

                      {/* Filter sections */}
                      <div className="space-y-4">
                        {filterSections.map(section => (
                          <div key={section.id} className="border-b border-gray-50 pb-4">
                            <button
                              onClick={() => setExpandedFilter(expandedFilter === section.id ? null : section.id)}
                              className="w-full flex items-center justify-between mb-2"
                            >
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                                <section.icon size={11} className="text-[#0eb59a]" />
                                {section.label}
                                {activeFilters[section.id]?.length > 0 && (
                                  <span className="bg-[#0eb59a] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                                    {activeFilters[section.id].length}
                                  </span>
                                )}
                              </span>
                              {expandedFilter === section.id
                                ? <ChevronUp size={12} className="text-gray-400" />
                                : <ChevronDown size={12} className="text-gray-400" />
                              }
                            </button>
                            <AnimatePresence>
                              {expandedFilter === section.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden space-y-1"
                                >
                                  {section.options.map(option => {
                                    const isActive = activeFilters[section.id]?.includes(option);
                                    return (
                                      <motion.button
                                        key={option}
                                        whileHover={{ x: 2 }}
                                        onClick={() => toggleFilter(section.id, option)}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                          isActive
                                            ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                      >
                                        {option}
                                        {isActive && (
                                          <div className="w-3.5 h-3.5 bg-[#0eb59a] rounded-full flex items-center justify-center">
                                            <Check size={8} className="text-white" strokeWidth={3} />
                                          </div>
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
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Zap size={11} className="text-[#0eb59a]" /> Experience
                          </p>
                          <div className="space-y-1">
                            {experienceOptions.map(exp => (
                              <motion.button
                                key={exp}
                                whileHover={{ x: 2 }}
                                onClick={() => setActiveFilters(prev => ({ ...prev, experience: exp === 'Any' ? '' : exp }))}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  (exp === 'Any' && !activeFilters.experience) || activeFilters.experience === exp
                                    ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {exp}
                                {((exp === 'Any' && !activeFilters.experience) || activeFilters.experience === exp) && (
                                  <div className="w-3.5 h-3.5 bg-[#0eb59a] rounded-full flex items-center justify-center">
                                    <Check size={8} className="text-white" strokeWidth={3} />
                                  </div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Budget */}
                        <div>
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <DollarSign size={11} className="text-[#0eb59a]" /> Budget Range
                          </p>
                          <div className="space-y-1">
                            {budgetOptions.map(bud => (
                              <motion.button
                                key={bud}
                                whileHover={{ x: 2 }}
                                onClick={() => setActiveFilters(prev => ({ ...prev, budget: bud === 'Any' ? '' : bud }))}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  (bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud
                                    ? 'bg-teal-50 text-[#134e40] border border-teal-100'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {bud}
                                {((bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud) && (
                                  <div className="w-3.5 h-3.5 bg-[#0eb59a] rounded-full flex items-center justify-center">
                                    <Check size={8} className="text-white" strokeWidth={3} />
                                  </div>
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

              {/* ── CENTER EXPERT GRID — 2 columns ── */}
              <div className="flex-1 min-w-0">

                {/* Results bar */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-500">
                    Showing <span className="text-[#1C3627] font-black">{filteredExperts.length}</span> experts
                  </p>
                  <select className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20">
                    <option>Best Match</option>
                    <option>Highest Rated</option>
                    <option>Most Reviews</option>
                    <option>Budget: Low to High</option>
                  </select>
                </div>

                {/* Grid */}
                {loading ? (
                  <div className="flex items-center justify-center p-20 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw size={28} className="text-[#0eb59a] animate-spin" />
                      <p className="text-sm font-bold text-gray-500">Loading verified experts...</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredExperts.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
                      >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Users size={20} className="text-gray-300" />
                        </div>
                        <h3 className="font-black text-[#1C3627] mb-1">No experts found</h3>
                        <p className="text-gray-400 text-sm mb-5">Try adjusting your filters</p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          onClick={clearAllFilters}
                          className="px-5 py-2.5 bg-[#134e40] text-white text-sm font-bold rounded-xl"
                        >
                          Clear Filters
                        </motion.button>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {filteredExperts.map((expert, idx) => {
                          const isHovered = hoveredCardId === expert.id;
                          const panelSide = getPanelSide(expert.id);

                          return (
                            <motion.div
                              key={expert.id}
                              ref={el => cardRefs.current[expert.id] = el}
                              layout
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.28, delay: idx * 0.05 }}
                              onMouseEnter={() => setHoveredCardId(expert.id)}
                              onMouseLeave={() => setHoveredCardId(null)}
                              className="relative group z-10 hover:z-[90]"
                            >
                              {/* ── BASE CARD ── */}
                              <motion.div
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden relative cursor-pointer
                                  ${isHovered
                                    ? 'border-[#0eb59a]/40 shadow-[0_12px_40px_rgba(14,181,154,0.12)]'
                                    : 'border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-gray-200'
                                  }
                                `}
                              >

                                <div className="p-5 relative z-10">

                                  {/* Top badges row */}
                                  <div className="flex items-center gap-1.5 mb-4">
                                    {expert.topExpert && (
                                      <span className="flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                        <Star size={8} fill="currentColor" /> Top Expert
                                      </span>
                                    )}
                                    {expert.verified && (
                                      <span className="flex items-center gap-1 text-[9px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                        <Shield size={8} /> Verified
                                      </span>
                                    )}
                                    <div className="ml-auto flex items-center gap-1.5 bg-[#134e40] px-2.5 py-1 rounded-lg">
                                      <span className="text-[10px] font-black text-white">{expert.match}% Match</span>
                                    </div>
                                  </div>

                                  {/* Avatar + Name — asymmetric image border */}
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="relative shrink-0">
                                      <motion.img
                                        src={expert.avatar}
                                        alt={expert.name}
                                        className="w-14 h-14 object-cover shadow-sm"
                                        style={{ borderRadius: '12px 0px 12px 12px' }}
                                      />
                                      <motion.div
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3
                                        onClick={() => navigate(`/experts/${expert.id}`)}
                                        className="font-black text-[#1C3627] text-sm leading-tight mb-0.5 transition-colors cursor-pointer hover:text-[#0eb59a] text-left"
                                      >
                                        {expert.name}
                                      </h3>
                                      <p className="text-xs font-bold text-gray-600 text-left">{expert.title}</p>
                                      <p className="text-[11px] text-gray-400 mt-0.5 truncate text-left">{expert.exRole}</p>
                                    </div>
                                  </div>

                                  {/* Bio */}
                                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2 text-left">
                                    {expert.bio}
                                  </p>

                                  {/* Meta grid */}
                                  <div className="grid grid-cols-2 gap-2 mb-4">
                                    {[
                                      { icon: Clock, label: expert.availability, color: 'text-blue-400' },
                                      { icon: MapPin, label: expert.location.split(' | ')[0], color: 'text-rose-400' },
                                      { icon: DollarSign, label: expert.budget, color: 'text-[#0eb59a]' },
                                      { icon: Zap, label: expert.experience, color: 'text-purple-400' },
                                    ].map((m, mi) => (
                                      <div key={mi} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                                        <m.icon size={11} className={`${m.color} shrink-0`} />
                                        <span className="truncate">{m.label}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Skills */}
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {expert.skills.slice(0, 3).map(skill => (
                                      <span key={skill} className="text-[10px] font-semibold bg-[#FAFBF9] text-[#1C3627] border border-gray-200 px-2 py-0.5 rounded-md">
                                        {skill}
                                      </span>
                                    ))}
                                    {expert.skills.length > 3 && (
                                      <span className="text-[10px] font-semibold bg-[#FAFBF9] text-gray-400 border border-gray-200 px-2 py-0.5 rounded-md">
                                        +{expert.skills.length - 3}
                                      </span>
                                    )}
                                  </div>

                                  {/* Rating + response */}
                                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-50">
                                    <div className="flex items-center gap-1">
                                      <Star size={12} fill="#F59E0B" className="text-amber-400" />
                                      <span className="font-black text-[#1C3627] text-sm">{expert.rating}</span>
                                      <span className="text-xs text-gray-400">({expert.reviews})</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400">
                                      Responds {expert.responseTime}
                                    </span>
                                  </div>

                                  {/* Action bar — 2 rows */}
                                  <div className="flex flex-col gap-2">

                                    {/* Row 1 — Primary actions */}
                                    <div className="flex items-center gap-2">
                                      {/* View Profile */}
                                      <motion.button
                                        whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(19,78,64,0.3)' }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/experts/${expert.id}`); }}
                                        className="flex-1 py-2.5 bg-[#134e40] hover:bg-[#0d3f33] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
                                      >
                                        <Eye size={12} />
                                        View Profile
                                      </motion.button>

                                      {/* Follow Button */}
                                      <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFollow(expert.id);
                                        }}
                                        animate={followBurst === expert.id ? {
                                          scale: [1, 1.3, 0.9, 1.1, 1],
                                        } : { scale: 1 }}
                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                        className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 relative overflow-hidden ${
                                          following.includes(expert.id)
                                            ? 'bg-[#0eb59a] text-white border-[#0eb59a] shadow-md shadow-[#0eb59a]/20'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-teal-50 hover:text-[#134e40] hover:border-teal-300'
                                        }`}
                                      >
                                        {/* Shimmer effect when following */}
                                        {following.includes(expert.id) && (
                                          <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '250%' }}
                                            transition={{ duration: 0.7, ease: 'easeOut' }}
                                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                                          />
                                        )}
                                        <motion.div
                                          animate={{ rotate: following.includes(expert.id) ? 360 : 0 }}
                                          transition={{ duration: 0.4 }}
                                        >
                                          {following.includes(expert.id)
                                            ? <UserCheck size={12} />
                                            : <UserPlus size={12} />
                                          }
                                        </motion.div>
                                        <span>{following.includes(expert.id) ? 'Following' : 'Follow'}</span>
                                      </motion.button>
                                    </div>

                                    {/* Row 2 — Secondary actions */}
                                    <div className="flex items-center gap-2">
                                      {/* Invite */}
                                      <motion.button
                                        whileHover={{ scale: 1.03, backgroundColor: '#ccfbf1' }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={(e) => { e.stopPropagation(); setShowInviteModal(expert); }}
                                        className="flex-1 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100 transition-all flex items-center justify-center gap-1.5"
                                      >
                                        <Send size={11} />
                                        Invite
                                      </motion.button>

                                      {/* Shortlist/Heart */}
                                      <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); toggleShortlist(expert.id); }}
                                        className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                                          shortlisted.includes(expert.id)
                                            ? 'bg-rose-50 text-rose-500 border-rose-200'
                                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-rose-50 hover:text-rose-400 hover:border-rose-200'
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ scale: shortlisted.includes(expert.id) ? [1, 1.4, 1] : 1 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <Heart size={12} fill={shortlisted.includes(expert.id) ? 'currentColor' : 'none'} />
                                        </motion.div>
                                        {shortlisted.includes(expert.id) ? 'Saved' : 'Save'}
                                      </motion.button>

                                      {/* Compare */}
                                      <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); toggleCompare(expert.id); }}
                                        className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                                          compareTray.includes(expert.id)
                                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                                            : compareTray.length >= 3
                                            ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed'
                                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200'
                                        }`}
                                      >
                                        <BarChart2 size={12} />
                                        Compare
                                      </motion.button>
                                    </div>

                                  </div>

                                </div>
                              </motion.div>

                              {/* ── FLOATING HOVER OVERLAY PANEL ── */}
                              <AnimatePresence>
                                {isHovered && !showInviteModal && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.92, x: panelSide === 'right' ? -10 : 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, x: panelSide === 'right' ? -10 : 10 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                    className="absolute top-0 z-[100] w-[280px] bg-[#FAFBF9] rounded-2xl border border-gray-100 shadow-2xl shadow-[#134e40]/10 p-5 pointer-events-none"
                                    style={{
                                      [panelSide === 'right' ? 'left' : 'right']: 'calc(100% + 12px)',
                                    }}
                                  >

                                    {/* Panel header */}
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                      <img
                                        src={expert.avatar}
                                        alt={expert.name}
                                        className="w-10 h-10 object-cover"
                                        style={{ borderRadius: '8px 0px 8px 8px' }}
                                      />
                                      <div>
                                        <p className="text-xs font-black text-[#1C3627] leading-none">{expert.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{expert.title}</p>
                                      </div>
                                    </div>

                                    {/* SVG Radial Rings */}
                                    <div className="flex items-center justify-center gap-6 mb-4 pb-4 border-b border-gray-100">
                                      <RadialRing
                                        percent={expert.match}
                                        color="#0eb59a"
                                        size={60}
                                        stroke={5}
                                        label="Match Score"
                                      />
                                      <RadialRing
                                        percent={Math.min(100, expert.completedEngagements * 7)}
                                        color="#134e40"
                                        size={60}
                                        stroke={5}
                                        label="Competence"
                                      />
                                    </div>

                                    {/* Industries */}
                                    <div className="mb-4">
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Industries</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {expert.industries.map(ind => (
                                          <span key={ind} className="text-[10px] font-semibold bg-white text-[#134e40] border border-[#134e40]/15 px-2 py-0.5 rounded-md">
                                            {ind}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Engagement types */}
                                    <div className="mb-4">
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Engagement Types</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {expert.engagementTypes.map(type => (
                                          <span key={type} className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-md">
                                            {type}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                      {[
                                        { label: 'Engagements', value: expert.completedEngagements, color: 'text-[#0eb59a]' },
                                        { label: 'Followers', value: `${20 + expert.id * 13}`, color: 'text-teal-500' },
                                        { label: 'Experience', value: expert.experience, color: 'text-purple-500' },
                                      ].map((s, si) => (
                                        <div key={si} className="bg-white rounded-xl p-2.5 border border-gray-100 text-center">
                                          <p className={`text-xs font-black ${s.color} leading-none`}>{s.value}</p>
                                          <p className="text-[9px] text-gray-400 font-medium mt-0.5 leading-tight">{s.label}</p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Bio excerpt */}
                                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Profile</p>
                                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium">{expert.bio}</p>
                                    </div>

                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
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
            style={{ marginLeft: isSidebarOpen ? 260 : 68, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-black text-gray-900">
                  Compare Experts <span className="text-[#0eb59a]">({compareTray.length}/3)</span>
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
                        <img src={expert?.avatar} className="w-5 h-5 rounded-lg object-cover" />
                        <span className="text-xs font-bold text-[#134e40]">{expert?.name}</span>
                        <button onClick={() => toggleCompare(id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <X size={11} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setCompareTray([])}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl"
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: compareTray.length >= 2 ? 1.03 : 1 }}
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
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-md p-0 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-w-md w-full overflow-hidden"
            >
              {/* Expert mini-card */}
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100 mb-3">
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

              <h3 className="text-lg font-black text-gray-900 mt-1 mb-0.5">
                Invite {showInviteModal.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Select which requirement you'd like to invite this expert for.
              </p>

              {/* Requirement selector */}
              <div className="space-y-1.5 mb-3">
                {requirements.map((req) => (
                  <motion.button
                    key={req.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRequirement(req.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
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
              <div className="mb-3">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                  Personal Message <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  placeholder={`Hi ${showInviteModal.name.split(' ')[0]}, we'd love to discuss an opportunity with you...`}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-1">
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
