import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Briefcase, Clock, MapPin, IndianRupee, DollarSign,
  Star, Check, X, Heart, SlidersHorizontal, ChevronDown,
  ChevronUp, Zap, Shield, Users, Building, Calendar,
  Send, FileText, CheckCircle, Eye, TrendingUp,
  Grid, List, Award, Target, Bell, Settings, Activity,
  LayoutDashboard, UserCircle, BarChart2, ChevronLeft,
  ChevronRight, Menu, Plus, ArrowUpRight, AlertCircle,
  MessageSquare, RefreshCw, BookOpen, LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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
            stroke="currentColor" className="text-gray-200 dark:text-white/10"
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
          <span className="text-[10px] font-black text-[#1C3627] dark:text-white">{percent}%</span>
        </div>
      </div>
      <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 text-center leading-tight max-w-[56px]">{label}</span>
    </div>
  );
};

const HoverPanel = ({ opp, panelSide }) => (
  <motion.div
    key={`hover-panel-${opp.id}`}
    initial={{ opacity: 0, scale: 0.92, x: panelSide === 'right' ? -10 : 10 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.92, x: panelSide === 'right' ? -10 : 10 }}
    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    className="absolute top-0 z-[100] w-[280px] bg-[#FAFBF9] dark:!bg-[#1e2028] rounded-2xl border border-gray-100 dark:!border-white/10 p-5 pointer-events-none"
    style={{
      boxShadow: '0 20px 60px rgba(19,78,64,0.15)',
      [panelSide === 'right' ? 'left' : 'right']: 'calc(100% + 12px)',
    }}
  >
    {/* Header */}
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/10 text-left">
      <div className={`w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
        {opp.logoUrl ? (
          <img src={opp.logoUrl} alt={opp.company} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-black text-sm">{opp.logo}</span>
        )}
      </div>
      <div className="min-w-0 flex-grow text-left">
        <p className="text-sm font-black text-[#1C3627] dark:text-white leading-tight truncate">
          {opp.title}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 font-bold mt-0.5 truncate">{opp.company}</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">{opp.companySize}</p>
      </div>
    </div>

    {/* Two RadialRings */}
    <div className="flex items-center justify-center gap-6 mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
      <RadialRing
        percent={opp.match}
        color="#0eb59a"
        size={60}
        stroke={5}
        label="Match Score"
      />
      <RadialRing
        percent={opp.urgency === 'Immediate' ? 90 : opp.urgency === 'High' ? 65 : 30}
        color="#134e40"
        size={60}
        stroke={5}
        label="Urgency"
      />
    </div>

    {/* Skills */}
    <div className="mb-4 text-left">
      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Required Skills</p>
      <div className="flex flex-wrap gap-1.5">
        {opp.skills.map(skill => (
          <span key={skill} className="text-[10px] font-semibold bg-white dark:bg-white/5 text-[#134e40] dark:text-[#0eb59a] border border-[#134e40]/15 dark:border-white/10 px-2 py-0.5 rounded-md">
            {skill}
          </span>
        ))}
      </div>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      {[
        { label: 'Budget', value: opp.budget.split(' - ')[0], color: 'text-[#0eb59a]' },
        { label: 'Hours', value: opp.commitment, color: 'text-[#0eb59a]' },
        { label: 'Duration', value: opp.duration, color: 'text-amber-500' },
      ].map((s, si) => (
        <div key={si} className="bg-white dark:bg-[#252830] rounded-xl p-2.5 border border-gray-100 dark:border-white/5 text-center">
          <p className={`text-[10px] font-black leading-none ${s.color}`}>
            {s.value}
          </p>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-tight">
            {s.label}
          </p>
        </div>
      ))}
    </div>

    {/* Description */}
    <div className="bg-white dark:bg-[#252830] rounded-xl p-3 border border-gray-100 dark:border-white/5 text-left">
      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">About the Role</p>
      <p className="text-[11px] text-gray-600 dark:text-gray-400 dark:text-gray-300 leading-relaxed line-clamp-3">
        {opp.description}
      </p>
    </div>

    <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-3">
      {opp.applicants} applied · Posted {opp.postedDate}
    </p>
  </motion.div>
);

const MOCK_OPPORTUNITIES = [
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
    logoColor: 'from-teal-700 to-teal-500',
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
    logoColor: 'from-[#134e40] to-[#0eb59a]',
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
    logoColor: 'from-[#0eb59a] to-emerald-400',
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
    logoColor: 'from-emerald-700 to-teal-500',
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
    logoColor: 'from-[#134e40] to-slate-600',
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
    logoColor: 'from-teal-800 to-[#134e40]',
    status: 'featured',
    applicants: 15,
    verified: true,
  },
];

const ExpertOpportunities = () => {
  const navigate = useNavigate();
  const { opportunityId } = useParams();

  // ── STATE ──
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(true);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
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

  // Sidebar + header state (same as ExpertDashboard)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const gridRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Floating hover preview panel state
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const cardRefs = useRef({});

  const getPanelSide = (oppId) => {
    const cardEl = cardRefs.current[oppId];
    if (!cardEl) return 'right';
    const rect = cardEl.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    // Show on the right side if there's at least 300px of open space, to avoid overlapping the left sidebar
    return spaceRight >= 300 ? 'right' : 'left';
  };

  // ── DATA ──
  const statusFilters = ['All', 'Best Match', 'New', 'Saved', 'Applied'];

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

  const sidebarMenu = [
    { name: 'Dashboard',      icon: LayoutDashboard,
      path: '/expert-dashboard'      },
    { name: 'Opportunities',  icon: Briefcase,
      path: '/expert-opportunities', badge: '3' },
    { name: 'My Engagements', icon: Activity,
      path: '/expert-engagements'    },
    { name: 'Contracts',      icon: FileText,
      path: '/expert-contracts'      },
    { name: 'Earnings',       icon: IndianRupee,
      path: '/expert-earnings'       },
    { name: 'Profile',        icon: UserCircle,
      path: '/expert-profile'        },
    { name: 'Messages',       icon: MessageSquare,
      path: '/messages'              },
    { name: 'Meetings',       icon: Calendar,
      path: '/meetings'              },
  ];

  const notifications = [
    { title: 'New Role Match', desc: 'Fractional CFO at HealthTech — 96% match', time: '10 min ago', unread: true, color: 'bg-[#0eb59a]' },
    { title: 'Proposal Viewed', desc: 'D2C Brand viewed your proposal', time: '2 hours ago', unread: true, color: 'bg-emerald-500' },
    { title: 'New Message', desc: 'Acme Corp sent you a message', time: '3 hours ago', unread: false, color: 'bg-slate-400' },
  ];

  // ── EFFECTS ──
  // Auth check and profile/opportunities fetch
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
      if (isDemo) {
        setProfile({ full_name: 'David Chen' });
        setOpportunities(MOCK_OPPORTUNITIES);
        setLoadingProfile(false);
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=expert');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Fetch profile
      try {
        const response = await fetch(`${baseUrl}/api/expert/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.warn("No expert profile found, using defaults");
        }
      } catch (err) {
        console.error("Error fetching expert profile:", err);
      } finally {
        setLoadingProfile(false);
      }

      // Fetch opportunities
      try {
        const response = await fetch(`${baseUrl}/api/expert/opportunities`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOpportunities(data);
        } else {
          console.error("Failed to fetch opportunities from backend");
        }
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (!session && localStorage.getItem('demo_expert') !== 'true') {
          navigate('/signin?role=expert');
        }
      }
    );
    return () => listener?.subscription?.unsubscribe();
  }, [navigate]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Grid dropdown close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target))
        setGridOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  const handleApply = () => {
    if (showApplyModal) {
      setAppliedOpportunities(prev => [...prev, showApplyModal.id]);
    }
    setApplySent(true);
    setTimeout(() => {
      setShowApplyModal(null);
      setApplySent(false);
      setProposalText('');
      setProposedRate('');
    }, 2500);
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
    if (activeFilter === 'Applied' && !appliedOpportunities.includes(opp.id)) return false;
    if (activeFilter === 'Best Match' && opp.match < 85) return false;
    if (activeFilter === 'New' && opp.status !== 'new') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = opp.title?.toLowerCase().includes(q);
      const companyMatch = opp.company?.toLowerCase().includes(q);
      const industryMatch = opp.industry?.toLowerCase().includes(q);
      const skillsMatch = opp.skills?.some(s => s.toLowerCase().includes(q));
      if (!titleMatch && !companyMatch && !industryMatch && !skillsMatch) return false;
    }

    if (activeFilters.type.length > 0) {
      const activeTypesLower = activeFilters.type.map(t => t.toLowerCase().trim());
      if (!opp.type || !activeTypesLower.includes(opp.type.toLowerCase().trim())) return false;
    }

    if (activeFilters.industry.length > 0) {
      const activeIndsLower = activeFilters.industry.map(i => i.toLowerCase().trim());
      if (!opp.industry || !activeIndsLower.includes(opp.industry.toLowerCase().trim())) return false;
    }

    if (activeFilters.commitment.length > 0) {
      const hrs = parseInt(opp.commitment);
      const isMatch = activeFilters.commitment.some(option => {
        if (option === 'Under 10 hrs/wk') return hrs < 10;
        if (option === '10-20 hrs/wk') return hrs >= 10 && hrs <= 20;
        if (option === '20-30 hrs/wk') return hrs > 20 && hrs <= 30;
        if (option === 'Full-time (40 hrs)') {
          return hrs >= 40 || 
            opp.commitment?.toLowerCase().includes('full-time') || 
            opp.commitment?.toLowerCase().includes('full time') || 
            opp.commitment?.toLowerCase().includes('40 hrs');
        }
        return false;
      });
      if (!isMatch) return false;
    }

    if (activeFilters.budget) {
      const val = opp.budgetNum || (() => {
        if (!opp.budget) return 0;
        const cleanStr = opp.budget.replace(/\s+/g, '');
        // Match e.g., ₹2.5L or ₹3L
        const matchL = cleanStr.match(/₹([\d.]+)\s*L/i);
        if (matchL) return parseFloat(matchL[1]) * 100000;
        // Match e.g., ₹80K
        const matchK = cleanStr.match(/₹([\d.]+)\s*K/i);
        if (matchK) return parseFloat(matchK[1]) * 1000;
        return 0;
      })();

      let isMatch = false;
      if (activeFilters.budget === 'Under ₹1L/mo') isMatch = val < 100000;
      else if (activeFilters.budget === '₹1L - ₹2L/mo') isMatch = val >= 100000 && val <= 200000;
      else if (activeFilters.budget === '₹2L - ₹4L/mo') isMatch = val >= 200000 && val <= 400000;
      else if (activeFilters.budget === '₹4L+/mo') isMatch = val >= 400000;
      if (!isMatch) return false;
    }

    if (activeFilters.location.length > 0) {
      const locMatch = activeFilters.location.some(l => {
        const filterLoc = l.toLowerCase().trim();
        const oppLoc = opp.location?.toLowerCase() || '';
        return oppLoc.includes(filterLoc);
      });
      if (!locMatch) return false;
    }

    if (activeFilters.urgency.length > 0) {
      const activeUrgenciesLower = activeFilters.urgency.map(u => u.toLowerCase().trim());
      if (!opp.urgency || !activeUrgenciesLower.includes(opp.urgency.toLowerCase().trim())) return false;
    }

    return true;
  });

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Fractional':
        return 'text-[#0eb59a] bg-[#f0fdf4] dark:bg-teal-950/25 border-[#0eb59a]/30 dark:border-teal-900/50';
      case 'Interim':
        return 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/25 border-teal-200 dark:border-teal-900/50';
      case 'Advisory':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/50';
      case 'Project':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const getMatchBorderColor = (match) => {
    if (match >= 90) return '#0eb59a';
    if (match >= 80) return '#f59e0b';
    return '#9ca3af';
  };

  return (
    <div className="flex h-screen bg-[#f4f7f5] dark:bg-[#0f1117] font-sans text-slate-900 dark:text-white overflow-hidden">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══ */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white dark:bg-[#1b1d24] border-r border-gray-100 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 dark:border-white/10 justify-between">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer shrink-0" onClick={() => navigate('/expert-dashboard')}>
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
            onClick={() => setIsSidebarOpen(s => !s)}
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-gray-100 dark:hover:bg-white/10 transition-all shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {sidebarMenu.map((item) => {
            const isActive = item.name === 'Opportunities';
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavOpp"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
                  />
                )}
                <div className="relative shrink-0">
                  <item.icon size={17} />
                  {item.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#0eb59a] text-white text-[8px] font-black rounded-full flex items-center justify-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <motion.span
                  animate={{
                    opacity: isSidebarOpen ? 1 : 0,
                    width: isSidebarOpen ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
                >
                  {item.name}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Settings + Sign Out pinned to bottom */}
        <div className="p-3 border-t border-gray-50 dark:border-white/5 space-y-1">
          <div className={`flex items-center gap-3 px-3 py-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Theme</span>}
            <ThemeToggle />
          </div>
          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/expert-settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] transition-all cursor-pointer"
          >
            <Settings size={17} className="shrink-0" />
            <motion.span
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0, 
                width: isSidebarOpen ? 'auto' : 0 
              }}
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
              localStorage.removeItem('demo_expert');
              await supabase.auth.signOut();
              navigate('/signin?role=expert');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all font-bold cursor-pointer"
          >
            <LogOut size={17} className="shrink-0" />
            <motion.span
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0, 
                width: isSidebarOpen ? 'auto' : 0 
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
            >
              Sign Out
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* ══ MAIN CONTENT WRAPPER ══ */}
      <div
        className="flex flex-col min-h-screen overflow-hidden flex-grow"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          width: isSidebarOpen ? 'calc(100% - 260px)' : 'calc(100% - 68px)',
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── HEADER (identical to ExpertDashboard) ── */}
        <header className="h-16 bg-white dark:bg-[#1b1d24] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          {/* Left — mobile menu toggle */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white transition-all shrink-0 cursor-pointer"
              >
                <Menu size={20} />
              </motion.button>
            )}
          </div>

          {/* Center — search bar */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'
              }`} />
              <input
                type="text"
                placeholder="Search opportunities, companies, skills..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm text-gray-700 dark:text-gray-300 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#1e2028] focus:outline-none transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20'
                    : 'border-gray-200'
                }`}
              />
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] bg-gray-100 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">
            {/* Browse Roles button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/expert-opportunities')}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-full shadow-md overflow-hidden relative group transition-colors duration-200 cursor-pointer"
            >
              <Briefcase size={14} />
              Browse Roles
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </motion.button>

            {/* Grid quick-nav dropdown */}
            <div className="relative" ref={gridRef}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setGridOpen(!gridOpen);
                  setShowNotifications(false);
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
                  gridOpen
                    ? 'bg-teal-50 dark:bg-[#134e40]/25 border-[#0eb59a] text-[#134e40] dark:text-[#0eb59a]'
                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500'
                }`}
              >
                <Grid size={17} />
              </motion.button>

              <AnimatePresence>
                {gridOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-[#1e2028] rounded-2xl z-50 overflow-hidden"
                    style={{
                      boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                      border: '1px solid #F1F5F2', borderColor: 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <div className="p-3 space-y-1">
                      {[
                        { icon: Briefcase, label: 'Opportunities', badge: '3 new', badgeStyle: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/25 border-teal-200 dark:border-teal-900/50', border: '#0eb59a', path: '/expert-opportunities' },
                        { icon: Activity, label: 'My Engagements', badge: '2 active', badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200', border: '#0eb59a', path: '/expert-engagements' },
                        { icon: FileText, label: 'Contracts', badge: '1 pending', badgeStyle: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/50', border: '#F59E0B', path: '/expert-contracts' },
                        { icon: DollarSign, label: 'Earnings', badge: '₹3.5L pending', badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200', border: '#0eb59a', path: '/expert-earnings' },
                        { icon: UserCircle, label: 'Profile', badge: '78% complete', badgeStyle: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/25 border-teal-200 dark:border-teal-900/50', border: '#0eb59a', path: '/expert-profile' },
                        { icon: Settings, label: 'Settings', badge: 'Preferences', badgeStyle: 'text-gray-600 dark:text-gray-400 bg-gray-50 border-gray-200', border: '#9CA3AF', path: '/expert-settings' },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 3, backgroundColor: '#FAFBF9' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            navigate(item.path);
                            setGridOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                          style={{ borderLeft: `3px solid ${item.border}` }}
                        >
                          <div className="w-7 h-7 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                            <item.icon size={13} className="text-[#134e40]" />
                          </div>
                          <span className="flex-1 text-sm font-bold text-[#1C3627] dark:text-white text-left">
                            {item.label}
                          </span>
                          <div className="w-px h-4 bg-gray-100 shrink-0" />
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${item.badgeStyle}`}>
                            {item.badge}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bell notification */}
            <div className="relative">
              <motion.button
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 4, repeat: Infinity, repeatDelay: 10 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setGridOpen(false);
                }}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
                  showNotifications
                    ? 'bg-teal-50 border-[#0eb59a]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Bell size={16} className={showNotifications ? 'text-[#134e40]' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#1b1d24] dark:border-[#1b1d24] px-0.5 animate-pulse"
                >
                  {notifications.filter(n => n.unread).length}
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, x: '100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '100%' }}
                      transition={{ duration: 0.3, type: 'tween' }}
                      className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-[#1e2028] shadow-2xl border-l border-gray-100 dark:border-white/10 z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white dark:from-[#252830] dark:to-[#1e2028]">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm">Notifications</h3>
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer">
                          Mark all read
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.map((notif, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`px-5 py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex gap-3 transition-colors ${
                              notif.unread ? 'bg-teal-50/20 dark:bg-teal-950/10' : ''
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1C3627] dark:text-white leading-tight text-left">{notif.title}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed text-left">
                                {notif.desc}
                              </p>
                              <p className="text-[10px] text-gray-300 font-semibold mt-1 text-left">{notif.time}</p>
                            </div>
                            {notif.unread && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/expert-profile')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
              >
                {profile?.profile_url ? (
                  <img src={profile.profile_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EX'
                )}
              </motion.div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-[#1b1d24]" />
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT CONTAINER (FIX 2 & 5 — Left filter stays fixed, right feed scrolls) ── */}
        <main className="flex-grow flex bg-[#f4f7f5] dark:bg-[#0f1117] overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
          {/* Left Column — Filter sidebar (solid full-length sidebar under header) */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 260 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-white dark:bg-[#161a20] border-r border-gray-100 dark:border-white/5 dark:border-white/5 flex flex-col shrink-0 z-10 overflow-hidden shadow-sm hidden md:flex"
                style={{ width: 260 }}
              >
                <div className="h-0.5 bg-gradient-to-r from-[#134e40] via-[#0eb59a] to-transparent shrink-0" />
                <div className="p-5 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  {/* Filter header */}
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <h3 className="font-black text-gray-900 dark:text-white text-sm flex items-center gap-2">
                      <Filter size={14} className="text-[#0eb59a]" /> Filters
                    </h3>
                    {totalActiveFilters > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearAllFilters}
                        className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw size={11} /> Clear all
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic filter sections */}
                    {filterSections.map((section) => (
                      <div key={section.id} className="border-b border-gray-50 dark:border-white/5 pb-4">
                        <button
                          onClick={() => setExpandedFilter(expandedFilter === section.id ? null : section.id)}
                          className="w-full flex items-center justify-between mb-3 group"
                        >
                          <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <section.icon size={13} className="text-[#0eb59a]" />
                            {section.label}
                            {activeFilters[section.id]?.length > 0 && (
                              <span className="bg-[#0eb59a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                {activeFilters[section.id].length}
                              </span>
                            )}
                          </span>
                          {expandedFilter === section.id
                            ? <ChevronUp size={14} className="text-gray-400 dark:text-gray-500" />
                            : <ChevronDown size={14} className="text-gray-400 dark:text-gray-500" />
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
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => toggleFilter(section.id, option)}
                                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group border ${
                                      isActive
                                        ? 'bg-[#134e40] text-white border-[#134e40] shadow-sm hover:bg-[#0eb59a] hover:border-[#0eb59a] hover:shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/5 hover:bg-[#f0fdf4] dark:hover:bg-white/10 hover:text-[#134e40] hover:border-[#0eb59a]/30 hover:shadow-sm'
                                    }`}
                                  >
                                    {/* Custom checkbox box */}
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
                                      isActive
                                        ? 'bg-white dark:bg-[#134e40] border-white dark:border-white/20 scale-105 shadow-sm'
                                        : 'border-gray-300 dark:border-white/20 bg-white dark:bg-[#161a20] group-hover:border-[#0eb59a] group-hover:scale-110 group-hover:shadow-sm'
                                    }`}>
                                      {isActive && <Check size={10} className="text-[#134e40] dark:text-white" strokeWidth={3.5} />}
                                    </div>
                                    <span className="flex-grow text-left transition-colors duration-150">{option}</span>
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
                      <p className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <DollarSign size={13} className="text-[#0eb59a]" /> Budget Range
                      </p>
                      <div className="space-y-1.5">
                        {budgetOptions.map(bud => {
                          const isActive = (bud === 'Any' && !activeFilters.budget) || activeFilters.budget === bud;
                          return (
                            <motion.button
                              key={bud}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setActiveFilters(prev => ({
                                ...prev,
                                budget: bud === 'Any' ? '' : bud
                              }))}
                              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group border ${
                                isActive
                                  ? 'bg-[#134e40] text-white border-[#134e40] shadow-sm hover:bg-[#0eb59a] hover:border-[#0eb59a] hover:shadow-md'
                                  : 'text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/5 hover:bg-[#f0fdf4] dark:hover:bg-white/10 hover:text-[#134e40] hover:border-[#0eb59a]/30 hover:shadow-sm'
                              }`}
                            >
                              {/* Custom checkbox box */}
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
                                isActive
                                  ? 'bg-white dark:bg-[#134e40] border-white dark:border-white/20 scale-105 shadow-sm'
                                  : 'border-gray-300 dark:border-white/20 bg-white dark:bg-[#161a20] group-hover:border-[#0eb59a] group-hover:scale-110 group-hover:shadow-sm'
                              }`}>
                                {isActive && <Check size={10} className="text-[#134e40] dark:text-white" strokeWidth={3.5} />}
                              </div>
                              <span className="flex-grow text-left transition-colors duration-150">{bud}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Right Column — Feed container (scrollable feed area) */}
          <div className="flex-grow h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 pl-6">
            {/* Page Hero Strip */}
            <div className="relative overflow-hidden border border-teal-100/60 dark:border-white/10 rounded-3xl mb-6 shrink-0 dark:bg-[#1b1d24]">
              <div className="absolute inset-0 dark:hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5f1 50%, #f8fafc 100%)' }} />
              <div
                className="absolute inset-0 opacity-[0.3]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(14,181,154,0.12) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="absolute top-0 right-0 w-48 h-24 bg-[#0eb59a]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 px-6 py-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="text-left">
                    <h1
                      className="text-3xl font-black text-[#1C3627] dark:text-white tracking-tight"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Opportunities
                    </h1>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-1 max-w-md leading-relaxed">
                      Sleek, executive-level opportunities tailored specifically to your background and expertise.
                    </p>
                  </div>

                  {/* Right side stats + view switch */}
                  <div className="flex items-center gap-3 lg:ml-auto flex-shrink-0">
                    {/* Metrics row */}
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Matched Roles Widget */}
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-[#1e2028]/70 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 px-3.5 py-1.5 rounded-xl shadow-sm">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                          <Briefcase size={13} className="text-[#134e40]" />
                        </div>
                        <div className="text-left min-w-[70px]">
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider leading-none">Matches</p>
                          <p className="text-xs font-black text-[#1C3627] dark:text-white mt-0.5">{filteredOpportunities.length} roles</p>
                        </div>
                      </div>

                      {/* Fit Score Widget */}
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-[#1e2028]/70 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 px-3.5 py-1.5 rounded-xl shadow-sm">
                        <div className="w-7 h-7 rounded-lg bg-[#f0fdf4] flex items-center justify-center shrink-0">
                          <TrendingUp size={13} className="text-[#0eb59a]" />
                        </div>
                        <div className="text-left min-w-[70px]">
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider leading-none">Avg Fit</p>
                          <p className="text-xs font-black text-[#1C3627] dark:text-white mt-0.5">86% Score</p>
                        </div>
                      </div>

                      {/* Urgent Widget */}
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-[#1e2028]/70 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 px-3.5 py-1.5 rounded-xl shadow-sm">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <Zap size={13} fill="#ef4444" className="text-red-500 animate-pulse" />
                        </div>
                        <div className="text-left min-w-[70px]">
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider leading-none">Urgent</p>
                          <p className="text-xs font-black text-red-600 mt-0.5">{opportunities.filter(o => o.urgency === 'Immediate').length} roles</p>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic sliding pill view toggle switch */}
                    <div className="flex bg-gray-100 dark:bg-[#1e2028] border border-gray-200/80 dark:border-white/5 rounded-xl p-1 shadow-inner h-fit relative">
                      {[
                        { id: 'grid', icon: Grid },
                        { id: 'list', icon: List },
                      ].map(({ id, icon: Icon }) => {
                        const isActive = viewMode === id;
                        return (
                          <button
                            key={id}
                            onClick={() => setViewMode(id)}
                            className="p-2 rounded-lg relative transition-colors duration-200 cursor-pointer z-10 flex items-center justify-center"
                            style={{ width: '32px', height: '32px' }}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeViewPill"
                                className="absolute inset-0 bg-[#134e40] rounded-lg shadow-sm -z-10"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                            <Icon size={14} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search + Tabs */}
            <div className="mb-6 shrink-0">
              {/* Search bar */}
              <div className="relative mb-4 group">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#0eb59a] transition-colors" />
                <input
                  type="text"
                  placeholder="Search by title, company, skill, or industry..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-white/10 dark:text-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {statusFilters.map(filter => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeFilter === filter
                        ? 'bg-[#134e40] text-white shadow-md'
                        : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/5 hover:border-[#0eb59a]/40 hover:text-[#0eb59a]'
                    }`}
                  >
                    {filter}
                    {filter === 'Saved' && savedOpportunities.length > 0 && (
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${
                        activeFilter === filter ? 'bg-white/20' : 'bg-gray-100 text-gray-400 dark:text-gray-500'
                      }`}>
                        {savedOpportunities.length}
                      </span>
                    )}
                    {filter === 'Applied' && appliedOpportunities.length > 0 && (
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${
                        activeFilter === filter ? 'bg-white/20' : 'bg-gray-100 text-gray-400 dark:text-gray-500'
                      }`}>
                        {appliedOpportunities.length}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Cards Grid Area */}
            <div className="flex-1 min-w-0 overflow-visible pb-24">
              {/* Results count + sort */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Showing <span className="text-gray-900 dark:text-white font-black">{filteredOpportunities.length}</span> opportunities
                </p>
                <select className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20">
                  <option>Best Match</option>
                  <option>Newest First</option>
                  <option>Highest Budget</option>
                  <option>Fewest Applicants</option>
                </select>
              </div>

              {/* Opportunities List/Grid */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-24 w-full bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm"
                  >
                    <div className="w-12 h-12 border-4 border-[#0eb59a] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-bold text-sm">Loading matched opportunities...</p>
                  </motion.div>
                ) : filteredOpportunities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-16 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-white/10">
                      <Briefcase size={24} className="text-gray-300" />
                    </div>
                    <h3 className="font-black text-gray-700 dark:text-gray-300 text-lg mb-2">No opportunities found</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Try adjusting your filters or search query</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      onClick={clearAllFilters}
                      className="px-5 py-2.5 bg-[#134e40] text-white text-sm font-bold rounded-xl"
                    >
                      Clear Filters
                    </motion.button>
                  </motion.div>
                ) : viewMode === 'grid' ? (
                  /* ── GRID LAYOUT COLUMN ADJUSTMENT (FIX 1) ── */
                  <div
                    className={`grid gap-5 ${
                      showFilters
                        ? 'grid-cols-1 lg:grid-cols-2'
                        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    }`}
                  >
                    {filteredOpportunities.map((opp, idx) => (
                      <motion.div
                        key={`grid-${opp.id}`}
                        ref={el => cardRefs.current[opp.id] = el}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        onMouseEnter={() => setHoveredCardId(opp.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                        className={`relative group h-full transition-all duration-150 ${
                          hoveredCardId === opp.id ? 'z-30' : 'z-10'
                        }`}
                      >
                        {/* The existing card inner content — (FIX 3 / FIX 4 / EQUAL CARD HEIGHT / INTERACTIVE HOVER) */}
                        <motion.div
                          whileHover={{
                            y: -6,
                            scale: 1.01,
                            boxShadow: '0 20px 40px rgba(19,78,64,0.08)',
                            borderColor: getMatchBorderColor(opp.match)
                          }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="bg-white dark:!bg-[#1e2028] rounded-2xl border-2 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between overflow-visible relative"
                          style={{
                            borderColor: hoveredCardId === opp.id
                              ? getMatchBorderColor(opp.match)
                              : `${getMatchBorderColor(opp.match)}33`, // 20% opacity
                            boxShadow: hoveredCardId === opp.id
                              ? '0 12px 40px rgba(14,181,154,0.12)'
                              : '0 8px 30px rgba(0,0,0,0.04)'
                          }}
                        >
                                      <div className="p-5 flex-grow flex flex-col justify-between">
                            <div className="space-y-4">
                              {/* Top badges */}
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getTypeStyle(opp.type)}`}>
                                  {opp.type}
                                </span>
                                {opp.status === 'featured' && (
                                  <span className="text-[10px] font-black text-[#134e40] dark:text-[#0eb59a] bg-teal-50 dark:bg-[#0eb59a]/10 px-2 py-1 rounded-lg border border-teal-200 dark:border-[#0eb59a]/20 flex items-center gap-1">
                                    <Star size={9} fill="currentColor" /> Featured
                                  </span>
                                )}
                                {(opp.status === 'new' || (opp.postedDate.includes('days ago') && parseInt(opp.postedDate) <= 3)) && (
                                  <span className="text-[10px] font-black text-white bg-[#0eb59a] px-2 py-1 rounded-lg animate-pulse">
                                    NEW
                                  </span>
                                )}
                                <span
                                  style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)', marginLeft: 'auto' }}
                                  className="text-[10px] font-black text-white px-2.5 py-1 rounded-full shadow-sm shrink-0"
                                >
                                  {opp.match}% Match
                                </span>
                              </div>

                              {/* Company + title */}
                              <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-md shrink-0 group-hover:rotate-3 transition-transform duration-300`}>
                                  {opp.logoUrl ? (
                                    <img src={opp.logoUrl} alt={opp.company} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-white font-black text-sm">{opp.logo}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-grow text-left">
                                  <h3 className="font-black text-[#1C3627] dark:text-white text-base leading-tight">
                                    {opp.title}
                                  </h3>
                                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-0.5">{opp.company}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {opp.companySize}
                                  </p>
                                </div>
                              </div>

                              {/* Urgency pill */}
                              {opp.urgency === 'Immediate' && (
                                <div className="text-left">
                                  <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 flex items-center gap-1 w-fit">
                                    <Zap size={9} fill="currentColor" /> Immediate
                                  </span>
                                </div>
                              )}

                              {/* Description */}
                              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 text-left">
                                {opp.description}
                              </p>

                              {/* Meta grid */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 text-sm font-black text-[#134e40]">
                                  <DollarSign size={11} className="text-[#0eb59a] shrink-0" />
                                  <span className="truncate">{opp.budget}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                                  <Clock size={11} className="shrink-0" />
                                  <span className="truncate">{opp.commitment}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                                  <MapPin size={11} className="shrink-0" />
                                  <span className="truncate">{opp.location.split(' | ')[0]}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                                  <Calendar size={11} className="shrink-0" />
                                  <span className="truncate">{opp.duration}</span>
                                </div>
                              </div>

                              {/* Skills */}
                              <div className="flex flex-wrap gap-1.5">
                                {opp.skills.slice(0, 3).map(skill => (
                                  <span
                                    key={skill}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#f0fdf4] dark:bg-white/5 text-[#134e40] dark:text-[#0eb59a] border border-[#0eb59a]/20 dark:border-[#0eb59a]/30 shrink-0"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {opp.skills.length > 3 && (
                                  <span className="text-[10px] font-bold bg-gray-100 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded-lg shrink-0">
                                    +{opp.skills.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 shrink-0">
                              {/* Footer */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5 mb-3">
                                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                                  <Users size={10} /> {opp.applicants} applied · {opp.postedDate}
                                </span>
                                {opp.verified && (
                                  <span className="text-[9px] font-black text-[#0eb59a] flex items-center gap-1">
                                    <CheckCircle size={10} /> Verified
                                  </span>
                                )}
                              </div>

                              {/* CTA buttons */}
                              <div className="flex items-center gap-2 relative z-20">
                                {appliedOpportunities.includes(opp.id) ? (
                                  <div className="flex-grow py-2.5 bg-[#f0fdf4] text-[#134e40] text-sm font-black rounded-xl border border-[#0eb59a]/30 flex items-center justify-center gap-1.5 cursor-not-allowed">
                                    <CheckCircle size={14} className="text-[#0eb59a]" />
                                    Applied
                                  </div>
                                ) : (
                                  <motion.button
                                    whileHover={{
                                      scale: 1.03,
                                      backgroundColor: '#0eb59a',
                                      boxShadow: '0 8px 24px rgba(14,181,154,0.25)'
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowApplyModal(opp);
                                    }}
                                    className="flex-grow py-2.5 bg-[#134e40] text-white text-sm font-black rounded-xl transition-all shadow-sm text-center cursor-pointer border border-[#134e40] hover:border-[#0eb59a]"
                                  >
                                    Apply Now
                                  </motion.button>
                                )}
                                <motion.button
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: '#f0fdf4',
                                    borderColor: '#0eb59a',
                                    color: '#134e40'
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/expert-opportunities/${opp.id}`);
                                  }}
                                  className="w-10 h-10 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
                                >
                                  <Eye size={14} className="text-gray-400 dark:text-gray-500 group-hover:text-[#134e40] transition-colors" />
                                </motion.button>
                                <motion.button
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: '#fef2f2',
                                    borderColor: '#fca5a5',
                                    color: '#ef4444'
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaved(opp.id);
                                  }}
                                  className={`w-10 h-10 rounded-xl transition-all border flex items-center justify-center cursor-pointer shrink-0 ${
                                    savedOpportunities.includes(opp.id)
                                      ? 'bg-red-50 text-red-500 border-red-100'
                                      : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:bg-red-50 hover:text-red-400'
                                  }`}
                                >
                                  <Heart size={14} fill={savedOpportunities.includes(opp.id) ? '#ef4444' : 'none'} className={savedOpportunities.includes(opp.id) ? 'text-[#ef4444]' : 'text-gray-400 dark:text-gray-500'} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* FLOATING HOVER PANEL (FIX 3) ── */}
                        <AnimatePresence>
                          {hoveredCardId === opp.id && (
                            <HoverPanel
                              opp={opp}
                              panelSide={getPanelSide(opp.id)}
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // ── LIST VIEW RESTYLED ──
                  <div className="flex flex-col gap-4">
                    {filteredOpportunities.map((opp, idx) => (
                      <motion.div
                        key={`list-${opp.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        whileHover={{
                          y: -2,
                          boxShadow: '0 12px 36px rgba(19,78,64,0.06)',
                          borderColor: getMatchBorderColor(opp.match)
                        }}
                        className="bg-white dark:!bg-[#1e2028] rounded-2xl border-2 transition-all duration-300 p-5 flex items-start gap-5 cursor-pointer relative text-left shadow-sm overflow-hidden"
                        style={{
                          borderColor: `${getMatchBorderColor(opp.match)}33` // 20% opacity
                        }}
                      >
                                  {/* Logo */}
                        <div className={`w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-md shrink-0 group-hover:rotate-2 transition-transform duration-300`}>
                          {opp.logoUrl ? (
                            <img src={opp.logoUrl} alt={opp.company} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-black text-base">{opp.logo}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${getTypeStyle(opp.type)}`}>
                              {opp.type}
                            </span>
                            {opp.urgency === 'Immediate' && (
                              <span className="text-[10px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-100 dark:border-red-500/20 flex items-center gap-1">
                                <Zap size={9} fill="currentColor" /> Urgent
                              </span>
                            )}
                            <span
                              style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
                              className="ml-auto text-[10px] font-black text-white px-2.5 py-1 rounded-full shadow-sm"
                            >
                              {opp.match}% Match
                            </span>
                          </div>

                          <h3 className="font-black text-[#1C3627] dark:text-white text-base leading-tight mb-0.5 text-left">
                            {opp.title}
                          </h3>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 text-left">
                            {opp.company} · {opp.companySize}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500 font-semibold mb-3">
                            <span className="flex items-center gap-1.5 text-[#134e40] font-black">
                              <DollarSign size={11} className="text-[#0eb59a]" /> {opp.budget}
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
                            {opp.skills.map(skill => (
                              <span
                                key={skill}
                                className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-[#f0fdf4] dark:bg-white/5 text-[#134e40] dark:text-[#0eb59a] border border-[#0eb59a]/20 dark:border-[#0eb59a]/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 mt-3 sm:mt-0 relative z-20">
                           {appliedOpportunities.includes(opp.id) ? (
                            <div className="px-5 py-2.5 bg-[#f0fdf4] text-[#134e40] text-sm font-black rounded-xl border border-[#0eb59a]/30 flex items-center justify-center gap-1.5 cursor-not-allowed w-full sm:w-auto">
                              <CheckCircle size={14} className="text-[#0eb59a]" />
                              Applied
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{
                                scale: 1.03,
                                backgroundColor: '#0eb59a',
                                boxShadow: '0 8px 24px rgba(14,181,154,0.25)'
                              }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowApplyModal(opp);
                              }}
                              className="px-5 py-2.5 bg-[#134e40] text-white text-sm font-black rounded-xl transition-all shadow-sm w-full sm:w-auto text-center cursor-pointer border border-[#134e40] hover:border-[#0eb59a]"
                            >
                              Apply Now
                            </motion.button>
                          )}
                          <div className="flex gap-2 justify-center">
                            <motion.button
                              whileHover={{
                                scale: 1.03,
                                backgroundColor: '#f0fdf4',
                                borderColor: '#0eb59a',
                                color: '#134e40'
                              }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/expert-opportunities/${opp.id}`);
                              }}
                              className="flex-1 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 dark:text-gray-400 dark:text-gray-500 text-xs font-black rounded-xl transition-all flex items-center justify-center cursor-pointer"
                            >
                              <Eye size={13} className="mr-1" /> View
                            </motion.button>
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: '#fef2f2',
                                borderColor: '#fca5a5',
                                color: '#ef4444'
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaved(opp.id);
                              }}
                              className={`px-4 py-2.5 rounded-xl transition-all border flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer ${
                                savedOpportunities.includes(opp.id)
                                  ? 'bg-red-50 text-red-500 border-red-100'
                                  : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:bg-red-50 hover:text-red-400'
                              }`}
                            >
                              <Heart size={13} fill={savedOpportunities.includes(opp.id) ? '#ef4444' : 'none'} className={savedOpportunities.includes(opp.id) ? 'text-[#ef4444]' : 'text-gray-400 dark:text-gray-500'} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* ══ APPLY MODAL (exactly as-is) ══ */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-md p-0 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-[#1e2028] rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
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
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-white dark:from-[#252830] dark:to-[#1e2028] border border-teal-100 dark:border-white/5 mb-6">
                      <div className={`w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br ${showApplyModal.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                        {showApplyModal.logoUrl ? (
                          <img src={showApplyModal.logoUrl} alt={showApplyModal.company} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-black text-sm">{showApplyModal.logo}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-900 dark:text-white text-sm leading-tight">{showApplyModal.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-semibold">{showApplyModal.company}</p>
                        <p className="text-[10px] text-[#0eb59a] font-black mt-0.5">{showApplyModal.budget}</p>
                      </div>
                      <span className="text-xs font-black text-[#134e40] bg-teal-100 dark:bg-white/5 px-2.5 py-1.5 rounded-xl shrink-0">
                        {showApplyModal.match}% Match
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">Submit Proposal</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 leading-relaxed">
                      Introduce yourself and explain why you're the right fit for this role.
                    </p>

                    {/* Proposed Rate */}
                    <div className="mb-4">
                      <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                        Your Proposed Monthly Rate
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-sm">₹</span>
                        <input
                          type="text"
                          value={proposedRate}
                          onChange={e => setProposedRate(e.target.value)}
                          placeholder={`Budget: ${showApplyModal.budget}`}
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Proposal Text */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                        Cover Letter / Proposal *
                      </label>
                      <textarea
                        value={proposalText}
                        onChange={e => setProposalText(e.target.value)}
                        placeholder={`Hi, I'm a CFO with 18 years of experience at Meesho and OYO. I've led $200M+ in fundraising and have deep expertise in the areas you're looking for...`}
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 resize-none transition-all"
                      />
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-semibold text-right">
                        {proposalText.length}/500 characters
                      </p>
                    </div>

                    {/* Availability confirmation */}
                    <div className="bg-teal-50 dark:bg-white/5 rounded-2xl p-4 border border-teal-100 dark:border-white/5 mb-5 flex items-start gap-2">
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
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl"
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
                            : 'bg-gray-100 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
                      className="w-20 h-20 bg-teal-50 rounded-full flex-shrink-0 flex items-center justify-center mx-auto mb-4 border-4 border-[#0eb59a]"
                    >
                      <Check size={36} className="text-[#0eb59a]" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Proposal Submitted!</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
                      Your proposal for <span className="font-bold text-gray-700 dark:text-gray-300">{showApplyModal.title}</span> at <span className="font-bold text-gray-700 dark:text-gray-300">{showApplyModal.company}</span> has been sent. Expect a response within 48 hours.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-white/5 text-[#134e40] dark:text-[#0eb59a] text-xs font-black rounded-xl border border-teal-100 dark:border-white/5">
                      <Shield size={12} /> Reviewed by ExigentCX PMO
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
