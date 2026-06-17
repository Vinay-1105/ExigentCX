import Logo from '../components/Logo';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, FileText, Download, Eye, Check,
  Clock, AlertCircle, Shield, Search, Filter,
  X, CheckCircle, ArrowLeft, Calendar, DollarSign,
  Users, Briefcase, Lock, Unlock, MoreVertical,
  PenLine, RefreshCw, ExternalLink, Copy, Zap,
  Building, ChevronDown, LayoutDashboard, Bell, Settings,
  ShieldCheck, ChevronLeft, BarChart2, CreditCard, LogOut, MessageSquare
} from 'lucide-react';
import FormalCardBorder from '../components/FormalCardBorder';

const staticMockContracts = [
  {
    id: 1,
    title: 'Engagement Agreement — Interim CFO',
    type: 'Engagement Agreement',
    status: 'Pending Signature',
    expert: 'David Chen',
    expertAvatar: 'https://i.pravatar.cc/150?u=david',
    expertTitle: 'Interim CFO',
    engagement: 'Series B Funding Strategy',
    value: '₹18,00,000',
    duration: '6 months',
    startDate: 'Feb 1, 2025',
    endDate: 'Jul 31, 2025',
    createdDate: 'Jan 28, 2025',
    expiresAt: 'Feb 3, 2025',
    signedByExpert: true,
    signedByCompany: false,
    generatedBy: 'ExigentCX Platform',
    pages: 8,
    fileSize: '1.2 MB',
    urgency: 'high',
  },
  {
    id: 2,
    title: 'Non-Disclosure Agreement — David Chen',
    type: 'NDA',
    status: 'Signed',
    expert: 'David Chen',
    expertAvatar: 'https://i.pravatar.cc/150?u=david',
    expertTitle: 'Interim CFO',
    engagement: 'Series B Funding Strategy',
    value: '—',
    duration: '2 years',
    startDate: 'Feb 1, 2025',
    endDate: 'Feb 1, 2027',
    createdDate: 'Jan 28, 2025',
    expiresAt: null,
    signedByExpert: true,
    signedByCompany: true,
    signedDate: 'Feb 1, 2025',
    generatedBy: 'ExigentCX Platform',
    pages: 4,
    fileSize: '0.6 MB',
    urgency: null,
  },
  {
    id: 3,
    title: 'Engagement Agreement — Fractional CMO',
    type: 'Engagement Agreement',
    status: 'Signed',
    expert: 'Sarah Jenkins',
    expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
    expertTitle: 'Fractional CMO',
    engagement: 'Go-to-Market Expansion',
    value: '₹9,00,000',
    duration: '3 months',
    startDate: 'Mar 1, 2025',
    endDate: 'May 31, 2025',
    createdDate: 'Feb 25, 2025',
    expiresAt: null,
    signedByExpert: true,
    signedByCompany: true,
    signedDate: 'Feb 28, 2025',
    generatedBy: 'ExigentCX Platform',
    pages: 8,
    fileSize: '1.1 MB',
    urgency: null,
  },
  {
    id: 4,
    title: 'Non-Disclosure Agreement — Sarah Jenkins',
    type: 'NDA',
    status: 'Signed',
    expert: 'Sarah Jenkins',
    expertAvatar: 'https://i.pravatar.cc/150?u=sarah',
    expertTitle: 'Fractional CMO',
    engagement: 'Go-to-Market Expansion',
    value: '—',
    duration: '2 years',
    startDate: 'Feb 28, 2025',
    endDate: 'Feb 28, 2027',
    createdDate: 'Feb 25, 2025',
    expiresAt: null,
    signedByExpert: true,
    signedByCompany: true,
    signedDate: 'Feb 28, 2025',
    generatedBy: 'ExigentCX Platform',
    pages: 4,
    fileSize: '0.6 MB',
    urgency: null,
  },
  {
    id: 5,
    title: 'Engagement Agreement — VP Engineering',
    type: 'Engagement Agreement',
    status: 'Under Review',
    expert: 'Priya Patel',
    expertAvatar: 'https://i.pravatar.cc/150?u=priya',
    expertTitle: 'Fractional VP Engineering',
    engagement: 'Tech Infrastructure Scale-up',
    value: '₹7,20,000',
    duration: '4 months',
    startDate: 'May 1, 2025',
    endDate: 'Aug 31, 2025',
    createdDate: 'Apr 20, 2025',
    expiresAt: 'Apr 30, 2025',
    signedByExpert: false,
    signedByCompany: false,
    generatedBy: 'ExigentCX Platform',
    pages: 8,
    fileSize: '1.0 MB',
    urgency: 'medium',
  },
  {
    id: 6,
    title: 'Advisory Agreement — Interim COO',
    type: 'Advisory Agreement',
    status: 'Expired',
    expert: 'Marcus Johnson',
    expertAvatar: 'https://i.pravatar.cc/150?u=marcus',
    expertTitle: 'Interim COO',
    engagement: 'Operations Restructuring',
    value: '₹4,50,000',
    duration: '3 months',
    startDate: 'Nov 1, 2024',
    endDate: 'Jan 31, 2025',
    createdDate: 'Oct 28, 2024',
    expiresAt: 'Oct 30, 2024',
    signedByExpert: false,
    signedByCompany: false,
    signedDate: null,
    generatedBy: 'ExigentCX Platform',
    pages: 6,
    fileSize: '0.9 MB',
    urgency: null,
  },
];

