import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, TrendingUp, Lock,
  Unlock, Download, Search, X, Check,
  AlertCircle, Calendar, Briefcase, ArrowUpRight,
  Clock, CreditCard, Plus, Eye, Shield,
  FileText, ChevronDown, Target, Wallet,
  BarChart2, IndianRupee, Building, Star,
  CheckCircle, ArrowDownLeft, Landmark, Send, Zap,
  LayoutDashboard, Bell, ChevronLeft, Menu,
  LogOut, UserCircle, Activity, MessageSquare, Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const monthlyData = [
  { month: 'Nov', amount: 150, label: '₹1.5L' },
  { month: 'Dec', amount: 150, label: '₹1.5L' },
  { month: 'Jan', amount: 180, label: '₹1.8L' },
  { month: 'Feb', amount: 150, label: '₹1.5L' },
  { month: 'Mar', amount: 200, label: '₹2.0L' },
  { month: 'Apr', amount: 350, label: '₹3.5L' },
];

const ExpertEarnings = () => {
  const navigate = useNavigate();

  // ── EXISTING STATE VARIABLES ──
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSent, setWithdrawSent] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState('bank');

  // ── NEW STATE VARIABLES TO ADD ──
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expertProfile, setExpertProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // ── AUTH GUARD ──
  useEffect(() => {
    const checkAuth = async () => {
      const isDemo = localStorage.getItem('demo_expert') === 'true' || localStorage.getItem('sb-mock-auth') === 'true';
      if (isDemo) {
        setExpertProfile({ full_name: 'David Chen' });
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=expert');
        return;
      }
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL 
          || import.meta.env.VITE_API_URL 
          || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/expert/profile`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setExpertProfile(data);
        }
      } catch (err) {
        console.error('Error fetching expert profile:', err);
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && localStorage.getItem('demo_expert') !== 'true') {
          navigate('/signin?role=expert');
        }
      }
    );
    return () => authListener?.subscription?.unsubscribe();
  }, [navigate]);

  // ── CONSTANTS ──
  const tabs = ['Overview', 'Transactions', 'Invoices', 'Payouts'];

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
      path: '/expert-earnings',      isActive: true },
    { name: 'Profile',        icon: UserCircle,
      path: '/expert-profile'        },
    { name: 'Messages',       icon: MessageSquare,
      path: '/messages'              },
    { name: 'Meetings',       icon: Calendar,
      path: '/meetings'              },
  ];

  const notifications = [
    { 
      title: 'Milestone Payment Received', 
      desc: '₹2,00,000 credited for Financial Model Development', 
      time: '2 hours ago', 
      unread: true, 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'New Milestone Approved', 
      desc: 'Acme Corp approved Investor Deck milestone', 
      time: '1 day ago', 
      unread: true, 
      color: 'bg-[#0eb59a]' 
    },
    { 
      title: 'Payout Processed', 
      desc: '₹3,00,000 transferred to HDFC Bank ••••4321', 
      time: '3 days ago', 
      unread: false, 
      color: 'bg-blue-500' 
    },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const [summary, setSummary] = useState({
    totalEarned: '₹12,40,000',
    thisMonth: '₹3,50,000',
    inEscrow: '₹5,50,000',
    availableToWithdraw: '₹3,50,000',
    nextPayment: '₹2,50,000',
    nextPaymentDate: 'Apr 30, 2025',
    avgMonthly: '₹3.1L',
    totalEngagements: 2,
  });

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-007-2025',
      type: 'milestone_received',
      description: 'Milestone Payment — Financial Model Development',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      amount: '+₹2,00,000',
      amountNum: 200000,
      date: 'Mar 28, 2025',
      time: '3:45 PM',
      status: 'Received',
      txRef: 'TXN-007-2025',
    },
    {
      id: 'TXN-006-2025',
      type: 'milestone_received',
      description: 'Milestone Payment — Campaign Strategy',
      engagement: 'Go-to-Market Expansion',
      company: 'TechScale Ventures',
      amount: '+₹1,50,000',
      amountNum: 150000,
      date: 'Apr 1, 2025',
      time: '2:30 PM',
      status: 'Received',
      txRef: 'TXN-006-2025',
    },
    {
      id: 'TXN-005-2025',
      type: 'withdrawal',
      description: 'Withdrawal to HDFC Bank ••••4321',
      engagement: '—',
      company: '—',
      amount: '-₹3,00,000',
      amountNum: -300000,
      date: 'Mar 30, 2025',
      time: '10:15 AM',
      status: 'Completed',
      txRef: 'TXN-005-2025',
    },
    {
      id: 'TXN-004-2025',
      type: 'milestone_received',
      description: 'Milestone Payment — Discovery & Assessment',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      amount: '+₹1,50,000',
      amountNum: 150000,
      date: 'Feb 25, 2025',
      time: '5:00 PM',
      status: 'Received',
      txRef: 'TXN-004-2025',
    },
    {
      id: 'TXN-003-2025',
      type: 'platform_fee',
      description: 'Platform Service Fee (10%)',
      engagement: 'Series B Funding Strategy',
      company: 'ExigentCX',
      amount: '-₹15,000',
      amountNum: -15000,
      date: 'Feb 25, 2025',
      time: '5:01 PM',
      status: 'Deducted',
      txRef: 'TXN-003-2025',
    },
    {
      id: 'TXN-002-2025',
      type: 'milestone_pending',
      description: 'Milestone Payment — Investor Deck & Data Room',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      amount: '+₹2,50,000',
      amountNum: 250000,
      date: '—',
      time: '—',
      status: 'In Escrow',
      txRef: 'TXN-002-2025',
    },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-EXP-006',
      title: 'Financial Model Development — March 2025',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      amount: '₹2,00,000',
      date: 'Mar 28, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-EXP-005',
      title: 'Campaign Strategy Completion',
      engagement: 'Go-to-Market Expansion',
      company: 'TechScale Ventures',
      companyLogo: 'TV',
      logoColor: 'from-blue-600 to-indigo-500',
      amount: '₹1,50,000',
      date: 'Apr 1, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-EXP-004',
      title: 'Investor Deck & Data Room',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      amount: '₹2,50,000',
      date: 'Apr 25, 2025',
      status: 'Pending',
      type: 'Milestone Invoice',
    },
    {
      id: 'INV-EXP-003',
      title: 'Discovery & Assessment — February 2025',
      engagement: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      amount: '₹1,50,000',
      date: 'Feb 25, 2025',
      status: 'Paid',
      type: 'Milestone Invoice',
    },
  ]);

  const fetchPaymentData = async () => {
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
      const summaryRes = await fetch(`${baseUrl}/api/payments/summary`, { headers });
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary({
          totalEarned: data.totalSpent,
          thisMonth: data.totalSpent,
          inEscrow: data.totalBalance,
          availableToWithdraw: data.totalSpent,
          nextPayment: data.pendingRelease,
          nextPaymentDate: 'Within 30 Days',
          avgMonthly: '₹3.1L',
          totalEngagements: 2,
        });
      }

      const txsRes = await fetch(`${baseUrl}/api/payments/transactions`, { headers });
      if (txsRes.ok) {
        const txs = await txsRes.json();
        const mapped = txs.map(t => {
          if (t.type === 'milestone_release') {
            return {
              id: t.id,
              type: 'milestone_received',
              description: `Milestone Payment — ${t.description.replace('Milestone Payment — ', '')}`,
              engagement: t.engagement,
              company: 'Acme Corp',
              amount: "+" + t.amount.replace(/[-]/g, ''),
              amountNum: Math.abs(t.amountNum),
              date: t.date,
              time: t.time,
              status: 'Received',
              txRef: t.txRef
            };
          } else if (t.type === 'platform_fee') {
            return {
              id: t.id,
              type: 'platform_fee',
              description: t.description,
              engagement: t.engagement,
              company: 'ExigentCX',
              amount: t.amount,
              amountNum: t.amountNum,
              date: t.date,
              time: t.time,
              status: 'Deducted',
              txRef: t.txRef
            };
          } else if (t.type === 'escrow_add') {
            return {
              id: t.id,
              type: 'milestone_pending',
              description: `Milestone Pending — ${t.description.replace('Funds Added to Escrow — ', '')}`,
              engagement: t.engagement,
              company: 'Acme Corp',
              amount: t.amount,
              amountNum: t.amountNum,
              date: t.date,
              time: t.time,
              status: 'In Escrow',
              txRef: t.txRef
            };
          }
          return t;
        });
        setTransactions(mapped);
      }

      const invoicesRes = await fetch(`${baseUrl}/api/payments/invoices`, { headers });
      if (invoicesRes.ok) {
        const invs = await invoicesRes.json();
        const mappedInvs = invs.map(inv => ({
          id: inv.id,
          title: inv.title,
          engagement: inv.engagement,
          company: inv.expert === '—' ? 'ExigentCX' : 'Acme Corp',
          companyLogo: 'AC',
          logoColor: 'from-[#134e40] to-[#0eb59a]',
          amount: inv.amount,
          date: inv.date,
          status: inv.status,
          type: inv.type
        }));
        setInvoices(mappedInvs);
      }
    } catch (err) {
      console.error("Error loading expert payment info:", err);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [expertProfile]);

  const payoutAccounts = [
    {
      id: 'bank',
      label: 'HDFC Bank',
      detail: 'Savings ••••4321',
      icon: Building,
      verified: true,
      default: true,
    },
    {
      id: 'upi',
      label: 'UPI',
      detail: 'david@hdfcbank',
      icon: Zap,
      verified: true,
      default: false,
    },
  ];

  const payoutHistory = [
    { date: 'Mar 30, 2025', amount: '₹3,00,000', method: 'HDFC Bank ••••4321', status: 'Completed', days: 1 },
    { date: 'Feb 28, 2025', amount: '₹1,50,000', method: 'HDFC Bank ••••4321', status: 'Completed', days: 1 },
    { date: 'Jan 31, 2025', amount: '₹1,50,000', method: 'HDFC Bank ••••4321', status: 'Completed', days: 1 },
  ];

  const quickAmounts = ['₹50,000', '₹1,00,000', '₹2,00,000', '₹3,50,000'];

  // ── HELPERS ──
  const getTxIcon = (type) => {
    switch (type) {
      case 'milestone_received': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'withdrawal': return { icon: Landmark, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'platform_fee': return { icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50' };
      case 'milestone_pending': return { icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50' };
      default: return { icon: IndianRupee, color: 'text-gray-400', bg: 'bg-gray-50' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Received': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'In Escrow': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Deducted': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.engagement.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const data = "Expert Earnings Report\nTotal Lifetime Earnings," + summary.totalEarned + "\nAvailable to Withdraw," + summary.availableToWithdraw + "\n";
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'expert_earnings_report.csv');
    a.click();
  };

  const handleDownloadInvoice = (invoice) => {
    if (!invoice) return;
    const data = `Invoice ID: ${invoice.id}\nTitle: ${invoice.title}\nCompany: ${invoice.company}\nAmount: ${invoice.amount}\nDate: ${invoice.date}\nStatus: ${invoice.status}\n`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `invoice_${invoice.id}.txt`);
    a.click();
  };

  const handleWithdraw = () => {
    setWithdrawSent(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSent(false);
      setWithdrawAmount('');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117] flex">

      {/* MOBILE BACKDROP */}
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

        {/* Logo */}
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
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(s => !s)}
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-gray-100 dark:hover:bg-white/10 transition-all shrink-0"
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
            const isActive = item.isActive || window.location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40]'
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
        <div className="p-3 border-t border-gray-50 dark:border-white/10 space-y-1">
          <div className={`flex items-center gap-3 px-3 py-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Theme</span>}
            <ThemeToggle />
          </div>
          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/expert-settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
              window.location.pathname === '/expert-settings'
                ? 'bg-[#134e40] text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40]'
            }`}
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
              const isDemo = localStorage.getItem('demo_expert') === 'true';
              if (isDemo) {
                localStorage.removeItem('demo_expert');
              } else {
                await supabase.auth.signOut();
              }
              navigate('/signin?role=expert');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 font-bold text-left mt-1"
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
        className="flex flex-col min-h-screen overflow-x-hidden flex-grow"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* STICKY HEADER */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#1b1d24] border-b border-gray-100 dark:border-white/10 shadow-sm px-6 py-3 flex items-center justify-between">
          
          {/* Left - Page Title only */}
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
            <div className="text-left">
              <h1 className="text-lg font-black text-[#1C3627] dark:text-white">
                Earnings & Payouts
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Track your income, invoices, and payment history
              </p>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            
            {/* Export button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <Download size={13} /> Export
            </motion.button>

            {/* Withdraw Funds button */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(20,78,64,0.3)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
            >
              <Landmark size={13} /> Withdraw Funds
            </motion.button>

            {/* Bell notification */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] hover:bg-gray-100 transition-all relative border-0 cursor-pointer"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse"
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
                      className="absolute right-0 top-11 w-80 bg-white dark:bg-[#1b1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-white/10">
                        <h4 className="font-black text-[#1C3627] dark:text-white text-sm">Notifications</h4>
                        <span className="text-[10px] font-bold text-[#0eb59a] cursor-pointer">Mark all read</span>
                      </div>
                      {notifications.map((notif, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${notif.unread ? 'bg-teal-50/20 dark:bg-teal-500/5' : ''}`}
                        >
                          <div className={`w-8 h-8 ${notif.color} rounded-xl flex items-center justify-center shrink-0`}>
                            <Bell size={13} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#1C3627] dark:text-white mb-0.5 text-left">{notif.title}</p>
                            <p className="text-[11px] text-gray-500 text-left">{notif.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-1 text-left">{notif.time}</p>
                          </div>
                          {notif.unread && (
                            <div className="w-2 h-2 bg-[#0eb59a] rounded-full shrink-0 mt-1" />
                          )}
                        </motion.div>
                      ))}
                      <div className="px-4 py-3 border-t border-gray-50 text-center">
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors border-0 bg-transparent cursor-pointer">
                          View all notifications →
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Expert Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/expert-profile')}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md overflow-hidden"
            >
              {expertProfile?.profile_url ? (
                <img src={expertProfile.profile_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                expertProfile?.full_name
                  ? expertProfile.full_name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'EX'
              )}
            </motion.div>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="flex-1 overflow-y-auto bg-[#f4f7f5] dark:bg-[#0f1117] [&::-webkit-scrollbar]:hidden">
          <div className="relative max-w-7xl mx-auto px-8 py-8 pb-16 space-y-6">

            {/* ── HERO EARNINGS CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-gradient-to-br from-[#0d1f2d] via-[#134e40] to-[#0eb59a]/80 rounded-3xl p-7 text-white relative overflow-hidden shadow-2xl"
            >
              {/* Decorative circles */}
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-[#0eb59a]/20 rounded-full" />
              <div className="absolute left-1/2 -bottom-16 w-64 h-64 bg-white/3 rounded-full" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">

                {/* Left — Total earned */}
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-1">
                    Total Lifetime Earnings
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-black mb-2 tracking-tight"
                  >
                    {summary.totalEarned}
                  </motion.p>
                  <div className="flex items-center gap-2 text-sm justify-start">
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-xl">
                      <ArrowUpRight size={13} className="text-emerald-300" />
                      <span className="font-black text-emerald-300">{summary.thisMonth} this month</span>
                    </div>
                    <span className="text-white/40 text-xs font-semibold">Avg {summary.avgMonthly}/mo</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-24 bg-white/10" />

                {/* Right — Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:pl-2">
                  {[
                    { label: 'Available to Withdraw', value: summary.availableToWithdraw, icon: Wallet, accent: true },
                    { label: 'In Escrow', value: summary.inEscrow, icon: Lock, accent: false },
                    { label: 'Next Payment', value: summary.nextPayment, icon: Calendar, accent: false },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.07 }}
                      className={`flex flex-col gap-1.5 p-3 rounded-2xl ${
                        item.accent ? 'bg-[#0eb59a]/20 border border-[#0eb59a]/30' : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <item.icon size={12} className={item.accent ? 'text-[#0eb59a]' : 'text-white/50'} />
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wide">{item.label}</p>
                      </div>
                      <p className={`text-lg font-black text-left ${item.accent ? 'text-[#0eb59a]' : 'text-white'}`}>
                        {item.value}
                      </p>
                      {idx === 2 && (
                        <p className="text-[10px] text-white/40 font-semibold text-left">{summary.nextPaymentDate}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── SUMMARY CARDS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: 'This Month', value: summary.thisMonth, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', trend: '+12% vs last month' },
                { label: 'In Escrow', value: summary.inEscrow, icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400', trend: '3 milestones pending' },
                { label: 'Withdrawable', value: summary.availableToWithdraw, icon: Unlock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-400', trend: 'Available now' },
                { label: 'Active Clients', value: summary.totalEngagements, icon: Building, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-l-purple-400', trend: '2 engagements' },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.07 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}
                  className={`bg-white dark:bg-[#1e2028] rounded-2xl p-5 border border-gray-100 dark:border-white/10 border-l-4 ${card.border} shadow-sm transition-all cursor-default group relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-2 leading-tight text-left">
                      {card.label}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <card.icon size={17} className={card.color} />
                    </motion.div>
                  </div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 text-left relative z-10">{card.value}</p>
                  <p className="text-[10px] text-gray-400 font-semibold text-left relative z-10">{card.trend}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── TABS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex gap-1 bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-2xl p-1 shadow-sm w-fit"
            >
              {tabs.map(tab => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#134e40] text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>

            {/* ── TAB CONTENT ── */}
            <AnimatePresence mode="wait">

              {/* ══ OVERVIEW TAB ══ */}
              {activeTab === 'Overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Left — Chart + recent */}
                  <div className="lg:col-span-2 space-y-5">

                    {/* Monthly earnings chart */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-base flex items-center gap-2">
                          <BarChart2 size={16} className="text-[#0eb59a]" /> Monthly Earnings
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#134e40] to-[#0eb59a]" />
                          Milestone Payments
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="flex items-end gap-3 h-36 mb-4 relative z-10">
                        {monthlyData.map((bar, idx) => (
                          <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 + idx * 0.08 }}
                              className="text-[10px] font-bold text-gray-400"
                            >
                              {bar.label}
                            </motion.span>
                            <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(bar.amount / 400) * 96}px` }}
                                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                                className={`w-full rounded-xl ${
                                  bar.amount > 0
                                    ? bar.month === 'Apr'
                                      ? 'bg-gradient-to-t from-[#134e40] to-[#0eb59a] ring-2 ring-[#0eb59a]/30'
                                      : 'bg-gradient-to-t from-[#134e40] to-[#0eb59a]'
                                    : 'bg-gray-100 dark:bg-white/10'
                                }`}
                              />
                            </div>
                            <span className={`text-[10px] font-black text-gray-500 dark:text-gray-400 ${
                              idx % 2 !== 0 ? 'hidden sm:block' : ''
                            }`}>
                              {bar.month}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Chart footer */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-white/10 relative z-10 text-left">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Year to Date (2025)</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">₹10,50,000</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Avg Monthly</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">{summary.avgMonthly}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Best Month</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">₹3,50,000</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-base flex items-center gap-2">
                          <Clock size={16} className="text-[#0eb59a]" /> Recent Activity
                        </h3>
                        <button
                          onClick={() => setActiveTab('Transactions')}
                          className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors border-0 bg-transparent cursor-pointer"
                        >
                          View All →
                        </button>
                      </div>
                      <div className="space-y-3 relative z-10">
                        {transactions.slice(0, 4).map((tx, idx) => {
                          const txIcon = getTxIcon(tx.type);
                          return (
                            <motion.div
                              key={tx.id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.07 }}
                              className="flex items-center gap-3"
                            >
                              <div className={`w-9 h-9 ${txIcon.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <txIcon.icon size={15} className={txIcon.color} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate leading-tight">{tx.description}</p>
                                <p className="text-[10px] text-gray-400 font-semibold">{tx.date}</p>
                              </div>
                              <span className={`text-xs font-black shrink-0 ${
                                tx.amountNum > 0 ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {tx.amount}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-5">

                    {/* Withdraw CTA */}
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-5 relative overflow-hidden"
                    >
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm mb-1 flex items-center gap-2 relative z-10">
                        <Wallet size={15} className="text-[#0eb59a]" /> Available to Withdraw
                      </h3>
                      <p className="text-3xl font-black text-[#134e40] mb-1 text-left relative z-10">{summary.availableToWithdraw}</p>
                      <p className="text-xs text-gray-400 font-semibold mb-4 text-left relative z-10">From 2 completed milestones</p>
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowWithdrawModal(true)}
                        className="w-full py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all border-0 cursor-pointer relative z-10"
                      >
                        <Landmark size={15} /> Withdraw Now
                      </motion.button>
                    </motion.div>

                    {/* Upcoming Payments */}
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-5 relative overflow-hidden"
                    >
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm mb-4 flex items-center gap-2 relative z-10">
                        <Target size={15} className="text-[#0eb59a]" /> Upcoming Payments
                      </h3>
                      <div className="space-y-3 relative z-10">
                        {[
                          { milestone: 'Investor Deck & Data Room', company: 'Acme Corp', amount: '₹2,50,000', date: 'Apr 30, 2025', logo: 'AC', logoColor: 'from-[#134e40] to-[#0eb59a]' },
                          { milestone: 'Investor Outreach', company: 'Acme Corp', amount: '₹3,00,000', date: 'May 31, 2025', logo: 'AC', logoColor: 'from-[#134e40] to-[#0eb59a]' },
                          { milestone: 'Due Diligence Report', company: 'TechScale', amount: '₹1,25,000', date: 'May 15, 2025', logo: 'TV', logoColor: 'from-blue-600 to-indigo-500' },
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + idx * 0.07 }}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center shrink-0`}>
                              <span className="text-white text-[10px] font-black">{item.logo}</span>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{item.milestone}</p>
                              <p className="text-[10px] text-gray-400 font-semibold">{item.company} · {item.date}</p>
                            </div>
                            <p className="font-black text-[#134e40] text-sm shrink-0">{item.amount}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Platform fees note */}
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-4 relative overflow-hidden"
                    >
                      <div className="flex items-start gap-2 relative z-10 text-left">
                        <Shield size={14} className="text-purple-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-gray-800 dark:text-white text-xs mb-1">Platform Fee</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                            ExigentCX charges a <span className="font-black text-gray-700 dark:text-gray-200">10% platform fee</span> on each milestone payment. This covers PMO support, legal protection, and escrow management.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick actions */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-5 relative overflow-hidden">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm mb-3 relative z-10">Quick Actions</h3>
                      <div className="space-y-2 relative z-10">
                        {[
                          { label: 'View Invoices', icon: FileText, action: () => setActiveTab('Invoices') },
                          { label: 'Payout Settings', icon: Landmark, action: () => setActiveTab('Payouts') },
                          { label: 'Download Statement', icon: Download, action: handleExport },
                        ].map((item, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#0eb59a] transition-all border-0 bg-transparent cursor-pointer"
                          >
                            <item.icon size={15} className="text-[#0eb59a]" />
                            <span className="text-left">{item.label}</span>
                            <ChevronRight size={13} className="ml-auto text-gray-300" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ TRANSACTIONS TAB ══ */}
              {activeTab === 'Transactions' && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-left"
                >
                  {/* Search */}
                  <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0eb59a] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-white/10 rounded-xl text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all shadow-sm max-w-md"
                    />
                  </div>

                  <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-white/10 flex items-center justify-between relative z-10">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm">
                        All Transactions
                        <span className="ml-2 text-xs font-bold text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-white/10">
                          {filteredTransactions.length}
                        </span>
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        onClick={handleExport}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        <Download size={13} /> Export CSV
                      </motion.button>
                    </div>

                    <div className="divide-y divide-gray-50 dark:divide-white/5 relative z-10">
                      {filteredTransactions.map((tx, idx) => {
                        const txIcon = getTxIcon(tx.type);
                        return (
                          <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            {/* Top row on mobile */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${txIcon.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <txIcon.icon size={16} className={txIcon.color} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">{tx.description}</p>
                                <p className="text-xs text-gray-400 font-semibold truncate">
                                  {tx.engagement !== '—' ? tx.engagement : tx.company}
                                </p>
                              </div>
                              {/* Amount — right on mobile */}
                              <p className={`font-black text-gray-900 dark:text-gray-200 sm:hidden ${tx.amountNum > 0 ? 'text-emerald-600' : ''}`}>
                                {tx.amount}
                              </p>
                            </div>

                            {/* Bottom row on mobile — hidden on desktop */}
                            <div className="flex items-center justify-between sm:hidden pl-12">
                              <span className="text-xs text-gray-400">
                                {tx.date} {tx.time !== '—' ? `· ${tx.time}` : ''}
                              </span>
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getStatusStyle(tx.status)}`}>
                                {tx.status}
                              </span>
                            </div>

                            {/* Desktop layout — hidden on mobile */}
                            <div className="hidden sm:flex items-center gap-4">
                              <div className="text-right">
                                <p className={`font-black text-base ${tx.amountNum > 0 ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {tx.amount}
                                </p>
                                <p className="text-[10px] text-gray-400 font-semibold">
                                  {tx.date !== '—' ? `${tx.date} · ${tx.time}` : 'Pending'}
                                </p>
                              </div>
                              <div className="shrink-0 flex flex-col items-end gap-1 min-w-[80px]">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getStatusStyle(tx.status)}`}>
                                  {tx.status}
                                </span>
                                <span className="text-[10px] text-gray-300 dark:text-gray-600 font-semibold">{tx.txRef}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ INVOICES TAB ══ */}
              {activeTab === 'Invoices' && (
                <motion.div
                  key="invoices"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-base">
                      All Invoices <span className="text-sm font-bold text-gray-400">({invoices.length})</span>
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      onClick={handleExport}
                      className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <Download size={13} /> Export All
                    </motion.button>
                  </div>

                  {invoices.map((invoice, idx) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
                      className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 flex items-center gap-5 group transition-all relative overflow-hidden"
                    >
                      {/* Company logo */}
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${invoice.logoColor} flex items-center justify-center shrink-0 relative z-10`}>
                        <span className="text-white font-black text-sm">{invoice.companyLogo}</span>
                      </div>

                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2 mb-1 justify-start">
                          <h4 className="font-black text-gray-900 dark:text-white text-sm truncate">{invoice.title}</h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${getStatusStyle(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-semibold">
                          <span>{invoice.id}</span>
                          <span>·</span>
                          <span>{invoice.company}</span>
                          <span>·</span>
                          <span>{invoice.type}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {invoice.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 relative z-10">
                        <p className="font-black text-[#134e40] text-xl">{invoice.amount}</p>
                        {invoice.status === 'Pending' && (
                          <p className="text-[10px] text-amber-500 font-bold">Awaiting approval</p>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setShowInvoiceModal(invoice)}
                          className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all border-0 cursor-pointer"
                        >
                          <Eye size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all border-0 cursor-pointer"
                        >
                          <Download size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ══ PAYOUTS TAB ══ */}
              {activeTab === 'Payouts' && (
                <motion.div
                  key="payouts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left"
                >
                  {/* Left — Payout accounts */}
                  <div className="lg:col-span-2 space-y-5">

                    {/* Withdraw CTA banner */}
                    <div className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-6 text-white relative overflow-hidden shadow-sm">
                      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Ready to Withdraw</p>
                          <p className="text-3xl font-black mb-1">{summary.availableToWithdraw}</p>
                          <p className="text-white/60 text-xs">Clears to your bank in 1-2 business days</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowWithdrawModal(true)}
                          className="flex items-center gap-2 px-5 py-3 bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-sm font-black rounded-2xl transition-all shadow-lg shrink-0 border-0 cursor-pointer"
                        >
                          <Landmark size={15} /> Withdraw Now
                        </motion.button>
                      </div>
                    </div>

                    {/* Payout accounts */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-5 relative z-10">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-base">Payout Accounts</h3>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          className="flex items-center gap-2 text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors border-0 bg-transparent cursor-pointer"
                        >
                          <Plus size={13} /> Add Account
                        </motion.button>
                      </div>

                      <div className="space-y-3 relative z-10">
                        {payoutAccounts.map((account) => (
                          <motion.div
                            key={account.id}
                            whileHover={{ x: 3 }}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-[#0eb59a]/30 hover:bg-teal-50/30 dark:hover:bg-[#0eb59a]/10 transition-all cursor-pointer"
                          >
                            <account.icon className="text-gray-400 shrink-0" size={22} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 justify-start">
                                <p className="font-black text-gray-900 dark:text-white text-sm">{account.label}</p>
                                {account.verified && (
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-0.5">
                                    <Check size={8} strokeWidth={3} /> Verified
                                  </span>
                                )}
                                {account.default && (
                                  <span className="text-[9px] font-black text-[#134e40] dark:text-[#0eb59a] bg-teal-50 dark:bg-teal-500/10 px-1.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-500/20">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 font-semibold mt-0.5 text-left">{account.detail}</p>
                            </div>
                            <ChevronRight size={15} className="text-gray-300" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Payout history */}
                    <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative">
                      <div className="px-6 py-4 border-b border-gray-50 dark:border-white/10 relative z-10">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm">Payout History</h3>
                      </div>
                      <div className="divide-y divide-gray-50 dark:divide-white/5 relative z-10">
                        {payoutHistory.map((payout, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.07 }}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                              <Landmark size={16} className="text-emerald-500" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{payout.method}</p>
                              <p className="text-xs text-gray-400 font-semibold">
                                {payout.date} · Cleared in {payout.days} {payout.days > 1 ? 'days' : 'day'}
                              </p>
                            </div>
                            <p className="font-black text-[#134e40]">{payout.amount}</p>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getStatusStyle(payout.status)}`}>
                              {payout.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — Info */}
                  <div className="space-y-5">
                    <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-5 relative overflow-hidden">
                      <h3 className="font-black text-[#1C3627] text-sm mb-4 flex items-center gap-2 relative z-10">
                        <Shield size={14} className="text-[#0eb59a]" /> Payout Policy
                      </h3>
                      <div className="space-y-3 relative z-10">
                        {[
                          { label: 'Processing Time', value: '1-2 business days' },
                          { label: 'Minimum Withdrawal', value: '₹10,000' },
                          { label: 'Platform Fee', value: '10% per milestone' },
                          { label: 'TDS Deduction', value: '10% (Form 16A issued)' },
                          { label: 'GST', value: 'Applicable as per slab' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-400 font-semibold">{item.label}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-200">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-[#0eb59a]/10 rounded-2xl border border-teal-100 dark:border-[#0eb59a]/20 p-4 relative overflow-hidden">
                      <div className="relative z-10 text-left">
                        <p className="font-black text-[#134e40] text-sm mb-2 flex items-center gap-2">
                          <Star size={13} fill="#0eb59a" className="text-[#0eb59a]" /> Tax Benefits
                        </p>
                        <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
                          All invoices are GST-compliant. Form 16A is issued each quarter for TDS deductions. Download your tax statement from the Invoices tab.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ══ WITHDRAW MODAL ══ */}
      <AnimatePresence>
        {showWithdrawModal && (
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
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1e2028] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <AnimatePresence mode="wait">
                {!withdrawSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    <div className="flex items-center justify-between mb-6">
                      <div className="text-left">
                        <h3 className="text-xl font-black text-[#1C3627] dark:text-white">Withdraw Funds</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Available: {summary.availableToWithdraw}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(''); }}
                        className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 border-0 cursor-pointer"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>

                    {/* Quick amounts */}
                    <div className="mb-5 text-left">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {quickAmounts.map(amount => (
                          <motion.button
                            key={amount}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setWithdrawAmount(amount)}
                            className={`py-3 rounded-2xl text-sm font-black border-2 transition-all cursor-pointer ${
                              withdrawAmount === amount
                                ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            {amount}
                          </motion.button>
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="text"
                          placeholder="Enter custom amount..."
                          value={withdrawAmount.startsWith('₹') ? '' : withdrawAmount}
                          onChange={e => setWithdrawAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all text-left"
                        />
                      </div>
                    </div>

                    {/* Payout method */}
                    <div className="mb-5 text-left">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-3">
                        Payout To
                      </label>
                      <div className="space-y-2">
                        {payoutAccounts.map(account => (
                          <motion.button
                            key={account.id}
                            whileHover={{ x: 3 }}
                            onClick={() => setSelectedPayout(account.id)}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                              selectedPayout === account.id
                                ? 'border-[#0eb59a] bg-teal-50'
                                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                            }`}
                          >
                            <account.icon className="text-gray-400 shrink-0" size={20} />
                            <div className="flex-1">
                              <p className={`text-sm font-black ${selectedPayout === account.id ? 'text-[#134e40]' : 'text-gray-700'}`}>
                                {account.label}
                              </p>
                              <p className="text-xs text-gray-400 font-semibold">{account.detail}</p>
                            </div>
                            {selectedPayout === account.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-[#0eb59a] rounded-full flex items-center justify-center shrink-0"
                              >
                                <Check size={11} className="text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-teal-50 rounded-xl border border-teal-100 mb-5 text-left">
                      <Clock size={14} className="text-[#0eb59a] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-teal-700 leading-relaxed font-semibold">
                        Funds will appear in your account within <span className="font-black">1-2 business days</span>. TDS of 10% will be deducted as per Income Tax Act.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl cursor-pointer border-0"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: withdrawAmount ? 1.02 : 1, boxShadow: withdrawAmount ? '0 8px 25px rgba(20,78,64,0.25)' : 'none' }}
                        whileTap={{ scale: withdrawAmount ? 0.98 : 1 }}
                        disabled={!withdrawAmount}
                        onClick={handleWithdraw}
                        className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all border-0 cursor-pointer ${
                          withdrawAmount
                            ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Landmark size={14} className="inline mr-1.5" />
                        Withdraw {withdrawAmount || 'Funds'}
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
                    <h3 className="text-xl font-black text-[#1C3627] mb-2">Withdrawal Initiated!</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                      <span className="font-bold text-gray-700">{withdrawAmount}</span> is being transferred to your account. It will appear within 1-2 business days.
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: 2 }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100"
                    >
                      <Shield size={12} /> Secured by ExigentCX
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ INVOICE PREVIEW MODAL ══ */}
      <AnimatePresence>
        {showInvoiceModal && (
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
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1e2028] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-0.5">Invoice</p>
                  <h3 className="text-lg font-black text-[#1C3627] dark:text-white">{showInvoiceModal.id}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowInvoiceModal(null)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 border-0 cursor-pointer"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5 mb-5 space-y-3">
                {[
                  { label: 'Description', value: showInvoiceModal.title },
                  { label: 'Company', value: showInvoiceModal.company },
                  { label: 'Engagement', value: showInvoiceModal.engagement },
                  { label: 'Invoice Date', value: showInvoiceModal.date },
                  { label: 'Type', value: showInvoiceModal.type },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400 font-semibold text-left">{item.label}</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-right max-w-[200px]">{item.value}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-900">Amount</span>
                  <span className="font-black text-2xl text-[#134e40]">{showInvoiceModal.amount}</span>
                </div>
              </div>

              <div className="text-left">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border mb-5 ${getStatusStyle(showInvoiceModal.status)}`}>
                  {showInvoiceModal.status === 'Paid' ? <Check size={11} strokeWidth={3} /> : <Clock size={11} />}
                  {showInvoiceModal.status}
                </span>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowInvoiceModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl border-0 cursor-pointer"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDownloadInvoice(showInvoiceModal)}
                  className="flex-1 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                  <Download size={14} /> Download PDF
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertEarnings;
