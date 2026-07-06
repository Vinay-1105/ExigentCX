import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, User, Bell, CreditCard, Shield,
  Save, Check, X, Plus, Trash2,
  Mail, Phone, Globe, Linkedin, Lock,
  Eye, LogOut, AlertCircle, Landmark,
  Building, CheckCircle, Copy,
  Zap, Download, Settings, FileText,
  Search, Grid, Star
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import {
  LayoutDashboard, Briefcase, Activity, IndianRupee,
  UserCircle, MessageSquare, Calendar, ChevronLeft
} from 'lucide-react';

// ── Toggle component (must be outside ExpertSettings to keep stable reference) ──
const Toggle = ({ value, onToggle }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 border-0 cursor-pointer ${
      value ? 'bg-[#0eb59a]' : 'bg-gray-200 dark:bg-white/20'
    }`}
  >
    <motion.div
      initial={false}
      animate={{ x: value ? 24 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
    />
  </motion.button>
);

const ExpertSettings = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) setGridOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sidebarMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/expert-dashboard' },
    { name: 'Opportunities', icon: Briefcase, path: '/expert-opportunities' },
    { name: 'My Engagements', icon: Activity, path: '/expert-engagements' },
    { name: 'Contracts', icon: FileText, path: '/expert-contracts' },
    { name: 'Earnings', icon: IndianRupee, path: '/expert-earnings' },
    { name: 'Profile', icon: UserCircle, path: '/expert-profile' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Meetings', icon: Calendar, path: '/meetings' },
  ];

  // ── SETTINGS STATE ──
  const [activeTab, setActiveTab] = useState('Account');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);

  const [account, setAccount] = useState({
    email: 'david.chen@email.com',
    phone: '+91 98765 43210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    loginAlerts: true,
  });

  const [notifications, setNotifications] = useState({
    newInvitation: true, proposalUpdate: true, milestoneApproved: true,
    paymentReceived: true, contractReady: true, companyMessage: true,
    weeklyEarnings: true, newOpportunities: true, platformUpdates: false,
    marketingEmails: false, smsAlerts: true, whatsappAlerts: true, emailDigest: true,
  });

  const [payoutAccounts, setPayoutAccounts] = useState([
    { id: 1, type: 'bank', label: 'HDFC Bank', accountHolder: 'David Chen', accountNumber: '••••••4321', ifsc: 'HDFC0001234', branch: 'Mumbai — Bandra West', verified: true, default: true },
    { id: 2, type: 'upi', label: 'UPI', upiId: 'david@hdfcbank', verified: true, default: false },
  ]);

  const [newBank, setNewBank] = useState({ accountHolder: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '' });

  const [privacy, setPrivacy] = useState({
    profileVisible: true, showRate: true, showContactInfo: false,
    showLinkedIn: true, allowDirectMessages: true, showInSearch: true, anonymousMode: false,
  });

  const tabs = [
    { id: 'Account', icon: User, color: 'text-[#0eb59a]', bg: 'bg-teal-50' },
    { id: 'Notifications', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'Payout Settings', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'Privacy', icon: Shield, color: 'text-[#0eb59a]', bg: 'bg-teal-50' },
  ];

  const notificationGroups = [
    {
      title: 'Engagement Alerts', desc: 'Updates on your active engagements',
      items: [
        { key: 'newInvitation', label: 'New Role Invitation', desc: 'When a company invites you to apply for a role' },
        { key: 'proposalUpdate', label: 'Proposal Status Update', desc: 'When a company responds to your proposal' },
        { key: 'milestoneApproved', label: 'Milestone Approved', desc: 'When a company approves your deliverable' },
        { key: 'paymentReceived', label: 'Payment Received', desc: 'When a payment is released to your account' },
        { key: 'contractReady', label: 'Contract Ready to Sign', desc: 'When a contract is ready for your signature' },
        { key: 'companyMessage', label: 'Company Messages', desc: 'When a client company sends you a message' },
      ],
    },
    {
      title: 'Opportunities', desc: 'New roles and matches',
      items: [
        { key: 'newOpportunities', label: 'New Role Matches', desc: 'When new roles match your profile and skills' },
        { key: 'weeklyEarnings', label: 'Weekly Earnings Summary', desc: 'Weekly digest of your earnings and activity' },
        { key: 'platformUpdates', label: 'Platform Updates', desc: 'New features and product improvements' },
        { key: 'marketingEmails', label: 'Marketing & Tips', desc: 'Expert tips, guides, and promotional content' },
      ],
    },
    {
      title: 'Mobile & Messaging', desc: 'SMS, WhatsApp, and email preferences',
      items: [
        { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical updates via SMS to your registered number' },
        { key: 'whatsappAlerts', label: 'WhatsApp Alerts', desc: 'Real-time updates via WhatsApp (recommended)' },
        { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Daily summary of all activity in your account' },
      ],
    },
  ];

  const privacyItems = [
    { key: 'profileVisible', label: 'Profile Visible to Companies', desc: 'Allow companies to find and view your profile', icon: User },
    { key: 'showRate', label: 'Show Rate Card', desc: 'Display your monthly rates on your public profile', icon: CreditCard },
    { key: 'showContactInfo', label: 'Show Contact Info', desc: 'Allow companies to see your email and phone before hiring', icon: Mail },
    { key: 'showLinkedIn', label: 'Show LinkedIn Profile', desc: 'Display your LinkedIn URL on your profile', icon: Linkedin },
    { key: 'allowDirectMessages', label: 'Allow Direct Messages', desc: 'Let companies message you before you apply', icon: Mail },
    { key: 'showInSearch', label: 'Show in Search Results', desc: 'Appear in company searches and recommendations', icon: Globe },
    { key: 'anonymousMode', label: 'Anonymous Mode', desc: 'Hide your name and photo until you accept an invitation', icon: Eye },
  ];

  const appNotifications = [
    { title: 'New Role Match', desc: 'Fractional CFO role at HealthTech — 96% match', time: '10 min ago', unread: true, color: 'bg-[#0eb59a]' },
    { title: 'Milestone Approved', desc: 'Acme Corp approved Financial Model Development', time: '2 hours ago', unread: true, color: 'bg-emerald-500' },
    { title: 'Payment Received', desc: '₹2,00,000 credited for milestone completion', time: '3 hours ago', unread: true, color: 'bg-teal-600' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const isDemo = localStorage.getItem('sb-mock-auth') === 'true' || localStorage.getItem('demo_expert') === 'true';
      if (isDemo) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/expert/profile`, { headers: { 'Authorization': `Bearer ${session.access_token}` } });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setAccount(prev => ({ ...prev, email: data.email || prev.email, phone: data.phone || prev.phone }));
        }
      } catch (err) { console.error("Error fetching profile:", err); }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const isDemo = localStorage.getItem('sb-mock-auth') === 'true' ||
      localStorage.getItem('demo_expert') === 'true';
    if (isDemo) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { alert("Please sign in first"); return; }
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/expert/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ ...profile, email: account.email, phone: account.phone })
      });
      if (response.ok) { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
      else { const e = await response.json(); alert(`Error: ${e.error || 'Unknown error'}`); }
    } catch (err) { alert("Failed to save settings"); }
  };

  const toggleNotification = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key) => setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  const setDefaultPayout = (id) => setPayoutAccounts(prev => prev.map(acc => ({ ...acc, default: acc.id === id })));
  const removePayout = (id) => setPayoutAccounts(prev => prev.filter(acc => acc.id !== id));
  const copyReferralCode = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleAddBank = () => {
    if (newBank.accountHolder && newBank.accountNumber && newBank.ifsc) {
      setPayoutAccounts(prev => [...prev, { id: prev.length + 1, type: 'bank', label: newBank.bankName || 'Bank Account', accountHolder: newBank.accountHolder, accountNumber: `••••••${newBank.accountNumber.slice(-4)}`, ifsc: newBank.ifsc, branch: '—', verified: false, default: false }]);
      setShowAddBankModal(false);
      setNewBank({ accountHolder: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '' });
    }
  };


  return (
    <div className="flex h-screen bg-[#f4f7f5] dark:bg-[#0f1117] font-sans overflow-hidden text-slate-900 dark:text-white">

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
            <p className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {sidebarMenu.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]"
            >
              <item.icon size={17} className="shrink-0" />
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
              >
                {item.name}
              </motion.span>
            </motion.button>
          ))}
        </nav>

        {/* Settings — active pinned bottom */}
        <div className="p-3 border-t border-gray-50 dark:border-white/5 space-y-1">
          <div className={`flex items-center gap-3 px-3 py-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Theme</span>}
            <ThemeToggle />
          </div>
          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative bg-[#134e40] text-white shadow-md"
          >
            <motion.div className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full" />
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

      {/* ══ MAIN CONTENT ══ */}
      <div
        className="flex flex-col flex-1 min-h-screen overflow-x-hidden"
        style={{ marginLeft: isSidebarOpen ? 260 : 68, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >

        {/* ── STICKY HEADER ── */}
        <header className="h-16 bg-white dark:bg-[#1b1d24] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3" />

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'}`} />
              <input
                type="text"
                placeholder="Search settings..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border rounded-full text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-white/10 focus:outline-none transition-all duration-200 ${searchFocused ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20' : 'border-gray-200 dark:border-white/10'}`}
              />
              {!searchFocused && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Save success toast */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                >
                  <Check size={13} strokeWidth={3} /> Saved!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid */}
            <div className="relative" ref={gridRef}>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { setGridOpen(!gridOpen); setShowNotificationPanel(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${gridOpen ? 'bg-teal-50 border-[#0eb59a] text-[#134e40]' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'}`}
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
                    className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1e2028] rounded-2xl z-50 overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl"
                  >
                    <div className="p-3 space-y-1">
                      {[
                        { icon: Briefcase, label: 'Opportunities', path: '/expert-opportunities' },
                        { icon: Activity, label: 'Engagements', path: '/expert-engagements' },
                        { icon: IndianRupee, label: 'Earnings', path: '/expert-earnings' },
                        { icon: UserCircle, label: 'Profile', path: '/expert-profile' },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 3 }}
                          onClick={() => { navigate(item.path); setGridOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer border-l-2 border-[#0eb59a] hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                            <item.icon size={13} className="text-[#134e40]" />
                          </div>
                          <span className="text-sm font-bold text-[#1C3627] dark:text-white text-left">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { setShowNotificationPanel(!showNotificationPanel); setGridOpen(false); }}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${showNotificationPanel ? 'bg-teal-50 border-[#0eb59a]' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'}`}
              >
                <Bell size={16} className={showNotificationPanel ? 'text-[#134e40]' : 'text-gray-500'} />
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5"
                >
                  {appNotifications.filter(n => n.unread).length}
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {showNotificationPanel && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setShowNotificationPanel(false)} className="fixed inset-0 z-40" />
                    <motion.div
                      initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '100%' }} transition={{ duration: 0.3, type: 'tween' }}
                      className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-[#1b1d24] shadow-2xl border-l border-gray-100 dark:border-white/10 z-50 flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 dark:border-white/10 flex items-center justify-between">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm">Notifications</h3>
                        <button className="text-xs font-bold text-[#0eb59a]">Mark all read</button>
                      </div>
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {appNotifications.map((notif, idx) => (
                          <div key={idx} className={`px-5 py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex gap-3 transition-colors ${notif.unread ? 'bg-teal-50/20 dark:bg-teal-500/5' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1C3627] dark:text-white leading-tight text-left">{notif.title}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-left">{notif.desc}</p>
                              <p className="text-[10px] text-gray-300 dark:text-gray-600 font-semibold mt-1 text-left">{notif.time}</p>
                            </div>
                            {notif.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/expert-profile')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
            >
              {profile?.profile_url
                ? <img src={profile.profile_url} alt="Profile" className="w-full h-full object-cover" />
                : (profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EX')
              }
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </motion.div>
          </div>
        </header>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">

          {/* ── HERO STRIP ── */}
          <div className="relative overflow-hidden border-b border-teal-100/60 dark:border-white/5 dark:bg-[#1b1d24]">
            <div className="absolute inset-0 dark:hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5f1 50%, #f8fafc 100%)' }} />
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle, rgba(14,181,154,0.12) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="absolute top-0 right-0 w-48 h-24 bg-[#0eb59a]/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 px-6 py-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1.5 bg-white border border-[#0eb59a]/30 rounded-full px-3 py-1 shadow-sm">
                    <Settings size={10} className="text-[#0eb59a]" />
                    <span className="text-[10px] font-black text-[#134e40] uppercase tracking-[0.15em]">Account Settings</span>
                  </div>
                </div>
                <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2 text-left">
                  Settings
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium text-left">
                  Manage your account, notifications, payout preferences and privacy.
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── TAB PILLS ── */}
          <div className="px-6 pt-5 pb-0">
            <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-all border ${isActive
                      ? 'bg-[#134e40] text-white border-[#134e40] shadow-md'
                      : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-[#0eb59a]/40 hover:text-[#134e40]'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : tab.bg}`}>
                      <tab.icon size={12} className={isActive ? 'text-white' : tab.color} />
                    </div>
                    {tab.id}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="px-6 py-5 pb-20">
            <AnimatePresence mode="wait">

              {/* ══ ACCOUNT ══ */}
              {activeTab === 'Account' && (
                <motion.div key="account" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">

                  {/* Contact Info */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-5 text-left">
                      <div className="w-7 h-7 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-xl flex items-center justify-center"><User size={14} className="text-[#0eb59a]" /></div>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Email Address', key: 'email', type: 'email', icon: Mail },
                        { label: 'Phone Number', key: 'phone', type: 'tel', icon: Phone },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-left">{field.label}</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <field.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type={field.type} value={account[field.key]}
                                onChange={e => setAccount(prev => ({ ...prev, [field.key]: e.target.value }))}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                              />
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-2 bg-emerald-50 border border-emerald-100 rounded-xl shrink-0">
                              <CheckCircle size={12} className="text-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-600">Verified</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Password & Security */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-5 text-left">
                      <div className="w-7 h-7 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-xl flex items-center justify-center"><Lock size={14} className="text-[#0eb59a]" /></div>
                      Password & Security
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Two-Factor Authentication', desc: 'Extra security via OTP on login', key: 'twoFactor' },
                        { label: 'Login Alerts', desc: 'Get notified of new logins to your account', key: 'loginAlerts' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-[#FAFBF9] dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                          <div className="text-left">
                            <p className="font-bold text-[#1C3627] dark:text-white text-sm">{item.label}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</p>
                          </div>
                          <Toggle value={account[item.key]} onToggle={() => setAccount(prev => ({ ...prev, [item.key]: !prev[item.key] }))} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-2 text-left">
                      <div className="w-7 h-7 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-xl flex items-center justify-center"><Zap size={14} className="text-[#0eb59a]" /></div>
                      Referral Program
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-semibold leading-relaxed text-left">
                      Refer other experts and earn <span className="font-black text-gray-700 dark:text-gray-300">₹5,000</span> for every expert who completes their first engagement.
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-[#0eb59a]/10 dark:to-emerald-500/10 rounded-2xl border border-teal-100 dark:border-[#0eb59a]/20">
                      <div className="flex-1 text-left">
                        <p className="text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Your Referral Code</p>
                        <p className="font-black text-[#134e40] text-lg tracking-widest">DAVID-CFO-2025</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={copyReferralCode}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {[{ label: 'Referrals Sent', value: '3' }, { label: 'Joined', value: '2' }, { label: 'Earned', value: '₹10,000' }].map((item, idx) => (
                        <motion.div key={idx} whileHover={{ y: -2 }} className="text-center p-3 bg-[#FAFBF9] dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                          <p className="font-black text-[#1C3627] dark:text-white text-base">{item.value}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-3.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={15} /> Save Account Settings
                  </motion.button>

                  {/* Danger Zone */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-red-100 dark:border-red-500/20 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 className="font-black text-red-600 text-sm flex items-center gap-2 mb-3 text-left">
                      <AlertCircle size={15} /> Danger Zone
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed text-left">
                      Deleting your account is permanent. All profile data, engagement history, and earnings records will be removed.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                    >
                      <Trash2 size={13} /> Delete Expert Account
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ══ NOTIFICATIONS ══ */}
              {activeTab === 'Notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
                  {notificationGroups.map((group, gIdx) => (
                    <div
                      key={group.title}
                      className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden"
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    >
                      <div className="mb-4 text-left">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm">{group.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-semibold">{group.desc}</p>
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item, iIdx) => (
                          <motion.div
                            key={item.key}
                            whileHover={{}}
                            className="flex items-center justify-between px-3 py-3 rounded-xl transition-all hover:bg-white/5 dark:hover:bg-white/5"
                          >
                            <div className="flex-1 pr-4 text-left">
                              <p className="font-bold text-[#1C3627] dark:text-white text-sm">{item.label}</p>
                              <p className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle value={notifications[item.key]} onToggle={() => toggleNotification(item.key)} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-3.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={15} /> Save Notification Preferences
                  </motion.button>
                </motion.div>
              )}

              {/* ══ PAYOUT SETTINGS ══ */}
              {activeTab === 'Payout Settings' && (
                <motion.div key="payout" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">

                  {/* Payout accounts */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-left">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center"><Landmark size={14} className="text-emerald-600" /></div>
                          Payout Accounts
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 font-semibold">Payments are released here after milestone approval</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAddBankModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-xs font-black rounded-xl shadow-md"
                      >
                        <Plus size={13} /> Add Account
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      {payoutAccounts.map((acc, idx) => (
                        <motion.div
                          key={acc.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          className={`p-4 rounded-2xl border-2 transition-all ${acc.default ? 'border-[#0eb59a] bg-teal-50/40 dark:bg-[#0eb59a]/10' : 'border-gray-100 dark:border-white/10 bg-[#FAFBF9] dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${acc.default ? 'bg-teal-100 dark:bg-[#0eb59a]/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                                {acc.type === 'bank'
                                  ? <Building size={18} className={acc.default ? 'text-[#134e40] dark:text-[#0eb59a]' : 'text-gray-500 dark:text-gray-400'} />
                                  : <Zap size={18} className={acc.default ? 'text-[#134e40] dark:text-[#0eb59a]' : 'text-gray-500 dark:text-gray-400'} />
                                }
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-black text-[#1C3627] dark:text-white text-sm">{acc.label}</p>
                                  {acc.verified && (
                                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                                      <Check size={8} strokeWidth={3} /> Verified
                                    </span>
                                  )}
                                  {acc.default && (
                                    <span className="text-[9px] font-black text-[#134e40] dark:text-[#0eb59a] bg-teal-100 dark:bg-[#0eb59a]/20 px-1.5 py-0.5 rounded-md border border-teal-200 dark:border-[#0eb59a]/30">Default</span>
                                  )}
                                </div>
                                {acc.type === 'bank'
                                  ? <p className="text-xs text-gray-400 font-semibold mt-0.5">{acc.accountHolder} · {acc.accountNumber} · IFSC: {acc.ifsc}</p>
                                  : <p className="text-xs text-gray-400 font-semibold mt-0.5">{acc.upiId}</p>
                                }
                              </div>
                            </div>
                            {!acc.default && (
                              <div className="flex items-center gap-2 shrink-0">
                                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setDefaultPayout(acc.id)} className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] px-3 py-1.5 bg-white dark:bg-white/5 rounded-xl border border-teal-100 dark:border-white/10">Set Default</motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => removePayout(acc.id)} className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={13} /></motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tax Info */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-5 text-left">
                      <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center"><Shield size={14} className="text-emerald-600" /></div>
                      Tax Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'PAN Number', placeholder: 'ABCDE1234F', value: 'ABCDE1234F' },
                        { label: 'GST Number (optional)', placeholder: '27ABCDE1234F1Z5', value: '' },
                        { label: 'TDS Category', placeholder: 'Individual / Sole Proprietor', value: 'Individual' },
                        { label: 'Declared Income Slab', placeholder: 'Select slab', value: '₹10L - ₹50L' },
                      ].map((field, idx) => (
                        <div key={idx}>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-left">{field.label}</label>
                          <input
                            type="text" defaultValue={field.value} placeholder={field.placeholder}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-start gap-2 p-3 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-xl border border-teal-100 dark:border-[#0eb59a]/20">
                      <AlertCircle size={13} className="text-[#0eb59a] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#0eb59a] font-semibold leading-relaxed text-left">TDS of <span className="font-black">10%</span> is deducted from each milestone payment per Section 194J. Form 16A issued quarterly.</p>
                    </div>
                  </div>

                  {/* Payout Policy */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-teal-100 dark:border-white/10 p-5 relative overflow-hidden">
                    <div className="absolute inset-0 dark:hidden bg-gradient-to-r from-teal-50 to-emerald-50 pointer-events-none" />
                    <div className="relative z-10">
                    <h4 className="font-black text-[#134e40] dark:text-[#0eb59a] text-sm mb-3 flex items-center gap-2 text-left">
                      <Shield size={13} className="text-[#0eb59a]" /> Payout Policy
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Processing Time', value: '1-2 business days' },
                        { label: 'Minimum Withdrawal', value: '₹10,000' },
                        { label: 'Platform Fee', value: '10% per milestone' },
                        { label: 'TDS Deduction', value: '10% (Form 16A)' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/60 dark:bg-white/5 rounded-xl p-3 border border-teal-100/60 dark:border-white/10 text-left">
                          <p className="text-[10px] text-teal-600 dark:text-[#0eb59a] font-bold uppercase tracking-wide">{item.label}</p>
                          <p className="font-black text-[#134e40] dark:text-white text-xs mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-3.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={15} /> Save Payout Settings
                  </motion.button>
                </motion.div>
              )}

              {/* ══ PRIVACY ══ */}
              {activeTab === 'Privacy' && (
                <motion.div key="privacy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">

                  {/* Profile Visibility */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-2 text-left">
                      <div className="w-7 h-7 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-xl flex items-center justify-center"><Shield size={14} className="text-[#0eb59a]" /></div>
                      Profile Visibility
                    </h3>
                    <p className="text-xs text-gray-400 mb-5 font-semibold text-left">Control what companies can see on your public profile</p>
                    <div className="space-y-2">
                      {privacyItems.map((item, idx) => (
                        <motion.div
                          key={item.key}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${privacy[item.key] ? 'bg-teal-50/50 dark:bg-[#0eb59a]/10 border-teal-100 dark:border-[#0eb59a]/20' : 'bg-[#FAFBF9] dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'}`}
                        >
                          <div className="flex items-center gap-3 flex-1 pr-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${privacy[item.key] ? 'bg-teal-100 dark:bg-[#0eb59a]/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                              <item.icon size={14} className={privacy[item.key] ? 'text-[#0eb59a]' : 'text-gray-400'} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-[#1C3627] dark:text-white text-sm">{item.label}</p>
                              <p className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <Toggle value={privacy[item.key]} onToggle={() => togglePrivacy(item.key)} />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Your Data */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-5 text-left">
                      <div className="w-7 h-7 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-xl flex items-center justify-center"><Download size={14} className="text-[#0eb59a]" /></div>
                      Your Data
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Download My Data', desc: 'Export all your profile, engagement, and earnings data as a CSV', icon: Download, action: 'Download', danger: false },
                        { label: 'View Data Usage Policy', desc: 'See how ExigentCX uses your personal information', icon: Eye, action: 'View', danger: false },
                        { label: 'Request Data Deletion', desc: 'Submit a request to permanently delete all your data', icon: Trash2, action: 'Request', danger: true },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 3, backgroundColor: '#FAFBF9' }}
                          className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <item.icon size={15} className={item.danger ? 'text-red-400' : 'text-gray-400'} />
                            <div>
                              <p className={`font-bold text-sm text-left ${item.danger ? 'text-red-500' : 'text-[#1C3627]'}`}>{item.label}</p>
                              <p className="text-xs text-gray-400 font-medium mt-0.5 text-left">{item.desc}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-black px-3 py-1.5 rounded-xl border shrink-0 ${item.danger ? 'text-red-500 bg-red-50 border-red-100' : 'text-[#0eb59a] bg-teal-50 border-teal-100'}`}>
                            {item.action}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }} whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-3.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={15} /> Save Privacy Settings
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>



      {/* ══ ADD BANK MODAL ══ */}
      <AnimatePresence>
        {showAddBankModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-[#1e2028] rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#1C3627] dark:text-white">Add Bank Account</h3>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowAddBankModal(false)} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100"><X size={16} /></motion.button>
              </div>
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Account Holder Name', key: 'accountHolder', placeholder: 'As on bank records' },
                  { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. HDFC Bank, SBI, Axis Bank' },
                  { label: 'Account Number', key: 'accountNumber', placeholder: 'Enter account number' },
                  { label: 'Confirm Account Number', key: 'confirmAccountNumber', placeholder: 'Re-enter account number' },
                  { label: 'IFSC Code', key: 'ifsc', placeholder: 'e.g. HDFC0001234' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-left">{field.label}</label>
                    <input
                      type="text" value={newBank[field.key]}
                      onChange={e => setNewBank(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-5">
                <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed font-semibold text-left">Your bank account will be verified via a ₹1 penny deposit within 24 hours before it can be used for withdrawals.</p>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowAddBankModal(false)} className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-2xl">Cancel</motion.button>
                <motion.button
                  whileHover={{ scale: (newBank.accountHolder && newBank.accountNumber && newBank.ifsc) ? 1.02 : 1 }}
                  disabled={!newBank.accountHolder || !newBank.accountNumber || !newBank.ifsc}
                  onClick={handleAddBank}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${newBank.accountHolder && newBank.accountNumber && newBank.ifsc ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Add & Verify
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ DELETE ACCOUNT MODAL ══ */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-[#1e2028] rounded-3xl shadow-2xl p-8 max-w-sm w-full"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-[#1C3627] text-center mb-2">Delete Account</h3>
              <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                This action is <span className="font-black text-red-500">permanent and irreversible</span>. All data will be deleted.
              </p>
              <div className="mb-5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-left">Type <span className="text-red-500">DELETE</span> to confirm</label>
                <input
                  type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE here..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 focus:border-red-300 rounded-2xl text-sm font-semibold dark:text-gray-200 focus:outline-none transition-all"
                />
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-2xl">Cancel</motion.button>
                <motion.button
                  whileHover={{ scale: deleteConfirm === 'DELETE' ? 1.02 : 1 }}
                  disabled={deleteConfirm !== 'DELETE'}
                  onClick={async () => { await supabase.auth.signOut(); navigate('/signin?role=expert'); }}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${deleteConfirm === 'DELETE' ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Delete Forever
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertSettings;