import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, Save,
  Briefcase, Users, Clock, DollarSign, Target,
  MapPin, Calendar, Zap, FileText, ArrowRight,
  Building, TrendingUp, Code, BarChart, Settings,
  Shield, Globe, Star, AlertCircle, X
} from 'lucide-react';

const CreateRequirement = () => {
  const navigate = useNavigate();

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
  const [currentStep, setCurrentStep] = useState(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    engagementType: '',
    // Step 2
    businessProblems: [],
    businessProblemText: '',
    // Step 3
    skills: [],
    experienceYears: '5+',
    industries: [],
    // Step 4
    budgetMin: '',
    budgetMax: '',
    duration: '',
    commitment: '',
    urgency: '',
    location: '',
    // Step 5 — review
  });

  const totalSteps = 5;

  // ── STEP DATA ──

  const steps = [
    { number: 1, title: 'Engagement Type', desc: 'What kind of role?' },
    { number: 2, title: 'Business Problem', desc: 'What challenge are you solving?' },
    { number: 3, title: 'Skills & Experience', desc: 'What expertise do you need?' },
    { number: 4, title: 'Budget & Duration', desc: 'Timeline and investment' },
    { number: 5, title: 'Review & Submit', desc: 'Confirm and post' },
  ];

  const engagementTypes = [
    {
      id: 'fractional',
      label: 'Fractional',
      desc: 'Part-time senior leadership, ongoing basis',
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      activeBorder: 'border-blue-500',
      activeBg: 'bg-blue-50',
      example: 'e.g. Fractional CFO 15hrs/wk'
    },
    {
      id: 'interim',
      label: 'Interim',
      desc: 'Full-time replacement for a fixed period',
      icon: Briefcase,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      activeBorder: 'border-purple-500',
      activeBg: 'bg-purple-50',
      example: 'e.g. Interim CEO for 6 months'
    },
    {
      id: 'advisory',
      label: 'Advisory',
      desc: 'Strategic guidance and board-level input',
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      activeBorder: 'border-amber-500',
      activeBg: 'bg-amber-50',
      example: 'e.g. Advisory Board Member'
    },
    {
      id: 'project',
      label: 'Project',
      desc: 'Defined scope with clear deliverables',
      icon: Target,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      activeBorder: 'border-[#0eb59a]',
      activeBg: 'bg-teal-50',
      example: 'e.g. GTM strategy project'
    },
  ];

  const businessProblems = [
    { id: 'fundraising', label: 'Fundraising / Investor Relations', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'gtm', label: 'Go-to-Market Strategy', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'scaling', label: 'Scaling Operations', icon: BarChart, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'tech', label: 'Technology & Digital Transformation', icon: Code, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'finance', label: 'Financial Planning & Control', icon: DollarSign, color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: 'people', label: 'People & Culture', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'governance', label: 'Governance & Compliance', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'growth', label: 'Revenue Growth & Sales', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'product', label: 'Product Strategy', icon: Settings, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'brand', label: 'Brand & Marketing', icon: Star, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'ops', label: 'Supply Chain & Operations', icon: Building, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 'turnaround', label: 'Business Turnaround', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const skillOptions = [
    'Financial Modeling', 'Fundraising', 'M&A', 'Investor Relations',
    'Brand Strategy', 'Growth Marketing', 'B2B Marketing', 'Product Marketing',
    'Engineering Leadership', 'System Architecture', 'Team Scaling', 'DevOps',
    'Enterprise Sales', 'Revenue Strategy', 'CRM', 'Partnership Development',
    'Operations', 'Supply Chain', 'Process Optimization', 'OKRs',
    'Product Strategy', 'Agile', 'UX Design', 'Product Analytics',
    'P&L Management', 'Financial Controls', 'ERP', 'Cost Optimization',
    'HR Strategy', 'Talent Acquisition', 'Culture Building', 'L&D',
    'Corporate Governance', 'Risk Management', 'Compliance', 'Legal'
  ];

  const industryOptions = [
    'SaaS / Technology', 'Fintech', 'Healthcare', 'E-commerce',
    'Manufacturing', 'BFSI', 'Consumer Goods', 'EdTech',
    'Real Estate', 'Logistics', 'Media & Entertainment', 'Energy',
    'Retail', 'Hospitality', 'Agriculture', 'Professional Services'
  ];

  const experienceOptions = ['3+', '5+', '8+', '10+', '15+', '20+'];

  const durationOptions = [
    '1 month', '2 months', '3 months', '4 months',
    '6 months', '9 months', '12 months', 'Ongoing'
  ];

  const commitmentOptions = [
    '4 hrs/wk', '8 hrs/wk', '10 hrs/wk', '15 hrs/wk',
    '20 hrs/wk', '25 hrs/wk', '30 hrs/wk', '40 hrs/wk (Full-time)'
  ];

  const locationOptions = [
    'Remote', 'Hybrid', 'In Office — Mumbai', 'In Office — Delhi',
    'In Office — Bangalore', 'In Office — Hyderabad', 'In Office — Chennai',
    'In Office — Pune', 'Pan India', 'Global'
  ];

  // ── HELPERS ──

  const toggleItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(i => i !== value)
        : [...prev[field], value]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.engagementType !== '';
      case 2: return formData.businessProblems.length > 0;
      case 3: return formData.skills.length > 0;
      case 4: return formData.budgetMin && formData.duration && formData.commitment && formData.urgency && formData.location;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    navigate('/requirements');
  };

  // ── STEP COMPONENTS ──

  const Step1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          What type of engagement are you looking for?
        </h2>
        <p className="text-gray-400 text-sm">
          Choose the engagement model that best fits your need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engagementTypes.map((type, idx) => {
          const isSelected = formData.engagementType === type.id;
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, engagementType: type.id }))}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? `${type.activeBorder} ${type.activeBg} shadow-lg`
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-[#0eb59a] rounded-full flex items-center justify-center"
                >
                  <Check size={13} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className={`w-12 h-12 ${type.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <type.icon size={22} className={type.color} />
              </div>

              <h3 className="font-black text-gray-900 text-base mb-1">{type.label}</h3>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">{type.desc}</p>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                {type.example}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  const Step2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-2">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          What business challenge are you solving?
        </h2>
        <p className="text-gray-400 text-sm">
          Select all that apply. This helps us match you with the right experts.
        </p>
      </div>

      {/* Multi-select chips */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {businessProblems.map((problem, idx) => {
          const isSelected = formData.businessProblems.includes(problem.id);
          return (
            <motion.button
              key={problem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleItem('businessProblems', problem.id)}
              className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-[#0eb59a] bg-teal-50 shadow-md shadow-teal-100'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className={`w-9 h-9 ${problem.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <problem.icon size={16} className={problem.color} />
              </div>
              <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#134e40]' : 'text-gray-600'}`}>
                {problem.label}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-[#0eb59a] rounded-full flex items-center justify-center"
                >
                  <Check size={9} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Free text */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Describe your challenge in your own words{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={formData.businessProblemText}
          onChange={(e) => setFormData(prev => ({ ...prev, businessProblemText: e.target.value }))}
          placeholder="e.g. We're preparing for a Series B round and need a CFO who has taken a SaaS company through fundraising before..."
          rows={4}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all resize-none"
        />
      </div>

      {/* Selected count */}
      {formData.businessProblems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-bold text-[#0eb59a]"
        >
          <Check size={16} />
          {formData.businessProblems.length} challenge{formData.businessProblems.length > 1 ? 's' : ''} selected
        </motion.div>
      )}
    </motion.div>
  );

  const Step3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-2">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          What skills and experience are required?
        </h2>
        <p className="text-gray-400 text-sm">
          Select skills and set minimum experience level.
        </p>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Required Skills
          <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill, idx) => {
            const isSelected = formData.skills.includes(skill);
            return (
              <motion.button
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleItem('skills', skill)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  isSelected
                    ? 'bg-[#134e40] text-white border-[#134e40] shadow-md'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-[#0eb59a]/40 hover:text-[#0eb59a]'
                }`}
              >
                {isSelected && <Check size={10} className="inline mr-1" strokeWidth={3} />}
                {skill}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Experience Years */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Minimum Years of Experience
        </label>
        <div className="flex gap-3 flex-wrap">
          {experienceOptions.map((exp) => (
            <motion.button
              key={exp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData(prev => ({ ...prev, experienceYears: exp }))}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                formData.experienceYears === exp
                  ? 'bg-[#0eb59a] text-white border-[#0eb59a] shadow-md'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-[#0eb59a]/40'
              }`}
            >
              {exp} years
            </motion.button>
          ))}
        </div>
      </div>

      {/* Industry Preference */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Industry Experience Preferred
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {industryOptions.map((industry) => {
            const isSelected = formData.industries.includes(industry);
            return (
              <motion.button
                key={industry}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleItem('industries', industry)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  isSelected
                    ? 'bg-teal-50 text-[#134e40] border-[#0eb59a]'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                }`}
              >
                {industry}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected summary */}
      {formData.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-teal-50 rounded-2xl border border-teal-100"
        >
          <p className="text-xs font-bold text-[#134e40] mb-2">
            {formData.skills.length} skill{formData.skills.length > 1 ? 's' : ''} selected:
          </p>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <span key={skill} className="text-xs bg-white text-[#134e40] font-bold px-2.5 py-1 rounded-lg border border-teal-100">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const Step4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-2">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          Budget, duration and logistics
        </h2>
        <p className="text-gray-400 text-sm">
          Set your budget range and timeline expectations.
        </p>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Monthly Budget Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
            <input
              type="text"
              placeholder="Min (e.g. 80,000)"
              value={formData.budgetMin}
              onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
              className="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
            <input
              type="text"
              placeholder="Max (e.g. 2,00,000)"
              value={formData.budgetMax}
              onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
              className="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Engagement Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {durationOptions.map((dur) => (
            <motion.button
              key={dur}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFormData(prev => ({ ...prev, duration: dur }))}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                formData.duration === dur
                  ? 'bg-[#134e40] text-white border-[#134e40] shadow-md'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-[#0eb59a]/40'
              }`}
            >
              {dur}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Commitment */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Weekly Commitment Required
        </label>
        <div className="flex flex-wrap gap-2">
          {commitmentOptions.map((com) => (
            <motion.button
              key={com}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFormData(prev => ({ ...prev, commitment: com }))}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                formData.commitment === com
                  ? 'bg-[#0eb59a] text-white border-[#0eb59a] shadow-md'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-[#0eb59a]/40'
              }`}
            >
              {com}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Urgency</label>
        <div className="flex gap-4">
          {[
            { id: 'immediate', label: 'Immediate', desc: 'Need to start ASAP', icon: Zap, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
            { id: 'planned', label: 'Planned', desc: 'Within next 30-60 days', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
          ].map((urg) => (
            <motion.button
              key={urg.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, urgency: urg.id }))}
              className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                formData.urgency === urg.id
                  ? `${urg.border} ${urg.bg} shadow-md`
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 ${urg.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <urg.icon size={18} className={urg.color} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">{urg.label}</p>
                <p className="text-xs text-gray-400">{urg.desc}</p>
              </div>
              {formData.urgency === urg.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-5 h-5 bg-[#0eb59a] rounded-full flex items-center justify-center"
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Work Location Preference
        </label>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((loc) => (
            <motion.button
              key={loc}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFormData(prev => ({ ...prev, location: loc }))}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                formData.location === loc
                  ? 'bg-[#134e40] text-white border-[#134e40] shadow-md'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-[#0eb59a]/40'
              }`}
            >
              <MapPin size={11} />
              {loc}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const Step5 = () => (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-2">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          Review your requirement
        </h2>
        <p className="text-gray-400 text-sm">
          Confirm everything looks right before posting.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {[
          {
            step: 1,
            title: 'Engagement Type',
            icon: Briefcase,
            content: (
              <span className="text-sm font-bold text-gray-700 capitalize">
                {formData.engagementType || '—'}
              </span>
            )
          },
          {
            step: 2,
            title: 'Business Problems',
            icon: Target,
            content: (
              <div className="flex flex-wrap gap-2">
                {formData.businessProblems.length > 0
                  ? formData.businessProblems.map(p => (
                    <span key={p} className="text-xs bg-teal-50 text-[#134e40] font-bold px-2.5 py-1 rounded-lg border border-teal-100">
                      {businessProblems.find(bp => bp.id === p)?.label}
                    </span>
                  ))
                  : <span className="text-sm text-gray-400">None selected</span>
                }
              </div>
            )
          },
          {
            step: 3,
            title: 'Skills & Experience',
            icon: Star,
            content: (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.skills.slice(0, 6).map(s => (
                    <span key={s} className="text-xs bg-gray-50 text-gray-600 font-bold px-2.5 py-1 rounded-lg border border-gray-100">
                      {s}
                    </span>
                  ))}
                  {formData.skills.length > 6 && (
                    <span className="text-xs bg-gray-50 text-gray-400 font-bold px-2.5 py-1 rounded-lg">
                      +{formData.skills.length - 6} more
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-semibold">
                  {formData.experienceYears} years experience required
                </p>
              </div>
            )
          },
          {
            step: 4,
            title: 'Budget & Duration',
            icon: DollarSign,
            content: (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Budget', value: formData.budgetMin && formData.budgetMax ? `₹${formData.budgetMin} - ₹${formData.budgetMax}/mo` : formData.budgetMin ? `₹${formData.budgetMin}/mo` : '—' },
                  { label: 'Duration', value: formData.duration || '—' },
                  { label: 'Commitment', value: formData.commitment || '—' },
                  { label: 'Urgency', value: formData.urgency ? formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1) : '—' },
                  { label: 'Location', value: formData.location || '—' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="font-bold text-gray-800 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            )
          }
        ].map((section) => (
          <motion.div
            key={section.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: section.step * 0.08 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-50 rounded-xl flex items-center justify-center">
                  <section.icon size={14} className="text-[#0eb59a]" />
                </div>
                <h4 className="font-black text-gray-900 text-sm">{section.title}</h4>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentStep(section.step)}
                className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
              >
                Edit <ChevronRight size={12} />
              </motion.button>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>

      {/* Description text if added */}
      {formData.businessProblemText && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Additional Context</p>
          <p className="text-sm text-gray-600 leading-relaxed">{formData.businessProblemText}</p>
        </div>
      )}

      {/* Posting notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100"
      >
        <div className="w-8 h-8 bg-[#0eb59a] rounded-xl flex items-center justify-center shrink-0">
          <Check size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-[#134e40]">Ready to post</p>
          <p className="text-xs text-teal-600 mt-0.5 leading-relaxed">
            Your requirement will be visible to our vetted expert network. Expect your first matches within 24-48 hours.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-8 pb-16">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/requirements')}
                className="text-gray-400 hover:text-[#0eb59a] text-sm font-semibold transition-colors"
              >
                My Requirements
              </button>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-700">New Requirement</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Create Requirement</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Save size={15} /> Save as Draft
          </motion.button>
        </motion.div>

        {/* ── PROGRESS BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        backgroundColor: isCompleted ? '#0eb59a' : isCurrent ? '#134e40' : '#f3f4f6',
                        scale: isCurrent ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center mb-2 shadow-sm"
                    >
                      {isCompleted ? (
                        <Check size={15} className="text-white" strokeWidth={3} />
                      ) : (
                        <span className={`text-xs font-black ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                          {step.number}
                        </span>
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-bold hidden md:block ${isCurrent ? 'text-[#134e40]' : isCompleted ? 'text-[#0eb59a]' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                      <motion.div
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="h-full bg-[#0eb59a] rounded-full"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Current step info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-semibold">
                Step {currentStep} of {totalSteps}
              </p>
              <p className="text-sm font-black text-gray-700">
                {steps[currentStep - 1].desc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                />
              </div>
              <span className="text-xs font-black text-[#0eb59a]">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── STEP CONTENT ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* ── NAVIGATION BUTTONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <motion.button
            whileHover={{ scale: currentStep === 1 ? 1 : 1.03 }}
            whileTap={{ scale: currentStep === 1 ? 1 : 0.97 }}
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              currentStep === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <ChevronLeft size={16} /> Back
          </motion.button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: canProceed() ? 1.03 : 1, boxShadow: canProceed() ? '0 8px 30px rgba(20,78,64,0.25)' : 'none' }}
                whileTap={{ scale: canProceed() ? 0.97 : 1 }}
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
                  canProceed()
                    ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(20,78,64,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg shadow-teal-900/20"
              >
                <Zap size={16} fill="currentColor" /> Post Requirement
              </motion.button>
            )}
          </div>
        </motion.div>

      </div>

      {/* ── SAVE DRAFT MODAL ── */}
      <AnimatePresence>
        {showSaveModal && (
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
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Save size={24} className="text-[#0eb59a]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">
                Save as Draft?
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                Your progress will be saved. You can continue editing this requirement anytime from My Requirements.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Keep Editing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/requirements')}
                  className="flex-1 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-2xl transition-all shadow-lg"
                >
                  Save Draft
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CreateRequirement;
