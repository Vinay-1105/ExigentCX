import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');

  // Authentication Guard
  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    const checkAuth = async () => {
      if (isDemo) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
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

  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const { data, error } = await supabase
          .from('company_requirements')
          .select('*')
          .eq('id', draftId)
          .single();
        
        if (data && !error) {
          setFormData({
            engagementType: data.engagement_type || '',
            businessProblems: data.business_problems || [],
            businessProblemText: data.business_problem_text || '',
            roleTitle: data.role_title || '',
            skills: data.skills || [],
            experienceYears: data.experience_years || '10-13',
            industries: data.industries || [],
            budgetMin: data.budget_min ? data.budget_min.toString() : '',
            budgetMax: data.budget_max ? data.budget_max.toString() : '',
            duration: data.duration || '',
            commitment: data.commitment || '',
            urgency: data.urgency || '',
            location: data.location || ''
          });
        }
      }
    };
    fetchDraft();
  }, [draftId]);

  const [currentStep, setCurrentStep] = useState(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    engagementType: '',
    // Step 2
    businessProblems: [],
    businessProblemText: '',
    // Step 3
    roleTitle: '',
    skills: [],
    experienceYears: '10-13',
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
      example: 'e.g. Fractional CFO 15hrs/wk'
    },
    {
      id: 'interim',
      label: 'Interim',
      desc: 'Full-time replacement for a fixed period',
      icon: Briefcase,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      example: 'e.g. Interim CEO for 6 months'
    },
    {
      id: 'advisory',
      label: 'Advisory',
      desc: 'Strategic guidance and board-level input',
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      example: 'e.g. Advisory Board Member'
    },
    {
      id: 'project',
      label: 'Project',
      desc: 'Defined scope with clear deliverables',
      icon: Target,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
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

  const experienceOptions = [
    { value: '10-13', label: '10–13 yrs' },
    { value: '14-17', label: '14–17 yrs' },
    { value: '18-20', label: '18–20 yrs' },
    { value: '20+',   label: '20+ yrs'   },
  ];

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

  const urgencyOptions = [
    { value: 'immediate', label: 'Immediate (ASAP)' },
    { value: 'planned', label: 'Planned (30-60 days)' }
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
      case 3: return formData.skills.length > 0 && formData.roleTitle?.trim().length > 0;
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (status = 'Active') => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    setIsSubmitting(true);
    try {
      if (isDemo) {
        setTimeout(() => {
          navigate('/requirements');
        }, 1000);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user.email) {
        navigate('/signin?role=company');
        return;
      }

      const payload = {
        company_email: session.user.email,
        engagement_type: formData.engagementType,
        business_problems: formData.businessProblems,
        business_problem_text: formData.businessProblemText,
        role_title: formData.roleTitle,
        skills: formData.skills,
        experience_years: formData.experienceYears,
        industries: formData.industries,
        budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : null,
        budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : null,
        duration: formData.duration,
        commitment: formData.commitment,
        urgency: formData.urgency,
        location: formData.location,
        status: status
      };

      let dbError;
      if (draftId) {
        const { error } = await supabase
          .from('company_requirements')
          .update(payload)
          .eq('id', draftId);
        dbError = error;
      } else {
        const { error } = await supabase
          .from('company_requirements')
          .insert([payload]);
        dbError = error;
      }

      if (!dbError) {
        navigate('/requirements');
      } else {
        console.error("Failed to save requirement:", dbError);
      }
    } catch (error) {
      console.error("Error saving requirement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── RENDER STEP (INLINE) ──
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Engagement Model</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                        ? 'bg-[#134e40] border-[#134e40] shadow-xl shadow-[#134e40]/20'
                        : 'border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e2028] hover:border-gray-200 dark:hover:border-white/10 hover:shadow-md'
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

                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isSelected ? 'bg-white/15' : `${type.bg} dark:bg-white/5`}`}>
                      <type.icon size={22} className={isSelected ? 'text-white' : type.color} />
                    </div>

                    <h3 className={`font-black text-base mb-1 ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{type.label}</h3>
                    <p className={`text-sm mb-3 leading-relaxed ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>{type.desc}</p>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isSelected ? 'bg-white/15 text-white/80' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}>
                      {type.example}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Business Challenge</h3>
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
                        ? 'border-[#0eb59a] bg-teal-50 dark:bg-[#0eb59a]/10 shadow-md shadow-teal-100 dark:shadow-none'
                        : 'border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e2028] hover:border-gray-200 dark:hover:border-white/10'
                    }`}
                  >
                    <div className={`w-9 h-9 ${problem.bg} dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0`}>
                      <problem.icon size={16} className={problem.color} />
                    </div>
                    <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#134e40] dark:text-[#0eb59a]' : 'text-gray-600 dark:text-gray-400'}`}>
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

            <div className="border-t border-gray-50 dark:border-white/10 my-6" />

            {/* Free text */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Describe your challenge in your own words <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={formData.businessProblemText}
                onChange={(e) => setFormData(prev => ({ ...prev, businessProblemText: e.target.value }))}
                placeholder="e.g. We're preparing for a Series B round and need a CFO who has taken a SaaS company through fundraising before..."
                rows={4}
                className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-800 dark:text-gray-200 font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#0eb59a] focus:ring-2 focus:ring-[#0eb59a]/15 transition-all duration-200 resize-none"
              />
            </div>

            {/* Selected count */}
            {formData.businessProblems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm font-bold text-[#0eb59a] mt-4"
              >
                <Check size={16} />
                {formData.businessProblems.length} challenge{formData.businessProblems.length > 1 ? 's' : ''} selected
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Role Basics</h3>
            </div>

            {/* Role Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Role Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Interim CFO, Fractional CMO, VP of Engineering"
                value={formData.roleTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-800 dark:text-gray-200 font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#0eb59a] focus:ring-2 focus:ring-[#0eb59a]/15 transition-all duration-200"
              />
              <p className="text-xs text-gray-400 dark:text-gray-550 mt-1.5">This is what experts will see when they browse requirements</p>
            </div>

            <div className="border-t border-gray-50 dark:border-white/10 my-6" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Required Skills</h3>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Key Skills <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(select all that apply) <span className="text-red-400">*</span></span>
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
                          : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-[#0eb59a]/40 hover:text-[#0eb59a] dark:hover:text-[#0eb59a]'
                      }`}
                    >
                      {isSelected && <Check size={10} className="inline mr-1" strokeWidth={3} />}
                      {skill}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-50 dark:border-white/10 my-6" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Experience & Industry</h3>
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Minimum Years of Experience <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {experienceOptions.map((exp) => (
                  <button
                    key={exp.value}
                    onClick={() => setFormData(prev => ({ ...prev, experienceYears: exp.value }))}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      formData.experienceYears === exp.value
                        ? 'bg-[#134e40] text-white border-[#134e40]'
                        : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#134e40]/30 hover:text-[#134e40] dark:hover:text-[#0eb59a] dark:hover:border-[#0eb59a]/30'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-50 dark:border-white/10 my-6" />

            {/* Industry Preference */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Industry Experience Preferred <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(optional)</span>
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
                          ? 'bg-teal-50 dark:bg-[#0eb59a]/10 text-[#134e40] dark:text-[#0eb59a] border-[#0eb59a]'
                          : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
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
                className="p-4 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-2xl border border-teal-100 dark:border-white/5 mt-6"
              >
                <p className="text-xs font-bold text-[#134e40] dark:text-[#0eb59a] mb-2">
                  {formData.skills.length} skill{formData.skills.length > 1 ? 's' : ''} selected:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span key={skill} className="text-xs bg-white dark:bg-[#1e2028] text-[#134e40] dark:text-[#0eb59a] font-bold px-2.5 py-1 rounded-lg border border-teal-100 dark:border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Budget Allocation</h3>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Monthly Budget Range (₹) <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="Min e.g. 80000"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                    onFocus={(e) => e.target.select()}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#0eb59a] focus:ring-2 focus:ring-[#0eb59a]/15 transition-all duration-200"
                  />
                </div>
                <span className="text-gray-400 dark:text-gray-500 font-bold text-sm">—</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="Max e.g. 200000"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                    onFocus={(e) => e.target.select()}
                    className="w-full pl-7 pr-4 py-3 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#0eb59a] focus:ring-2 focus:ring-[#0eb59a]/15 transition-all duration-200"
                  />
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold whitespace-nowrap">/month</span>
              </div>
            </div>

            <div className="border-t border-gray-50 dark:border-white/10 my-6" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Timeline & Commitment</h3>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Engagement Duration <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setFormData(prev => ({ ...prev, duration: dur }))}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      formData.duration === dur
                        ? 'bg-[#134e40] text-white border-[#134e40]'
                        : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#134e40]/30 hover:text-[#134e40] dark:hover:text-[#0eb59a] dark:hover:border-[#0eb59a]/30'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Commitment */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Weekly Commitment Required <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {commitmentOptions.map((com) => (
                  <button
                    key={com}
                    onClick={() => setFormData(prev => ({ ...prev, commitment: com }))}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      formData.commitment === com
                        ? 'bg-[#134e40] text-white border-[#134e40]'
                        : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#134e40]/30 hover:text-[#134e40] dark:hover:text-[#0eb59a] dark:hover:border-[#0eb59a]/30'
                    }`}
                  >
                    {com}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Urgency <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {urgencyOptions.map(urg => (
                  <button
                    key={urg.value}
                    onClick={() => setFormData(prev => ({ ...prev, urgency: urg.value }))}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                      formData.urgency === urg.value
                        ? 'bg-[#134e40] text-white border-[#134e40]'
                        : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#134e40]/30 hover:text-[#134e40] dark:hover:text-[#0eb59a] dark:hover:border-[#0eb59a]/30'
                    }`}
                  >
                    {urg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-50 dark:border-white/10 my-6" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Logistics</h3>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Work Location Preference <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {locationOptions.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFormData(prev => ({ ...prev, location: loc }))}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 flex items-center gap-1.5 ${
                      formData.location === loc
                        ? 'bg-[#134e40] text-white border-[#134e40]'
                        : 'bg-white dark:bg-[#1e2028] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#134e40]/30 hover:text-[#134e40] dark:hover:text-[#0eb59a] dark:hover:border-[#0eb59a]/30'
                    }`}
                  >
                    <MapPin size={11} />
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 bg-[#0eb59a] rounded-full" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">Review Your Requirement</h3>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Engagement Type',
                  icon: Briefcase,
                  content: (
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
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
                          <span key={p} className="text-xs bg-teal-50 dark:bg-[#0eb59a]/10 text-[#134e40] dark:text-[#0eb59a] font-bold px-2.5 py-1 rounded-lg border border-teal-100 dark:border-white/5">
                            {businessProblems.find(bp => bp.id === p)?.label}
                          </span>
                        ))
                        : <span className="text-sm text-gray-400 dark:text-gray-500 font-semibold">None selected</span>
                      }
                    </div>
                  )
                },
                {
                  step: 3,
                  title: 'Skills & Experience',
                  icon: Star,
                  content: (
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {formData.roleTitle || '—'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.slice(0, 6).map(s => (
                          <span key={s} className="text-xs bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold px-2.5 py-1 rounded-lg border border-gray-100 dark:border-white/5">
                            {s}
                          </span>
                        ))}
                        {formData.skills.length > 6 && (
                          <span className="text-xs bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 font-bold px-2.5 py-1 rounded-lg">
                            +{formData.skills.length - 6} more
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                        {experienceOptions.find(o => o.value === formData.experienceYears)?.label || formData.experienceYears} experience required
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
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{item.label}</p>
                          <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{item.value}</p>
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
                  className="bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-teal-50 dark:bg-white/5 rounded-xl flex items-center justify-center">
                        <section.icon size={14} className="text-[#0eb59a]" />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm">{section.title}</h4>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setCurrentStep(section.step)}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] dark:hover:text-[#0eb59a] transition-colors flex items-center gap-1 bg-transparent border-0 cursor-pointer"
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
              <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Additional Context</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{formData.businessProblemText}</p>
              </div>
            )}

            {/* Posting notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-[#0eb59a]/10 rounded-2xl border border-teal-100 dark:border-white/5"
            >
              <div className="w-8 h-8 bg-[#0eb59a] rounded-xl flex items-center justify-center shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-[#134e40] dark:text-[#0eb59a]">Ready to post</p>
                <p className="text-xs text-teal-600 dark:text-teal-500 mt-0.5 leading-relaxed">
                  Your requirement will be visible to our vetted expert network. Expect your first matches within 24-48 hours.
                </p>
              </div>
            </motion.div>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f1117]">

      {/* LEFT PANEL — Fixed branding */}
      <div className="hidden lg:flex w-[420px] min-h-screen bg-[#134e40] fixed left-0 top-0 bottom-0 flex flex-col overflow-hidden" style={{ zIndex: 20 }}>

        {/* Mesh texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top — Logo + Brand */}
        <div className="relative z-10 px-8 pt-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-base">♔</span>
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-wide whitespace-nowrap">ExigentCX</p>
              <p className="text-[#0eb59a] text-[10px] font-bold tracking-widest uppercase">Company Portal</p>
            </div>
          </div>
        </div>

        {/* Center — Heading + Subtext only, vertically centered */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8">

          {/* Teal label */}
          <p className="text-[#0eb59a] text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
            Post a Requirement
          </p>

          {/* Main headline */}
          <h1 className="text-4xl font-black text-white leading-[1.1] mb-5">
            Find the Right<br />
            <span className="text-[#0eb59a]">CXO.</span><br />
            Right Now.
          </h1>

          {/* Subtext */}
          <p className="text-white/50 text-sm leading-relaxed max-w-[280px]">
            Define your leadership requirement and get matched with vetted CXO-level experts within 24 hours.
          </p>

          {/* Decorative teal accent line */}
          <div className="mt-10 w-12 h-0.5 bg-[#0eb59a] rounded-full" />

        </div>

        {/* Bottom — Autosave + Save as Draft */}
        <div className="relative z-10 px-8 pb-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-pulse" />
            <span className="text-white/30 text-[10px]">Draft auto-saved</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSaveModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/15 text-white/60 text-sm font-bold rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 bg-transparent cursor-pointer"
          >
            <Save size={14} /> Save as Draft
          </motion.button>
        </div>

      </div>

      {/* RIGHT FORM PANEL — scrollable, offset by left panel width */}
      <div className="w-full lg:pl-[420px] min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f1117]">
        {/* TOP — Horizontal Step Indicator */}
        <div className="px-10 pt-10 pb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-8">
            <button onClick={() => navigate('/requirements')} className="hover:text-[#134e40] dark:hover:text-white transition-colors font-semibold bg-transparent border-0 cursor-pointer">
              My Requirements
            </button>
            <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
            <span className="text-gray-600 dark:text-gray-400 font-semibold">New Requirement</span>
          </div>

          {/* Horizontal step dots */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-1.5">
                    {/* Circle */}
                    <motion.div
                      animate={{
                        backgroundColor: isCompleted ? '#0eb59a' : isCurrent ? 'transparent' : 'transparent',
                        borderColor: isCompleted ? '#0eb59a' : isCurrent ? '#0eb59a' : '#d1d5db',
                      }}
                      transition={{ duration: 0.25 }}
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center dark:border-white/10"
                    >
                      {isCompleted
                        ? <Check size={14} className="text-white" strokeWidth={3} />
                        : <span className={`text-xs font-black ${isCurrent ? 'text-[#0eb59a]' : 'text-gray-400 dark:text-gray-500'}`}>{step.number}</span>
                      }
                    </motion.div>
                    {/* Label */}
                    <span className={`text-[10px] font-bold whitespace-nowrap ${isCurrent ? 'text-[#0eb59a]' : isCompleted ? 'text-[#0eb59a]' : 'text-gray-400 dark:text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>

                  {/* Connector line */}
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-white/10 mb-5 relative overflow-hidden" style={{ minWidth: 32 }}>
                      <motion.div
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 bg-[#0eb59a]"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step title + subtitle */}
          <motion.div
            key={`heading-${currentStep}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{steps[currentStep - 1].desc}</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {currentStep === 1 && 'Choose the engagement model that best fits your hiring need.'}
              {currentStep === 2 && 'Select all that apply — this helps us match you with the right CXO-level experts.'}
              {currentStep === 3 && 'Specify the skills and experience level you need in a candidate.'}
              {currentStep === 4 && 'Set your budget, timeline, and logistics preferences.'}
              {currentStep === 5 && 'Review everything before your requirement goes live to our expert network.'}
            </p>
          </motion.div>
        </div>

        {/* FORM CARD — white, centered */}
        <div className="flex-1 px-10 pb-6">
          <div className="bg-white dark:bg-[#1b1d24] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-8 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </div>

        {/* STICKY BOTTOM NAV */}
        <div className="sticky bottom-0 bg-white/90 dark:bg-[#1b1d24] backdrop-blur-sm border-t border-gray-100 dark:border-white/10 px-10 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {/* Back */}
            <motion.button
              whileHover={{ x: currentStep === 1 ? 0 : -2 }}
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 bg-transparent cursor-pointer ${
                currentStep === 1
                  ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed border-gray-100 dark:border-white/5'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#134e40] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
              }`}
            >
              <ChevronLeft size={16} /> Back
            </motion.button>

            {/* Dots + Continue */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all duration-300 ${
                    i + 1 === currentStep ? 'w-5 h-2 bg-[#134e40] dark:bg-[#0eb59a]' : i + 1 < currentStep ? 'w-2 h-2 bg-[#0eb59a]' : 'w-2 h-2 bg-gray-200 dark:bg-white/10'
                  }`} />
                ))}
              </div>

              {currentStep < totalSteps ? (
                <motion.button
                  whileHover={{ scale: canProceed() ? 1.03 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.97 : 1 }}
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-0 cursor-pointer ${
                    canProceed()
                      ? 'bg-[#134e40] text-white shadow-md shadow-[#134e40]/20 hover:bg-[#1a6b57]'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubmit('Active')}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg disabled:opacity-50 border-0 cursor-pointer"
                >
                  <Zap size={15} fill="currentColor" /> {isSubmitting ? 'Posting...' : 'Post Requirement'}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SAVE DRAFT MODAL ── */}
      <AnimatePresence>
        {showSaveModal && (
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
              className="bg-white dark:bg-[#1b1d24] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden border border-transparent dark:border-white/10"
            >
              <div className="w-14 h-14 bg-teal-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Save size={24} className="text-[#0eb59a]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white text-center mb-2">
                Save as Draft?
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-6 leading-relaxed">
                Your progress will be saved. You can continue editing this requirement anytime from My Requirements.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-2xl cursor-pointer"
                >
                  Keep Editing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSaveModal(false);
                    handleSubmit('Draft');
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 border-0 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Draft'}
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
