import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Briefcase, LayoutDashboard, CreditCard, 
  Bell, Settings, User, ChevronRight, ChevronLeft, 
  Clock, LogOut, Plus, Users, Activity, FileText, 
  Star, DollarSign, Target, MoreVertical, ArrowUpRight, 
  ShieldCheck, Menu, AlertCircle, MapPin
} from 'lucide-react';

const CompanyDashboard = () => {
  const navigate = useNavigate();

  // State
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expertCarouselIndex, setExpertCarouselIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Carousel handlers
  const nextExpert = () => {
    setExpertCarouselIndex((prev) =>
      prev >= recommendedExperts.length - 1 ? 0 : prev + 1
    );
  };

  const prevExpert = () => {
    setExpertCarouselIndex((prev) =>
      prev === 0 ? recommendedExperts.length - 1 : prev - 1
    );
  };

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

  // Menu Data
  const sidebarMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/company-dashboard' },
    { name: 'My Requirements', icon: Briefcase, path: '/requirements' },
    { name: 'Experts', icon: Users, path: '/experts' },
    { name: 'Contracts', icon: FileText, path: '/contracts' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const notifications = [
    {
      title: 'New Expert Match',
      desc: 'Sarah Jenkins matches your Interim CFO requirement at 98%',
      time: '5 min ago',
      unread: true,
      color: 'bg-teal-500'
    },
    {
      title: 'Milestone Approved',
      desc: 'Phase 1 of Marketing Strategy has been completed',
      time: '1 hour ago',
      unread: true,
      color: 'bg-blue-500'
    },
    {
      title: 'Contract Ready',
      desc: 'Tech Advisory contract is ready for your signature',
      time: '3 hours ago',
      unread: true,
      color: 'bg-purple-500'
    },
    {
      title: 'Payment Released',
      desc: '₹85,000 released to David Chen for milestone completion',
      time: '1 day ago',
      unread: false,
      color: 'bg-emerald-500'
    }
  ];

  const recommendedExperts = [
    { name: "Sarah Jenkins", role: "Ex-CMO at TechCorp", rating: "4.9", price: "15K - 20K/Mo", location: "Work from Home", image: "https://i.pravatar.cc/150?u=1", match: "98%" },
    { name: "David Chen", role: "Interim CFO", rating: "5.0", price: "33K/Month", location: "In Office | New Delhi", image: "https://i.pravatar.cc/150?u=2", match: "95%" },
    { name: "Priya Patel", role: "VP Engineering", rating: "4.8", price: "10K/Month", location: "Work from Home", image: "https://i.pravatar.cc/150?u=3", match: "92%" }
  ];

  const kpis = [
    {
      title: 'Active Engagements',
      value: '3',
      trend: '+1 this month',
      trendPositive: true,
      icon: Activity,
      iconBg: 'bg-teal-50',
      iconColor: 'text-[#0eb59a]',
      borderColor: 'border-l-[#0eb59a]',
      path: '/engagements'
    },
    {
      title: 'Experts Shortlisted',
      value: '12',
      trend: '4 new this week',
      trendPositive: true,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-l-blue-500',
      path: '/experts?filter=shortlisted'
    },
    {
      title: 'Total Spend',
      value: '₹4.2L',
      trend: 'On budget',
      trendPositive: true,
      icon: DollarSign,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      borderColor: 'border-l-purple-500',
      path: '/payments'
    },
    {
      title: 'Milestones Due',
      value: '2',
      trend: 'Next in 3 days',
      trendPositive: false,
      icon: Target,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderColor: 'border-l-amber-500',
      path: '/engagements?filter=milestones'
    }
  ];

  const pendingActions = [
    {
      title: 'Approve Milestone: Phase 1',
      project: 'Marketing Strategy',
      type: 'APPROVAL',
      time: '2 hours ago',
      urgent: true,
      typeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      cardBg: 'bg-amber-50/40',
      path: '/engagements/1?tab=milestones'
    },
    {
      title: 'Review New Candidates',
      project: 'Interim CFO',
      type: 'REVIEW',
      time: '5 hours ago',
      urgent: false,
      typeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      cardBg: 'bg-blue-50/40',
      path: '/requirements/1?tab=candidates'
    },
    {
      title: 'Sign Contract',
      project: 'Tech Advisory',
      type: 'ACTION',
      time: '1 day ago',
      urgent: false,
      typeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      cardBg: 'bg-purple-50/40',
      path: '/contracts/1'
    }
  ];

  const activeEngagements = [
    {
      title: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertImage: 'https://i.pravatar.cc/150?u=2',
      status: 'IN PROGRESS',
      statusColor: 'text-blue-600 bg-blue-50',
      progress: 65,
      nextMilestone: 'Financial Model Draft',
      path: '/engagements/1'
    },
    {
      title: 'Go-to-Market Expansion',
      expert: 'Sarah Jenkins',
      expertImage: 'https://i.pravatar.cc/150?u=1',
      status: 'ON TRACK',
      statusColor: 'text-emerald-600 bg-emerald-50',
      progress: 40,
      nextMilestone: 'Campaign Launch',
      path: '/engagements/2'
    }
  ];

  const quickActions = [
    { label: 'Post a Role', icon: Plus, color: 'text-[#0eb59a]', bg: 'bg-teal-50', path: '/requirements/create' },
    { label: 'Find Experts', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', path: '/experts' },
    { label: 'Contracts', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', path: '/contracts' },
    { label: 'Payments', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50', path: '/payments' },
    { label: 'Milestones', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50', path: '/engagements' },
    { label: 'Advisors', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', path: '/experts?type=advisor' }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-[#1e293b] overflow-hidden">
      
      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm"
      >

        {/* Logo Area */}
        <div className={`flex items-center border-b border-gray-100 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'px-5 py-4 gap-3' : 'px-0 py-4 justify-center'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <motion.div
            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-sm font-black text-[#134e40] leading-tight">CXO Connect</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Company Portal
            </p>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden overflow-y-auto">
          <motion.p
            animate={{ opacity: isSidebarOpen ? 1 : 0, height: isSidebarOpen ? 'auto' : 0 }}
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
                  whileHover={{ x: isSidebarOpen ? 3 : 0, scale: isSidebarOpen ? 1 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveMenu(item.name);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center transition-all duration-200 rounded-xl relative
                    ${isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}
                    ${isActive
                      ? 'bg-teal-50 text-[#134e40]'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0eb59a] rounded-r-full"
                    />
                  )}
                  <item.icon
                    size={20}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#0eb59a]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <motion.span
                    animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold overflow-hidden whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                  {isActive && isSidebarOpen && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0eb59a] shrink-0"
                    />
                  )}
                </motion.button>

                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0d1f2d] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0d1f2d]" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-2 pb-4 flex flex-col gap-2">
          {isSidebarOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.02 }}
              className="mx-1 p-4 rounded-2xl bg-gradient-to-br from-[#0d1f2d] to-[#134e40] text-white relative overflow-hidden cursor-pointer group"
            >
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/5 rounded-full" />
              <div className="absolute -right-1 -bottom-3 w-10 h-10 bg-[#0eb59a]/20 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={15} className="text-[#0eb59a]" />
                  <h4 className="font-black text-sm">CXO Concierge</h4>
                </div>
                <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                  Need help scoping a role?
                </p>
                <button className="w-full bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-[11px] font-bold py-2 rounded-xl transition-all">
                  Talk to Advisor
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="relative group flex justify-center">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d1f2d] to-[#134e40] flex items-center justify-center shadow-md"
              >
                <ShieldCheck size={18} className="text-[#0eb59a]" />
              </motion.button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0d1f2d] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                CXO Concierge
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0d1f2d]" />
              </div>
            </div>
          )}

          <div className="h-px bg-gray-100 mx-1" />

          <div className="relative group">
            <motion.button
              whileHover={{ x: isSidebarOpen ? 3 : 0, scale: isSidebarOpen ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/signin?role=company');
              }}
              className={`w-full flex items-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group
                ${isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}`}
            >
              <LogOut size={18} className="shrink-0 transition-colors group-hover:text-red-500" />
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            </motion.button>

            {!isSidebarOpen && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-600" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Enhanced Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-40 sticky top-0">
          
          {/* Left — Hamburger */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#134e40] transition-all"
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <Menu size={20} />
              </motion.div>
            </motion.button>
          </div>

          {/* Center — Search */}
          <div className="flex-1 max-w-xl mx-6 hidden md:block">
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors"
              />
              <input
                type="text"
                placeholder="Search experts, skills, or projects..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:border-[#0eb59a]/40 focus:ring-4 focus:ring-[#0eb59a]/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-3">

            {/* Post Role */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/requirements/create')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#134e40] text-white text-sm font-bold rounded-full hover:bg-[#0eb59a] transition-all shadow-md shadow-teal-900/10 group"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Plus size={15} />
              </motion.div>
              Post Role
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
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notification Drawer */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />

                    {/* Panel */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
                        <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
                        <button
                          onClick={() => setNotificationCount(0)}
                          className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors"
                        >
                          Mark all read
                        </button>
                      </div>

                      {/* Items */}
                      <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.map((notif, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-teal-50/20' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                              <p className="text-[10px] text-gray-300 font-semibold mt-1">{notif.time}</p>
                            </div>
                            {notif.unread && (
                              <div className="w-2 h-2 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3 text-center border-t border-gray-50">
                        <button
                          onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                          className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors"
                        >
                          View all notifications →
                        </button>
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
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md ring-2 ring-white"
              >
                AC
              </motion.div>
            </div>

          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] [&::-webkit-scrollbar]:hidden relative">

          {/* Subtle background decoration */}
          <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 left-64 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto p-6 md:p-8 space-y-6 pb-16">

            {/* ── WELCOME SECTION ── */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    Good morning,{' '}
                    <motion.span
                      className="text-[#0eb59a] inline-block"
                      animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Acme Corp
                    </motion.span>{' '}
                    <motion.span
                      animate={{ rotate: [0, 20, -10, 20, 0] }}
                      transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
                      className="inline-block"
                    >
                      👋
                    </motion.span>
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Here's what's happening with your engagements today.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-3 shrink-0"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(20,78,64,0.3)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/requirements/create')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-900/15"
                >
                  <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                    <Plus size={16} />
                  </motion.div>
                  Post a Role
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                >
                  Download Report
                </motion.button>
              </motion.div>
            </motion.div>

            {/* ── KPI CARDS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {kpis.map((kpi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
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
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="text-4xl font-black text-gray-900 mb-3 tracking-tight leading-none"
                    >
                      {kpi.value}
                    </motion.p>
                    <div className={`flex items-center gap-1 text-[10px] font-bold w-fit px-2 py-1 rounded-lg ${kpi.trendPositive ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      <ArrowUpRight size={10} />
                      {kpi.trend}
                    </div>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#0eb59a] to-transparent`}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* ── QUICK ACTIONS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="grid grid-cols-3 md:grid-cols-6 gap-3"
            >
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15 + idx * 0.06,
                    type: 'spring',
                    stiffness: 200
                  }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 3, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute inset-0 ${action.bg} rounded-full opacity-0`}
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

              {/* LEFT — 2/3 width */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* RECOMMENDED EXPERTS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Star size={17} fill="#F59E0B" className="text-amber-400" />
                        </motion.div>
                        Recommended Experts
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Based on your "Interim CFO" requirement
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#0eb59a', color: '#fff' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevExpert}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all shadow-sm"
                      >
                        <ChevronLeft size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#0eb59a', color: '#fff' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextExpert}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all shadow-sm"
                      >
                        <ChevronRight size={15} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <motion.div
                      animate={{ x: `-${expertCarouselIndex * 33.333}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4"
                    >
                      {recommendedExperts.map((expert, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(14,181,154,0.12)' }}
                          className="min-w-[calc(33.333%-11px)] bg-[#f8fafc] rounded-2xl p-4 border border-gray-100 hover:border-[#0eb59a]/40 hover:bg-white transition-all duration-300 group cursor-pointer shrink-0"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="relative">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={expert.image}
                                alt={expert.name}
                                className="w-12 h-12 rounded-xl object-cover shadow-sm"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                              />
                            </div>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="text-[10px] font-black text-[#134e40] bg-teal-50 px-2 py-1 rounded-lg border border-teal-100"
                            >
                              {expert.match} MATCH
                            </motion.span>
                          </div>
                          <h3 className="font-black text-gray-900 text-sm group-hover:text-[#0eb59a] transition-colors leading-tight">
                            {expert.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-semibold mt-0.5 mb-3">{expert.role}</p>
                          <div className="space-y-1.5 mb-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0eb59a]">
                              <DollarSign size={11} /> {expert.price}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold">
                              <MapPin size={11} /> {expert.location}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Star size={12} fill="#F59E0B" className="text-amber-400" />
                              <span className="text-sm font-black text-gray-800">{expert.rating}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05, backgroundColor: '#0eb59a' }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); navigate(`/experts/${idx + 1}`); }}
                              className="text-[11px] font-black text-white bg-[#134e40] px-3 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                              View Profile
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {recommendedExperts.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setExpertCarouselIndex(idx)}
                        animate={{
                          width: expertCarouselIndex === idx ? 24 : 8,
                          backgroundColor: expertCarouselIndex === idx ? '#0eb59a' : '#e5e7eb'
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-2 rounded-full"
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate('/experts')}
                    className="w-full mt-4 py-2.5 border border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:text-[#0eb59a] hover:border-[#0eb59a] transition-all"
                  >
                    View All Experts →
                  </motion.button>
                </motion.div>

                {/* ACTIVE ENGAGEMENTS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                      <Activity size={17} className="text-[#0eb59a]" />
                      Active Engagements
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/engagements')}
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
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 ${eng.statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {eng.status}
                          </span>
                          <MoreVertical size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                        <h4 className="font-black text-gray-900 text-sm mb-2 group-hover:text-[#0eb59a] transition-colors leading-snug">
                          {eng.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-4">
                          <img
                            src={eng.expertImage}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200"
                            alt={eng.expert}
                          />
                          <p className="text-xs text-gray-400">
                            Expert: <span className="text-gray-700 font-bold">{eng.expert}</span>
                          </p>
                        </div>
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
                              transition={{ duration: 1.5, delay: 0.6 + idx * 0.2, ease: 'easeOut' }}
                              className="h-full rounded-full relative overflow-hidden"
                              style={{ background: `linear-gradient(90deg, #134e40, #0eb59a)` }}
                            >
                              <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* RIGHT — Pending Actions */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-6 flex flex-col max-h-[calc(100vh-160px)]">
                  <div className="p-5 border-b border-gray-50 bg-gradient-to-b from-amber-50/60 to-white">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <AlertCircle size={17} className="text-amber-500" />
                        Pending Actions
                      </h2>
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {pendingActions.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {pendingActions.length} items requiring your attention
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden">
                    {pendingActions.map((action, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                        whileHover={{ x: 3 }}
                        onClick={() => navigate(action.path)}
                        className={`p-4 rounded-2xl border border-gray-100 ${action.cardBg} hover:border-[#0eb59a]/30 hover:shadow-md transition-all cursor-pointer group`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${action.typeColor}`}>
                              {action.type}
                            </span>
                            {action.urgent && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-red-500 ml-1"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(action.path);
                          }}
                          className="w-full py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-[#134e40] hover:text-white hover:border-[#134e40] transition-all shadow-sm"
                        >
                          Review Now
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-50 bg-gray-50/50 text-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/notifications')}
                      className="text-sm font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors inline-flex items-center gap-1"
                    >
                      View All History <ChevronRight size={13} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </main>
      </div>

    </div>
  );
};

export default CompanyDashboard;