const mapContractFromDb = (dbContract) => ({
  id: dbContract.id,
  title: dbContract.title,
  type: dbContract.type,
  status: dbContract.status,
  expert: dbContract.expert_name || 'Expert',
  expertAvatar: dbContract.expert_avatar || 'https://i.pravatar.cc/150?u=expert',
  expertTitle: dbContract.expert_title || 'CXO Advisor',
  company: dbContract.company_name || 'Client',
  companyLogo: dbContract.company_logo || 'CO',
  logoColor: dbContract.logo_color || 'from-[#134e40] to-[#0eb59a]',
  engagement: dbContract.title.includes('NDA') ? 'Non-Disclosure Agreement' : (dbContract.title.includes('CFO') ? 'Series B Funding Strategy' : (dbContract.title.includes('CMO') ? 'Go-to-Market Expansion' : (dbContract.title.includes('Engineering') ? 'Tech Infrastructure Scale-up' : (dbContract.title.includes('COO') ? 'Operations Restructuring' : 'Consulting Engagement')))),
  value: dbContract.value,
  duration: dbContract.duration,
  startDate: dbContract.start_date,
  endDate: dbContract.end_date,
  createdDate: dbContract.created_date,
  expiresAt: dbContract.expires_at,
  signedByExpert: dbContract.signed_by_expert,
  signedByCompany: dbContract.signed_by_company,
  signedDate: dbContract.signed_date,
  generatedBy: dbContract.generated_by,
  pages: dbContract.pages,
  fileSize: dbContract.file_size,
  urgency: dbContract.urgency,
  expert_email: dbContract.expert_email,
  company_email: dbContract.company_email
});

const Contracts = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();

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
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showSignModal, setShowSignModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [signatureText, setSignatureText] = useState('');
  const [signatureSent, setSignatureSent] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    { id: 1, title: 'Contract Pending Signature', desc: 'Engagement Agreement — Interim CFO awaits your signature', time: '2 min ago', unread: true, color: 'bg-amber-500' },
    { id: 2, title: 'NDA Ready', desc: 'Non-Disclosure Agreement with Priya Patel is ready', time: '1 hour ago', unread: true, color: 'bg-blue-500' },
    { id: 3, title: 'Contract Signed', desc: 'Engagement Agreement — Fractional CMO fully executed', time: '2 days ago', unread: false, color: 'bg-emerald-500' },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Add download handler:
  const handleDownload = (contract) => {
    const content = `CONTRACT: ${contract.title}\nExpert: ${contract.expert}\nEngagement: ${contract.engagement}\nValue: ${contract.value}\nDuration: ${contract.startDate} to ${contract.endDate}\nStatus: ${contract.status}\n\n${contractPreview}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = (contract) => {
    navigator.clipboard.writeText(`${window.location.origin}/contracts/${contract.id}`);
    alert('Contract link copied to clipboard!');
  };

  // ── DATA ──
  const filters = ['All', 'Pending Signature', 'Signed', 'Under Review', 'Expired'];

  const isDemo = localStorage.getItem('demo_company') === 'true';
  const [contracts, setContracts] = useState(isDemo ? staticMockContracts : []);

  // Fetch and Real-Time Sync
  useEffect(() => {
    if (isDemo) return;

    let channel;

    const fetchContracts = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setContracts(data.map(mapContractFromDb));
        }
      } catch (err) {
        console.error("Error fetching contracts from backend:", err);
      }
    };

    fetchContracts();

    // Subscribe to Postgres changes on 'contracts' table in real-time
    channel = supabase
      .channel('contracts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contracts' },
        (payload) => {
          console.log('Realtime change received in Company contracts:', payload);
          if (payload.eventType === 'INSERT') {
            setContracts(prev => [mapContractFromDb(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setContracts(prev => prev.map(c => c.id === payload.new.id ? mapContractFromDb(payload.new) : c));
          } else if (payload.eventType === 'DELETE') {
            setContracts(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    if (contractId) {
      const match = contracts.find(c => c.id.toString() === contractId.toString());
      if (match) {
        setSelectedContract(match);
      }
    }
  }, [contractId, contracts]);

  // ── CONTRACT PREVIEW CONTENT ──
  const contractPreview = `
ENGAGEMENT AGREEMENT

This Engagement Agreement ("Agreement") is entered into as of February 1, 2025, between:

COMPANY: Acme Corp Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at [Address] ("Company")

AND

EXPERT: David Chen, an independent professional ("Expert")

FACILITATED BY: ExigentCX Platform ("Platform")

1. SCOPE OF ENGAGEMENT
The Expert agrees to provide Interim CFO services to the Company for the purposes of Series B Funding Strategy, including but not limited to:
  a) Financial modeling and 3-year projections
  b) Investor relations and fundraising support
  c) Data room preparation and due diligence management
  d) Board reporting and governance

2. TERM
This Agreement shall commence on February 1, 2025, and shall continue for a period of 6 months, ending on July 31, 2025, unless terminated earlier in accordance with the terms hereof.

3. COMPENSATION
The Company agrees to pay the Expert ₹3,00,000 per month, payable on a milestone basis as defined in Schedule A, held in escrow by the Platform and released upon Company approval.

4. CONFIDENTIALITY
The Expert agrees to maintain strict confidentiality of all Company information and has separately executed a Non-Disclosure Agreement dated February 1, 2025.

5. INTELLECTUAL PROPERTY
All work product, deliverables, and materials created by the Expert during this engagement shall be the sole property of the Company.

