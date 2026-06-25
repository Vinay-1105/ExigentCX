import Logo from '../components/Logo';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, CreditCard, BarChart2,
  ShieldCheck, MessageSquare, Calendar, ChevronRight, ChevronLeft,
  Bell, LogOut, Shield, Award, AlertCircle, CheckCircle, Activity,
  Briefcase, TrendingUp, Clock, HardDrive, CheckSquare, Settings
} from 'lucide-react';

const Pmo = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const isDemo = localStorage.getItem('demo_company') === 'true';

  useEffect(() => {
    const checkAuth = async () => {
      if (isDemo) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
      }
    };
    checkAuth();
  }, [navigate, isDemo]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
  ];

  const notifications = [
    { id: 1, title: 'Compliance Approved', desc: 'NDA for Sarah Jenkins has been fully verified', time: '10 min ago', unread: true, color: 'bg-emerald-500' },
    { id: 2, title: 'Milestone Oversight Alert', desc: 'Marketing Strategy Phase 1 requires final approval', time: '1 hour ago', unread: true, color: 'bg-amber-500' },
    { id: 3, title: 'Audit Trail Exported', desc: 'Q2 escrow auditing trail successfully generated', time: '1 day ago', unread: false, color: 'bg-blue-500' },
  ];

  const pmoKPIS = [
    { title: 'Governance Score', value: '96%', sub: 'All MSAs & NDAs intact', icon: Shield, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-l-emerald-500' },
    { title: 'Audit Readiness', value: 'Compliant', sub: 'Escrow records absolute', icon: Award, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-l-blue-500' },
    { title: 'SLA Match Rate', value: '98.2%', sub: 'Expert turnaround < 4h', icon: Activity, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-l-purple-500' },
    { title: 'Contract Status', value: 'Fully Signed', sub: 'No critical liabilities', icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/20', border: 'border-l-teal-500' },
  ];

  const complianceItems = [
    { name: 'Expert NDA Executions', desc: 'Required for all experts in direct active interactions.', status: '100% Complete', verified: true, date: 'Updated 2 days ago' },
    { name: 'Master Service Agreements (MSA)', desc: 'Standard contract for milestone delivery and ownership.', status: '100% Complete', verified: true, date: 'Updated 2 days ago' },
    { name: 'Escrow Funding Integrity', desc: 'Escrow pre-funding validation before milestone launch.', status: 'Audited & Valid', verified: true, date: 'Updated today' },
    { name: 'IP Assignment Controls', desc: 'Clear IP rights handover from expert to client organization.', status: 'Fully Protected', verified: true, date: 'Updated 5 days ago' },
    { name: 'Expert Verification Reports', desc: 'Third-party reference check and identity validation.', status: 'Verified Active', verified: true, date: 'Updated 2 days ago' },
    { name: 'Milestone Completion Logs', desc: 'Audit trails of delivery evidence and releases.', status: 'On Track', verified: true, date: 'Updated today' }
  ];

  const auditLogs = [
    { action: 'Escrow Verification', expert: 'David Chen', details: 'Pre-funding check successfully passed', status: 'Passed', date: 'May 25, 2026' },
    { action: 'NDA Verification', expert: 'Sarah Jenkins', details: 'Digital signature checked & archived', status: 'Passed', date: 'May 24, 2026' },
    { action: 'IP Protection Audit', expert: 'Priya Patel', details: 'Full rights assignment checked & registered', status: 'Passed', date: 'May 23, 2026' },
    { action: 'Compliance Check', expert: 'Rajesh Sharma', details: 'Regulatory check validated', status: 'Passed', date: 'May 22, 2026' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117] text-slate-900 dark:text-gray-100 font-sans">
      
      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white dark:bg-[#1b1d24] border-r border-gray-100 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 dark:border-white/5">
          <motion.div
            animate={{ width: isSidebarOpen ? 'auto' : 0, opacity: isSidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0 flex items-center"
          >
            <div className="cursor-pointer" onClick={() => window.location.reload()}><Logo variant="dark" className="h-8" /></div>
          </motion.div>
          <motion.button
            animate={{ marginLeft: isSidebarOpen ? 'auto' : 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-gray-100 dark:hover:bg-white/10 transition-all shrink-0 border border-transparent dark:border-white/5"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {isSidebarOpen && (
            <p className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
                item.active
                  ? 'bg-[#134e40] text-white shadow-md font-bold'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white'
              }`}
            >
              {item.active && (
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
          ))}
        </nav>

        {/* Settings at the bottom */}
        <div className="p-3 border-t border-gray-50 space-y-1">
          <motion.button
            whileHover={{ x: 2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-white transition-all"
          >
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
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              if (isDemo) {
                localStorage.removeItem('demo_company');
                navigate('/');
                return;
              }
              await supabase.auth.signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
          >
            <LogOut size={17} className="shrink-0" />
            <motion.span
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap text-sm text-left font-bold"
            >
              Sign Out
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div 
        className="transition-all duration-300 min-h-screen flex flex-col"
        style={{ paddingLeft: isSidebarOpen ? '260px' : '68px' }}
      >
        
        {/* Top Header */}
        <header className="h-16 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1b1d24] flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <h1 className="font-black text-[#1C3627] dark:text-white text-lg">PMO Oversight & Compliance</h1>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-100 dark:border-white/10"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0eb59a]" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1b1d24] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-white/10 z-50 text-left"
                  >
                    <h3 className="font-black text-sm text-slate-800 dark:text-white mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                          <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${n.color}`} />
                            {n.title}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">{n.desc}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 flex-1 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#134e40] to-[#0d3f33] text-white p-6 rounded-3xl relative overflow-hidden shadow-xl text-left">
            <div className="relative z-10 max-w-lg">
              <span className="text-[10px] font-black tracking-widest uppercase bg-[#0eb59a] text-white px-3 py-1 rounded-full mb-3 inline-block">
                Oversight Panel
              </span>
              <h2 className="text-2xl font-black mb-2">Automated Compliance & Risk Safeguards</h2>
              <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
                ExigentCX provides active legal and operational oversight. Every milestone is bound by strict NDA, MSA, and pre-funded escrow protections to safeguard your organization's intellectual property and financial trust.
              </p>
            </div>
            <div className="absolute right-6 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
              <ShieldCheck size={180} />
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {pmoKPIS.map((kpi, idx) => {
              // Convert border-l to border-t for centered layout harmony
              const topBorder = kpi.border.replace('border-l-', 'border-t-4 border-t-');
              return (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-[#1b1d24] rounded-2xl p-5 border border-gray-100 dark:border-white/10 text-center flex flex-col items-center justify-center relative overflow-hidden"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                >
                  <div className={`w-9 h-9 ${kpi.bg} rounded-xl flex items-center justify-center mb-2.5 relative z-10 mx-auto`}>
                    <kpi.icon size={16} className={kpi.color} />
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 relative z-10 text-center">{kpi.title}</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-1.5 relative z-10 text-center">{kpi.value}</p>
                  <p className="text-xs text-gray-400 font-bold relative z-10 text-center">{kpi.sub}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Compliance List & Logs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2/3 - Compliance Checklist */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1b1d24] rounded-2xl p-5 border border-gray-100 dark:border-white/10 relative overflow-hidden text-left" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-[#0eb59a]" />
                <h3 className="font-black text-slate-800 dark:text-white text-sm">Escrow & Legal Safeguards Checklist</h3>
              </div>
              <p className="text-xs text-gray-400 mb-5 font-semibold">Active trackers assessing legal health and structural security across current expert engagements.</p>

              <div className="space-y-4">
                {complianceItems.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start justify-between gap-4 hover:border-teal-100 dark:hover:border-teal-500/20 hover:bg-teal-50/20 dark:hover:bg-teal-500/5 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-500" />
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">{item.desc}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.date}</p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border bg-white dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 uppercase shrink-0">
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right 1/3 - Audit Trail */}
            <div className="bg-white dark:bg-[#1b1d24] rounded-2xl p-5 border border-gray-100 dark:border-white/10 relative overflow-hidden text-left" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare size={15} className="text-[#0eb59a]" />
                <h3 className="font-black text-slate-800 dark:text-white text-sm">Real-time Compliance Audit Trail</h3>
              </div>
              <p className="text-xs text-gray-400 mb-5 font-semibold">Verified system logs demonstrating recent background checks and identity matches.</p>
 
              <div className="space-y-4">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-gray-50 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-md">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">{log.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Expert: {log.expert}</p>
                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5 leading-relaxed">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default Pmo;
