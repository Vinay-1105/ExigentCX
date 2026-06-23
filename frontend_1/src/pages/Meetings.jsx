import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, CreditCard, BarChart2,
  ShieldCheck, MessageSquare, Calendar, ChevronRight, ChevronLeft,
  Bell, LogOut, Video, Clock, AlignLeft, Shield, AlertCircle, Trash2,
  CheckCircle2, HelpCircle, History, Sparkles, Settings, UserCircle, Briefcase, Activity, IndianRupee
} from 'lucide-react';


const Meetings = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Smart Role Detection
  const activeRole = localStorage.getItem('user_role');
  const isExpert =
    activeRole === 'expert' ||
    (activeRole !== 'company' && (
      localStorage.getItem('demo_expert') === 'true' ||
      localStorage.getItem('sb-mock-auth') === 'true'
    ));
  const isDemo = isExpert || localStorage.getItem('demo_company') === 'true';

  // Meetings State
  const [meetings, setMeetings] = useState([]);

  // Authentication Guard
  useEffect(() => {
    const checkAuth = async () => {
      if (isDemo) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate(isExpert ? '/signin?role=expert' : '/signin?role=company');
      }
    };
    checkAuth();
  }, [navigate, isDemo, isExpert]);

  // Load meetings from mock & localStorage
  useEffect(() => {
    const defaultMeetings = [
      {
        id: 101,
        title: 'Q3 GTM Strategy Execution Review',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        time: '11:00',
        duration: '45 mins',
        agenda: 'Analyze marketing spend distribution and channel conversions across paid search and influencer alignments.',
        expert: isExpert ? 'Arjun Mehta' : 'Sarah Jenkins',
        expertRole: isExpert ? 'Client Coordinator' : 'Chief Marketing Officer',
        initials: isExpert ? 'AM' : 'SJ',
        avatarColor: isExpert ? 'bg-teal-600' : 'bg-purple-500',
        meetLink: 'https://meet.google.com/cxo-connect-meeting',
        platform: 'Google Meet'
      },
      {
        id: 102,
        title: 'Series B Financial Model Auditing',
        date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 days from now
        time: '15:30',
        duration: '1 hour',
        agenda: 'Auditing LTV/CAC scenario tables, runway calculations, and preparing fundraising projection data room.',
        expert: isExpert ? 'Bruce Wayne' : 'David Chen',
        expertRole: isExpert ? 'Managing Director' : 'Interim CFO',
        initials: isExpert ? 'BW' : 'DC',
        avatarColor: isExpert ? 'bg-slate-800' : 'bg-blue-500',
        meetLink: 'https://meet.google.com/cxo-connect-meeting',
        platform: 'Google Meet'
      }
    ];

    const saved = JSON.parse(localStorage.getItem('CXO_SCHEDULED_MEETINGS') || '[]');
    setMeetings([...defaultMeetings, ...saved]);
  }, [isExpert]);

  // Navigation Items
  // Client Side
  const companyNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings', active: true },
  ];

  const expertNavItems = [
    {
      label: 'Dashboard', icon: LayoutDashboard,
      path: '/expert-dashboard'
    },
    {
      label: 'Opportunities', icon: Briefcase,
      path: '/expert-opportunities'
    },
    {
      label: 'My Engagements', icon: Activity,
      path: '/expert-engagements'
    },
    {
      label: 'Contracts', icon: FileText,
      path: '/expert-contracts'
    },
    {
      label: 'Earnings', icon: IndianRupee,
      path: '/expert-earnings'
    },
    {
      label: 'Profile', icon: UserCircle,
      path: '/expert-profile'
    },
    {
      label: 'Messages', icon: MessageSquare,
      path: '/messages'
    },
    {
      label: 'Meetings', icon: Calendar,
      path: '/meetings', active: true
    },
  ];

  const activeNavItems = isExpert ? expertNavItems : companyNavItems;

  const notifications = [
    { id: 1, title: 'Meeting Scheduled', desc: 'Sync session with Sarah Jenkins registered successfully', time: '5 min ago', unread: true, color: 'bg-emerald-500' },
    { id: 2, title: 'Compliance Approved', desc: 'NDA for Sarah Jenkins has been fully verified', time: '10 min ago', unread: true, color: 'bg-emerald-500' }
  ];

  // Delete/Cancel meeting
  const handleDeleteMeeting = (id) => {
    const updated = meetings.filter(m => m.id !== id);
    setMeetings(updated);

    // Remove from localStorage if saved there
    const saved = JSON.parse(localStorage.getItem('CXO_SCHEDULED_MEETINGS') || '[]');
    const filteredSaved = saved.filter(m => m.id !== id);
    localStorage.setItem('CXO_SCHEDULED_MEETINGS', JSON.stringify(filteredSaved));
  };

  const upcomingMeetings = meetings.filter(m => new Date(`${m.date}T${m.time}`) >= new Date());
  const pastMeetings = meetings.filter(m => new Date(`${m.date}T${m.time}`) < new Date());

  const currentMeetingsList = activeTab === 'upcoming' ? upcomingMeetings : pastMeetings;

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0d1a14] text-slate-900 font-sans flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white dark:bg-[#0a1810] border-r border-gray-100 dark:border-white/10 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
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

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {isSidebarOpen && (
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {activeNavItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${item.active
                ? 'bg-[#134e40] text-white shadow-md font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
                }`}
            >
              {item.active && (
                <motion.div
                  layoutId="activeNavMenuMeetings"
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
                {item.label || item.name}
              </motion.span>
            </motion.button>
          ))}
        </nav>

        {/* Settings pinned bottom */}
        <div className="p-3 border-t border-gray-50 dark:border-white/10 space-y-1">
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
            onClick={() => navigate(isExpert ? '/expert-settings' : '/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#134e40] transition-all"
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
              if (isExpert) {
                localStorage.removeItem('demo_expert');
              } else {
                localStorage.removeItem('demo_company');
              }
              navigate(isExpert ? '/signin?role=expert' : '/signin?role=company');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-semibold"
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
        className="transition-all duration-300 flex-1 flex flex-col min-h-screen"
        style={{ paddingLeft: isSidebarOpen ? '260px' : '68px' }}
      >

        {/* Top Header */}
        <header className="h-16 border-b border-gray-150 dark:border-white/10 bg-white dark:bg-[#0a1810] flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm shrink-0">
          <h1 className="font-black text-[#1C3627] text-lg">Scheduled Meetings ({isExpert ? 'Expert Portal' : 'Client Portal'})</h1>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#134e40] hover:bg-gray-100 transition-all border border-gray-100"
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
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl p-4 shadow-xl border border-gray-150 z-50 text-left"
                  >
                    <h3 className="font-black text-sm text-slate-800 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-gray-150 text-xs hover:bg-slate-100 transition-colors">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {n.title}
                          </p>
                          <p className="text-gray-500 mt-1">{n.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
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
        <main className="p-6 flex-1 max-w-5xl mx-auto w-full space-y-6 text-left">

          {/* Dashboard Tab Selector */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-1">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-3 text-xs font-black uppercase tracking-wider relative border-0 bg-transparent transition-colors cursor-pointer ${activeTab === 'upcoming' ? 'text-[#134e40]' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Upcoming Syncs
                {activeTab === 'upcoming' && (
                  <motion.div
                    layoutId="meetingsTabActiveBar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0eb59a] rounded-full"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-3 text-xs font-black uppercase tracking-wider relative border-0 bg-transparent transition-colors cursor-pointer ${activeTab === 'past' ? 'text-[#134e40]' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Past Sessions
                {activeTab === 'past' && (
                  <motion.div
                    layoutId="meetingsTabActiveBar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0eb59a] rounded-full"
                  />
                )}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/messages')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-[#134e40] bg-teal-50 border border-teal-150 hover:bg-teal-100 transition-all cursor-pointer"
            >
              <MessageSquare size={13} />
              Open Chats to Schedule
            </motion.button>
          </div>

          {/* Meetings Grid/List */}
          <div className="space-y-4">
            {currentMeetingsList.map((meet, idx) => (
              <motion.div
                key={meet.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-5 border border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >


                {/* Meeting details */}
                <div className="flex-1 space-y-4">

                  {/* Topic and Duration */}
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0eb59a]" />
                      {meet.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#0eb59a]" />
                        {meet.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#0eb59a]" />
                        {meet.time} ({meet.duration})
                      </span>
                    </div>
                  </div>

                  {/* Agenda */}
                  <div className="p-3 bg-slate-50 border border-gray-100 rounded-2xl flex items-start gap-2.5">
                    <AlignLeft size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {meet.agenda}
                    </p>
                  </div>
                </div>

                {/* Participant Info & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-stretch gap-4 shrink-0 border-t border-gray-50 pt-4 md:border-t-0 md:pt-0 md:pl-5 md:border-l md:border-gray-100 min-w-[220px]">

                  {/* Participant Card */}
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-10 h-10 rounded-full ${meet.avatarColor} flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-inner bg-gradient-to-tr`}>
                      {meet.initials}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-tight">
                        {isExpert ? `Client: ${meet.expert}` : `Expert: ${meet.expert}`}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold">{meet.expertRole}</p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 mt-1 w-full">
                    {activeTab === 'upcoming' ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => window.open(meet.meetLink || 'https://meet.google.com/cxo-connect-meeting', '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black bg-[#134e40] hover:bg-[#0d3f33] text-white border-0 shadow-md cursor-pointer"
                        >
                          <Video size={13} />
                          Join Meet
                        </motion.button>

                        {/* Cancellation button enabled for both roles */}
                        <button
                          onClick={() => handleDeleteMeeting(meet.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-100 bg-rose-50 transition-colors cursor-pointer"
                          title="Cancel/Delete Meeting"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 uppercase bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Completed
                      </span>
                    )}
                  </div>

                </div>

              </motion.div>
            ))}

            {currentMeetingsList.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-10 border border-gray-150 text-center flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              >

                <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mb-1">
                  <Calendar size={20} />
                </div>
                <h3 className="font-black text-slate-800 text-sm">No scheduled meetings found</h3>
                <p className="text-xs text-gray-400 font-semibold max-w-sm">
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming video sessions. Open Direct Messages to coordinate call schedules."
                    : "No past synchronization logs are recorded in your calendar yet."}
                </p>
                {activeTab === 'upcoming' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/messages')}
                    className="px-4 py-2 text-xs font-black bg-[#134e40] text-white border-0 rounded-xl shadow-md cursor-pointer"
                  >
                    Open Messages Page
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

        </main>
      </div>

    </div>
  );
};

export default Meetings;