6. GOVERNING LAW
This Agreement shall be governed by the laws of India and subject to the jurisdiction of courts in Mumbai, Maharashtra.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
  `;

  // ── HELPERS ──
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Signed':
        return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' };
      case 'Pending Signature':
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock, dot: 'bg-amber-500' };
      case 'Under Review':
        return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Eye, dot: 'bg-blue-500' };
      case 'Expired':
        return { color: 'text-gray-400 bg-gray-50 border-gray-200', icon: X, dot: 'bg-gray-400' };
      default:
        return { color: 'text-gray-400 bg-gray-50 border-gray-200', icon: FileText, dot: 'bg-gray-400' };
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'NDA': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Engagement Agreement': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Advisory Agreement': return 'text-teal-700 bg-teal-50 border-teal-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredContracts = contracts.filter(c => {
    const matchFilter = activeFilter === 'All' || c.status === activeFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.expert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: contracts.length,
    pending: contracts.filter(c => c.status === 'Pending Signature').length,
    signed: contracts.filter(c => c.status === 'Signed').length,
    review: contracts.filter(c => c.status === 'Under Review').length,
  };

  const handleSign = async () => {
    try {
      const isDemo = localStorage.getItem('demo_company') === 'true';
      if (isDemo) {
        setSignatureSent(true);
        setTimeout(() => {
          setContracts(prev => prev.map(c => c.id === showSignModal.id ? {
            ...c,
            signedByCompany: true,
            status: c.signedByExpert ? 'Signed' : 'Pending Signature',
            signedDate: c.signedByExpert ? 'Today' : null,
            signature_company: signatureText
          } : c));
          setShowSignModal(null);
          setSignatureSent(false);
          setSignatureText('');
        }, 2000);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/${showSignModal.id}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ signatureText })
      });

      if (res.ok) {
        setSignatureSent(true);
        setTimeout(() => {
          setShowSignModal(null);
          setSignatureSent(false);
          setSignatureText('');
        }, 2000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to sign contract');
      }
    } catch (err) {
      console.error('Sign error:', err);
      alert('Error signing contract');
    }
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

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = item.path === '/contracts' || window.location.pathname === item.path;
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
        className="flex flex-col min-h-screen overflow-x-hidden"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-1">
            <button onClick={() => navigate('/company-dashboard')} className="hover:text-[#134e40] font-semibold transition-colors">Dashboard</button>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-[#134e40] font-bold">Contracts & NDAs</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Platform Protected badge */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#0d1f2d] to-[#134e40] text-white px-4 py-2 rounded-xl"
            >
              <Shield size={13} className="text-[#0eb59a]" />
              <div>
                <p className="text-[10px] font-black leading-none">Platform Protected</p>
                <p className="text-[9px] text-white/60 mt-0.5">Auto-generated & legally binding</p>
              </div>
            </motion.div>

            {/* Bell */}
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
                            <p className="text-xs font-black text-[#1C3627] mb-0.5 text-left">{notif.title}</p>
                            <p className="text-[11px] text-gray-500 text-left">{notif.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-1 text-left">{notif.time}</p>
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

            <motion.div
              whileHover={{ scale: 1.08, ringWidth: 2, ringColor: '#0eb59a', ringOffsetWidth: 2 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md transition-all duration-200 overflow-hidden"
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

        {/* ── PAGE BODY ── */}
        <div className="flex-1 px-6 py-6 pb-16 space-y-5 overflow-x-hidden">

          {/* ── KPI CARDS — compact horizontal ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Contracts', value: stats.total, icon: FileText, iconBg: 'bg-gray-100', iconColor: 'text-gray-500', numColor: 'text-[#1C3627]', border: 'border-l-gray-400' },
              { label: 'Pending Signature', value: stats.pending, icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', numColor: 'text-amber-700', border: 'border-l-amber-400' },
              { label: 'Fully Signed', value: stats.signed, icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', numColor: 'text-emerald-700', border: 'border-l-emerald-400' },
              { label: 'Under Review', value: stats.review, icon: Eye, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', numColor: 'text-blue-700', border: 'border-l-blue-400' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                className={`bg-white rounded-2xl p-4 border-l-4 ${stat.border} cursor-default relative overflow-hidden`}
              >
                <FormalCardBorder />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className={`w-6 h-6 ${stat.iconBg} rounded-md flex items-center justify-center shrink-0`}>
                    <stat.icon size={12} className={stat.iconColor} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">{stat.label}</span>
                </div>
                <p className={`text-[26px] font-black ${stat.numColor} leading-none text-left relative z-10`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* ── PENDING ALERT ── */}
          <AnimatePresence>
            {stats.pending > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0"
                >
                  <AlertCircle size={20} className="text-amber-600" />
                </motion.div>
                <div className="flex-1 text-left">
                  <p className="font-black text-amber-800 text-sm text-left">
                    {stats.pending} contract{stats.pending > 1 ? 's' : ''} awaiting your signature
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5 text-left">
                    Please sign before the expiry date to activate your engagement.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 15px rgba(245,158,11,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveFilter('Pending Signature')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shrink-0"
                >
                  View Now
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SEARCH + FILTERS ── */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">

            {/* Search bar */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts, experts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-left text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              />
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {filters.map(filter => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeFilter === filter
                      ? 'bg-[#134e40] text-white shadow-md'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0eb59a]/40 hover:text-[#0eb59a]'
                    }`}
                >
                  {filter}
                  {filter !== 'All' && contracts.filter(c => c.status === filter).length > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${activeFilter === filter ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {contracts.filter(c => c.status === filter).length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── CONTRACTS LIST ── */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredContracts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText size={22} className="text-gray-300" />
                  </div>
                  <h3 className="font-black text-gray-700 text-base mb-1">No contracts found</h3>
                  <p className="text-gray-400 text-sm">
                    {searchQuery ? `No results for "${searchQuery}"` : `No ${activeFilter.toLowerCase()} contracts`}
                  </p>
                </motion.div>
              ) : (
                filteredContracts.map((contract, idx) => {
                  const statusStyle = getStatusStyle(contract.status);
                  return (
                    <motion.div
                      key={contract.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(0,0,0,0.07)', transition: { duration: 0.2 } }}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                      className={`bg-white rounded-2xl overflow-hidden group cursor-default relative ${contract.status === 'Expired' ? 'opacity-60' : ''
                        }`}
                    >
                      <FormalCardBorder />
                      <div className="p-5 relative z-10">
                        <div className="flex items-start gap-4">

                          {/* Document icon */}
                          <motion.div
                            whileHover={{ rotate: -5, scale: 1.05 }}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${contract.type === 'NDA' ? 'bg-purple-50' :
                                contract.type === 'Advisory Agreement' ? 'bg-teal-50' : 'bg-blue-50'
                              }`}
                          >
                            <FileText size={20} className={
                              contract.type === 'NDA' ? 'text-purple-500' :
                                contract.type === 'Advisory Agreement' ? 'text-teal-500' : 'text-blue-500'
                            } />
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${getTypeStyle(contract.type)}`}>
                                {contract.type}
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 ${statusStyle.color}`}>
                                {contract.status === 'Pending Signature' && (
                                  <motion.span
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                                  />
                                )}
                                {contract.status === 'Signed' && <Check size={8} strokeWidth={3} />}
                                {contract.status}
                              </span>
                              {contract.urgency === 'high' && (
                                <motion.span
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1"
                                >
                                  <Zap size={8} fill="currentColor" /> Expires Soon
                                </motion.span>
                              )}
                            </div>

                            {/* Title */}
                            <h3
                              onClick={() => setShowViewModal(contract)}
                              className="font-black text-[#1C3627] text-sm group-hover:text-[#0eb59a] transition-colors cursor-pointer leading-tight mb-2 text-left hover:underline"
                            >
                              {contract.title}
                            </h3>

                            {/* Meta row */}
                            <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 font-semibold mb-3">
                              <span className="flex items-center gap-1 text-left">
                                <Users size={10} className="text-[#0eb59a]" />
                                {contract.expert} · {contract.expertTitle}
                              </span>
                              <span className="flex items-center gap-1 text-left">
                                <Briefcase size={10} className="text-blue-400" />
                                {contract.engagement}
                              </span>
                              {contract.value !== '—' && (
                                <span className="flex items-center gap-1 text-left">
                                  <DollarSign size={10} className="text-purple-400" />
                                  {contract.value}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-left">
                                <Calendar size={10} className="text-rose-400" />
                                {contract.startDate} → {contract.endDate}
                              </span>
                              <span className="flex items-center gap-1 text-left">
                                <FileText size={10} className="text-gray-300" />
                                {contract.pages}pp · {contract.fileSize}
                              </span>
                            </div>

                            {/* Signature status row */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2">
                                {/* Expert */}
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${contract.signedByExpert
                                      ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                      : 'text-gray-400 bg-gray-50 border-gray-100'
                                    }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${contract.signedByExpert ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`}>
                                    {contract.signedByExpert
                                      ? <Check size={8} className="text-white" strokeWidth={3} />
                                      : <Clock size={8} className="text-gray-400" />}
                                  </div>
                                  {contract.expert.split(' ')[0]}
                                </motion.div>

                                <ChevronRight size={10} className="text-gray-300" />

                                {/* Company */}
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${contract.signedByCompany
                                      ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                      : 'text-amber-600 bg-amber-50 border-amber-100'
                                    }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${contract.signedByCompany ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}>
                                    {contract.signedByCompany
                                      ? <Check size={8} className="text-white" strokeWidth={3} />
                                      : <Clock size={8} className="text-white" />}
                                  </div>
                                  Acme Corp
                                </motion.div>
                              </div>

                              {contract.signedDate && (
                                <span className="text-[10px] text-gray-400 font-semibold text-left">
                                  Signed {contract.signedDate}
                                </span>
                              )}
                              {contract.expiresAt && !contract.signedByCompany && (
                                <motion.span
                                  animate={{ opacity: [1, 0.6, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="text-[10px] text-red-500 font-bold flex items-center gap-1 text-left"
                                >
                                  <AlertCircle size={9} /> Sign before {contract.expiresAt}
                                </motion.span>
                              )}
                            </div>
                          </div>

                          {/* Action buttons — right side */}
                          <div className="flex flex-col gap-2 shrink-0">
                            {/* Primary CTA */}
                            {contract.status === 'Pending Signature' ? (
                              <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(20,78,64,0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSignModal(contract)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-xs font-black rounded-xl shadow-md"
                              >
                                <PenLine size={12} /> Sign Now
                              </motion.button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.04, backgroundColor: '#F0FDF4', borderColor: '#0eb59a' }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setShowViewModal(contract)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:text-[#0eb59a] transition-all"
                              >
                                <Eye size={12} /> {contract.status === 'Signed' ? 'View' : 'Preview'}
                              </motion.button>
                            )}

                            {/* Secondary buttons row */}
                            <div className="flex gap-1.5 justify-end">
                              <motion.button
                                whileHover={{ scale: 1.1, color: '#0eb59a', backgroundColor: '#F0FDF4' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDownload(contract)}
                                title="Download"
                                className="p-2 bg-white border border-gray-200 text-gray-400 rounded-xl transition-all"
                              >
                                <Download size={13} />
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1, color: '#3B82F6', backgroundColor: '#EFF6FF' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCopyLink(contract)}
                                title="Copy Link"
                                className="p-2 bg-white border border-gray-200 text-gray-400 rounded-xl transition-all"
                              >
                                <Copy size={13} />
                              </motion.button>

                              {/* More */}
                              <div className="relative">
                                <motion.button
                                  whileHover={{ scale: 1.1, backgroundColor: '#F9FAFB' }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setActiveDropdown(activeDropdown === contract.id ? null : contract.id)}
                                  className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-gray-600 rounded-xl transition-all"
                                >
                                  <MoreVertical size={13} />
                                </motion.button>

                                <AnimatePresence>
                                  {activeDropdown === contract.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                                    >
                                      {[
                                        { label: 'View Contract', icon: Eye, action: () => { setShowViewModal(contract); setActiveDropdown(null); } },
                                        { label: 'Download PDF', icon: Download, action: () => { handleDownload(contract); setActiveDropdown(null); } },
                                        { label: 'Copy Link', icon: Copy, action: () => { handleCopyLink(contract); setActiveDropdown(null); } },
                                        ...(contract.status === 'Pending Signature' ? [{ label: 'Sign Now', icon: PenLine, action: () => { setShowSignModal(contract); setActiveDropdown(null); } }] : []),
                                        ...(contract.status === 'Expired' ? [{ label: 'Request Renewal', icon: RefreshCw, action: () => setActiveDropdown(null) }] : []),
                                      ].map((item, iIdx) => (
                                        <motion.button
                                          key={iIdx}
                                          whileHover={{ backgroundColor: '#F0FDF4', x: 2 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={item.action}
                                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-600 transition-colors text-left"
                                        >
                                          <item.icon size={13} className="text-[#0eb59a]" />
                                          {item.label}
                                        </motion.button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status accent bottom bar */}
                      {contract.status === 'Pending Signature' && (
                        <div className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 relative overflow-hidden">
                          <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                          />
                        </div>
                      )}
                      {contract.status === 'Signed' && (
                        <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* ── HOW IT WORKS — compact ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-black text-[#1C3627] text-sm mb-4 flex items-center gap-2 text-left">
              <Shield size={14} className="text-[#0eb59a]" /> How ExigentCX Manages Your Contracts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: FileText, title: 'Auto-Generated', desc: 'All contracts auto-generated when engagement is confirmed — no manual drafting.', color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Shield, title: 'Legally Binding', desc: 'Every agreement is legally vetted and compliant with Indian contract law.', color: 'text-purple-500', bg: 'bg-purple-50' },
                { icon: Lock, title: 'Escrow-Linked', desc: 'Contracts linked to milestone-based escrow — funds release only after your approval.', color: 'text-teal-500', bg: 'bg-teal-50' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3, backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-default transition-all"
                >
                  <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <item.icon size={15} className={item.color} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-[#1C3627] text-xs mb-1 text-left">{item.title}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed text-left">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Dropdown backdrop */}
      {activeDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}

      {/* ══ VIEW CONTRACT MODAL ══ */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal header — gradient */}
              <div style={{ background: 'linear-gradient(135deg, #0d1f2d, #134e40)', padding: '20px 24px' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showViewModal.type === 'NDA' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                      }`}>
                      <FileText size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm leading-tight text-left">{showViewModal.title}</h3>
                      <p className="text-xs text-white/60 font-semibold text-left">{showViewModal.pages} pages · {showViewModal.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(showViewModal)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <Download size={12} /> Download
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowViewModal(null)}
                      className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>
                </div>

                {/* Signature status inside header */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                  {[
                    { label: showViewModal.expert.split(' ')[0], signed: showViewModal.signedByExpert },
                    { label: 'Acme Corp', signed: showViewModal.signedByCompany },
                    { label: 'ExigentCX', signed: true },
                  ].map((party, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-xs font-bold">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${party.signed ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}>
                        {party.signed
                          ? <Check size={9} className="text-white" strokeWidth={3} />
                          : <Clock size={9} className="text-white" />}
                      </div>
                      <span className={party.signed ? 'text-emerald-300' : 'text-amber-300'}>
                        {party.label}
                      </span>
                    </div>
                  ))}
                  <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-lg ${showViewModal.status === 'Signed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                    {showViewModal.status}
                  </span>
                </div>
              </div>

              {/* Contract text */}
              <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden">
                <div className="bg-[#FAFBF9] rounded-2xl border border-gray-100 p-6">
                  <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap text-left font-mono">
                    {contractPreview}
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-50 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowViewModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl transition-all"
                >
                  Close
                </motion.button>
                {showViewModal.status === 'Pending Signature' && (
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(20,78,64,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setShowViewModal(null); setShowSignModal(showViewModal); }}
                    className="flex-1 py-3 text-sm font-black rounded-2xl text-white"
                    style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
                  >
                    <PenLine size={14} className="inline mr-1.5" /> Sign This Contract
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SIGN CONTRACT MODAL ══ */}
      <AnimatePresence>
        {showSignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowSignModal(null); setSignatureText(''); }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!signatureSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    {/* Gradient header */}
                    <div style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)', padding: '24px' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={showSignModal.expertAvatar}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white/30"
                          />
                          <div>
                            <p className="text-white font-black text-sm text-left">{showSignModal.expert}</p>
                            <p className="text-white/70 text-xs text-left">{showSignModal.expertTitle}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setShowSignModal(null); setSignatureText(''); }}
                          className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                          <X size={13} />
                        </motion.button>
                      </div>
                      <h3 className="text-white font-black text-lg text-left">Sign Contract</h3>
                      <p className="text-white/70 text-xs mt-1 text-left">
                        {showSignModal.title}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-6">

                      {/* Contract summary */}
                      <div className="bg-[#FAFBF9] rounded-xl border border-gray-100 p-4 mb-5">
                        {[
                          { label: 'Engagement', value: showSignModal.engagement },
                          { label: 'Value', value: showSignModal.value },
                          { label: 'Duration', value: `${showSignModal.startDate} → ${showSignModal.endDate}` },
                          { label: 'Pages', value: `${showSignModal.pages} pages · ${showSignModal.fileSize}` },
                        ].map((item, idx) => (
                          <div key={idx} className={`flex justify-between text-xs py-1.5 ${idx < 3 ? 'border-b border-gray-100' : ''}`}>
                            <span className="text-gray-400 font-semibold text-left">{item.label}</span>
                            <span className="font-bold text-[#1C3627] text-right">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Signature input */}
                      <div className="mb-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-left">
                          Your Full Name — Digital Signature
                        </label>
                        <input
                          type="text"
                          value={signatureText}
                          onChange={e => setSignatureText(e.target.value)}
                          placeholder="Type your full name exactly..."
                          className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-[#134e40] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all text-left"
                          style={{ fontFamily: 'cursive', fontSize: '15px' }}
                          onFocus={e => e.target.style.borderColor = '#0eb59a'}
                          onBlur={e => e.target.style.borderColor = signatureText ? '#0eb59a' : '#E5E7EB'}
                        />
                        <AnimatePresence>
                          {signatureText && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[10px] text-gray-400 mt-2 font-semibold text-left"
                            >
                              Signature preview:{' '}
                              <span style={{ fontFamily: 'cursive', fontSize: '13px' }} className="text-[#134e40] font-bold">
                                {signatureText}
                              </span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Legal notice */}
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-5">
                        <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 leading-relaxed text-left">
                          By signing, you agree to all terms. Your digital signature is legally binding under the IT Act, 2000.
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setShowSignModal(null); setSignatureText(''); }}
                          className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl transition-all"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: signatureText.trim() ? 1.03 : 1, boxShadow: signatureText.trim() ? '0 8px 25px rgba(20,78,64,0.3)' : 'none' }}
                          whileTap={{ scale: signatureText.trim() ? 0.97 : 1 }}
                          disabled={!signatureText.trim()}
                          onClick={handleSign}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: signatureText.trim() ? 'linear-gradient(135deg, #134e40, #0eb59a)' : '#F3F4F6',
                            color: signatureText.trim() ? 'white' : '#9CA3AF',
                            border: 'none',
                            borderRadius: '16px',
                            fontSize: '14px',
                            fontWeight: 800,
                            cursor: signatureText.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <PenLine size={14} /> Sign & Submit
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 px-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 12px 40px rgba(14,181,154,0.3)',
                      }}
                    >
                      <Check size={36} color="white" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-black text-[#1C3627] mb-2">Contract Signed!</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Your signature has been applied. The engagement is now officially active.
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: 2 }}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-[#134e40] text-xs font-black rounded-xl border border-teal-100"
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

    </div>
  );
};

export default Contracts;
