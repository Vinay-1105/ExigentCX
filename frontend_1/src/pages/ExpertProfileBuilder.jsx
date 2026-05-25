import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, User, Briefcase, Star, DollarSign,
  Plus, Trash2, Edit3, Save, Upload, Check,
  Award, Target, MapPin, Globe, Linkedin,
  Calendar, Clock, Shield, Eye, CheckCircle,
  X, ChevronDown, ChevronUp, Building, GraduationCap,
  TrendingUp, Zap, BookOpen, FileText, AlertCircle,
  Mail, Phone, ExternalLink
} from 'lucide-react';

const ExpertProfileBuilder = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Basic Info');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddCaseStudyModal, setShowAddCaseStudyModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedCase, setExpandedCase] = useState(null);

  // ── PROFILE STATE ──
  const [profile, setProfile] = useState({
    firstName: 'David',
    lastName: 'Chen',
    headline: 'Interim & Fractional CFO | Ex-Meesho, OYO | Series B/C Fundraising Expert',
    bio: 'Seasoned financial leader with 18+ years of experience as CFO at high-growth startups and listed companies. I have led $200M+ in fundraising across Series A to IPO stages, built finance teams from scratch, and driven profitability across D2C, SaaS, and HealthTech sectors.',
    location: 'Mumbai, Maharashtra',
    email: 'david.chen@email.com',
    phone: '+91 98765 43210',
    linkedin: 'https://linkedin.com/in/davidchen-cfo',
    website: 'https://davidchenfinance.com',
    yearsExperience: '18',
    currentRole: 'Fractional CFO',
    languages: ['English', 'Hindi', 'Mandarin'],
  });

  const [skills, setSkills] = useState([
    'Financial Modeling', 'Fundraising', 'M&A', 'Investor Relations',
    'P&L Management', 'IPO Readiness', 'Unit Economics', 'Treasury Management',
    'Board Reporting', 'FP&A', 'Due Diligence', 'Capital Markets',
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [industries, setIndustries] = useState([
    'SaaS', 'D2C / E-commerce', 'HealthTech', 'Fintech', 'Logistics', 'EdTech',
  ]);

  const [engagementTypes, setEngagementTypes] = useState({
    Fractional: true,
    Interim: true,
    Advisory: true,
    Project: false,
  });

  const [availability, setAvailability] = useState({
    status: 'Available',
    hoursPerWeek: '20',
    startDate: 'Immediate',
    timezone: 'IST (UTC+5:30)',
    preferredMode: 'Remote',
  });

  const [rateCard, setRateCard] = useState({
    fractional: '₹2,00,000',
    interim: '₹3,00,000',
    advisory: '₹75,000',
    project: '₹1,50,000',
    currency: 'INR',
    negotiable: true,
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: 'Chief Financial Officer',
      company: 'Meesho',
      type: 'Full-time',
      startDate: 'Jan 2019',
      endDate: 'Dec 2022',
      current: false,
      description: 'Led Series D ($300M) and Series E ($570M) fundraising. Built a 40-person finance team. Drove profitability from -80% to -12% EBITDA margin in 3 years.',
      logo: 'M',
      logoColor: 'from-pink-500 to-rose-400',
    },
    {
      id: 2,
      role: 'VP Finance & Strategy',
      company: 'OYO',
      type: 'Full-time',
      startDate: 'Mar 2016',
      endDate: 'Dec 2018',
      current: false,
      description: 'Managed global finance operations across 20 countries. Led Series E ($1B) fundraising. Implemented zero-based budgeting saving $40M annually.',
      logo: 'O',
      logoColor: 'from-red-500 to-orange-400',
    },
    {
      id: 3,
      role: 'Fractional CFO',
      company: 'Multiple Startups',
      type: 'Fractional',
      startDate: 'Jan 2023',
      endDate: null,
      current: true,
      description: 'Currently serving as Fractional/Interim CFO for 2-3 high-growth startups simultaneously, focused on fundraising, financial infrastructure, and board reporting.',
      logo: 'FC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: 'MBA — Finance & Strategy',
      institution: 'IIM Ahmedabad',
      year: '2006',
      grade: 'Gold Medalist',
    },
    {
      id: 2,
      degree: 'B.Com (Hons)',
      institution: 'Shri Ram College of Commerce, Delhi University',
      year: '2004',
      grade: 'First Class',
    },
    {
      id: 3,
      degree: 'Chartered Accountant (CA)',
      institution: 'Institute of Chartered Accountants of India',
      year: '2005',
      grade: 'All India Rank 12',
    },
  ]);

  const [caseStudies, setCaseStudies] = useState([
    {
      id: 1,
      title: 'Led $570M Series E for Meesho',
      engagement: 'Meesho',
      outcome: 'Successfully closed $570M Series E at $4.9B valuation',
      role: 'CFO',
      year: '2021',
      tags: ['Fundraising', 'Series E', 'D2C'],
      description: 'Orchestrated end-to-end fundraising process including investor identification, data room preparation, management presentations, and term sheet negotiation.',
      metrics: ['$570M raised', '$4.9B valuation', '6 months process', '12 TS received'],
    },
    {
      id: 2,
      title: 'Turned Around Unit Economics at Scale',
      engagement: 'Meesho',
      outcome: 'Improved EBITDA margin from -80% to -12% in 3 years',
      role: 'CFO',
      year: '2022',
      tags: ['Unit Economics', 'Profitability', 'Ops'],
      description: 'Designed and implemented a comprehensive profitability program including contribution margin tracking, category P&L ownership, and incentive restructuring.',
      metrics: ['-80% to -12% EBITDA', '₹400Cr cost savings', '3-year journey', '40-member team'],
    },
  ]);

  // ── NEW ITEM STATE ──
  const [newExp, setNewExp] = useState({ role: '', company: '', type: 'Full-time', startDate: '', endDate: '', current: false, description: '' });
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '', grade: '' });
  const [newCase, setNewCase] = useState({ title: '', engagement: '', outcome: '', description: '', tags: '', metrics: '' });

  const tabs = [
    { id: 'Basic Info', icon: User },
    { id: 'Experience', icon: Briefcase },
    { id: 'Skills', icon: Zap },
    { id: 'Education', icon: GraduationCap },
    { id: 'Case Studies', icon: BookOpen },
    { id: 'Rate & Availability', icon: DollarSign },
  ];

  const profileStrength = 78;
  const profileTips = [
    { label: 'Basic info complete', done: true },
    { label: 'Work experience added', done: true },
    { label: 'Skills added', done: true },
    { label: 'Rate card set', done: false },
    { label: 'Case studies added', done: true },
    { label: '3 client testimonials', done: false },
  ];

  const allIndustries = [
    'SaaS', 'Fintech', 'HealthTech', 'D2C / E-commerce', 'Logistics',
    'EdTech', 'Manufacturing', 'BFSI', 'Real Estate', 'Media', 'Energy',
  ];

  const availabilityOptions = ['Available', 'Available from next month', 'Limited availability', 'Not available'];
  const modeOptions = ['Remote', 'Hybrid', 'In-Person'];
  const hoursOptions = ['5-10 hrs/wk', '10-20 hrs/wk', '20-30 hrs/wk', '40 hrs/wk (Full-time)'];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const toggleIndustry = (ind) => {
    setIndustries(prev =>
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  const handleAddExperience = () => {
    if (newExp.role && newExp.company) {
      setExperiences(prev => [...prev, {
        ...newExp,
        id: prev.length + 1,
        logo: newExp.company.charAt(0).toUpperCase(),
        logoColor: 'from-gray-500 to-gray-400',
      }]);
      setShowAddExperienceModal(false);
      setNewExp({ role: '', company: '', type: 'Full-time', startDate: '', endDate: '', current: false, description: '' });
    }
  };

  const handleAddEducation = () => {
    if (newEdu.degree && newEdu.institution) {
      setEducation(prev => [...prev, { ...newEdu, id: prev.length + 1 }]);
      setShowAddEducationModal(false);
      setNewEdu({ degree: '', institution: '', year: '', grade: '' });
    }
  };

  const handleAddCaseStudy = () => {
    if (newCase.title && newCase.outcome) {
      setCaseStudies(prev => [...prev, {
        ...newCase,
        id: prev.length + 1,
        year: new Date().getFullYear().toString(),
        tags: newCase.tags.split(',').map(t => t.trim()).filter(Boolean),
        metrics: newCase.metrics.split(',').map(m => m.trim()).filter(Boolean),
      }]);
      setShowAddCaseStudyModal(false);
      setNewCase({ title: '', engagement: '', outcome: '', description: '', tags: '', metrics: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-8 pb-16">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => navigate('/expert-dashboard')} className="text-gray-400 hover:text-[#0eb59a] text-sm font-semibold transition-colors">
                Dashboard
              </button>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-700">Profile Builder</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Profile Builder
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              A complete profile gets <span className="font-bold text-[#0eb59a]">3x more matches</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Save success toast */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-2xl shadow-lg text-sm font-bold"
                >
                  <Check size={15} strokeWidth={3} /> Saved!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <Eye size={15} /> Preview Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg"
            >
              <Save size={15} /> Save Profile
            </motion.button>
          </div>
        </motion.div>

        {/* ── LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-64 shrink-0"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sticky top-6 space-y-1">

              {/* Profile strength */}
              <div className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-2xl p-4 text-white mb-3 relative overflow-hidden">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-[#0eb59a]" />
                      <p className="font-black text-xs">Profile Strength</p>
                    </div>
                    <span className="text-sm font-black text-[#0eb59a]">{profileStrength}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileStrength}%` }}
                      transition={{ duration: 1.2 }}
                      className="h-full bg-[#0eb59a] rounded-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    {profileTips.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${tip.done ? 'bg-emerald-500' : 'bg-white/10 border border-dashed border-white/20'}`}>
                          {tip.done && <Check size={8} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-[10px] font-semibold ${tip.done ? 'text-white/50 line-through' : 'text-white/70'}`}>
                          {tip.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab nav */}
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-teal-50 text-[#134e40]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? 'text-[#0eb59a]' : 'text-gray-400'} />
                  {tab.id}
                  {activeTab === tab.id && (
                    <motion.div layoutId="profileTabDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0eb59a]" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ══ BASIC INFO ══ */}
              {activeTab === 'Basic Info' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Photo + headline */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <User size={16} className="text-[#0eb59a]" /> Profile Photo & Headline
                    </h3>

                    {/* Photo upload */}
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-black text-white">DC</span>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Upload size={18} className="text-white" />
                        </motion.div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Profile Photo</p>
                        <p className="text-xs text-gray-400 mb-2">Square image, min 400×400px. Your face should be clearly visible.</p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all"
                        >
                          <Upload size={13} /> Upload Photo
                        </motion.button>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[
                        { label: 'First Name', key: 'firstName' },
                        { label: 'Last Name', key: 'lastName' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">{field.label}</label>
                          <input
                            type="text"
                            value={profile[field.key]}
                            onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Headline */}
                    <div className="mb-4">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Professional Headline
                      </label>
                      <input
                        type="text"
                        value={profile.headline}
                        onChange={e => setProfile(prev => ({ ...prev, headline: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                      />
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold">{profile.headline.length}/120 characters · This appears under your name on your profile</p>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Professional Summary
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none"
                      />
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold">{profile.bio.length}/600 characters</p>
                    </div>
                  </div>

                  {/* Contact & Location */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <MapPin size={16} className="text-[#0eb59a]" /> Contact & Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Email', key: 'email', icon: Mail, type: 'email' },
                        { label: 'Phone', key: 'phone', icon: Phone, type: 'tel' },
                        { label: 'Location', key: 'location', icon: MapPin, type: 'text' },
                        { label: 'LinkedIn URL', key: 'linkedin', icon: Linkedin, type: 'url' },
                        { label: 'Website', key: 'website', icon: Globe, type: 'url' },
                        { label: 'Years of Experience', key: 'yearsExperience', icon: TrendingUp, type: 'number' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            {field.label}
                          </label>
                          <div className="relative">
                            <field.icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type={field.type}
                              value={profile[field.key]}
                              onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Basic Info
                  </motion.button>
                </motion.div>
              )}

              {/* ══ EXPERIENCE ══ */}
              {activeTab === 'Experience' && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-base">Work Experience</h3>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAddExperienceModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md"
                    >
                      <Plus size={15} /> Add Experience
                    </motion.button>
                  </div>

                  {experiences.map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 group hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${exp.logoColor} flex items-center justify-center shadow-sm shrink-0`}>
                          <span className="text-white font-black text-base">{exp.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h4 className="font-black text-gray-900 text-sm">{exp.role}</h4>
                              <p className="text-sm text-gray-600 font-bold">{exp.company}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50 transition-all"
                              >
                                <Edit3 size={13} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setExperiences(prev => prev.filter(e => e.id !== exp.id))}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              >
                                <Trash2 size={13} />
                              </motion.button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400 font-semibold mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} /> {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black ${
                              exp.type === 'Fractional' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                              'text-gray-600 bg-gray-50 border-gray-200'
                            }`}>
                              {exp.type}
                            </span>
                            {exp.current && (
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                                <motion.span
                                  animate={{ scale: [1, 1.4, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                />
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ══ SKILLS ══ */}
              {activeTab === 'Skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Skills */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Zap size={16} className="text-[#0eb59a]" /> Skills & Expertise
                    </h3>

                    {/* Add skill */}
                    <div className="flex gap-2 mb-5">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill (e.g. Fundraising, M&A)..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addSkill}
                        className="px-4 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white rounded-2xl transition-all"
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>

                    {/* Skills grid */}
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {skills.map(skill => (
                          <motion.span
                            key={skill}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 text-[#134e40] text-xs font-bold rounded-xl border border-teal-100 group"
                          >
                            {skill}
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              onClick={() => removeSkill(skill)}
                              className="text-teal-300 hover:text-red-400 transition-colors"
                            >
                              <X size={11} />
                            </motion.button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-semibold">{skills.length} skills added · Add up to 30</p>
                  </div>

                  {/* Industries */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
                      <Building size={16} className="text-[#0eb59a]" /> Industries Served
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-semibold">Select all industries you have experience in</p>
                    <div className="flex flex-wrap gap-2">
                      {allIndustries.map(ind => {
                        const isActive = industries.includes(ind);
                        return (
                          <motion.button
                            key={ind}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleIndustry(ind)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                              isActive
                                ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                                : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                            }`}
                          >
                            {isActive && <Check size={10} className="text-[#0eb59a]" strokeWidth={3} />}
                            {ind}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Engagement Types */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
                      <Briefcase size={16} className="text-[#0eb59a]" /> Open To
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-semibold">Select the types of engagements you are open to</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(engagementTypes).map(([type, active]) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setEngagementTypes(prev => ({ ...prev, [type]: !prev[type] }))}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            active
                              ? 'border-[#0eb59a] bg-teal-50'
                              : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                          }`}
                        >
                          <span className={`text-sm font-black ${active ? 'text-[#134e40]' : 'text-gray-500'}`}>
                            {type}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            active ? 'bg-[#0eb59a] border-[#0eb59a]' : 'border-gray-300'
                          }`}>
                            {active && <Check size={11} className="text-white" strokeWidth={3} />}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Skills
                  </motion.button>
                </motion.div>
              )}

              {/* ══ EDUCATION ══ */}
              {activeTab === 'Education' && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-base">Education & Certifications</h3>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAddEducationModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md"
                    >
                      <Plus size={15} /> Add Education
                    </motion.button>
                  </div>

                  {education.map((edu, idx) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 group hover:shadow-md transition-all flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <GraduationCap size={22} className="text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-black text-gray-900 text-sm">{edu.degree}</h4>
                            <p className="text-sm text-gray-600 font-bold">{edu.institution}</p>
                            <div className="flex gap-3 mt-1 text-xs text-gray-400 font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} /> {edu.year}
                              </span>
                              {edu.grade && (
                                <span className="flex items-center gap-1 text-amber-600 font-bold">
                                  <Star size={11} fill="currentColor" /> {edu.grade}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50"
                            >
                              <Edit3 size={13} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => setEducation(prev => prev.filter(e => e.id !== edu.id))}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ══ CASE STUDIES ══ */}
              {activeTab === 'Case Studies' && (
                <motion.div
                  key="cases"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-base">Case Studies</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Showcase your impact with real results</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAddCaseStudyModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-md"
                    >
                      <Plus size={15} /> Add Case Study
                    </motion.button>
                  </div>

                  {caseStudies.map((cs, idx) => (
                    <motion.div
                      key={cs.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
                    >
                      {/* Card top accent */}
                      <div className="h-1 bg-gradient-to-r from-[#134e40] to-[#0eb59a]" />

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {cs.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                                  {tag}
                                </span>
                              ))}
                              <span className="text-[10px] font-black text-gray-400">{cs.year}</span>
                            </div>
                            <h4 className="font-black text-gray-900 text-base mb-1">{cs.title}</h4>
                            <p className="text-sm text-[#0eb59a] font-bold">{cs.outcome}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0eb59a] hover:bg-teal-50"
                            >
                              <Edit3 size={13} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => setCaseStudies(prev => prev.filter(c => c.id !== cs.id))}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {cs.metrics.map((metric, mIdx) => (
                            <div key={mIdx} className="bg-teal-50 rounded-xl p-3 border border-teal-100 text-center">
                              <p className="text-xs font-black text-[#134e40]">{metric}</p>
                            </div>
                          ))}
                        </div>

                        {/* Expandable description */}
                        <motion.button
                          onClick={() => setExpandedCase(expandedCase === cs.id ? null : cs.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#0eb59a] transition-colors"
                        >
                          {expandedCase === cs.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          {expandedCase === cs.id ? 'Hide Details' : 'View Details'}
                        </motion.button>

                        <AnimatePresence>
                          {expandedCase === cs.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-gray-500 leading-relaxed mt-3 pt-3 border-t border-gray-50">
                                {cs.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ══ RATE & AVAILABILITY ══ */}
              {activeTab === 'Rate & Availability' && (
                <motion.div
                  key="rate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Availability */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Calendar size={16} className="text-[#0eb59a]" /> Availability
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status */}
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Current Status
                        </label>
                        <div className="space-y-2">
                          {availabilityOptions.map(opt => (
                            <motion.button
                              key={opt}
                              whileHover={{ x: 3 }}
                              onClick={() => setAvailability(prev => ({ ...prev, status: opt }))}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                                availability.status === opt
                                  ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  opt === 'Available' ? 'bg-emerald-500' :
                                  opt === 'Available from next month' ? 'bg-amber-500' :
                                  opt === 'Limited availability' ? 'bg-orange-400' :
                                  'bg-red-400'
                                }`} />
                                {opt}
                              </div>
                              {availability.status === opt && (
                                <Check size={14} className="text-[#0eb59a]" strokeWidth={3} />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Hours per week */}
                        <div>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            Hours Available Per Week
                          </label>
                          <select
                            value={availability.hoursPerWeek}
                            onChange={e => setAvailability(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          >
                            {hoursOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        {/* Mode */}
                        <div>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            Preferred Work Mode
                          </label>
                          <div className="flex gap-2">
                            {modeOptions.map(mode => (
                              <motion.button
                                key={mode}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => setAvailability(prev => ({ ...prev, preferredMode: mode }))}
                                className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${
                                  availability.preferredMode === mode
                                    ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                                    : 'border-gray-100 bg-gray-50 text-gray-500'
                                }`}
                              >
                                {mode}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            Timezone
                          </label>
                          <input
                            type="text"
                            value={availability.timezone}
                            onChange={e => setAvailability(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rate Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
                      <DollarSign size={16} className="text-[#0eb59a]" /> Rate Card
                    </h3>
                    <p className="text-xs text-gray-400 mb-5 font-semibold">
                      Set your monthly rates per engagement type. These are shown as indicative ranges to companies.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {[
                        { key: 'fractional', label: 'Fractional (per month)', desc: '10-20 hrs/wk', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { key: 'interim', label: 'Interim (per month)', desc: '40 hrs/wk', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { key: 'advisory', label: 'Advisory (per month)', desc: '5-10 hrs/wk', color: 'text-amber-500', bg: 'bg-amber-50' },
                        { key: 'project', label: 'Project-based (flat fee)', desc: 'Per project', color: 'text-teal-500', bg: 'bg-teal-50' },
                      ].map(rate => (
                        <div key={rate.key}>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            {rate.label}
                          </label>
                          <div className="relative">
                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 ${rate.bg} rounded-lg flex items-center justify-center`}>
                              <span className={`text-xs font-black ${rate.color}`}>₹</span>
                            </div>
                            <input
                              type="text"
                              value={rateCard[rate.key]}
                              onChange={e => setRateCard(prev => ({ ...prev, [rate.key]: e.target.value }))}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 font-semibold">{rate.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Negotiable toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Rates are negotiable</p>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">Companies can request a custom quote</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRateCard(prev => ({ ...prev, negotiable: !prev.negotiable }))}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${
                          rateCard.negotiable ? 'bg-[#0eb59a]' : 'bg-gray-200'
                        }`}
                      >
                        <motion.div
                          animate={{ x: rateCard.negotiable ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                        />
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Rate & Availability
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══ ADD EXPERIENCE MODAL ══ */}
      <AnimatePresence>
        {showAddExperienceModal && (
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
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Add Experience</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowAddExperienceModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Job Title / Role', key: 'role', placeholder: 'e.g. Chief Financial Officer' },
                  { label: 'Company', key: 'company', placeholder: 'e.g. Meesho' },
                  { label: 'Start Date', key: 'startDate', placeholder: 'e.g. Jan 2019' },
                  { label: 'End Date', key: 'endDate', placeholder: 'e.g. Dec 2022 (leave blank if current)' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">{field.label}</label>
                    <input
                      type="text"
                      value={newExp[field.key]}
                      onChange={e => setNewExp(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Type</label>
                  <div className="flex gap-2">
                    {['Full-time', 'Fractional', 'Advisory'].map(type => (
                      <motion.button
                        key={type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewExp(prev => ({ ...prev, type }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                          newExp.type === type
                            ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                            : 'border-gray-100 bg-gray-50 text-gray-500'
                        }`}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Key Achievements</label>
                  <textarea
                    value={newExp.description}
                    onChange={e => setNewExp(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your key achievements, impact, and responsibilities..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowAddExperienceModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: (newExp.role && newExp.company) ? 1.02 : 1 }}
                  disabled={!newExp.role || !newExp.company}
                  onClick={handleAddExperience}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                    newExp.role && newExp.company
                      ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add Experience
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ADD EDUCATION MODAL ══ */}
      <AnimatePresence>
        {showAddEducationModal && (
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Add Education</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowAddEducationModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Degree / Certification', key: 'degree', placeholder: 'e.g. MBA — Finance & Strategy' },
                  { label: 'Institution', key: 'institution', placeholder: 'e.g. IIM Ahmedabad' },
                  { label: 'Year', key: 'year', placeholder: 'e.g. 2006' },
                  { label: 'Grade / Distinction', key: 'grade', placeholder: 'e.g. Gold Medalist, First Class' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">{field.label}</label>
                    <input
                      type="text"
                      value={newEdu[field.key]}
                      onChange={e => setNewEdu(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowAddEducationModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: (newEdu.degree && newEdu.institution) ? 1.02 : 1 }}
                  disabled={!newEdu.degree || !newEdu.institution}
                  onClick={handleAddEducation}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                    newEdu.degree && newEdu.institution
                      ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add Education
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ADD CASE STUDY MODAL ══ */}
      <AnimatePresence>
        {showAddCaseStudyModal && (
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
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Add Case Study</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowAddCaseStudyModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={e => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Led $570M Series E for Meesho"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Company / Engagement</label>
                  <input
                    type="text"
                    value={newCase.engagement}
                    onChange={e => setNewCase(prev => ({ ...prev, engagement: e.target.value }))}
                    placeholder="e.g. Meesho"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Outcome (one-liner)</label>
                  <input
                    type="text"
                    value={newCase.outcome}
                    onChange={e => setNewCase(prev => ({ ...prev, outcome: e.target.value }))}
                    placeholder="e.g. Successfully closed $570M Series E at $4.9B valuation"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={newCase.description}
                    onChange={e => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you did, how you did it, and the impact..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                    Key Metrics <span className="font-normal text-gray-400 normal-case">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={newCase.metrics}
                    onChange={e => setNewCase(prev => ({ ...prev, metrics: e.target.value }))}
                    placeholder="e.g. $570M raised, $4.9B valuation, 6 months"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                    Tags <span className="font-normal text-gray-400 normal-case">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={newCase.tags}
                    onChange={e => setNewCase(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. Fundraising, Series E, D2C"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowAddCaseStudyModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: (newCase.title && newCase.outcome) ? 1.02 : 1 }}
                  disabled={!newCase.title || !newCase.outcome}
                  onClick={handleAddCaseStudy}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${
                    newCase.title && newCase.outcome
                      ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add Case Study
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PROFILE PREVIEW MODAL ══ */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Preview header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-[#0eb59a]" />
                  <h3 className="font-black text-gray-900 text-sm">Profile Preview</h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200">
                    Company View
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 space-y-5">

                {/* Hero */}
                <div className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0eb59a] to-teal-300 flex items-center justify-center shadow-lg shrink-0">
                      <span className="text-white font-black text-xl">DC</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-black">{profile.firstName} {profile.lastName}</h2>
                        <Shield size={14} className="text-[#0eb59a]" />
                      </div>
                      <p className="text-sm text-white/80 font-semibold mb-2">{profile.headline}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-white/50 font-semibold">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {profile.location}</span>
                        <span className="flex items-center gap-1"><TrendingUp size={11} /> {profile.yearsExperience} yrs exp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills preview */}
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 8).map(skill => (
                      <span key={skill} className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl">
                        {skill}
                      </span>
                    ))}
                    {skills.length > 8 && (
                      <span className="text-xs font-bold bg-gray-100 text-gray-400 px-3 py-1.5 rounded-xl">
                        +{skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Rate preview */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'Fractional', rate: rateCard.fractional },
                    { type: 'Interim', rate: rateCard.interim },
                  ].map(r => (
                    <div key={r.type} className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                      <p className="text-xs font-black text-gray-500 mb-1">{r.type}</p>
                      <p className="text-lg font-black text-[#134e40]">{r.rate}<span className="text-xs font-semibold text-gray-400">/mo</span></p>
                    </div>
                  ))}
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    availability.status === 'Available' ? 'bg-emerald-500' :
                    availability.status === 'Available from next month' ? 'bg-amber-500' : 'bg-orange-400'
                  }`} />
                  <div>
                    <p className="font-black text-gray-900 text-sm">{availability.status}</p>
                    <p className="text-xs text-gray-400 font-semibold">{availability.hoursPerWeek} · {availability.preferredMode}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertProfileBuilder;
