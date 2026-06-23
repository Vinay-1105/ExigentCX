import Logo from '../components/Logo';
import FormalCardBorder from '../components/FormalCardBorder';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Search, Briefcase, LayoutDashboard, CreditCard,
  Bell, Settings, ChevronRight, ChevronLeft,
  Clock, LogOut, Plus, Users, Activity, FileText,
  Star, DollarSign, Target, ArrowUpRight,
  ShieldCheck, Menu, AlertCircle, MapPin, X,
  BarChart2, MessageSquare, CheckCircle,
  Zap, TrendingUp, Eye, Heart, Grid, Calendar
} from 'lucide-react';


// ── ANIMATED COUNTER ──
const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const raw = value.replace(/[₹L,+\s]/g, '');
    const isNum = !isNaN(parseFloat(raw));
    if (!isNum) { setDisplay(value); return; }
    const end = parseFloat(raw);
    const step = end / (1000 / 16);
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
// ── CAROUSEL SLIDE VARIANTS ──
const slideVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60
  }),
  center: {
    opacity: 1,
    x: 0
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -60 : 60
  })
};

// ── EXPERT CARD ──
const ExpertCard = ({ expert }) => {
  const [isHearted, setIsHearted] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/experts/${expert.id}`)}
      style={{
        width: 'calc(25% - 9px)',
        minWidth: '220px',
        flexShrink: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 48px rgba(19,78,64,0.13)',
        borderColor: 'rgba(14,181,154,0.45)'
      }}
      whileTap={{ scale: 0.97 }}
      className="bg-white dark:bg-[#22252e] rounded-2xl border-2 border-gray-100 dark:border-white/10 p-5 group cursor-pointer relative overflow-hidden text-center flex flex-col items-center"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

      {/* Avatar Section */}
      <div className="relative shrink-0 w-16 h-16 mx-auto mb-3">
        {expert.avatar ? (
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-16 h-16 object-cover shadow-md shrink-0"
            style={{ borderRadius: '16px' }}
          />
        ) : (
          <div className={`w-16 h-16 rounded-2xl text-white text-base font-bold flex items-center justify-center shadow-md shrink-0 ${expert.color}`}>
            {expert.initials}
          </div>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
      </div>

      {/* Match and Star badges in center */}
      <div className="flex flex-col items-center gap-1 mb-2 text-center">
        <span
          style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
          className="text-[10px] px-2.5 py-0.5 text-white rounded-full font-black tracking-wider uppercase"
        >
          {expert.match}% MATCH
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11}
              fill={i < Math.floor(parseFloat(expert.rating)) ? '#F59E0B' : 'none'}
              className={i < Math.floor(parseFloat(expert.rating)) ? 'text-amber-400' : 'text-gray-200'}
            />
          ))}
          <span className="text-xs font-black text-gray-700 ml-1">{expert.rating}</span>
        </div>
      </div>

      <h3 className="text-base font-black text-gray-800 dark:text-white mt-1 mb-0.5 leading-snug">{expert.name}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-400 font-bold mb-4">{expert.role}</p>

      {/* Center-aligned Info rows */}
      <div className="flex flex-col mb-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#252830] overflow-hidden w-full text-center shadow-sm">
        <div className="text-xs px-3 py-2 flex flex-col items-center">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-wider uppercase mb-0.5">Rate</span>
          <span className="font-black text-[#134e40] dark:text-gray-300 text-xs">{expert.rate}</span>
        </div>
        <div className="text-xs px-3 py-2 flex flex-col items-center border-t border-gray-100 dark:border-white/10">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-wider uppercase mb-0.5">Availability</span>
          <span className="font-black text-gray-700 dark:text-gray-300 text-xs">{expert.availability}</span>
        </div>
        <div className="text-xs px-3 py-2 flex flex-col items-center border-t border-gray-100 dark:border-white/10">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-wider uppercase mb-0.5">Location</span>
          <span className="font-black text-gray-700 dark:text-gray-300 text-xs truncate max-w-full">{expert.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full mt-auto" onClick={(e) => e.stopPropagation()}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/experts/${expert.id}`)}
          className="flex-1 text-center justify-center text-xs py-2 bg-[#134e40] text-white rounded-xl hover:bg-[#0eb59a] transition-colors duration-200 font-black cursor-pointer"
        >
          View Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 text-center justify-center text-xs py-2 border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 rounded-xl hover:border-[#0eb59a] hover:text-[#0eb59a] hover:bg-teal-50/20 transition-colors duration-200 font-black cursor-pointer"
        >
          Invite
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsHearted(!isHearted);
          }}
          className={`w-8 h-8 flex-shrink-0 border rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer ${isHearted
            ? 'bg-rose-50 border-rose-200 text-rose-500'
            : 'bg-white border-gray-300 text-gray-400 hover:border-rose-400 hover:text-rose-400'
            }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isHearted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const isDemo = localStorage.getItem('demo_company') === 'true';
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Risk Alert: Budget Overrun',
      desc: 'Your Series B Funding engagement with David Chen has exceeded the approved budget by 12%. Immediate review and reallocation is recommended to avoid project delays.',
      time: '5 min ago', unread: true, color: 'bg-red-500', iconBg: 'bg-red-50', tag: 'Finance', action: 'Review Budget',
    },
    {
      id: '2',
      title: 'Milestone Overdue',
      desc: 'The Investor Deck milestone under the Series B engagement is now 3 days past its scheduled delivery date. Expert David Chen has not submitted the deliverable yet.',
      time: '2 hours ago', unread: true, color: 'bg-amber-500', iconBg: 'bg-amber-50', tag: 'Delivery', action: 'Send Reminder',
    },
    {
      id: '3',
      title: 'PMO Report Ready',
      desc: 'Your Q1 2025 governance and compliance report is now available. It covers SLA adherence at 92%, expert performance scores, and escrow utilisation across all active engagements.',
      time: '1 day ago', unread: true, color: 'bg-[#0eb59a]', iconBg: 'bg-teal-50', tag: 'PMO', action: 'View Report',
    },
    {
      id: '4',
      title: 'New Expert Match: 98% Score',
      desc: 'Sarah Jenkins (Fractional CMO) has been AI-matched to your Go-to-Market Expansion requirement with a 98% compatibility score. She is available to start within 7 days.',
      time: '2 days ago', unread: false, color: 'bg-blue-500', iconBg: 'bg-blue-50', tag: 'Expert Match', action: 'View Profile',
    },
    {
      id: '5',
      title: 'Payment Released',
      desc: '₹2,00,000 has been successfully released from escrow to David Chen for completing the Financial Model Development milestone ahead of schedule. Tax invoice is attached.',
      time: '3 days ago', unread: false, color: 'bg-purple-500', iconBg: 'bg-purple-50', tag: 'Payment', action: 'View Invoice',
    },
  ]);
  const [mounted, setMounted] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [requirementsCount, setRequirementsCount] = useState(2); // default fallback
  const [activeEngagementsCount, setActiveEngagementsCount] = useState(3); // default fallback
  const [escrowAccounts, setEscrowAccounts] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const CARDS_PER_VIEW = 4;
  const [experts, setExperts] = useState([]);

  // Auto-play Carousel State
  const [carouselDirection, setCarouselDirection] = useState(1);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);

  const AUTO_PLAY_INTERVAL = 3500;

  // Header States
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);

  // Click outside listener for Mega Dropdown
  const gridRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setGridOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update mounted state to trigger AnimatedCounter
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';

    const checkAuthAndFetchProfile = async () => {
      if (isDemo) {
        setCompanyProfile({ company_name: 'Acme Corp.', admin_email: 'demo@cxo.com' });
        setExperts(MOCK_EXPERTS);
        setLoadingProfile(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyProfile(data);
        } else {
          console.error("Failed to fetch company profile");
        }

        // Fetch requirements for counts
        const { data: reqData, error: reqError } = await supabase
          .from('company_requirements')
          .select('*');

        if (!reqError && reqData) {
          setRequirementsCount(reqData.filter(r => r.status === 'Active').length || 0);
        } else if (reqError) {
          console.error("Supabase fetch error:", reqError);
        }

        // Fetch registered experts from backend
        try {
          const expertsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/company/experts`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (expertsResponse.ok) {
            const expertsData = await expertsResponse.json();
            if (expertsData && expertsData.length > 0) {
              setExperts(expertsData);
            } else {
              setExperts(MOCK_EXPERTS);
            }
          } else {
            console.error("Failed to fetch registered experts, falling back to mock data");
            setExperts(MOCK_EXPERTS);
          }
        } catch (err) {
          console.error("Error fetching experts:", err);
          setExperts(MOCK_EXPERTS);
        }

        // Fetch escrows/active engagements
        try {
          const escrowsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments/escrows`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (escrowsRes.ok) {
            const escrowsData = await escrowsRes.json();
            setEscrowAccounts(escrowsData);
            setActiveEngagementsCount(escrowsData.length);
          }
        } catch (err) {
          console.error("Error fetching escrow accounts:", err);
        }

        // Fetch payment summary
        try {
          const summaryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments/summary`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            setPaymentSummary(summaryData);
          }
        } catch (err) {
          console.error("Error fetching payment summary:", err);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    checkAuthAndFetchProfile();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isDemo) {
        navigate('/signin?role=company');
      }
    });
    return () => { if (authListener?.subscription) authListener.subscription.unsubscribe(); };
  }, [navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard', active: true },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];

  const getNotificationColor = (type) => {
    switch (type) {
      case 'match': return 'bg-teal-500';
      case 'milestone': return 'bg-blue-500';
      case 'contract': return 'bg-purple-500';
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
    const isDemo = localStorage.getItem('demo_company') === 'true';
    
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, is_read: true, unread: false } : n)
    );
    setNotificationCount(prev => Math.max(0, prev - 1));

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

  const handleMarkAllRead = async () => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true, unread: false }))
    );
    setNotificationCount(0);

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

  useEffect(() => {
    let isMounted = true;
    let channel;

    const isDemo = localStorage.getItem('demo_company') === 'true';
    if (isDemo) {
      setNotificationCount(notifications.filter(n => n.unread).length);
      return;
    }

    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMounted) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok && isMounted) {
          const data = await response.json();
          setNotifications(data);
          setNotificationCount(data.filter(n => !n.is_read).length);
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
      const channelName = `company-notifications-${session.user.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

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
              setNotifications(prev => [payload.new, ...prev]);
              setNotificationCount(count => count + 1);
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

  const MOCK_EXPERTS = [
    { id: 1, name: "Sarah Jenkins", role: "Ex-CMO at TechCorp", initials: "SJ", color: "bg-purple-500", match: 98, rating: 4.9, rate: "₹1.5L - ₹2.5L/mo", availability: "20 hrs/week", location: "Remote" },
    { id: 2, name: "David Chen", role: "Interim CFO", initials: "DC", color: "bg-blue-500", match: 95, rating: 5.0, rate: "₹2.5L - ₹4L/mo", availability: "Full-time", location: "New Delhi" },
    { id: 3, name: "Priya Patel", role: "VP Engineering", initials: "PP", color: "bg-teal-600", match: 92, rating: 4.8, rate: "₹1.8L - ₹3L/mo", availability: "10 hrs/week", location: "Remote" },
    { id: 4, name: "Rajesh Sharma", role: "Ex-CHRO, Infosys", initials: "RS", color: "bg-orange-500", match: 90, rating: 4.7, rate: "₹1.8L/mo", availability: "15 hrs/week", location: "Bengaluru" },
    { id: 5, name: "Anita Desai", role: "COO, D2C Brand", initials: "AD", color: "bg-rose-500", match: 88, rating: 4.6, rate: "₹2.2L/mo", availability: "Full-time", location: "Mumbai" },
    { id: 6, name: "Vikram Nair", role: "Board Advisor", initials: "VN", color: "bg-indigo-500", match: 86, rating: 4.8, rate: "₹1.2L/mo", availability: "8 hrs/week", location: "Remote" },
    { id: 7, name: "Meera Iyer", role: "Ex-CMO, Flipkart", initials: "MI", color: "bg-pink-500", match: 84, rating: 4.5, rate: "₹2.5L/mo", availability: "20 hrs/week", location: "Hyderabad" },
    { id: 8, name: "Suresh Menon", role: "CFO & Board Member", initials: "SM", color: "bg-green-600", match: 82, rating: 4.7, rate: "₹3.0L/mo", availability: "Full-time", location: "Chennai" },
  ];
  const visibleExperts = experts.slice(currentIndex, currentIndex + CARDS_PER_VIEW);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex + CARDS_PER_VIEW < experts.length;

  // ── AUTO-PLAY CAROUSEL LOGIC ──
  const startProgress = () => {
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current);
    }
    setAutoPlayProgress(0);
    progressStartRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - progressStartRef.current;
      const progress = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
      setAutoPlayProgress(progress);

      if (elapsed < AUTO_PLAY_INTERVAL) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);
  };

  const stopProgress = () => {
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current);
      progressRef.current = null;
    }
    setAutoPlayProgress(0);
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    startProgress();

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 >= experts.length - CARDS_PER_VIEW + 1 ? 0 : prevIndex + 1;
        const dir = nextIndex === 0 && prevIndex !== 0 ? -1 : 1;
        setCarouselDirection(dir);
        return nextIndex;
      });
      startProgress();
    }, AUTO_PLAY_INTERVAL);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    stopProgress();
  };

  useEffect(() => {
    if (!isCarouselHovered) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isCarouselHovered]);

  const handleManualNav = (newIndex) => {
    const dir = newIndex > currentIndex ? 1 : -1;
    setCarouselDirection(dir);
    setCurrentIndex(newIndex);
    stopAutoPlay();
    startAutoPlay();
  };

  const kpiCards = [
    { title: 'Active Engagements', value: isDemo ? activeEngagementsCount.toString() : String(escrowAccounts.length), trend: '+1 this month', icon: Activity, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', border: 'border-t-4 border-t-[#0eb59a]', numColor: 'text-[#0eb59a]', path: '/engagements' },
    { title: 'Experts Shortlisted', value: '12', trend: '4 new this week', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', border: 'border-t-4 border-t-[#134e40]', numColor: 'text-[#134e40]', path: '/experts?filter=shortlisted' },
    { title: 'Total Spend', value: isDemo ? '₹4.2L' : (paymentSummary ? paymentSummary.totalSpent : '₹0'), trend: 'On budget', icon: DollarSign, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', border: 'border-t-4 border-t-[#0eb59a]', numColor: 'text-[#0eb59a]', path: '/payments' },
    { title: 'Milestones Due', value: isDemo ? '2' : String(escrowAccounts.filter(ea => ea.pendingMilestoneStatus === 'in_progress' || ea.pendingMilestoneStatus === 'pending_approval').length), trend: 'Next in 3 days', icon: Target, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'border-t-4 border-t-amber-400', numColor: 'text-amber-500', path: '/engagements?filter=milestones' },
  ];

  const activeEngagements = isDemo ? [
    { title: 'Series B Funding Strategy', expert: 'David Chen', initials: 'DC', expertColor: 'from-blue-600 to-cyan-500', status: 'IN PROGRESS', statusColor: 'text-blue-600 bg-blue-50', progress: 65, nextMilestone: 'Financial Model Draft', deadline: '15 Sep 2024', risk: 'Low', riskColor: 'text-green-700 bg-green-100', path: '/engagements/1' },
    { title: 'Go-to-Market Expansion', expert: 'Sarah Jenkins', initials: 'SJ', expertColor: 'from-purple-500 to-pink-500', status: 'ON TRACK', statusColor: 'text-emerald-600 bg-emerald-50', progress: 40, nextMilestone: 'Campaign Launch', deadline: '2 Oct 2024', risk: 'Low', riskColor: 'text-green-700 bg-green-100', path: '/engagements/2' },
    { title: 'AI Product Scoping', expert: 'Priya Patel', initials: 'PP', expertColor: 'from-[#134e40] to-[#0eb59a]', status: 'REVIEW', statusColor: 'text-amber-600 bg-amber-50', progress: 90, nextMilestone: 'Market Research', deadline: '19 Aug 2024', risk: 'Medium', riskColor: 'text-amber-700 bg-amber-100', path: '/engagements/3' },
  ] : escrowAccounts.map(ea => {
    let progressVal = 0;
    if (ea.released && ea.totalValue) {
      const releasedNum = parseFloat(ea.released.replace(/[₹L,+\s]/g, '')) || 0;
      const totalNum = parseFloat(ea.totalValue.replace(/[₹L,+\s]/g, '')) || 0;
      if (totalNum > 0) {
        progressVal = Math.round((releasedNum / totalNum) * 100);
      }
    }
    return {
      id: ea.id,
      title: ea.engagement,
      expert: ea.expert,
      initials: ea.expert ? ea.expert.split(' ').map(n => n[0]).join('').toUpperCase() : 'EX',
      expertColor: 'from-blue-600 to-cyan-500',
      status: ea.status === 'Active' ? 'IN PROGRESS' : ea.status.toUpperCase(),
      statusColor: ea.status === 'Active' ? 'text-blue-600 bg-blue-50' : 'text-emerald-600 bg-emerald-50',
      progress: progressVal,
      nextMilestone: ea.pendingMilestone || 'None',
      deadline: 'Apr 30, 2025',
      risk: 'Low',
      riskColor: 'text-green-700 bg-green-100',
      path: `/engagements/${ea.id}`
    };
  });

  const getDynamicPendingActions = () => {
    const list = [];
    escrowAccounts.forEach(ea => {
      if (ea.pendingMilestoneStatus === 'pending_approval') {
        list.push({
          title: `Approve Milestone: ${ea.pendingMilestone}`,
          project: ea.engagement,
          type: 'APPROVAL',
          time: 'Awaiting action',
          urgent: true,
          typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
          dotColor: 'bg-amber-500',
          path: `/engagements/${ea.id}?tab=milestones`
        });
      } else if (ea.pendingMilestoneStatus === 'None' && ea.balanceNum === 0) {
        list.push({
          title: `Deposit Escrow: ${ea.pendingMilestone}`,
          project: ea.engagement,
          type: 'ESCROW',
          time: 'Awaiting funding',
          urgent: true,
          typeColor: 'bg-rose-100 text-rose-700 border-rose-200',
          dotColor: 'bg-rose-500',
          path: `/payments`
        });
      }
    });
    return list;
  };

  const pendingActions = isDemo ? [
    { title: 'Approve Milestone: Phase 1', project: 'Marketing Strategy', type: 'APPROVAL', time: '2 hours ago', urgent: true, typeColor: 'bg-amber-100 text-amber-700 border-amber-200', dotColor: 'bg-amber-500', path: '/engagements/1?tab=milestones' },
    { title: 'Review New Candidates', project: 'Interim CFO', type: 'REVIEW', time: '5 hours ago', urgent: false, typeColor: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500', path: '/requirements' },
    { title: 'Sign Contract', project: 'Tech Advisory', type: 'ACTION', time: '1 day ago', urgent: false, typeColor: 'bg-rose-100 text-rose-700 border-rose-200', dotColor: 'bg-purple-500', path: '/contracts/1' },
    { title: 'Escrow Pending', project: 'Project Scoping', type: 'ESCROW', time: '1 day ago', urgent: true, typeColor: 'bg-rose-100 text-rose-700 border-rose-200', dotColor: 'bg-rose-500', path: '/payments' },
    { title: 'Meeting Reminder', project: '1-on-1 with David', type: 'MEETING', time: 'Today 3PM', urgent: false, typeColor: 'bg-teal-100 text-teal-700 border-teal-200', dotColor: 'bg-teal-500', path: '/engagements/1' },
    { title: 'Risk Alert', project: 'Budget Variance detected', type: 'RISK', time: 'Just now', urgent: true, typeColor: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500', path: '/analytics' },
  ] : getDynamicPendingActions();

  const quickActions = [
    { label: 'Post a Role', icon: Plus, bg: 'bg-teal-50', iconColor: 'text-teal-600', path: '/requirements/create' },
    { label: 'Find Experts', icon: Users, bg: 'bg-purple-50', iconColor: 'text-purple-600', path: '/experts' },
    { label: 'Contracts', icon: FileText, bg: 'bg-blue-50', iconColor: 'text-blue-600', path: '/contracts' },
    { label: 'Payments', icon: CreditCard, bg: 'bg-green-50', iconColor: 'text-green-600', path: '/payments' },
    { label: 'Milestones', icon: Target, bg: 'bg-amber-50', iconColor: 'text-amber-600', path: '/engagements' },
    { label: 'Analytics', icon: BarChart2, bg: 'bg-rose-50', iconColor: 'text-rose-600', path: '/analytics' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F2] dark:bg-[#0f1117] font-sans text-slate-900">

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-[#FAFBF9] dark:bg-[#1b1d24] border-r border-gray-200 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.06)] fixed left-0 top-0 h-screen"
      >
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
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${item.active
                ? 'bg-[#134e40] text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white'
                }`}
            >
              {item.active && (
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
          ))}
        </nav>

        {/* Separated Settings option pinned to the bottom */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <div className={`flex items-center gap-3 px-3 py-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && (
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Theme
              </span>
            )}
            <ThemeToggle />
          </div>
          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${window.location.pathname === '/settings'
              ? 'bg-[#134e40] text-white shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white'
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

        {/* ── HEADER ── */}
        <header className="h-16 bg-white dark:bg-[#1b1d24] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {/* Left — branding spacer */}
          <div className="flex items-center gap-3" />

          {/* Center — search */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'}`} />
              <input
                type="text"
                placeholder="Search experts, skills, or projects..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 dark:bg-[#22252e] border dark:border-white/10 rounded-full text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white focus:outline-none transition-all duration-200 ${searchFocused ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20' : 'border-gray-200'}`}
              />
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-left text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">

            {/* Post Requirement */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/requirements/create')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-full shadow-md overflow-hidden relative group transition-transform duration-150"
            >
              <Plus size={14} />
              Post Requirement
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            {/* 9-dot grid with mega dropdown */}
            <div className="relative" ref={gridRef}>
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: '#f0fdf4', borderColor: '#0eb59a' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { setGridOpen(!gridOpen); setShowNotifications(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${gridOpen ? 'bg-teal-50 border-[#0eb59a] text-[#134e40]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                title="Quick Navigation"
              >
                <Grid size={17} />
              </motion.button>

              <AnimatePresence>
                {gridOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-2xl z-50 overflow-hidden"
                    style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.12)', border: '1px solid #F1F5F2' }}
                  >
                    <div className="p-3 space-y-1">

                      {/* Column Headers */}
                      <div className="flex items-center justify-between px-2 pb-2">
                        <span className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigate</span>
                        <span className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Activity</span>
                      </div>

                      {/* Nav Rows */}
                      {[
                        {
                          icon: FileText,
                          label: 'My Requirements',
                          iconBg: 'bg-teal-50',
                          iconColor: 'text-[#0eb59a]',
                          border: '#0eb59a',
                          badge: '2 active',
                          badgeStyle: 'text-teal-700 bg-teal-50 border-teal-200',
                          path: '/requirements',
                        },
                        {
                          icon: Users,
                          label: 'Find Experts',
                          iconBg: 'bg-blue-50',
                          iconColor: 'text-blue-500',
                          border: '#3B82F6',
                          badge: '5 matched',
                          badgeStyle: 'text-blue-700 bg-blue-50 border-blue-200',
                          path: '/experts',
                        },
                        {
                          icon: FileText,
                          label: 'Contracts',
                          iconBg: 'bg-purple-50',
                          iconColor: 'text-purple-500',
                          border: '#8B5CF6',
                          badge: '1 pending',
                          badgeStyle: 'text-amber-700 bg-amber-50 border-amber-200',
                          path: '/contracts',
                        },
                        {
                          icon: CreditCard,
                          label: 'Payments',
                          iconBg: 'bg-emerald-50',
                          iconColor: 'text-emerald-500',
                          border: '#10b981',
                          badge: '₹4.2L spent',
                          badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                          path: '/payments',
                        },
                        {
                          icon: BarChart2,
                          label: 'Analytics',
                          iconBg: 'bg-amber-50',
                          iconColor: 'text-amber-500',
                          border: '#F59E0B',
                          badge: 'View Reports',
                          badgeStyle: 'text-amber-700 bg-amber-50 border-amber-200',
                          path: '/analytics',
                        },
                        {
                          icon: Settings,
                          label: 'Settings',
                          iconBg: 'bg-gray-50',
                          iconColor: 'text-gray-500',
                          border: '#9CA3AF',
                          badge: 'Profile & Billing',
                          badgeStyle: 'text-gray-600 bg-gray-50 border-gray-200',
                          path: '/settings',
                        },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 3, backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { navigate(item.path); setGridOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                          style={{ borderLeft: `3px solid ${item.border}` }}
                        >
                          {/* Icon */}
                          <div className={`w-7 h-7 ${item.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                            <item.icon size={13} className={item.iconColor} />
                          </div>

                          {/* Label */}
                          <span className="flex-1 text-sm font-bold text-[#1C3627] text-left">{item.label}</span>

                          {/* Divider */}
                          <div className="w-px h-4 bg-gray-100 shrink-0" />

                          {/* Activity Badge */}
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 text-left ${item.badgeStyle}`}>
                            {item.badge}
                          </span>
                        </motion.button>
                      ))}

                      {/* Divider */}
                      <div className="flex items-center gap-2 pt-2 pb-1 px-2">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-left text-[10px] font-black text-gray-300 uppercase tracking-widest">Quick Create</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      {/* Quick Create Buttons */}
                      <div className="flex gap-2 px-1 pb-1">
                        {[
                          {
                            label: '+ Post a Role',
                            path: '/requirements/create',
                            style: 'border-[#0eb59a] text-[#0eb59a] hover:bg-[#0eb59a] hover:text-white',
                          },
                          {
                            label: '+ Invite Expert',
                            path: '/experts',
                            style: 'border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white',
                          },
                          {
                            label: '+ Add Funds',
                            path: '/payments',
                            style: 'border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white',
                          },
                        ].map((btn, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => { navigate(btn.path); setGridOpen(false); }}
                            className={`flex-1 py-2 rounded-xl text-[11px] font-black border transition-all duration-200 text-left ${btn.style}`}
                          >
                            {btn.label}
                          </motion.button>
                        ))}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bell */}
            <div className="relative">
              <motion.button
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 4, repeat: Infinity, repeatDelay: 10 }}
                whileHover={{ scale: 1.08, backgroundColor: '#f0fdf4', borderColor: '#0eb59a' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { setShowNotifications(!showNotifications); setGridOpen(false); if (!showNotifications) setNotificationCount(0); }}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${showNotifications ? 'bg-teal-50 border-[#0eb59a]' : 'bg-gray-50 border-gray-200'}`}
                title="Notifications"
              >
                <Bell size={16} className={showNotifications ? 'text-[#134e40]' : 'text-gray-500'} />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5 animate-pulse"
                  >
                    {notificationCount}
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
                      transition={{ duration: 0.3, type: "tween" }}
                      className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-100 z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50/60 to-white shrink-0">
                        <div>
                          <h3 className="font-black text-gray-900 text-sm text-left">Notifications</h3>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 text-left">
                            {notifications.length} total
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={handleMarkAllRead} className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors text-left bg-transparent border-0 cursor-pointer">
                            Mark all read
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowNotifications(false)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors bg-transparent border-0 cursor-pointer"
                          >
                            <X size={14} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Notification list */}
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-xs font-medium">No notifications yet</div>
                        ) : (
                          notifications.map((notif, idx) => {
                            const isUnread = notif.unread ?? !notif.is_read;
                            const descText = notif.desc || notif.description;
                            const timeText = formatNotificationTime(notif.time || notif.created_at);
                            const dotColor = notif.color || getNotificationColor(notif.type);
                            const iconBg = notif.iconBg || (
                              dotColor === 'bg-red-500' ? 'bg-red-50' :
                              dotColor === 'bg-amber-500' ? 'bg-amber-50' :
                              dotColor === 'bg-[#0eb59a]' ? 'bg-teal-50' :
                              dotColor === 'bg-blue-500' ? 'bg-blue-50' :
                              'bg-purple-50'
                            );
                            const tagText = notif.tag || (
                              notif.type === 'match' ? 'Expert Match' :
                              notif.type === 'milestone' ? 'Delivery' :
                              notif.type === 'contract' ? 'Contract' :
                              notif.type === 'payment' ? 'Payment' :
                              'General'
                            );
                            const actionText = notif.action;

                            return (
                              <motion.div key={notif.id || idx}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleMarkAsRead(notif.id)}
                                className={`px-5 py-4 border-b border-gray-50 cursor-pointer transition-colors group ${
                                  isUnread ? 'bg-gradient-to-r from-teal-50/30 to-transparent hover:from-teal-50/50' : 'hover:bg-gray-50/70'
                                }`}
                              >
                                <div className="flex gap-3">
                                  {/* Icon / dot */}
                                  <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <p className="text-sm font-black text-gray-900 leading-tight text-left">{notif.title}</p>
                                      {isUnread && (
                                        <span className="w-2 h-2 rounded-full bg-[#0eb59a] shrink-0 mt-1.5" />
                                      )}
                                    </div>
                                    
                                    <span className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md mb-1.5 ${
                                      dotColor === 'bg-red-500' ? 'bg-red-50 text-red-600' :
                                      dotColor === 'bg-amber-500' ? 'bg-amber-50 text-amber-600' :
                                      dotColor === 'bg-[#0eb59a]' || dotColor === 'bg-emerald-500' ? 'bg-teal-50 text-teal-700' :
                                      dotColor === 'bg-blue-500' ? 'bg-blue-50 text-blue-600' :
                                      'bg-purple-50 text-purple-600'
                                    }`}>{tagText}</span>

                                    <p className="text-xs text-gray-500 leading-relaxed text-left">{descText}</p>
                                    
                                    <div className="flex items-center justify-between mt-2.5">
                                      <span className="text-[10px] text-gray-300 font-semibold text-left">{timeText}</span>
                                      {actionText && (
                                        <motion.button
                                          whileHover={{ scale: 1.04 }}
                                          whileTap={{ scale: 0.96 }}
                                          className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                                            dotColor === 'bg-red-500' ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-500 hover:text-white' :
                                            dotColor === 'bg-amber-500' ? 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-500 hover:text-white' :
                                            dotColor === 'bg-[#0eb59a]' || dotColor === 'bg-emerald-500' ? 'text-teal-700 border-teal-200 bg-teal-50 hover:bg-[#0eb59a] hover:text-white' :
                                            dotColor === 'bg-blue-500' ? 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-500 hover:text-white' :
                                            'text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-500 hover:text-white'
                                          }`}
                                        >
                                          {actionText}
                                        </motion.button>
                                      )}
                                    </div>
                                  </div>
                                </div>
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

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08, ringWidth: 2, ringColor: '#0eb59a', ringOffsetWidth: 2 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md transition-all duration-200 overflow-hidden"
              title="Account"
            >
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </motion.div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f5] dark:bg-[#0f1117] [&::-webkit-scrollbar]:hidden">

          {/* LIGHT HERO BANNER */}
          <div className="relative overflow-hidden border-b border-teal-100/60 dark:border-white/5 bg-gradient-to-br from-[#f0fdf4] via-[#e8f5f1] to-[#f8fafc] dark:bg-none dark:bg-[#252830]"
            style={{}}>
            <div className="absolute top-0 right-0 w-64 h-32 bg-[#0eb59a]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-20 bg-[#134e40]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }}>
                  <div className="flex items-center gap-2 mb-2 text-left">
                    <div className="flex gap-0.5 text-left">
                      {[...Array(5)].map((_, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}>
                          <Star size={11} fill="#FBBF24" className="text-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <h1 className="text-left text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    Welcome,{' '}
                    <span className="text-left text-transparent bg-clip-text bg-gradient-to-r from-[#134e40] to-[#0eb59a]">
                      {loadingProfile ? '...' : (companyProfile?.company_name || 'Acme Corp.')}
                    </span>
                  </h1>

                  <p className="text-left text-slate-500 dark:text-gray-400 text-sm mt-2 font-medium">
                    You have{' '}
                    <span className="text-left text-amber-500 font-black">3 pending actions</span>{' '}and{' '}
                    <span className="text-left text-[#134e40] dark:text-[#0eb59a] font-black">3 expert matches</span> today.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex gap-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(19,78,64,0.2)' }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/requirements/create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg transition-all whitespace-nowrap text-left">
                    <Plus size={15} /> Post a Role
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap text-left">
                    <TrendingUp size={15} /> Download Report
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 pb-16">

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {kpiCards.map((kpi, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * idx }}>
                  <div onClick={() => navigate(kpi.path)}
                    className={`bg-white dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl p-5 ${kpi.border} cursor-pointer relative group transition-all duration-200 shadow-[0_4px_20px_rgba(19,78,64,0.07)] hover:shadow-[0_8px_28px_rgba(19,78,64,0.13)] hover:-translate-y-1 flex flex-col items-center justify-center text-center min-h-[160px]`}>
                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${kpi.border.replace('border-t-4 ', '')} opacity-100`} />

                    <div className={`w-10 h-10 ${kpi.iconBg} rounded-full flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform duration-200 shadow-sm mx-auto`}>
                      <kpi.icon size={18} className={kpi.iconColor} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest leading-tight mb-1">{kpi.title}</span>
                    <p className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${kpi.numColor} dark:!text-white`}>
                      {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-[#0eb59a] bg-emerald-50 dark:bg-[#0eb59a]/10 px-2.5 py-1 rounded-lg">
                      <ArrowUpRight size={9} /> {kpi.trend}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
              {quickActions.map((action, idx) => (
                <motion.div key={idx} 
                  onClick={() => navigate(action.path)}
                  whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="relative group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#252830] border border-gray-100 dark:border-white/10 dark:text-gray-300 hover:border-[#0eb59a]/30 hover:dark:bg-[#252830] cursor-pointer transition-all duration-200 shadow-sm dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] text-center overflow-hidden">
                  <div className={`w-10 h-10 ${action.bg} dark:bg-white/10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon size={17} className={action.iconColor} />
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-200 mt-1 text-center">
                    {action.label}
                  </span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50 text-left">
                    {action.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* RECOMMENDED EXPERTS CAROUSEL */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              onMouseEnter={() => setIsCarouselHovered(true)}
              onMouseLeave={() => setIsCarouselHovered(false)}
              className="bg-white dark:bg-[#1b1d24] rounded-3xl border border-gray-100 dark:border-white/10 p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] text-left relative hover:shadow-[0_4px_24px_rgba(0,0,0,0.09)] transition-shadow duration-300"
            >

              <div className="flex items-center justify-between mb-6 text-left">
                <div className="text-left">
                  <h2 className="text-left text-sm sm:text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}>
                      <Zap size={16} fill="#0eb59a" className="text-[#0eb59a]" />
                    </motion.div>
                    Recommended Experts
                  </h2>
                  <p className="text-left text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">Based on your "Interim CFO" requirement</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                {/* LEFT ARROW */}
                <button
                  onClick={() => handleManualNav(currentIndex - 1)}
                  disabled={!canGoLeft}
                  className={`w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${canGoLeft
                      ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                    }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* CARDS AREA */}
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait" custom={carouselDirection}>
                    <motion.div
                      key={currentIndex}
                      custom={carouselDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex gap-3 items-stretch"
                    >
                      {visibleExperts.map(expert => (
                        <ExpertCard key={expert.id} expert={expert} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* RIGHT ARROW */}
                <button
                  onClick={() => handleManualNav(currentIndex + 1)}
                  disabled={!canGoRight}
                  className={`w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${canGoRight
                      ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                    }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Dot indicators + View All */}
              <div className="flex flex-col items-center gap-2 mt-4 text-center">
                <div className="flex gap-1.5 justify-center">
                  {Array.from({ length: experts.length - CARDS_PER_VIEW + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleManualNav(i)}
                      className={`rounded-full transition-all duration-200 ${currentIndex === i
                        ? 'w-4 h-2 bg-[#0eb59a]'
                        : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                        }`}
                    />
                  ))}
                </div>

                {/* PROGRESS BAR */}
                <div className="h-4 flex items-center justify-center">
                  {isCarouselHovered ? (
                    <span className="text-left text-[10px] text-gray-400 font-black tracking-wider uppercase">Paused</span>
                  ) : (
                    <div className="bg-gray-100 rounded-full w-32 h-0.5 overflow-hidden">
                      <div
                        className="bg-[#0eb59a] rounded-full h-full"
                        style={{ width: `${autoPlayProgress}%`, transition: 'none' }}
                      />
                    </div>
                  )}
                </div>

                <a href="/experts" className="text-left text-sm text-[#0eb59a] font-medium hover:underline mt-1">
                  View All Experts →
                </a>
              </div>
            </motion.div>

            {/* BOTTOM GRID — Engagements + Pending Actions side by side */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Active Engagements — left 2/3 */}
              <div className="lg:col-span-2 bg-white dark:bg-[#1b1d24] rounded-3xl border border-gray-100 dark:border-white/10 p-5 sm:p-6 shadow-sm text-left relative">

                <div className="flex items-center justify-between mb-5 text-left">
                  <h2 className="text-left text-sm sm:text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity size={16} className="text-[#0eb59a]" /> Active Engagements
                  </h2>
                  <div className="flex items-center gap-1.5 text-left">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-left text-[10px] text-gray-400 italic">Auto-saved · Last updated 2 min ago</span>
                  </div>
                </div>

                {activeEngagements.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-[#f8fafc]/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                    <Activity size={32} className="text-[#0eb59a] mb-2 animate-pulse" />
                    <h3 className="font-black text-gray-800 text-sm">No Active Engagements</h3>
                    <p className="text-gray-400 text-xs max-w-xs mt-1">Once you sign a contract with an expert, your active engagement and milestones will be tracked here.</p>
                    <button onClick={() => navigate('/experts')} className="mt-4 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all cursor-pointer">
                      Find Experts
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto text-left">
                    <table className="w-full text-sm min-w-[520px] text-left">
                      <thead>
                        <tr className="border-b border-gray-100 dark:bg-[#22252e] text-left">
                          {['Project', 'Milestone', 'Progress', 'Deadline', 'Risk', 'Actions'].map(h => (
                            <th key={h} className="text-left pb-3 text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-left">
                        {activeEngagements.map((eng, idx) => (
                          <motion.tr key={idx}
                            onClick={() => navigate(eng.path)}
                            className="cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-[#22252e] group text-left">
                            <td className="py-4 pr-3 text-left">
                              <div className="flex items-center gap-2.5 text-left">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${eng.expertColor || 'from-[#134e40] to-[#0eb59a]'} flex items-center justify-center shrink-0`}>
                                  <span className="text-left text-white text-[9px] font-black">{eng.initials}</span>
                                </div>
                                <div className="text-left">
                                  <p className="text-left font-bold text-gray-800 dark:text-white text-xs group-hover:text-[#134e40] transition-colors leading-tight">{eng.title}</p>
                                  <p className="text-left text-[10px] text-gray-400 dark:text-gray-400 font-medium">Expert: {eng.expert}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-3 text-left">
                              <span className={`text-left text-[10px] font-black px-2 py-1 rounded-full ${eng.statusColor}`}>{eng.nextMilestone}</span>
                            </td>
                            <td className="py-4 pr-3 text-left">
                              <div className="flex items-center gap-2 min-w-[80px] text-left">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${eng.progress}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                                    className="h-full rounded-full relative overflow-hidden"
                                    style={{ background: 'linear-gradient(90deg, #134e40, #0eb59a)' }}>
                                    <motion.div animate={{ x: ['-100%', '200%'] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                  </motion.div>
                                </div>
                                <span className="text-left text-[10px] font-black text-[#134e40] dark:text-gray-300 shrink-0">{eng.progress}%</span>
                              </div>
                            </td>
                            <td className="py-4 pr-3 text-left">
                              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-300 font-medium text-left">
                                <Clock size={9} /> {eng.deadline}
                              </div>
                            </td>
                            <td className="py-4 pr-3 text-left">
                              <span className={`text-left text-[10px] font-black px-2 py-1 rounded-full ${eng.riskColor}`}>{eng.risk}</span>
                            </td>
                            <td className="py-4 text-left">
                              <div className="flex items-center gap-1.5 text-left">
                                {[
                                  { icon: Eye, bg: 'bg-teal-50 hover:bg-teal-100', color: 'text-[#0eb59a]', title: 'Workspace', fn: (e) => { e.stopPropagation(); navigate(eng.path); } },
                                  { icon: MessageSquare, bg: 'bg-blue-50 hover:bg-blue-100', color: 'text-blue-500', title: 'Message', fn: (e) => { e.stopPropagation(); navigate(`${eng.path}?tab=messages`); } },
                                  { icon: CheckCircle, bg: 'bg-emerald-50 hover:bg-emerald-100', color: 'text-emerald-500', title: 'Approve', fn: (e) => { e.stopPropagation(); navigate(`${eng.path}?tab=milestones`); } },
                                  { icon: FileText, bg: 'bg-amber-50 hover:bg-amber-100', color: 'text-amber-500', title: 'Invoices', fn: (e) => { e.stopPropagation(); navigate('/payments'); } },
                                ].map(({ icon: Icon, bg, color, title, fn }, i) => (
                                  <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                    onClick={fn} title={title}
                                    className={`p-1.5 rounded-lg ${bg} ${color} transition-all`}>
                                    <Icon size={12} />
                                  </motion.button>
                                ))}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pending Actions — right 1/3 */}
              <div className="flex flex-col text-left">
                <div className="bg-white dark:bg-[#1b1d24] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col max-h-[520px] text-left relative">

                  <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-white/5 bg-gradient-to-b from-amber-50/40 to-white dark:from-[#1b1d24] dark:to-[#1b1d24] text-left">
                    <div className="flex items-center justify-between text-left">
                      <h2 className="text-left text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}>
                          <AlertCircle size={16} className="text-amber-500" />
                        </motion.div>
                        Pending Actions
                      </h2>
                      <div className="flex items-center text-left">
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                          {pendingActions.length}
                        </motion.span>
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse ml-1 inline-block" />
                      </div>
                    </div>
                    <p className="text-left text-xs text-gray-400 mt-1 font-medium">{pendingActions.length} items requiring attention</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 [&::-webkit-scrollbar]:hidden text-left">
                    {pendingActions.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 text-xs font-semibold flex flex-col items-center justify-center">
                        <CheckCircle size={24} className="text-[#0eb59a] mb-2" />
                        No Pending Actions
                      </div>
                    ) : (
                      pendingActions.map((action, idx) => (
                        <div key={idx} onClick={() => navigate(action.path)}
                          className="p-3.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/40 dark:bg-[#252830] hover:bg-white dark:hover:bg-[#252830] hover:shadow-sm hover:border-[#0eb59a]/30 transition-all duration-150 cursor-pointer group text-left">
                          <div className="flex items-center justify-between mb-2 text-left">
                            <div className="flex items-center gap-1.5 text-left">
                              <span className={`text-left text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${action.typeColor}`}>
                                {action.type}
                              </span>
                              {action.urgent && (
                                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1.2, repeat: Infinity }}
                                  className={`w-1.5 h-1.5 rounded-full ${action.dotColor}`} />
                              )}
                            </div>
                            <span className="text-left text-[10px] text-gray-300 flex items-center gap-1">
                              <Clock size={9} /> {action.time}
                            </span>
                          </div>
                          <h4 className="text-left font-black text-gray-700 dark:text-gray-100 text-xs mb-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug">
                            {action.title}
                          </h4>
                          <p className="text-left text-[10px] text-gray-400 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                            <Briefcase size={9} /> {action.project}
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(action.path); }}
                            className="w-full py-2 bg-white dark:bg-[#2a2d36] border border-gray-200 dark:border-white/10 rounded-xl text-[11px] font-black text-gray-500 dark:text-gray-300 hover:bg-[#134e40] hover:text-white transition-colors duration-200 shadow-sm text-left px-3">
                            Take Action
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-50 bg-gray-50/30 text-center">
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/company-dashboard')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1 mx-auto text-left">
                      View All History <ChevronRight size={12} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
