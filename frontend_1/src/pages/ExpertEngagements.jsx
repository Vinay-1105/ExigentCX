import Logo from '../components/Logo';
import FormalCardBorder from '../components/FormalCardBorder';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Clock, CheckCircle, Upload,
  Download, Send, Paperclip, IndianRupee, DollarSign,
  Shield, AlertCircle, Calendar, FileText,
  MessageSquare, BarChart2, CreditCard,
  Check, X, Star, Users, Briefcase, ArrowLeft,
  Lock, Unlock, Eye, TrendingUp, Zap, Circle,
  Image, File, Building, Target, Activity,
  ChevronDown, Plus, ArrowUpRight, Award,
  Search, Bell, Settings, LayoutDashboard,
  UserCircle, ChevronLeft, Menu, Grid,
  MoreVertical, RefreshCw, LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ExpertEngagements = () => {
  const navigate = useNavigate();
  const { engagementId } = useParams();
  const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';

  const [activeTab, setActiveTab] = useState('Overview');
  const [profile, setProfile] = useState(null);

  // Sidebar + Header state (same as ExpertOpportunities)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const gridRef = useRef(null);

  const [selectedEngagement, setSelectedEngagement] = useState(engagementId || (isDemo ? '1' : null));
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

  // ── DYNAMIC STATES ──
  const [dbEscrowAccounts, setDbEscrowAccounts] = useState([]);
  const [engagement, setEngagement] = useState({
    id: selectedEngagement,
    title: 'Series B Funding Strategy',
    company: 'Acme Corp',
    companyLogo: 'AC',
    logoColor: 'from-[#134e40] to-[#0eb59a]',
    status: 'IN PROGRESS',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
    type: 'Interim',
    startDate: 'Feb 1, 2025',
    endDate: 'Jul 31, 2025',
    duration: '6 months',
    commitment: '40 hrs/wk',
    monthlyRate: '₹3L/mo',
    totalValue: '₹18,00,000',
    received: '₹3,50,000',
    pending: '₹2,50,000',
    progress: 65,
    nextMilestone: 'Investor Deck & Data Room',
    daysLeft: 87,
    pmContact: 'Riya Sharma',
    pmEmail: 'riya@cxoconnect.com',
  });
  const [milestones, setMilestones] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingEngagement, setLoadingEngagement] = useState(true);

  const engagementsList = isDemo ? [
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
      logoColor: 'from-emerald-700 to-teal-500',
      status: 'ON TRACK',
      statusColor: 'text-emerald-600 bg-emerald-50',
      progress: 40,
      monthlyRate: '₹2.5L/mo',
      nextAction: 'Submit Due Diligence Report',
      dueDate: 'May 15, 2025',
    }
  ] : dbEscrowAccounts.map((ea) => {
    return {
      id: ea.id,
      title: ea.engagement,
      company: ea.company || 'Acme Corp',
      logo: ea.companyLogo || 'AC',
      logoColor: ea.logoColor || 'from-[#134e40] to-[#0eb59a]',
      status: ea.status === 'Active' ? 'IN PROGRESS' : ea.status.toUpperCase(),
      statusColor: ea.status === 'Active' ? 'text-blue-600 bg-blue-50' : 'text-emerald-600 bg-emerald-50',
      progress: ea.progress !== undefined ? ea.progress : 0,
      monthlyRate: ea.monthlyRate || '₹3L/mo',
      nextAction: ea.pendingMilestone || 'None',
      dueDate: 'Apr 30, 2025',
    };
  });

  const currentEngagement = engagementsList.find(e => e.id === selectedEngagement) || engagementsList[0];

  const documents = [
    { id: 1, name: 'Engagement Agreement.pdf', size: '1.2 MB', type: 'pdf', uploadedBy: 'ExigentCX', date: 'Feb 1, 2025', category: 'Legal' },
    { id: 2, name: 'NDA — Acme Corp & David Chen.pdf', size: '0.6 MB', type: 'pdf', uploadedBy: 'ExigentCX', date: 'Feb 1, 2025', category: 'Legal' },
    { id: 3, name: 'Financial Model v2.xlsx', size: '3.8 MB', type: 'excel', uploadedBy: 'You', date: 'Mar 28, 2025', category: 'Deliverable' },
    { id: 4, name: 'Business Assessment Report.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'You', date: 'Feb 25, 2025', category: 'Deliverable' },
    { id: 5, name: 'Fundraising Narrative.pptx', size: '5.2 MB', type: 'ppt', uploadedBy: 'You', date: 'Mar 28, 2025', category: 'Deliverable' },
  ];

  // ── DATA ARRAYS (ExpertOpportunities) ──
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
    { title: 'Milestone Approved', desc: 'Acme Corp approved your deliverable', time: '30 min ago', unread: true, color: 'bg-emerald-500' },
    { title: 'Payment Released', desc: '₹2,00,000 credited to your account', time: '2 hours ago', unread: true, color: 'bg-[#0eb59a]' },
    { title: 'New Message', desc: 'TechScale Ventures sent a message', time: '3 hours ago', unread: false, color: 'bg-slate-400' },
  ];

  // Profile fetch effect (keep exactly)
  useEffect(() => {
    const fetchProfile = async () => {
      const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
      if (isDemo) {
        setProfile({ full_name: 'David Chen' });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/expert/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile in engagements:", err);
      }
    };

    fetchProfile();
  }, []);

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
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setGridOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchEscrowAccounts = async () => {
    const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
    let token = "demo-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      token = session.access_token;
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${baseUrl}/api/payments/escrows`, { headers });
      if (res.ok) {
        const data = await res.json();
        setDbEscrowAccounts(data);
        if (data.length > 0 && !selectedEngagement) {
          setSelectedEngagement(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading escrows list:", err);
    }
  };

  const fetchEngagementDetails = async (engId) => {
    const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
    let token = "demo-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      token = session.access_token;
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      setLoadingEngagement(true);
      const res = await fetch(`${baseUrl}/api/payments/engagement/${engId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        
        // Map backend properties to frontend schema
        const mappedEngagement = {
          ...data.engagement,
          company: data.engagement.company || 'Acme Corp',
          companyLogo: data.engagement.companyLogo || 'AC',
          logoColor: data.engagement.logoColor || 'from-[#134e40] to-[#0eb59a]',
          received: data.engagement.spent,
          pending: data.engagement.escrowBalance
        };

        setEngagement(mappedEngagement);
        setMilestones(data.milestones);
        setPayments(data.payments);
      }
    } catch (err) {
      console.error("Error loading engagement details in expert workspace:", err);
    } finally {
      setLoadingEngagement(false);
    }
  };

  useEffect(() => {
    fetchEscrowAccounts();
  }, [profile]);

  useEffect(() => {
    if (selectedEngagement) {
      fetchEngagementDetails(selectedEngagement);
    }
  }, [selectedEngagement, profile]);

  // ── HELPERS ──
  const getMilestoneStatus = (status) => {
    switch (status) {
      case 'approved': return { label: 'Approved', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };
      case 'submitted': return { label: 'Submitted', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
      case 'pending_approval': return { label: 'Awaiting Approval', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
      case 'pending_admin_release': return { label: 'Awaiting Release', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Clock };
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

  const handleSubmit = async () => {
    setSubmitSent(true);

    const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
    let token = "demo-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      token = session.access_token;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${baseUrl}/api/payments/milestone/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          engagementId: selectedEngagement,
          milestoneId: showSubmitModal.id,
          note: deliverableNote
        })
      });

      if (res.ok) {
        setTimeout(() => {
          setShowSubmitModal(null);
          setSubmitSent(false);
          setDeliverableNote('');
          fetchEngagementDetails(selectedEngagement);
        }, 2000);
      } else {
        const errorData = await res.json();
        alert("Failed to submit deliverable: " + (errorData.error || "Unknown error"));
        setSubmitSent(false);
      }
    } catch (err) {
      console.error("Error submitting milestone deliverable:", err);
      alert("Error submitting milestone deliverable");
      setSubmitSent(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f5] font-sans text-slate-900 overflow-hidden">
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

      {/* ══ SIDEBAR (identical to ExpertOpportunities) ══ */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        {/* Logo area */}
        <div className="flex items-center border-b border-gray-50 px-3 py-4 gap-3">
          <motion.div
            animate={{ 
              width: isSidebarOpen ? 'auto' : 0, 
              opacity: isSidebarOpen ? 1 : 0 
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0 flex items-center"
          >
            <div className="cursor-pointer" onClick={() => navigate('/expert-dashboard')}>
              <Logo variant="dark" className="h-8" />
            </div>
          </motion.div>
          <motion.button
            animate={{ marginLeft: isSidebarOpen ? 'auto' : 0 }}
            whileHover={{ scale: 1.1, backgroundColor: '#f0fdf4' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(s => !s)}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#134e40] hover:bg-[#f0fdf4] transition-all cursor-pointer shrink-0 border border-gray-200 hover:border-[#0eb59a]"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {sidebarMenu.map((item) => {
            const isActive = item.name === 'My Engagements';
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavEng"
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

        <div className="p-3 border-t border-gray-50 space-y-1">
          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 }}}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/expert-settings')}
            className="w-full flex items-center gap-3 px-3 
              py-2 rounded-xl text-gray-500 hover:bg-gray-50 
              hover:text-[#134e40] transition-all"
          >
            <Settings size={17} className="shrink-0" />
            <motion.span
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0, 
                width: isSidebarOpen ? 'auto' : 0 
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap 
                text-sm font-bold text-left"
            >
              Settings
            </motion.span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              localStorage.removeItem('demo_expert');
              await supabase.auth.signOut();
              navigate('/signin?role=expert');
            }}
            className="w-full flex items-center gap-3 px-3 
              py-2 rounded-xl text-red-500 hover:bg-red-50 
              hover:text-red-600 transition-all font-bold"
          >
            <LogOut size={17} className="shrink-0" />
            <motion.span
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0, 
                width: isSidebarOpen ? 'auto' : 0 
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap 
                text-sm font-bold text-left"
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
        {/* ── HEADER (identical to ExpertOpportunities) ── */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all shrink-0 cursor-pointer"
              >
                <Menu size={20} />
              </motion.button>
            )}
          </div>

          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'
              }`} />
              <input
                type="text"
                placeholder="Search engagements, milestones, messages..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 border rounded-full text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20'
                    : 'border-gray-200'
                }`}
              />
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                </div>
              )}
            </div>
          </div>

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
                    ? 'bg-teal-50 border-[#0eb59a] text-[#134e40]'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
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
                    className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl z-50 overflow-hidden"
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
                          whileHover={{ x: 3, backgroundColor: '#FAFBF9' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            navigate(item.path);
                            setGridOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                          style={{ borderLeft: `3px solid ${item.border}` }}
                        >
                          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                            <item.icon size={13} className="text-[#134e40]" />
                          </div>
                          <span className="flex-1 text-sm font-bold text-[#1C3627] text-left">
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
                <Bell size={16} className={showNotifications ? 'text-[#134e40]' : 'text-gray-500'} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5 animate-pulse"
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
                      className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl border-l border-gray-100 z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
                        <h3 className="font-black text-[#1C3627] text-sm">Notifications</h3>
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer border-0 bg-transparent">
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
                            className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${
                              notif.unread ? 'bg-teal-50/20' : ''
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1C3627] leading-tight text-left">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed text-left">
                                {notif.desc}
                              </p>
                              <p className="text-[10px] text-gray-300 font-semibold mt-1 text-left">
                                {notif.time}
                              </p>
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
                  profile?.full_name
                    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'EX'
                )}
              </motion.div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f4f7f5] [&::-webkit-scrollbar]:hidden">
          {engagementsList.length === 0 ? (
            <div className="max-w-md mx-auto px-6 py-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
              <Activity size={48} className="text-[#0eb59a] mb-4 animate-pulse" />
              <h2 className="text-xl font-black text-gray-900 mb-2">No Active Engagements</h2>
              <p className="text-sm text-gray-500 mb-6">
                You do not have any active client engagements at the moment. Active projects and milestone payments will appear here once you connect with a company and sign a contract.
              </p>
              <button
                onClick={() => navigate('/expert-opportunities')}
                className="px-6 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer border-0"
              >
                Browse Available Opportunities
              </button>
            </div>
          ) : showEngagementList ? (
            /* ══ LIST VIEW ══ */
            <div className="max-w-5xl mx-auto px-6 py-8 pb-16">
              
              {/* Brand-consistent page hero */}
              <div
                className="relative overflow-hidden border border-teal-100/60 rounded-3xl mb-8"
                style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5f1 50%, #f8fafc 100%)' }}
              >
                <FormalCardBorder />
                <div
                  className="absolute inset-0 opacity-[0.25]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(14,181,154,0.12) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="absolute top-0 right-0 w-40 h-20 bg-[#0eb59a]/8 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 px-6 py-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <h1
                        className="text-2xl sm:text-3xl font-black text-[#1C3627] tracking-tight text-left"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        My Engagements
                      </h1>
                      {/* Stats pills */}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#134e40] bg-[#f0fdf4] border border-[#0eb59a]/20 px-3 py-1 rounded-full">
                          <Activity size={11} className="text-[#0eb59a]" />
                          {engagementsList.length} active
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                          <AlertCircle size={11} />
                          2 actions pending
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                          <TrendingUp size={11} />
                          52% avg completion
                        </span>
                      </div>

                      {/* Performance summary strip */}
                      <div className="flex items-center gap-5 mt-4 flex-wrap">
                        {[
                          { label: 'Total Monthly Value', value: '₹5.5L/mo', color: 'text-[#134e40]' },
                          { label: 'In Escrow', value: '₹1,20,000', color: 'text-amber-600' },
                          { label: 'Next Payout', value: 'Apr 30, 2025', color: 'text-[#0eb59a]' },
                          { label: 'Milestones Due', value: '1 this month', color: 'text-red-500' },
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                              {item.label}
                            </span>
                            <span className={`text-sm font-black ${item.color}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Find More Roles button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/expert-opportunities')}
                      className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0 border-0"
                    >
                      <Briefcase size={14} />
                      Find More Roles
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-3 gap-4 mb-8 text-left"
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
                    className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${stat.border} shadow-sm relative`}
                  >
                    <FormalCardBorder />
                    {/* Change content to be slightly centered */}
                    <div className="flex flex-col items-center justify-center text-center pt-2">
                      <div className={`w-10 h-10 ${stat.bg} rounded-2xl flex items-center justify-center mb-3 shadow-sm`}>
                        {stat.label === 'This Month' ? (
                          <span className={`text-base font-black ${stat.color}`}>₹</span>
                        ) : (
                          <stat.icon size={18} className={stat.color} />
                        )}
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none mb-1.5">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Engagement Cards */}
              <div className="space-y-5 text-left">
                {engagementsList.map((eng, idx) => (
                  <motion.div
                    key={eng.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.07)' }}
                    onClick={() => { setSelectedEngagement(eng.id); setShowEngagementList(false); setActiveTab('Overview'); }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 cursor-pointer group transition-all relative overflow-hidden"
                  >
                    <FormalCardBorder />
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#134e40] via-[#0eb59a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />
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

              {/* ── UPCOMING MILESTONES ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative mt-6"
              >
                <FormalCardBorder />
                <div className="h-0.5 bg-gradient-to-r from-[#134e40] via-[#0eb59a] to-transparent" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <Target size={15} className="text-[#0eb59a]" />
                      Upcoming Milestones
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedEngagement('1');
                        setShowEngagementList(false);
                        setActiveTab('Milestones');
                      }}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      View All →
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      const upcomingMsList = isDemo ? [
                        {
                          title: 'Investor Deck & Data Room',
                          engagement: 'Series B Funding Strategy',
                          company: 'Acme Corp',
                          due: 'Apr 30, 2025',
                          payment: '₹2.5L',
                          status: 'in_progress',
                          urgency: 'border-l-amber-400',
                          engId: '1',
                        },
                        {
                          title: 'Due Diligence Report',
                          engagement: 'Financial Due Diligence',
                          company: 'TechScale Ventures',
                          due: 'May 15, 2025',
                          payment: '₹2L',
                          status: 'upcoming',
                          urgency: 'border-l-gray-300',
                          engId: '2',
                        },
                      ] : dbEscrowAccounts.flatMap(ea => (ea.milestones || [])
                          .filter(m => m.status === 'in_progress' || m.status === 'upcoming')
                          .map(m => ({
                            title: m.title,
                            engagement: ea.engagement,
                            company: ea.company || 'Acme Corp',
                            due: m.dueDate,
                            payment: m.payment,
                            status: m.status,
                            urgency: m.status === 'in_progress' ? 'border-l-amber-400' : 'border-l-gray-300',
                            engId: ea.id,
                          }))
                      );

                      if (upcomingMsList.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <CheckCircle size={24} className="text-emerald-500 mb-2" />
                            <p className="text-xs font-bold text-gray-500">All milestones completed!</p>
                            <p className="text-[10px] text-gray-400 mt-1">There are no upcoming milestones for your active engagements.</p>
                          </div>
                        );
                      }

                      return upcomingMsList.map((ms, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setSelectedEngagement(ms.engId);
                            setShowEngagementList(false);
                            setActiveTab('Milestones');
                          }}
                          className={`flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 border-l-4 ${ms.urgency} cursor-pointer transition-all group`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            ms.status === 'in_progress' ? 'bg-amber-50' : 'bg-gray-100'
                          }`}>
                            {ms.status === 'in_progress' ? (
                              <Clock size={15} className="text-amber-500" />
                            ) : (
                              <Circle size={15} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-800 group-hover:text-[#134e40] transition-colors truncate">
                              {ms.title}
                            </p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">
                              {ms.company} · Due {ms.due}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-[#134e40]">{ms.payment}</p>
                            <p className={`text-[10px] font-bold mt-0.5 ${
                              ms.status === 'in_progress' ? 'text-amber-500' : 'text-gray-400'
                            }`}>
                              {ms.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0eb59a] transition-colors shrink-0" />
                        </motion.div>
                      ));
                    })()}
                  </div>
                </div>
              </motion.div>

              {/* ── EARNINGS SNAPSHOT ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl overflow-hidden shadow-lg relative mt-5"
                style={{ background: 'linear-gradient(135deg, #134e40 0%, #0eb59a 100%)' }}
              >
                <FormalCardBorder />
                <div className="p-5 text-white relative overflow-hidden">
                  <Shield size={60} className="absolute -right-4 -bottom-4 text-white/5" />
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                        Earnings This Month
                      </p>
                      <p className="text-2xl font-black mt-0.5">₹5,50,000</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/expert-earnings')}
                      className="px-4 py-2 bg-white/15 text-white text-xs font-black rounded-xl transition-all border border-white/20 cursor-pointer"
                    >
                      View Earnings →
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Received', value: '₹3,50,000', sub: '2 milestones' },
                      { label: 'In Escrow', value: '₹1,20,000', sub: 'Pending approval' },
                      { label: 'Upcoming', value: '₹80,000', sub: 'Next payout' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm text-left">
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-black text-white">{item.value}</p>
                        <p className="text-[9px] text-white/50 mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* ══ WORKSPACE VIEW ══ */
            <div className="flex flex-col h-full">
              
              {/* Sticky sub-header (engagement info + tabs) */}
              <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4">

                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 text-left">
                    <button onClick={() => navigate('/expert-dashboard')} className="hover:text-[#0eb59a] font-semibold transition-colors border-0 bg-transparent cursor-pointer">Dashboard</button>
                    <ChevronRight size={14} />
                    <button onClick={() => setShowEngagementList(true)} className="hover:text-[#0eb59a] font-semibold transition-colors border-0 bg-transparent cursor-pointer">My Engagements</button>
                    <ChevronRight size={14} />
                    <span className="text-gray-700 font-bold truncate">{engagement.title}</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ x: -3 }}
                        onClick={() => setShowEngagementList(true)}
                        className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
                      >
                        <ArrowLeft size={16} />
                      </motion.button>

                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${engagement.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                          <span className="text-white font-black text-base">{engagement.companyLogo}</span>
                        </div>
                        <div className="text-left">
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
                      <div className="hidden md:block text-left">
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
                  <div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ y: -1 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold transition-all relative shrink-0 border-0 bg-transparent cursor-pointer ${
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

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
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
                        className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 text-left"
                      >
                        {/* Left */}
                        <div className="lg:col-span-2 space-y-5">

                          {/* KPIs */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                                className={`bg-white rounded-2xl p-4 border border-gray-100 border-l-4 ${kpi.border} shadow-sm relative`}
                              >
                                <FormalCardBorder />
                                <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                                  <kpi.icon size={15} className={kpi.color} />
                                </div>
                                <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{kpi.label}</p>
                              </motion.div>
                            ))}
                          </div>

                          {/* Progress */}
                          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                            <FormalCardBorder />
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
                          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                            <FormalCardBorder />
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#0eb59a]" /> Milestone Summary
                              </h3>
                              <button
                                onClick={() => setActiveTab('Milestones')}
                                className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                              >
                                View All <ChevronRight size={12} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 relative overflow-hidden"
                          >
                            <FormalCardBorder />
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
                              className="w-full mt-4 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
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
                            <FormalCardBorder />
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
                            <div className="relative z-10">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield size={16} className="text-[#0eb59a]" />
                                <h3 className="font-black text-sm">PMO Support</h3>
                              </div>
                              <p className="text-xs text-white/60 mb-3 leading-relaxed">
                                Your engagement is supported by our ExigentCX PMO team.
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
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 relative overflow-hidden"
                          >
                            <FormalCardBorder />
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
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#0eb59a] transition-all border-0 bg-transparent text-left cursor-pointer"
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
                        className="space-y-5 text-left"
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
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shrink-0 border-0 cursor-pointer"
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
                                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm ${
                                    ms.status === 'approved' ? 'bg-emerald-500' :
                                    ms.status === 'in_progress' ? 'bg-amber-500' :
                                    ms.status === 'submitted' ? 'bg-blue-500' : 'bg-gray-100 border border-gray-200'
                                  }`}>
                                    {ms.status === 'approved'
                                      ? <Check className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" strokeWidth={3} />
                                      : ms.status === 'in_progress'
                                      ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                          <Clock className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" />
                                        </motion.div>
                                      : ms.status === 'submitted'
                                      ? <CheckCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" />
                                      : <span className="text-sm font-black text-gray-400">{idx + 1}</span>
                                    }
                                  </div>

                                  {/* Card */}
                                  <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all relative overflow-hidden">
                                    <FormalCardBorder />
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-black text-gray-900 text-sm sm:text-base">{ms.title}</h4>
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
                                                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] transition-colors opacity-0 group-hover:opacity-100 border-0 bg-transparent cursor-pointer"
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
                                        className="flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl transition-all shadow-md w-full border-0 cursor-pointer"
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
                        className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                        style={{ height: 'calc(100vh - 200px)' }}
                      >
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 p-5 border-b border-gray-100 bg-gray-50/50 text-left">
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
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white text-xs font-black shrink-0 overflow-hidden">
                                    {profile?.profile_url ? (
                                      <img src={profile.profile_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                      profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EX'
                                    )}
                                  </div>
                                ) : (
                                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${engagement.logoColor} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                                    {engagement.companyLogo}
                                  </div>
                                )}
                                <div className={`max-w-md flex flex-col gap-1 ${isExpert ? 'items-end' : 'items-start'}`}>
                                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed text-left ${
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
                              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#0eb59a] transition-colors shrink-0 cursor-pointer"
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
                              className={`p-3 rounded-2xl shrink-0 transition-all border-0 cursor-pointer ${
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
                        className="space-y-5 text-left"
                      >
                        {/* Upload area */}
                        <motion.div
                          whileHover={{ borderColor: '#0eb59a' }}
                          className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center cursor-pointer transition-all group relative overflow-hidden"
                        >
                          <FormalCardBorder />
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
                              <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2 text-left">
                                {category === 'Deliverable'
                                  ? <Upload size={15} className="text-[#0eb59a]" />
                                  : <Shield size={15} className="text-blue-500" />
                                }
                                {category} Documents
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                                  {catDocs.length}
                                </span>
                              </h3>
                              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left relative">
                                <FormalCardBorder />
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
                                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all border-0 bg-transparent cursor-pointer"
                                        >
                                          <Eye size={14} />
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all border-0 bg-transparent cursor-pointer"
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
                        className="space-y-5 text-left"
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
                              className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${kpi.border} shadow-sm relative`}
                            >
                              <FormalCardBorder />
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
                              Payments are held in escrow by ExigentCX. When you submit a milestone and the company approves it, the payment is automatically released to your account within 24 hours.
                            </p>
                          </div>
                        </div>

                        {/* Payment table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                          <FormalCardBorder />
                          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-black text-gray-900 text-sm">Payment Schedule</h3>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors border-0 bg-transparent cursor-pointer"
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
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ SUBMIT DELIVERABLE MODAL (keep exactly) ══ */}
      <AnimatePresence>
        {showSubmitModal && (
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
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
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
                    <div className="mb-5 text-left">
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
                    <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-5 text-left">
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
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl border-0 cursor-pointer"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-lg transition-all border-0 cursor-pointer"
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
