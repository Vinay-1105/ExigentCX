import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Search, LayoutDashboard, Bell, Settings, Activity,
  FileText, Star, DollarSign, IndianRupee, ArrowUpRight, AlertCircle,
  ChevronRight, ChevronLeft, Clock, Briefcase, Eye, Zap,
  Award, MessageSquare, User, Check, TrendingUp, Shield,
  CreditCard, Users, Target, Grid, Plus,
  UserCircle, LogOut, X, Menu, MapPin, CheckCircle, Calendar,
  UserPlus, UserCheck, UserX
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// ── ANIMATED COUNTER ──
const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const raw = value.replace(/[₹L,+\s]/g, '');
    const isNum = !isNaN(parseFloat(raw));
    if (!isNum) { setDisplay(value); return; }
    const end = parseFloat(raw);
    const duration = 1200;
    const step = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setDisplay(value); clearInterval(timer); return; }
      setDisplay(value.includes('₹') ? `₹${Math.floor(current)}` : `${Math.floor(current)}`);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
};

// ── MAGNETIC TILT CARD ──
const MagneticCard = ({ children, className, onClick, style }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [3, -3]);
  const rotateY = useTransform(x, [-30, 30], [-3, 3]);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, boxShadow: '0 20px 50px rgba(14,181,154,0.08)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [escrowAccounts, setEscrowAccounts] = useState([]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
      let token = "demo-token";
      if (!isDemo) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/signin?role=expert');
          return;
        }
        token = session.access_token;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Profile
      if (isDemo) {
        setProfile({ full_name: 'David Chen', key_skills: ['Financial Modeling', 'Investor Relations'] });
        setRecommendedOpportunities(MOCK_RECOMMENDED_OPPORTUNITIES);
        setLoadingProfile(false);
      } else {
        try {
          const response = await fetch(`${baseUrl}/api/expert/profile`, { headers });
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
            if (data.engagement_types?.availability?.status) {
              setIsAvailable(data.engagement_types.availability.status === 'Available');
            }
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
          const response = await fetch(`${baseUrl}/api/expert/opportunities`, { headers });
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setRecommendedOpportunities(data);
            } else {
              setRecommendedOpportunities(MOCK_RECOMMENDED_OPPORTUNITIES);
            }
          } else {
            setRecommendedOpportunities(MOCK_RECOMMENDED_OPPORTUNITIES);
          }
        } catch (err) {
          console.error("Error fetching opportunities:", err);
          setRecommendedOpportunities(MOCK_RECOMMENDED_OPPORTUNITIES);
        }
      }

      // Fetch payment summary (both demo and real)
      try {
        const response = await fetch(`${baseUrl}/api/payments/summary`, { headers });
        if (response.ok) {
          const data = await response.json();
          setPaymentSummary(data);
        }
      } catch (err) {
        console.error("Error fetching payment summary:", err);
      }

      // Fetch escrows (both demo and real)
      try {
        const response = await fetch(`${baseUrl}/api/payments/escrows`, { headers });
        if (response.ok) {
          const data = await response.json();
          setEscrowAccounts(data);
        }
      } catch (err) {
        console.error("Error fetching escrows:", err);
      }
    };

    checkAuthAndFetch();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && localStorage.getItem('demo_expert') !== 'true') {
        navigate('/signin?role=expert');
      }
    });
    return () => authListener?.subscription?.unsubscribe();
  }, [navigate]);

  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Role Match', desc: 'Fractional CFO role at HealthTech — 96% match', time: '10 min ago', unread: true, color: 'bg-[#0eb59a]' },
    { id: '2', title: 'Milestone Approved', desc: 'Acme Corp approved Financial Model Development', time: '2 hours ago', unread: true, color: 'bg-emerald-500' },
    { id: '3', title: 'Payment Received', desc: '₹2,00,000 credited for milestone completion', time: '3 hours ago', unread: true, color: 'bg-teal-600' },
    { id: '4', title: 'New Message', desc: 'Acme Corp sent you a message about the investor deck', time: '1 day ago', unread: false, color: 'bg-slate-400' },
  ]);
  const [opportunityCarouselIndex, setOpportunityCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [isAvailable, setIsAvailable] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [connectRequests, setConnectRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cxo_connect_requests') || '[]')
        .filter(r => r.status === 'pending');
    } catch { return []; }
  });

  useEffect(() => {
    if (connectRequests.length > 0) {
      setNotifications(prev => {
        const alreadyExists = prev.some(n => n.title === 'New Connection Request');
        if (alreadyExists) return prev;
        return [{
          id: 'connect-req',
          title: 'New Connection Request',
          desc: `${connectRequests[0]?.companyName || 'A company'} wants to connect with you`,
          time: 'Just now',
          unread: true,
          color: 'bg-[#0eb59a]',
        }, ...prev];
      });
    }
  }, [connectRequests]);

  // Auto-play Carousel State
  const [carouselDirection, setCarouselDirection] = useState(1);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);
  const AUTO_PLAY_INTERVAL = 3500;
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target))
        setGridOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(1);
      else setItemsPerView(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleToggleAvailability = async () => {
    const nextAvailable = !isAvailable;
    setIsAvailable(nextAvailable);

    const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
    if (isDemo) {
      if (profile) {
        setProfile({
          ...profile,
          engagement_types: {
            ...profile.engagement_types,
            availability: {
              ...profile.engagement_types?.availability,
              status: nextAvailable ? 'Available' : 'Not available'
            }
          }
        });
      }
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const currentEngagementTypes = profile?.engagement_types || {};
      const currentAvailability = currentEngagementTypes.availability || {
        status: 'Available',
        hoursPerWeek: '20',
        startDate: 'Immediate',
        timezone: 'IST (UTC+5:30)',
        preferredMode: 'Remote'
      };

      const updatedEngagementTypes = {
        ...currentEngagementTypes,
        availability: {
          ...currentAvailability,
          status: nextAvailable ? 'Available' : 'Not available'
        }
      };

      const updatedProfile = {
        ...profile,
        engagement_types: updatedEngagementTypes
      };

      const response = await fetch(`${baseUrl}/api/expert/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(updatedProfile)
      });

      if (response.ok) {
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error("Error updating availability status:", err);
    }
  };

  const sidebarMenu = [
    {
      name: 'Dashboard', icon: LayoutDashboard,
      path: '/expert-dashboard'
    },
    {
      name: 'Opportunities', icon: Briefcase,
      path: '/expert-opportunities', badge: '3'
    },
    {
      name: 'My Engagements', icon: Activity,
      path: '/expert-engagements'
    },
    {
      name: 'Contracts', icon: FileText,
      path: '/expert-contracts'
    },
    {
      name: 'Earnings', icon: IndianRupee,
      path: '/expert-earnings'
    },
    {
      name: 'Profile', icon: UserCircle,
      path: '/expert-profile'
    },
    {
      name: 'Messages', icon: MessageSquare,
      path: '/messages'
    },
    {
      name: 'Meetings', icon: Calendar,
      path: '/meetings'
    },
  ];

  const activeEngagementsCount = escrowAccounts.length > 0 ? escrowAccounts.length : 2;
  const totalEarnedStr = paymentSummary ? paymentSummary.totalSpent : '₹12.4L';
  const trendEarned = paymentSummary ? `+${paymentSummary.pendingRelease} in escrow` : '+₹3.5L this month';

  const kpis = [
    {
      title: 'Active Engagements', value: String(activeEngagementsCount), trend: '+1 this month',
      icon: Activity, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]',
      border: 'border-t-4 border-t-[#0eb59a]', numColor: 'text-[#0eb59a]',
      path: '/expert-engagements',
    },
    {
      title: 'Proposals Sent', value: '8', trend: '3 pending review',
      icon: FileText, iconBg: 'bg-[#f0fdf4]', iconColor: 'text-[#134e40]',
      border: 'border-t-4 border-t-[#134e40]', numColor: 'text-[#134e40]',
      path: '/expert-opportunities',
    },
    {
      title: 'Total Earned', value: totalEarnedStr, trend: trendEarned,
      icon: DollarSign, iconBg: 'bg-amber-50', iconColor: 'text-amber-500',
      border: 'border-t-4 border-t-amber-400', numColor: 'text-amber-500',
      path: '/expert-earnings',
    },
    {
      title: 'Profile Views', value: '234', trend: '+48 this week',
      icon: Eye, iconBg: 'bg-emerald-50', iconColor: 'text-[#0eb59a]',
      border: 'border-t-4 border-t-[#0eb59a]', numColor: 'text-[#0eb59a]',
      path: '/expert-profile',
    },
  ];

  const MOCK_RECOMMENDED_OPPORTUNITIES = [
    {
      id: 1,
      title: 'Fractional CFO',
      company: 'HealthTech Startup',
      companySize: 'Series A · 50-200 employees',
      match: 96,
      budget: '₹2L - ₹3L/mo',
      commitment: '20 hrs/wk',
      duration: '6 months',
      location: 'Remote',
      urgency: 'High',
      postedDays: 2,
      applicants: 4,
      skills: ['Financial Modeling', 'Fundraising', 'M&A'],
      logo: 'HT',
      logoColor: 'from-teal-800 to-teal-500',
    },
    {
      id: 2,
      title: 'Interim CFO',
      company: 'D2C Brand',
      companySize: 'Series B · 200-500 employees',
      match: 91,
      budget: '₹2.5L - ₹4L/mo',
      commitment: '40 hrs/wk',
      duration: '3 months',
      location: 'Hybrid | Mumbai',
      urgency: 'Immediate',
      postedDays: 1,
      applicants: 7,
      skills: ['P&L Management', 'Investor Relations', 'IPO Readiness'],
      logo: 'DC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
    },
    {
      id: 3,
      title: 'Advisory Board — Finance',
      company: 'Logistics Startup',
      companySize: 'Seed · 10-50 employees',
      match: 88,
      budget: '₹60K - ₹1L/mo',
      commitment: '8 hrs/wk',
      duration: '12 months',
      location: 'Remote',
      urgency: 'Planned',
      postedDays: 5,
      applicants: 2,
      skills: ['Supply Chain Finance', 'Working Capital'],
      logo: 'LS',
      logoColor: 'from-[#0eb59a] to-emerald-400',
    },
    {
      id: 4,
      title: 'Fractional COO',
      company: 'SaaS Scale-up',
      companySize: 'Series B · 100-300 employees',
      match: 85,
      budget: '₹1.8L - ₹2.5L/mo',
      commitment: '25 hrs/wk',
      duration: '9 months',
      location: 'Remote',
      urgency: 'High',
      postedDays: 3,
      applicants: 5,
      skills: ['Operations', 'Product Ops', 'Scaling'],
      logo: 'SS',
      logoColor: 'from-emerald-700 to-teal-400',
    },
    {
      id: 5,
      title: 'Board Advisor — Strategy',
      company: 'EdTech Platform',
      companySize: 'Series A · 50-150 employees',
      match: 82,
      budget: '₹80K - ₹1.2L/mo',
      commitment: '10 hrs/wk',
      duration: '18 months',
      location: 'Remote',
      urgency: 'Planned',
      postedDays: 7,
      applicants: 3,
      skills: ['Growth Strategy', 'Fundraising', 'Market Expansion'],
      logo: 'ET',
      logoColor: 'from-[#134e40] to-emerald-500',
    },
    {
      id: 6,
      title: 'Interim CHRO',
      company: 'Manufacturing Co.',
      companySize: 'Enterprise · 500+ employees',
      match: 79,
      budget: '₹1.5L - ₹2L/mo',
      commitment: '30 hrs/wk',
      duration: '4 months',
      location: 'Hybrid | Pune',
      urgency: 'Immediate',
      postedDays: 1,
      applicants: 9,
      skills: ['HR Transformation', 'Talent Strategy', 'Culture'],
      logo: 'MC',
      logoColor: 'from-teal-900 to-[#134e40]',
    },
  ];

  const activeEngagements = isDemo ? [
    {
      id: 1,
      title: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      status: 'IN PROGRESS',
      statusColor: 'text-[#134e40] bg-teal-50',
      progress: 65,
      nextMilestone: 'Investor Deck & Data Room',
      dueDate: 'Apr 30, 2025',
      monthlyRate: '₹3L/mo',
      path: '/expert-engagements/1',
    },
    {
      id: 2,
      title: 'Financial Due Diligence',
      company: 'TechScale Ventures',
      companyLogo: 'TV',
      logoColor: 'from-emerald-700 to-teal-500',
      status: 'ON TRACK',
      statusColor: 'text-emerald-600 bg-emerald-50',
      progress: 40,
      nextMilestone: 'Due Diligence Report',
      dueDate: 'May 15, 2025',
      monthlyRate: '₹2.5L/mo',
      path: '/expert-engagements/2',
    },
  ] : (escrowAccounts.length > 0 ? escrowAccounts.map((ea) => {
    return {
      id: ea.id,
      title: ea.engagement,
      company: ea.company || 'Acme Corp',
      companyLogo: ea.companyLogo || 'AC',
      logoColor: ea.logoColor || 'from-[#134e40] to-[#0eb59a]',
      status: ea.status === 'Active' ? 'IN PROGRESS' : ea.status.toUpperCase(),
      statusColor: ea.status === 'Active' ? 'text-[#134e40] bg-teal-50' : 'text-emerald-600 bg-emerald-50',
      progress: ea.progress !== undefined ? ea.progress : 0,
      nextMilestone: ea.pendingMilestone || 'None',
      dueDate: 'Apr 30, 2025',
      monthlyRate: ea.monthlyRate || '₹3L/mo',
      path: `/expert-engagements/${ea.id}`,
    };
  }) : []);

  const getDynamicPendingActions = () => {
    const list = [];
    escrowAccounts.forEach(ea => {
      if (ea.pendingMilestoneStatus === 'in_progress') {
        list.push({
          title: `Submit Deliverable: ${ea.pendingMilestone}`,
          project: ea.engagement,
          type: 'SUBMIT',
          time: 'Due soon',
          urgent: true,
          typeColor: 'text-amber-700 bg-amber-50 border-amber-100',
          path: `/expert-engagements/${ea.id}?tab=milestones`
        });
      } else if (ea.pendingMilestoneStatus === 'pending_approval') {
        list.push({
          title: `Milestone Deliverable Awaiting Client Approval`,
          project: ea.engagement,
          type: 'APPROVAL',
          time: 'Under review',
          urgent: false,
          typeColor: 'text-[#134e40] bg-teal-50 border-teal-100',
          path: `/expert-engagements/${ea.id}?tab=milestones`
        });
      }
    });
    return list;
  };

  const pendingActions = isDemo ? [
    {
      title: 'Submit Milestone Deliverable',
      project: 'Series B Funding Strategy',
      type: 'SUBMIT',
      time: 'Due in 3 days',
      urgent: true,
      typeColor: 'text-amber-700 bg-amber-50 border-amber-100',
      path: '/expert-engagements/1?tab=milestones',
    },
    {
      title: 'Review & Sign Contract',
      project: 'Financial Due Diligence',
      type: 'SIGN',
      time: 'Expires tomorrow',
      urgent: true,
      typeColor: 'text-red-700 bg-red-50 border-red-100',
      path: '/expert-engagements/2?tab=contracts',
    },
    {
      title: 'New Message from Acme Corp',
      project: 'Series B Funding Strategy',
      type: 'MESSAGE',
      time: '2 hours ago',
      urgent: false,
      typeColor: 'text-[#134e40] bg-teal-50 border-teal-100',
      path: '/expert-engagements/1?tab=messages',
    },
  ] : getDynamicPendingActions();

  const todaySchedule = isDemo ? [
    {
      type: 'call',
      time: '11:00 AM',
      title: 'Weekly Sync & Alignment',
      company: 'Acme Corp',
      duration: '30 min',
      color: 'bg-emerald-500',
      path: '/expert-engagements/1?tab=messages',
    },
    {
      type: 'review',
      time: '02:30 PM',
      title: 'Financial Model Review',
      company: 'TechScale Ventures',
      duration: '45 min',
      color: 'bg-[#134e40]',
      path: '/expert-engagements/2?tab=contracts',
    },
    {
      type: 'advisory',
      time: '04:00 PM',
      title: 'Q2 Strategy Briefing',
      company: 'HealthTech Startup',
      duration: '60 min',
      color: 'bg-amber-500',
      path: '/expert-opportunities/1',
    },
  ] : [];

  const performanceStats = [
    {
      label: 'Avg Response',
      value: '< 2 hrs',
      sub: 'Top 5% speed',
      icon: Clock,
      bg: 'bg-emerald-50',
      color: 'text-[#0eb59a]',
    },
    {
      label: 'Client Rating',
      value: '4.92 / 5',
      sub: '23 reviews',
      icon: Star,
      bg: 'bg-amber-50',
      color: 'text-amber-500',
    },
    {
      label: 'Completion',
      value: '98%',
      sub: 'On-time delivery',
      icon: CheckCircle,
      bg: 'bg-teal-50/50',
      color: 'text-[#134e40]',
    },
  ];

  const quickActions = [
    { label: 'Browse Roles', icon: Briefcase, bg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', path: '/expert-opportunities' },
    { label: 'My Engagements', icon: Activity, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', path: '/expert-engagements' },
    { label: 'Earnings', icon: DollarSign, bg: 'bg-teal-50/50', iconColor: 'text-[#134e40]', path: '/expert-earnings' },
    { label: 'Edit Profile', icon: UserCircle, bg: 'bg-teal-50', iconColor: 'text-teal-600', path: '/expert-profile' },
    { label: 'Messages', icon: MessageSquare, bg: 'bg-emerald-50/60', iconColor: 'text-emerald-700', path: '/expert-engagements' },
    { label: 'Reviews', icon: Star, bg: 'bg-amber-50', iconColor: 'text-amber-500', path: '/expert-profile' },
  ];

  const getNotificationColor = (type) => {
    switch (type) {
      case 'match': return 'bg-teal-500';
      case 'milestone': return 'bg-[#0eb59a]';
      case 'contract': return 'bg-[#134e40]';
      case 'payment': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const formatNotificationTime = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr.includes('ago') || timeStr.includes('day')) return timeStr;
    try {
      const date = new Date(timeStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch (e) {
      return timeStr;
    }
  };

  const handleMarkAsRead = async (notifId) => {
    const isDemo = localStorage.getItem('demo_expert') === 'true';

    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, is_read: true, unread: false } : n)
    );

    if (isDemo || typeof notifId === 'number' || notifId.length < 10) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/notifications/${notifId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error("Failed to sync read status with backend:", err);
    }
  };

  const handleAcceptInvite = async (notifId) => {
    const isDemo = localStorage.getItem('demo_expert') === 'true';

    // Optimistic UI update
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, is_read: true, unread: false, metadata: { ...n.metadata, status: 'accepted' } } : n)
    );

    if (isDemo) {
      alert("Invitation accepted! (Demo Mode - Draft contract created)");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/expert/invitations/${notifId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Invitation accepted! A draft contract has been created and is ready for your signature.");
        // Fetch fresh notifications list to capture new contract/role updates
        const notifRes = await fetch(`${baseUrl}/api/notifications?role=expert`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (notifRes.ok) {
          const freshData = await notifRes.json();
          setNotifications(freshData.filter(n => n.metadata?.targetRole !== "company"));
        }
      } else {
        const errData = await response.json();
        alert(`Failed to accept invitation: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error accepting invitation:", err);
      alert("Error accepting invitation. Please try again.");
    }
  };

  const handleDeclineInvite = async (notifId) => {
    const isDemo = localStorage.getItem('demo_expert') === 'true';

    // Optimistic UI update
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, is_read: true, unread: false, metadata: { ...n.metadata, status: 'declined' } } : n)
    );

    if (isDemo) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/expert/invitations/${notifId}/decline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error(`Failed to decline invitation: ${errData.error}`);
      }
    } catch (err) {
      console.error("Error declining invitation:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const isDemo = localStorage.getItem('demo_expert') === 'true';

    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true, unread: false }))
    );

    if (isDemo) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error("Failed to sync mark all read with backend:", err);
    }
  };

  const handleAcceptConnect = (requestId, expertId) => {
    try {
      // Update connection status to connected
      const connections = JSON.parse(localStorage.getItem('cxo_connections') || '{}');
      connections[String(expertId)] = 'connected';
      localStorage.setItem('cxo_connections', JSON.stringify(connections));

      // Update request status
      const requests = JSON.parse(localStorage.getItem('cxo_connect_requests') || '[]');
      const updated = requests.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r);
      localStorage.setItem('cxo_connect_requests', JSON.stringify(updated));

      // Remove from state
      setConnectRequests(prev => prev.filter(r => r.id !== requestId));

      // Add notification
      setNotifications(prev => [{
        id: String(Date.now()),
        title: 'Connection Accepted',
        desc: 'You are now connected with Acme Corp',
        time: 'Just now',
        unread: true,
        color: 'bg-[#0eb59a]',
      }, ...prev]);
    } catch { }
  };

  const handleDeclineConnect = (requestId) => {
    try {
      const requests = JSON.parse(localStorage.getItem('cxo_connect_requests') || '[]');
      const updated = requests.map(r => r.id === requestId ? { ...r, status: 'declined' } : r);
      localStorage.setItem('cxo_connect_requests', JSON.stringify(updated));
      setConnectRequests(prev => prev.filter(r => r.id !== requestId));
    } catch { }
  };

  useEffect(() => {
    let isMounted = true;
    let channel;

    const isDemo = localStorage.getItem('demo_expert') === 'true';
    if (isDemo) return;

    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMounted) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/notifications?role=expert`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok && isMounted) {
          const data = await response.json();
          const filtered = data.filter(n => n.metadata?.targetRole !== "company");
          setNotifications(filtered);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    const setupSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user || !isMounted) return;

      // Use a unique channel name per mount to prevent caching conflicts in Strict Mode
      const channelName = `expert-notifications-${session.user.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            if (isMounted) {
              const notif = payload.new;
              if (notif.metadata?.targetRole !== "company") {
                setNotifications(prev => [notif, ...prev]);
              }
            }
          }
        );

      channel.subscribe((status) => {
        console.log(`Notification channel status:`, status);
      });
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const profileStrength = profile ? Math.round((
    [
      profile.full_name,
      profile.headline,
      profile.primary_domain,
      profile.years_experience,
      profile.current_role,
      profile.key_skills,
      profile.services_offered,
      profile.hourly_rate,
      profile.profile_url,
      profile.resume_url,
      profile.phone
    ].filter(Boolean).length / 11
  ) * 100) : 78;

  const profileTips = [
    { label: 'Basic info complete', done: !!(profile?.full_name && profile?.headline) },
    { label: 'Work experience added', done: !!(profile?.years_experience || profile?.current_role) },
    { label: 'Skills added', done: !!profile?.key_skills },
    { label: 'Rate card set', done: !!profile?.hourly_rate },
    { label: 'Resume uploaded', done: !!profile?.resume_url },
  ];

  const canGoLeft = opportunityCarouselIndex > 0;
  const canGoRight = opportunityCarouselIndex < recommendedOpportunities.length - itemsPerView;

  const handleManualNav = (index) => {
    const maxIndex = Math.max(0, recommendedOpportunities.length - itemsPerView);
    const clampedIndex = Math.min(Math.max(0, index), maxIndex);
    setOpportunityCarouselIndex(clampedIndex);
    setAutoPlayProgress(0);
  };

  // Autoplay and Progress Timer Effect
  useEffect(() => {
    if (isCarouselHovered) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    const startTime = Date.now() - (autoPlayProgress / 100) * AUTO_PLAY_INTERVAL;

    autoPlayRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / AUTO_PLAY_INTERVAL) * 100);

      setAutoPlayProgress(pct);

      if (pct >= 100) {
        const maxIndex = Math.max(0, recommendedOpportunities.length - itemsPerView);
        let nextIndex = opportunityCarouselIndex + carouselDirection;

        if (nextIndex > maxIndex) {
          nextIndex = Math.max(0, maxIndex - 1);
          setCarouselDirection(-1);
        } else if (nextIndex < 0) {
          nextIndex = Math.min(maxIndex, 1);
          setCarouselDirection(1);
        }

        setOpportunityCarouselIndex(Math.max(0, Math.min(maxIndex, nextIndex)));
        setAutoPlayProgress(0);
      }
    }, 16);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isCarouselHovered, opportunityCarouselIndex, carouselDirection, itemsPerView, autoPlayProgress, recommendedOpportunities.length]);

  const nextOpportunity = () => {
    if (canGoRight) {
      handleManualNav(opportunityCarouselIndex + 1);
    }
  };

  const prevOpportunity = () => {
    if (canGoLeft) {
      handleManualNav(opportunityCarouselIndex - 1);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f5] dark:bg-[#0f1117] font-sans text-slate-900 dark:text-gray-100 overflow-hidden">

      {/* ── MOBILE BACKDROP ── */}
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
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 dark:border-white/10 justify-between">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer shrink-0" onClick={() => window.location.reload()}>
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

        {/* NAV */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {sidebarMenu.map((item) => {
            const isActive = activeMenu === item.name;
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveMenu(item.name);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer text-center ${isActive
                  ? 'bg-[#134e40] text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavExpert"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
                  />
                )}
                <div className="relative shrink-0">
                  <item.icon size={17} />
                  {item.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#0eb59a] text-white text-[8px] font-black rounded-full flex items-center justify-center text-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <motion.span
                  animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
                >
                  {item.name}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Separated Settings option pinned to the bottom */}
        <div className="p-3 border-t border-gray-50 dark:border-white/5 space-y-1">
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
            onClick={() => {
              setActiveMenu('Settings');
              navigate('/expert-settings');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer text-center ${activeMenu === 'Settings' || window.location.pathname === '/expert-settings'
              ? 'bg-[#134e40] text-white shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]'
              }`}
          >
            {(activeMenu === 'Settings' || window.location.pathname === '/expert-settings') && (
              <motion.div
                layoutId="activeNavExpert"
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
              const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
              if (isDemo) {
                localStorage.removeItem('demo_expert');
                localStorage.removeItem('sb-mock-auth');
              } else {
                await supabase.auth.signOut();
              }
              navigate('/signin?role=expert');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all duration-150 font-bold"
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

      {/* ══ MAIN CONTENT WRAPPER ══ */}
      <div
        className="flex flex-col min-h-screen overflow-x-hidden flex-grow bg-[#f4f7f5] dark:bg-[#0f1117]"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── HEADER ── */}
        <header className="h-16 bg-white dark:bg-[#1b1d24] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          {/* Left spacer / mobile toggle */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all shrink-0 cursor-pointer text-center justify-center flex"
              >
                <Menu size={20} />
              </motion.button>
            )}
          </div>

          {/* Center search */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'
                }`} />
              <input
                type="text"
                placeholder="Search opportunities, companies, skills..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border rounded-full text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-white/10 focus:outline-none transition-all duration-200 ${searchFocused
                  ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20'
                  : 'border-gray-200 dark:border-white/10'
                  }`}
              />
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Browse Roles CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/expert-opportunities')}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-full shadow-md overflow-hidden relative group transition-colors duration-200 cursor-pointer text-center"
            >
              <Briefcase size={14} />
              Browse Roles
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </motion.button>

            {/* Grid quick-nav dropdown ── */}
            <div className="relative" ref={gridRef}>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { setGridOpen(!gridOpen); setShowNotifications(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer text-center ${gridOpen
                  ? 'bg-teal-50 border-[#0eb59a] text-[#134e40]'
                  : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'
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
                    className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-[#1e2028] rounded-2xl z-50 overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl"
                    style={{
                      boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                      border: '1px solid #F1F5F2'
                    }}
                  >
                    <div className="p-3 space-y-1">
                      {[
                        { icon: Briefcase, label: 'Opportunities', badge: '3 new', badgeStyle: 'text-teal-700 bg-teal-50 border-teal-200', border: '#0eb59a', path: '/expert-opportunities' },
                        { icon: Activity, label: 'My Engagements', badge: '2 active', badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200', border: '#0eb59a', path: '/expert-engagements' },
                        { icon: FileText, label: 'Contracts', badge: '1 pending', badgeStyle: 'text-amber-700 bg-amber-50 border-amber-200', border: '#F59E0B', path: '/expert-contracts' },
                        { icon: DollarSign, label: 'Earnings', badge: '₹3.5L pending', badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200', border: '#0eb59a', path: '/expert-earnings' },
                        { icon: UserCircle, label: 'Profile', badge: '78% complete', badgeStyle: 'text-teal-700 bg-teal-50 border-teal-200', border: '#0eb59a', path: '/expert-profile' },
                        { icon: Settings, label: 'Settings', badge: 'Preferences', badgeStyle: 'text-gray-600 bg-gray-50 border-gray-200', border: '#9CA3AF', path: '/expert-settings' },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { navigate(item.path); setGridOpen(false); }}
                          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-center hover:bg-gray-50 dark:hover:bg-white/5"
                          style={{ borderLeft: `3px solid ${item.border}` }}
                        >
                          <div className="w-7 h-7 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                            <item.icon size={13} className="text-[#134e40]" />
                          </div>
                          <span className="flex-1 text-sm font-bold text-[#1C3627] dark:text-white text-left">
                            {item.label}
                          </span>
                          <div className="w-px h-4 bg-gray-100 shrink-0" />
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 text-left ${item.badgeStyle}`}>
                            {item.badge}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bell Notification Dropdown */}
            <div className="relative">
              <motion.button
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 4, repeat: Infinity, repeatDelay: 10 }}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { setShowNotifications(!showNotifications); setGridOpen(false); }}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer text-center ${showNotifications
                  ? 'bg-teal-50 border-[#0eb59a]'
                  : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'
                  }`}
              >
                <Bell size={16} className={showNotifications ? 'text-[#134e40]' : 'text-gray-500'} />
                {notifications.filter(n => n.unread ?? !n.is_read).length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5 animate-pulse text-center"
                  >
                    {notifications.filter(n => n.unread ?? !n.is_read).length}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)} className="fixed inset-0 z-40" />
                    <motion.div
                      initial={{ opacity: 0, x: '100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '100%' }}
                      transition={{ duration: 0.3, type: 'tween' }}
                      className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-[#1e2028] shadow-2xl border-l border-gray-100 dark:border-white/10 z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-teal-50/50 dark:from-teal-900/10 to-white dark:to-[#1e2028]">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm text-left">Notifications</h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleMarkAllRead}
                          className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer text-center justify-center flex"
                        >
                          Mark all read
                        </motion.button>
                      </div>
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-xs font-medium">No notifications yet</div>
                        ) : (
                          notifications.map((notif, idx) => {
                            const isUnread = notif.unread ?? !notif.is_read;
                            const descText = notif.desc || notif.description;
                            const timeText = formatNotificationTime(notif.time || notif.created_at);
                            const dotColor = notif.color || getNotificationColor(notif.type);
                            return (
                              <motion.div key={notif.id || idx}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleMarkAsRead(notif.id)}
                                className={`px-5 py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex gap-3 transition-colors ${isUnread ? 'bg-teal-50/20 dark:bg-teal-950/20' : ''
                                  }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />
                                <div className="flex-1 min-w-0 text-left">
                                  <p className="text-sm font-bold text-[#1C3627] dark:text-white leading-tight text-left">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed text-left font-medium">
                                    {descText}
                                  </p>
                                  {notif.metadata?.note && (
                                    <p className="text-[11px] bg-gray-50 border border-gray-100 rounded-xl p-2.5 mt-1.5 italic text-gray-600 dark:text-gray-400">
                                      "{notif.metadata.note}"
                                    </p>
                                  )}

                                  {/* Action buttons or status badges */}
                                  {(notif.title === "New Opportunity Invitation" || notif.type === "match") && (
                                    <div className="mt-2.5 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                      {notif.metadata?.status === "accepted" ? (
                                        <span className="text-[10px] font-black tracking-wider uppercase bg-teal-50 text-[#0eb59a] border border-teal-100 px-2.5 py-0.5 rounded-md">
                                          ✓ Accepted
                                        </span>
                                      ) : notif.metadata?.status === "declined" ? (
                                        <span className="text-[10px] font-black tracking-wider uppercase bg-red-50 text-red-500 border border-red-100 px-2.5 py-0.5 rounded-md">
                                          ✗ Declined
                                        </span>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => handleAcceptInvite(notif.id)}
                                            className="px-3 py-1 rounded-lg bg-[#0eb59a] hover:bg-[#134e40] text-white text-[10px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer border-0"
                                          >
                                            Accept
                                          </button>
                                          <button
                                            onClick={() => handleDeclineInvite(notif.id)}
                                            className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-extrabold active:scale-95 transition-all bg-white dark:bg-white/5 cursor-pointer"
                                          >
                                            Decline
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  <p className="text-[10px] text-gray-300 font-semibold mt-1 text-left">
                                    {timeText}
                                  </p>
                                </div>
                                {isUnread && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />
                                )}
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar with Online Indicator */}
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
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f5] dark:bg-[#0f1117] [&::-webkit-scrollbar]:hidden relative">

          {/* ── HERO BANNER ── */}
          <div className="relative overflow-hidden border-b border-teal-100/60 dark:border-white/5 dark:bg-[#161a20]">
            <div
              className="absolute inset-0 dark:hidden"
              style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5f1 50%, #f8fafc 100%)' }}
            />
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(14,181,154,0.15) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute top-0 right-0 w-64 h-32 bg-[#0eb59a]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-20 bg-[#134e40]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 text-left">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

                {/* Verified badge row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}>
                        <Star size={12} fill="#FBBF24" className="text-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-[#0eb59a]/30 rounded-full px-3 py-1 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] animate-pulse" />
                    <span className="text-[10px] font-black text-[#134e40] uppercase tracking-[0.15em]">
                      Verified Expert · Top 5%
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium hidden sm:block">
                    Member since Jan 2024
                  </span>
                </div>

                <h1 style={{ fontFamily: 'Georgia, serif' }}
                  className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2 text-left"
                >
                  Welcome,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#134e40] to-[#0eb59a]">
                    {profile?.full_name?.split(' ')[0] || 'Expert'}.
                  </span>
                </h1>

                <p className="text-slate-500 dark:text-gray-400 text-base mt-2 font-medium leading-relaxed text-left">
                  You have{' '}
                  <span className="text-amber-500 font-black">
                    3 pending actions
                  </span>
                  {' '}and{' '}
                  <span className="text-[#134e40] font-black">
                    3 new role matches
                  </span>
                  {' '}waiting. Your profile was viewed{' '}
                  <span className="text-[#0eb59a] font-black">
                    12 times today.
                  </span>
                </p>

                {/* Context Bar */}
                <div className="flex items-center gap-3 mt-4 flex-wrap text-left">
                  {[
                    {
                      icon: Clock, label: '3 meetings today',
                      color: 'text-[#134e40] bg-[#f0fdf4] border-[#0eb59a]/20'
                    },
                    {
                      icon: MessageSquare, label: '3 unread messages',
                      color: 'text-[#134e40] bg-teal-50 border-teal-100'
                    },
                    {
                      icon: Target, label: '1 deadline this week',
                      color: 'text-amber-600 bg-amber-50 border-amber-100'
                    },
                    {
                      icon: Eye, label: '12 profile views today',
                      color: 'text-emerald-700 bg-emerald-50 border-emerald-100'
                    },
                  ].map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold ${item.color}`}
                    >
                      <item.icon size={11} />
                      {item.label}
                    </motion.div>
                  ))}
                </div>

                {/* Availability Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleToggleAvailability}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 text-xs font-black transition-all duration-300 cursor-pointer text-center ${isAvailable
                      ? 'bg-[#f0fdf4] border-[#0eb59a] text-[#134e40]'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-colors ${isAvailable
                      ? 'bg-[#0eb59a] animate-pulse'
                      : 'bg-gray-400'
                      }`} />
                    {isAvailable ? '🟢 Available for New Projects' : '⏸ Not Available'}
                  </motion.button>
                  <span className="text-[11px] text-gray-400 font-medium">
                    Click to update your availability status
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7 pb-24">

            {/* ── [1] KPI CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {kpis.map((kpi, idx) => {
                const accentColor = kpi.numColor.includes('amber')
                  ? '#f59e0b'
                  : kpi.numColor.includes('teal')
                    ? '#a855f7'
                    : kpi.numColor.includes('134e40')
                      ? '#134e40'
                      : '#0eb59a';

                return (
                  <MagneticCard
                    key={idx}
                    onClick={() => navigate(kpi.path)}
                    style={{ borderTopColor: accentColor }}
                    className="bg-white dark:bg-[#1e2028] rounded-2xl p-5 sm:p-6 border border-gray-100 border-t-[5px] cursor-pointer relative group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 overflow-hidden flex flex-col items-center justify-center text-center min-h-[180px]"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[5px] rounded-t-2xl opacity-100"
                      style={{ background: accentColor }}
                    />
                    <div className="absolute inset-0 opacity-[0.02] rounded-2xl"
                      style={{ background: kpi.numColor.includes('amber') ? '#f59e0b' : '#0eb59a' }}
                    />
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-[0.06]"
                      style={{ background: '#0eb59a' }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="flex flex-col items-center w-full"
                      >
                        <div className={`w-10 h-10 ${kpi.iconBg} rounded-full flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                          <kpi.icon size={18} className={kpi.iconColor} />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest leading-tight mb-1">{kpi.title}</span>
                        <p className={`text-3xl sm:text-4xl font-black mb-2 tracking-tight ${kpi.numColor}`}>
                          {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                        </p>
                        <div className="flex flex-col items-center gap-1.5 mt-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                            <ArrowUpRight size={9} /> {kpi.trend}
                          </div>
                          <svg viewBox="0 0 60 20" className="w-14 h-4 mt-1 opacity-50">
                            <polyline
                              points="0,15 10,12 20,14 30,8 40,10 50,5 60,7"
                              fill="none"
                              stroke="#0eb59a"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </MagneticCard>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#0eb59a]/20 to-transparent" />

            {/* ── [2] TODAY'S SCHEDULE ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden relative"
            >
              <div
                className="absolute inset-0 opacity-[0.015]"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0eb59a, transparent 50%), radial-gradient(circle at 80% 50%, #134e40, transparent 50%)' }}
              />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#134e40] via-[#0eb59a] to-transparent" />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#f0fdf4] rounded-xl flex items-center justify-center">
                    <Clock size={14} className="text-[#134e40]" />
                  </div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    Today's Schedule
                  </h3>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {todaySchedule.length} events
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/expert-engagements')}
                  className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer text-center justify-center flex animate-pulse"
                >
                  View Calendar →
                </motion.button>
              </div>

              <div className="flex items-stretch gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden relative z-10">
                {todaySchedule.map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(19,78,64,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(event.path)}
                    className="flex items-center gap-3 bg-[#FAFBF9] dark:!bg-[#252830] border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 cursor-pointer min-w-[220px] group hover:border-[#0eb59a]/30 transition-all"
                  >
                    <div className={`w-1.5 self-stretch rounded-full ${event.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-wider"
                        style={{
                          color: event.type === 'call'
                            ? '#0eb59a'
                            : event.type === 'review'
                              ? '#134e40'
                              : '#f59e0b'
                        }}
                      >
                        {event.time}
                      </p>
                      <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#134e40] dark:group-hover:text-[#0eb59a] transition-colors leading-tight mt-0.5">{event.title}</p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{event.company}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:!bg-white/10 px-2 py-0.5 rounded-lg">
                        {event.duration}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Add empty state / join now CTA */}
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/expert-engagements')}
                  className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-w-[160px] cursor-pointer hover:border-[#0eb59a]/40 transition-all group"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-1 group-hover:bg-[#f0fdf4] transition-colors">
                      <Plus size={14} className="text-gray-300 group-hover:text-[#0eb59a] transition-colors" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 group-hover:text-[#134e40] transition-colors">
                      Schedule meeting
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ── [3] QUICK ACTIONS STRIP ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 md:grid-cols-6 gap-3"
            >
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.30 + idx * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 16px 40px rgba(19,78,64,0.1)',
                    borderColor: 'rgba(14,181,154,0.4)'
                  }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => navigate(action.path)}
                  className="relative group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 cursor-pointer transition-all duration-200 shadow-sm text-center overflow-hidden"
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <action.icon size={20} className={action.iconColor} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#134e40] text-center leading-tight transition-colors">
                    {action.label}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#134e40] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    {action.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#134e40]" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── [4] ZONE 1 — Middle row (60/40 split) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* LEFT 60% — Opportunities carousel */}
              <div className="lg:col-span-3">
                <div
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={() => setIsCarouselHovered(false)}
                  className="bg-[#FAFBF9] dark:!bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Zap size={16} fill="#0eb59a" className="text-[#0eb59a]" />
                        </motion.div>
                        Matched Opportunities
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">
                        {recommendedOpportunities.length} roles matched to your expertise
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: opportunityCarouselIndex > 0 ? 1.1 : 1 }}
                        whileTap={{ scale: opportunityCarouselIndex > 0 ? 0.9 : 1 }}
                        onClick={() => handleManualNav(
                          opportunityCarouselIndex - 1 < 0
                            ? recommendedOpportunities.length - itemsPerView
                            : opportunityCarouselIndex - 1
                        )}
                        disabled={opportunityCarouselIndex === 0}
                        className={`w-8 h-8 rounded-full border bg-white dark:bg-[#1e2028] shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200 text-center cursor-pointer dark:border-white/10 ${opportunityCarouselIndex > 0
                          ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md'
                          : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                          }`}
                      >
                        <ChevronLeft size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: opportunityCarouselIndex + itemsPerView < recommendedOpportunities.length ? 1.1 : 1 }}
                        whileTap={{ scale: opportunityCarouselIndex + itemsPerView < recommendedOpportunities.length ? 0.9 : 1 }}
                        onClick={() => handleManualNav(
                          opportunityCarouselIndex + itemsPerView >= recommendedOpportunities.length
                            ? 0 : opportunityCarouselIndex + 1
                        )}
                        disabled={opportunityCarouselIndex + itemsPerView >= recommendedOpportunities.length}
                        className={`w-8 h-8 rounded-full border bg-white dark:bg-[#1e2028] shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200 text-center cursor-pointer dark:border-white/10 ${opportunityCarouselIndex + itemsPerView < recommendedOpportunities.length
                          ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md'
                          : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                          }`}
                      >
                        <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="overflow-hidden w-full">
                    <AnimatePresence mode="wait" custom={carouselDirection}>
                      <motion.div
                        key={opportunityCarouselIndex}
                        custom={carouselDirection}
                        initial={{ opacity: 0, x: carouselDirection > 0 ? 60 : -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: carouselDirection > 0 ? -60 : 60 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex gap-4"
                      >
                        {recommendedOpportunities
                          .slice(opportunityCarouselIndex, opportunityCarouselIndex + itemsPerView)
                          .map((opp, idx) => (
                            <motion.div
                              key={opp.id}
                              whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(19,78,64,0.12)' }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                              style={{
                                width: 'calc(50% - 8px)',
                                minWidth: '260px',
                                minHeight: '440px',
                                flexShrink: 0
                              }}
                              className="bg-white dark:!bg-[#252830] rounded-2xl border-2 border-[#0eb59a]/15 p-6 hover:border-[#0eb59a]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden text-center flex flex-col items-center justify-between"
                            >
                              {/* Top accent on hover */}
                              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                              {opp.postedDays <= 2 && (
                                <div className="absolute top-3 right-3">
                                  <span className="text-[8px] font-black bg-[#0eb59a] text-white px-1.5 py-0.5 rounded-full animate-pulse">
                                    NEW
                                  </span>
                                </div>
                              )}

                              {/* Urgency pill centered */}
                              <div className="mb-3">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${opp.urgency === 'Immediate'
                                  ? 'bg-red-50 text-red-600 border border-red-100'
                                  : opp.urgency === 'High'
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                                  }`}>
                                  {opp.urgency}
                                </span>
                              </div>

                              {/* Centered Logo Section */}
                              <div className="flex flex-col items-center gap-2 mb-3">
                                <motion.div
                                  whileHover={{ rotate: 5 }}
                                  className={`w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-md shrink-0`}
                                >
                                  {opp.logoUrl ? (
                                    <img src={opp.logoUrl} alt={opp.company} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-white font-black text-lg">
                                      {opp.logo}
                                    </span>
                                  )}
                                </motion.div>
                                <div className="flex flex-col items-center gap-1 mt-1">
                                  <span
                                    style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
                                    className="text-[10px] font-black text-white px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide"
                                  >
                                    {opp.match}% Match
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-lg">
                                    {opp.duration}
                                  </span>
                                </div>
                              </div>

                              {/* Title centered with slightly larger font */}
                              <h3 className="font-black text-gray-900 dark:text-white text-sm sm:text-base leading-tight mb-1 text-center group-hover:text-[#134e40] dark:group-hover:text-[#0eb59a] transition-colors line-clamp-2">
                                {opp.title}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-bold mb-0.5 text-center">
                                {opp.company}
                              </p>
                              <p className="text-[10px] text-gray-400 mb-4 text-center">
                                {opp.companySize}
                              </p>

                              {/* Info rows inside centered box */}
                              <div className="flex flex-col mb-4 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:!bg-[#1e2028] overflow-hidden w-full text-center shadow-sm">
                                <div className="text-xs px-3 py-2 flex flex-col items-center">
                                  <span className="text-[9px] text-gray-400 font-black tracking-wider uppercase mb-0.5">Budget</span>
                                  <span className="font-black text-[#134e40] text-xs flex items-center gap-1"><DollarSign size={10} className="text-[#0eb59a]" /> {opp.budget}</span>
                                </div>
                                <div className="text-xs px-3 py-2 flex flex-col items-center border-t border-gray-50 dark:border-white/5">
                                  <span className="text-[9px] text-gray-400 font-black tracking-wider uppercase mb-0.5">Commitment</span>
                                  <span className="font-black text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1"><Clock size={10} /> {opp.commitment}</span>
                                </div>
                                <div className="text-xs px-3 py-2 flex flex-col items-center border-t border-gray-50 dark:border-white/5">
                                  <span className="text-[9px] text-gray-400 font-black tracking-wider uppercase mb-0.5">Location</span>
                                  <span className="font-black text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1"><MapPin size={10} /> {opp.location}</span>
                                </div>
                              </div>

                              {/* Centered skill tags */}
                              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                                {opp.skills.slice(0, 2).map((skill, i) => (
                                  <span key={i}
                                    className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-[#f0fdf4] dark:!bg-white/5 text-[#134e40] dark:text-[#0eb59a] border border-[#0eb59a]/20 dark:border-white/10"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {opp.skills.length > 2 && (
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-gray-100 text-gray-400">
                                    +{opp.skills.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* Centered social proof */}
                              <p className="text-[11px] text-gray-400 font-medium mb-4 text-center">
                                {opp.applicants} applied · {opp.postedDate ? `Posted ${opp.postedDate}` : `Posted ${opp.postedDays}d ago`}
                              </p>

                              {/* Centered CTAs */}
                              <div className="flex items-center gap-2 w-full mt-auto">
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/expert-opportunities/${opp.id}`);
                                  }}
                                  className="flex-1 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-[11px] font-black rounded-xl transition-all shadow-sm text-center cursor-pointer justify-center flex"
                                >
                                  Apply Now
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/expert-opportunities/${opp.id}`);
                                  }}
                                  className="px-4 py-2.5 border-2 border-gray-300 dark:border-white/10 rounded-xl text-[11px] font-black text-gray-700 dark:text-gray-300 hover:border-[#0eb59a] hover:text-[#0eb59a] hover:bg-[#f0fdf4] dark:hover:bg-[#0eb59a]/10 transition-all cursor-pointer text-center justify-center flex"
                                >
                                  Details
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dot indicators + progress bar */}
                  <div className="flex flex-col items-center gap-2 mt-5">
                    <div className="flex gap-1.5">
                      {Array.from({ length: recommendedOpportunities.length - itemsPerView + 1 }).map((_, i) => (
                        <motion.button key={i}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleManualNav(i)}
                          className={`rounded-full transition-all duration-200 cursor-pointer text-center ${opportunityCarouselIndex === i
                            ? 'w-5 h-2.5 bg-[#0eb59a]'
                            : 'w-2.5 h-2.5 bg-gray-200 dark:bg-white/20 hover:bg-gray-300 dark:hover:bg-white/30'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="h-4 flex items-center justify-center">
                      {isCarouselHovered ? (
                        <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase">Paused</span>
                      ) : (
                        <div className="bg-gray-100 dark:bg-white/10 rounded-full w-40 h-0.5 overflow-hidden">
                          <div
                            className="bg-[#0eb59a] rounded-full h-full"
                            style={{ width: `${autoPlayProgress}%`, transition: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                    <motion.a
                      onClick={() => navigate('/expert-opportunities')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-sm text-[#0eb59a] font-bold hover:text-[#134e40] transition-colors cursor-pointer mt-1 text-center"
                    >
                      View All Opportunities →
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* RIGHT 40% — Pending Actions with more room */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:!bg-[#1e2028] rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full relative">
                  {/* Header (with count badge + wobble animation) */}
                  <div className="p-5 border-b border-gray-50 dark:border-white/5 bg-gradient-to-b from-amber-50/40 dark:from-amber-500/5 to-white dark:to-[#1e2028] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 6, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
                      >
                        <AlertCircle size={16} className="text-amber-500" />
                      </motion.div>
                      <div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">
                          Pending Actions
                        </h2>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {pendingActions.length} items need attention
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      >
                        {pendingActions.length}
                      </motion.span>
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse ml-1 inline-block" />
                    </div>
                  </div>

                  <div className="flex-1 p-2 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {pendingActions.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 text-xs font-semibold flex flex-col items-center justify-center">
                        <CheckCircle size={24} className="text-[#0eb59a] mb-2" />
                        No Pending Actions
                      </div>
                    ) : (
                      pendingActions.map((action, idx) => {
                        const leftBorder = action.type === 'SIGN'
                          ? 'border-l-red-400'
                          : action.urgent
                            ? 'border-l-amber-400'
                            : 'border-l-[#0eb59a]';

                        const actionLabel = {
                          'SUBMIT': 'Submit Deliverable',
                          'SIGN': 'Sign Contract',
                          'MESSAGE': 'Open Message',
                          'APPROVAL': 'Review Now',
                          'REVIEW': 'Review',
                          'ESCROW': 'Release Escrow',
                          'MEETING': 'Join Meeting',
                          'RISK': 'View Risk',
                        }[action.type] || 'Take Action';

                        return (
                          <motion.div key={idx}
                            whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => navigate(action.path)}
                            className={`p-5 mx-4 my-2.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/30 dark:!bg-white/5 border-l-4 ${leftBorder} hover:border-[#0eb59a]/20 transition-all cursor-pointer group`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md text-left ${action.typeColor}`}>
                                {action.type}
                              </span>
                              <span className="text-xs text-gray-500 font-bold tracking-wide flex items-center gap-1">
                                <Clock size={8} /> {action.time}
                              </span>
                            </div>
                            <h4 className="font-black text-gray-700 dark:text-gray-200 text-sm mb-1 group-hover:text-gray-900 dark:group-hover:text-white leading-snug">
                              {action.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                              <Briefcase size={8} /> {action.project}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(action.path);
                              }}
                              className="w-full py-2 bg-gray-50 dark:!bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-[#134e40] hover:text-white hover:border-[#134e40] transition-all duration-200 shadow-sm text-center cursor-pointer justify-center flex"
                            >
                              {actionLabel}
                            </motion.button>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* ── [5] ZONE 2 — Bottom row (5-column layout) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* LEFT 3/5 (lg:col-span-3) — Stacked Active Engagements + Performance Snapshot */}
              <div className="lg:col-span-3 flex flex-col gap-6">

                {/* Active Engagements */}
                <div className="bg-white dark:!bg-[#1e2028] rounded-3xl border border-gray-100 p-6 shadow-sm relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Activity size={16} className="text-[#0eb59a]" /> Active Engagements
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] text-gray-400 font-medium italic">Live · updating</span>
                    </div>
                  </div>

                  {activeEngagements.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-[#f8fafc]/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                      <Activity size={32} className="text-[#0eb59a] mb-2 animate-pulse" />
                      <h3 className="font-black text-gray-800 text-sm">No Active Engagements</h3>
                      <p className="text-gray-400 text-xs max-w-xs mt-1">Once a client signs a contract, your active engagement and milestones will appear here.</p>
                      <button onClick={() => navigate('/expert-opportunities')} className="mt-4 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all cursor-pointer">
                        Find Opportunities
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeEngagements.map((eng, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(19,78,64,0.06)' }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => navigate(eng.path)}
                          className="bg-[#FAFBF9] dark:!bg-[#252830] rounded-2xl border border-gray-200 dark:border-white/10 p-6 hover:border-[#0eb59a]/30 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
                        >
                          {/* Hover accent */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Header row */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${eng.logoColor || 'from-[#134e40] to-[#0eb59a]'} flex items-center justify-center shadow-sm shrink-0`}>
                                <span className="text-white font-black text-xs">
                                  {eng.companyLogo}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-xs group-hover:text-[#134e40] dark:group-hover:text-[#0eb59a] transition-colors leading-tight">{eng.title}</h4>
                                <p className="text-[11px] text-gray-400 font-medium mb-2">{eng.company}</p>
                              </div>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-1 rounded-full text-left ${eng.statusColor}`}>
                              {eng.status}
                            </span>
                          </div>

                          {/* Milestone + rate info */}
                          <div className="flex items-center justify-between mb-3 p-2.5 bg-[#f0fdf4] dark:!bg-white/5 rounded-xl border border-[#0eb59a]/10 dark:border-white/10">
                            <div>
                              <p className="text-[8px] text-gray-400 font-black uppercase tracking-wider text-left">Next Milestone</p>
                              <p className="text-[11px] font-black text-[#134e40] leading-tight mt-0.5 max-w-[110px] truncate text-left"
                                title={eng.nextMilestone}
                              >
                                {eng.nextMilestone}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] text-gray-400 font-black uppercase tracking-wider text-left">Monthly Rate</p>
                              <p className="text-[11px] font-black text-[#0eb59a] mt-0.5 text-left">{eng.monthlyRate}</p>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mb-1">
                            <div className="flex justify-between text-[11px] mb-1.5">
                              <span className="text-gray-400 font-bold">Progress</span>
                              <span className="font-black text-[#134e40]">{eng.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${eng.progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                style={{ background: 'linear-gradient(90deg, #134e40, #0eb59a)' }}
                                className="h-full rounded-full relative overflow-hidden"
                              >
                                <motion.div
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                />
                              </motion.div>
                            </div>
                          </div>

                          {/* Due date */}
                          <div className="flex items-center gap-1 mb-4 text-[11px] text-gray-400 font-medium">
                            <Clock size={9} /> Due: {eng.dueDate}
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(eng.path);
                              }}
                              className="flex-1 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-[11px] font-black rounded-xl transition-all shadow-sm text-center cursor-pointer justify-center flex animate-none bg-none border-0"
                            >
                              Open Workspace
                            </motion.button>

                            <div className="flex flex-col items-center gap-0.5">
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                title="Send Message"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`${eng.path}?tab=messages`);
                                }}
                                className="w-9 h-9 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#0eb59a] hover:bg-[#f0fdf4] dark:hover:bg-[#0eb59a]/10 transition-all flex items-center justify-center cursor-pointer shrink-0 text-center bg-transparent shadow-none"
                              >
                                <MessageSquare size={13} className="text-gray-400" />
                              </motion.button>
                              <span className="text-[8px] text-gray-300 font-bold">Msg</span>
                            </div>

                            <div className="flex flex-col items-center gap-0.5">
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                title="View Milestone"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`${eng.path}?tab=milestones`);
                                }}
                                className="w-9 h-9 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all flex items-center justify-center cursor-pointer shrink-0 text-center bg-transparent shadow-none"
                              >
                                <Target size={13} className="text-gray-400" />
                              </motion.button>
                              <span className="text-[8px] text-gray-300 font-bold">Task</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Performance Snapshot */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white dark:!bg-[#1e2028] rounded-3xl border border-gray-100 p-6 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#134e40] via-[#0eb59a] to-transparent" />

                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp size={16} className="text-[#0eb59a]" />
                        Your Performance
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                        Based on your last 90 days
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/expert-analytics')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer text-center"
                    >
                      Full Analytics →
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {performanceStats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/expert-analytics')}
                        className="flex flex-col gap-2 p-4 bg-[#FAFBF9] dark:!bg-[#252830] rounded-2xl border border-gray-100 dark:border-white/10 cursor-pointer hover:border-[#0eb59a]/30 transition-all"
                      >
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                          <stat.icon size={18} className={stat.color} />
                        </div>
                        <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                        <div>
                          <p className="text-[11px] font-black text-gray-700 dark:text-gray-300">{stat.label}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{stat.sub}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* RIGHT 2/5 (lg:col-span-2) — Stacked Profile Strength + Earnings stacked */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* CONNECTION REQUESTS */}
                {connectRequests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 }}
                    className="bg-white dark:!bg-[#1e2028] rounded-3xl border border-gray-100 p-5 shadow-sm relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <UserPlus size={16} className="text-[#0eb59a]" />
                        </motion.div>
                        Connection Requests
                      </h2>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="bg-[#0eb59a] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        {connectRequests.length}
                      </motion.span>
                    </div>

                    {/* Request items */}
                    <div className="space-y-3">
                      {connectRequests.map((req, idx) => (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: idx * 0.08 }}
                          className="p-4 bg-teal-50/40 dark:!bg-[#0eb59a]/5 rounded-2xl border border-teal-100 dark:border-[#0eb59a]/20"
                        >
                          {/* Company info */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#134e40] to-[#0eb59a] rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                              {(req.companyName || 'A').charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-gray-900 dark:text-white text-sm truncate">{req.companyName}</p>
                              <p className="text-[10px] text-gray-400 font-medium">Wants to connect with you</p>
                            </div>
                          </div>

                          {/* Accept / Decline */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.04, boxShadow: '0 4px 15px rgba(19,78,64,0.25)' }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAcceptConnect(req.id, req.expertId)}
                              className="flex-1 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
                            >
                              <UserCheck size={12} /> Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeclineConnect(req.id)}
                              className="flex-1 py-2 bg-gray-50 dark:!bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 dark:text-gray-400 hover:text-red-500 border border-gray-200 dark:border-white/10 hover:border-red-200 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
                            >
                              <UserX size={12} /> Decline
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* YOUR NETWORK */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ boxShadow: '0 12px 40px rgba(14,181,154,0.12)', borderColor: 'rgba(14,181,154,0.3)' }}
                  transition={{ delay: 0.40, duration: 0.3 }}
                  className="bg-white dark:!bg-[#1e2028] rounded-3xl border border-gray-100 p-5 shadow-sm relative overflow-hidden"
                >

                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Users size={16} className="text-[#0eb59a]" /> Your Network
                    </h2>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/experts')}
                      className="text-[10px] font-black text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1 group"
                    >
                      Browse
                      <motion.span
                        className="inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      {
                        value: (() => { try { return JSON.parse(localStorage.getItem('cxo_following') || '[]').length + 33; } catch { return 33; } })(),
                        label: 'Followers',
                        bg: 'bg-teal-50',
                        hoverBg: '#f0fdfa',
                        border: 'border-teal-100',
                        hoverBorder: 'rgba(14,181,154,0.4)',
                        color: 'text-[#134e40]',
                        hoverShadow: '0 8px 20px rgba(14,181,154,0.12)',
                      },
                      {
                        value: (() => { try { return JSON.parse(localStorage.getItem('cxo_following') || '[]').length; } catch { return 0; } })(),
                        label: 'Following',
                        bg: 'bg-teal-50',
                        hoverBg: '#eff6ff',
                        border: 'border-teal-100',
                        hoverBorder: 'rgba(59,130,246,0.4)',
                        color: 'text-[#134e40]',
                        hoverShadow: '0 8px 20px rgba(59,130,246,0.12)',
                      },
                      {
                        value: (() => { try { return Object.values(JSON.parse(localStorage.getItem('cxo_connections') || '{}')).filter(v => v === 'connected').length; } catch { return 0; } })(),
                        label: 'Connected',
                        bg: 'bg-emerald-50',
                        hoverBg: '#ecfdf5',
                        border: 'border-emerald-100',
                        hoverBorder: 'rgba(16,185,129,0.4)',
                        color: 'text-emerald-600',
                        hoverShadow: '0 8px 20px rgba(16,185,129,0.12)',
                      },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{
                          y: -5,
                          boxShadow: stat.hoverShadow,
                          borderColor: stat.hoverBorder,
                          backgroundColor: stat.hoverBg,
                        }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className={`${stat.bg} dark:!bg-white/5 border ${stat.border} dark:border-white/10 rounded-2xl p-3 text-center cursor-default transition-colors duration-200`}
                      >
                        <motion.p
                          initial={{ opacity: 0, scale: 0.3, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.5 + idx * 0.12, type: 'spring', stiffness: 300, damping: 15 }}
                          whileHover={{ scale: 1.15 }}
                          className={`text-2xl font-black ${stat.color}`}
                        >
                          {stat.value}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + idx * 0.12 }}
                          className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-0.5"
                        >
                          {stat.label}
                        </motion.p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Grow network CTA */}
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(19,78,64,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/experts')}
                    className="w-full py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm relative overflow-hidden group"
                  >
                    {/* Shimmer sweep */}
                    <motion.div
                      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '350%' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                    <UserPlus size={12} className="relative z-10" />
                    <span className="relative z-10">Grow Your Network</span>
                  </motion.button>
                </motion.div>

                {/* PROFILE STRENGTH */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  className="bg-white dark:!bg-[#1e2028] rounded-3xl border border-gray-100 p-5 shadow-sm relative"
                >
                  <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Award size={16} className="text-[#0eb59a]" /> Profile Strength
                  </h2>

                  {/* Circular ring */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#f0fdf4" className="dark:!stroke-white/10" strokeWidth="8" />
                        <motion.circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke="url(#expertGradient)" strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                          animate={{
                            strokeDashoffset: 2 * Math.PI * 34 * (1 - profileStrength / 100)
                          }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        />
                        <defs>
                          <linearGradient id="expertGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#134e40" />
                            <stop offset="100%" stopColor="#0eb59a" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-[#134e40] dark:text-[#0eb59a] leading-none text-left">
                          {profileStrength}%
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold text-left">Strong</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-700 dark:text-gray-200 mb-1">Almost there!</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">Complete your profile to get more matched opportunities.</p>
                    </div>
                  </div>

                  {/* Motivational sub-text */}
                  <div className="bg-[#f0fdf4] dark:!bg-[#0eb59a]/5 border border-[#0eb59a]/10 dark:border-[#0eb59a]/20 rounded-xl p-3 mb-4">
                    <p className="text-[11px] font-black text-[#134e40] leading-relaxed text-left">
                      🎯 Complete your profile to unlock <span className="text-[#0eb59a]">3x more</span> opportunity matches
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2.5">
                    {profileTips.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${tip.done
                          ? 'bg-[#134e40] shadow-sm'
                          : 'bg-gray-100 dark:!bg-white/5 border border-gray-200 dark:border-white/15'
                          }`}
                        >
                          {tip.done && <Check size={11} className="text-white" />}
                        </div>
                        <span className={`text-xs font-bold transition-colors text-left ${tip.done
                          ? 'text-gray-300 opacity-60'
                          : 'text-gray-700 dark:text-gray-300 font-black'
                          }`}>
                          {tip.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/expert-profile')}
                    className="w-full mt-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer text-center justify-center flex"
                  >
                    Complete Profile →
                  </motion.button>
                </motion.div>

                {/* EARNINGS WIDGET */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 }}
                  className="rounded-3xl overflow-hidden shadow-xl relative"
                >
                  {/* Top accent strip */}
                  <div
                    className="h-1 w-full"
                    style={{ background: 'linear-gradient(90deg, #134e40, #0eb59a, #134e40)' }}
                  />
                  <div
                    className="p-6 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #134e40 0%, #0eb59a 100%)' }}
                  >
                    <Shield size={80} className="absolute -right-6 -bottom-6 text-white/5" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1 text-left">
                      Earnings Balance
                    </p>
                    <p className="text-3xl font-black mb-0.5 relative z-10 text-left">₹3,50,000</p>
                    <p className="text-xs text-white/60 font-bold mb-5 text-left">
                      Next payout: Apr 30, 2025
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                        <p className="text-[8px] text-white/50 font-black uppercase tracking-widest mb-1 text-left">In Escrow</p>
                        <p className="text-sm font-black text-white text-left">
                          ₹1,20,000
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                        <p className="text-[8px] text-white/50 font-black uppercase tracking-widest mb-1 text-left">Pending</p>
                        <p className="text-sm font-black text-white text-left">
                          ₹80,000
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: '#134e40',
                        scale: 1.02
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/expert-earnings')}
                      className="w-full py-3 bg-white/20 text-white text-xs font-black rounded-xl transition-all backdrop-blur-sm cursor-pointer border border-white/20 hover:shadow-lg text-center justify-center flex"
                    >
                      View Earnings Dashboard →
                    </motion.button>
                  </div>
                </motion.div>

              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExpertDashboard;