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
import Footer from '../components/Footer';

// --- CSS MASK STYLES FOR INVERTED CUTOUT CORNERS ---
const cutoutLarge = {
  WebkitMask: `radial-gradient(circle at 0 0, transparent 32px, black 32.5px) top left, radial-gradient(circle at 100% 0, transparent 32px, black 32.5px) top right, radial-gradient(circle at 0 100%, transparent 32px, black 32.5px) bottom left, radial-gradient(circle at 100% 100%, transparent 32px, black 32.5px) bottom right`,
  WebkitMaskSize: '51% 51%',
  WebkitMaskRepeat: 'no-repeat',
  mask: `radial-gradient(circle at 0 0, transparent 32px, black 32.5px) top left, radial-gradient(circle at 100% 0, transparent 32px, black 32.5px) top right, radial-gradient(circle at 0 100%, transparent 32px, black 32.5px) bottom left, radial-gradient(circle at 100% 100%, transparent 32px, black 32.5px) bottom right`,
  maskSize: '51% 51%',
  maskRepeat: 'no-repeat',
};

const cutoutMedium = {
  WebkitMask: `radial-gradient(circle at 0 0, transparent 24px, black 24.5px) top left, radial-gradient(circle at 100% 0, transparent 24px, black 24.5px) top right, radial-gradient(circle at 0 100%, transparent 24px, black 24.5px) bottom left, radial-gradient(circle at 100% 100%, transparent 24px, black 24.5px) bottom right`,
  WebkitMaskSize: '51% 51%',
  WebkitMaskRepeat: 'no-repeat',
  mask: `radial-gradient(circle at 0 0, transparent 24px, black 24.5px) top left, radial-gradient(circle at 100% 0, transparent 24px, black 24.5px) top right, radial-gradient(circle at 0 100%, transparent 24px, black 24.5px) bottom left, radial-gradient(circle at 100% 100%, transparent 24px, black 24.5px) bottom right`,
  maskSize: '51% 51%',
  maskRepeat: 'no-repeat',
};

