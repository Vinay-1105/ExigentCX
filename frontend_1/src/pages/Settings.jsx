import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Building, Users, Bell, CreditCard,
  Upload, Check, X, Plus, Trash2, Shield,
  Mail, Phone, Globe, MapPin, Edit3, Save,
  AlertCircle, CheckCircle, Lock, Star,
  Zap, Crown, ArrowUpRight, LogOut,
  Eye, EyeOff, RefreshCw, Copy, ExternalLink, Download
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Company Profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(null);
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('HR');
  const [inviteSent, setInviteSent] = useState(false);

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
    gst: '27AAACA0000A1ZS',
    adminEmail: 'admin@acmecorp.com',
    adminPhone: '+91 98765 43210',
  });

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
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Arjun Mehta',
      email: 'arjun@acmecorp.com',
      role: 'Founder',
      avatar: 'https://i.pravatar.cc/150?u=arjun',
      status: 'Active',
      lastActive: 'Today',
      isOwner: true,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@acmecorp.com',
      role: 'HR',
      avatar: 'https://i.pravatar.cc/150?u=priya2',
      status: 'Active',
      lastActive: '2 hours ago',
      isOwner: false,
    },
    {
      id: 3,
      name: 'Rohan Desai',
      email: 'rohan@acmecorp.com',
      role: 'Finance',
      avatar: 'https://i.pravatar.cc/150?u=rohan2',
      status: 'Active',
      lastActive: 'Yesterday',
      isOwner: false,
    },
    {
      id: 4,
      name: 'Sneha Kapoor',
      email: 'sneha@acmecorp.com',
      role: 'HR',
      avatar: 'https://i.pravatar.cc/150?u=sneha',
      status: 'Pending',
      lastActive: '—',
      isOwner: false,
    },
  ]);

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
      desc: 'News and updates from CXO Connect',
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
  const handleSave = () => {
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
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-8 pb-16">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/company-dashboard')}
                className="text-gray-400 hover:text-[#0eb59a] text-sm font-semibold transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-700">Settings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your company profile, team, and preferences
            </p>
          </div>

          {/* Save success toast */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-2xl shadow-lg text-sm font-bold"
              >
                <Check size={15} strokeWidth={3} /> Changes saved!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── LAYOUT: Sidebar + Content ── */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* ── SETTINGS SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:w-56 shrink-0"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 sticky top-6">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all mb-1 text-left ${
                    activeTab === tab.id
                      ? 'bg-teal-50 text-[#134e40]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <tab.icon
                    size={16}
                    className={activeTab === tab.id ? 'text-[#0eb59a]' : 'text-gray-400'}
                  />
                  {tab.id}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="settingsDot"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0eb59a]"
                    />
                  )}
                </motion.button>
              ))}

              <div className="h-px bg-gray-100 my-2" />

              {/* Danger zone */}
              <motion.button
                whileHover={{ x: 3 }}
                onClick={async () => { navigate('/signin?role=company'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all text-left"
              >
                <LogOut size={16} />
                Sign Out
              </motion.button>
            </div>
          </motion.aside>

          {/* ── MAIN SETTINGS CONTENT ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ══ COMPANY PROFILE TAB ══ */}
              {activeTab === 'Company Profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Logo + Company Name */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Building size={16} className="text-[#0eb59a]" /> Company Identity
                    </h3>

                    {/* Logo upload */}
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-black text-white">AC</span>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <Upload size={18} className="text-white" />
                        </motion.div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Company Logo</p>
                        <p className="text-xs text-gray-400 mb-2">PNG or JPG, minimum 200x200px</p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all"
                        >
                          <Upload size={13} /> Upload Logo
                        </motion.button>
                      </div>
                    </div>

                    {/* Basic fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Company Name', key: 'companyName', type: 'text', placeholder: 'Acme Corp Private Limited' },
                        { label: 'Website', key: 'website', type: 'url', placeholder: 'https://yourcompany.com' },
                        { label: 'Founded Year', key: 'founded', type: 'text', placeholder: '2020' },
                        { label: 'Headquarters', key: 'headquarters', type: 'text', placeholder: 'Mumbai, Maharashtra' },
                        { label: 'GST Number', key: 'gst', type: 'text', placeholder: '27AAACA0000A1ZS' },
                        { label: 'LinkedIn Page', key: 'linkedIn', type: 'url', placeholder: 'https://linkedin.com/company/...' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            value={profile[field.key]}
                            onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Company Description
                      </label>
                      <textarea
                        value={profile.description}
                        onChange={e => setProfile(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Zap size={16} className="text-[#0eb59a]" /> Company Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Industry */}
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Industry
                        </label>
                        <select
                          value={profile.industry}
                          onChange={e => setProfile(prev => ({ ...prev, industry: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        >
                          {industryOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Company Size */}
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Company Size
                        </label>
                        <select
                          value={profile.size}
                          onChange={e => setProfile(prev => ({ ...prev, size: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        >
                          {sizeOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Funding Stage */}
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Funding Stage
                        </label>
                        <select
                          value={profile.fundingStage}
                          onChange={e => setProfile(prev => ({ ...prev, fundingStage: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                        >
                          {fundingOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Mail size={16} className="text-[#0eb59a]" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Admin Email
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={profile.adminEmail}
                            onChange={e => setProfile(prev => ({ ...prev, adminEmail: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={profile.adminPhone}
                            onChange={e => setProfile(prev => ({ ...prev, adminPhone: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Company Profile
                  </motion.button>
                </motion.div>
              )}

              {/* ══ TEAM MEMBERS TAB ══ */}
              {activeTab === 'Team Members' && (
                <motion.div
                  key="team"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-base">Team Members</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {teamMembers.length} members · 5 max on Growth plan
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(20,78,64,0.2)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowInviteModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md"
                    >
                      <Plus size={15} /> Invite Member
                    </motion.button>
                  </div>

                  {/* Role guide */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                    <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-blue-800 text-sm">Role Permissions</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {[
                          { role: 'Founder', desc: 'Full access — billing, contracts, all settings' },
                          { role: 'HR', desc: 'Can manage experts, requirements, messages' },
                          { role: 'Finance', desc: 'Can view and manage payments, invoices' },
                        ].map(item => (
                          <div key={item.role} className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${roleColors[item.role]}`}>
                              {item.role}
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Team list */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {teamMembers.map((member, idx) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group ${
                          idx < teamMembers.length - 1 ? 'border-b border-gray-50' : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={member.avatar}
                            className="w-11 h-11 rounded-2xl object-cover shadow-sm"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'
                          }`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-gray-900 text-sm">{member.name}</p>
                            {member.isOwner && (
                              <span className="flex items-center gap-0.5 text-[9px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                                <Crown size={8} /> Owner
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-semibold">{member.email}</p>
                        </div>

                        {/* Role */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${roleColors[member.role] || roleColors.HR}`}>
                          {member.role}
                        </span>

                        {/* Status */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${
                          member.status === 'Active'
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                            : 'text-amber-600 bg-amber-50 border-amber-200'
                        }`}>
                          {member.status}
                        </span>

                        {/* Last active */}
                        <span className="text-xs text-gray-400 font-semibold shrink-0 hidden md:block w-24 text-right">
                          {member.lastActive}
                        </span>

                        {/* Remove */}
                        {!member.isOwner && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowRemoveMemberModal(member)}
                            className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Seats remaining */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="font-black text-gray-900 text-sm">Seats Used</p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        {teamMembers.length} of 5 seats used on Growth plan
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            i < teamMembers.length
                              ? 'bg-[#134e40]'
                              : 'bg-gray-100 border border-dashed border-gray-300'
                          }`}
                        >
                          {i < teamMembers.length && (
                            <Check size={13} className="text-white" strokeWidth={3} />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ NOTIFICATIONS TAB ══ */}
              {activeTab === 'Notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {notificationGroups.map((group, gIdx) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gIdx * 0.1 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                    >
                      <div className="mb-5">
                        <h3 className="font-black text-gray-900 text-base">{group.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{group.desc}</p>
                      </div>

                      <div className="space-y-4">
                        {group.items.map((item, iIdx) => (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: gIdx * 0.1 + iIdx * 0.05 }}
                            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                              <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                            </div>

                            {/* Toggle */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleNotification(item.key)}
                              className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ml-4 ${
                                notifications[item.key] ? 'bg-[#0eb59a]' : 'bg-gray-200'
                              }`}
                            >
                              <motion.div
                                animate={{ x: notifications[item.key] ? 24 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                              />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Save */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Notification Preferences
                  </motion.button>
                </motion.div>
              )}

              {/* ══ BILLING & PLAN TAB ══ */}
              {activeTab === 'Billing & Plan' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Current plan banner */}
                  <div className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Star size={16} className="text-amber-400" fill="#FBBF24" />
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Current Plan</span>
                        </div>
                        <h3 className="text-2xl font-black mb-0.5">Growth Plan</h3>
                        <p className="text-white/60 text-sm">₹4,999/month · Renews Jun 1, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black">₹4,999</p>
                        <p className="text-white/60 text-xs">per month</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setShowUpgradePlanModal(true)}
                          className="mt-2 px-4 py-2 bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-xs font-black rounded-xl transition-all"
                        >
                          Upgrade Plan
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Plans comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan, idx) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -5 }}
                        className={`bg-white rounded-3xl border-2 ${plan.color} shadow-sm p-5 relative overflow-hidden ${
                          plan.current ? 'shadow-lg shadow-teal-100' : ''
                        }`}
                      >
                        {plan.badge && (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-4 right-4 text-[9px] font-black bg-[#0eb59a] text-white px-2 py-0.5 rounded-full"
                          >
                            {plan.badge}
                          </motion.div>
                        )}

                        <h4 className="font-black text-gray-900 text-base mb-1">{plan.name}</h4>
                        <p className="text-xs text-gray-400 mb-3">{plan.desc}</p>

                        <div className="mb-4">
                          <span className="text-2xl font-black text-gray-900">{plan.price}</span>
                          <span className="text-xs text-gray-400 font-semibold">{plan.period}</span>
                        </div>

                        <div className="space-y-2 mb-5">
                          {plan.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-teal-50 rounded-full flex items-center justify-center shrink-0 border border-teal-100">
                                <Check size={9} className="text-[#0eb59a]" strokeWidth={3} />
                              </div>
                              <span className="text-xs text-gray-600 font-semibold">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: plan.current ? 1 : 1.03 }}
                          whileTap={{ scale: plan.current ? 1 : 0.97 }}
                          disabled={plan.current}
                          onClick={() => !plan.current && setShowUpgradePlanModal(true)}
                          className={`w-full py-2.5 rounded-2xl text-xs font-black transition-all ${
                            plan.current
                              ? 'bg-teal-50 text-[#134e40] border border-teal-100 cursor-default'
                              : plan.id === 'enterprise'
                              ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
                              : 'bg-[#134e40] text-white hover:bg-[#0eb59a] shadow-md'
                          }`}
                        >
                          {plan.current ? '✓ Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                        <CreditCard size={16} className="text-[#0eb59a]" /> Payment Method
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Method
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                        <CreditCard size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-900 text-sm">Axis Bank Net Banking</p>
                        <p className="text-xs text-gray-400 font-semibold">Auto-debit enabled · Next billing Jun 1, 2025</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        Default
                      </span>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-black text-gray-900 text-base">Billing History</h3>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        className="text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors flex items-center gap-1"
                      >
                        <Download size={13} /> Export All
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { date: 'May 1, 2025', desc: 'Growth Plan — May 2025', amount: '₹4,999', status: 'Paid' },
                        { date: 'Apr 1, 2025', desc: 'Growth Plan — April 2025', amount: '₹4,999', status: 'Paid' },
                        { date: 'Mar 1, 2025', desc: 'Growth Plan — March 2025', amount: '₹4,999', status: 'Paid' },
                        { date: 'Feb 1, 2025', desc: 'Growth Plan — February 2025', amount: '₹4,999', status: 'Paid' },
                      ].map((bill, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle size={16} className="text-emerald-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm">{bill.desc}</p>
                            <p className="text-xs text-gray-400 font-semibold">{bill.date}</p>
                          </div>
                          <p className="font-black text-gray-900">{bill.amount}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Download size={13} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6">
                    <h3 className="font-black text-red-600 text-base mb-3 flex items-center gap-2">
                      <AlertCircle size={16} /> Danger Zone
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold rounded-2xl transition-all"
                      >
                        Cancel Subscription
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-red-500/20"
                      >
                        <Trash2 size={14} /> Delete Company Account
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══ INVITE MEMBER MODAL ══ */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <AnimatePresence mode="wait">
                {!inviteSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-teal-100">
                      <Users size={24} className="text-[#0eb59a]" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 text-center mb-1">Invite Team Member</h3>
                    <p className="text-sm text-gray-400 text-center mb-6">
                      They will receive an email invitation to join your company workspace.
                    </p>

                    <div className="space-y-4 mb-6">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            placeholder="colleague@yourcompany.com"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Access Role
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {roleOptions.slice(0, 3).map(role => (
                            <motion.button
                              key={role}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setInviteRole(role)}
                              className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                                inviteRole === role
                                  ? `${roleColors[role]} border-current`
                                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                              }`}
                            >
                              {role}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Role description */}
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                          <span className="font-black text-gray-700">{inviteRole}:</span>{' '}
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
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: inviteEmail ? 1.02 : 1 }}
                        whileTap={{ scale: inviteEmail ? 0.98 : 1 }}
                        disabled={!inviteEmail.trim()}
                        onClick={handleInvite}
                        className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                          inviteEmail.trim()
                            ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Send Invitation
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
                    <h3 className="text-xl font-black text-gray-900 mb-2">Invitation Sent!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      An invitation has been sent to <span className="font-bold text-gray-700">{inviteEmail}</span> with <span className="font-bold text-gray-700">{inviteRole}</span> access.
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Remove Member</h3>
              <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                Remove <span className="font-bold text-gray-700">{showRemoveMemberModal?.name}</span> from your workspace? They will lose access immediately.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRemoveMemberModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTeamMembers(prev => prev.filter(m => m.id !== showRemoveMemberModal.id));
                    setShowRemoveMemberModal(null);
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-2xl shadow-md transition-all"
                >
                  Remove
                </motion.button>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#134e40] to-[#0eb59a] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Crown size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">
                Upgrade to Enterprise
              </h3>
              <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                Get unlimited requirements, a dedicated account manager, white-glove PMO service, and unlimited team members.
              </p>
              <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 mb-5">
                <p className="text-xs text-teal-700 font-semibold text-center leading-relaxed">
                  Our team will reach out within 24 hours to discuss custom pricing tailored to your needs.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUpgradePlanModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUpgradePlanModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-lg"
                >
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Settings;
