import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, CreditCard, BarChart2,
  ShieldCheck, MessageSquare, Calendar, ChevronRight, ChevronLeft,
  Bell, LogOut, Search, Send, Clock, Smile, Paperclip,
  CheckCheck, Shield, ChevronDown, Award, Sparkles, X, File, Download,
  CheckCircle, ShieldAlert, ArrowLeft, Settings, UserCircle, Briefcase, Activity, IndianRupee, Info
} from 'lucide-react';


const Messages = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Smart Role Detection
  const activeRole = localStorage.getItem('user_role');
  const isExpert = activeRole === 'expert' || localStorage.getItem('demo_expert') === 'true';
  const isDemo = isExpert || localStorage.getItem('demo_company') === 'true';

  // State Management
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // File Upload State
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Emoji list organized by categories
  const EMOJI_LIST = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘',
    '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥',
    '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔',
    '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨',
    '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷',
    '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥸', '🤠', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓',
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝',
    '🙏', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗',
    '💖', '💝', '💟', '☮️', '✨', '🔥', '💯', '💢', '💥', '💫', '💦', '🎉', '🎊', '🎈', '🏆',
    '🚀', '⭐', '🌟', '💎', '🎯', '🔑', '💡', '🎵', '🎶', '🌈', '🌊', '🌺', '🌸', '🌻', '🌹',
  ];

  // 2-Step Meeting Form State
  const [meetingStep, setMeetingStep] = useState(1);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingHour, setMeetingHour] = useState('02');
  const [meetingMinute, setMeetingMinute] = useState('00');
  const [meetingPeriod, setMeetingPeriod] = useState('PM');
  const [meetingDuration, setMeetingDuration] = useState('30 mins');
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('Google Meet');

  useEffect(() => {
    setMeetingTime(`${meetingHour}:${meetingMinute} ${meetingPeriod}`);
  }, [meetingHour, meetingMinute, meetingPeriod]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const messagesEndRef = useRef(null);

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

  // Sidebar Menu Items
  // Client Side
  const companyNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', active: true },
    { icon: Calendar, label: 'Scheduled Meetings', path: '/meetings' },
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
      path: '/messages', active: true
    },
    {
      label: 'Meetings', icon: Calendar,
      path: '/meetings'
    },
  ];

  const activeNavItems = isExpert ? expertNavItems : companyNavItems;

  const appNotifications = [
    { id: 1, title: 'Meeting Scheduled', desc: 'Sync session has been booked successfully', time: '5 min ago', unread: true, color: 'bg-emerald-500' },
    { id: 2, title: 'Document Verified', desc: 'SLA contract checks successfully validated', time: '1 hour ago', unread: true, color: 'bg-[#0eb59a]' },
  ];

  // Thread Data (Prefilled based on active role)
  const companyThreads = [
    { id: 1, name: 'Sarah Jenkins', role: 'Chief Marketing Officer', initials: 'SJ', avatarColor: 'from-purple-500 to-indigo-500', status: 'online', sub: 'Ex-CMO at TechCorp' },
    { id: 2, name: 'David Chen', role: 'Interim CFO', initials: 'DC', avatarColor: 'from-blue-500 to-cyan-500', status: 'online', sub: 'Ex-CFO, Razorpay' },
    { id: 3, name: 'Priya Patel', role: 'VP Engineering', initials: 'PP', avatarColor: 'from-teal-500 to-emerald-600', status: 'offline', sub: 'Ex-VP Eng, Flipkart' },
    { id: 4, name: 'Rajesh Sharma', role: 'Ex-CHRO, Infosys', initials: 'RS', avatarColor: 'from-orange-500 to-amber-500', status: 'online', sub: 'Executive Board Advisor' },
    { id: 5, name: 'Anita Desai', role: 'COO, D2C Brand', initials: 'AD', avatarColor: 'from-rose-500 to-pink-500', status: 'offline', sub: 'Operations Specialist' }
  ];

  const expertThreads = [
    { id: 1, name: 'Arjun Mehta (Acme Corp.)', role: 'VP Operations', initials: 'AM', avatarColor: 'from-teal-600 to-emerald-700', status: 'online', sub: 'Series B Tech Startup' },
    { id: 2, name: 'Bruce Wayne (Wayne Ent.)', role: 'Managing Director', initials: 'BW', avatarColor: 'from-slate-700 to-slate-900', status: 'online', sub: 'Defense & Aerospace Conglomerate' },
    { id: 3, name: 'Pepper Potts (Stark Ind.)', role: 'Chief Executive Officer', initials: 'PP', avatarColor: 'from-red-600 to-orange-500', status: 'offline', sub: 'Renewable Tech Ventures' }
  ];

  const activeThreads = isExpert ? expertThreads : companyThreads;

  // Mock Conversations pre-populated
  const [conversations, setConversations] = useState({
    1: [
      { sender: 'expert', text: 'Hello, Arjun. I reviewed the GTM launch parameters. The timeline looks very solid.', time: '10:14 AM', date: 'May 24, 2026' },
      { sender: 'company', text: 'Great to hear, Sarah! Are there any concerns regarding the marketing budget distribution for Q3?', time: '10:20 AM', date: 'May 24, 2026' },
      { sender: 'expert', text: 'Not at all. We have optimized allocations on digital channels. Let us synchronize on a video call.', time: '10:25 AM', date: 'May 24, 2026' }
    ],
    2: [
      { sender: 'expert', text: 'Arjun, the financial model drafts for the Series B pitch deck are compiled.', time: 'Yesterday', date: 'May 24, 2026' },
      { sender: 'company', text: 'Fantastic. Do we show healthy SaaS metrics for the expansion scenario?', time: 'Yesterday', date: 'May 24, 2026' },
      { sender: 'expert', text: 'Yes, both scenarios indicate steady 2.8x LTV/CAC ratio. I will upload the final Excel draft to escrow workspace.', time: 'Yesterday', date: 'May 24, 2026' }
    ],
    3: [
      { sender: 'expert', text: 'The engineering sprint roadmap is finalized. Our tech debt is reduced by 15%.', time: 'May 22', date: 'May 22, 2026' },
      { sender: 'company', text: 'Perfect. Let us make sure team velocity matches the launch window.', time: 'May 22', date: 'May 22, 2026' }
    ],
    4: [
      { sender: 'expert', text: 'I completed the background check verification files.', time: 'May 20', date: 'May 20, 2026' }
    ],
    5: [
      { sender: 'expert', text: 'Operations flow is established. Let me know when MSA is executed.', time: 'May 18', date: 'May 18, 2026' }
    ]
  });

  const activeThread = activeThreads.find(e => e.id === activeThreadId) || activeThreads[0];
  const activeMessages = conversations[activeThreadId] || [];

  // Scroll to bottom on load/new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  // Pre-fill meeting modal defaults
  useEffect(() => {
    if (activeThread) {
      setMeetingTitle(`Strategic alignment sync with ${activeThread.name}`);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMeetingDate(tomorrow.toISOString().split('T')[0]);
      setMeetingTime('14:00');
    }
  }, [activeThread, showScheduleModal]);

  // Handle File Input Selection
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type || 'application/octet-stream'
      });
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle message send
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !attachedFile) return;

    const newMessage = {
      sender: isExpert ? 'expert' : 'company',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (attachedFile) {
      newMessage.file = { ...attachedFile };
    }

    setConversations(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMessage]
    }));
    setInputMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Simulated reply trigger
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        `Understood, let's schedule a session to review this in depth.`,
        `That aligns perfectly with my expectations. I will check and confirm.`,
        `Received! I am currently analyzing the details and will write back shortly.`,
        `Excellent files. I suggest we quickly hop on a 30-minute sync to dissect them.`,
        `Checked. I have compiled the compliance updates. Let's align.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const replyMessage = {
        sender: isExpert ? 'company' : 'expert',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      };

      setConversations(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), replyMessage]
      }));
    }, 1800);
  };

  // 2-Step Meeting Schedule confirmation
  const handleConfirmSchedule = (e) => {
    if (e) e.preventDefault();
    if (!meetingTitle || !meetingDate || !meetingTime) return;

    // 1. Save meeting details to localStorage
    const newMeeting = {
      id: Date.now(),
      title: meetingTitle,
      date: meetingDate,
      time: meetingTime,
      duration: meetingDuration,
      agenda: meetingAgenda || 'Strategic sync alignment',
      platform: meetingPlatform,
      meetLink: 'https://meet.google.com/cxo-connect-meeting',
      expert: isExpert ? 'Arjun Mehta' : activeThread.name,
      expertRole: isExpert ? 'Client Coordinator' : activeThread.role,
      initials: isExpert ? 'AM' : activeThread.initials,
      avatarColor: isExpert ? 'bg-teal-600' : 'bg-purple-500'
    };

    const savedMeetings = JSON.parse(localStorage.getItem('CXO_SCHEDULED_MEETINGS') || '[]');
    localStorage.setItem('CXO_SCHEDULED_MEETINGS', JSON.stringify([...savedMeetings, newMeeting]));

    // 2. Inject system message in chat
    const systemMsg = {
      sender: 'system',
      text: `📅 Meeting scheduled on Google Meet: "${meetingTitle}" on ${meetingDate} at ${meetingTime} (${meetingDuration})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setConversations(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), systemMsg]
    }));

    // Reset & Close
    setShowScheduleModal(false);
    setMeetingStep(1);
    setMeetingAgenda('');
  };

  const filteredThreads = activeThreads.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1117] text-slate-900 font-sans flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
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
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a]'
                }`}
            >
              {item.active && (
                <motion.div
                  layoutId="activeNavMenu"
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

        {/* Pinned Bottom Option */}
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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#134e40] dark:hover:text-[#0eb59a] transition-all"
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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-semibold"
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

      {/* ── ALIGNED LIGHT MODE MESSAGING WORKSPACE ── */}
      <div
        className="transition-all duration-300 flex-1 flex h-screen"
        style={{ paddingLeft: isSidebarOpen ? '260px' : '68px' }}
      >

        {/* Left Column: Thread Lists (Aesthetics aligned to light theme) */}
        <div className="w-80 border-r border-gray-100 dark:border-white/10 bg-white dark:bg-[#1b1d24] flex flex-col shrink-0 h-full">
          {/* Aligned Search Input */}
          <div className="p-4 border-b border-gray-100 dark:border-white/10 flex flex-col gap-2 shrink-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search (⌘K)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-[#f4f7f5] dark:bg-white/5 text-slate-800 dark:text-gray-200 border border-gray-100 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#0eb59a] focus:ring-1 focus:ring-[#0eb59a]/15 transition-all"
              />
            </div>
          </div>

          {/* Direct Message Chats */}
          <div className="flex-1 overflow-y-auto space-y-1 py-3 px-2">
            {filteredThreads.map((thr) => {
              const messages = conversations[thr.id] || [];
              const lastMsg = messages[messages.length - 1];
              const isSelected = activeThreadId === thr.id;

              return (
                <button
                  key={thr.id}
                  onClick={() => setActiveThreadId(thr.id)}
                  className={`w-full p-3 rounded-2xl flex items-start gap-3 transition-all border-0 relative cursor-pointer text-left ${isSelected
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                  {/* Status Indicator Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${thr.avatarColor} flex items-center justify-center font-bold text-white text-sm shadow-sm`}>
                      {thr.initials}
                    </div>
                    {thr.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1b1d24]" />
                    )}
                  </div>

                  {/* Thread Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-800 dark:text-gray-100'}`}>
                        {thr.name}
                      </p>
                      <span className={`text-[9px] shrink-0 font-bold ${isSelected ? 'text-teal-200' : 'text-gray-400'}`}>
                        {lastMsg ? lastMsg.time : '10:00 AM'}
                      </span>
                    </div>
                    <p className={`text-[10px] font-bold truncate ${isSelected ? 'text-teal-100' : 'text-[#0eb59a]'} mb-0.5`}>
                      {thr.role}
                    </p>
                    <p className={`text-[11px] font-semibold truncate leading-tight ${isSelected ? 'text-white/80' : 'text-gray-455'}`}>
                      {lastMsg ? (lastMsg.file ? `📎 File: ${lastMsg.file.name}` : lastMsg.text) : thr.sub}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredThreads.length === 0 && (
              <p className="text-xs text-gray-400 p-4 text-center">No chats match search</p>
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation (Aesthetics aligned to warmth layout) */}
        <div
          className="flex-1 flex flex-col h-full relative overflow-hidden dark:!bg-[#0f1117]"
        >
          <div className="absolute inset-0 dark:hidden" style={{
            backgroundColor: '#eef3ef',
            backgroundImage: 'radial-gradient(rgba(19,78,64,0.04) 0.8px, transparent 0.8px), radial-gradient(rgba(19,78,64,0.04) 0.8px, #eef3ef 0.8px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }} />

          {/* Header */}
          <div className="h-16 bg-white dark:bg-[#1b1d24] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activeThread.avatarColor} flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-inner`}>
                {activeThread.initials}
              </div>
              <div className="text-left">
                <h2 className="text-xs font-black text-slate-800 dark:text-white leading-tight">{activeThread.name}</h2>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeThread.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {activeThread.status === 'online' ? 'Active now' : 'offline'} · {activeThread.role}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                className={`p-2 rounded-xl transition-colors bg-transparent border-0 cursor-pointer ${showInfoPanel ? 'text-[#134e40] bg-teal-50 dark:bg-[#0eb59a]/10 dark:text-[#0eb59a]' : 'text-gray-400 hover:text-[#134e40] dark:hover:text-[#0eb59a] hover:bg-slate-50 dark:hover:bg-white/5'}`}
                title="Toggle Contact Details"
              >
                <Info size={15} />
              </button>

              <div className="w-px h-6 bg-gray-150 mx-1" />

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setMeetingStep(1);
                  setShowScheduleModal(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black bg-[#134e40] hover:bg-[#0d3f33] text-white border-0 shadow-md transition-colors cursor-pointer"
              >
                <Calendar size={13} />
                Schedule a Meeting
              </motion.button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeMessages.map((msg, index) => {
              if (msg.sender === 'system') {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center my-4"
                  >
                    <span className="bg-teal-50 border border-teal-150 text-[#134e40] text-[10px] font-black tracking-wide px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
                      <Sparkles size={11} className="text-[#0eb59a]" />
                      {msg.text}
                    </span>
                  </motion.div>
                );
              }

              const isMe = msg.sender === (isExpert ? 'expert' : 'company');
              return (
                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md p-3.5 rounded-2xl text-left text-xs leading-relaxed font-semibold relative flex flex-col gap-2 shadow-sm ${isMe
                      ? 'bg-[#134e40] text-white rounded-tr-none'
                      : 'bg-white dark:bg-[#1e2028] text-slate-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/10'
                      }`}
                  >
                    {/* Render File Attachment Bubble if exists */}
                    {msg.file && (
                      <div className={`p-2.5 rounded-xl flex items-center gap-3 border ${isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-gray-150 text-slate-700'
                        }`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isMe ? 'bg-white/15' : 'bg-teal-50'}`}>
                          <File size={16} className={isMe ? 'text-white' : 'text-[#0eb59a]'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold truncate leading-tight">{msg.file.name}</p>
                          <p className={`text-[9px] font-semibold mt-0.5 ${isMe ? 'text-teal-200' : 'text-gray-400'}`}>{msg.file.size}</p>
                        </div>
                        <button type="button" className={`p-1.5 rounded-lg bg-transparent border-0 cursor-pointer ${isMe ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-400'}`}>
                          <Download size={13} />
                        </button>
                      </div>
                    )}

                    {msg.text && <p>{msg.text}</p>}

                    <span className={`text-[9px] self-end mt-0.5 font-bold flex items-center gap-1.5 ${isMe ? 'text-teal-200' : 'text-gray-400'}`}>
                      {msg.time}
                      {isMe && <CheckCheck size={11} className="text-teal-300" />}
                    </span>
                  </motion.div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1e2028] text-gray-400 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/10 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input Area */}
          <div className="p-4 bg-white dark:bg-[#1b1d24] border-t border-gray-100 dark:border-white/10 shrink-0 shadow-lg">

            {/* Attachment preview pill */}
            <AnimatePresence>
              {attachedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-3 p-2 bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-gray-300">
                    <File size={13} className="text-[#0eb59a]" />
                    <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono">({attachedFile.size})</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center border-0 text-gray-500 cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Attachment button */}
              <button
                type="button"
                onClick={handleFileClick}
                className="p-2 text-gray-400 hover:text-[#134e40] transition-colors bg-transparent border-0 cursor-pointer"
                title="Send a File"
              >
                <Paperclip size={17} />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={attachedFile ? "Add a caption..." : "Write a message..."}
                className="flex-1 bg-[#f4f7f5] dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 font-semibold focus:outline-none focus:border-[#0eb59a] transition-all"
              />

              {/* Emoji Picker Trigger */}
              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-xl transition-colors bg-transparent border-0 cursor-pointer ${showEmojiPicker ? 'text-[#134e40] bg-teal-50' : 'text-gray-400 hover:text-[#134e40]'
                    }`}
                  title="Emoji"
                >
                  <Smile size={17} />
                </button>

                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute bottom-full right-0 mb-2 z-50 dark:!bg-[#1e2028] dark:!border-white/10"
                      style={{
                        width: '320px',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 40px rgba(19,78,64,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e5e7eb',
                        padding: '12px',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-white/10">
                        <Smile size={13} className="text-[#0eb59a]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Emojis</span>
                      </div>
                      <div
                        className="grid gap-1 overflow-y-auto"
                        style={{
                          gridTemplateColumns: 'repeat(10, 1fr)',
                          maxHeight: '200px',
                        }}
                      >
                        {EMOJI_LIST.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setInputMessage(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="w-7 h-7 flex items-center justify-center text-base rounded-lg hover:bg-teal-50 transition-colors cursor-pointer border-0 bg-transparent leading-none"
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-9 h-9 rounded-xl bg-[#134e40] hover:bg-[#0d3f33] flex items-center justify-center text-white border-0 transition-colors cursor-pointer shadow-md"
              >
                <Send size={14} />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Discord/WhatsApp-style Profile Details Side Drawer */}
        <AnimatePresence>
          {showInfoPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-gray-100 dark:border-white/10 bg-white dark:bg-[#1b1d24] flex flex-col h-full shrink-0 z-10 hidden xl:flex text-left animate-fade-in"
            >
              <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Contact Details</h3>
                <button
                  onClick={() => setShowInfoPanel(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-400 border-0 cursor-pointer bg-transparent"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Profile Card */}
                <div className="flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-3xl relative overflow-hidden">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${activeThread.avatarColor} flex items-center justify-center font-bold text-white text-xl shadow-md mb-3`}>
                    {activeThread.initials}
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug">{activeThread.name}</h4>
                  <p className="text-[10px] text-[#0eb59a] font-bold mt-0.5">{activeThread.role}</p>
                  <span className="text-[9px] font-black uppercase text-[#134e40] dark:text-[#0eb59a] bg-teal-50 dark:bg-[#0eb59a]/10 px-2 py-0.5 rounded-md mt-2 border border-teal-100 dark:border-[#0eb59a]/20">
                    98% Match Rating
                  </span>
                </div>

                {/* Info List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs font-semibold">
                    <Clock size={13} className="text-[#0eb59a] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-gray-300">Availability</p>
                      <p className="text-gray-400 dark:text-gray-500 text-[10px]">20 hrs/week · Instant Syncs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs font-semibold">
                    <Shield size={13} className="text-[#0eb59a] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-gray-300">Compliance & NDA</p>
                      <p className="text-gray-400 dark:text-gray-500 text-[10px]">Fully Verified · MSA Active</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs font-semibold">
                    <Briefcase size={13} className="text-[#0eb59a] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-gray-300">Experience Segment</p>
                      <p className="text-gray-400 dark:text-gray-500 text-[10px]">{activeThread.sub}</p>
                    </div>
                  </div>
                </div>

                {/* Shared Documents list */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-white/10 pb-1.5">Shared Media & Files</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'GTM_Timeline.pdf', size: '2.4 MB' },
                      { name: 'SeriesB_Model.xlsx', size: '4.8 MB' },
                      { name: 'NDA_Execution_Copy.pdf', size: '1.2 MB' }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 dark:bg-[#1e2028] border border-gray-100 dark:border-white/10 rounded-xl flex items-center gap-2 hover:bg-teal-50/20 dark:hover:bg-white/5 hover:border-teal-100 dark:hover:border-white/25 transition-colors text-left">
                        <File size={13} className="text-[#0eb59a] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-800 dark:text-gray-200 truncate leading-none">{doc.name}</p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 font-bold">{doc.size}</p>
                        </div>
                        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-450 dark:text-gray-400 bg-transparent border-0 cursor-pointer">
                          <Download size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <button
                  onClick={() => navigate(isExpert ? '/expert-profile' : `/experts/${activeThread.id}`)}
                  className="w-full py-2 bg-teal-50 dark:bg-[#0eb59a]/10 hover:bg-teal-150 dark:hover:bg-[#0eb59a]/20 border border-teal-150 dark:border-[#0eb59a]/30 text-[#134e40] dark:text-[#0eb59a] font-black rounded-xl text-xs transition-colors cursor-pointer"
                >
                  View Full Profile Overview
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── REDESIGNED 2-STEP GOOGLE MEET SCHEDULER MODAL ── */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1b1d24] border border-gray-100 dark:border-white/10 rounded-3xl p-6 w-full max-w-md relative overflow-hidden shadow-2xl text-left"
            >


              {/* Close Button */}
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setMeetingStep(1);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-750 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-0 cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50 dark:border-white/10 pr-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#0eb59a]" />
                  <h3 className="font-black text-slate-800 dark:text-white text-sm">Schedule Call</h3>
                </div>
                <span className="text-[10px] font-black bg-[#f4f7f5] dark:bg-white/5 text-[#134e40] dark:text-[#0eb59a] px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap">
                  Step {meetingStep} of 2
                </span>
              </div>

              {/* STEP 1: Date, Time & platform */}
              {meetingStep === 1 && (
                <div className="space-y-4">

                  {/* Google Meet Integrations notice */}
                  <div className="p-3 bg-teal-50/70 dark:bg-[#0eb59a]/10 border border-teal-100 dark:border-[#0eb59a]/20 rounded-2xl text-left flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-white dark:bg-[#1e2028] rounded-lg flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 10.5V6C18 4.9 17.1 4 16 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H16C17.1 20 18 19.1 18 18V13.5L22 17.5V6.5L18 10.5Z" fill="#0eb59a" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[#134e40] dark:text-[#0eb59a]">Google Meet Enabled By Default</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold leading-relaxed">
                        A secure calendar invite and video link will be generated automatically and attached to your agenda list.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f4f7f5] dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-gray-200 focus:outline-none focus:border-[#0eb59a] focus:ring-1 focus:ring-[#0eb59a]/15"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Time</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <select
                          value={meetingHour}
                          onChange={(e) => setMeetingHour(e.target.value)}
                          className="px-2 py-2 bg-[#f4f7f5] dark:bg-[#1e2028] border border-gray-150 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-gray-200 focus:outline-none focus:border-[#0eb59a]"
                        >
                          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                            <option key={h} value={h} className="dark:bg-[#1b1d24]">{h}</option>
                          ))}
                        </select>
                        <select
                          value={meetingMinute}
                          onChange={(e) => setMeetingMinute(e.target.value)}
                          className="px-2 py-2 bg-[#f4f7f5] dark:bg-[#1e2028] border border-gray-150 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-gray-200 focus:outline-none focus:border-[#0eb59a]"
                        >
                          {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                            <option key={m} value={m} className="dark:bg-[#1b1d24]">{m}</option>
                          ))}
                        </select>
                        <div className="flex bg-[#f4f7f5] dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-xl p-0.5">
                          {['AM', 'PM'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setMeetingPeriod(p)}
                              className={`flex-1 py-1 rounded-lg text-[9px] font-black transition-all border-0 cursor-pointer ${meetingPeriod === p
                                ? 'bg-[#134e40] text-white shadow-sm'
                                : 'text-gray-400 dark:text-gray-500 bg-transparent'
                                }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duration Picker */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['15 mins', '30 mins', '45 mins', '1 hour'].map(dur => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setMeetingDuration(dur)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${meetingDuration === dur
                            ? 'bg-[#134e40] border-[#134e40] text-white shadow-sm'
                            : 'bg-[#f4f7f5] dark:bg-white/5 border-gray-150 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#134e40]/30'
                            }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platform selection indicator */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Meeting Platform</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMeetingPlatform('Google Meet')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-colors ${meetingPlatform === 'Google Meet'
                          ? 'bg-teal-50 dark:bg-[#0eb59a]/10 border-[#0eb59a] text-[#134e40] dark:text-[#0eb59a]'
                          : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'
                          }`}
                      >
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" />
                        Google Meet (Default)
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setMeetingStep(2)}
                      disabled={!meetingDate || !meetingTime}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-[#134e40] hover:bg-[#0d3f33] text-white border-0 shadow-md cursor-pointer disabled:opacity-40"
                    >
                      Next Step: Context →
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: Meeting Context & Review */}
              {meetingStep === 2 && (
                <form onSubmit={handleConfirmSchedule} className="space-y-4">

                  {/* Meeting Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Meeting Title</label>
                    <input
                      type="text"
                      required
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f4f7f5] dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-gray-200 focus:outline-none focus:border-[#0eb59a] focus:ring-1 focus:ring-[#0eb59a]"
                    />
                  </div>

                  {/* Agenda */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Discussion Agenda</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Sync roadmap adjustments and review final design system deliverables..."
                      value={meetingAgenda}
                      onChange={(e) => setMeetingAgenda(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f4f7f5] dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-655 focus:outline-none focus:border-[#0eb59a] focus:ring-1 focus:ring-[#0eb59a] resize-none"
                    />
                  </div>

                  {/* Review Summary Panel */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#1e2028] border border-gray-150 dark:border-white/10 rounded-2xl space-y-2 text-left">
                    <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">Session Overview Summary</p>
                    <div className="text-xs font-bold text-slate-800 dark:text-gray-200 space-y-1">
                      <p>📅 {meetingDate} at {meetingTime} ({meetingDuration})</p>
                      <p>💻 via {meetingPlatform}</p>
                      <p>✨ Link: <span className="text-[#0eb59a] underline font-mono select-all">meet.google.com/cxo-connect-meeting</span></p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end pt-4 border-t border-gray-50 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setMeetingStep(1)}
                      className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent cursor-pointer"
                    >
                      ← Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-black bg-[#134e40] hover:bg-[#0d3f33] text-white border-0 shadow-md cursor-pointer"
                    >
                      Schedule Call & Send Invite
                    </motion.button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Messages;