const cutoutSmall = {
  WebkitMask: `radial-gradient(circle at 0 0, transparent 16px, black 16.5px) top left, radial-gradient(circle at 100% 0, transparent 16px, black 16.5px) top right, radial-gradient(circle at 0 100%, transparent 16px, black 16.5px) bottom left, radial-gradient(circle at 100% 100%, transparent 16px, black 16.5px) bottom right`,
  WebkitMaskSize: '51% 51%',
  WebkitMaskRepeat: 'no-repeat',
  mask: `radial-gradient(circle at 0 0, transparent 16px, black 16.5px) top left, radial-gradient(circle at 100% 0, transparent 16px, black 16.5px) top right, radial-gradient(circle at 0 100%, transparent 16px, black 16.5px) bottom left, radial-gradient(circle at 100% 100%, transparent 16px, black 16.5px) bottom right`,
  maskSize: '51% 51%',
  maskRepeat: 'no-repeat',
};

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
      color: 'bg-[#74b986]'
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
      color: 'bg-[#74b986]'
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
      path: '/engagements'
    },
    {
      title: 'Experts Shortlisted',
      value: '12',
      trend: '4 new this week',
      trendPositive: true,
      icon: Users,
      path: '/experts?filter=shortlisted'
    },
    {
      title: 'Total Spend',
      value: '₹4.2L',
      trend: 'On budget',
      trendPositive: true,
      icon: DollarSign,
      path: '/payments'
    },
    {
      title: 'Milestones Due',
      value: '2',
      trend: 'Next in 3 days',
      trendPositive: false,
      icon: Target,
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
      path: '/engagements/1?tab=milestones'
    },
    {
      title: 'Review New Candidates',
      project: 'Interim CFO',
      type: 'REVIEW',
      time: '5 hours ago',
      urgent: false,
      path: '/requirements/1?tab=candidates'
    },
    {
      title: 'Sign Contract',
      project: 'Tech Advisory',
      type: 'ACTION',
      time: '1 day ago',
      urgent: false,
      path: '/contracts/1'
    }
  ];

  const activeEngagements = [
    {
      title: 'Series B Funding Strategy',
      expert: 'David Chen',
      expertImage: 'https://i.pravatar.cc/150?u=2',
      status: 'IN PROGRESS',
      progress: 65,
      nextMilestone: 'Financial Model Draft',
      path: '/engagements/1'
    },
    {
      title: 'Go-to-Market Expansion',
      expert: 'Sarah Jenkins',
      expertImage: 'https://i.pravatar.cc/150?u=1',
      status: 'ON TRACK',
      progress: 40,
      nextMilestone: 'Campaign Launch',
      path: '/engagements/2'
    }
  ];

  const quickActions = [
    { label: 'Post a Role', icon: Plus, path: '/requirements/create' },
    { label: 'Find Experts', icon: Users, path: '/experts' },
    { label: 'Contracts', icon: FileText, path: '/contracts' },
    { label: 'Payments', icon: CreditCard, path: '/payments' },
    { label: 'Milestones', icon: Target, path: '/engagements' },
    { label: 'Advisors', icon: ShieldCheck, path: '/experts?type=advisor' }
  ];

  return (
    <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden relative pb-10 min-h-full bg-white">


  <div className="relative z-10 max-w-[1400px] mx-auto p-8 md:p-12 space-y-12 pb-16">

    {/* ── WELCOME SECTION ── */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-8"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-gray-900 leading-[1.1]">
            Good morning,{' '}
            <motion.span
              className="text-[#2d6a4f]"
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
          <p className="text-xl text-gray-600 font-sans font-light mt-5 max-w-2xl leading-relaxed">
            Here's what's happening with your engagements today. Discover elite expertise and manage your projects.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-5 shrink-0 flex-col sm:flex-row"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/requirements/create')}
          className="px-10 py-4 bg-[#2d6a4f] text-white font-sans font-semibold text-lg rounded-full hover:bg-[#74b986] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3 group shadow-lg"
        >
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
            <Plus size={22} strokeWidth={1.5} />
          </motion.div>
          Post a Role
        </motion.button>
      </motion.div>
    </motion.div>

    {/* ── KPI CARDS (Dark Glass + Cutout Theme) ── */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {kpis.map((kpi, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
          whileHover={{ y: -8, filter: 'drop-shadow(0 25px 30px rgba(14,181,154,0.3))' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(kpi.path)}
          className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] group cursor-pointer h-full"
        >
          <div style={cutoutMedium} className="relative bg-[#0e1f17] overflow-hidden h-full w-full">
            {/* Glass Orbs behind the frosted overlay */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#74b986]/30 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#2d6a4f]/40 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-700" />
            
            {/* The Frosted Glass Overlay */}
            <div className="relative h-full bg-white/5 backdrop-blur-xl p-10 z-10 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-[13px] font-sans font-bold text-white/60 uppercase tracking-widest leading-tight pr-2">
                  {kpi.title}
                </span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-14 h-14 bg-white/10 border border-white/20 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md"
                >
                  <kpi.icon size={26} strokeWidth={1.5} className="text-[#74b986]" />
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="text-5xl lg:text-6xl font-sans font-medium text-white mb-5 tracking-tight leading-none"
              >
                {kpi.value}
              </motion.p>
              <div className={`flex items-center gap-2 text-sm font-sans font-bold w-fit px-4 py-2 rounded-full border ${kpi.trendPositive ? 'text-[#74b986] bg-[#74b986]/10 border-[#74b986]/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'}`}>
                <ArrowUpRight size={16} strokeWidth={1.5} />
                {kpi.trend}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* ── QUICK ACTIONS (Dark Glass + Cutout Theme) ── */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
    >
      {quickActions.map((action, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 + idx * 0.06, type: 'spring', stiffness: 200 }}
          whileHover={{ y: -8, scale: 1.02, filter: 'drop-shadow(0 15px 30px rgba(14,181,154,0.2))' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(action.path)}
          className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] group cursor-pointer h-full"
        >
          <div style={cutoutMedium} className="relative bg-[#0e1f17] overflow-hidden h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#74b986]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#74b986]/20 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative h-full bg-white/5 backdrop-blur-xl p-8 z-10 flex flex-col items-center gap-5">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-[1.25rem] flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-md">
                <action.icon size={28} strokeWidth={1.5} className="text-[#74b986]" />
              </div>
              <span className="text-[15px] font-sans font-bold text-white/80 group-hover:text-white text-center leading-tight transition-colors">
                {action.label}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* ── MAIN GRID ── */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

      {/* LEFT — 2/3 width */}
      <div className="lg:col-span-2 flex flex-col gap-12">

        {/* RECOMMENDED EXPERTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-full"
        >
          <div style={cutoutLarge} className="relative bg-[#0e1f17] overflow-hidden h-full w-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#74b986]/15 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2d6a4f]/20 rounded-full blur-[80px]" />
            
            <div className="relative h-full bg-white/5 backdrop-blur-2xl p-10 md:p-12 z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-5">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      className="bg-white/10 border border-white/20 p-3 rounded-[1.25rem] backdrop-blur-md"
                    >
                      <Star size={28} strokeWidth={1.5} className="text-[#74b986]" />
                    </motion.div>
                    Recommended Experts
                  </h2>
                  <p className="text-base text-white/60 font-sans font-light mt-3 md:ml-16">
                    Based on your "Interim CFO" requirement
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#74b986', borderColor: '#74b986' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevExpert}
                    className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white bg-white/5 backdrop-blur-md transition-all shadow-sm"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#74b986', borderColor: '#74b986' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextExpert}
                    className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white bg-white/5 backdrop-blur-md transition-all shadow-sm"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  animate={{ x: `-${expertCarouselIndex * 100}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex gap-8 w-full py-4 px-2"
                >
                  {recommendedExperts.map((expert, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -8, filter: 'drop-shadow(0 15px 30px rgba(14,181,154,0.2))' }}
                      className="min-w-full md:min-w-[calc(50%-16px)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group cursor-pointer shrink-0"
                    >
                      <div style={cutoutMedium} className="relative bg-[#0e1f17] overflow-hidden h-full w-full hover:bg-[#152a1e] transition-colors duration-300">
                        <div className="relative h-full bg-white/5 backdrop-blur-xl p-8 z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div className="relative">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={expert.image}
                                alt={expert.name}
                                className="w-20 h-20 rounded-[1.5rem] object-cover shadow-md"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#74b986] border-[4px] border-[#0e1f17] rounded-full"
                              />
                            </div>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="text-sm font-sans font-bold text-[#74b986] bg-[#74b986]/10 px-4 py-2 rounded-full border border-[#74b986]/30"
                            >
                              {expert.match} MATCH
                            </motion.span>
                          </div>
                          <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#74b986] transition-colors leading-tight mb-2">
                            {expert.name}
                          </h3>
                          <p className="text-base text-white/60 font-sans font-light mb-6">{expert.role}</p>
                          <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-[15px] font-sans font-semibold text-[#74b986]">
                              <DollarSign size={18} strokeWidth={1.5} /> {expert.price}
                            </div>
                            <div className="flex items-center gap-3 text-[15px] text-white/60 font-sans font-light">
                              <MapPin size={18} strokeWidth={1.5} /> {expert.location}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <Star size={20} fill="#74b986" className="text-[#74b986]" />
                              <span className="text-lg font-sans font-bold text-white">{expert.rating}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); navigate(`/experts/${idx + 1}`); }}
                              className="text-[15px] font-sans font-bold text-white bg-white/10 border border-white/20 hover:bg-[#74b986] hover:border-[#74b986] px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2 group/btn"
                            >
                              View Profile
                              <ChevronRight size={18} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="flex justify-center gap-3 mt-10">
                {recommendedExperts.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setExpertCarouselIndex(idx)}
                    animate={{
                      width: expertCarouselIndex === idx ? 40 : 12,
                      backgroundColor: expertCarouselIndex === idx ? '#74b986' : 'rgba(255,255,255,0.2)'
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-3 rounded-full"
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/experts')}
                className="w-full mt-8 py-5 border border-white/20 rounded-[2rem] text-lg font-sans font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm bg-white/5"
              >
                View All Experts →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ACTIVE ENGAGEMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-full"
        >
          <div style={cutoutLarge} className="relative bg-[#0e1f17] overflow-hidden h-full w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#2d6a4f]/20 to-[#74b986]/10 blur-[80px]" />
            
            <div className="relative h-full bg-white/5 backdrop-blur-2xl p-10 md:p-12 z-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white flex items-center gap-4">
                  <div className="bg-white/10 border border-white/20 p-3 rounded-[1.25rem] backdrop-blur-md">
                    <Activity size={28} strokeWidth={1.5} className="text-[#74b986]" />
                  </div>
                  Active Engagements
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/engagements')}
                  className="text-base font-sans font-bold text-white hover:text-[#74b986] transition-colors flex items-center gap-2 bg-white/10 border border-white/20 hover:border-[#74b986] px-5 py-2.5 rounded-full"
                >
                  View All <ChevronRight size={18} strokeWidth={1.5} />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                {activeEngagements.map((eng, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, filter: 'drop-shadow(0 15px 30px rgba(14,181,154,0.2))' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(eng.path)}
                    className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group cursor-pointer"
                  >
                    <div style={cutoutMedium} className="relative bg-[#0e1f17] overflow-hidden hover:bg-[#152a1e] transition-colors duration-300 h-full w-full">
                      <div className="relative h-full bg-white/5 backdrop-blur-xl p-8 z-10">
                        <div className="flex items-center justify-between mb-5">
                          <span className={`text-xs font-sans font-bold tracking-widest uppercase px-4 py-2 rounded-full flex items-center gap-2 border ${eng.status === 'IN PROGRESS' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' : 'text-[#74b986] border-[#74b986]/30 bg-[#74b986]/10'}`}>
                            <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                            {eng.status}
                          </span>
                          <MoreVertical size={22} strokeWidth={1.5} className="text-white/40 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-serif font-bold text-2xl text-white mb-4 group-hover:text-[#74b986] transition-colors leading-snug">
                          {eng.title}
                        </h4>
                        <div className="flex items-center gap-4 mb-8">
                          <img
                            src={eng.expertImage}
                            className="w-10 h-10 rounded-full object-cover ring-[3px] ring-[#0e1f17] shadow-md"
                            alt={eng.expert}
                          />
                          <p className="text-base text-white/60 font-sans font-light">
                            Expert: <span className="text-white font-semibold">{eng.expert}</span>
                          </p>
                        </div>
                        
                        {/* Inner Card Cutout */}
                        <div style={cutoutSmall} className="bg-black/20 p-6 shadow-inner relative overflow-hidden mt-6">
                          <div className="flex justify-between text-[15px] font-sans mb-4">
                            <span className="text-white/60 font-medium truncate pr-4">
                              Next: {eng.nextMilestone}
                            </span>
                            <span className="font-bold text-[#74b986] shrink-0">{eng.progress}%</span>
                          </div>
                          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${eng.progress}%` }}
                              transition={{ duration: 1.5, delay: 0.6 + idx * 0.2, ease: 'easeOut' }}
                              className="h-full rounded-full relative overflow-hidden"
                              style={{ background: `linear-gradient(90deg, #2d6a4f, #74b986)` }}
                            >
                              <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* RIGHT — Pending Actions */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:col-span-1 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-full"
      >
        <div style={cutoutLarge} className="relative bg-[#0e1f17] overflow-hidden sticky top-36 flex flex-col max-h-[calc(100vh-180px)] w-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#74b986]/10 rounded-full blur-[60px]" />

          <div className="relative h-full bg-white/5 backdrop-blur-2xl z-10 flex flex-col">
            <div className="p-10 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                  <AlertCircle size={28} strokeWidth={1.5} className="text-amber-400" />
                  Actions
                </h2>
                <span className="bg-amber-500 text-white text-sm font-sans font-bold px-3.5 py-1.5 rounded-full shadow-lg text-center">
                  {pendingActions.length}
                </span>
              </div>
              <p className="text-base text-white/60 font-sans font-light mt-2">
                Items requiring your immediate attention
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-5 [&::-webkit-scrollbar]:hidden">
              {pendingActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  whileHover={{ x: 5, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))' }}
                  onClick={() => navigate(action.path)}
                  className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer group"
                >
                  <div style={cutoutMedium} className="relative bg-[#152a1e] overflow-hidden w-full h-full hover:bg-[#1c3024] transition-colors duration-300">
                    <div className="relative h-full bg-white/5 backdrop-blur-md p-6 z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className={`text-[11px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border ${action.type === 'APPROVAL' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : action.type === 'REVIEW' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' : 'text-purple-400 border-purple-400/30 bg-purple-400/10'}`}>
                            {action.type}
                          </span>
                          {action.urgent && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-3 h-3 rounded-full bg-red-500 ml-3 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            />
                          )}
                        </div>
                        <span className="text-[13px] text-white/40 flex items-center gap-2 font-sans font-medium">
                          <Clock size={14} strokeWidth={1.5} /> {action.time}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-white text-lg mb-3 group-hover:text-[#74b986] transition-colors leading-snug">
                        {action.title}
                      </h4>
                      <p className="text-[15px] text-white/60 font-sans font-light flex items-center gap-2 mb-6">
                        <Briefcase size={16} strokeWidth={1.5} className="text-white/40" /> {action.project}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(action.path);
                        }}
                        className="w-full py-4 bg-white/10 border border-white/20 rounded-full text-base font-sans font-bold text-white hover:bg-[#74b986] hover:border-[#74b986] transition-all shadow-md"
                      >
                        Review Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 border-t border-white/10 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/notifications')}
                className="text-base font-sans font-bold text-[#74b986] hover:text-white transition-colors inline-flex items-center gap-2"
              >
                View All History <ChevronRight size={18} strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

    </div>

  </div>
  
  {/* Footer Section */}
  <div className="relative z-10 w-full mt-24">
     <Footer />
  </div>

    </main>
  );
};

export default CompanyDashboard;
