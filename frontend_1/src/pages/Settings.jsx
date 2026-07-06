import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Building, Users, Bell, CreditCard,
  Upload, Check, X, Plus, Trash2, Shield,
  Mail, Phone, Globe, MapPin, Edit3, Save,
  AlertCircle, CheckCircle, Lock, Star,
  Zap, Crown, ArrowUpRight, LogOut,
  Eye, EyeOff, RefreshCw, Copy, ExternalLink, Download,
  LayoutDashboard, ShieldCheck, ChevronLeft, ChevronRight as ChevronRightIcon,
  Bell as BellIcon, Settings as SettingsIcon, BarChart2 as BarChart2Icon,
  FileText, MessageSquare, Calendar
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Company Profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(null);
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('HR');
  const [inviteSent, setInviteSent] = useState(false);

  // ── NEW MODALS & PAYMENT STATES ──
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('netbanking');
  const [paymentAdded, setPaymentAdded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const paymentTypes = [
    { id: 'netbanking', label: 'Net Banking', icon: Building, desc: 'Add your bank account for auto-debit', fields: ['Bank Name', 'Account Number', 'IFSC Code'] },
    { id: 'upi', label: 'UPI', icon: Zap, desc: 'Link your UPI ID for instant payments', fields: ['UPI ID'] },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Add card details (2% processing fee)', fields: ['Card Number', 'Expiry', 'CVV', 'Name on Card'] },
  ];

  const handleAddPayment = () => {
    setPaymentAdded(true);
    setTimeout(() => {
      setShowAddPaymentModal(false);
      setPaymentAdded(false);
      setSelectedPaymentType('netbanking');
    }, 2000);
  };

  // ── COMPANY PROFILE STATE ──
  const [profile, setProfile] = useState({
    companyName: 'Acme Corp Private Limited',
    industry: 'SaaS / Technology',
    size: '51-200 employees',
    fundingStage: 'Series B',
    website: 'https://acmecorp.com',
    linkedIn: 'https://linkedin.com/company/acmecorp',
    description: 'Acme Corp is a B2B SaaS company building the next generation of enterprise workflow automation tools.',
    headquarters: 'Mumbai, Maharashtra',
    founded: '2020',
    companyAge: '1-3 Years',
    gst: '27AAACA0000A1ZS',
    adminEmail: 'admin@acmecorp.com',
    adminPhone: '+91 98765 43210',
    logoUrl: null,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';

    const fetchProfile = async () => {
      if (isDemo) {
        setProfile(prev => ({
          ...prev,
          companyName: 'Acme Corp Private Limited',
          adminEmail: 'demo@cxo.com',
        }));
        setTeamMembers([
          { id: 1, name: 'John Doe', email: 'john@acmecorp.com', role: 'Company Admin', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@acmecorp.com', role: 'HR Manager', status: 'Active' }
        ]);
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
          setProfile(prev => ({
            ...prev,
            companyName: data.company_name || prev.companyName,
            industry: data.industry || prev.industry,
            size: data.org_size || prev.size,
            website: data.website || prev.website,
            linkedIn: data.linkedin || prev.linkedIn,
            description: data.about || prev.description,
            founded: data.founded_year || prev.founded,
            companyAge: data.company_age || prev.companyAge,
            gst: data.gstin || prev.gst,
            adminEmail: data.admin_email || prev.adminEmail,
            adminPhone: data.contact_number || prev.adminPhone,
            logoUrl: data.logo_url || prev.logoUrl,
          }));
        } else {
          console.warn("Failed to fetch company profile from backend. Using dummy profile data.");
        }
      } catch (error) {
        console.warn("Could not connect to backend to fetch company profile. Using dummy profile data.");
      }

      try {
        // Fetch team members
        const teamResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company/team`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(teamData);
        } else {
          console.warn("Failed to fetch team members from backend. Using dummy team data.");
          setTeamMembers([
            { id: 1, name: 'John Doe', email: 'john@acmecorp.com', role: 'Founder', avatar: 'https://i.pravatar.cc/150?u=john', status: 'Active', lastActive: '2 mins ago', isOwner: true },
            { id: 2, name: 'Jane Smith', email: 'jane@acmecorp.com', role: 'HR', avatar: 'https://i.pravatar.cc/150?u=jane', status: 'Active', lastActive: '1 day ago', isOwner: false }
          ]);
        }
      } catch (error) {
        console.warn("Could not connect to backend to fetch team members. Using dummy team data.");
        setTeamMembers([
          { id: 1, name: 'John Doe', email: 'john@acmecorp.com', role: 'Founder', avatar: 'https://i.pravatar.cc/150?u=john', status: 'Active', lastActive: '2 mins ago', isOwner: true },
          { id: 2, name: 'Jane Smith', email: 'jane@acmecorp.com', role: 'HR', avatar: 'https://i.pravatar.cc/150?u=jane', status: 'Active', lastActive: '1 day ago', isOwner: false }
        ]);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  // ── NOTIFICATION STATE ──
  const [notifications, setNotifications] = useState({
    newMatch: true,
    milestoneUpdate: true,
    contractReady: true,
    paymentReleased: true,
    expertMessage: true,
    weeklyDigest: false,
    platformUpdates: false,
    marketingEmails: false,
    smsAlerts: true,
    whatsappAlerts: true,
  });

  // ── TEAM MEMBERS ──
  const [teamMembers, setTeamMembers] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2Icon, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];

  const appNotifications = [
    { id: 1, title: 'New Expert Match', desc: 'Sarah Jenkins matches your CMO requirement at 96%', time: '5 min ago', unread: true, color: 'bg-teal-500' },
    { id: 2, title: 'Contract Ready', desc: 'Engagement Agreement — VP Engineering ready to sign', time: '1 hour ago', unread: true, color: 'bg-amber-500' },
    { id: 3, title: 'Milestone Approved', desc: 'Financial Model Development milestone released', time: '2 days ago', unread: false, color: 'bg-emerald-500' },
  ];
  const unreadCount = appNotifications.filter(n => n.unread).length;

  const handleExportBilling = () => {
    const content = `EXIGENTCX — BILLING HISTORY\n${'='.repeat(40)}\n\nGrowth Plan — May 2025 | May 1, 2025 | ₹4,999 | Paid\nGrowth Plan — April 2025 | Apr 1, 2025 | ₹4,999 | Paid\nGrowth Plan — March 2025 | Mar 1, 2025 | ₹4,999 | Paid\nGrowth Plan — February 2025 | Feb 1, 2025 | ₹4,999 | Paid\n\n${'='.repeat(40)}\nGenerated by ExigentCX on ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ExigentCX_Billing_History.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (bill) => {
    const content = `INVOICE\n${'='.repeat(40)}\n${bill.desc}\nDate: ${bill.date}\nAmount: ${bill.amount}\nStatus: ${bill.status}\n\nGenerated by ExigentCX`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bill.desc.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadLogo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpg,image/jpeg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setProfile(prev => ({ ...prev, logoUrl: ev.target.result }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };


  const tabs = [
    { id: 'Company Profile', icon: Building },
    { id: 'Team Members', icon: Users },
    { id: 'Notifications', icon: Bell },
    { id: 'Billing & Plan', icon: CreditCard },
  ];

  const industryOptions = [
    'SaaS / Technology', 'Fintech', 'Healthcare', 'E-commerce',
    'Manufacturing', 'BFSI', 'Consumer Goods', 'EdTech',
    'Real Estate', 'Logistics', 'Media & Entertainment', 'Energy',
  ];

  const sizeOptions = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '501-1000 employees', '1000+ employees',
  ];

  const fundingOptions = [
    'Bootstrapped', 'Pre-Seed', 'Seed', 'Series A',
    'Series B', 'Series C+', 'Public', 'Private Equity',
  ];

  const roleOptions = ['Founder', 'HR', 'Finance', 'Strategy', 'Operations'];

  const companyAgeOptions = [
    'Just Started (0-1 year)',
    '1-3 Years',
    '3-7 Years',
    '7+ Years'
  ];

  const roleColors = {
    Founder: 'text-purple-700 bg-purple-50 border-purple-200',
    HR: 'text-blue-700 bg-blue-50 border-blue-200',
    Finance: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Strategy: 'text-amber-700 bg-amber-50 border-amber-200',
    Operations: 'text-rose-700 bg-rose-50 border-rose-200',
  };

  const notificationGroups = [
    {
      title: 'Engagement Alerts',
      desc: 'Stay updated on your active engagements',
      items: [
        { key: 'newMatch', label: 'New Expert Match', desc: 'When a new expert matches your requirement' },
        { key: 'milestoneUpdate', label: 'Milestone Updates', desc: 'When a milestone is submitted or approved' },
        { key: 'contractReady', label: 'Contract Ready', desc: 'When a contract is ready for signature' },
        { key: 'paymentReleased', label: 'Payment Released', desc: 'When an escrow payment is released' },
        { key: 'expertMessage', label: 'Expert Messages', desc: 'When an expert sends you a message' },
      ],
    },
    {
      title: 'Platform Updates',
      desc: 'News and updates from ExigentCX',
      items: [
        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your engagement activity' },
        { key: 'platformUpdates', label: 'Platform Updates', desc: 'New features and improvements' },
        { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Tips, guides, and promotional content' },
      ],
    },
    {
      title: 'Mobile Alerts',
      desc: 'SMS and WhatsApp notifications',
      items: [
        { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical updates via SMS to your registered number' },
        { key: 'whatsappAlerts', label: 'WhatsApp Alerts', desc: 'Updates via WhatsApp (recommended)' },
      ],
    },
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹0',
      period: '/month',
      desc: 'For companies just getting started',
      features: [
        '2 active requirements',
        'Basic expert matching',
        'Standard contract templates',
        'Email support',
        '1 team member',
      ],
      current: false,
      color: 'border-gray-200',
      badge: null,
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '₹4,999',
      period: '/month',
      desc: 'For scaling teams hiring senior talent',
      features: [
        '10 active requirements',
        'AI-powered matching',
        'Priority expert access',
        'Custom contract templates',
        'Dedicated PMO support',
        '5 team members',
        'Analytics dashboard',
      ],
      current: true,
      color: 'border-[#0eb59a]',
      badge: 'Current Plan',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organisations with complex needs',
      features: [
        'Unlimited requirements',
        'Dedicated account manager',
        'White-glove PMO service',
        'Custom legal templates',
        'Unlimited team members',
        'Advanced analytics',
        'API access',
        'SLA guarantees',
      ],
      current: false,
      color: 'border-gray-200',
      badge: null,
    },
  ];

  // ── HELPERS ──
  const handleSaveProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in to save.");
        return;
      }
      
      const updates = {
        company_name: profile.companyName,
        industry: profile.industry,
        org_size: profile.size,
        website: profile.website,
        linkedin: profile.linkedIn,
        about: profile.description,
        company_age: profile.companyAge,
        founded_year: profile.founded,
        gstin: profile.gst,
        contact_number: profile.adminPhone,
      };

      const { error } = await supabase
        .from('company_applications')
        .update(updates)
        .eq('admin_email', profile.adminEmail);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Make sure you added the RLS policy.");
      } else {
        setSaveSuccess(true);
        setIsEditingProfile(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotifications = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInvite = () => {
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('HR');
      setTeamMembers(prev => [...prev, {
        id: prev.length + 1,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        avatar: `https://i.pravatar.cc/150?u=${inviteEmail}`,
        status: 'Pending',
        lastActive: '—',
        isOwner: false,
      }]);
    }, 1500);
  };

  return (
  <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117]">

    {/* ── GLOBAL SIDEBAR ── */}
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isSidebarOpen ? 260 : 68 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 dark:bg-[#1b1d24] dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
        )}
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
              item.active || window.location.pathname === item.path
                ? 'bg-[#134e40] text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]'
            }`}
          >
            {(item.active || window.location.pathname === item.path) && (
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
        ))}

      </nav>

      {/* Separated Settings option pinned to the bottom */}
      <div className="p-3 border-t border-gray-50 dark:border-white/10 space-y-1">
        <div className={`flex items-center gap-3 px-3 py-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && (
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Theme</span>
          )}
          <ThemeToggle />
        </div>

        <motion.button
          whileHover={{ x: 2, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
            window.location.pathname === '/settings'
              ? 'bg-[#134e40] text-white shadow-md'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]'
          }`}
        >
          {window.location.pathname === '/settings' && (
            <motion.div
              layoutId="activeNav"
              className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
            />
          )}
          <SettingsIcon size={17} className="shrink-0" />
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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-rose-500/10 hover:text-red-655 transition-all duration-150 relative font-bold text-left"
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

      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 dark:bg-[#1b1d24] dark:border-white/10 shadow-sm px-6 py-3 flex items-center gap-4">
        <div className="flex-1" />


        {/* Save success toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
            >
              <Check size={13} strokeWidth={3} /> Changes saved!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          {/* Bell */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-gray-100 dark:hover:bg-white/10 transition-all relative border border-gray-150 dark:border-white/10"
            >
              <BellIcon size={17} />
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
                    className="absolute right-0 top-11 w-80 bg-white dark:bg-[#1e2028] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-white/10">
                      <h4 className="font-black text-[#1C3627] dark:text-white text-sm">Notifications</h4>
                      <span className="text-[10px] font-bold text-[#0eb59a] cursor-pointer">Mark all read</span>
                    </div>
                    {appNotifications.map((notif, idx) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${notif.unread ? 'bg-teal-50/20 dark:bg-[#0eb59a]/10' : ''}`}
                      >
                        <div className={`w-8 h-8 ${notif.color} rounded-xl flex items-center justify-center shrink-0`}>
                          <BellIcon size={13} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-[#1C3627] dark:text-white mb-0.5 text-left">{notif.title}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 text-left">{notif.desc}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-555 mt-1 text-left">{notif.time}</p>
                        </div>
                        {notif.unread && <div className="w-2 h-2 bg-[#0eb59a] rounded-full shrink-0 mt-1" />}
                      </motion.div>
                    ))}
                    <div className="px-4 py-3 border-t border-gray-50 dark:border-white/10 text-center">
                      <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] dark:hover:text-[#0eb59a] transition-colors bg-transparent border-0 cursor-pointer">View all notifications →</button>
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
            {profile?.logoUrl ? (
              <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              profile?.companyName ? profile.companyName.substring(0, 2).toUpperCase() : 'AC'
            )}
          </motion.div>
        </div>
      </header>

      {/* ── PAGE BODY ── */}
      <div className="flex-1 px-6 py-5 pb-16 overflow-x-hidden">
        <div className="flex gap-5">

          {/* ── SETTINGS LEFT NAV ── */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-52 shrink-0 static self-start hidden md:block"
          >
            <div className="bg-white dark:bg-[#1b1d24] border dark:border-white/10 rounded-2xl p-2 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-2">Settings</p>
              <div className="space-y-0.5">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-[#134e40] text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]'
                    }`}
                  >
                    <tab.icon size={15} className="shrink-0" />
                    {tab.id}
                  </motion.button>
                ))}
              </div>

            </div>
          </motion.aside>

          {/* ── SETTINGS CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile Tab Select */}
            <div className="md:hidden mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#1b1d24] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-[#1C3627] dark:text-white"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id} className="dark:bg-[#1b1d24]">{tab.id}</option>
                ))}
              </select>
            </div>

            <AnimatePresence mode="wait">

              {/* ══ COMPANY PROFILE ══ */}
              {activeTab === 'Company Profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >

                  {/* Company Identity */}
                  <div className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 text-left">
                        <Building size={14} className="text-[#0eb59a]" /> Company Identity
                      </h3>
                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)} 
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 dark:hover:bg-white/5 transition-colors"
                        title={isEditingProfile ? "Cancel editing" : "Edit Profile"}
                      >
                        {isEditingProfile ? <X size={16} /> : <Edit3 size={16} />}
                      </button>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-5 p-4 bg-[#FAFBF9] dark:bg-[#252830] rounded-xl border border-gray-100 dark:border-white/5">
                      <div className={`relative group ${isEditingProfile ? 'cursor-pointer' : ''}`} onClick={isEditingProfile ? handleUploadLogo : undefined}>
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shadow-md overflow-hidden">
                          {profile.logoUrl ? (
                            <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl font-black text-white">
                              {profile.companyName?.substring(0, 2).toUpperCase() || 'AC'}
                            </span>
                          )}
                        </div>
                        {isEditingProfile && (
                          <motion.div
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Upload size={16} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-[#1C3627] dark:text-white text-sm text-left">Company Logo</p>
                        <p className="text-xs text-gray-400 dark:text-gray-550 mb-2 text-left">PNG or JPG, minimum 200x200px</p>
                        <motion.button
                          whileHover={isEditingProfile ? { scale: 1.04, backgroundColor: '#F0FDF4', borderColor: '#0eb59a' } : {}}
                          whileTap={isEditingProfile ? { scale: 0.96 } : {}}
                          onClick={isEditingProfile ? handleUploadLogo : undefined}
                          disabled={!isEditingProfile}
                          className={`flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-all ${!isEditingProfile ? 'opacity-50 cursor-not-allowed dark:bg-white/5 dark:border-white/5' : 'hover:text-[#0eb59a]'}`}
                        >
                          <Upload size={12} /> Upload Logo
                        </motion.button>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { label: 'Company Name', key: 'companyName', type: 'text', icon: Building },
                        { label: 'Website', key: 'website', type: 'url', icon: Globe },
                        { label: 'Founded Year', key: 'founded', type: 'text', icon: null },
                        { label: 'Headquarters', key: 'headquarters', type: 'text', icon: MapPin },
                        { label: 'GST Number', key: 'gst', type: 'text', icon: null },
                        { label: 'LinkedIn Page', key: 'linkedIn', type: 'url', icon: ExternalLink },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">
                            {field.label}
                          </label>
                          <div className="relative">
                            {field.icon && (
                              <field.icon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            )}
                            <input
                              type={field.type}
                              value={profile[field.key]}
                              onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                              disabled={!isEditingProfile}
                              className={`w-full py-2.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-250 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all text-left ${field.icon ? 'pl-9 pr-4' : 'px-4'} ${!isEditingProfile ? 'bg-gray-150 dark:bg-white/5 cursor-not-allowed text-gray-500 dark:text-gray-500' : ''}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">
                        Company Description
                      </label>
                      <textarea
                        value={profile.description}
                        onChange={e => setProfile(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all resize-none text-left ${!isEditingProfile ? 'bg-gray-100 dark:bg-white/5 cursor-not-allowed text-gray-500 dark:text-gray-500' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-4 text-left">
                      <Zap size={14} className="text-[#0eb59a]" /> Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Industry', key: 'industry', options: industryOptions },
                        { label: 'Company Size', key: 'size', options: sizeOptions },
                        { label: 'Funding Stage', key: 'fundingStage', options: fundingOptions },
                        { label: 'Company Age', key: 'companyAge', options: companyAgeOptions },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">
                            {field.label}
                          </label>
                          <select
                            value={profile[field.key]}
                            onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-2.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all text-left ${!isEditingProfile ? 'bg-gray-100 dark:bg-[#1e2028] cursor-not-allowed text-gray-500 dark:text-gray-500 appearance-none' : ''}`}
                          >
                            {field.options.map(opt => (
                              <option key={opt} value={opt} className="dark:bg-[#1b1d24]">{opt}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 mb-4 text-left">
                      <Mail size={14} className="text-[#0eb59a]" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">Admin Email</label>
                        <div className="relative">
                          <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <input
                            type="email"
                            value={profile.adminEmail}
                            onChange={e => setProfile(prev => ({ ...prev, adminEmail: e.target.value }))}
                            disabled={!isEditingProfile}
                            className={`w-full pl-9 pr-4 py-2.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all ${!isEditingProfile ? 'bg-gray-100 dark:bg-white/5 cursor-not-allowed text-gray-500 dark:text-gray-500' : ''}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">Phone Number</label>
                        <div className="relative">
                          <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <input
                            type="tel"
                            value={profile.adminPhone}
                            onChange={e => setProfile(prev => ({ ...prev, adminPhone: e.target.value }))}
                            disabled={!isEditingProfile}
                            className={`w-full pl-9 pr-4 py-2.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all ${!isEditingProfile ? 'bg-gray-100 dark:bg-white/5 cursor-not-allowed text-gray-500 dark:text-gray-500' : ''}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditingProfile && (
                    <div className="flex justify-end">
                      <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(20,78,64,0.3)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleSaveProfile}
                      style={{
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '14px',
                        borderRadius: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(20,78,64,0.2)',
                      }}
                    >
                        <Save size={15} /> Save Company Profile
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ══ TEAM MEMBERS ══ */}
              {activeTab === 'Team Members' && (
                <motion.div
                  key="team"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm text-left">Team Members</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-left">{teamMembers.length} members · 5 max on Growth plan</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 8px 20px rgba(20,78,64,0.25)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setShowInviteModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 text-white text-xs font-black rounded-xl shadow-md cursor-pointer border-0"
                      style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
                    >
                      <Plus size={13} /> Invite Member
                    </motion.button>
                  </div>

                  {/* Role guide */}
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                    <Shield size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="font-black text-blue-800 dark:text-blue-400 text-xs mb-2 text-left">Role Permissions</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { role: 'Founder', desc: 'Full access — billing, contracts, all settings' },
                          { role: 'HR', desc: 'Can manage experts, requirements, messages' },
                          { role: 'Finance', desc: 'Can view and manage payments, invoices' },
                        ].map(item => (
                          <div key={item.role} className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${roleColors[item.role]}`}>
                              {item.role}
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-500 font-semibold text-left">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Team list */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                    {teamMembers.map((member, idx) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        whileHover={{ backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                        className={`flex items-center gap-4 px-5 py-4 group cursor-default dark:hover:bg-white/5 ${idx < teamMembers.length - 1 ? 'border-b border-gray-50 dark:border-white/5' : ''}`}
                      >
                        <div className="relative shrink-0">
                          <img src={member.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e2028] ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-[#1C3627] dark:text-white text-sm text-left">{member.name}</p>
                            {member.isOwner && (
                              <span className="flex items-center gap-0.5 text-[9px] font-black text-amber-700 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
                                <Crown size={8} /> Owner
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-left">{member.email}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${roleColors[member.role] || roleColors.HR}`}>
                            {member.role}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${member.status === 'Active' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
                            {member.status}
                          </span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium w-20 text-right hidden md:block">{member.lastActive}</span>
                          {!member.isOwner && (
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: '#FEF2F2' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowRemoveMemberModal(member)}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 transition-all md:opacity-0 group-hover:opacity-100 bg-transparent border-0 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Seats */}
                  <div className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="text-left">
                      <p className="font-black text-[#1C3627] dark:text-white text-sm text-left">Seats Used</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 text-left">{teamMembers.length} of 5 seats on Growth plan</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${i < teamMembers.length ? 'bg-[#134e40]' : 'bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10'}`}
                        >
                          {i < teamMembers.length && <Check size={12} className="text-white" strokeWidth={3} />}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ NOTIFICATIONS ══ */}
              {activeTab === 'Notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {notificationGroups.map((group, gIdx) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gIdx * 0.1 }}
                      className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="mb-4 text-left">
                        <h3 className="font-black text-[#1C3627] dark:text-white text-sm text-left">{group.title}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-left">{group.desc}</p>
                      </div>

                      <div className="space-y-1">
                        {group.items.map((item, iIdx) => (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: gIdx * 0.1 + iIdx * 0.05 }}
                            whileHover={{ backgroundColor: '#FAFBF9', borderRadius: '12px', transition: { duration: 0.15 } }}
                            className="flex items-center justify-between px-3 py-3 rounded-xl cursor-default dark:hover:bg-white/5"
                          >
                            <div className="flex-1 text-left">
                              <p className="font-bold text-[#1C3627] dark:text-white text-sm text-left">{item.label}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 text-left">{item.desc}</p>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleNotification(item.key)}
                              className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ml-4 border-0 cursor-pointer ${notifications[item.key] ? 'bg-[#0eb59a]' : 'bg-gray-200 dark:bg-white/10'}`}
                            >
                              <motion.div
                                animate={{ x: notifications[item.key] ? 22 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                              />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(20,78,64,0.3)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleSaveNotifications}
                      className="cursor-pointer border-0"
                      style={{
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '14px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(20,78,64,0.2)',
                      }}
                    >
                      <Save size={15} /> Save Preferences
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ══ BILLING & PLAN ══ */}
              {activeTab === 'Billing & Plan' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Current plan banner */}
                  <div
                    className="rounded-2xl p-6 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0d1f2d, #134e40)' }}
                  >
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={14} className="text-amber-400" fill="#FBBF24" />
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Current Plan</span>
                        </div>
                        <h3 className="text-2xl font-black mb-0.5 text-left">Growth Plan</h3>
                        <p className="text-white/60 text-sm text-left">₹4,999/month · Renews Jun 1, 2025</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-3xl font-black text-right">₹4,999</p>
                        <p className="text-white/60 text-xs text-right mb-2">per month</p>
                        <motion.button
                          whileHover={{ scale: 1.06, boxShadow: '0 8px 20px rgba(14,181,154,0.4)' }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setShowUpgradePlanModal(true)}
                          className="px-4 py-2 bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-xs font-black rounded-xl transition-all"
                        >
                          Upgrade Plan
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Plans — hover-only border, same as ExpertProfile pricing fix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan, idx) => {
                      const isHovered = hoveredPlan === plan.id;
                      return (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          onMouseEnter={() => setHoveredPlan(plan.id)}
                          onMouseLeave={() => setHoveredPlan(null)}
                          whileHover={{ y: -6, transition: { duration: 0.2 } }}
                          className={`bg-white dark:bg-[#1e2028] rounded-[16px] p-5 relative overflow-hidden cursor-default transition-all duration-200 border-2 ${
                            isHovered ? 'border-[#0eb59a]' : 'border-gray-200 dark:border-white/10'
                          }`}
                          style={{
                            boxShadow: isHovered
                              ? '0 20px 50px rgba(14,181,154,0.15)'
                              : '0 4px 20px rgba(0,0,0,0.04)',
                          }}
                        >
                          {/* Top accent line — only on hover */}
                          <motion.div
                            animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                              background: 'linear-gradient(90deg, #134e40, #0eb59a)',
                              transformOrigin: 'left',
                              borderRadius: '16px 16px 0 0',
                            }}
                          />

                          {/* Current plan badge */}
                          {plan.current && (
                            <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                              <span style={{
                                fontSize: '9px', fontWeight: 900,
                                backgroundColor: '#0eb59a', color: 'white',
                                padding: '3px 8px', borderRadius: '20px',
                              }}>
                                Current Plan
                              </span>
                            </div>
                          )}

                          <h4 className="text-[#1C3627] dark:text-white" style={{ fontWeight: 900, fontSize: '16px', marginBottom: '4px', textAlign: 'left' }}>
                            {plan.name}
                          </h4>
                          <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: '11px', fontWeight: 600, marginBottom: '16px', textAlign: 'left' }}>
                            {plan.desc}
                          </p>

                          <div style={{ marginBottom: '16px' }}>
                            <span className="text-[#1C3627] dark:text-white" style={{ fontSize: '22px', fontWeight: 900 }}>{plan.price}</span>
                            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: '11px', fontWeight: 600 }}>{plan.period}</span>
                          </div>

                          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {plan.features.map((feature, fIdx) => (
                              <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className={`rounded-full flex items-center justify-center shrink-0 transition-all duration-200 border ${
                                  isHovered
                                    ? 'bg-[#0eb59a] border-[#0eb59a]'
                                    : 'bg-[#F0FDF4] dark:bg-[#0eb59a]/10 border-[#BBF7D0] dark:border-[#0eb59a]/20'
                                }`}
                                style={{
                                  width: '16px', height: '16px',
                                }}
                                >
                                  <Check size={9} color={isHovered ? 'white' : '#0eb59a'} strokeWidth={3} />
                                </div>
                                <span className="text-gray-600 dark:text-gray-300" style={{ fontSize: '12px', fontWeight: 600, textAlign: 'left' }}>
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <motion.button
                            whileHover={{ scale: plan.current ? 1 : 1.03 }}
                            whileTap={{ scale: plan.current ? 1 : 0.97 }}
                            disabled={plan.current}
                            onClick={() => !plan.current && setShowUpgradePlanModal(true)}
                            className={`w-full p-2.5 rounded-xl text-xs font-black text-center transition-all duration-200 border-[1.5px] ${
                              isHovered && !plan.current
                                ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white border-transparent shadow-md'
                                : plan.current
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#0eb59a] border-emerald-200 dark:border-emerald-500/20'
                                : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10'
                            }`}
                            style={{
                              cursor: plan.current ? 'default' : 'pointer',
                            }}
                          >
                            {plan.current ? '✓ Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 text-left">
                        <CreditCard size={14} className="text-[#0eb59a]" /> Payment Method
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05, color: '#134e40' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAddPaymentModal(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#0eb59a] hover:text-[#134e40] dark:hover:text-[#0eb59a] transition-colors"
                      >
                        <Plus size={12} /> Add Method
                      </motion.button>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:border-[#0eb59a] dark:hover:border-[#0eb59a] hover:bg-gray-100/50 dark:hover:bg-white/10 transition-all cursor-default"
                    >
                      <div className="w-11 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shrink-0">
                        <CreditCard size={14} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-black text-[#1C3627] dark:text-white text-sm text-left">Axis Bank Net Banking</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-left">Auto-debit enabled · Next billing Jun 1, 2025</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-[#0eb59a] bg-emerald-50 dark:bg-[#0eb59a]/10 px-2 py-1 rounded-lg border border-emerald-200 dark:border-[#0eb59a]/20">
                        Default
                      </span>
                    </motion.div>
                  </div>

                  {/* Billing History */}
                  <div className="bg-white dark:bg-[#1e2028] border dark:border-white/10 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-sm text-left">Billing History</h3>
                      <motion.button
                        whileHover={{ scale: 1.05, color: '#0eb59a' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleExportBilling}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-[#0eb59a] dark:hover:text-[#0eb59a] transition-colors"
                      >
                        <Download size={13} /> Export All
                      </motion.button>
                    </div>

                    <div className="space-y-1">
                      {[
                        { date: 'May 1, 2025', desc: 'Growth Plan — May 2025', amount: '₹4,999', status: 'Paid' },
                        { date: 'Apr 1, 2025', desc: 'Growth Plan — April 2025', amount: '₹4,999', status: 'Paid' },
                        { date: 'Mar 1, 2025', desc: 'Growth Plan — March 2025', amount: '₹4,999', status: 'Paid' },
                        { date: 'Feb 1, 2025', desc: 'Growth Plan — February 2025', amount: '₹4,999', status: 'Paid' },
                      ].map((bill, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="flex items-center gap-4 p-3 rounded-xl group cursor-default hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <CheckCircle size={14} className="text-emerald-500" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-[#1C3627] dark:text-white text-sm text-left">{bill.desc}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-left">{bill.date}</p>
                          </div>
                          <p className="font-black text-[#1C3627] dark:text-white text-sm">{bill.amount}</p>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownloadInvoice(bill)}
                            className="p-1.5 rounded-lg text-gray-300 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Download size={12} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-2xl p-5 border border-red-100 dark:border-red-500/20 shadow-sm">
                    <h3 className="font-black text-red-500 text-sm mb-2 flex items-center gap-2 text-left">
                      <AlertCircle size={14} /> Danger Zone
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-450 mb-4 leading-relaxed text-left">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowCancelModal(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-red-200 dark:border-red-500/25 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold rounded-xl transition-all"
                      >
                        Cancel Subscription
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(239,68,68,0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-md"
                      >
                        <Trash2 size={13} /> Delete Company Account
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>

    {/* ══ INVITE MODAL ══ */}
    <AnimatePresence>
      {showInviteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { setShowInviteModal(false); setInviteEmail(''); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!inviteSent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* Gradient header */}
                  <div style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)', padding: '24px' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Users size={18} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-base text-left">Invite Team Member</h3>
                          <p className="text-white/70 text-xs text-left">Send an email invitation</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setShowInviteModal(false); setInviteEmail(''); }}
                        className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all"
                      >
                        <X size={13} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">Email Address *</label>
                        <div className="relative">
                          <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="colleague@yourcompany.com"
                            className="w-full pl-9 pr-4 py-3 bg-[#FAFBF9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/50 transition-all text-left"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">Access Role</label>
                        <div className="grid grid-cols-3 gap-2">
                          {roleOptions.slice(0, 3).map(role => (
                            <motion.button
                              key={role}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setInviteRole(role)}
                              className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all ${inviteRole === role ? `${roleColors[role]} border-current` : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/10'}`}
                            >
                              {role}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#FAFBF9] dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/10 text-left">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed text-left">
                          <span className="font-black text-[#1C3627] dark:text-white">{inviteRole}:</span>{' '}
                          {inviteRole === 'Founder' ? 'Full access to all features including billing and team management.' :
                           inviteRole === 'HR' ? 'Can manage experts, requirements, review candidates, and send messages.' :
                           'Can view and manage payments, invoices, and escrow accounts.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowInviteModal(false); setInviteEmail(''); }}
                        className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl transition-all"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: inviteEmail.trim() ? 1.03 : 1, boxShadow: inviteEmail.trim() ? '0 8px 25px rgba(20,78,64,0.3)' : 'none' }}
                        whileTap={{ scale: inviteEmail.trim() ? 0.97 : 1 }}
                        disabled={!inviteEmail.trim()}
                        onClick={handleInvite}
                        style={{
                          flex: 1, padding: '12px',
                          background: inviteEmail.trim() ? 'linear-gradient(135deg, #134e40, #0eb59a)' : '#F3F4F6',
                          color: inviteEmail.trim() ? 'white' : '#9CA3AF',
                          border: 'none', borderRadius: '16px',
                          fontSize: '14px', fontWeight: 800,
                          cursor: inviteEmail.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Send Invitation
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
                      width: '80px', height: '80px',
                      background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justify: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 12px 40px rgba(14,181,154,0.3)',
                    }}
                  >
                    <Check size={36} color="white" strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-xl font-black text-[#1C3627] dark:text-white mb-2">Invitation Sent!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Invitation sent to <span className="font-bold text-[#1C3627] dark:text-white">{inviteEmail}</span> with <span className="font-bold text-[#1C3627] dark:text-white">{inviteRole}</span> access.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ══ REMOVE MEMBER MODAL ══ */}
    <AnimatePresence>
      {showRemoveMemberModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowRemoveMemberModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-[#1b1d24] border dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #ef4444)', padding: '24px', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"
              >
                <Trash2 size={24} className="text-white" />
              </motion.div>
              <h3 className="font-black text-white text-lg">Remove Member</h3>
              <p className="text-white/70 text-xs mt-1">This action cannot be undone</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5 leading-relaxed">
                Remove <span className="font-bold text-[#1C3627] dark:text-white">{showRemoveMemberModal?.name}</span> from your workspace? They will lose all access immediately.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRemoveMemberModal(null)}
                  className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(239,68,68,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setTeamMembers(prev => prev.filter(m => m.id !== showRemoveMemberModal.id));
                    setShowRemoveMemberModal(null);
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-black rounded-2xl shadow-md transition-all"
                >
                  Remove Member
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ══ UPGRADE PLAN MODAL ══ */}
    <AnimatePresence>
      {showUpgradePlanModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowUpgradePlanModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-[#1b1d24] border dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)', padding: '24px', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"
              >
                <Crown size={24} className="text-white" />
              </motion.div>
              <h3 className="font-black text-white text-lg">Upgrade to Enterprise</h3>
              <p className="text-white/70 text-xs mt-1">Unlimited everything</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-450 text-center mb-4 leading-relaxed">
                Get unlimited requirements, dedicated account manager, white-glove PMO, and unlimited team members.
              </p>
              <div className="bg-teal-50 dark:bg-teal-950/20 rounded-xl p-3 border border-teal-100 dark:border-teal-900/30 mb-5">
                <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold text-center leading-relaxed">
                  Our team will reach out within 24 hours to discuss custom pricing.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUpgradePlanModal(false)}
                  className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl transition-all"
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(20,78,64,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowUpgradePlanModal(false)}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                    color: 'white', border: 'none',
                    borderRadius: '16px', fontSize: '14px', fontWeight: 800,
                    cursor: 'pointer', boxShadow: '0 4px 15px rgba(20,78,64,0.2)',
                  }}
                >
                  Contact Sales
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {showAddPaymentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddPaymentModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-[#1b1d24] border dark:border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!paymentAdded ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* Header */}
                  <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)', padding: '24px' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <CreditCard size={18} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-base text-left">Add Payment Method</h3>
                          <p className="text-blue-200 text-xs text-left">Secure · Encrypted · RBI compliant</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAddPaymentModal(false)}
                        className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all"
                      >
                        <X size={13} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Payment type selector */}
                    <div className="mb-5">
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-3 text-left">
                        Payment Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {paymentTypes.map(type => (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedPaymentType(type.id)}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                              selectedPaymentType === type.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/10'
                            }`}
                          >
                            <type.icon className={`mx-auto mb-1.5 ${selectedPaymentType === type.id ? 'text-blue-600' : 'text-gray-400'}`} size={20} />
                            <p className={`text-[11px] font-black ${selectedPaymentType === type.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                              {type.label}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 text-left">
                        {paymentTypes.find(t => t.id === selectedPaymentType)?.desc}
                      </p>
                    </div>

                    {/* Dynamic fields based on payment type */}
                    <div className="space-y-3 mb-5">
                      {paymentTypes.find(t => t.id === selectedPaymentType)?.fields.map((field, idx) => (
                        <div key={idx}>
                          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1.5 text-left">
                            {field}
                          </label>
                          <input
                            type={field.toLowerCase().includes('number') || field === 'CVV' ? 'number' : 'text'}
                            placeholder={
                              field === 'UPI ID' ? 'yourname@upi' :
                              field === 'IFSC Code' ? 'AXIS0001234' :
                              field === 'Card Number' ? '•••• •••• •••• ••••' :
                              field === 'Expiry' ? 'MM/YY' :
                              field === 'CVV' ? '•••' :
                              `Enter ${field}`
                            }
                            className="w-full px-4 py-2.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-left"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Security notice */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-5">
                      <Shield size={13} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-blue-750 dark:text-blue-400 leading-relaxed text-left">
                        Your payment details are encrypted and stored securely. ExigentCX never stores raw card data.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddPaymentModal(false)}
                        className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl transition-all"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(29,78,216,0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddPayment}
                        style={{
                          flex: 1, padding: '12px',
                          background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)',
                          color: 'white', border: 'none',
                          borderRadius: '16px', fontSize: '14px', fontWeight: 800,
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                      >
                        <Plus size={14} /> Add Payment Method
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
                      width: '80px', height: '80px',
                      background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justify: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 12px 40px rgba(29,78,216,0.3)',
                    }}
                  >
                    <Check size={36} color="white" strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-xl font-black text-[#1C3627] dark:text-white mb-2">Payment Method Added!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Your {paymentTypes.find(t => t.id === selectedPaymentType)?.label} has been added successfully.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ══ CANCEL SUBSCRIPTION MODAL ══ */}
    <AnimatePresence>
      {showCancelModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCancelModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-[#1b1d24] border dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div style={{ background: 'linear-gradient(135deg, #78350f, #f59e0b)', padding: '24px', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"
              >
                <AlertCircle size={24} className="text-white" />
              </motion.div>
              <h3 className="font-black text-white text-lg">Cancel Subscription?</h3>
              <p className="text-white/70 text-xs mt-1">Your plan ends on Jun 1, 2025</p>
            </div>
            <div className="p-6">
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 mb-5">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold leading-relaxed text-left">
                  After cancellation you will lose access to: AI-powered matching, Priority expert access, Dedicated PMO support, and Custom contract templates.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl"
                >
                  Keep Plan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(245,158,11,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-black rounded-2xl shadow-md transition-all"
                >
                  Confirm Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ══ DELETE ACCOUNT MODAL ══ */}
    <AnimatePresence>
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-[#1b1d24] border dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div style={{ background: 'linear-gradient(135deg, #450a0a, #ef4444)', padding: '24px', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"
              >
                <Trash2 size={24} className="text-white" />
              </motion.div>
              <h3 className="font-black text-white text-lg">Delete Company Account</h3>
              <p className="text-white/70 text-xs mt-1">This is permanent and cannot be undone</p>
            </div>
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-100 dark:border-red-900/30 mb-4">
                <p className="text-xs text-red-700 dark:text-red-400 font-semibold leading-relaxed text-left">
                  This will permanently delete your company account, all requirements, contracts, engagement history, and team members. This action <span className="font-black">cannot be reversed.</span>
                </p>
              </div>
              <div className="mb-5">
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 text-left">
                  Type <span className="text-red-500">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 bg-red-50 dark:bg-red-950/10 border-2 border-red-200 dark:border-red-900/30 rounded-xl text-sm font-bold text-red-700 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-left"
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: deleteConfirmText === 'DELETE' ? 1.03 : 1 }}
                  whileTap={{ scale: deleteConfirmText === 'DELETE' ? 0.97 : 1 }}
                  disabled={deleteConfirmText !== 'DELETE'}
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  style={{
                    flex: 1, padding: '12px',
                    background: deleteConfirmText === 'DELETE' ? '#ef4444' : '#F3F4F6',
                    color: deleteConfirmText === 'DELETE' ? 'white' : '#9CA3AF',
                    border: 'none', borderRadius: '16px',
                    fontSize: '14px', fontWeight: 800,
                    cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed',
                    boxShadow: deleteConfirmText === 'DELETE' ? '0 4px 15px rgba(239,68,68,0.3)' : 'none',
                  }}
                >
                  Delete Account
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </div>
  );
};

export default Settings;
