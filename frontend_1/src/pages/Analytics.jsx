import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ChevronRight, BarChart2, Users, Briefcase, CreditCard,
  FileText, CheckCircle, Clock, Bell, Settings, ChevronLeft,
  LayoutDashboard, Target, Zap, Star, Lock, Unlock,
  DollarSign, Activity, Download, Eye, Award, Layers,
  TrendingUp, TrendingDown, AlertTriangle, Shield,
  Clipboard, AlertCircle, CheckSquare, XCircle,
  BarChart, PieChart, Flag, BookOpen, LogOut, MessageSquare, Calendar, ShieldCheck,
  Menu
} from 'lucide-react';


// ── ANIMATED COUNTER ──
const AnimatedNumber = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const inc = num / (1200 / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  const fmt = typeof display === 'number'
    ? (display % 1 === 0 ? Math.round(display) : display.toFixed(1))
    : display;
  return <span ref={ref}>{fmt}{suffix}</span>;
};

// ── SPARKLINE ──
const Sparkline = ({ data, color = '#0eb59a', width = 64, height = 28 }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 6) - 3}`
  ).join(' ');
  const lastPt = pts.split(' ').pop().split(',');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sg${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }} />
      <motion.circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }} />
    </svg>
  );
};

// ── DONUT ──
const DonutChart = ({ segments, size = 100, strokeWidth = 12 }) => {
  const r = (size - strokeWidth) / 2, circ = 2 * Math.PI * r, center = size / 2;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="overflow-visible">
      <circle cx={center} cy={center} r={r} fill="none" stroke="#F1F5F2" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circ, gap = circ - dash;
        const el = (
          <motion.circle key={i} cx={center} cy={center} r={r} fill="none"
            stroke={seg.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-(offset * circ / 100)}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            whileHover={{ strokeWidth: strokeWidth + 3, filter: 'brightness(1.05)', scale: 1.03 }}
            style={{ originX: `${center}px`, originY: `${center}px`, cursor: 'pointer' }}
            transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }} />
        );
        offset += seg.value;
        return el;
      })}
    </svg>
  );
};

// ── PROGRESS BAR ──
const ProgressBar = ({ value, color = '#0eb59a', delay = 0, thick = false }) => (
  <div className={`w-full ${thick ? 'h-3' : 'h-2'} bg-gray-100 rounded-full overflow-hidden relative shadow-inner my-2.5`}>
    <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }}
      whileHover={{ filter: 'brightness(1.1)' }}
      transition={{ duration: 1, delay, ease: 'easeOut' }}
      style={{ height: '100%', backgroundColor: color, borderRadius: '999px', cursor: 'pointer' }} />
  </div>
);

// ── RISK BADGE ──
const RiskBadge = ({ level }) => {
  const map = {
    High: 'text-red-700 bg-red-50 border-red-200',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    Low: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  };
  return <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${map[level]}`}>{level}</span>;
};

// ── STATUS BADGE ──
const StatusBadge = ({ status }) => {
  const ok = ['Released', 'Active', 'Completed', 'On Track', 'Compliant', 'Paid'];
  const warn = ['In Progress', 'In Escrow', 'Shortlisted', 'At Risk', 'Review Needed', 'Pending'];
  const cls = ok.includes(status)
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : warn.includes(status)
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-gray-500 bg-gray-50 border-gray-200';
  return <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${cls}`}>{status}</span>;
};

// ── SECTION HEADING ──
const SectionHeading = ({ icon: Icon, label, iconBg = 'bg-teal-50', iconColor = 'text-[#0eb59a]' }) => (
  <h3 className="font-black text-[#1C3627] dark:text-white text-sm flex items-center gap-2 text-left">
    <div className={`w-6 h-6 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
      <Icon size={13} className={iconColor} />
    </div>
    {label}
  </h3>
);

// ── REUSABLE CARD WRAPPER ──
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#1e2028] rounded-2xl relative overflow-hidden ${className}`} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

    {children}
  </div>
);

// ── KPI STRIP (reused in multiple tabs) ──
const KpiStrip = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {items.map((s, idx) => (
      <motion.div key={idx}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.06 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`bg-white dark:bg-[#1e2028] rounded-2xl p-5 border-l-4 ${s.border} cursor-default relative overflow-hidden`}
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

        {s.icon && (
          <div className={`w-8 h-8 ${s.bg || 'bg-gray-50'} rounded-xl flex items-center justify-center mb-3 relative z-10`}>
            <s.icon size={15} className={s.iconColor || 'text-gray-400'} />
          </div>
        )}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 relative z-10 dark:text-gray-500">{s.label}</p>
        <p className={`${s.large ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black ${s.numColor} mb-1 relative z-10`}>{s.value}</p>
        {s.sub && <p className="text-[10px] text-gray-400 relative z-10 dark:text-gray-500">{s.sub}</p>}
        {s.progress !== undefined && (
          <div className="mt-3 relative z-10">
            <ProgressBar value={s.progress} color={s.progressColor || '#0eb59a'} delay={0.3 + idx * 0.1} />
          </div>
        )}
      </motion.div>
    ))}
  </div>
);

