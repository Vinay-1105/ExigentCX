import Logo from '../components/Logo';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Clock, CheckCircle, XCircle,
  Upload, Download, Send, Paperclip, MoreVertical,
  DollarSign, Shield, AlertCircle, Calendar,
  FileText, MessageSquare, BarChart2, CreditCard,
  Check, X, Star, Users, Briefcase, ArrowLeft,
  Lock, Unlock, Eye, TrendingUp, Zap, Circle,
  ChevronDown, Image, File, Film, Archive,
  LayoutDashboard, FileText as FileTextIcon,
  Bell, Settings, ShieldCheck, ChevronLeft, Users as UsersIcon,
  BarChart2 as BarChart2Icon, LogOut, Plus
} from 'lucide-react';
import FormalCardBorder from '../components/FormalCardBorder';

const EngagementWorkspace = () => {
  const navigate = useNavigate();
  const { engagementId } = useParams();
  const location = useLocation();

  // Authentication Guard
  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';

    const checkAuth = async () => {
      if (isDemo) {
        setCompanyProfile({ company_name: 'Acme Corp.', admin_email: 'demo@cxo.com' });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company/profile`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompanyProfile(data);
        }
      } catch (err) {
        console.error("Error fetching company profile:", err);
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

  const [companyProfile, setCompanyProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const formattedTab = tabParam.charAt(0).toUpperCase() + tabParam.slice(1).toLowerCase();
      const validTabs = ['Overview', 'Milestones', 'Messages', 'Documents', 'Payments'];
      if (validTabs.includes(formattedTab)) {
        setActiveTab(formattedTab);
      }
    }
  }, [location]);
  const [messageText, setMessageText] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Dynamic Workspace State
  const [engagement, setEngagement] = useState({
    id: engagementId || '1',
    title: 'Series B Funding Strategy',
    status: 'IN PROGRESS',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
    expert: {
      id: 2,
      name: 'David Chen',
      title: 'Interim CFO',
      avatar: 'https://i.pravatar.cc/150?u=david',
      rating: 5.0,
      exRole: 'Ex-CFO at Meesho & OYO',
    },
    type: 'Interim',
    startDate: '1 Feb 2025',
    endDate: '31 Jul 2025',
    duration: '6 months',
    commitment: '40 hrs/wk',
    budget: '₹3L/mo',
    totalValue: '₹18L',
    escrowBalance: '₹6L',
    spent: '₹9L',
    progress: 65,
    nextMilestone: 'Financial Model Draft',
    daysLeft: 87,
    pmContact: 'Riya Sharma',
    pmEmail: 'riya@cxoconnect.com',
  });
  const [milestones, setMilestones] = useState([]);
  const [payments, setPayments] = useState([]);

  const [hasNoEngagement, setHasNoEngagement] = useState(false);
  const [loadingEngagement, setLoadingEngagement] = useState(true);

  const fetchEngagementData = async () => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    let token = "demo-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      token = session.access_token;
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

    setLoadingEngagement(true);

    try {
      let activeId = engagementId;
      if (!isDemo && !activeId) {
        // Fetch escrows list to find the first engagement ID
        const escrowsRes = await fetch(`${baseUrl}/api/payments/escrows`, { headers });
        if (escrowsRes.ok) {
          const escrowsData = await escrowsRes.json();
          if (escrowsData && escrowsData.length > 0) {
            activeId = escrowsData[0].id;
          } else {
            setHasNoEngagement(true);
            setLoadingEngagement(false);
            return;
          }
        } else {
          setHasNoEngagement(true);
          setLoadingEngagement(false);
          return;
        }
      } else if (isDemo && !activeId) {
        activeId = '1';
      }

      const res = await fetch(`${baseUrl}/api/payments/engagement/${activeId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEngagement(data.engagement);
        setMilestones(data.milestones);
        setPayments(data.payments);
        setHasNoEngagement(false);
      } else {
        if (!isDemo) setHasNoEngagement(true);
      }
    } catch (err) {
      console.error("Error loading workspace data:", err);
      if (!isDemo) setHasNoEngagement(true);
    } finally {
      setLoadingEngagement(false);
    }
  };

  useEffect(() => {
    fetchEngagementData();
  }, [companyProfile, engagementId]);

  const handleApproveAndReleaseMilestone = async (milestone) => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    let token = "demo-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      token = session.access_token;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${baseUrl}/api/payments/escrow/request-release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          engagementId: engagement.id,
          milestoneId: milestone.id
        })
      });

      if (res.ok) {
        setShowApproveModal(null);
        setRating(0);
        fetchEngagementData();
      } else {
        const data = await res.json();
        alert("Error requesting release: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentRelease = async (payment) => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    let token = "demo-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      token = session.access_token;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${baseUrl}/api/payments/escrow/request-release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          engagementId: engagement.id,
          milestoneId: payment.dbMilestoneId
        })
      });

      if (res.ok) {
        setShowPaymentModal(null);
        fetchEngagementData();
      } else {
        const data = await res.json();
        alert("Error requesting release: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'expert',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?u=david',
      text: 'Hi team, I have completed the initial financial model draft. Please review the attached document and let me know your feedback.',
      time: '10:30 AM',
      date: 'Today',
      read: true,
    },
    {
      id: 2,
      sender: 'company',
      name: 'Acme Corp',
      avatar: '',
      text: 'Thanks David! We will review it today and get back to you with feedback by EOD.',
      time: '11:15 AM',
      date: 'Today',
      read: true,
    },
    {
      id: 3,
      sender: 'expert',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?u=david',
      text: 'Perfect. Also, I wanted to flag that the investor deck needs to be updated with Q4 numbers before the next board meeting. Should we schedule a call this week?',
      time: '2:45 PM',
      date: 'Today',
      read: true,
    },
    {
      id: 4,
      sender: 'company',
      name: 'Acme Corp',
      avatar: '',
      text: 'Yes, let us schedule Thursday 3pm. I will send a calendar invite.',
      time: '3:10 PM',
      date: 'Today',
      read: true,
    },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];

  const notifications = [
    { id: 1, title: 'Milestone Pending Approval', desc: 'Investor Deck & Data Room awaits your review', time: '2 min ago', unread: true, color: 'bg-amber-500' },
    { id: 2, title: 'Message from David Chen', desc: 'I have completed the financial model draft...', time: '1 hour ago', unread: true, color: 'bg-blue-500' },
    { id: 3, title: 'Payment Released', desc: '₹2L released for Financial Model Development', time: '2 days ago', unread: false, color: 'bg-emerald-500' },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const tabs = [
    { id: 'Overview', icon: BarChart2 },
    { id: 'Milestones', icon: CheckCircle },
    { id: 'Messages', icon: MessageSquare },
    { id: 'Documents', icon: FileText },
    { id: 'Payments', icon: CreditCard },
  ];

  // ── ENGAGEMENT DATA ──
  // Static engagement data, milestones, and payments have been converted to dynamic React state.

  const documents = [
    { id: 1, name: 'Engagement Agreement.pdf', size: '1.2 MB', type: 'pdf', uploadedBy: 'ExigentCX', date: 'Feb 1, 2025', category: 'Legal', signed: true },
    { id: 2, name: 'NDA — Acme Corp & David Chen.pdf', size: '0.6 MB', type: 'pdf', uploadedBy: 'ExigentCX', date: 'Feb 1, 2025', category: 'Legal', signed: true },
    { id: 3, name: 'Financial Model v2.xlsx', size: '3.8 MB', type: 'excel', uploadedBy: 'David Chen', date: 'Mar 28, 2025', category: 'Deliverable', signed: false },
    { id: 4, name: 'Investor Deck Final.pptx', size: '8.4 MB', type: 'ppt', uploadedBy: 'David Chen', date: 'Apr 25, 2025', category: 'Deliverable', signed: false },
    { id: 5, name: 'Data Room Index.pdf', size: '0.8 MB', type: 'pdf', uploadedBy: 'David Chen', date: 'Apr 25, 2025', category: 'Deliverable', signed: false },
    { id: 6, name: 'Business Assessment Report.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'David Chen', date: 'Feb 25, 2025', category: 'Deliverable', signed: false },
  ];

  // ── HELPERS ──
  const getMilestoneStatus = (status) => {
    switch (status) {
      case 'completed': return { label: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };
      case 'pending_approval': return { label: 'Pending Approval', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertCircle };
      case 'pending_admin_release': return { label: 'Awaiting Admin Release', color: 'text-amber-650 bg-amber-50 border-amber-200 text-amber-600', icon: AlertCircle };
      case 'in_progress': return { label: 'In Progress', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock };
      case 'upcoming': return { label: 'Upcoming', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Circle };
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
      case 'released': return { label: 'Released', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: Unlock };
      case 'in_escrow': return { label: 'In Escrow', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Lock };
      case 'locked': return { label: 'Locked', color: 'text-gray-400 bg-gray-50 border-gray-200', icon: Lock };
      default: return { label: status, color: 'text-gray-400 bg-gray-50', icon: Lock };
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'company',
      name: 'Acme Corp',
      avatar: '',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      read: true,
    }]);
    setMessageText('');
  };

  // Export payments as CSV
  const handleExportPayments = () => {
    const csvContent = [
      ['Milestone', 'Amount', 'Date', 'Status', 'Transaction ID'],
      ...payments.map(p => [p.milestone, p.amount, p.date, p.status, p.txId])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${engagement.title}_Payments.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download document (mock)
  const handleDocumentDownload = (doc) => {
    alert(`Downloading: ${doc.name}`);
    // In production: fetch from Supabase storage and trigger download
  };

  // View document (mock)
  const handleDocumentView = (doc) => {
    alert(`Opening: ${doc.name}`);
    // In production: open signed URL in new tab
  };

  // Handle file upload
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.xlsx,.pptx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`File selected: ${file.name}. Upload functionality connects to Supabase storage.`);
      }
    };
    input.click();
  };

  // Handle paperclip attachment
  const handleAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'company',
          name: 'Acme Corp',
          avatar: '',
          text: `📎 Attached: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
          read: true,
        }]);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5]">

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50">
          <motion.div
            animate={{ width: isSidebarOpen ? 'auto' : 0, opacity: isSidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0 flex items-center"
          >
            <div className="cursor-pointer" onClick={() => window.location.reload()}><Logo variant="dark" className="h-8" /></div>
          </motion.div>
          <motion.button
            animate={{ marginLeft: isSidebarOpen ? 'auto' : 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#134e40] hover:bg-gray-100 transition-all shrink-0"
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
            const isActive = item.active || window.location.pathname === item.path || (item.path === '/engagements' && window.location.pathname.startsWith('/engagements')) || (item.path === '/requirements' && window.location.pathname.startsWith('/requirements')) || (item.path === '/experts' && window.location.pathname.startsWith('/experts'));
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
                  animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
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
        <div className="p-3 border-t border-gray-50 space-y-1">
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

          {window.location.pathname === '/settings' && (
            <motion.button
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
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
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 relative font-bold text-left"
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
          )}
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          width: `calc(100vw - ${isSidebarOpen ? 260 : 68}px)`,
        }}
      >

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-6 py-3 flex items-center gap-4">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-1">
              <button onClick={() => navigate('/company-dashboard')} className="hover:text-[#134e40] font-semibold transition-colors">Dashboard</button>
              <ChevronRight size={12} className="text-gray-300" />
              <button onClick={() => navigate(-1)} className="hover:text-[#134e40] font-semibold transition-colors">Engagements</button>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-[#134e40] font-bold truncate">{engagement.title}</span>
            </div>

            {/* Right — bell + avatar */}
            <div className="flex items-center gap-3 shrink-0">

              {/* Notification bell */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] hover:bg-gray-100 transition-all relative"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                          <h4 className="font-black text-[#1C3627] text-sm">Notifications</h4>
                          <span className="text-[10px] font-bold text-[#0eb59a] cursor-pointer">Mark all read</span>
                        </div>
                        {notifications.map((notif, idx) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${notif.unread ? 'bg-teal-50/20' : ''}`}
                          >
                            <div className={`w-8 h-8 ${notif.color} rounded-xl flex items-center justify-center shrink-0`}>
                              <Bell size={13} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-[#1C3627] mb-0.5">{notif.title}</p>
                              <p className="text-[11px] text-gray-500">{notif.desc}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                            </div>
                            {notif.unread && <div className="w-2 h-2 bg-[#0eb59a] rounded-full shrink-0 mt-1" />}
                          </motion.div>
                        ))}
                        <div className="px-4 py-3 border-t border-gray-50 text-center">
                          <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">View all notifications →</button>
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
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md transition-all duration-200 overflow-hidden"
              title="Account"
              onClick={() => navigate('/settings')}
            >
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </motion.div>
            </div>
          </div>

          {/* ── ENGAGEMENT META BAR ── */}
          <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-4">

            {/* Back + Expert info */}
            <div className="flex items-center gap-3 flex-1">
              <motion.button
                whileHover={{ x: -3, scale: 1.05, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#134e40] hover:bg-gray-100 transition-all"
              >
                <ArrowLeft size={15} />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={engagement.expert.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-black text-[#1C3627]">{engagement.title}</h1>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${engagement.statusColor}`}>
                      <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1 rounded-full bg-current" />
                      {engagement.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">
                    with <span className="font-bold text-gray-600">{engagement.expert.name}</span>
                    <span className="mx-1">·</span>{engagement.expert.title}
                    <span className="mx-1">·</span>
                    <span className="text-[#0eb59a] font-bold">{engagement.daysLeft} days left</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress + PMO */}
            <div className="flex items-center gap-4 shrink-0">
              <div>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Progress</span>
                  <span className="text-[10px] font-black text-[#134e40]">{engagement.progress}%</span>
                </div>
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${engagement.progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#134e40]/8 border border-[#134e40]/15 px-3 py-2 rounded-xl">
                <Shield size={13} className="text-[#0eb59a]" />
                <span className="text-[11px] font-bold text-[#134e40]">PMO: {engagement.pmContact}</span>
              </div>
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="px-6 flex gap-0 border-t border-gray-50 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold transition-all relative shrink-0 ${
                  activeTab === tab.id
                    ? 'text-[#134e40]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={13} />
                {tab.id}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="wsTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0eb59a] rounded-full"
                  />
                )}
                {tab.id === 'Milestones' && milestones.filter(m => m.status === 'pending_approval').length > 0 && (
                  <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {milestones.filter(m => m.status === 'pending_approval').length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="flex-1 px-6 py-6 pb-16 overflow-y-auto">
          {hasNoEngagement ? (
            <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
              <Activity size={48} className="text-[#0eb59a] mb-4 animate-pulse" />
              <h2 className="text-xl font-black text-gray-900 mb-2">No Active Engagements</h2>
              <p className="text-sm text-gray-500 mb-6">
                You do not have any active expert engagements at the moment. Active projects, milestones, and escrow payments will appear here once you contract with an expert.
              </p>
              <button
                onClick={() => navigate('/experts')}
                className="px-6 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer border-0"
              >
                Browse Experts
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">

            {/* ══ TAB 1: OVERVIEW ══ */}
            {activeTab === 'Overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-5"
              >
                {/* Left — 2/3 */}
                <div className="lg:col-span-2 space-y-5">

                  {/* ── KPI CARDS — Horizontal compact widgets ── */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Value', value: engagement.totalValue, icon: TrendingUp, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', numColor: 'text-[#134e40]', border: 'border-l-[#0eb59a]' },
                      { label: 'In Escrow', value: engagement.escrowBalance, icon: Lock, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', numColor: 'text-amber-700', border: 'border-l-amber-400' },
                      { label: 'Released', value: engagement.spent, icon: Unlock, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', numColor: 'text-emerald-700', border: 'border-l-emerald-400' },
                      { label: 'Days Left', value: engagement.daysLeft, icon: Calendar, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', numColor: 'text-blue-700', border: 'border-l-blue-400' },
                    ].map((kpi, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                        className={`bg-white rounded-2xl p-4 border-l-4 ${kpi.border} cursor-default relative overflow-hidden`}
                        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                      >
                        <FormalCardBorder />
                        {/* Icon + label inline */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 ${kpi.iconBg} rounded-md flex items-center justify-center shrink-0`}>
                            <kpi.icon size={12} className={kpi.iconColor} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">{kpi.label}</span>
                        </div>
                        <p className={`text-[22px] font-black ${kpi.numColor} tracking-tight leading-none text-left`}>{kpi.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* ── ENGAGEMENT PROGRESS ── */}
                  <div className="bg-white rounded-2xl p-5 relative overflow-hidden" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                    <FormalCardBorder />
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 text-left">
                        <BarChart2 size={15} className="text-[#0eb59a]" /> Engagement Progress
                      </h3>
                      <span className="text-xl font-black text-[#134e40]">{engagement.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
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
                    <div className="flex justify-between text-xs">
                      <div className="text-left">
                        <p className="font-black text-[#134e40] text-[10px] uppercase tracking-wide mb-0.5 text-left">Start</p>
                        <p className="text-gray-500 font-semibold text-left">{engagement.startDate}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 text-left">Next Milestone</p>
                        <p className="text-gray-600 font-semibold text-left">{engagement.nextMilestone}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-gray-400 text-[10px] uppercase tracking-wide mb-0.5 text-left">End</p>
                        <p className="text-gray-500 font-semibold text-left">{engagement.endDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* ── MILESTONE SUMMARY ── */}
                  <div className="bg-white rounded-2xl p-5 relative overflow-hidden" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                    <FormalCardBorder />
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 text-left">
                        <CheckCircle size={15} className="text-[#0eb59a]" /> Milestone Summary
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05, color: '#0eb59a', transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab('Milestones')}
                        className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                      >
                        View All <ChevronRight size={12} />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {milestones.map((ms, idx) => {
                        const statusInfo = getMilestoneStatus(ms.status);
                        return (
                          <motion.div
                            key={ms.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            whileHover={{ x: 4, backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                            onClick={() => setActiveTab('Milestones')}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFBF9] transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              ms.status === 'completed' ? 'bg-emerald-500' :
                              ms.status === 'pending_approval' ? 'bg-amber-500' :
                              ms.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-100'
                            }`}>
                              {ms.status === 'completed' ? <Check size={13} className="text-white" strokeWidth={3} /> :
                               ms.status === 'pending_approval' ? <AlertCircle size={13} className="text-white" /> :
                               ms.status === 'in_progress' ? (
                                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                   <Clock size={13} className="text-white" />
                                 </motion.div>
                               ) : <Circle size={13} className="text-gray-400" />}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold text-[#1C3627] truncate text-left">{ms.title}</p>
                              <p className="text-[10px] text-gray-400 font-medium text-left">Due {ms.dueDate} · {ms.payment}</p>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right — 1/3 */}
                <div className="space-y-4">

                  {/* Expert Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all text-left relative overflow-hidden"
                  >
                    <FormalCardBorder />
                    <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-1.5 text-left">
                      <Users size={14} className="text-[#0eb59a]" /> Expert Details
                    </h3>
                    <div className="flex items-center gap-3 mb-4 bg-teal-50/40 p-3 rounded-xl border border-teal-50">
                      <div className="relative">
                        <img src={engagement.expert.avatar} className="w-11 h-11 rounded-xl object-cover shadow-sm" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-[#1C3627] text-sm text-left">{engagement.expert.name}</p>
                        <p className="text-xs text-gray-500 font-medium text-left">{engagement.expert.title}</p>
                        <div className="flex items-center gap-1 mt-0.5 justify-start">
                          <Star size={10} fill="#F59E0B" className="text-amber-400" />
                          <span className="text-xs font-black text-gray-700">{engagement.expert.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {[
                        { label: 'Type', value: engagement.type, badgeBg: 'bg-teal-50/50 text-[#134e40]' },
                        { label: 'Commitment', value: engagement.commitment, badgeBg: 'bg-[#fafbfa] text-gray-700' },
                        { label: 'Duration', value: engagement.duration, badgeBg: 'bg-[#fafbfa] text-gray-700' },
                        { label: 'Budget', value: engagement.budget, badgeBg: 'bg-amber-50/60 text-amber-800 font-extrabold' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                          <span className="text-[11px] text-gray-400 font-semibold text-left">{item.label}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${item.badgeBg} text-right`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(20,78,64,0.25)', transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab('Messages')}
                      className="w-full py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={12} /> Message {engagement.expert.name.split(' ')[0]}
                    </motion.button>
                  </motion.div>

                  {/* PMO Governance */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-2xl p-5 text-white relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
                    <div className="relative z-10 text-left">
                      <div className="flex items-center gap-2 mb-2 justify-start">
                        <Shield size={14} className="text-[#0eb59a]" />
                        <h3 className="font-black text-sm text-left">PMO Governance</h3>
                      </div>
                      <p className="text-xs text-white/60 mb-3 leading-relaxed text-left">
                        Your engagement is managed and monitored by our ExigentCX PMO team.
                      </p>
                      <div className="space-y-2">
                        {[
                          { label: 'PMO Manager', value: engagement.pmContact },
                          { label: 'Contact', value: engagement.pmEmail },
                          { label: 'SLA', value: '< 4 hours response' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-white/50 font-semibold text-left">{item.label}</span>
                            <span className="text-white font-bold text-right">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all text-left relative overflow-hidden"
                  >
                    <FormalCardBorder />
                    <h3 className="font-black text-gray-900 text-sm mb-3 text-left">Quick Actions</h3>
                    <div className="space-y-1">
                      {[
                        { label: 'View Documents', icon: FileText, action: () => setActiveTab('Documents'), color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Payment History', icon: CreditCard, action: () => setActiveTab('Payments'), color: 'text-[#0eb59a]', bg: 'bg-teal-50' },
                        { label: 'View Expert Profile', icon: Users, action: () => navigate(`/experts/${engagement.expert.id || 2}`), color: 'text-purple-500', bg: 'bg-purple-50' },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 4, backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.97 }}
                          onClick={item.action}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                        >
                          <div className={`w-7 h-7 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                            <item.icon size={13} className={item.color} />
                          </div>
                          <span className="text-xs font-bold text-gray-600 group-hover:text-[#134e40] transition-colors flex-1 text-left">{item.label}</span>
                          <ChevronRight size={12} className="text-gray-300 group-hover:text-[#0eb59a] transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            )}

            {/* ══ TAB 2: MILESTONES ══ */}
            {activeTab === 'Milestones' && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Pending approval banner */}
                {milestones.some(m => m.status === 'pending_approval') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-left"
                  >
                    <AlertCircle size={20} className="text-amber-500 shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="font-black text-amber-800 text-sm text-left">Action Required</p>
                      <p className="text-xs text-amber-600 text-left">
                        {milestones.filter(m => m.status === 'pending_approval').length} milestone(s) are awaiting your approval. Review and approve to release payment.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 6px 15px rgba(245,158,11,0.3)', transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const pending = milestones.find(m => m.status === 'pending_approval');
                        if (pending) setShowApproveModal(pending);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shrink-0"
                    >
                      Review Now
                    </motion.button>
                  </motion.div>
                )}

                {/* Milestone Timeline */}
                <div className="relative">
                  {/* Vertical line */}
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
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          className={`relative flex gap-4 ${ms.status === 'upcoming' ? 'opacity-60' : ''}`}
                        >
                          {/* Timeline dot */}
                          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm ${
                            ms.status === 'completed' ? 'bg-emerald-500' :
                            ms.status === 'pending_approval' ? 'bg-amber-500' :
                            ms.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-100 border border-gray-200'
                          }`}>
                            {ms.status === 'completed' ? (
                              <Check className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" strokeWidth={3} />
                            ) : ms.status === 'pending_approval' ? (
                              <AlertCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" />
                            ) : ms.status === 'in_progress' ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                <Clock className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" />
                              </motion.div>
                            ) : (
                              <span className="text-sm font-black text-gray-400">{idx + 1}</span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all text-left">
                            <div className="flex items-start justify-between mb-3 text-left">
                              <div className="text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1 text-left">
                                  <h4 className="font-black text-gray-900 text-sm sm:text-base text-left">{ms.title}</h4>
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border w-fit ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed text-left">{ms.desc}</p>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <p className="font-black text-[#134e40] text-lg text-right">{ms.payment}</p>
                                <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md border text-right block w-fit ml-auto ${getPaymentStatus(ms.paymentStatus).color}`}>
                                  {getPaymentStatus(ms.paymentStatus).label}
                                </span>
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400 mb-4 text-left">
                              <span className="flex items-center gap-1.5 text-left">
                                <Calendar size={11} className="text-[#0eb59a]" /> Due: {ms.dueDate}
                              </span>
                              {ms.completedDate && (
                                <span className="flex items-center gap-1.5 text-emerald-600 text-left">
                                  <CheckCircle size={11} /> Completed: {ms.completedDate}
                                </span>
                              )}
                            </div>

                            {/* Deliverables */}
                            {ms.deliverables.length > 0 && (
                              <div className="mb-4 text-left">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 text-left">Deliverables</p>
                                <div className="space-y-2">
                                  {ms.deliverables.map((del, dIdx) => {
                                    const fileInfo = getFileIcon(del.type);
                                    return (
                                      <div key={dIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-teal-50 hover:border-teal-100 transition-all cursor-pointer">
                                        <div className={`w-8 h-8 ${fileInfo.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                          <fileInfo.icon size={15} className={fileInfo.color} />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                          <p className="text-xs font-bold text-gray-700 truncate text-left">{del.name}</p>
                                          <p className="text-[10px] text-gray-400 text-left">{del.size}</p>
                                        </div>
                                        <motion.button
                                          whileHover={{ scale: 1.15, color: '#0eb59a' }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleDocumentDownload(del)}
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

                            {/* Action Buttons */}
                            {ms.status === 'pending_approval' && (
                              <div className="flex gap-3 justify-end mt-4">
                                <motion.button
                                  whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(16,185,129,0.25)' }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setShowApproveModal(ms)}
                                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-xl transition-all shadow-md"
                                >
                                  <Check size={14} strokeWidth={3} /> Approve & Request Release {ms.payment}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.03, backgroundColor: '#FEE2E2' }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setShowRejectModal(ms)}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-black rounded-xl transition-all border border-red-100"
                                >
                                  <X size={14} /> Reject
                                </motion.button>
                              </div>
                            )}
                            {ms.status === 'pending_admin_release' && (
                              <div className="flex gap-3 justify-end mt-4">
                                <button
                                  disabled
                                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-black rounded-xl cursor-not-allowed"
                                >
                                  <Clock size={13} /> Awaiting Admin Release ({ms.payment})
                                </button>
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

            {/* ══ TAB 3: MESSAGES ══ */}
            {activeTab === 'Messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-[calc(100vh-240px)] sm:h-[calc(100vh-280px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative"
              >
                <FormalCardBorder />
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-5 border-b border-gray-100 bg-gray-50/50 text-left">
                  <div className="relative">
                    <img src={engagement.expert.avatar} className="w-10 h-10 rounded-2xl object-cover" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 text-sm text-left">{engagement.expert.name}</p>
                    <p className="text-xs text-emerald-500 font-semibold text-left">Online · Responds in {'< 2 hrs'}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
                      {engagement.title}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 [&::-webkit-scrollbar]:hidden text-left">
                  {messages.map((msg, idx) => {
                    const isCompany = msg.sender === 'company';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex gap-3 ${isCompany ? 'flex-row-reverse' : ''}`}
                      >
                        {isCompany ? (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white text-xs font-black shrink-0">
                            AC
                          </div>
                        ) : (
                          <img src={msg.avatar} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                        )}
                        <div className={`max-w-md ${isCompany ? 'items-end' : 'items-start'} flex flex-col gap-1 text-left`}>
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed text-left ${
                            isCompany
                              ? 'bg-gradient-to-br from-[#134e40] to-[#0eb59a] text-white rounded-tr-sm text-left'
                              : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm text-left'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold px-1 text-left">{msg.time}</span>
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
                      onClick={handleAttachment}
                      className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#0eb59a] transition-colors shrink-0"
                    >
                      <Paperclip size={16} />
                    </motion.button>
                    <div className="flex-1 relative">
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

            {/* ══ TAB 4: DOCUMENTS ══ */}
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
                  onClick={handleFileUpload}
                  className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center cursor-pointer transition-all group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-100"
                  >
                    <Upload size={22} className="text-[#0eb59a]" />
                  </motion.div>
                  <p className="font-black text-gray-700 text-sm mb-1">Upload Document</p>
                  <p className="text-xs text-gray-400">Drag & drop or click to upload — PDF, DOCX, XLSX, PPTX up to 25MB</p>
                </motion.div>

                {/* Document categories */}
                {['Legal', 'Deliverable'].map(category => {
                  const catDocs = documents.filter(d => d.category === category);
                  return (
                    <div key={category} className="text-left">
                      <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2 text-left">
                        {category === 'Legal' ? <Shield size={15} className="text-blue-500" /> : <FileText size={15} className="text-[#0eb59a]" />}
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
                              whileHover={{ backgroundColor: '#F0FDF4', transition: { duration: 0.15 } }}
                              className={`flex items-center gap-4 p-4 transition-colors group cursor-pointer ${
                                idx < catDocs.length - 1 ? 'border-b border-gray-50' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 ${fileInfo.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <fileInfo.icon size={18} className={fileInfo.color} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="font-bold text-gray-800 text-sm truncate text-left">{doc.name}</p>
                                <p className="text-xs text-gray-400 font-semibold text-left">
                                  {doc.uploadedBy} · {doc.date} · {doc.size}
                                </p>
                              </div>
                              {doc.signed && (
                                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0 text-left">
                                  <Check size={9} strokeWidth={3} /> Signed
                                </span>
                              )}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <motion.button
                                  whileHover={{ scale: 1.15, backgroundColor: '#F0FDF4' }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDocumentView(doc)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] transition-all"
                                >
                                  <Eye size={14} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15, backgroundColor: '#EFF6FF' }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDocumentDownload(doc)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 transition-all"
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

            {/* ══ TAB 5: PAYMENTS ══ */}
            {activeTab === 'Payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Engagement Value', value: engagement.totalValue, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', desc: 'Full contract value' },
                    { label: 'Released to Expert', value: engagement.spent, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400', desc: '2 milestones paid' },
                    { label: 'In Escrow', value: engagement.escrowBalance, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400', desc: 'Secured by ExigentCX' },
                  ].map((kpi, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                      className={`bg-white rounded-2xl p-4 border-l-4 ${kpi.border} cursor-default`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 ${kpi.bg} rounded-md flex items-center justify-center`}>
                          <kpi.icon size={12} className={kpi.color} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">{kpi.label}</span>
                      </div>
                      <p className="text-[22px] font-black text-gray-900 text-left">{kpi.value}</p>
                      <p className="text-[10px] text-gray-400 text-left mt-1">{kpi.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Escrow info */}
                <div className="bg-teal-50 rounded-2xl border border-teal-100 p-4 flex items-start gap-3">
                  <Shield size={18} className="text-[#0eb59a] shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-black text-[#134e40] text-left">Escrow-backed payments</p>
                    <p className="text-xs text-teal-700 mt-0.5 leading-relaxed text-left">
                      All payments are held in escrow by ExigentCX and released only after you approve each milestone.
                    </p>
                  </div>
                </div>

                {/* Payment Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left relative">
                  <FormalCardBorder />
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between text-left">
                    <h3 className="font-black text-gray-900 text-sm text-left">Payment Schedule</h3>
                    <motion.button
                      whileHover={{ scale: 1.05, color: '#0eb59a', transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleExportPayments}
                      className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0eb59a] transition-colors"
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
                          whileHover={{ backgroundColor: '#F9FAFB', transition: { duration: 0.15 } }}
                          className="flex items-center gap-4 px-6 py-4 transition-colors group cursor-default"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            payment.status === 'released' ? 'bg-emerald-50' :
                            payment.status === 'in_escrow' ? 'bg-amber-50' : 'bg-gray-50'
                          }`}>
                            <payStatus.icon size={16} className={
                              payment.status === 'released' ? 'text-emerald-500' :
                              payment.status === 'in_escrow' ? 'text-amber-500' : 'text-gray-300'
                            } />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="font-bold text-gray-800 text-sm truncate text-left">{payment.milestone}</p>
                            <p className="text-xs text-gray-400 font-semibold text-left">
                              {payment.txId !== '—' ? `TX: ${payment.txId}` : 'Pending'} · {payment.date}
                            </p>
                          </div>
                          <p className="font-black text-gray-900 text-base shrink-0">{payment.amount}</p>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${payStatus.color}`}>
                            {payStatus.label}
                          </span>
                          {payment.status === 'in_escrow' && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowPaymentModal(payment)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-all shadow-sm shrink-0 opacity-0 group-hover:opacity-100"
                            >
                              Release
                          </motion.button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── ALL MODALS — Keep exactly as-is ── */}
      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && (
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
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Approve Milestone</h3>
              <p className="text-sm text-gray-400 text-center mb-4 leading-relaxed">
                You are approving <span className="font-bold text-gray-700">{showApproveModal.title}</span>.
                This will submit a request to the Escrow Agent (Admin) to release <span className="font-bold text-emerald-600">{showApproveModal.payment}</span> from escrow to {engagement.expert.name}.
              </p>

              {/* Rating */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5">
                <p className="text-xs font-black text-gray-700 text-center mb-3 uppercase tracking-wider">
                  Rate this milestone delivery
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={28}
                        fill={star <= (hoveredStar || rating) ? '#F59E0B' : 'none'}
                        className={star <= (hoveredStar || rating) ? 'text-amber-400' : 'text-gray-300'}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowApproveModal(null); setRating(0); }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApproveAndReleaseMilestone(showApproveModal)}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-md transition-all"
                >
                  <Check size={15} className="inline mr-1.5" strokeWidth={3} />
                  Approve & Request Release
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
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
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <XCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Reject Milestone</h3>
              <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                Please provide feedback on what needs to be revised for <span className="font-bold text-gray-700">{showRejectModal.title}</span>.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Describe what needs to be changed or improved..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: rejectReason.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: rejectReason.trim() ? 0.98 : 1 }}
                  disabled={!rejectReason.trim()}
                  onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                    rejectReason.trim()
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <X size={15} className="inline mr-1.5" />
                  Send Rejection
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Release Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
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
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <DollarSign size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Request Payment Release</h3>
              <p className="text-sm text-gray-400 text-center mb-2 leading-relaxed">
                Request escrow payment release for
              </p>
              <p className="text-center font-black text-gray-800 text-base mb-1">{showPaymentModal.milestone}</p>
              <p className="text-center text-3xl font-black text-emerald-600 mb-6">{showPaymentModal.amount}</p>

              <div className="bg-[#134e40]/5 rounded-2xl p-4 border border-[#134e40]/10 mb-5 text-center">
                <p className="text-xs text-[#134e40] font-semibold leading-relaxed">
                  Escrow Agent (Admin) will be requested to authorize this release request.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(19,78,64,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePaymentRelease(showPaymentModal)}
                  className="flex-1 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-2xl shadow-md transition-all"
                >
                  Request Release
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EngagementWorkspace;
