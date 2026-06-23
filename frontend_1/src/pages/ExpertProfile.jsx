import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Star, Clock, MapPin, DollarSign,
  Shield, Briefcase, Check, Heart, MessageSquare,
  BarChart2, ArrowLeft, Zap, Award, TrendingUp,
  Users, Calendar, Globe, Download, Share2,
  CheckCircle, X, ExternalLink, Building, Target,
  LayoutDashboard, CreditCard, FileText,
  LogOut, Settings, ShieldCheck, Menu, Bell,
  ChevronLeft, RefreshCw, Edit,
  UserPlus, UserCheck, Link2
} from 'lucide-react';

const ExpertProfile = () => {
  const navigate = useNavigate();
  const { expertId } = useParams();

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
      setCurrentUser(session.user);
      
      try {
        const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company/profile`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCompanyProfile(profileData);
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

  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cxo_following') || '[]');
      return saved.includes(String(expertId));
    } catch { return false; }
  });
  const [followBurst, setFollowBurst] = useState(false);
  const [connectStatus, setConnectStatus] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cxo_connections') || '{}');
      return saved[String(expertId)] || 'none';
    } catch { return 'none'; }
  });
  const [profileViews] = useState(() => {
    const key = `cxo_profile_views_${expertId}`;
    const current = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, String(current));
    return current;
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [selectedRequirementMatch, setSelectedRequirementMatch] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('requirementId') || '';
  });
  const [message, setMessage] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const [hoveredTier, setHoveredTier] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'match', title: 'New Expert Match', desc: 'Sarah Jenkins matches your Interim CFO requirement at 98%', time: '2 min ago', unread: true, color: 'bg-teal-500' },
    { id: 2, type: 'invite', title: 'Invite Accepted', desc: 'David Chen accepted your invitation for CFO role', time: '1 hour ago', unread: true, color: 'bg-blue-500' },
    { id: 3, type: 'milestone', title: 'Milestone Due', desc: 'Financial Model Draft milestone is due in 3 days', time: '3 hours ago', unread: false, color: 'bg-amber-500' },
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

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
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser && expert && (
    currentUser.email === expert.email || 
    currentUser.id === expert.user_id
  );

  useEffect(() => {
    const fetchRequirements = async () => {
      const isDemo = localStorage.getItem('demo_company') === 'true';
      if (isDemo) {
        setRequirements([
          { id: '1', title: 'Interim CFO' },
          { id: '2', title: 'Fractional CMO' },
          { id: '3', title: 'VP Engineering' },
          { id: '4', title: 'Advisory Board Member — Sales' },
        ]);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/company/requirements`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRequirements(data || []);
        } else {
          // Fallback to Supabase
          const { data: sbData } = await supabase
            .from('company_requirements')
            .select('id, role_title')
            .eq('company_email', session.user.email);
          if (sbData) {
            setRequirements(sbData.map(r => ({ id: r.id, title: r.role_title || 'Untitled' })));
          }
        }
      } catch (err) {
        console.error("Error fetching requirements in profile:", err);
      }
    };
    fetchRequirements();
  }, []);

  useEffect(() => {
    const fetchExpert = async () => {
      // If expertId is one of the mock IDs (1, 2, 3), use local mock data directly
      if (expertId === '1' || expertId === '2' || expertId === '3') {
        setExpert(experts[expertId]);
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Fall back to Sarah Jenkins if not logged in and not a mock ID
          setExpert(experts[1]);
          setLoading(false);
          return;
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const queryParam = selectedRequirementMatch ? `?requirementId=${selectedRequirementMatch}` : '';
        const res = await fetch(`${baseUrl}/api/company/experts/${expertId}${queryParam}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch expert');
        }

        const data = await res.json();
        setExpert(data);
      } catch (err) {
        console.error('Error fetching expert profile:', err);
        // Fallback to static experts if not found or API fails
        setExpert(experts[expertId] || experts[1]);
      } finally {
        setLoading(false);
      }
    };

    if (expertId) {
      fetchExpert();
    }
  }, [expertId, selectedRequirementMatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={40} className="text-[#0eb59a] animate-spin" />
          <p className="text-[#134e40] font-bold text-sm">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Expert profile not found.</p>
      </div>
    );
  }

  const mockExperiences = [
    {
      id: 1,
      role: 'Head of Finance / CFO',
      company: 'Meesho',
      type: 'Full-time',
      startDate: 'Jan 2019',
      endDate: 'Dec 2022',
      current: false,
      description: 'Scaled finance department from 2 to 45 members. Led Series D ($150M) and Series E ($570M) rounds. Managed 30% MoM revenue growth.',
    },
    {
      id: 2,
      role: 'Finance Director',
      company: 'OYO',
      type: 'Full-time',
      startDate: 'Mar 2016',
      endDate: 'Dec 2018',
      current: false,
      description: 'Managed global finance operations across 20 countries. Led Series E ($1B) fundraising. Implemented zero-based budgeting saving $40M annually.',
    }
  ];

  const mockEducation = [
    {
      id: 1,
      degree: 'MBA — Finance & Strategy',
      institution: 'IIM Ahmedabad',
      year: '2006',
      grade: 'Gold Medalist',
    },
    {
      id: 2,
      degree: 'Chartered Accountant (CA)',
      institution: 'Institute of Chartered Accountants of India',
      year: '2005',
      grade: 'All India Rank 12',
    }
  ];

  const displayExperiences = expert?.experiences && expert.experiences.length > 0
    ? expert.experiences
    : (expert?.name === 'David Chen' || expertId === '2' ? mockExperiences : []);

  const displayEducation = expert?.education && expert.education.length > 0
    ? expert.education
    : (expert?.name === 'David Chen' || expertId === '2' ? mockEducation : []);

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
      price: (expert.rateCard && expert.rateCard.advisory)
        ? (expert.rateCard.advisory.startsWith('₹') ? expert.rateCard.advisory : '₹' + expert.rateCard.advisory) + '/mo'
        : expert.budget.split(' - ')[0] + '/mo',
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
      price: (expert.rateCard && expert.rateCard.fractional)
        ? (expert.rateCard.fractional.startsWith('₹') ? expert.rateCard.fractional : '₹' + expert.rateCard.fractional)
        : expert.budget,
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
      price: (expert.rateCard && expert.rateCard.interim)
        ? (expert.rateCard.interim.startsWith('₹') ? expert.rateCard.interim : '₹' + expert.rateCard.interim)
        : 'Custom',
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

  const handleInviteSend = async () => {
    const isDemo = localStorage.getItem('demo_company') === 'true';
    if (isDemo) {
      setInviteSent(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSent(false);
        setSelectedRequirement('');
        setMessage('');
      }, 2000);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/company/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          expertId: expert.id,
          requirementId: selectedRequirement,
          note: message
        })
      });

      if (response.ok) {
        setInviteSent(true);
        setTimeout(() => {
          setShowInviteModal(false);
          setInviteSent(false);
          setSelectedRequirement('');
          setMessage('');
        }, 2000);
      } else {
        const errData = await response.json();
        alert(`Failed to send invite: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error sending invite:", err);
      alert("Error sending invite. Please try again.");
    }
  };

  const handleFollow = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('cxo_following') || '[]');
      const id = String(expertId);
      const updated = isFollowing
        ? saved.filter(i => i !== id)
        : [...saved, id];
      localStorage.setItem('cxo_following', JSON.stringify(updated));
      setIsFollowing(!isFollowing);
      if (!isFollowing) {
        setFollowBurst(true);
        setTimeout(() => setFollowBurst(false), 600);
      }
    } catch {}
  };

  const handleConnect = () => {
    if (connectStatus !== 'none') return;
    try {
      const saved = JSON.parse(localStorage.getItem('cxo_connections') || '{}');
      saved[String(expertId)] = 'pending';
      localStorage.setItem('cxo_connections', JSON.stringify(saved));

      // Also write a connection request for the expert to see
      const requests = JSON.parse(localStorage.getItem('cxo_connect_requests') || '[]');
      requests.push({
        id: Date.now(),
        expertId: String(expertId),
        expertName: expert.name,
        companyName: 'Acme Corp',
        time: new Date().toISOString(),
        status: 'pending',
      });
      localStorage.setItem('cxo_connect_requests', JSON.stringify(requests));
      setConnectStatus('pending');
    } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${expert.name} — ${expert.title}`,
          text: `Check out ${expert.name}'s profile on ExigentCX`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback — copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const profileData = `
ExigentCX — Expert Profile
==============================
Name: ${expert.name}
Title: ${expert.title}
Previous Role: ${expert.exRole}
Rating: ${expert.rating}/5 (${expert.reviews} reviews)
Availability: ${expert.availability}
Location: ${expert.location}
Budget: ${expert.budget}
Experience: ${expert.experience}
Industries: ${expert.industries.join(', ')}
Skills: ${expert.skills.join(', ')}
Response Time: ${expert.responseTime}
Completed Engagements: ${expert.completedEngagements}
Bio: ${expert.bio}
    `.trim();

    const blob = new Blob([profileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${expert.name.replace(' ', '_')}_ExigentCX_Profile.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117]">

      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white dark:bg-[#1b1d24] border-r border-gray-100 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
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

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const isActive = item.active || window.location.pathname === item.path || (item.path === '/experts' && window.location.pathname.startsWith('/experts'));
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBar"
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
        <div className="p-3 border-t border-gray-100/60 dark:border-white/5 space-y-1">
          {/* Theme Toggle */}
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
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white'
            }`}
          >
            {window.location.pathname === '/settings' && (
              <motion.div
                layoutId="activeNavBar"
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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 font-bold"
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

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#1b1d24] border-b border-gray-100 dark:border-white/10 px-6 py-3 flex items-center gap-4 shadow-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <button
              onClick={() => navigate('/company-dashboard')}
              className="hover:text-[#134e40] font-semibold transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight size={12} className="text-gray-300" />
            <button
              onClick={() => navigate('/experts')}
              className="hover:text-[#134e40] font-semibold transition-colors"
            >
              Experts
            </button>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-[#134e40] font-bold">{expert.name}</span>
          </div>

          {/* Right — bell + avatar */}
          <div className="flex items-center gap-3 ml-auto">
            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => navigate('/experts')}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#134e40] transition-colors px-3 py-2 rounded-xl hover:bg-gray-50"
            >
              <ChevronLeft size={14} /> Back to Experts
            </motion.button>
            {/* Notification bell with dropdown */}
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

              {/* Notification dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-11 w-80 bg-white dark:bg-[#1e2028] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-white/5">
                        <h4 className="font-black text-[#1C3627] dark:text-white text-sm">Notifications</h4>
                        <span className="text-[10px] font-bold text-[#0eb59a] cursor-pointer hover:text-[#134e40]">
                          Mark all read
                        </span>
                      </div>

                      {/* Notification items */}
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((notif, idx) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ backgroundColor: '#F9FAFB' }}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${notif.unread ? 'bg-teal-50/30' : 'bg-white'}`}
                          >
                            <div className={`w-8 h-8 ${notif.color} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                              <Bell size={13} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-[#1C3627] dark:text-white leading-none mb-1">{notif.title}</p>
                              <p className="text-[11px] text-gray-500 leading-relaxed">{notif.desc}</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">{notif.time}</p>
                            </div>
                            {notif.unread && (
                              <div className="w-2 h-2 bg-[#0eb59a] rounded-full shrink-0 mt-1.5" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-gray-50 text-center">
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">
                          View all notifications →
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => navigate('/settings')}
              className="w-9 h-9 bg-[#134e40] rounded-xl flex items-center justify-center text-white text-xs font-black hover:ring-2 hover:ring-[#0eb59a] hover:ring-offset-2 transition-all overflow-hidden"
            >
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </button>
          </div>
        </header>

        {/* ── SCROLLABLE PAGE BODY ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 pb-16">

            {/* ── HERO BANNER — rounded card, not full bleed ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${expert.coverGradient} rounded-3xl relative overflow-hidden mb-6`}
            >
              {/* Decorative orbs inside the card only */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 left-20 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative px-10 pt-10 pb-0">

                {/* Badges row — top left */}
                <div className="flex items-center gap-2 mb-5">
                  {expert.topExpert && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black bg-amber-400 text-amber-900 px-3 py-1.5 rounded-full">
                      <Star size={10} fill="currentColor" /> TOP EXPERT
                    </span>
                  )}
                  {expert.verified && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black bg-white/20 text-white px-3 py-1.5 rounded-full border border-white/30">
                      <Shield size={10} /> VERIFIED
                    </span>
                  )}
                  <span className="text-[10px] font-black bg-white text-[#134e40] px-3 py-1.5 rounded-full">
                    {expert.match}% MATCH
                  </span>
                  {/* Share + Download — moved to badge row right side */}
                  <div className="ml-auto flex items-center gap-2">
                    {isOwner && (
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'white', color: '#134e40' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/expert-profile')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 font-bold text-xs shadow-md transition-all duration-200"
                      >
                        <Edit size={12} className="shrink-0" /> Edit Profile
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.25)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                      title="Share Profile"
                      className="p-2.5 bg-white/10 text-white rounded-xl border border-white/20 transition-all duration-200"
                    >
                      <Share2 size={15} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.25)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDownload}
                      title="Download Profile"
                      className="p-2.5 bg-white/10 text-white rounded-xl border border-white/20 transition-all duration-200"
                    >
                      <Download size={15} />
                    </motion.button>
                  </div>
                </div>

                {/* Main profile row — avatar left, info right */}
                <div className="flex items-end gap-8 pb-8">

                  {/* Large avatar */}
                  <div className="relative shrink-0">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: 'spring' }}
                      src={expert.avatar}
                      alt={expert.name}
                      style={{ width: '144px', height: '144px', borderRadius: '16px', objectFit: 'cover', border: '4px solid white' }}
                      className="shadow-2xl"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-md"
                    />
                  </div>

                  {/* Name + meta — left aligned */}
                  <div className="flex-1 text-white">
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-black tracking-tight leading-none mb-2 text-left"
                    >
                      {expert.name}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-white/90 font-bold text-xl mb-1 text-left"
                    >
                      {expert.title}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/60 text-sm mb-5 text-left"
                    >
                      {expert.exRole}
                    </motion.p>

                    {/* Meta stats — pill style, not inline text */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="flex flex-wrap gap-2"
                    >
                      {[
                        { icon: Star, label: `${expert.rating} (${expert.reviews} reviews)`, fill: true },
                        { icon: Clock, label: expert.availability },
                        { icon: MapPin, label: expert.location },
                        { icon: Zap, label: `${expert.experience} exp` },
                        { icon: CheckCircle, label: `${expert.completedEngagements} engagements` },
                        { icon: Users, label: `${20 + (parseInt(expertId) || 1) * 13} followers` },
                      ].map((meta, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)', transition: { duration: 0.15 } }}
                          className="flex items-center gap-1.5 bg-white/15 border border-white/20 px-3 py-1.5 rounded-xl text-white text-xs font-semibold backdrop-blur-sm cursor-default"
                        >
                          <meta.icon
                            size={12}
                            fill={meta.fill ? 'white' : 'none'}
                            className="text-white shrink-0"
                          />
                          {meta.label}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Tabs — inside hero at bottom */}
                {/* Tabs */}
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 text-sm font-bold transition-all duration-200 relative ${
                        activeTab === tab
                          ? 'text-white'
                          : 'text-white/50 hover:text-white/90 hover:bg-white/10 rounded-xl'
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
            </motion.div>

            {/* ── TAB CONTENT + RIGHT SIDEBAR ── */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* ── LEFT — Tab panels ── */}
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
                  <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-transparent dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 text-left">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-4 flex items-center gap-2 tracking-tight">
                      <Users size={16} className="text-[#0eb59a]" /> About
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-left w-full">{expert.bio}</p>
                  </div>

                  {/* Highlights */}
                  <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-transparent dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-4 flex items-center gap-2 tracking-tight">
                      <Award size={16} className="text-[#0eb59a]" /> Key Highlights
                    </h3>
                    <div className="space-y-3">
                      {expert.highlights.map((h, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          whileHover={{ x: 6, transition: { duration: 0.15 } }}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-teal-50/50 transition-colors duration-150 cursor-default group"
                        >
                          <div className="w-6 h-6 bg-teal-50 group-hover:bg-[#0eb59a] rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-teal-100 transition-colors duration-200">
                            <Check size={12} className="text-[#0eb59a] group-hover:text-white transition-colors duration-200" strokeWidth={3} />
                          </div>
                          <p className="text-sm text-gray-700 font-semibold leading-relaxed group-hover:text-[#134e40] transition-colors duration-150">{h}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-4 flex items-center gap-2 tracking-tight">
                      <Target size={16} className="text-[#0eb59a]" /> Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills.map((skill, idx) => (
                        <motion.button
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.04 }}
                          whileHover={{ scale: 1.08, y: -2, transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.95 }}
                          className="dark:!bg-white/5 dark:!border-white/10 dark:!text-gray-300"
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#FAFBF9',
                            color: '#1C3627',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '10px',
                            border: '1px solid #E5E7EB',
                            cursor: 'pointer',
                            display: 'inline-block',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#134e40';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = '#134e40';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#FAFBF9';
                            e.currentTarget.style.color = '#1C3627';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                        >
                          {skill}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-4 flex items-center gap-2 tracking-tight">
                      <Building size={16} className="text-[#0eb59a]" /> Industry Experience
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.industries.map((industry, idx) => (
                        <motion.button
                          key={industry}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.06 }}
                          whileHover={{ scale: 1.06, y: -2, transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.95 }}
                          className="dark:!bg-white/5 dark:!border-white/10 dark:!text-gray-300"
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#FAFBF9',
                            color: '#1C3627',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '10px',
                            border: '1px solid #E5E7EB',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#134e40';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = '#134e40';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#FAFBF9';
                            e.currentTarget.style.color = '#1C3627';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                        >
                          <Globe size={11} style={{ color: 'inherit' }} />
                          {industry}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Engagement Stats Micro-widgets */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Engagements', sub: 'Completed projects', value: expert.completedEngagements, icon: Briefcase, iconBg: '#F0FDF4', iconColor: '#0eb59a', numColor: '#134e40', borderColor: '#0eb59a' },
                      { label: 'Avg Rating', sub: 'Client satisfaction', value: expert.rating, icon: Star, iconBg: '#FFFBEB', iconColor: '#F59E0B', numColor: '#D97706', borderColor: '#F59E0B' },
                      { label: 'Reviews', sub: 'Verified feedback', value: expert.reviews, icon: MessageSquare, iconBg: '#EFF6FF', iconColor: '#3B82F6', numColor: '#2563EB', borderColor: '#3B82F6' },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10"
                        style={{
                          borderRadius: '16px',
                          padding: '20px',
                          borderLeft: `4px solid ${stat.borderColor}`,
                          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                        }}
                      >
                        <div style={{ width: '36px', height: '36px', backgroundColor: stat.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }} className="dark:!bg-white/10">
                          <stat.icon size={16} style={{ color: stat.iconColor }} className="dark:!text-[#0eb59a]" />
                        </div>
                        <p style={{ fontSize: '30px', fontWeight: 900, color: stat.numColor, lineHeight: 1, marginBottom: '4px' }} className="dark:!text-white">{stat.value}</p>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginTop: '4px' }} className="dark:!text-gray-300">{stat.label}</p>
                        <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }} className="dark:!text-gray-400">{stat.sub}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Other Details */}
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-4 flex items-center gap-2 tracking-tight">
                      Other Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Languages', value: expert.languages.join(', '), icon: Globe, bg: '#F0FDF4', iconColor: '#0eb59a' },
                        { label: 'Timezone', value: expert.timezone, icon: Clock, bg: '#EFF6FF', iconColor: '#3B82F6' },
                        { label: 'Response Time', value: expert.responseTime, icon: Zap, bg: '#FFFBEB', iconColor: '#F59E0B' },
                        { label: 'Engagement Types', value: expert.engagementTypes.join(', '), icon: Briefcase, bg: '#FAF5FF', iconColor: '#A855F7' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          style={{ backgroundColor: '#FAFBF9', borderRadius: '12px', padding: '16px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                        >
                          <div style={{ width: '32px', height: '32px', backgroundColor: item.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <item.icon size={14} style={{ color: item.iconColor }} />
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label}</p>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C3627' }}>{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <motion.a
                      href={expert.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4, transition: { duration: 0.15 } }}
                      className="flex items-center gap-2 mt-4 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors duration-150 w-fit group"
                    >
                      <ExternalLink size={14} className="group-hover:rotate-12 transition-transform duration-200" />
                      View LinkedIn Profile
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-blue-400"
                      >
                        →
                      </motion.span>
                    </motion.a>
                  </div>

                  {/* Experience Timeline */}
                  {displayExperiences.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 text-left">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-6 flex items-center gap-2 tracking-tight">
                        <Briefcase size={16} className="text-[#0eb59a]" /> Professional Experience
                      </h3>
                      <div className="relative pl-6 border-l border-gray-100 dark:border-white/10 space-y-8 ml-3">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} className="relative">
                            {/* Timeline dot */}
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#0eb59a] border-2 border-white ring-4 ring-teal-50" />
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <h4 className="font-black text-gray-900 text-sm">{exp.role}</h4>
                                <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-2 py-0.5 rounded">
                                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </span>
                              </div>
                              <p className="text-xs text-[#0eb59a] font-bold mb-2">{exp.company} {exp.type ? `· ${exp.type}` : ''}</p>
                              {exp.description && (
                                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education list */}
                  {displayEducation.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 text-left">
                      <h3 className="font-black text-[#1C3627] dark:text-white text-[15px] mb-6 flex items-center gap-2 tracking-tight">
                        <Award size={16} className="text-[#0eb59a]" /> Education & Credentials
                      </h3>
                      <div className="relative pl-6 border-l border-gray-100 dark:border-white/10 space-y-8 ml-3">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} className="relative">
                            {/* Timeline dot */}
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-50" />
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <h4 className="font-black text-gray-900 text-sm">{edu.degree}</h4>
                                <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-2 py-0.5 rounded">
                                  {edu.year}
                                </span>
                              </div>
                              <p className="text-xs text-blue-500 font-bold mb-1">{edu.institution}</p>
                              {edu.grade && (
                                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100 inline-flex items-center gap-1">
                                  <Star size={10} fill="currentColor" /> {edu.grade}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-[#1e2028] rounded-3xl border border-transparent dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 cursor-default"
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
                        <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10">
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
                            className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3 border border-gray-100 dark:border-white/10 text-center"
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
                  <div className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
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
                      whileHover={{ y: -4, x: 2, transition: { duration: 0.2 } }}
                      className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 border-l-4 border-l-transparent hover:border-l-[#0eb59a] transition-all duration-200 cursor-default"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={review.avatar} className="w-11 h-11 rounded-2xl object-cover shadow-sm" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-gray-900 text-sm text-left">{review.reviewer}</h4>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-[9px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                                  <Shield size={8} /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 font-semibold text-left">{review.role}</p>
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
                      <p className="text-sm text-gray-600 leading-relaxed mb-3 text-left">"{review.review}"</p>
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
                    All engagements are governed by milestones, NDA, and escrow-backed payments through ExigentCX.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {pricingTiers.map((tier, idx) => {
                      const isHovered = hoveredTier === tier.id;
                      const isPopular = tier.popular;

                      return (
                        <motion.div
                          key={tier.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onMouseEnter={() => setHoveredTier(tier.id)}
                          onMouseLeave={() => setHoveredTier(null)}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            border: `2px solid ${isHovered ? '#0eb59a' : '#E5E7EB'}`,
                            padding: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'default',
                            boxShadow: isHovered
                              ? '0 24px 60px rgba(14,181,154,0.18)'
                              : '0 4px 20px rgba(0,0,0,0.04)',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                          }}
                        >
                          {/* Animated teal top accent line on hover */}
                          <motion.div
                            animate={{
                              scaleX: isHovered ? 1 : 0,
                              opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.25 }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '3px',
                              background: 'linear-gradient(90deg, #134e40, #0eb59a)',
                              transformOrigin: 'left',
                              borderRadius: '24px 24px 0 0',
                            }}
                          />

                          {/* MOST POPULAR badge */}
                          {isPopular && (
                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                              <motion.span
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                  fontSize: '9px',
                                  fontWeight: 900,
                                  backgroundColor: '#0eb59a',
                                  color: 'white',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  display: 'inline-block',
                                }}
                              >
                                MOST POPULAR
                              </motion.span>
                            </div>
                          )}

                          {/* Tier label */}
                          <h4 style={{ fontWeight: 900, color: '#1C3627', fontSize: '16px', marginBottom: '4px', textAlign: 'left' }}>
                            {tier.label}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600, marginBottom: '20px', textAlign: 'left' }}>
                            {tier.hours}
                          </p>

                          {/* Price */}
                          <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '24px', fontWeight: 900, color: '#1C3627', textAlign: 'left', lineHeight: 1 }}>
                              {tier.price}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'left' }}>
                              {tier.priceNote}
                            </p>
                          </div>

                          {/* Features */}
                          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {tier.features.map((feature, fIdx) => (
                              <motion.div
                                key={fIdx}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 + fIdx * 0.04 }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                              >
                                <div style={{
                                  width: '16px',
                                  height: '16px',
                                  backgroundColor: isHovered ? '#0eb59a' : '#F0FDF4',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  marginTop: '1px',
                                  border: `1px solid ${isHovered ? '#0eb59a' : '#BBF7D0'}`,
                                  transition: 'all 0.2s ease',
                                }}>
                                  <Check size={9} color={isHovered ? 'white' : '#0eb59a'} strokeWidth={3} />
                                </div>
                                <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: 600, lineHeight: 1.4, textAlign: 'left' }}>
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <motion.button
                            whileHover={{ scale: 1.04, boxShadow: isPopular ? '0 12px 30px rgba(20,78,64,0.35)' : '0 8px 20px rgba(0,0,0,0.1)' }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setShowInviteModal(true)}
                            style={{
                              width: '100%',
                              padding: '12px',
                              background: isHovered
                                ? 'linear-gradient(135deg, #134e40, #0eb59a)'
                                : 'white',
                              color: isHovered ? 'white' : '#374151',
                              border: `1.5px solid ${isHovered ? 'transparent' : '#E5E7EB'}`,
                              borderRadius: '14px',
                              fontSize: '14px',
                              fontWeight: 900,
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              boxShadow: isPopular ? '0 4px 15px rgba(20,78,64,0.2)' : 'none',
                            }}
                          >
                            {isPopular ? 'Invite for This Role' : 'Get Started'}
                          </motion.button>

                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Trust Signals — Left-aligned with hover */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {[
                      { icon: Shield, title: 'Escrow-backed', desc: 'Payments held securely until milestones approved', bg: 'bg-teal-50', iconColor: 'text-[#0eb59a]' },
                      { icon: CheckCircle, title: 'PMO governed', desc: 'Platform team monitors every engagement', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
                      { icon: TrendingUp, title: 'Risk-free start', desc: 'Cancel within 7 days if not satisfied', bg: 'bg-purple-50', iconColor: 'text-purple-500' },
                    ].map((trust, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                        className="flex items-start gap-4 p-4 bg-white dark:bg-[#1e2028] rounded-2xl border border-gray-100 dark:border-white/10 cursor-default"
                      >
                        <div className={`w-10 h-10 ${trust.bg} rounded-xl flex items-center justify-center shrink-0`}>
                          <trust.icon size={18} className={trust.iconColor} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#1C3627] dark:text-white mb-1 text-left">{trust.title}</p>
                          <p className="text-xs text-gray-500 leading-relaxed text-left">{trust.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── RIGHT SIDEBAR — Sticky CTA ── */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-6 space-y-4">

              {/* CTA Card */}
              <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '20px' }}>

                {/* Expert availability header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative">
                    <img src={expert.avatar} className="w-10 h-10 rounded-2xl object-cover" alt={expert.name} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{expert.name.split(' ')[0]} is available</p>
                    <p className="text-xs text-emerald-600 font-semibold">Responds {expert.responseTime}</p>
                  </div>
                </div>

                {/* Meta rows */}
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Availability', value: expert.availability, icon: Clock, color: '#0eb59a' },
                    { label: 'Budget', value: expert.budget, icon: DollarSign, color: '#0eb59a' },
                    { label: 'Location', value: expert.location, icon: MapPin, color: '#0eb59a' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFBF9', borderRadius: '10px', padding: '8px 12px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                        <item.icon size={12} style={{ color: item.color }} /> {item.label}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C3627' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  {isOwner ? (
                    <div style={{ backgroundColor: '#FAFBF9', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                      <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, marginBottom: '12px', lineHeight: 1.5 }}>This is your public expert profile. You can update your details at any time.</p>
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(14,181,154,0.3)' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/expert-profile')}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 900,
                          borderRadius: '14px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(14,181,154,0.15)',
                        }}
                      >
                        <Edit size={14} /> Edit Profile
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      {/* Invite to Role */}
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(20,78,64,0.4)' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setShowInviteModal(true)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #134e40, #0eb59a)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 900,
                          borderRadius: '16px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(20,78,64,0.25)',
                        }}
                      >
                        <Zap size={14} fill="currentColor" /> Invite to Role
                      </motion.button>

                      {/* Send Message */}
                      <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: '#F0FDF4', borderColor: '#0eb59a', color: '#134e40' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowMessageModal(true)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#F9FAFB',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: 900,
                          borderRadius: '16px',
                          border: '1px solid #E5E7EB',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <MessageSquare size={14} /> Send Message
                      </motion.button>

                      {/* Follow + Connect row */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {/* Follow */}
                        <motion.button
                          whileHover={{ scale: 1.04, boxShadow: isFollowing ? '0 8px 20px rgba(19,78,64,0.3)' : '0 4px 12px rgba(0,0,0,0.1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleFollow}
                          animate={followBurst ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className={`flex-1 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 relative overflow-hidden transition-all duration-300 ${
                            isFollowing
                              ? 'bg-[#134e40] text-white border border-[#134e40] shadow-md'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-teal-50 hover:text-[#134e40] hover:border-teal-300'
                          }`}
                        >
                          {isFollowing && (
                            <motion.div
                              initial={{ x: '-100%' }}
                              animate={{ x: '250%' }}
                              transition={{ duration: 0.7, ease: 'easeOut' }}
                              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                            />
                          )}
                          {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
                          {isFollowing ? 'Following' : 'Follow'}
                        </motion.button>

                        {/* Connect */}
                        <motion.button
                          whileHover={{ scale: connectStatus === 'none' ? 1.04 : 1, boxShadow: connectStatus === 'none' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none' }}
                          whileTap={{ scale: connectStatus === 'none' ? 0.95 : 1 }}
                          onClick={handleConnect}
                          className={`flex-1 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-300 ${
                            connectStatus === 'connected'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : connectStatus === 'pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                          }`}
                        >
                          {connectStatus === 'connected'
                            ? <><Check size={12} /> Connected</>
                            : connectStatus === 'pending'
                            ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={12} /></motion.div> Pending</>
                            : <><Link2 size={12} /> Connect</>
                          }
                        </motion.button>
                      </div>

                      {/* Shortlist + Compare row */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                          whileHover={{ scale: 1.04, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsShortlisted(!isShortlisted)}
                          className={`flex-1 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-200 ${
                            isShortlisted
                              ? 'bg-rose-50 text-rose-500 border border-rose-200'
                              : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-rose-50 hover:text-rose-400 hover:border-rose-200'
                          }`}
                        >
                          <motion.div animate={{ scale: isShortlisted ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                            <Heart size={12} fill={isShortlisted ? 'currentColor' : 'none'} />
                          </motion.div>
                          {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.04, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 bg-gray-50 text-gray-500 border border-gray-200 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition-all duration-200"
                        >
                          <BarChart2 size={12} /> Compare
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </div>

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

                  {/* Requirement Matchmaking Selector */}
                  <div className="mb-3">
                    <select
                      value={selectedRequirementMatch || ''}
                      onChange={(e) => setSelectedRequirementMatch(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:bg-slate-800 focus:border-[#0eb59a] transition-all cursor-pointer"
                    >
                      <option value="" className="text-gray-900">General Matchmaking</option>
                      {requirements.map((req) => (
                        <option key={req.id} value={req.id} className="text-gray-900">
                          {req.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    Based on your {requirements.find(r => String(r.id) === String(selectedRequirementMatch))?.title || 'General'} requirement — skills, industry, and budget alignment.
                  </p>
                </div>
              </motion.div>

              {/* Profile Views Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white dark:bg-[#1e2028] rounded-3xl border border-transparent dark:border-white/10 p-5 relative overflow-hidden"
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Views</p>
                  <div className="w-7 h-7 bg-teal-50 rounded-xl flex items-center justify-center">
                    <Users size={13} className="text-[#0eb59a]" />
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
                    className="text-3xl font-black text-[#134e40]"
                  >
                    {profileViews + 42}
                  </motion.span>
                  <span className="text-xs text-gray-400 font-semibold mb-1">this week</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg">
                    <TrendingUp size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600">↑ 12 from last week</span>
                  </div>
                </div>
              </motion.div>

              {/* Engagement count */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#1e2028] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-5 text-center"
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
                    <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-black text-gray-400">+{expert.completedEngagements - 8}</span>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
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
        onClick={() => setShowInviteModal(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '28px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
            padding: '0',
            maxWidth: '460px',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {!inviteSent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Modal Header — gradient */}
                <div style={{
                  background: `linear-gradient(135deg, #134e40, #0eb59a)`,
                  padding: '24px 24px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={expert.avatar}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                      />
                      <div>
                        <p style={{ color: 'white', fontWeight: 900, fontSize: '15px', lineHeight: 1 }}>{expert.name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '3px' }}>{expert.title}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>
                        {expert.match}% Match
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setShowInviteModal(false); setSelectedRequirement(''); setMessage(''); }}
                        style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  </div>
                  <h3 style={{ color: 'white', fontWeight: 900, fontSize: '20px', margin: 0 }}>
                    Invite {expert.name.split(' ')[0]} to a Role
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginTop: '4px' }}>
                    Select which requirement you'd like to invite for
                  </p>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '20px 24px' }}>

                  {/* Requirement selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                      Select Requirement
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {requirements.map((req) => (
                        <motion.button
                          key={req.id}
                          whileHover={{ x: 4, backgroundColor: selectedRequirement === req.id ? '#F0FDF4' : '#F9FAFB' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRequirement(req.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '14px',
                            border: `2px solid ${selectedRequirement === req.id ? '#0eb59a' : '#E5E7EB'}`,
                            backgroundColor: selectedRequirement === req.id ? '#F0FDF4' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'left',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: selectedRequirement === req.id ? '#134e40' : '#374151' }}>
                            <Briefcase size={13} style={{ color: selectedRequirement === req.id ? '#0eb59a' : '#9CA3AF' }} />
                            {req.title}
                          </span>
                          {selectedRequirement === req.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{ width: '20px', height: '20px', backgroundColor: '#0eb59a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Check size={11} color="white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      Personal Message <span style={{ fontWeight: 400, textTransform: 'none', color: '#D1D5DB' }}>(optional)</span>
                    </p>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={`Hi ${expert.name.split(' ')[0]}, we'd love to discuss an opportunity with you...`}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '14px',
                        fontSize: '13px',
                        color: '#374151',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#0eb59a'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setShowInviteModal(false); setSelectedRequirement(''); setMessage(''); }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: '14px',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#6B7280',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: selectedRequirement ? 1.03 : 1, boxShadow: selectedRequirement ? '0 8px 25px rgba(20,78,64,0.3)' : 'none' }}
                      whileTap={{ scale: selectedRequirement ? 0.97 : 1 }}
                      disabled={!selectedRequirement}
                      onClick={handleInviteSend}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: selectedRequirement ? 'linear-gradient(135deg, #134e40, #0eb59a)' : '#F3F4F6',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: selectedRequirement ? 'white' : '#9CA3AF',
                        cursor: selectedRequirement ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Zap size={14} fill={selectedRequirement ? 'currentColor' : 'none'} />
                      Send Invite
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '48px 32px', textAlign: 'center' }}
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
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#1C3627', marginBottom: '8px' }}>Invite Sent!</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-md p-0 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-[#1e2028] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-transparent dark:border-white/10 p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
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
