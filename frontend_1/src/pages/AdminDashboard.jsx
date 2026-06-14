import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  Activity, UserCheck, ShieldAlert, Lock, TrendingUp, BarChart3, 
  ChevronRight, LogOut, Filter, Plus, Search, Bell, Settings, 
  Share2, MoreVertical, Clock, ArrowUpRight, CheckCircle2, 
  XCircle, Star, Server, ExternalLink, Shield, Gavel, 
  DollarSign, ChevronDown, Check, ArrowRight, RefreshCw
} from 'lucide-react';
import Logo from '../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';

// Mock initial data matching the screenshots
const INITIAL_CANDIDATES = [
  { id: 'c1', name: 'Alex Mercer', role: 'Senior Cloud Architect', score: 94, status: 'Pending Review', time: 'Applied 2h ago', avatar: 'AM', color: 'bg-teal-600', skills: ['AWS', 'Kubernetes', 'Terraform'], exp: '10 yrs exp', notes: 'Strong cloud governance and multi-region deployment architecture.' },
  { id: 'c2', name: 'Sarah Chen', role: 'Lead Data Scientist', score: 98, status: 'In Analysis', time: 'Applied 5h ago', avatar: 'SC', color: 'bg-purple-600', skills: ['PyTorch', 'NLP', 'Azure ML'], exp: '8 yrs exp', notes: 'Technical Round • Passed Jun 12. Exhibited deep understanding of transformer architectures and practical deployment constraints on edge devices.' },
  { id: 'c3', name: 'James Durand', role: 'Cybersecurity Analyst', score: 82, status: 'Flagged', time: 'Applied yesterday', avatar: 'JD', color: 'bg-rose-600', skills: ['PenTesting', 'SIEM', 'Compliance'], exp: '6 yrs exp', notes: 'Requires background check escalation due to prior credential verification mismatch.' },
  { id: 'c4', name: 'Katherine Park', role: 'Principal Product Manager', score: 91, status: 'Pending Review', time: 'Applied 1d ago', avatar: 'KP', color: 'bg-amber-600', skills: ['Agile', 'Product Strategy', 'SAFe'], exp: '12 yrs exp', notes: 'Strong track record in fractional product leadership for scaleups.' }
];

const INITIAL_DISPUTES = [
  { id: '#DS-8842', parties: 'Client vs Developer', subject: 'Scope Creep Allegation', severity: 'CRITICAL', status: 'Active' },
  { id: '#DS-9011', parties: 'Agency vs Freelancer', subject: 'Payment Delay', severity: 'MEDIUM', status: 'Active' },
  { id: '#DS-9104', parties: 'Solo Biz vs Designer', subject: 'Quality of Deliverables', severity: 'MEDIUM', status: 'Active' },
  { id: '#DS-9221', parties: 'Global Corp vs PM', subject: 'NDA Violation Report', severity: 'CRITICAL', status: 'Active' }
];

const INITIAL_MODERATION = [
  { id: 'm1', author: 'Sarah Jenkins', rating: 5, status: 'NEW', review: 'Exceptional work on the backend architecture. Highly professional and met all deliverables ahead of schedule.', flagged: false },
  { id: 'm2', author: 'Michael R.', rating: 1, status: 'FLAGGED', review: 'Absolutely terrible experience. The freelancer used my personal phone number to send harassing messages after a dispute.', flagged: true },
  { id: 'm3', author: 'Elena K.', rating: 4, status: 'PENDING', review: 'Good quality work but communication was a bit slow in the beginning. Eventually completed everything correctly.', flagged: false }
];

const INITIAL_AUDITS = [
  { id: '#ENG-2940', partner: 'Nexus Labs', type: 'Fixed Price', value: '$14,500.00', escrow: 'VERIFIED', vetting: 'Cleared' },
  { id: '#ENG-2941', partner: 'Altius Venture', type: 'Managed', value: '$82,000.00', escrow: 'PENDING', vetting: 'Reviewing' },
  { id: '#ENG-2942', partner: 'Swift Cloud', type: 'T&M', value: '$2,400.00', escrow: 'FLAGGED', vetting: 'Action Req.' },
  { id: '#ENG-2943', partner: 'Global Horizon', type: 'Fixed Price', value: '$4,200.00', escrow: 'VERIFIED', vetting: 'Cleared' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, vetting, governance, trust
  const [adminEmail, setAdminEmail] = useState('admin@exigentcx.com');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Vetting Tab State
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState(INITIAL_CANDIDATES[1]); // default to Sarah Chen
  const [vettingNotes, setVettingNotes] = useState(INITIAL_CANDIDATES[1].notes);
  const [vettingSearch, setVettingSearch] = useState('');

  // Governance Tab State
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [escrowReleased, setEscrowReleased] = useState(false);
  const [moderations, setModerations] = useState(INITIAL_MODERATION);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);

  // Trust Tab State
  const [timeRange, setTimeRange] = useState('30D');
  const [audits, setAudits] = useState(INITIAL_AUDITS);

  const fetchEscrows = async () => {
    try {
      const isDemo = localStorage.getItem('sb-mock-auth') === 'true';
      let token = "admin-token";
      if (!isDemo) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) token = session.access_token;
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/payments/escrows`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEscrows(data);
        const pending = data.find(e => e.pendingMilestoneStatus === "pending_admin_release") || data[0];
        setSelectedEscrow(pending);
        // Reset escrowReleased state if switching to a new pending one
        setEscrowReleased(false);
      }
    } catch (err) {
      console.error("fetchEscrows error:", err);
    }
  };

  useEffect(() => {
    // Authenticate and check role
    const role = localStorage.getItem('user_role');
    const isDemo = localStorage.getItem('sb-mock-auth') === 'true';
    if (role !== 'admin' && !isDemo) {
      navigate('/signin?role=admin');
      return;
    }

    const fetchSession = async () => {
      if (isDemo) {
        setAdminEmail('admin@exigentcx.com');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setAdminEmail(session.user.email);
      }
    };
    fetchSession();
    fetchEscrows();
  }, [navigate]);

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = async () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('sb-mock-auth');
    if (supabase.auth.signOut) {
      await supabase.auth.signOut();
    }
    triggerToast('Logged out successfully', 'success');
    setTimeout(() => navigate('/signin?role=admin'), 600);
  };

  // Candidate Selection Handler
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setVettingNotes(candidate.notes);
  };

  // Vetting decision
  const handleVettingDecision = (status) => {
    const updated = candidates.map(c => 
      c.id === selectedCandidate.id ? { ...c, status } : c
    );
    setCandidates(updated);
    setSelectedCandidate({ ...selectedCandidate, status });
    triggerToast(`Candidate ${selectedCandidate.name} has been ${status === 'Approved' ? 'approved for placement' : 'rejected'}.`);
  };

  const saveCandidateNotes = () => {
    const updated = candidates.map(c => 
      c.id === selectedCandidate.id ? { ...c, notes: vettingNotes } : c
    );
    setCandidates(updated);
    triggerToast('Vetting notes saved successfully.');
  };

  // Escrow Watch Release
  const handleReleaseEscrow = async () => {
    if (!selectedEscrow || !selectedEscrow.pendingMilestoneId) {
      triggerToast('No pending milestone to release.', 'warning');
      return;
    }
    const isDemo = localStorage.getItem('sb-mock-auth') === 'true';
    let token = "admin-token";
    if (!isDemo) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) token = session.access_token;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${baseUrl}/api/payments/escrow/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          engagementId: selectedEscrow.id,
          milestoneId: selectedEscrow.pendingMilestoneId
        })
      });

      if (res.ok) {
        setEscrowReleased(true);
        triggerToast('Escrow funds authorized and released successfully.');
        fetchEscrows();
      } else {
        const data = await res.json();
        triggerToast('Error: ' + (data.error || 'Failed to release escrow'), 'warning');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Network error during escrow authorization', 'warning');
    }
  };

  // Review Actions
  const handleReviewAction = (id, action) => {
    if (action === 'delete') {
      setModerations(moderations.filter(m => m.id !== id));
      triggerToast('Flagged review deleted and user profile suspended.');
    } else if (action === 'approve') {
      setModerations(moderations.map(m => m.id === id ? { ...m, status: 'APPROVED', flagged: false } : m));
      triggerToast('Review approved and published to expert profile.');
    } else if (action === 'dismiss') {
      setModerations(moderations.map(m => m.id === id ? { ...m, status: 'DISMISSED', flagged: false } : m));
      triggerToast('Moderation flag dismissed.');
    }
  };

  // Dispute resolution helper
  const handleResolveDispute = (disputeId, action) => {
    setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: action === 'resolve' ? 'RESOLVED' : 'ESCALATED' } : d));
    setSelectedDispute(null);
    triggerToast(`Dispute ${disputeId} has been ${action === 'resolve' ? 'resolved' : 'escalated to legal PMO board'}.`);
  };

  return (
    <div className="flex min-h-screen bg-[#070908] text-gray-200 overflow-hidden relative font-sans selection:bg-[#0eb59a] selection:text-white">
      {/* ── BACKGROUND OVERLAYS ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#070e0b] via-[#0d1c17] to-[#040807] z-0" />
      
      {/* ExigentCX White Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#0eb59a]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#134e40]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ── SIDEBAR PANEL ── */}
      <aside className="w-68 bg-[#090d0b]/80 border-r border-[#15231c] flex flex-col justify-between z-10 backdrop-blur-xl relative">
        {/* Subtle grid pattern inside sidebar */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10">
          {/* Header Logo */}
          <div className="px-6 py-6 border-b border-[#15231c] flex items-center gap-3">
            <Logo variant="dark" className="h-9" />
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-sm tracking-[0.15em] font-serif uppercase">
                ExigentCX
              </span>
              <span className="text-[10px] text-[#0eb59a] font-bold tracking-widest uppercase">
                Admin Console
              </span>
            </div>
          </div>

          {/* Vetting & PMO Tag */}
          <div className="px-6 py-4">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.25em]">
              Vetting & PMO Panel
            </span>
          </div>

          {/* Navigation Options */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'vetting', label: 'Talent Vetting', icon: UserCheck },
              { id: 'governance', label: 'Governance', icon: ShieldAlert },
              { id: 'trust', label: 'Trust', icon: Lock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'governance' || tab.id === 'trust') {
                    fetchEscrows();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative font-medium text-sm group ${
                  activeTab === tab.id 
                    ? 'bg-[#134e40]/45 text-white shadow-[0_0_15px_rgba(14,181,154,0.08)] border border-[#0eb59a]/30'
                    : 'text-gray-400 hover:bg-[#0c1310]/50 hover:text-white border border-transparent'
                }`}
              >
                {activeTab === tab.id && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#0eb59a] rounded-r-full shadow-[0_0_8px_#0eb59a]" />
                )}
                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-[#0eb59a]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#15231c] space-y-3 relative z-10 bg-[#090d0b]/40">
          <button 
            onClick={() => triggerToast('System status check: All services operational.')}
            className="w-full py-3 px-4 rounded-xl bg-[#134e40]/15 hover:bg-[#134e40]/30 text-[#0eb59a] border border-[#0eb59a]/20 transition-all font-bold text-xs tracking-wider uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer text-center"
          >
            Create Report
          </button>
          
          <div className="space-y-1">
            <button 
              onClick={() => triggerToast('System Status: Operational. Database: Connected. Escrows: Secured.', 'success')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-semibold cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-[#0eb59a]" />
              <span>System Status</span>
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* ── TOP HEADER BAR ── */}
        <header className="h-20 border-b border-[#15231c] bg-[#070908]/60 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          {/* Header Search Field */}
          <div className="w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder={`Search admin console...`} 
              className="w-full bg-[#0c0f0d] border border-[#1b2520] focus:border-[#0eb59a]/60 focus:ring-1 focus:ring-[#0eb59a]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 transition-all outline-none"
            />
          </div>

          {/* User & Global Actions */}
          <div className="flex items-center gap-4">
            {/* Navigation tags */}
            <div className="flex gap-4 border-r border-[#15231c] pr-6 text-xs text-gray-400 font-semibold">
              <span className="text-white border-b-2 border-[#0eb59a] pb-1 cursor-pointer">Overview</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => triggerToast('Opening system reports list...')}>Reports</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => triggerToast('Real-time feed listener active.')}>Real-time</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification icon */}
              <button 
                onClick={() => triggerToast('You have 3 unread system alerts.')}
                className="w-9 h-9 rounded-xl border border-[#1b2520] bg-[#0c0f0d] hover:bg-[#134e40]/25 hover:border-[#0eb59a]/30 text-gray-400 hover:text-white flex items-center justify-center transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0eb59a]" />
              </button>

              {/* Settings icon */}
              <button 
                onClick={() => triggerToast('Opening administrator console settings...')}
                className="w-9 h-9 rounded-xl border border-[#1b2520] bg-[#0c0f0d] hover:bg-[#134e40]/25 hover:border-[#0eb59a]/30 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* User Avatar */}
              <div 
                className="flex items-center gap-2.5 border border-[#1b2520] bg-[#0c0f0d]/60 rounded-xl px-3 py-1.5 hover:border-[#0eb59a]/30 transition-all cursor-default"
                title={`Admin Session: ${adminEmail}`}
              >
                <div className="w-6.5 h-6.5 rounded-lg bg-[#134e40] text-[#0eb59a] flex items-center justify-center font-bold text-xs">
                  AD
                </div>
                <div className="flex flex-col text-[10px]">
                  <span className="text-white font-bold tracking-wide">Admin Portal</span>
                  <span className="text-gray-500 font-mono scale-[0.95] origin-left truncate max-w-[80px]">{adminEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── VIEW CONTENT viewport ── */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          <AnimatePresence mode="wait">
            
            {/* ── TAB 1: ANALYTICS DASHBOARD ── */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 max-w-6xl mx-auto"
              >
                {/* Title Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black font-serif tracking-tight text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-400 text-sm font-light">Real-time performance monitoring and talent supply insights.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={() => triggerToast('Analytics date window restricted to last 30 days.')} className="px-4 py-2 border border-[#1b2520] bg-[#0c0f0d] hover:border-[#0eb59a]/30 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Last 30 Days</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button onClick={() => triggerToast('Generating CSV data audit package...')} className="px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Export Data</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {[
                    { title: 'Total Revenue', value: '$1.24M', change: '+12.4%', up: true, desc: 'Month-over-month growth' },
                    { title: 'Active Talent', value: '4,812', change: '+8.2%', up: true, desc: 'Verified professionals' },
                    { title: 'Success Rate', value: '94.2%', change: '+3.1%', up: true, desc: 'Placement match accuracy' },
                    { title: 'Avg. Margin', value: '18.5%', change: '-2.4%', up: false, desc: 'Platform service commission' }
                  ].map((kpi, idx) => (
                    <div key={idx} className="bg-[#0c0f0d]/80 border border-[#1b2520] hover:border-[#0eb59a]/35 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 relative group">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0eb59a]/0 to-transparent group-hover:via-[#0eb59a]/40 transition-all duration-700" />
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">{kpi.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          kpi.up ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black font-serif text-white tracking-tight mb-1">{kpi.value}</h3>
                      <p className="text-[10px] text-gray-500">{kpi.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Supply vs Demand + Engagement success grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Custom SVG Bar Chart */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 lg:col-span-2 backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-md font-bold text-white tracking-tight font-serif">Supply vs Demand</h3>
                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#134e40]" />
                            <span>Demand</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#0eb59a]" />
                            <span>Supply</span>
                          </span>
                        </div>
                      </div>

                      {/* SVG Bar Chart Visualization */}
                      <div className="h-56 w-full flex items-end justify-between relative px-2">
                        {/* Y-axis helper lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.05] z-0">
                          <div className="h-px bg-white w-full" />
                          <div className="h-px bg-white w-full" />
                          <div className="h-px bg-white w-full" />
                          <div className="h-px bg-white w-full" />
                        </div>
                        
                        {/* Jan */}
                        <div className="flex-1 flex flex-col items-center gap-2 z-10 group/bar">
                          <div className="flex items-end gap-1.5 h-36">
                            <div className="w-3.5 bg-[#134e40] rounded-t hover:bg-[#134e40]/80 transition-colors" style={{ height: '55%' }} title="Demand: 45" />
                            <div className="w-3.5 bg-[#0eb59a] rounded-t hover:bg-emerald-400 transition-colors" style={{ height: '50%' }} title="Supply: 40" />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold tracking-widest font-mono">JAN</span>
                        </div>
                        {/* Feb */}
                        <div className="flex-1 flex flex-col items-center gap-2 z-10 group/bar">
                          <div className="flex items-end gap-1.5 h-36">
                            <div className="w-3.5 bg-[#134e40] rounded-t" style={{ height: '65%' }} title="Demand: 55" />
                            <div className="w-3.5 bg-[#0eb59a] rounded-t" style={{ height: '60%' }} title="Supply: 50" />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold tracking-widest font-mono">FEB</span>
                        </div>
                        {/* Mar */}
                        <div className="flex-1 flex flex-col items-center gap-2 z-10 group/bar">
                          <div className="flex items-end gap-1.5 h-36">
                            <div className="w-3.5 bg-[#134e40] rounded-t" style={{ height: '80%' }} title="Demand: 70" />
                            <div className="w-3.5 bg-[#0eb59a] rounded-t" style={{ height: '80%' }} title="Supply: 70" />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold tracking-widest font-mono">MAR</span>
                        </div>
                        {/* Apr */}
                        <div className="flex-1 flex flex-col items-center gap-2 z-10 group/bar">
                          <div className="flex items-end gap-1.5 h-36">
                            <div className="w-3.5 bg-[#134e40] rounded-t" style={{ height: '60%' }} title="Demand: 50" />
                            <div className="w-3.5 bg-[#0eb59a] rounded-t" style={{ height: '58%' }} title="Supply: 48" />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold tracking-widest font-mono">APR</span>
                        </div>
                        {/* May */}
                        <div className="flex-1 flex flex-col items-center gap-2 z-10 group/bar">
                          <div className="flex items-end gap-1.5 h-36">
                            <div className="w-3.5 bg-[#134e40] rounded-t" style={{ height: '95%' }} title="Demand: 85" />
                            <div className="w-3.5 bg-[#0eb59a] rounded-t" style={{ height: '95%' }} title="Supply: 80" />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold tracking-widest font-mono">MAY</span>
                        </div>
                        {/* Jun */}
                        <div className="flex-1 flex flex-col items-center gap-2 z-10 group/bar">
                          <div className="flex items-end gap-1.5 h-36">
                            <div className="w-3.5 bg-[#134e40] rounded-t" style={{ height: '90%' }} title="Demand: 80" />
                            <div className="w-3.5 bg-[#0eb59a] rounded-t" style={{ height: '85%' }} title="Supply: 75" />
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold tracking-widest font-mono">JUN</span>
                        </div>
                      </div>
                    </div>

                    {/* Market saturation tags */}
                    <div className="grid grid-cols-2 gap-4 mt-6 border-t border-[#15231c] pt-5">
                      <div className="p-3 bg-[#134e40]/10 border border-[#134e40]/25 rounded-xl">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#0eb59a] block mb-1">Hottest Market</span>
                        <span className="text-xs font-bold text-white block mb-0.5">Data Engineering</span>
                        <span className="text-[9px] text-[#0eb59a] font-semibold">42% Talent Deficit</span>
                      </div>
                      <div className="p-3 bg-red-950/10 border border-red-500/15 rounded-xl">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-red-400 block mb-1">Supply Saturation</span>
                        <span className="text-xs font-bold text-white block mb-0.5">Graphic Design</span>
                        <span className="text-[9px] text-red-450 text-red-400 font-semibold">Over-saturated (112%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Success Card */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <h3 className="text-md font-bold text-white tracking-tight font-serif mb-5">Engagement Success</h3>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'Full-Time Placements', val: '98%', progress: 98 },
                          { name: 'Contract Projects', val: '82%', progress: 82 },
                          { name: 'Interim Management', val: '76%', progress: 76 },
                          { name: 'Advisory Sessions', val: '91%', progress: 91 }
                        ].map((ratio, index) => (
                          <div key={index} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-gray-400">{ratio.name}</span>
                              <span className="text-white font-mono">{ratio.val}</span>
                            </div>
                            <div className="h-2 w-full bg-[#080b09] rounded-full overflow-hidden border border-[#1b2520]">
                              <div 
                                className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full"
                                style={{ width: `${ratio.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insight Box */}
                    <div className="mt-6 p-4 rounded-xl bg-[#0d1612] border border-[#152e25] flex items-start gap-3">
                      <div className="w-7 h-7 bg-[#0eb59a]/15 text-[#0eb59a] rounded-lg flex items-center justify-center shrink-0 border border-[#0eb59a]/25">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[10px]">
                        <span className="font-extrabold text-white block mb-1">Insight: High Conversion</span>
                        <p className="text-gray-400 leading-relaxed font-light">AI roles convert 3x faster than average this quarter. Re-routing vetting queues.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Segment Table */}
                <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl overflow-hidden backdrop-blur-md">
                  <div className="px-6 py-5 border-b border-[#15231c] flex justify-between items-center bg-[#090d0b]/40">
                    <h3 className="text-md font-bold text-white tracking-tight font-serif">Revenue by Segment</h3>
                    <button onClick={() => triggerToast('Loading comprehensive segment audit ledger...')} className="text-[#0eb59a] hover:text-emerald-400 transition-colors text-xs font-bold tracking-wide flex items-center gap-1 cursor-pointer">
                      <span>View Detailed Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080c0a] text-gray-500 font-bold uppercase tracking-[0.1em] border-b border-[#15231c]">
                        <tr>
                          <th className="px-6 py-4">Client Category</th>
                          <th className="px-6 py-4">Monthly Revenue</th>
                          <th className="px-6 py-4">Growth</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Top Talent Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#15231c] text-gray-300">
                        {[
                          { category: 'Enterprise Tech', revenue: '$542,000', growth: '+15.2%', status: 'STABLE', statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', role: 'Cloud Architect' },
                          { category: 'FinTech Startups', revenue: '$291,500', growth: '+28.4%', status: 'ACCELERATING', statusColor: 'text-teal-400 bg-teal-500/10 border-teal-500/25', role: 'Compliance Officer' },
                          { category: 'Retail Logistics', revenue: '$188,200', growth: '-4.1%', status: 'CORRECTION', statusColor: 'text-orange-400 bg-orange-500/10 border-orange-500/25', role: 'Supply Chain Lead' },
                          { category: 'Healthcare Services', revenue: '$212,300', growth: '+2.3%', status: 'STABLE', statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', role: 'HIPAA Expert' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#0c1310]/30 transition-colors">
                            <td className="px-6 py-4.5 font-bold text-white text-sm">{row.category}</td>
                            <td className="px-6 py-4.5 font-mono font-medium">{row.revenue}</td>
                            <td className={`px-6 py-4.5 font-bold font-mono ${row.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{row.growth}</td>
                            <td className="px-6 py-4.5">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wide uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${row.statusColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-gray-400 font-medium">{row.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Promo Panels */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Predictive Vetting Card (Left 3 cols) */}
                  <div className="bg-gradient-to-br from-[#091512] via-[#0c241c] to-[#070e0b] border border-[#18392d] hover:border-[#0eb59a]/50 rounded-2xl p-6 md:col-span-3 backdrop-blur-md flex flex-col md:flex-row justify-between items-center relative overflow-hidden group transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0eb59a]/10 via-transparent to-transparent opacity-80" />
                    
                    <div className="space-y-4 relative z-10 max-w-sm">
                      <span className="px-2.5 py-0.5 rounded bg-[#0eb59a]/15 text-[#0eb59a] border border-[#0eb59a]/25 text-[9px] font-extrabold uppercase tracking-widest block w-fit">
                        Platform Update
                      </span>
                      <h4 className="text-xl font-bold font-serif text-white tracking-tight leading-snug">New Predictive Vetting Engine</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                        Our proprietary AI network now predicts placement success with <strong className="text-white font-bold">92% accuracy</strong> across global tech verticals by analyzing structural culture fit.
                      </p>
                    </div>

                    {/* Network graphics visualization */}
                    <div className="relative shrink-0 w-36 h-36 border border-[#16362a] bg-[#070e0b]/80 rounded-full flex items-center justify-center mt-4 md:mt-0 shadow-lg">
                      <div className="absolute inset-2 border border-dashed border-[#134e40] rounded-full animate-[spin_20s_linear_infinite]" />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0eb59a] animate-ping" />
                      <div className="w-8 h-8 rounded bg-[#134e40] flex items-center justify-center text-[#0eb59a] font-bold border border-[#0eb59a]/35 shadow-md">
                        AI
                      </div>
                      <div className="absolute top-6 left-6 w-1.5 h-1.5 bg-[#0eb59a] rounded-full shadow-[0_0_8px_#0eb59a]" />
                      <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-[#0eb59a] rounded-full shadow-[0_0_8px_#0eb59a]" />
                    </div>
                  </div>

                  {/* Governance Audit Card (Right 2 cols) */}
                  <div className="bg-gradient-to-br from-[#0a1815] to-[#0c0f0d] border border-[#122e28] hover:border-[#0eb59a]/40 rounded-2xl p-6 md:col-span-2 backdrop-blur-md flex flex-col justify-between relative overflow-hidden transition-all duration-300">
                    <div className="space-y-3">
                      <h4 className="text-md font-bold font-serif text-white tracking-tight">Governance Audit Status</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-teal-600 border border-black flex items-center justify-center font-bold text-[8px]">U1</div>
                          <div className="w-6 h-6 rounded-full bg-purple-600 border border-black flex items-center justify-center font-bold text-[8px]">U2</div>
                          <div className="w-6 h-6 rounded-full bg-amber-600 border border-black flex items-center justify-center font-bold text-[8px]">+12</div>
                        </div>
                        <p className="text-gray-400 font-light text-[10px]">PMO team currently auditing Q3 talent pool compliance.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-[#070c09] border border-[#134e40]/25 rounded-xl p-3 text-center">
                        <span className="text-[8px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">Compliance</span>
                        <span className="text-lg font-black font-mono text-[#0eb59a]">100%</span>
                      </div>
                      <div className="bg-[#0c0908] border border-red-500/15 rounded-xl p-3 text-center">
                        <span className="text-[8px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">Pending Flags</span>
                        <span className="text-lg font-black font-mono text-red-400">03</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: TALENT VETTING ── */}
            {activeTab === 'vetting' && (
              <motion.div
                key="vetting"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                {/* Title */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black font-serif tracking-tight text-white mb-2">Application Vetting</h1>
                    <p className="text-gray-400 text-sm font-light">Reviewing pending senior talent applications.</p>
                  </div>
                  
                  {/* Filter / Search Actions */}
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Search candidate name..."
                        value={vettingSearch}
                        onChange={(e) => setVettingSearch(e.target.value)}
                        className="bg-[#0c0f0d] border border-[#1b2520] focus:border-[#0eb59a]/60 rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder-gray-500 outline-none w-48"
                      />
                    </div>
                    <button className="px-3.5 py-2 border border-[#1b2520] bg-[#0c0f0d] hover:border-[#0eb59a]/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                      <Filter className="w-3.5 h-3.5 text-gray-500" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Pane Split */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left: Pending Review List (3 cols) */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-5 backdrop-blur-md lg:col-span-3 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#15231c] pb-3 mb-2">
                      <h3 className="text-sm font-bold text-white tracking-wider font-serif">Pending Review Queue</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#0eb59a]/15 text-[#0eb59a] text-[10px] font-extrabold">12 Priority</span>
                    </div>

                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {candidates
                        .filter(c => c.name.toLowerCase().includes(vettingSearch.toLowerCase()))
                        .map(candidate => {
                          const isSelected = selectedCandidate.id === candidate.id;
                          return (
                            <div
                              key={candidate.id}
                              onClick={() => handleSelectCandidate(candidate)}
                              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex justify-between items-center relative overflow-hidden group ${
                                isSelected 
                                  ? 'bg-[#134e40]/30 border-[#0eb59a] shadow-md shadow-[#0eb59a]/5'
                                  : 'bg-[#090b0a]/80 border-[#1b2520] hover:border-[#0eb59a]/30'
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                {/* Avatar initials bubble */}
                                <div className={`w-10 h-10 rounded-xl ${candidate.color} text-white font-extrabold flex items-center justify-center text-sm shadow-md`}>
                                  {candidate.avatar}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-white font-bold text-sm leading-snug group-hover:text-[#0eb59a] transition-colors">{candidate.name}</h4>
                                  <p className="text-[10px] text-gray-500 font-medium">{candidate.role} • {candidate.exp}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3.5">
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-gray-400 block font-mono">★ {candidate.score}/100</span>
                                  <span className="text-[9px] text-gray-500 block font-mono">{candidate.time}</span>
                                </div>

                                <span className={`px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider uppercase ${
                                  candidate.status === 'Approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                                  candidate.status === 'Rejected' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                                  candidate.status === 'Flagged' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
                                  'text-teal-400 bg-teal-500/10 border-teal-500/20'
                                }`}>
                                  {candidate.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right: Selected Candidate Profile Detail Sheet (2 cols) */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 backdrop-blur-md lg:col-span-2 flex flex-col justify-between">
                    <div>
                      {/* Avatar Header */}
                      <div className="flex items-start justify-between border-b border-[#15231c] pb-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-2xl ${selectedCandidate.color} text-white font-extrabold flex items-center justify-center text-lg shadow-lg`}>
                            {selectedCandidate.avatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white leading-snug">{selectedCandidate.name}</h3>
                            <p className="text-[10px] text-[#0eb59a] font-bold uppercase tracking-wider">{selectedCandidate.role}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{selectedCandidate.exp}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button onClick={() => triggerToast(`Profile Link copied for ${selectedCandidate.name}.`)} className="w-8 h-8 rounded-lg border border-[#1b2520] hover:border-[#0eb59a]/30 text-gray-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => triggerToast('Opening admin quick actions...')} className="w-8 h-8 rounded-lg border border-[#1b2520] hover:border-[#0eb59a]/30 text-gray-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Vetting Score Pill and Skills */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block mb-2">Technical Skills</span>
                          <div className="flex gap-2.5 flex-wrap">
                            {selectedCandidate.skills.map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 rounded bg-[#134e40]/20 border border-[#152e25] text-xs font-bold text-white">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Notes input */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block">Vetting Assessment Notes</span>
                          <textarea
                            value={vettingNotes}
                            onChange={(e) => setVettingNotes(e.target.value)}
                            rows={3}
                            className="w-full bg-[#090b0a] border border-[#1b2520] focus:border-[#0eb59a]/60 rounded-xl p-3 text-xs text-white placeholder-gray-500 outline-none resize-none font-sans leading-relaxed"
                          />
                          <button 
                            onClick={saveCandidateNotes}
                            className="px-3.5 py-1.5 bg-[#134e40]/30 hover:bg-[#134e40]/60 border border-[#0eb59a]/20 hover:border-[#0eb59a]/40 text-[#0eb59a] hover:text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ml-auto block cursor-pointer"
                          >
                            Save Notes
                          </button>
                        </div>

                        {/* Metrics score bars */}
                        <div className="space-y-3">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block">Assessment Scores</span>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-semibold">
                                <span className="text-gray-400">Algorithmic capability</span>
                                <span className="text-white font-bold font-mono">9.5/10</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#080b09] rounded-full overflow-hidden border border-[#1b2520]">
                                <div className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full" style={{ width: '95%' }} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-semibold">
                                <span className="text-gray-400">Collaboration & Teamwork</span>
                                <span className="text-white font-bold font-mono">8.2/10</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#080b09] rounded-full overflow-hidden border border-[#1b2520]">
                                <div className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full" style={{ width: '82%' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer decision buttons */}
                    <div className="grid grid-cols-2 gap-4 mt-6 border-t border-[#15231c] pt-5">
                      <button
                        onClick={() => handleVettingDecision('Rejected')}
                        className="py-2.5 rounded-xl border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-400 hover:text-white transition-all text-xs font-bold tracking-wider uppercase cursor-pointer"
                      >
                        Reject Applicant
                      </button>
                      <button
                        onClick={() => handleVettingDecision('Approved')}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-[#134e40] to-[#0eb59a] border border-[#0eb59a]/20 hover:brightness-115 text-white transition-all text-xs font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#0eb59a]/5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Talent</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vetting KPI Metrics Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block mb-0.5">Vetting Velocity</span>
                      <h4 className="text-2xl font-black font-serif text-white tracking-tight">14.2 /day</h4>
                    </div>
                    <div className="h-2 w-16 bg-[#080b09] border border-[#1b2520] rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-[#0eb59a]" style={{ width: '70%' }} />
                    </div>
                  </div>

                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block mb-0.5">Approval Rate</span>
                      <h4 className="text-2xl font-black font-serif text-white tracking-tight">68%</h4>
                      <span className="text-[9px] text-[#0eb59a] font-bold font-mono">+5% vs last month</span>
                    </div>
                    <div className="h-2 w-16 bg-[#080b09] border border-[#1b2520] rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-[#0eb59a]" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block mb-0.5">Vetting Load</span>
                      <h4 className="text-2xl font-black font-serif text-[#0eb59a] tracking-tight">Optimal</h4>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 3: GOVERNANCE & TRUST PANEL ── */}
            {activeTab === 'governance' && (
              <motion.div
                key="governance"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                {/* Title Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black font-serif tracking-tight text-white mb-2">Governance & Trust Panel</h1>
                    <p className="text-gray-400 text-sm font-light">Oversee dispute resolutions, financial security, and community integrity.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={() => { fetchEscrows(); triggerToast('Escrow data refreshed.', 'success'); }} className="px-4 py-2 border border-[#1b2520] bg-[#0c0f0d] hover:border-[#0eb59a]/35 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-white">
                      <RefreshCw className="w-3.5 h-3.5 text-[#0eb59a]" />
                      <span>Refresh</span>
                    </button>
                    <button onClick={() => triggerToast('Governance Audit log exported.')} className="px-4 py-2 border border-[#1b2520] bg-[#0c0f0d] hover:border-[#0eb59a]/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                      <span>Export Audit Log</span>
                    </button>
                    <button onClick={() => triggerToast('Launching policy creation console...')} className="px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Policy</span>
                    </button>
                  </div>
                </div>

                {/* Disputes list + Escrow watcher split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Open Disputes List (2 cols) */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl overflow-hidden backdrop-blur-md lg:col-span-2">
                    <div className="px-6 py-5 border-b border-[#15231c] flex justify-between items-center bg-[#090d0b]/40">
                      <div className="flex items-center gap-3.5">
                        <Gavel className="w-4 h-4 text-[#0eb59a]" />
                        <h3 className="text-sm font-bold text-white tracking-tight font-serif">Open Disputes</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">12 Active Cases</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#080c0a] text-gray-500 font-bold uppercase tracking-[0.08em] border-b border-[#15231c]">
                          <tr>
                            <th className="px-6 py-3.5">Case ID</th>
                            <th className="px-6 py-3.5">Involved Parties</th>
                            <th className="px-6 py-3.5">Subject</th>
                            <th className="px-6 py-3.5">Severity</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#15231c] text-gray-300">
                          {disputes.map((dispute, idx) => (
                            <tr key={idx} className="hover:bg-[#0c1310]/30 transition-colors">
                              <td className="px-6 py-4 font-mono font-bold text-[#0eb59a]">{dispute.id}</td>
                              <td className="px-6 py-4 font-semibold text-white">{dispute.parties}</td>
                              <td className="px-6 py-4 text-gray-400 font-medium">{dispute.subject}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider border uppercase ${
                                  dispute.severity === 'CRITICAL' 
                                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.15)]' 
                                    : 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                                }`}>
                                  {dispute.severity}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => setSelectedDispute(dispute)}
                                  className="px-3.5 py-1.5 border border-[#0eb59a]/20 hover:border-[#0eb59a] bg-[#134e40]/10 hover:bg-[#134e40]/30 text-[#0eb59a] hover:text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                                >
                                  Review Case
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Escrow Watcher and High-Trust widgets */}
                  <div className="space-y-6">
                    {/* Escrow watch card */}
                    <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0eb59a]/10 to-transparent" />
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-[#0eb59a]" />
                          <span>Escrow Watch</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                          Funds Secured
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-gray-500 block mb-0.5">Project ID</span>
                          <span className="text-white font-extrabold text-sm block">
                            {selectedEscrow ? `PROJECT #ENG-${selectedEscrow.id}` : 'PROJECT #PR-441'}
                          </span>
                          <h4 className="text-2xl font-black font-mono text-white tracking-tight mt-1">
                            {selectedEscrow ? selectedEscrow.pendingMilestoneAmount : '₹0.00'}
                          </h4>
                        </div>

                        <div className="p-3 bg-[#0d1612] border border-[#152e25] rounded-xl text-[10px] leading-relaxed">
                          <span className="font-extrabold text-white block mb-1">
                            {selectedEscrow ? `Milestone: ${selectedEscrow.pendingMilestone}` : 'Milestone: None'}
                          </span>
                          <p className="text-gray-400 font-light">
                            {selectedEscrow && selectedEscrow.pendingMilestoneStatus === "pending_admin_release"
                              ? `Milestone approval request submitted by company. Verification by administrator required for final payout escrow authorization release to ${selectedEscrow.expert}.`
                              : selectedEscrow && selectedEscrow.pendingMilestone !== "None"
                              ? `Milestone is currently active (${selectedEscrow.pendingMilestoneStatus}). Awaiting company approval.`
                              : "No pending escrow release requests found for this engagement."}
                          </p>
                        </div>

                        {selectedEscrow && selectedEscrow.pendingMilestoneStatus === "pending_admin_release" && (
                          !escrowReleased ? (
                            <button
                              onClick={() => handleReleaseEscrow(selectedEscrow.id)}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#134e40] to-[#0eb59a] border border-[#0eb59a]/20 hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#0eb59a]/5 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Authorize Release</span>
                            </button>
                          ) : (
                            <div className="w-full py-2.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-450 font-bold text-xs tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Escrow Released</span>
                            </div>
                          )
                        )}

                        <div className="grid grid-cols-2 gap-2 border-t border-[#15231c] pt-4 text-center">
                          <div>
                            <span className="text-[9px] text-gray-500 block">Total Managed</span>
                            <span className="text-xs font-bold text-white font-mono">
                              ₹{escrows.reduce((acc, curr) => acc + (curr.balanceNum || 0), 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">Pending Releases</span>
                            <span className="text-xs font-bold text-[#0eb59a] font-mono">
                              {escrows.filter(e => e.pendingMilestoneStatus === "pending_admin_release").length.toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* High trust Zone */}
                    <div className="bg-gradient-to-br from-[#091512] to-[#070c0a] border border-[#142e24] rounded-2xl p-5 flex items-start gap-3.5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0eb59a]/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="w-9 h-9 bg-[#0eb59a]/15 text-[#0eb59a] rounded-xl flex items-center justify-center shrink-0 border border-[#0eb59a]/25 shadow-md">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">High-Trust Zone</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-light">All escrow contracts are backed by Multi-Sig Governance protocols and automated AML compliance pipelines.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[8px] font-bold text-[#0eb59a] uppercase tracking-widest font-mono">Live Node Status: Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispute details popover details modal if selected */}
                <AnimatePresence>
                  {selectedDispute && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0c0f0d] border border-[#1b2520] rounded-2xl p-6 max-w-md w-full text-left"
                      >
                        <h3 className="text-lg font-bold text-white mb-2 font-serif">Dispute Review: {selectedDispute.id}</h3>
                        <p className="text-xs text-gray-400 mb-4 font-light">Verify case and render compliance verdict.</p>
                        
                        <div className="space-y-4 bg-[#070908] p-4 rounded-xl border border-[#15231c] text-xs leading-relaxed mb-6">
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-semibold">Parties:</span>
                            <span className="text-white font-bold">{selectedDispute.parties}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-semibold">Subject:</span>
                            <span className="text-white font-bold">{selectedDispute.subject}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-semibold">Severity:</span>
                            <span className="text-red-400 font-bold font-mono">{selectedDispute.severity}</span>
                          </div>
                          <div className="border-t border-[#15231c] pt-2 mt-2">
                            <span className="text-gray-500 font-semibold block mb-1">Dispute Summary:</span>
                            <p className="text-gray-400 font-light font-sans leading-relaxed">Client alleges that the developer increased scope requirements beyond the agreed GTM deck deliverables, requesting additional milestones without approval.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleResolveDispute(selectedDispute.id, 'escalate')}
                            className="py-2.5 rounded-xl border border-orange-500/20 hover:border-orange-500 bg-orange-500/5 text-orange-400 hover:text-white transition-all text-xs font-bold tracking-wider uppercase cursor-pointer"
                          >
                            Escalate Case
                          </button>
                          <button
                            onClick={() => handleResolveDispute(selectedDispute.id, 'resolve')}
                            className="py-2.5 rounded-xl bg-gradient-to-r from-[#134e40] to-[#0eb59a] hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                          >
                            Resolve Dispute
                          </button>
                        </div>
                        <button 
                          onClick={() => setSelectedDispute(null)}
                          className="mt-4 text-center text-xs text-gray-500 hover:text-white transition-colors w-full block font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Review Moderation Grid */}
                <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 backdrop-blur-md space-y-5">
                  <div className="flex justify-between items-center border-b border-[#15231c] pb-4">
                    <h3 className="text-sm font-bold text-white tracking-tight font-serif">Review Moderation Queue</h3>
                    <span className="text-[10px] text-gray-400 font-semibold">Moderation actions are immediate and published directly.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {moderations.map((mod) => (
                      <div 
                        key={mod.id}
                        className={`bg-[#070908] border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${
                          mod.flagged 
                            ? 'border-red-500/25 bg-red-950/5' 
                            : 'border-[#1b2520] hover:border-[#0eb59a]/25'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-bold text-sm leading-snug">{mod.author}</h4>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < mod.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <span className={`px-2 py-0.5 rounded border text-[8px] font-bold font-mono tracking-wider ${
                              mod.status === 'NEW' ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' :
                              mod.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                              'text-red-400 bg-red-500/10 border-red-500/20'
                            }`}>
                              {mod.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-400 leading-relaxed font-light italic font-sans">
                            "{mod.review}"
                          </p>
                        </div>

                        {/* Moderation Controls */}
                        <div className="flex gap-2.5 border-t border-[#15231c] pt-3 mt-4">
                          {mod.flagged ? (
                            <>
                              <button
                                onClick={() => handleReviewAction(mod.id, 'delete')}
                                className="flex-1 py-1.5 bg-red-950/20 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                              >
                                Delete Review
                              </button>
                              <button
                                onClick={() => handleReviewAction(mod.id, 'dismiss')}
                                className="flex-1 py-1.5 border border-[#1b2520] hover:border-white text-gray-400 hover:text-white rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                              >
                                Dismiss
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleReviewAction(mod.id, 'approve')}
                                className="flex-1 py-1.5 bg-[#134e40]/20 hover:bg-[#0eb59a] border border-[#0eb59a]/20 text-[#0eb59a] hover:text-white rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setModerations(moderations.map(m => m.id === mod.id ? { ...m, flagged: true, status: 'FLAGGED' } : m));
                                  triggerToast('Review flagged for investigation.', 'warning');
                                }}
                                className="py-1.5 px-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                                title="Flag Review"
                              >
                                Flag
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 4: TRUST & FINANCIAL AUDIT ── */}
            {activeTab === 'trust' && (
              <motion.div
                key="trust"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                {/* Title */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black font-serif tracking-tight text-white mb-2">Revenue & Engagement Detail</h1>
                    <p className="text-gray-400 text-sm font-light">In-depth performance audit of financial streams, escrow liquidity, and placement efficiency.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex bg-[#0c0f0d] border border-[#1b2520] p-1 rounded-xl text-xs">
                      {['30D', '90D', '6M', '1Y'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTimeRange(t)}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            timeRange === t 
                              ? 'bg-[#134e40] text-white shadow-sm' 
                              : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    
                    <button onClick={() => { fetchEscrows(); triggerToast('Audits list refreshed.', 'success'); }} className="px-3.5 py-1.5 border border-[#1b2520] bg-[#0c0f0d] hover:border-[#0eb59a]/35 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-white">
                      <RefreshCw className="w-3.5 h-3.5 text-[#0eb59a]" />
                      <span>Refresh</span>
                    </button>
                    <button onClick={() => triggerToast('Advanced audit filters activated.')} className="px-3.5 py-1.5 border border-[#1b2520] bg-[#0c0f0d] hover:border-[#0eb59a]/30 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer">
                      <Filter className="w-3.5 h-3.5 text-gray-500" />
                      <span>Advanced Filters</span>
                    </button>
                    <button onClick={() => triggerToast('Exporting financial ledger logs as CSV...')} className="px-3.5 py-1.5 bg-[#134e40] hover:bg-[#0eb59a] text-white rounded-xl text-xs font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors shadow-md">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Audit Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {[
                    { label: 'Gross Revenue', val: '$1,248,300.00', sub: '12.4% vs last period', color: 'text-white' },
                    { label: 'Escrow Liquidity', val: `₹${escrows.reduce((acc, curr) => acc + (curr.balanceNum || 0), 0).toLocaleString('en-IN')}`, sub: '100% Secured', color: 'text-[#0eb59a]' },
                    { label: 'Successful Placement', val: '87.5%', sub: '4.2% Growth Rate', color: 'text-white' },
                    { label: 'Active Engagements', val: '312', sub: '14 pending vetting', color: 'text-[#0eb59a]' }
                  ].map((card, i) => (
                    <div key={i} className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-5 backdrop-blur-md">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 block mb-2">{card.label}</span>
                      <h3 className={`text-xl font-black font-mono tracking-tight mb-1.5 ${card.color}`}>{card.val}</h3>
                      <span className="text-[9px] text-gray-500 font-semibold">{card.sub}</span>
                    </div>
                  ))}
                </div>

                {/* SVG Line Chart + Mix split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Financial Trends SVG Line Chart */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 lg:col-span-2 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-md font-bold text-white tracking-tight font-serif">Financial Trends</h3>
                      <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-[#0eb59a]" />
                          <span>Revenue</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-[#134e40]" />
                          <span>Cost</span>
                        </span>
                      </div>
                    </div>

                    {/* SVG Line Chart */}
                    <div className="h-60 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="glow-revenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0eb59a" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0eb59a" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="glow-cost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#134e40" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#134e40" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid Lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke="#1b2520" strokeWidth="1" strokeDasharray="4" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#1b2520" strokeWidth="1" strokeDasharray="4" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="#1b2520" strokeWidth="1" strokeDasharray="4" />

                        {/* Cost Line Fill */}
                        <path d="M 0 160 Q 100 145, 200 130 T 400 100 T 500 90 L 500 200 L 0 200 Z" fill="url(#glow-cost)" />
                        {/* Cost Line */}
                        <path d="M 0 160 Q 100 145, 200 130 T 400 100 T 500 90" fill="none" stroke="#134e40" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Revenue Line Fill */}
                        <path d="M 0 140 Q 100 110, 200 80 T 400 45 T 500 30 L 500 200 L 0 200 Z" fill="url(#glow-revenue)" />
                        {/* Revenue Line */}
                        <path d="M 0 140 Q 100 110, 200 80 T 400 45 T 500 30" fill="none" stroke="#0eb59a" strokeWidth="3" strokeLinecap="round" />

                        {/* Data point indicators */}
                        <circle cx="200" cy="80" r="4.5" fill="#0eb59a" stroke="#070908" strokeWidth="1.5" className="hover:scale-150 transition-transform cursor-pointer" title="Mar Revenue: $200k" />
                        <circle cx="400" cy="45" r="4.5" fill="#0eb59a" stroke="#070908" strokeWidth="1.5" className="hover:scale-150 transition-transform cursor-pointer" />
                        <circle cx="500" cy="30" r="4.5" fill="#0eb59a" stroke="#070908" strokeWidth="1.5" className="hover:scale-150 transition-transform cursor-pointer" />
                      </svg>
                      
                      {/* Chart X Labels */}
                      <div className="flex justify-between text-[9px] text-gray-500 font-bold font-mono tracking-widest mt-2 border-t border-[#1b2520] pt-2">
                        <span>JAN</span>
                        <span>FEB</span>
                        <span>MAR</span>
                        <span>APR</span>
                        <span>MAY</span>
                        <span>JUN</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Engagement Mix and health metrics */}
                  <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                    <div className="space-y-5">
                      <h3 className="text-md font-bold text-white tracking-tight font-serif">Engagement Mix</h3>
                      
                      <div className="space-y-3">
                        {[
                          { label: 'Fixed-Price Projects', val: '64%', progress: 64 },
                          { label: 'Time & Materials', val: '28%', progress: 28 },
                          { label: 'Managed Teams', val: '8%', progress: 8 }
                        ].map((mix, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold">
                              <span className="text-gray-400">{mix.label}</span>
                              <span className="text-white font-mono">{mix.val}</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#080b09] rounded-full overflow-hidden border border-[#1b2520]">
                              <div className="h-full bg-[#0eb59a] rounded-full" style={{ width: `${mix.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#15231c] pt-5 mt-5 space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vetting Health</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[#0d1612] border border-[#152e25] rounded-xl text-center">
                          <span className="text-[8px] text-gray-500 uppercase tracking-wider block mb-0.5">Pass Rate</span>
                          <span className="text-base font-black font-mono text-[#0eb59a]">94%</span>
                        </div>
                        <div className="p-3 bg-[#0d1612] border border-[#152e25] rounded-xl text-center">
                          <span className="text-[8px] text-gray-500 uppercase tracking-wider block mb-0.5">Avg. Time</span>
                          <span className="text-base font-black font-mono text-[#0eb59a]">4.2d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Engagement Audit Table */}
                <div className="bg-[#0c0f0d]/80 border border-[#1b2520] rounded-2xl overflow-hidden backdrop-blur-md">
                  <div className="px-6 py-4 border-b border-[#15231c] flex justify-between items-center bg-[#090d0b]/40">
                    <h3 className="text-sm font-bold text-white font-serif tracking-wider">Recent Engagement Audit</h3>
                    <span className="text-[10px] text-gray-500">Showing 4 of 312 engagements.</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080c0a] text-gray-500 font-bold uppercase tracking-[0.08em] border-b border-[#15231c]">
                        <tr>
                          <th className="px-6 py-3.5">Engagement ID</th>
                          <th className="px-6 py-3.5">Expert Partner</th>
                          <th className="px-6 py-3.5">Project / Engagement</th>
                          <th className="px-6 py-3.5">Escrow Balance</th>
                          <th className="px-6 py-3.5">Escrow Status</th>
                          <th className="px-6 py-3.5">Vetting</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#15231c] text-gray-300">
                        {escrows.map((escrow, idx) => (
                          <tr key={idx} className="hover:bg-[#0c1310]/30 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-white">#ENG-{escrow.id}</td>
                            <td className="px-6 py-4 font-semibold text-white">{escrow.expert}</td>
                            <td className="px-6 py-4 text-gray-400 font-medium">{escrow.engagement}</td>
                            <td className="px-6 py-4 font-mono font-medium">{escrow.balance}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider uppercase ${
                                escrow.pendingMilestoneStatus === 'pending_admin_release' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              }`}>
                                {escrow.pendingMilestoneStatus === 'pending_admin_release' ? 'PENDING ADMIN ACTION' : 'SECURED'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                                Verified
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedEscrow(escrow);
                                  setEscrowReleased(false);
                                  triggerToast(`Selected engagement #ENG-${escrow.id} details.`);
                                }}
                                className="px-3 py-1.5 border border-[#1b2520] hover:border-[#0eb59a] bg-[#0c0f0d] hover:bg-[#134e40]/20 text-gray-400 hover:text-white rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                              >
                                View Escrow
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 border-t border-[#15231c] flex items-center justify-between bg-[#090d0b]/40">
                    <span className="text-gray-500 font-medium">Showing 4 of 312 engagements</span>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-lg border border-[#1b2520] flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-colors cursor-pointer" disabled>
                        &lt;
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#134e40] text-white font-bold border border-[#0eb59a]/35 shadow-md flex items-center justify-center text-xs">
                        1
                      </button>
                      <button className="w-8 h-8 rounded-lg border border-[#1b2520] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer" onClick={() => triggerToast('Page 2 matches pending.')}>
                        2
                      </button>
                      <button className="w-8 h-8 rounded-lg border border-[#1b2520] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer" onClick={() => triggerToast('Page 3 matches pending.')}>
                        3
                      </button>
                      <button className="w-8 h-8 rounded-lg border border-[#1b2520] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors cursor-pointer" onClick={() => triggerToast('Page 2 matches pending.')}>
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* ── FOOTER PMO BANNER ── */}
        <footer className="h-14 border-t border-[#15231c] bg-[#070908]/90 backdrop-blur-md px-8 flex items-center justify-between shrink-0 text-[10px] text-gray-600 font-light relative z-10">
          <div>
            © 2026 TalentMarketplace Admin Portal. All systems operational.
          </div>
          <div className="space-x-4">
            <span className="hover:text-[#0eb59a] transition-colors cursor-pointer" onClick={() => triggerToast('Opening privacy policy documentation...')}>Data Policy</span>
            <span>•</span>
            <span className="hover:text-[#0eb59a] transition-colors cursor-pointer" onClick={() => triggerToast('Opening compliance audit log dashboard...')}>Audit Logs</span>
            <span>•</span>
            <span className="hover:text-[#0eb59a] transition-colors cursor-pointer" onClick={() => triggerToast('Opening admin support tickets console...')}>Support</span>
          </div>
        </footer>

      </main>

      {/* ── GLOBAL REAL-TIME TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl transition-all max-w-sm ${
              toastType === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/25 text-emerald-300 shadow-emerald-500/5' 
                : 'bg-amber-950/90 border-amber-500/25 text-amber-300 shadow-amber-500/5'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span className="text-xs font-semibold leading-relaxed font-sans">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
