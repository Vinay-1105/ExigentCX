import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, CreditCard, Bell,
  Settings, LogOut, Plus, Users, Activity,
  FileText, Star, DollarSign, Target, MoreVertical,
  ArrowUpRight, ShieldCheck, Menu, AlertCircle,
  ChevronRight, ChevronLeft, Clock, MapPin,
  Briefcase, TrendingUp, Eye, CheckCircle,
  Zap, Award, BarChart2, MessageSquare,
  BookOpen, User, Heart, Check
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ExpertDashboard = () => {
  const navigate = useNavigate();

  // ── AUTH GUARD ──
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/signin?role=expert');
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/signin?role=expert');
    });

    return () => authListener?.subscription?.unsubscribe();
  }, [navigate]);

  // ── STATE ──
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [showNotifications, setShowNotifications] = useState(false);
  const [opportunityCarouselIndex, setOpportunityCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── SIDEBAR MENU ──
  const sidebarMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/expert-dashboard' },
    { name: 'Opportunities', icon: Briefcase, path: '/expert-opportunities' },
    { name: 'My Engagements', icon: Activity, path: '/expert-engagements' },
    { name: 'Earnings', icon: DollarSign, path: '/expert-earnings' },
    { name: 'Profile Builder', icon: User, path: '/expert-profile' },
    { name: 'Settings', icon: Settings, path: '/expert-settings' },
  ];

  // ── DATA ──
  const kpis = [
    {
      title: 'Active Engagements',
      value: '2',
      trend: '+1 this month',
      trendPositive: true,
      icon: Activity,
      iconBg: 'bg-teal-50',
      iconColor: 'text-[#0eb59a]',
      borderColor: 'border-l-[#0eb59a]',
      path: '/expert-engagements'
    },
    {
      title: 'Proposals Sent',
      value: '8',
      trend: '3 pending review',
      trendPositive: true,
      icon: FileText,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-l-blue-500',
      path: '/expert-opportunities'
    },
    {
      title: 'Total Earned',
      value: '₹12.4L',
      trend: '+₹3.5L this month',
      trendPositive: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      borderColor: 'border-l-emerald-500',
      path: '/expert-earnings'
    },
    {
      title: 'Profile Views',
      value: '234',
      trend: '+48 this week',
      trendPositive: true,
      icon: Eye,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      borderColor: 'border-l-purple-500',
      path: '/expert-profile'
    },
  ];

  const recommendedOpportunities = [
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
      postedDate: '2 days ago',
      skills: ['Financial Modeling', 'Fundraising', 'M&A'],
      urgency: 'Immediate',
      logo: 'HT',
      logoColor: 'from-blue-500 to-cyan-400',
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
      postedDate: '1 week ago',
      skills: ['P&L Management', 'Investor Relations', 'IPO Readiness'],
      urgency: 'Planned',
      logo: 'DC',
      logoColor: 'from-purple-500 to-violet-400',
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
      postedDate: '3 days ago',
      skills: ['Supply Chain Finance', 'Working Capital'],
      urgency: 'Planned',
      logo: 'LS',
      logoColor: 'from-amber-500 to-orange-400',
    },
  ];

  const activeEngagements = [
    {
      id: 1,
      title: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      status: 'IN PROGRESS',
      statusColor: 'text-blue-600 bg-blue-50',
      progress: 65,
      nextMilestone: 'Investor Deck & Data Room',
      dueDate: 'Apr 30, 2025',
      monthlyRate: '₹3L/mo',
      path: '/expert-engagements/1'
    },
    {
      id: 2,
      title: 'Financial Due Diligence',
      company: 'TechScale Ventures',
      companyLogo: 'TV',
      logoColor: 'from-blue-600 to-indigo-500',
      status: 'ON TRACK',
      statusColor: 'text-emerald-600 bg-emerald-50',
      progress: 40,
      nextMilestone: 'Due Diligence Report',
      dueDate: 'May 15, 2025',
      monthlyRate: '₹2.5L/mo',
      path: '/expert-engagements/2'
    },
  ];

  const pendingActions = [
    {
      title: 'Submit Milestone Deliverable',
      project: 'Series B Funding Strategy',
      type: 'SUBMIT',
      time: 'Due in 3 days',
      urgent: true,
      typeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      cardBg: 'bg-amber-50/40',
      path: '/expert-engagements/1?tab=milestones'
    },
    {
      title: 'Review & Sign Contract',
      project: 'Financial Due Diligence',
      type: 'SIGN',
      time: 'Expires tomorrow',
      urgent: true,
      typeColor: 'text-red-700 bg-red-50 border-red-200',
      cardBg: 'bg-red-50/40',
      path: '/expert-engagements/2?tab=contracts'
    },
    {
      title: 'New Message from Acme Corp',
      project: 'Series B Funding Strategy',
      type: 'MESSAGE',
      time: '2 hours ago',
      urgent: false,
      typeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      cardBg: 'bg-blue-50/40',
      path: '/expert-engagements/1?tab=messages'
    },
  ];

  const quickActions = [
    { label: 'Browse Roles', icon: Briefcase, color: 'text-[#0eb59a]', bg: 'bg-teal-50', path: '/expert-opportunities' },
    { label: 'My Engagements', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', path: '/expert-engagements' },
    { label: 'Earnings', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', path: '/expert-earnings' },
    { label: 'Edit Profile', icon: User, color: 'text-purple-500', bg: 'bg-purple-50', path: '/expert-profile' },
    { label: 'Messages', icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50', path: '/expert-engagements' },
    { label: 'Reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', path: '/expert-profile' },
  ];

  const notifications = [
    { title: 'New Role Match', desc: 'Fractional CFO role at HealthTech — 96% match', time: '10 min ago', unread: true, color: 'bg-teal-500' },
    { title: 'Milestone Approved', desc: 'Acme Corp approved Financial Model Development', time: '2 hours ago', unread: true, color: 'bg-emerald-500' },
    { title: 'Payment Received', desc: '₹2,00,000 credited for milestone completion', time: '3 hours ago', unread: true, color: 'bg-blue-500' },
    { title: 'New Message', desc: 'Acme Corp sent you a message about the investor deck', time: '1 day ago', unread: false, color: 'bg-purple-500' },
  ];

  const profileStrength = 78;
  const profileTips = [
    { label: 'Add a profile photo', done: true },
    { label: 'Complete work experience', done: true },
    { label: 'Add case studies', done: true },
    { label: 'Set your rate card', done: false },
    { label: 'Add 3 client testimonials', done: false },
  ];

  const nextOpportunity = () => {
    setOpportunityCarouselIndex(prev =>
      prev >= recommendedOpportunities.length - itemsPerView ? 0 : prev + 1
    );
  };

  const prevOpportunity = () => {
    setOpportunityCarouselIndex(prev =>
      prev === 0 ? Math.max(0, recommendedOpportunities.length - itemsPerView) : prev - 1
    );
  };

  const sidebarExpanded = isMobile ? true : isSidebarOpen;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-gray-800 overflow-hidden">

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 260 : (isSidebarOpen ? 260 : 68),
          x: isMobile ? (isSidebarOpen ? 0 : -260) : 0
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed md:relative h-full"
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-gray-100 overflow-hidden transition-all duration-300 ${sidebarExpanded ? 'px-5 py-5 gap-3' : 'px-0 py-5 justify-center'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <motion.div
            animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-sm font-black text-[#134e40] leading-tight">CXO Connect</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Expert Portal</p>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden overflow-y-auto">
          <motion.p
            animate={{ opacity: sidebarExpanded ? 1 : 0, height: sidebarExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 overflow-hidden"
          >
            Main Menu
          </motion.p>

          {sidebarMenu.map((item) => {
            const isActive = activeMenu === item.name;
            return (
              <div key={item.name} className="relative group">
                <motion.button
                  whileHover={{ x: sidebarExpanded ? 4 : 0, scale: sidebarExpanded ? 1 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveMenu(item.name); navigate(item.path); if (isMobile) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center transition-all duration-200 rounded-xl relative
                    ${sidebarExpanded ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}
                    ${isActive ? 'bg-teal-50 text-[#134e40]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="expertActiveBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0eb59a] rounded-r-full"
                    />
                  )}
                  <item.icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-[#0eb59a]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <motion.span
                    animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold overflow-hidden whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                  {isActive && sidebarExpanded && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0eb59a] shrink-0" />
                  )}
                </motion.button>

                {/* Tooltip when collapsed */}
                {!sidebarExpanded && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0d1f2d] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0d1f2d]" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 flex flex-col gap-2">
          {/* Profile strength card */}
          {sidebarExpanded ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => { navigate('/expert-profile'); if (isMobile) setIsSidebarOpen(false); }}
              className="mx-1 p-4 rounded-2xl bg-gradient-to-br from-[#0d1f2d] to-[#134e40] text-white relative overflow-hidden cursor-pointer group"
            >
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Award size={14} className="text-[#0eb59a]" />
                    <p className="font-black text-xs">Profile Strength</p>
                  </div>
                  <span className="text-sm font-black text-[#0eb59a]">{profileStrength}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileStrength}%` }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-[#0eb59a] rounded-full"
                  />
                </div>
                <p className="text-[10px] text-white/50">Complete your profile to get more matches</p>
              </div>
            </motion.div>
          ) : (
            <div className="relative group flex justify-center">
              <motion.button
                whileHover={{ scale: 1.15 }}
                onClick={() => navigate('/expert-profile')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d1f2d] to-[#134e40] flex items-center justify-center shadow-md"
              >
                <Award size={18} className="text-[#0eb59a]" />
              </motion.button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0d1f2d] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 shadow-xl">
                Profile Strength: {profileStrength}%
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0d1f2d]" />
              </div>
            </div>
          )}

          <div className="h-px bg-gray-100 mx-1" />

          {/* Logout */}
          <div className="relative group">
            <motion.button
              whileHover={{ x: sidebarExpanded ? 4 : 0, scale: sidebarExpanded ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => { await supabase.auth.signOut(); navigate('/signin?role=expert'); }}
              className={`w-full flex items-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all
                ${sidebarExpanded ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}`}
            >
              <LogOut size={18} className="shrink-0" />
              <motion.span
                animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            </motion.button>
            {!sidebarExpanded && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 shadow-xl">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-600" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── HEADER ── */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-40 sticky top-0">

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#134e40] transition-all"
            >
              <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                <Menu size={20} />
              </motion.div>
            </motion.button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-6 hidden md:block">
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors" />
              <input
                type="text"
                placeholder="Search opportunities, companies, skills..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:border-[#0eb59a]/40 focus:ring-4 focus:ring-[#0eb59a]/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/expert-opportunities')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#134e40] text-white text-sm font-bold rounded-full hover:bg-[#0eb59a] transition-all shadow-md group"
            >
              <motion.div whileHover={{ rotate: 12 }} transition={{ duration: 0.2 }}>
                <Briefcase size={15} />
              </motion.div>
              Browse Roles
            </motion.button>

            {/* Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
              >
                <Bell size={16} className="text-gray-500" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white"
                >
                  {notifications.filter(n => n.unread).length}
                </motion.span>
              </motion.button>

              {/* Notification Drawer */}
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
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
                        <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.map((notif, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 ${notif.unread ? 'bg-teal-50/20' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                              <p className="text-[10px] text-gray-300 font-semibold mt-1">{notif.time}</p>
                            </div>
                            {notif.unread && <div className="w-2 h-2 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />}
                          </motion.div>
                        ))}
                      </div>
                      <div className="px-5 py-3 text-center border-t border-gray-50">
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">
                          View all notifications →
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md ring-2 ring-white"
            >
              DC
            </motion.div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] [&::-webkit-scrollbar]:hidden relative">

          {/* Background decoration */}
          <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 left-64 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto p-6 md:p-8 space-y-6 pb-16">

            {/* ── WELCOME SECTION ── */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight"
                >
                  Good morning,{' '}
                  <motion.span
                    className="text-[#0eb59a] inline-block"
                  >
                    David
                  </motion.span>{' '}
                  <motion.span
                    animate={{ rotate: [0, 20, -10, 20, 0] }}
                    transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block"
                  >
                    👋
                  </motion.span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-400 text-sm mt-1"
                >
                  You have <span className="font-bold text-amber-500">3 pending actions</span> and <span className="font-bold text-teal-500">3 new role matches</span> today.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 shrink-0 mt-4 md:mt-0 w-full md:w-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(20,78,64,0.3)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/expert-opportunities')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg whitespace-nowrap"
                >
                  <Briefcase size={16} /> Browse Roles
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/expert-profile')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap"
                >
                  <User size={16} /> My Profile
                </motion.button>
              </motion.div>
            </motion.div>

            {/* ── KPI CARDS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {kpis.map((kpi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(kpi.path)}
                  className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${kpi.borderColor} shadow-sm transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight pr-2">
                        {kpi.title}
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className={`w-9 h-9 ${kpi.iconBg} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <kpi.icon size={17} className={kpi.iconColor} />
                      </motion.div>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight leading-none">
                      {kpi.value}
                    </p>
                    <div className={`flex items-center gap-1 text-[10px] font-bold w-fit px-2 py-1 rounded-lg ${kpi.trendPositive ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      <ArrowUpRight size={10} />
                      {kpi.trend}
                    </div>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#0eb59a] to-transparent"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* ── QUICK ACTIONS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
            >
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.06, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 3, opacity: 0.15 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute inset-0 ${action.bg} rounded-full`}
                  />
                  <div className={`relative z-10 w-11 h-11 ${action.bg} rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                    <action.icon size={20} className={action.color} />
                  </div>
                  <span className="relative z-10 text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight transition-colors">
                    {action.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT — 2/3 */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* RECOMMENDED OPPORTUNITIES CAROUSEL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Zap size={17} fill="#0eb59a" className="text-[#0eb59a]" />
                        </motion.div>
                        Matched Opportunities
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Based on your skills and availability
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevOpportunity}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] transition-all"
                      >
                        <ChevronLeft size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextOpportunity}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] transition-all"
                      >
                        <ChevronRight size={15} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Opportunity Cards */}
                  <div className="overflow-hidden">
                    <motion.div
                      animate={{ x: `-${opportunityCarouselIndex * (100 / itemsPerView)}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4"
                    >
                      {recommendedOpportunities.map((opp, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(14,181,154,0.12)' }}
                          style={{ minWidth: itemsPerView === 1 ? '100%' : itemsPerView === 2 ? 'calc((100% - 16px) / 2)' : 'calc((100% - 32px) / 3)' }}
                          className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-100 hover:border-[#0eb59a]/40 hover:bg-white transition-all duration-300 group cursor-pointer shrink-0"
                          onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                        >
                          {/* Company logo + match */}
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-sm`}>
                              <span className="text-white font-black text-sm">{opp.logo}</span>
                            </div>
                            <span className="text-[10px] font-black text-[#134e40] bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
                              {opp.match}% Match
                            </span>
                          </div>

                          {/* Info */}
                          <h3 className="font-black text-gray-900 text-sm group-hover:text-[#0eb59a] transition-colors leading-tight mb-0.5">
                            {opp.title}
                          </h3>
                          <p className="text-[11px] text-gray-600 font-bold mb-0.5">{opp.company}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mb-3">{opp.companySize}</p>

                          {/* Meta */}
                          <div className="space-y-1.5 mb-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0eb59a]">
                              <DollarSign size={11} /> {opp.budget}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold">
                              <Clock size={11} /> {opp.commitment} · {opp.duration}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold">
                              <MapPin size={11} /> {opp.location}
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {opp.skills.slice(0, 2).map(skill => (
                              <span key={skill} className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={e => { e.stopPropagation(); navigate(`/expert-opportunities/${opp.id}`); }}
                            className="w-full py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-[11px] font-black rounded-xl transition-all"
                          >
                            View & Apply
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: Math.max(1, recommendedOpportunities.length - itemsPerView + 1) }).map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setOpportunityCarouselIndex(idx)}
                        animate={{
                          width: opportunityCarouselIndex === idx ? 24 : 8,
                          backgroundColor: opportunityCarouselIndex === idx ? '#0eb59a' : '#e5e7eb'
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-2 rounded-full"
                      />
                    ))}
                  </div>

                  {/* View all */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate('/expert-opportunities')}
                    className="w-full mt-4 py-2.5 border border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:text-[#0eb59a] hover:border-[#0eb59a] transition-all"
                  >
                    Browse All Opportunities →
                  </motion.button>
                </motion.div>

                {/* ACTIVE ENGAGEMENTS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                      <Activity size={17} className="text-[#0eb59a]" /> Active Engagements
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/expert-engagements')}
                      className="text-sm font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                    >
                      View All <ChevronRight size={14} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeEngagements.map((eng, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(eng.path)}
                        className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-100 hover:border-[#0eb59a]/30 hover:shadow-md hover:bg-white transition-all duration-300 cursor-pointer group"
                      >
                        {/* Status */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 ${eng.statusColor}`}>
                            <motion.span
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-current"
                            />
                            {eng.status}
                          </span>
                          <MoreVertical size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>

                        {/* Title + Company */}
                        <h4 className="font-black text-gray-900 text-sm mb-1 group-hover:text-[#0eb59a] transition-colors leading-snug">
                          {eng.title}
                        </h4>

                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${eng.logoColor} flex items-center justify-center`}>
                            <span className="text-white text-[8px] font-black">{eng.companyLogo}</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            <span className="font-bold text-gray-600">{eng.company}</span>
                            <span className="mx-1">·</span>
                            {eng.monthlyRate}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-400 font-semibold truncate pr-2">
                              Next: {eng.nextMilestone}
                            </span>
                            <span className="font-black text-[#134e40] shrink-0">{eng.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${eng.progress}%` }}
                              transition={{ duration: 1.2, delay: 0.5 + idx * 0.15, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full relative overflow-hidden"
                            >
                              <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                              />
                            </motion.div>
                          </div>
                          <p className="text-[10px] text-gray-400 font-semibold mt-1.5">
                            Due {eng.dueDate}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT — 1/3 */}
              <div className="flex flex-col gap-5">

                {/* PENDING ACTIONS */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="p-5 border-b border-gray-50 bg-gradient-to-b from-amber-50/60 to-white">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <AlertCircle size={17} className="text-amber-500" /> Pending Actions
                      </h2>
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {pendingActions.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{pendingActions.length} items need your attention</p>
                  </div>

                  {/* Cards */}
                  <div className="p-4 space-y-3">
                    {pendingActions.map((action, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + idx * 0.08 }}
                        whileHover={{ x: 3 }}
                        onClick={() => navigate(action.path)}
                        className={`p-4 rounded-2xl border ${action.cardBg} border-gray-100 hover:border-[#0eb59a]/20 hover:shadow-md transition-all cursor-pointer group`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${action.typeColor}`}>
                              {action.type}
                            </span>
                            {action.urgent && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-red-500"
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock size={9} /> {action.time}
                          </span>
                        </div>
                        <h4 className="font-black text-gray-900 text-sm mb-1 group-hover:text-[#0eb59a] transition-colors leading-snug">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
                          <Briefcase size={10} /> {action.project}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={e => { e.stopPropagation(); navigate(action.path); }}
                          className="w-full py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-[#134e40] hover:text-white hover:border-[#134e40] transition-all shadow-sm"
                        >
                          Take Action
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* PROFILE STRENGTH */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <Award size={15} className="text-[#0eb59a]" /> Profile Strength
                    </h2>
                    <span className="text-xl font-black text-[#0eb59a]">{profileStrength}%</span>
                  </div>

                  {/* Circular progress feel with bar */}
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileStrength}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                    />
                  </div>

                  <div className="space-y-2.5">
                    {profileTips.map((tip, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.06 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          tip.done ? 'bg-emerald-500' : 'bg-gray-100 border border-dashed border-gray-300'
                        }`}>
                          {tip.done && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-xs font-semibold ${tip.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {tip.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/expert-profile')}
                    className="w-full mt-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#134e40] text-xs font-black rounded-xl border border-teal-100 transition-all"
                  >
                    Complete Profile →
                  </motion.button>
                </motion.div>

                {/* EARNINGS SNAPSHOT */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="absolute -right-2 -bottom-4 w-14 h-14 bg-[#0eb59a]/20 rounded-full" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                      This Month
                    </p>
                    <p className="text-3xl font-black mb-0.5">₹3,50,000</p>
                    <p className="text-xs text-white/60 mb-4">From 2 active engagements</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50 font-semibold">Next payment</span>
                      <span className="font-black text-[#0eb59a]">Apr 30, 2025</span>
                    </div>
                    <div className="h-px bg-white/10 my-3" />
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      onClick={() => navigate('/expert-earnings')}
                      className="w-full py-2 bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-xs font-black rounded-xl transition-all"
                    >
                      View Earnings →
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
