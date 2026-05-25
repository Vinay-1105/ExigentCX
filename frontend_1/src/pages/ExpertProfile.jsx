import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Star, Clock, MapPin, DollarSign,
  Shield, Briefcase, Check, Heart, MessageSquare,
  BarChart2, ArrowLeft, Zap, Award, TrendingUp,
  Users, Calendar, Globe, Download, Share2,
  CheckCircle, X, ExternalLink, Building, Target
} from 'lucide-react';

const ExpertProfile = () => {
  const navigate = useNavigate();
  const { expertId } = useParams();

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

  const [activeTab, setActiveTab] = useState('Overview');
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [message, setMessage] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const tabs = ['Overview', 'Case Experience', 'Reviews', 'Pricing'];

  // ── EXPERT DATA ──
  const experts = {
    1: {
      id: 1,
      name: 'Sarah Jenkins',
      title: 'Chief Marketing Officer',
      exRole: 'Ex-CMO at TechCorp & Razorpay',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      coverGradient: 'from-teal-600 to-emerald-500',
      rating: 4.9,
      reviews: 23,
      match: 98,
      availability: '15 hrs/wk',
      availabilityType: 'Part-time',
      location: 'Remote',
      locationFull: 'Available globally — Remote only',
      budget: '₹1.5L - ₹2.5L/mo',
      experience: '14 years',
      industries: ['SaaS', 'Fintech', 'E-commerce', 'B2B Tech'],
      skills: ['Brand Strategy', 'Growth Marketing', 'B2B Marketing', 'Product Marketing', 'GTM', 'Demand Generation', 'Content Strategy', 'Marketing Ops'],
      roles: ['CMO', 'VP Marketing', 'Growth Lead'],
      engagementTypes: ['Fractional', 'Advisory'],
      verified: true,
      topExpert: true,
      responseTime: '< 2 hours',
      completedEngagements: 12,
      bio: 'I am a growth-focused marketing leader with 14 years of experience building marketing engines at high-growth SaaS and Fintech companies. I have taken two companies from Series A to Series C, driving revenue growth from $2M to $80M ARR.',
      highlights: [
        'Led marketing at Razorpay from Series B to $7.5B valuation',
        'Built and scaled marketing teams from 0 to 45 people',
        '3x pipeline growth at TechCorp in 18 months',
        'Launched products in 6 international markets'
      ],
      linkedIn: 'https://linkedin.com/in/sarahjenkins',
      languages: ['English', 'Hindi'],
      timezone: 'IST (UTC+5:30)',
    },
    2: {
      id: 2,
      name: 'David Chen',
      title: 'Chief Financial Officer',
      exRole: 'Ex-CFO at Meesho & OYO',
      avatar: 'https://i.pravatar.cc/150?u=david',
      coverGradient: 'from-blue-600 to-indigo-500',
      rating: 5.0,
      reviews: 18,
      match: 95,
      availability: 'Full-time',
      availabilityType: 'Full-time',
      location: 'Hybrid | Delhi',
      locationFull: 'Delhi NCR — Open to hybrid or on-site',
      budget: '₹2.5L - ₹4L/mo',
      experience: '18 years',
      industries: ['E-commerce', 'Hospitality', 'BFSI', 'Logistics'],
      skills: ['Fundraising', 'M&A', 'Financial Modeling', 'Investor Relations', 'IPO Readiness', 'Treasury', 'FP&A', 'Debt Structuring'],
      roles: ['CFO', 'Finance Head', 'VP Finance'],
      engagementTypes: ['Interim', 'Fractional'],
      verified: true,
      topExpert: true,
      responseTime: '< 4 hours',
      completedEngagements: 8,
      bio: 'Serial CFO who has successfully led fundraising rounds totaling $200M+ across Meesho and OYO. I specialize in building investor-grade financial infrastructure and preparing companies for IPO.',
      highlights: [
        'Led $150M Series D fundraise at Meesho',
        'Managed $3B balance sheet at OYO',
        'Closed 4 M&A transactions worth $180M combined',
        'IPO-readiness experience with two companies'
      ],
      linkedIn: 'https://linkedin.com/in/davidchen',
      languages: ['English', 'Hindi', 'Mandarin'],
      timezone: 'IST (UTC+5:30)',
    },
    3: {
      id: 3,
      name: 'Priya Patel',
      title: 'Chief Technology Officer',
      exRole: 'Ex-VP Engineering at Flipkart',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      coverGradient: 'from-purple-600 to-violet-500',
      rating: 4.8,
      reviews: 31,
      match: 92,
      availability: '20 hrs/wk',
      availabilityType: 'Part-time',
      location: 'Remote',
      locationFull: 'Available globally — Remote only',
      budget: '₹1.8L - ₹3L/mo',
      experience: '16 years',
      industries: ['E-commerce', 'SaaS', 'Logistics', 'Fintech'],
      skills: ['Engineering Leadership', 'System Architecture', 'Team Scaling', 'Cloud Infrastructure', 'Platform Engineering', 'DevOps', 'Microservices', 'Data Engineering'],
      roles: ['CTO', 'VP Engineering', 'Head of Tech'],
      engagementTypes: ['Fractional', 'Advisory', 'Interim'],
      verified: true,
      topExpert: false,
      responseTime: '< 6 hours',
      completedEngagements: 15,
      bio: 'Engineering leader who built and scaled Flipkart\'s platform from 10M to 100M daily active users. I specialise in high-scale distributed systems, engineering culture, and technical due diligence.',
      highlights: [
        'Scaled Flipkart\'s engineering team from 80 to 600+ engineers',
        'Led platform rewrite that reduced infra costs by 40%',
        'Architected systems handling 5M transactions/day',
        'Built ML infrastructure serving 50+ models in production'
      ],
      linkedIn: 'https://linkedin.com/in/priyapatel',
      languages: ['English', 'Hindi', 'Gujarati'],
      timezone: 'IST (UTC+5:30)',
    },
  };

  const expert = experts[expertId] || experts[1];

  const caseStudies = [
    {
      id: 1,
      company: 'Series B SaaS Startup',
      industry: 'B2B SaaS',
      role: expert.roles[0],
      duration: '8 months',
      type: expert.engagementTypes[0],
      challenge: 'Company had strong product-market fit but lacked a structured go-to-market strategy. Pipeline was inconsistent and marketing ROI was unclear.',
      outcome: 'Built a demand generation engine that delivered 3x pipeline growth. Hired and structured a 12-person marketing team. Reduced CAC by 34%.',
      metrics: [
        { label: 'Pipeline Growth', value: '3x' },
        { label: 'CAC Reduction', value: '-34%' },
        { label: 'Team Built', value: '12 people' },
        { label: 'MQL Increase', value: '+180%' },
      ],
      tags: ['GTM Strategy', 'Demand Gen', 'Team Building'],
      year: '2024'
    },
    {
      id: 2,
      company: 'Fintech Scale-up',
      industry: 'Fintech',
      role: expert.roles[0],
      duration: '6 months',
      type: expert.engagementTypes[1] || expert.engagementTypes[0],
      challenge: 'Company entering a crowded market with no brand recognition. Needed to differentiate and build awareness quickly with limited budget.',
      outcome: 'Repositioned brand and launched integrated campaign across digital + events. Achieved 40% brand awareness lift in target segments. Generated $2.8M in new pipeline.',
      metrics: [
        { label: 'Brand Awareness', value: '+40%' },
        { label: 'New Pipeline', value: '$2.8M' },
        { label: 'Media Coverage', value: '45 features' },
        { label: 'Lead Quality', value: '+60%' },
      ],
      tags: ['Brand Strategy', 'B2B Marketing', 'Campaign Management'],
      year: '2023'
    },
    {
      id: 3,
      company: 'Enterprise Software Company',
      industry: 'Enterprise SaaS',
      role: 'Advisory Board Member',
      duration: '12 months',
      type: 'Advisory',
      challenge: 'Stagnant growth in the enterprise segment. Sales and marketing were misaligned and losing deals to competitors.',
      outcome: 'Introduced ABM strategy and aligned sales-marketing motions. Win rate improved from 18% to 31%. Three key enterprise logos closed within 6 months.',
      metrics: [
        { label: 'Win Rate', value: '18% → 31%' },
        { label: 'Enterprise Logos', value: '3 new' },
        { label: 'Deal Cycle', value: '-22 days' },
        { label: 'NRR Lift', value: '+15%' },
      ],
      tags: ['ABM', 'Sales Alignment', 'Enterprise GTM'],
      year: '2023'
    },
  ];

  const reviews = [
    {
      id: 1,
      reviewer: 'Arjun Mehta',
      role: 'CEO, Series B Startup',
      avatar: 'https://i.pravatar.cc/150?u=arjun',
      rating: 5,
      date: 'March 2025',
      engagement: expert.engagementTypes[0],
      review: `Working with ${expert.name.split(' ')[0]} was a transformational experience for our company. Within 3 months, we had a clearly defined GTM strategy, a structured marketing team, and measurable pipeline metrics. The depth of expertise and hands-on involvement exceeded every expectation.`,
      verified: true,
    },
    {
      id: 2,
      reviewer: 'Nisha Kapoor',
      role: 'COO, Fintech Startup',
      avatar: 'https://i.pravatar.cc/150?u=nisha',
      rating: 5,
      date: 'January 2025',
      engagement: 'Advisory',
      review: `Exceptional strategic thinking combined with genuine operational execution ability. ${expert.name.split(' ')[0]} didn't just advise — they rolled up their sleeves and made things happen. Our team's capability improved significantly.`,
      verified: true,
    },
    {
      id: 3,
      reviewer: 'Rohan Desai',
      role: 'Founder, D2C Brand',
      avatar: 'https://i.pravatar.cc/150?u=rohan',
      rating: 4,
      date: 'October 2024',
      engagement: expert.engagementTypes[0],
      review: `Strong domain expertise and excellent communication throughout the engagement. Delivered on all commitments and helped us build a team that can sustain the momentum. Would definitely engage again.`,
      verified: true,
    },
  ];

  const pricingTiers = [
    {
      id: 'advisory',
      label: 'Advisory',
      hours: '8 hrs/mo',
      price: expert.budget.split(' - ')[0] + '/mo',
      priceNote: 'Billed monthly',
      features: [
        '2 strategy sessions/month',
        'Email & WhatsApp support',
        'Review of key decisions',
        'Introductions to network',
        'Monthly progress review'
      ],
      popular: false,
      color: 'border-gray-200',
      btnColor: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    },
    {
      id: 'fractional',
      label: 'Fractional',
      hours: '15-20 hrs/wk',
      price: expert.budget,
      priceNote: 'Billed monthly via escrow',
      features: [
        'Weekly strategy & execution sessions',
        'Direct team collaboration',
        'Full access via Slack/WhatsApp',
        'Monthly board reporting',
        'Hiring & team building support',
        'Milestone-based delivery',
        'PMO governance included'
      ],
      popular: true,
      color: 'border-[#0eb59a]',
      btnColor: 'bg-[#134e40] text-white hover:bg-[#0eb59a]',
    },
    {
      id: 'interim',
      label: 'Interim / Full-time',
      hours: '40 hrs/wk',
      price: 'Custom',
      priceNote: 'Negotiated based on scope',
      features: [
        'Full-time dedicated engagement',
        'P&L / function ownership',
        'Team leadership & management',
        'Board & investor interaction',
        'Full milestone accountability',
        'NDA + contract via platform',
        'Escrow-backed payments'
      ],
      popular: false,
      color: 'border-gray-200',
      btnColor: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    },
  ];

  const requirements = [
    { id: 1, title: 'Interim CFO' },
    { id: 2, title: 'Fractional CMO' },
    { id: 3, title: 'VP Engineering' },
    { id: 4, title: 'Advisory Board Member — Sales' },
  ];

  const handleInviteSend = () => {
    setInviteSent(true);
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteSent(false);
      setSelectedRequirement('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── HERO SECTION ── */}
      <div className={`bg-gradient-to-br ${expert.coverGradient} relative overflow-hidden`}>
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-0">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/70 text-sm mb-6"
          >
            <button
              onClick={() => navigate('/company-dashboard')}
              className="hover:text-white transition-colors font-semibold"
            >
              Dashboard
            </button>
            <ChevronRight size={14} />
            <button
              onClick={() => navigate('/experts')}
              className="hover:text-white transition-colors font-semibold"
            >
              Experts
            </button>
            <ChevronRight size={14} />
            <span className="text-white font-bold">{expert.name}</span>
          </motion.div>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
            onClick={() => navigate('/experts')}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Experts
          </motion.button>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-end gap-6 pb-6"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring' }}
                className="relative"
              >
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-2xl"
                />
                {/* Online indicator */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-md"
                />
              </motion.div>
            </div>

            {/* Name + Meta */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {expert.topExpert && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1 text-[10px] font-black bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full"
                  >
                    <Star size={9} fill="currentColor" /> TOP EXPERT
                  </motion.span>
                )}
                {expert.verified && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-1 text-[10px] font-black bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/30"
                  >
                    <Shield size={9} /> VERIFIED
                  </motion.span>
                )}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] font-black bg-white text-[#134e40] px-2.5 py-1 rounded-full"
                >
                  {expert.match}% MATCH
                </motion.span>
              </div>

              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-black tracking-tight mb-1"
              >
                {expert.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white/80 font-bold text-lg mb-1"
              >
                {expert.title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm"
              >
                {expert.exRole}
              </motion.p>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Star size={14} fill="white" className="text-white" />
                  <span className="font-black text-white">{expert.rating}</span>
                  ({expert.reviews} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />{expert.availability}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />{expert.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={14} />{expert.experience} exp
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} />{expert.completedEngagements} engagements
                </span>
              </motion.div>
            </div>

            {/* Right — Share + Download */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all"
              >
                <Share2 size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all"
              >
                <Download size={16} />
              </motion.button>
            </div>
          </motion.div>

          {/* ── TABS ── */}
          <div className="flex gap-1 mt-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ y: -1 }}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-bold transition-all relative ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT CONTENT — Tab panels ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ── TAB 1: OVERVIEW ── */}
              {activeTab === 'Overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Bio */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
                      <Users size={16} className="text-[#0eb59a]" /> About
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{expert.bio}</p>
                  </div>

                  {/* Highlights */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                      <Award size={16} className="text-[#0eb59a]" /> Key Highlights
                    </h3>
                    <div className="space-y-3">
                      {expert.highlights.map((h, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-6 h-6 bg-teal-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-teal-100">
                            <Check size={12} className="text-[#0eb59a]" strokeWidth={3} />
                          </div>
                          <p className="text-sm text-gray-700 font-semibold leading-relaxed">{h}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                      <Target size={16} className="text-[#0eb59a]" /> Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.map((skill, idx) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.04 }}
                          whileHover={{ scale: 1.05 }}
                          className="px-3.5 py-2 bg-teal-50 text-[#134e40] text-xs font-bold rounded-xl border border-teal-100"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                      <Building size={16} className="text-[#0eb59a]" /> Industry Experience
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.industries.map((industry, idx) => (
                        <motion.span
                          key={industry}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.06 }}
                          className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl border border-gray-100 flex items-center gap-2"
                        >
                          <Globe size={11} className="text-[#0eb59a]" />
                          {industry}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Engagements', value: expert.completedEngagements, icon: Briefcase, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]' },
                      { label: 'Avg Rating', value: expert.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-400' },
                      { label: 'Reviews', value: expert.reviews, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-400' },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -4 }}
                        className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${stat.border} shadow-sm`}
                      >
                        <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                          <stat.icon size={17} className={stat.color} />
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 font-bold mt-1">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-4">Other Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Languages', value: expert.languages.join(', '), icon: Globe },
                        { label: 'Timezone', value: expert.timezone, icon: Clock },
                        { label: 'Response Time', value: expert.responseTime, icon: Zap },
                        { label: 'Engagement Types', value: expert.engagementTypes.join(', '), icon: Briefcase },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                            <item.icon size={14} className="text-[#0eb59a]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-gray-700 mt-0.5">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a
                      href={expert.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink size={14} /> View LinkedIn Profile
                    </a>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 2: CASE EXPERIENCE ── */}
              {activeTab === 'Case Experience' && (
                <motion.div
                  key="cases"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-lg">
                      {caseStudies.length} Case Studies
                    </h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      Company names anonymised
                    </span>
                  </div>

                  {caseStudies.map((cs, idx) => (
                    <motion.div
                      key={cs.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-[#134e40] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                              {cs.type}
                            </span>
                            <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                              {cs.industry}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-400">{cs.year}</span>
                          </div>
                          <h4 className="font-black text-gray-900 text-base">{cs.company}</h4>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">
                            {cs.role} · {cs.duration}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                          <Building size={18} className="text-gray-400" />
                        </div>
                      </div>

                      {/* Challenge + Outcome */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                          <p className="text-[10px] font-black text-red-600 uppercase tracking-wider mb-2">Challenge</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{cs.challenge}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-2">Outcome</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{cs.outcome}</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {cs.metrics.map((metric, mIdx) => (
                          <motion.div
                            key={mIdx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 + mIdx * 0.05 }}
                            className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center"
                          >
                            <p className="text-lg font-black text-[#134e40]">{metric.value}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-tight">{metric.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {cs.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold bg-teal-50 text-[#134e40] px-2.5 py-1 rounded-lg border border-teal-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ── TAB 3: REVIEWS ── */}
              {activeTab === 'Reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Rating Summary */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center shrink-0">
                        <p className="text-6xl font-black text-gray-900">{expert.rating}</p>
                        <div className="flex gap-0.5 justify-center my-2">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              size={18}
                              fill={s <= Math.floor(expert.rating) ? '#F59E0B' : '#E5E7EB'}
                              className={s <= Math.floor(expert.rating) ? 'text-amber-400' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-400 font-semibold">{expert.reviews} reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = star === 5 ? 18 : star === 4 ? 4 : star === 3 ? 1 : 0;
                          const pct = Math.round((count / expert.reviews) * 100);
                          return (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-xs font-bold text-gray-500 w-4">{star}</span>
                              <Star size={12} fill="#F59E0B" className="text-amber-400 shrink-0" />
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                                  className="h-full bg-amber-400 rounded-full"
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-400 w-8">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Review Cards */}
                  {reviews.map((review, idx) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={review.avatar} className="w-11 h-11 rounded-2xl object-cover shadow-sm" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-gray-900 text-sm">{review.reviewer}</h4>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-[9px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                                  <Shield size={8} /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 font-semibold">{review.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-0.5 justify-end mb-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={13} fill={s <= review.rating ? '#F59E0B' : '#E5E7EB'}
                                className={s <= review.rating ? 'text-amber-400' : 'text-gray-200'} />
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-400 font-semibold">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">"{review.review}"</p>
                      <span className="text-[10px] font-bold text-[#134e40] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                        {review.engagement} Engagement
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ── TAB 4: PRICING ── */}
              {activeTab === 'Pricing' && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <p className="text-sm text-gray-400 font-semibold">
                    All engagements are governed by milestones, NDA, and escrow-backed payments through CXO Connect.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {pricingTiers.map((tier, idx) => (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`bg-white rounded-3xl border-2 ${tier.color} shadow-sm p-6 relative overflow-hidden ${tier.popular ? 'shadow-lg shadow-teal-100' : ''}`}
                      >
                        {tier.popular && (
                          <div className="absolute top-4 right-4">
                            <motion.span
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-[10px] font-black bg-[#0eb59a] text-white px-2.5 py-1 rounded-full"
                            >
                              MOST POPULAR
                            </motion.span>
                          </div>
                        )}

                        <h4 className="font-black text-gray-900 text-base mb-1">{tier.label}</h4>
                        <p className="text-xs text-gray-400 font-semibold mb-4">{tier.hours}</p>

                        <div className="mb-5">
                          <p className="text-2xl font-black text-gray-900">{tier.price}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{tier.priceNote}</p>
                        </div>

                        <div className="space-y-2.5 mb-6">
                          {tier.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 bg-teal-50 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-teal-100">
                                <Check size={9} className="text-[#0eb59a]" strokeWidth={3} />
                              </div>
                              <span className="text-xs text-gray-600 font-semibold leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowInviteModal(true)}
                          className={`w-full py-3 rounded-2xl text-sm font-black transition-all shadow-sm ${tier.btnColor}`}
                        >
                          {tier.popular ? 'Invite for This Role' : 'Get Started'}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Trust signals */}
                  <div className="bg-teal-50 rounded-3xl border border-teal-100 p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: Shield, title: 'Escrow-backed', desc: 'Payments held securely until milestones approved' },
                        { icon: CheckCircle, title: 'PMO governed', desc: 'Platform team monitors every engagement' },
                        { icon: TrendingUp, title: 'Risk-free start', desc: 'Cancel within 7 days if not satisfied' },
                      ].map((trust, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-teal-100">
                            <trust.icon size={18} className="text-[#0eb59a]" />
                          </div>
                          <p className="text-sm font-black text-[#134e40] mb-1">{trust.title}</p>
                          <p className="text-xs text-teal-700 leading-relaxed">{trust.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── RIGHT SIDEBAR — Sticky CTA ── */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-6 space-y-4">

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative">
                    <img src={expert.avatar} className="w-10 h-10 rounded-2xl object-cover" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{expert.name.split(' ')[0]} is available</p>
                    <p className="text-xs text-emerald-600 font-semibold">Responds {expert.responseTime}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  {[
                    { label: 'Availability', value: expert.availability, icon: Clock },
                    { label: 'Budget', value: expert.budget, icon: DollarSign },
                    { label: 'Location', value: expert.location, icon: MapPin },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-400 font-semibold">
                        <item.icon size={12} className="text-[#0eb59a]" /> {item.label}
                      </span>
                      <span className="font-bold text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowInviteModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-md"
                  >
                    <Zap size={14} className="inline mr-1.5" fill="currentColor" />
                    Invite to Role
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowMessageModal(true)}
                    className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-black rounded-2xl hover:bg-gray-100 transition-all"
                  >
                    <MessageSquare size={14} className="inline mr-1.5" />
                    Send Message
                  </motion.button>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsShortlisted(!isShortlisted)}
                      className={`flex-1 py-2.5 rounded-2xl text-sm font-black border transition-all flex items-center justify-center gap-1.5 ${
                        isShortlisted
                          ? 'bg-red-50 text-red-500 border-red-100'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-400'
                      }`}
                    >
                      <Heart size={14} fill={isShortlisted ? 'currentColor' : 'none'} />
                      {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2.5 rounded-2xl text-sm font-black bg-gray-50 text-gray-500 border border-gray-200 hover:bg-blue-50 hover:text-blue-500 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BarChart2 size={14} /> Compare
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Match Score Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-[#0d1f2d] to-[#134e40] rounded-3xl p-5 text-white relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                    AI Match Score
                  </p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-5xl font-black">{expert.match}%</span>
                    <span className="text-white/60 text-sm font-semibold mb-1">match</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${expert.match}%` }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-[#0eb59a] rounded-full"
                    />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Based on your Interim CFO requirement — skills, industry, and budget alignment.
                  </p>
                </div>
              </motion.div>

              {/* Engagement count */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-center"
              >
                <p className="text-4xl font-black text-gray-900 mb-1">{expert.completedEngagements}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed Engagements</p>
                <div className="flex justify-center gap-1 mt-3">
                  {Array(Math.min(expert.completedEngagements, 8)).fill(0).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="w-6 h-6 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center"
                    >
                      <CheckCircle size={12} className="text-[#0eb59a]" />
                    </motion.div>
                  ))}
                  {expert.completedEngagements > 8 && (
                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <span className="text-[9px] font-black text-gray-400">+{expert.completedEngagements - 8}</span>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* ── INVITE MODAL ── */}
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
                    {/* Expert mini card */}
                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100 mb-6">
                      <img src={expert.avatar} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">{expert.name}</h4>
                        <p className="text-xs text-gray-500">{expert.title}</p>
                      </div>
                      <span className="ml-auto text-xs font-black text-[#134e40] bg-white px-2.5 py-1 rounded-xl border border-teal-100">
                        {expert.match}% Match
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      Invite {expert.name.split(' ')[0]}
                    </h3>
                    <p className="text-sm text-gray-400 mb-5">Select which requirement to invite for.</p>

                    <div className="space-y-2 mb-5">
                      {requirements.map((req) => (
                        <motion.button
                          key={req.id}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRequirement(req.id)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
                            selectedRequirement === req.id
                              ? 'border-[#0eb59a] bg-teal-50 text-[#134e40]'
                              : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Briefcase size={14} />{req.title}
                          </span>
                          {selectedRequirement === req.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="w-5 h-5 bg-[#0eb59a] rounded-full flex items-center justify-center"
                            >
                              <Check size={11} className="text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                        Personal Message <span className="text-gray-400 font-normal normal-case">(optional)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder={`Hi ${expert.name.split(' ')[0]}, we'd love to discuss an opportunity with you...`}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 resize-none transition-all"
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowInviteModal(false); setSelectedRequirement(''); setMessage(''); }}
                        className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: selectedRequirement ? 1.02 : 1 }}
                        whileTap={{ scale: selectedRequirement ? 0.98 : 1 }}
                        disabled={!selectedRequirement}
                        onClick={handleInviteSend}
                        className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                          selectedRequirement
                            ? 'bg-[#134e40] hover:bg-[#0eb59a] text-white shadow-lg'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Send Invite
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
                    <h3 className="text-xl font-black text-gray-900 mb-2">Invite Sent!</h3>
                    <p className="text-sm text-gray-400">
                      {expert.name.split(' ')[0]} will receive your invitation and respond within {expert.responseTime}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MESSAGE MODAL ── */}
      <AnimatePresence>
        {showMessageModal && (
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
                <div className="flex items-center gap-3">
                  <img src={expert.avatar} className="w-10 h-10 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-black text-gray-900 text-base">Message {expert.name.split(' ')[0]}</h3>
                    <p className="text-xs text-emerald-500 font-semibold">Usually responds {expert.responseTime}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowMessageModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`Hi ${expert.name.split(' ')[0]}, I wanted to reach out about...`}
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 resize-none transition-all mb-4"
              />

              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: message.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: message.trim() ? 0.98 : 1 }}
                  disabled={!message.trim()}
                  onClick={() => setShowMessageModal(false)}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                    message.trim()
                      ? 'bg-[#134e40] hover:bg-[#0eb59a] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <MessageSquare size={14} className="inline mr-1.5" />
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertProfile;