const Analytics = () => {
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';

    const check = async () => {
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
    check();
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => {
      if (!s && !isDemo) navigate('/signin?role=company');
    });
    return () => l?.subscription?.unsubscribe();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('Overview');
  const [activePeriod, setActivePeriod] = useState('3M');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showPastExperts, setShowPastExperts] = useState(false);

  const tabs = [
    'Overview', 'Engagements',
    'Spend Reports', 'Success Metrics',
    'ROI Tracking', 'Risk Analysis', 'PMO Oversight',
  ];
  const periods = ['1M', '3M', '6M', '1Y'];

  // ── SIDEBAR — PMO Services REMOVED ──
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics', active: true },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];

  const appNotifs = [
    { id: 1, title: 'Risk Alert: Budget Overrun', desc: 'Series B engagement is 12% over budget', time: '5 min ago', unread: true, color: 'bg-red-500' },
    { id: 2, title: 'Milestone Overdue', desc: 'Investor Deck milestone is 3 days overdue', time: '2 hours ago', unread: true, color: 'bg-amber-500' },
    { id: 3, title: 'PMO Report Ready', desc: 'Q1 2025 governance report is available', time: '1 day ago', unread: false, color: 'bg-teal-500' },
  ];
  const unreadCount = appNotifs.filter(n => n.unread).length;

  // ── DATA ──
  const kpis = [
    { label: 'Active Engagements', value: '2', sub: '+1 from last month', icon: Briefcase, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', numColor: 'text-[#134e40]', border: 'border-l-[#0eb59a]', spark: [1, 1, 2, 2, 2], sparkColor: '#0eb59a', trend: 'up' },
    { label: 'Experts Hired', value: '5', sub: '+2 this quarter', icon: Users, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', numColor: 'text-[#0eb59a]', border: 'border-l-[#0eb59a]', spark: [2, 3, 3, 4, 5], sparkColor: '#0eb59a', trend: 'up' },
    { label: 'Total Spent', value: '₹11.5L', sub: '₹27L committed', icon: DollarSign, iconBg: 'bg-[#134e40]/10', iconColor: 'text-[#134e40]', numColor: 'text-[#134e40]', border: 'border-l-[#134e40]', spark: [2, 4, 6, 9, 11.5], sparkColor: '#134e40', trend: 'up' },
    { label: 'Milestones Done', value: '4/8', sub: '50% completion', icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', numColor: 'text-emerald-700', border: 'border-l-emerald-400', spark: [1, 1, 2, 3, 4], sparkColor: '#10b981', trend: 'up' },
    { label: 'Expert Rating', value: '4.9★', sub: 'Across all engagements', icon: Star, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', numColor: 'text-amber-700', border: 'border-l-amber-400', spark: [4.5, 4.7, 4.8, 4.9, 4.9], sparkColor: '#F59E0B', trend: 'stable' },
    { label: 'Open Requirements', value: '3', sub: '1 pending review', icon: FileText, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', numColor: 'text-rose-700', border: 'border-l-rose-400', spark: [2, 3, 3, 4, 3], sparkColor: '#F43F5E', trend: 'stable' },
  ];

  const engagementChartData = [
    { month: 'Jan', value: 0 }, { month: 'Feb', value: 1 },
    { month: 'Mar', value: 1 }, { month: 'Apr', value: 2 },
    { month: 'May', value: 2 }, { month: 'Jun', value: 2 },
  ];
  const maxEng = 3;

  const paymentBreakdown = [
    { label: 'Released', value: 43, color: '#10b981' },
    { label: 'In Escrow', value: 22, color: '#f59e0b' },
    { label: 'Committed', value: 35, color: '#134e40' },
  ];

  const requirementsFunnel = [
    { stage: 'Posted', value: 6, color: '#134e40' },
    { stage: 'Shortlisted', value: 4, color: '#0eb59a' },
    { stage: 'Interviewed', value: 3, color: '#3B82F6' },
    { stage: 'Engaged', value: 2, color: '#8B5CF6' },
    { stage: 'Completed', value: 1, color: '#F59E0B' },
  ];

  const expertsByRole = [
    { role: 'Interim CFO', count: 1, color: '#0eb59a' },
    { role: 'Fractional CMO', count: 1, color: '#3B82F6' },
    { role: 'VP Engineering', count: 1, color: '#8B5CF6' },
    { role: 'Advisory COO', count: 1, color: '#F59E0B' },
    { role: 'Fractional CTO', count: 1, color: '#EF4444' },
  ];

  const engagementsList = [
    { title: 'Series B Funding Strategy', expert: 'David Chen', role: 'Interim CFO', progress: 65, status: 'In Progress', spend: '₹9L', budget: '₹18L', rating: 5.0, milestones: '3/5', color: '#0eb59a', avatar: 'https://i.pravatar.cc/150?u=david' },
    { title: 'Go-to-Market Expansion', expert: 'Sarah Jenkins', role: 'Fractional CMO', progress: 75, status: 'In Progress', spend: '₹5.5L', budget: '₹9L', rating: 4.9, milestones: '2/3', color: '#3B82F6', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { title: 'Tech Infrastructure Scale', expert: 'Priya Patel', role: 'VP Engineering', progress: 0, status: 'Under Review', spend: '₹0', budget: '₹7.2L', rating: null, milestones: '0/4', color: '#8B5CF6', avatar: 'https://i.pravatar.cc/150?u=priya' },
  ];

  const expertsList = [
    { name: 'David Chen', role: 'Interim CFO', avatar: 'https://i.pravatar.cc/150?u=david', rating: 5.0, spend: '₹9L', status: 'Active', match: 95 },
    { name: 'Sarah Jenkins', role: 'Fractional CMO', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 4.9, spend: '₹5.5L', status: 'Active', match: 98 },
    { name: 'Priya Patel', role: 'VP Engineering', avatar: 'https://i.pravatar.cc/150?u=priya', rating: 4.8, spend: '₹0', status: 'Shortlisted', match: 92 },
    { name: 'Marcus Johnson', role: 'Interim COO', avatar: 'https://i.pravatar.cc/150?u=marcus', rating: 4.7, spend: '₹4.5L', status: 'Completed', match: 88 },
  ];

  // ── EXPERT TAB DERIVED VALUES (computed at component scope to avoid IIFE in JSX) ──
  const activeExperts = expertsList.filter(e => e.status === 'Active');
  const pastExperts = expertsList.filter(e => e.status !== 'Active');
  const expertsAvgMatch = Math.round(expertsList.reduce((sum, e) => sum + e.match, 0) / expertsList.length);
  const expertsAvgRating = (expertsList.reduce((sum, e) => sum + e.rating, 0) / expertsList.length).toFixed(1);

  const requirementsList = [
    { title: 'Interim CFO — Series B', type: 'Interim', status: 'Active', experts: 12, shortlisted: 3, engaged: 1, posted: 'Feb 1, 2025', budget: '₹3L/mo' },
    { title: 'Fractional CMO', type: 'Fractional', status: 'Active', experts: 8, shortlisted: 2, engaged: 1, posted: 'Feb 25, 2025', budget: '₹2.5L/mo' },
    { title: 'VP Engineering', type: 'Fractional', status: 'Under Review', experts: 5, shortlisted: 1, engaged: 0, posted: 'Apr 20, 2025', budget: '₹1.8L/mo' },
    { title: 'Advisory Board — Sales', type: 'Advisory', status: 'Draft', experts: 0, shortlisted: 0, engaged: 0, posted: 'Draft', budget: '₹80K/mo' },
  ];

  const paymentsList = [
    { milestone: 'Discovery & Assessment', engagement: 'Series B', amount: '₹1,50,000', date: 'Feb 25, 2025', status: 'Released' },
    { milestone: 'Financial Model Dev', engagement: 'Series B', amount: '₹2,00,000', date: 'Mar 28, 2025', status: 'Released' },
    { milestone: 'Campaign Strategy', engagement: 'GTM Expansion', amount: '₹1,50,000', date: 'Apr 1, 2025', status: 'Released' },
    { milestone: 'Investor Deck', engagement: 'Series B', amount: '₹2,50,000', date: '—', status: 'In Escrow' },
    { milestone: 'Campaign Launch', engagement: 'GTM Expansion', amount: '₹3,50,000', date: '—', status: 'Locked' },
  ];

  // ── SPEND REPORTS ──
  const spendByCategory = [
    { category: 'CFO / Finance', amount: 9.0, budget: 18.0, color: '#0eb59a', pct: 50 },
    { category: 'CMO / Marketing', amount: 5.5, budget: 9.0, color: '#3B82F6', pct: 61 },
    { category: 'COO / Operations', amount: 4.5, budget: 4.5, color: '#8B5CF6', pct: 100 },
    { category: 'CTO / Engineering', amount: 0, budget: 7.2, color: '#F59E0B', pct: 0 },
  ];
  const monthlySpend = [
    { month: 'Jan', amount: 0 }, { month: 'Feb', amount: 350 },
    { month: 'Mar', amount: 200 }, { month: 'Apr', amount: 400 },
    { month: 'May', amount: 200 }, { month: 'Jun', amount: 0 },
  ];
  const maxMonthly = 500;
  const invoiceSummary = [
    { id: 'INV-001', desc: 'Discovery & Assessment', expert: 'David Chen', amount: '₹1,50,000', date: 'Feb 25', status: 'Paid' },
    { id: 'INV-002', desc: 'Financial Model Development', expert: 'David Chen', amount: '₹2,00,000', date: 'Mar 28', status: 'Paid' },
    { id: 'INV-003', desc: 'Campaign Strategy Launch', expert: 'Sarah Jenkins', amount: '₹1,50,000', date: 'Apr 1', status: 'Paid' },
    { id: 'INV-004', desc: 'Investor Deck & Data Room', expert: 'David Chen', amount: '₹2,50,000', date: 'Pending', status: 'Pending' },
    { id: 'INV-005', desc: 'Go-to-Market Campaign', expert: 'Sarah Jenkins', amount: '₹3,50,000', date: 'Locked', status: 'Locked' },
  ];

  // ── SUCCESS METRICS ──
  const successKpis = [
    { label: 'On-Time Delivery', value: 88, icon: Clock, color: '#0eb59a', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', sub: '7 of 8 milestones on time' },
    { label: 'Milestone Hit Rate', value: 75, icon: Target, color: '#3B82F6', bg: 'bg-blue-50', border: 'border-l-blue-400', sub: '6 of 8 fully approved' },
    { label: 'Quality Score', value: 92, icon: Award, color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-l-purple-400', sub: 'Avg across all deliverables' },
    { label: 'Expert Satisfaction', value: 96, icon: Star, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-l-amber-400', sub: 'Post-milestone surveys' },
  ];
  const milestonePerformance = [
    { title: 'Discovery & Assessment', engagement: 'Series B', expert: 'David Chen', status: 'Completed', quality: 95, onTime: true, date: 'Feb 25, 2025' },
    { title: 'Financial Model Dev', engagement: 'Series B', expert: 'David Chen', status: 'Completed', quality: 98, onTime: true, date: 'Mar 28, 2025' },
    { title: 'Campaign Strategy', engagement: 'GTM Expansion', expert: 'Sarah Jenkins', status: 'Completed', quality: 92, onTime: true, date: 'Apr 1, 2025' },
    { title: 'Market Analysis', engagement: 'GTM Expansion', expert: 'Sarah Jenkins', status: 'Completed', quality: 89, onTime: false, date: 'Apr 18, 2025' },
    { title: 'Investor Deck', engagement: 'Series B', expert: 'David Chen', status: 'Overdue', quality: null, onTime: false, date: 'May 15, 2025' },
  ];
  const expertPerformance = [
    { name: 'David Chen', role: 'Interim CFO', avatar: 'https://i.pravatar.cc/150?u=david', deliveryScore: 96, qualityScore: 97, communicationScore: 95, overallScore: 96, trend: 'up' },
    { name: 'Sarah Jenkins', role: 'Fractional CMO', avatar: 'https://i.pravatar.cc/150?u=sarah', deliveryScore: 90, qualityScore: 92, communicationScore: 98, overallScore: 93, trend: 'up' },
    { name: 'Marcus Johnson', role: 'Interim COO', avatar: 'https://i.pravatar.cc/150?u=marcus', deliveryScore: 85, qualityScore: 88, communicationScore: 87, overallScore: 87, trend: 'stable' },
  ];

  // ── ROI TRACKING ──
  const roiEngagements = [
    { title: 'Series B Funding Strategy', expert: 'David Chen', cost: '₹9L', valueDelivered: '₹45L', roi: 400, period: '4 months', status: 'In Progress', color: '#0eb59a', costNum: 9, valueNum: 45 },
    { title: 'Go-to-Market Expansion', expert: 'Sarah Jenkins', cost: '₹5.5L', valueDelivered: '₹18L', roi: 227, period: '3 months', status: 'In Progress', color: '#3B82F6', costNum: 5.5, valueNum: 18 },
    { title: 'Operations Restructuring', expert: 'Marcus Johnson', cost: '₹4.5L', valueDelivered: '₹12L', roi: 167, period: '2 months', status: 'Completed', color: '#8B5CF6', costNum: 4.5, valueNum: 12 },
  ];
  const roiBreakdown = [
    { label: 'Revenue Impact', value: 45, color: '#0eb59a' },
    { label: 'Cost Savings', value: 30, color: '#3B82F6' },
    { label: 'Efficiency Gains', value: 15, color: '#8B5CF6' },
    { label: 'Risk Mitigation', value: 10, color: '#F59E0B' },
  ];

  // ── RISK ANALYSIS ──
  const riskSummary = [
    { label: 'High Risk Items', value: '2', icon: AlertTriangle, bg: 'bg-red-50', color: 'text-red-500', border: 'border-l-red-400', sub: 'Immediate attention' },
    { label: 'Medium Risk Items', value: '3', icon: AlertCircle, bg: 'bg-amber-50', color: 'text-amber-500', border: 'border-l-amber-400', sub: 'Monitor closely' },
    { label: 'Budget Overruns', value: '1', icon: DollarSign, bg: 'bg-rose-50', color: 'text-rose-500', border: 'border-l-rose-400', sub: 'Ops engagement' },
    { label: 'Overdue Milestones', value: '1', icon: Clock, bg: 'bg-orange-50', color: 'text-orange-500', border: 'border-l-orange-400', sub: 'Investor Deck — 3 days' },
  ];
  const riskItems = [
    { title: 'Investor Deck Milestone Overdue', engagement: 'Series B Funding', severity: 'High', type: 'Delivery', impact: 'Fundraising timeline at risk', recommendation: 'Escalate to expert immediately', date: 'May 18, 2025', icon: Clock },
    { title: 'Operations Budget 100% Utilised', engagement: 'Ops Restructuring', severity: 'High', type: 'Budget', impact: 'No buffer for revisions', recommendation: 'Review scope or increase budget', date: 'May 15, 2025', icon: DollarSign },
    { title: 'VP Engineering Engagement Stalled', engagement: 'Tech Infrastructure', severity: 'Medium', type: 'Progress', impact: 'No milestones after 4 weeks', recommendation: 'Schedule kickoff call', date: 'May 10, 2025', icon: AlertCircle },
    { title: 'CMO Contract Renewal Due', engagement: 'GTM Expansion', severity: 'Medium', type: 'Contract', impact: 'Engagement expires in 2 weeks', recommendation: 'Initiate renewal or replacement', date: 'May 8, 2025', icon: FileText },
    { title: 'Low Expert Communication', engagement: 'Series B Funding', severity: 'Low', type: 'Communication', impact: 'No update in 7 days', recommendation: 'Request weekly check-in', date: 'May 5, 2025', icon: Flag },
  ];
  const budgetHealth = [
    { engagement: 'Series B Funding', spent: 9, budget: 18, risk: 'Low', color: '#0eb59a' },
    { engagement: 'GTM Expansion', spent: 5.5, budget: 9, risk: 'Medium', color: '#F59E0B' },
    { engagement: 'Ops Restructuring', spent: 4.5, budget: 4.5, risk: 'High', color: '#EF4444' },
    { engagement: 'Tech Infrastructure', spent: 0, budget: 7.2, risk: 'Low', color: '#0eb59a' },
  ];

  // ── PMO OVERSIGHT ──
  const pmoHealth = [
    { label: 'Overall PMO Score', value: 87, icon: Shield, color: '#0eb59a', bg: 'bg-teal-50', border: 'border-l-[#0eb59a]', sub: 'Above industry benchmark 72%' },
    { label: 'SLA Adherence', value: 92, icon: CheckSquare, color: '#3B82F6', bg: 'bg-blue-50', border: 'border-l-blue-400', sub: '11 of 12 SLAs met' },
    { label: 'Governance Score', value: 84, icon: BookOpen, color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-l-purple-400', sub: 'All contracts compliant' },
    { label: 'Audit Readiness', value: 95, icon: Clipboard, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-l-amber-400', sub: 'Documentation current' },
  ];
  const governanceChecklist = [
    { item: 'NDA Signed — All Experts', status: 'Compliant', date: 'Feb 2025', priority: 'Critical' },
    { item: 'Master Service Agreements', status: 'Compliant', date: 'Feb 2025', priority: 'Critical' },
    { item: 'Milestone Approval Process', status: 'Compliant', date: 'Ongoing', priority: 'High' },
    { item: 'Escrow Fund Management', status: 'Compliant', date: 'Ongoing', priority: 'Critical' },
    { item: 'Monthly PMO Report', status: 'Review Needed', date: 'May 2025', priority: 'High' },
    { item: 'Expert Background Verification', status: 'Compliant', date: 'Feb 2025', priority: 'High' },
    { item: 'IP Protection Clauses', status: 'Compliant', date: 'Feb 2025', priority: 'Critical' },
    { item: 'Termination Clause Review', status: 'Review Needed', date: 'Jun 2025', priority: 'Medium' },
  ];
  const slaTracking = [
    { metric: 'Expert Response Time', target: '< 4 hours', actual: '2.3 hours', status: 'On Track', pct: 95 },
    { metric: 'Milestone Delivery Window', target: '± 2 days', actual: '± 1.4 days', status: 'On Track', pct: 90 },
    { metric: 'Payment Processing', target: '< 24 hours', actual: '18 hours', status: 'On Track', pct: 88 },
    { metric: 'Issue Resolution', target: '< 48 hours', actual: '52 hours', status: 'At Risk', pct: 60 },
    { metric: 'Monthly Reporting', target: 'By 5th of month', actual: 'Pending', status: 'Pending', pct: 40 },
  ];
  const auditTrail = [
    { action: 'Escrow Payment Released', user: 'Arjun Mehta', amount: '₹2,00,000', timestamp: 'Mar 28, 2025 · 14:32', type: 'Payment' },
    { action: 'Contract Signed — GTM Expansion', user: 'Priya Sharma', amount: '—', timestamp: 'Feb 25, 2025 · 10:15', type: 'Contract' },
    { action: 'Expert Invited — Sarah Jenkins', user: 'Arjun Mehta', amount: '—', timestamp: 'Feb 20, 2025 · 09:00', type: 'Engagement' },
    { action: 'Funds Added to Escrow', user: 'Rohan Desai', amount: '₹9,00,000', timestamp: 'Feb 1, 2025 · 11:45', type: 'Payment' },
    { action: 'NDA Executed — David Chen', user: 'Arjun Mehta', amount: '—', timestamp: 'Jan 28, 2025 · 16:20', type: 'Compliance' },
  ];

  const handleExport = () => {
    const blob = new Blob([
      `EXIGENTCX — FULL ANALYTICS REPORT\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
      `OVERVIEW\nActive Engagements: 2\nExperts: 5\nTotal Spent: ₹11.5L\nMilestones: 4/8\n\n` +
      `ROI\nTotal Cost: ₹19L\nValue Delivered: ₹75L\nBlended ROI: 295%\n\n` +
      `RISK\nHigh: 2 | Medium: 3 | Budget Overruns: 1\n\nPMO SCORE: 87%`
    ], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ExigentCX_FullAnalytics.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117]">

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : (isMobile ? 0 : 68) }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`bg-white dark:bg-[#1b1d24] border-r border-gray-100 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen ${
          isMobile ? (isSidebarOpen ? 'w-[260px]' : 'w-0 pointer-events-none border-none') : ''
        }`}
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 dark:text-gray-500">Main Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = item.active || window.location.pathname === item.path || (item.path === '/experts' && window.location.pathname.startsWith('/experts'));
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl transition-all duration-150 relative ${isActive
                  ? 'bg-[#134e40] text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white'
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
                  animate={{
                    opacity: isSidebarOpen ? 1 : 0,
                    width: isSidebarOpen ? 'auto' : 0
                  }}
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
            className={`w-full flex items-center gap-3 px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl transition-all duration-150 relative ${window.location.pathname === '/settings'
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
              const isDemo = localStorage.getItem('demo_company') === 'true';
              if (isDemo) {
                localStorage.removeItem('demo_company');
              } else {
                await supabase.auth.signOut();
              }
              navigate('/signin?role=company');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 font-bold"
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

      {/* ── MAIN ── */}
      <div className="flex flex-col min-h-screen overflow-x-hidden"
        style={{
          marginLeft: isMobile ? 0 : (isSidebarOpen ? 260 : 68),
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)'
        }}
      >

        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1b1d24] backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm px-4 sm:px-6 py-3 flex items-center gap-4">
          {isMobile && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:text-[#134e40] hover:bg-gray-100 transition-all shrink-0"
            >
              <Menu size={20} />
            </motion.button>
          )}
          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-0.5 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/10">
              {periods.map(p => (
                <motion.button key={p} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => setActivePeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activePeriod === p ? 'bg-[#134e40] text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-[#134e40] dark:hover:text-white'}`}>
                  {p}
                </motion.button>
              ))}
            </div>
            {/* Export button removed */}
            <div className="relative">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-11 h-11 md:w-9 md:h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] hover:bg-gray-100 transition-all relative shrink-0">
                <Bell size={17} />
                {unreadCount > 0 && (
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }}
                      className="absolute right-0 top-13 sm:top-11 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                        <h4 className="font-black text-[#1C3627] text-sm">Notifications</h4>
                        <span className="text-[10px] font-bold text-[#0eb59a] cursor-pointer">Mark all read</span>
                      </div>
                      {appNotifs.map((n, i) => (
                        <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${n.unread ? 'bg-teal-50/20' : ''}`}>
                          <div className={`w-8 h-8 ${n.color} rounded-xl flex items-center justify-center shrink-0`}>
                            <Bell size={13} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#1C3627] mb-0.5 text-left">{n.title}</p>
                            <p className="text-[11px] text-gray-500 text-left">{n.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 text-left dark:text-gray-500">{n.time}</p>
                          </div>
                          {n.unread && <div className="w-2 h-2 bg-[#0eb59a] rounded-full shrink-0 mt-1" />}
                        </motion.div>
                      ))}
                      <div className="px-4 py-3 text-center border-t border-gray-50 flex items-center justify-center">
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors min-h-[44px] w-full flex items-center justify-center">View all →</button>
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
              onClick={() => navigate('/settings')}
            >
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </motion.div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex-1 px-4 sm:px-6 py-5 pb-16 overflow-x-hidden space-y-5">

          {/* TABS — scrollable */}
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
            <div className="flex gap-1 bg-white dark:bg-[#1b1d24] border border-gray-100 dark:border-white/10 rounded-2xl p-1 w-fit" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              {tabs.map(tab => (
                <motion.button key={tab} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 min-h-[44px] md:min-h-0 flex items-center justify-center rounded-xl text-xs font-bold transition-all relative whitespace-nowrap shrink-0 ${activeTab === tab ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#134e40] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  {activeTab === tab && (
                    <motion.div layoutId="tabBg" className="absolute inset-0 bg-[#134e40] rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative z-10">{tab}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* ══ OVERVIEW ══ */}
            {activeTab === 'Overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {kpis.map((kpi, idx) => (
                    <motion.div key={idx}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.1)', transition: { duration: 0.2 } }}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                      className={`bg-white dark:bg-[#1e2028] rounded-2xl p-4 border-l-4 ${kpi.border} cursor-default group relative overflow-hidden border border-gray-100 dark:border-white/10`}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at 0% 50%, ${kpi.sparkColor}10 0%, transparent 70%)` }} />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 ${kpi.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                            <kpi.icon size={12} className={kpi.iconColor} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate text-left">{kpi.label}</span>
                        </div>
                        <p className={`text-xl sm:text-2xl font-black ${kpi.numColor} dark:text-white leading-none mb-2 text-left`}>{kpi.value}</p>
                        <Sparkline data={kpi.spark} color={kpi.sparkColor} width={64} height={26} />
                        <div className="flex items-center gap-1 mt-1.5">
                          {kpi.trend === 'up' ? <TrendingUp size={10} className="text-emerald-500 shrink-0" /> : <TrendingDown size={10} className="text-gray-400 shrink-0 dark:text-gray-500" />}
                          <p className="text-[10px] text-gray-400 font-medium truncate text-left dark:text-gray-500">{kpi.sub}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="lg:col-span-2 p-5">
                    <div className="flex items-center justify-between mb-5">
                      <SectionHeading icon={Activity} label="Active Engagements Over Time" />
                      <span className="text-[10px] font-bold text-[#0eb59a] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">{activePeriod}</span>
                    </div>
                    <div className="flex items-end gap-3 h-36 px-2">
                      {engagementChartData.map((bar, idx) => (
                        <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 cursor-default"
                          onMouseEnter={() => setHoveredBar(idx)} onMouseLeave={() => setHoveredBar(null)}>
                          <AnimatePresence>
                            {hoveredBar === idx && bar.value > 0 && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="bg-[#134e40] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                                {bar.value} active
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {hoveredBar !== idx && <span className="text-[10px] font-black text-[#134e40]">{bar.value > 0 ? bar.value : '—'}</span>}
                          <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: bar.value > 0 ? `${(bar.value / maxEng) * 96}px` : '4px', opacity: 1 }}
                              transition={{ duration: 0.9, delay: idx * 0.1, ease: 'easeOut' }}
                              style={{ borderRadius: '8px 8px 4px 4px' }}
                              className={`w-full transition-all duration-200 ${bar.value > 0 ? hoveredBar === idx ? 'bg-gradient-to-t from-[#0a3028] to-[#0dd9b8]' : 'bg-gradient-to-t from-[#134e40] to-[#0eb59a]' : 'bg-gray-100'}`} />
                          </div>
                          <span className={`text-[10px] font-bold transition-colors ${hoveredBar === idx ? 'text-[#134e40] font-black' : 'text-gray-400'}`}>{bar.month}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5">
                    <SectionHeading icon={DollarSign} label="Spend Breakdown" iconBg="bg-[#134e40]/10" iconColor="text-[#134e40]" />
                    <div className="flex flex-col items-center gap-4 mt-4">
                      <div className="relative">
                        <DonutChart segments={paymentBreakdown} size={110} strokeWidth={14} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-[13px] font-black text-[#134e40]">₹27L</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide dark:text-gray-500">total</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full space-y-2.5">
                        {paymentBreakdown.map((seg, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.1 }} className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                            <span className="text-[11px] text-gray-600 font-semibold flex-1 text-left dark:text-gray-300">{seg.label}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${seg.value}%` }} transition={{ duration: 0.9, delay: 0.5 + idx * 0.1 }} style={{ height: '100%', backgroundColor: seg.color, borderRadius: '999px' }} />
                            </div>
                            <span className="text-[11px] font-black text-[#1C3627] dark:text-white w-8 text-right">{seg.value}%</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="p-5">
                    <SectionHeading icon={Layers} label="Requirements Funnel" iconBg="bg-teal-50" iconColor="text-[#0eb59a]" />
                    <div className="space-y-2.5 mt-4">
                      {requirementsFunnel.map((stage, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }} whileHover={{ x: 4, transition: { duration: 0.15 } }} className="flex items-center gap-3 cursor-default group">
                          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 w-20 group-hover:text-[#1C3627] dark:group-hover:text-white transition-colors text-left">{stage.stage}</span>
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(stage.value / requirementsFunnel[0].value) * 100}%` }} transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }} style={{ height: '100%', backgroundColor: stage.color, borderRadius: '999px' }} />
                          </div>
                          <span className="text-[12px] font-black text-[#1C3627] dark:text-white w-4 text-right">{stage.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5">
                    <SectionHeading icon={Users} label="Experts by Role" />
                    <div className="space-y-3 mt-4">
                      {expertsByRole.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }} whileHover={{ x: 4, transition: { duration: 0.15 } }} className="cursor-default group">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#1C3627] transition-colors text-left dark:text-gray-300">{item.role}</span>
                            <span className="text-[11px] font-black" style={{ color: item.color }}>{item.count}</span>
                          </div>
                          <ProgressBar value={(item.count / 5) * 100} color={item.color} delay={0.3 + idx * 0.07} />
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5">
                    <SectionHeading icon={AlertTriangle} label="Risk Snapshot" iconBg="bg-red-50" iconColor="text-red-500" />
                    <div className="space-y-3 mt-4">
                      {[
                        { label: 'High Risk', count: 2, color: '#EF4444', bg: 'bg-red-50' },
                        { label: 'Medium Risk', count: 3, color: '#F59E0B', bg: 'bg-amber-50' },
                        { label: 'Low Risk', count: 4, color: '#10b981', bg: 'bg-emerald-50' },
                      ].map((r, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ x: 4, transition: { duration: 0.15 } }} className="flex items-center gap-3 cursor-default">
                          <div className={`w-7 h-7 ${r.bg} rounded-lg flex items-center justify-center shrink-0`}>
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                          </div>
                          <span className="text-[12px] font-bold text-gray-600 flex-1 text-left dark:text-gray-300">{r.label}</span>
                          <span className="text-[13px] font-black" style={{ color: r.color }}>{r.count}</span>
                        </motion.div>
                      ))}
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('Risk Analysis')}
                        className="w-full mt-2 py-2.5 min-h-[44px] md:min-h-0 flex items-center justify-center text-[11px] font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                        View Risk Analysis →
                      </motion.button>
                    </div>
                  </Card>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Avg Time to Hire', value: 12, suffix: ' days', icon: Clock, bg: 'bg-teal-50', color: 'text-[#0eb59a]', border: 'border-l-[#0eb59a]', sub: '↓ 3 days vs last quarter', glow: '#0eb59a' },
                    { label: 'Expert Retention', value: 100, suffix: '%', icon: Award, bg: 'bg-emerald-50', color: 'text-emerald-500', border: 'border-l-emerald-400', sub: 'All experts re-engaged', glow: '#10b981' },
                    { label: 'Blended ROI', value: 295, suffix: '%', icon: TrendingUp, bg: 'bg-[#134e40]/10', color: 'text-[#134e40]', border: 'border-l-[#134e40]', sub: 'Across all engagements', glow: '#134e40' },
                    { label: 'PMO Score', value: 87, suffix: '%', icon: Shield, bg: 'bg-amber-50', color: 'text-amber-500', border: 'border-l-amber-400', sub: 'Above industry avg 72%', glow: '#F59E0B' },
                  ].map((item, idx) => (
                    <motion.div key={idx}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: `0 16px 40px ${item.glow}20`, transition: { duration: 0.2 } }}
                      className={`bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-2xl p-5 border-l-4 ${item.border} cursor-default group relative overflow-hidden`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at 0% 100%, ${item.glow}10 0%, transparent 60%)` }} />
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                          <item.icon size={17} className={item.color} />
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#1C3627] dark:text-white mb-0.5 text-center">
                          <AnimatedNumber value={item.value} suffix={item.suffix} />
                        </p>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 text-center">{item.label}</p>
                        <p className="text-[10px] text-gray-400 text-center dark:text-gray-500">{item.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ ENGAGEMENTS ══ */}
            {activeTab === 'Engagements' && (
              <motion.div key="engagements" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
                <KpiStrip items={[
                  { label: 'Total Engagements', value: '3', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]', large: true },
                  { label: 'Active', value: '2', border: 'border-l-[#0eb59a]', numColor: 'text-[#0eb59a]', large: true },
                  { label: 'Completed', value: '1', border: 'border-l-emerald-400', numColor: 'text-emerald-700', large: true },
                  { label: 'Avg Progress', value: '47%', border: 'border-l-amber-400', numColor: 'text-amber-600', large: true },
                ]} />
                <div className="space-y-4">
                  {engagementsList.map((eng, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4, boxShadow: `0 20px 50px ${eng.color}15`, transition: { duration: 0.2 } }}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                      className="bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-2xl p-5 cursor-default group relative overflow-hidden">

                      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${eng.color}, transparent)` }} />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={eng.avatar} className="w-11 h-11 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow" alt={eng.expert} />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: eng.status === 'In Progress' ? '#10b981' : '#F59E0B' }} />
                          </div>
                          <div className="text-left"><h4 className="font-black text-[#1C3627] dark:text-white text-sm text-left">{eng.title}</h4><p className="text-xs text-gray-400 mt-0.5 text-left dark:text-gray-500">{eng.expert} · <span style={{ color: eng.color }} className="font-semibold">{eng.role}</span></p></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={eng.status} />
                          <motion.button whileHover={{ scale: 1.15, backgroundColor: `${eng.color}15` }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/engagements/1')} className="p-3 md:p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#0eb59a] transition-all flex items-center justify-center min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 dark:text-gray-500"><Eye size={14} /></motion.button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {[{ label: 'Spend', value: eng.spend }, { label: 'Budget', value: eng.budget }, { label: 'Milestones', value: eng.milestones }, { label: 'Rating', value: eng.rating ? `★ ${eng.rating}` : '—' }].map((item, i) => (
                          <div key={i} className="bg-[#FAFBF9] dark:bg-[#252830] rounded-xl p-3 border border-gray-100 dark:border-white/10 text-center">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-1 text-center">{item.label}</p>
                            <p className="text-sm font-black text-[#1C3627] dark:text-white text-center">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-gray-400 font-semibold dark:text-gray-500">Progress</span>
                          <span className="font-black" style={{ color: eng.color }}>{eng.progress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${eng.progress}%` }} transition={{ duration: 1.2, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                            style={{ height: '100%', background: `linear-gradient(90deg, #134e40, ${eng.color})`, borderRadius: '999px', position: 'relative', overflow: 'hidden' }}>
                            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', inset: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ EXPERTS ══ */}
            

            {/* ══ Spend Reports ══ */}
            {activeTab === 'Spend Reports' && (
              <motion.div key="spend" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                <KpiStrip items={[
                  { label: 'Total Committed', value: '₹27.0L', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]', sub: 'Projected total spend' },
                  { label: 'Total Spent', value: '₹11.5L', border: 'border-l-emerald-400', numColor: 'text-emerald-700', sub: 'Released milestones', progress: 43, progressColor: '#10b981' },
                  { label: 'In Escrow', value: '₹6.0L', border: 'border-l-amber-400', numColor: 'text-amber-700', sub: 'Secured funds', progress: 22, progressColor: '#f59e0b' },
                  { label: 'Committed Balance', value: '₹9.5L', border: 'border-l-[#134e40]', numColor: 'text-[#134e40]', sub: 'Pending deliverables', progress: 35, progressColor: '#134e40' },
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="lg:col-span-2 p-5">
                    <SectionHeading icon={BarChart} label="Monthly Spend Trend" />
                    <div className="flex items-end gap-3 h-44 px-2 mt-6 mb-4">
                      {monthlySpend.map((bar, idx) => (
                        <motion.div key={bar.month}
                          whileHover={{ y: -5, scale: 1.05 }}
                          className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <span className="text-[10px] font-black text-[#134e40] opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1">{bar.amount > 0 ? `₹${bar.amount / 100}L` : '—'}</span>
                          <div className="w-full flex flex-col justify-end" style={{ height: '110px' }}>
                            <motion.div initial={{ height: 0 }} animate={{ height: bar.amount > 0 ? `${(bar.amount / maxMonthly) * 110}px` : '4px' }}
                              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                              whileHover={{ filter: 'brightness(1.1)' }}
                              style={{ borderRadius: '6px 6px 3px 3px' }}
                              className={`w-full shadow-sm group-hover:shadow-md transition-shadow ${bar.amount > 0 ? 'bg-gradient-to-t from-[#134e40] to-[#0eb59a]' : 'bg-gray-100'}`} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors mt-1 dark:text-gray-500">{bar.month}</span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <SectionHeading icon={PieChart} label="Spend by Category" />
                    <div className="space-y-4 mt-5">
                      {spendByCategory.map((item, idx) => (
                        <div key={idx} className="cursor-default text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-gray-600 text-left dark:text-gray-300">{item.category}</span>
                            <span className="text-[11px] font-black text-[#1C3627] dark:text-white text-right">₹{item.amount}L / ₹{item.budget}L</span>
                          </div>
                          <ProgressBar value={item.pct} color={item.color} delay={idx * 0.1} />
                          <p className="text-[9px] text-gray-400 mt-1 text-left dark:text-gray-500">{item.pct}% of allocated budget spent</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="bg-white dark:bg-[#1e2028] rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div className="px-5 py-4 border-b border-gray-50">
                    <h3 className="font-black text-[#1C3627] text-sm text-left">Recent Deliverables & Invoices</h3>
                  </div>
                  {invoiceSummary.map((inv, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 ${idx < invoiceSummary.length - 1 ? 'border-b border-gray-50 dark:border-white/5' : ''}`}>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-white/10">{inv.id}</span>
                          <span className="text-xs font-black text-[#1C3627] dark:text-white">{inv.desc}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 text-left dark:text-gray-500">Expert: {inv.expert} · Released: {inv.date}</p>
                      </div>
                      <div className="flex items-center gap-5 self-start sm:self-center">
                        <span className="font-black text-sm text-[#1C3627] dark:text-white">{inv.amount}</span>
                        <StatusBadge status={inv.status} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ Success Metrics ══ */}
            {activeTab === 'Success Metrics' && (
              <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {successKpis.map((kpi, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                      className={`bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-2xl p-5 border-l-4 ${kpi.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <kpi.icon size={15} className={kpi.color} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-left dark:text-gray-500">{kpi.label}</p>
                      <p className="text-2xl sm:text-3xl font-black text-[#1C3627] dark:text-white mb-1.5 text-left">
                        <AnimatedNumber value={kpi.value} suffix="%" />
                      </p>
                      <p className="text-[10px] text-gray-400 text-left dark:text-gray-500">{kpi.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="lg:col-span-2 p-5 overflow-hidden">
                    <SectionHeading icon={Clipboard} label="Milestone Governance & Delivery Log" />
                    <div className="space-y-3 mt-4">
                      {milestonePerformance.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FAFBF9] dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-white/8 transition-colors">
                          <div className="text-left">
                            <h4 className="font-bold text-xs text-[#1C3627] dark:text-white text-left">{item.title}</h4>
                            <p className="text-[10px] text-gray-400 text-left dark:text-gray-500">Expert: {item.expert} · Engagement: {item.engagement}</p>
                          </div>
                          <div className="flex items-center gap-4 self-end sm:self-center">
                            {item.quality && (
                              <div className="text-right">
                                <p className="text-xs font-black text-[#0eb59a] text-right">{item.quality}%</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-right dark:text-gray-500">Quality</p>
                              </div>
                            )}
                            <div className="text-right">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${item.onTime ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                {item.onTime ? 'On Time' : 'Delayed'}
                              </span>
                              <p className="text-[8px] text-gray-400 mt-0.5 text-right dark:text-gray-500">{item.date}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <SectionHeading icon={Users} label="Expert Performance Matrix" />
                    <div className="space-y-4 mt-5">
                      {expertPerformance.map((exp, idx) => (
                        <div key={idx} className="p-3 bg-[#FAFBF9] dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl text-left">
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <img src={exp.avatar} className="w-8 h-8 rounded-lg object-cover" alt={exp.name} />
                            <div className="text-left">
                              <h4 className="font-black text-xs text-[#1C3627] dark:text-white leading-none text-left">{exp.name}</h4>
                              <p className="text-[10px] text-gray-400 mt-1 text-left dark:text-gray-500">{exp.role}</p>
                            </div>
                            <span className="ml-auto text-xs font-black text-[#0eb59a] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">{exp.overallScore}%</span>
                          </div>
                          <div className="space-y-3 mt-3.5">
                            {[{ l: 'Quality', v: exp.qualityScore, c: '#0eb59a' }, { l: 'Delivery', v: exp.deliveryScore, c: '#3B82F6' }, { l: 'Communication', v: exp.communicationScore, c: '#8B5CF6' }].map((sc, i) => (
                              <motion.div key={i}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3.5 py-0.5 group cursor-default transition-all"
                              >
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 w-24 pr-2 text-left group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-none">{sc.l}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${sc.v}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                                    whileHover={{ filter: 'brightness(1.1)' }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: sc.c }}
                                  />
                                </div>
                                <span className="text-[10px] font-black text-gray-600 w-8 text-right group-hover:scale-110 transition-transform leading-none dark:text-gray-300">{sc.v}%</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* ══ ROI Tracking ══ */}
            {activeTab === 'ROI Tracking' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Blended ROI Score', value: '295%', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]', sub: 'Return on Talent spend' },
                    { label: 'Talent Acquisition Cost', value: '₹19.0L', border: 'border-l-[#0eb59a]', numColor: 'text-[#0eb59a]', sub: 'Released + Escrow' },
                    { label: 'Value Delivered', value: '₹75.0L', border: 'border-l-emerald-400', numColor: 'text-emerald-600', sub: 'Est. business impact' },
                    { label: 'Net Value Created', value: '₹56.0L', border: 'border-l-emerald-400', numColor: 'text-emerald-700', sub: 'Net financial gain' },
                  ].map((s, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                      className={`bg-white dark:bg-[#1e2028] rounded-2xl p-5 border-l-4 ${s.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-left dark:text-gray-500">{s.label}</p>
                      <p className="text-xl sm:text-2xl font-black text-[#1C3627] dark:text-white mb-1.5 text-left">{s.value}</p>
                      <p className="text-[10px] text-gray-400 text-left dark:text-gray-500">{s.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="lg:col-span-2 p-5">
                    <SectionHeading icon={BarChart} label="Cost vs Value Delivered by Engagement" />
                    <div className="space-y-4.5 mt-5">
                      {roiEngagements.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.015, y: -2 }}
                          className="p-4 bg-gray-50 dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md dark:hover:shadow-black/20">
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-xs font-black text-[#1C3627] dark:text-white text-left">{item.title}</span>
                            <span className="text-xs font-black text-[#0eb59a] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">{Math.round(((item.valueNum - item.costNum) / item.costNum) * 100)}% ROI</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-[9px] text-gray-400 mb-1 dark:text-gray-500">
                                <span className="text-left">Value Delivered</span>
                                <span className="font-bold text-[#1C3627] dark:text-white text-right">{item.valueDelivered}</span>
                              </div>
                              <ProgressBar value={100} color={item.color} delay={idx * 0.1} />
                            </div>
                            <div>
                              <div className="flex justify-between text-[9px] text-gray-400 mb-1 dark:text-gray-500">
                                <span className="text-left">Acquisition Cost</span>
                                <span className="font-bold text-[#1C3627] dark:text-white text-right">{item.cost}</span>
                              </div>
                              <ProgressBar value={(item.costNum / item.valueNum) * 100} color="#134e40" delay={idx * 0.15} />
                            </div>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-2.5 text-left dark:text-gray-500">Calculated over a {item.period} engagement timeline.</p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5 flex flex-col">
                    <SectionHeading icon={PieChart} label="Business Impact Vectors" />
                    <div className="flex flex-col gap-5 mt-5 flex-1">

                      {/* Donut + legend */}
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                          <DonutChart segments={roiBreakdown} size={100} strokeWidth={13} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-[12px] font-black text-[#134e40]">₹75L</p>
                              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wide dark:text-gray-500">Delivered</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          {roiBreakdown.map((seg, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                              <span className="text-[10px] text-gray-500 font-semibold flex-1 text-left">{seg.label}</span>
                              <span className="text-[11px] font-black text-[#1C3627] dark:text-white">{seg.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress bars for each segment */}
                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1.5 dark:text-gray-500">Value breakdown</p>
                        {roiBreakdown.map((seg, idx) => {
                          const amount = ((seg.value / 100) * 75).toFixed(1);
                          return (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{seg.label}</span>
                                <span className="text-[10px] font-black" style={{ color: seg.color }}>₹{amount}L</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${seg.value}%` }}
                                  transition={{ duration: 0.9, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                                  style={{ height: '100%', backgroundColor: seg.color, borderRadius: '999px' }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Net value insight */}
                      <div className="mt-auto p-3.5 bg-teal-50 dark:bg-[#0eb59a]/10 border border-teal-100 dark:border-[#0eb59a]/20 rounded-xl relative overflow-hidden">

                        <div className="relative z-10">
                          <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-1">Net Value Created</p>
                          <p className="text-xl font-black text-[#134e40]">₹56.0L</p>
                          <p className="text-[9px] text-teal-700 font-semibold mt-0.5">After ₹19L acquisition cost · <span className="font-black">295% blended ROI</span></p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* ══ Risk Analysis ══ */}
            {activeTab === 'Risk Analysis' && (
              <motion.div key="risk" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {riskSummary.map((kpi, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                      className="bg-white dark:bg-[#1e2028] rounded-2xl p-5 border-l-4 border-l-red-400 cursor-default" style={{ borderLeftColor: idx === 0 || idx === 2 ? '#EF4444' : '#F59E0B', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <kpi.icon size={15} className={kpi.color} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-left dark:text-gray-500">{kpi.label}</p>
                      <p className="text-2xl sm:text-3xl font-black text-[#1C3627] dark:text-white mb-1.5 text-left">{kpi.value}</p>
                      <p className="text-[10px] text-gray-400 text-left dark:text-gray-500">{kpi.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="lg:col-span-2 p-5">
                    <SectionHeading icon={AlertTriangle} label="PMO Governance & Risk Log" iconBg="bg-red-50" iconColor="text-red-500" />
                    <div className="space-y-3 mt-4">
                      {riskItems.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                          className="p-3.5 bg-gray-50 dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-left">
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-5 h-5 bg-white dark:bg-white/10 rounded-md flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/10">
                                <item.icon size={10} className="text-gray-500" />
                              </div>
                              <h4 className="font-bold text-xs text-[#1C3627] dark:text-white text-left truncate">{item.title}</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mb-1 text-left">Engagement: {item.engagement}</p>
                            <p className="text-[10px] text-gray-400 text-left dark:text-gray-500"><span className="font-black text-red-500">Impact:</span> {item.impact}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 text-left dark:text-gray-500"><span className="font-black text-teal-600">PMO Action:</span> {item.recommendation}</p>
                          </div>
                          <div className="flex items-center gap-3 self-start sm:self-start mt-2 sm:mt-0 shrink-0">
                            <RiskBadge level={item.severity} />
                            <span className="text-[9px] text-gray-400 font-medium dark:text-gray-500">{item.date}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <SectionHeading icon={DollarSign} label="Engagement Budget Health" />
                    <div className="space-y-4 mt-5">
                      {budgetHealth.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-[#FAFBF9] dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl text-left">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-xs text-[#1C3627] dark:text-white text-left">{item.engagement}</h4>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${item.risk === 'High' ? 'text-red-700 bg-red-50 border-red-200' :
                              item.risk === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                                'text-emerald-700 bg-emerald-50 border-emerald-200'
                              }`}>{item.risk} Risk</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 dark:text-gray-500">
                            <span className="text-left">Budget Utilisation</span>
                            <span className="font-black text-[#1C3627] dark:text-white text-right">₹{item.spent}L / ₹{item.budget}L</span>
                          </div>
                          <ProgressBar value={(item.spent / item.budget) * 100} color={item.color} delay={idx * 0.1} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* ══ PMO Oversight ══ */}
            {activeTab === 'PMO Oversight' && (
              <motion.div key="pmo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {pmoHealth.map((kpi, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                      className={`bg-white dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-2xl p-5 border-l-4 ${kpi.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <kpi.icon size={15} className={kpi.color} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-left dark:text-gray-500">{kpi.label}</p>
                      <p className="text-2xl sm:text-3xl font-black text-[#1C3627] mb-1.5 text-left">
                        <AnimatedNumber value={kpi.value} suffix="%" />
                      </p>
                      <p className="text-[10px] text-gray-400 text-left dark:text-gray-500">{kpi.sub}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="p-5">
                    <SectionHeading icon={Clipboard} label="PMO Governance & Compliance Checklist" />
                    <div className="space-y-3 mt-4">
                      {governanceChecklist.map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl text-left">
                          <div className="text-left flex-1 min-w-0 pr-3">
                            <h4 className="font-bold text-[11px] text-[#1C3627] dark:text-white text-left truncate">{item.item}</h4>
                            <p className="text-[9px] text-gray-400 text-left dark:text-gray-500">Checked: {item.date} · Priority: {item.priority}</p>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border shrink-0 self-start sm:self-center ${item.status === 'Compliant' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                            }`}>{item.status}</span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <SectionHeading icon={CheckSquare} label="PMO SLA Compliance Adherence" />
                    <div className="space-y-4 mt-5">
                      {slaTracking.map((item, idx) => (
                        <div key={idx} className="cursor-default text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-gray-600 text-left dark:text-gray-300">{item.metric}</span>
                            <span className="text-[11px] font-black text-[#1C3627] dark:text-white text-right">{item.actual} / {item.target}</span>
                          </div>
                          <ProgressBar value={item.pct} color={item.status === 'On Track' ? '#0eb59a' : '#EF4444'} delay={idx * 0.1} />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <SectionHeading icon={Shield} label="Compliance Audit Trail" />
                    <div className="space-y-3 mt-4">
                      {auditTrail.map((trail, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                          className="p-3 bg-[#FAFBF9] dark:bg-[#252830] border border-gray-100 dark:border-white/10 rounded-xl text-left flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] shrink-0 mt-1.5" />
                          <div className="text-left flex-1 min-w-0">
                            <h4 className="font-bold text-[11px] text-[#1C3627] dark:text-white text-left leading-tight">{trail.action}</h4>
                            <p className="text-[9px] text-gray-400 mt-1 text-left dark:text-gray-500">By: {trail.user} · Amount: {trail.amount}</p>
                            <p className="text-[9px] text-gray-400 text-left dark:text-gray-500">{trail.timestamp}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
