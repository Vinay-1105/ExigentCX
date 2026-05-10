import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, Users, FileText, CreditCard,
  Settings, ShieldCheck, LogOut, Menu
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import TarsChatbot from './TarsChatbot';

const sidebarMenu = [
  { name: 'Dashboard',        icon: LayoutDashboard, path: '/company-dashboard' },
  { name: 'My Requirements',  icon: Briefcase,        path: '/requirements' },
  { name: 'Experts',          icon: Users,            path: '/experts' },
  { name: 'Contracts',        icon: FileText,         path: '/contracts' },
  { name: 'Payments',         icon: CreditCard,       path: '/payments' },
  { name: 'Settings',         icon: Settings,         path: '/settings' },
];

const CompanyLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeMenu = sidebarMenu.find(m => location.pathname === m.path || location.pathname.startsWith(m.path + '/'))?.name || 'Dashboard';

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">

      {/* ── PERSISTENT SIDEBAR ── */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#2d6a4f] flex flex-col z-50 overflow-hidden shrink-0 shadow-[20px_0_40px_rgba(19,78,64,0.06)] rounded-r-[2.5rem] h-screen"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* ── Logo ── */}
        <div className={`relative z-10 flex items-center border-b border-white/10 transition-all duration-300
          ${isSidebarOpen ? 'px-8 py-10 gap-5' : 'px-0 py-10 justify-center'}`}>
          <div className="w-12 h-12 rounded-[1rem] bg-white flex items-center justify-center shrink-0 shadow-lg">
            <img src="/favicon.png" alt="CXO Connect" className="w-7 h-7 object-contain" />
          </div>
          <motion.div
            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-2xl font-bold font-serif tracking-wide text-white leading-tight">CXO CONNECT</p>
            <p className="text-xs font-sans font-medium text-[#74b986] uppercase tracking-widest mt-1">
              Company Portal
            </p>
          </motion.div>
        </div>

        {/* ── Navigation ── */}
        <nav className="relative z-10 flex-1 py-10 px-6 flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <motion.p
            animate={{ opacity: isSidebarOpen ? 1 : 0, height: isSidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-sans font-bold text-white/40 uppercase tracking-widest px-6 mb-4 overflow-hidden"
          >
            Main Menu
          </motion.p>

          {sidebarMenu.map((item) => {
            const isActive = activeMenu === item.name;
            return (
              <div key={item.name} className="relative group">
                <motion.button
                  whileHover={{ x: isSidebarOpen ? 6 : 0, scale: isSidebarOpen ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center transition-all duration-300 rounded-[1.5rem] relative
                    ${isSidebarOpen ? 'gap-5 px-6 py-4' : 'justify-center px-0 py-4'}
                    ${isActive
                      ? 'bg-white text-[#2d6a4f] shadow-xl'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <item.icon
                    size={22}
                    strokeWidth={1.5}
                    className={`shrink-0 transition-colors ${isActive ? 'text-[#74b986]' : 'text-white/60 group-hover:text-white'}`}
                  />
                  <motion.span
                    animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[15px] font-sans font-medium overflow-hidden whitespace-nowrap tracking-wide"
                  >
                    {item.name}
                  </motion.span>
                </motion.button>

                {/* Collapsed tooltip */}
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 bg-white text-[#2d6a4f] text-sm font-sans font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom: Concierge + Logout ── */}
        <div className="relative z-10 px-6 pb-10 flex flex-col gap-4">
          {isSidebarOpen ? (
            <div className="p-6 rounded-[2rem] bg-white/10 border border-white/10 text-white relative overflow-hidden cursor-pointer group shadow-lg backdrop-blur-sm">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#74b986]/30 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck size={20} strokeWidth={1.5} className="text-[#74b986]" />
                  <h4 className="font-bold font-serif text-lg tracking-wide">CXO Concierge</h4>
                </div>
                <p className="text-[13px] text-white/80 mb-5 font-sans font-light leading-relaxed">
                  Need help scoping a role? Talk to our experts.
                </p>
                <button className="w-full bg-[#74b986] hover:bg-green-400 text-white text-sm font-sans font-bold py-3.5 rounded-full transition-all shadow-[0_0_15px_rgba(14,181,154,0.3)]">
                  Talk to Advisor
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group flex justify-center">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm"
              >
                <ShieldCheck size={24} strokeWidth={1.5} className="text-[#74b986]" />
              </motion.button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 bg-white text-[#2d6a4f] text-sm font-sans font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                CXO Concierge
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
              </div>
            </div>
          )}

          <div className="h-px bg-white/10 mx-4 my-2" />

          <div className="relative group">
            <motion.button
              whileHover={{ x: isSidebarOpen ? 4 : 0, scale: isSidebarOpen ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/signin?role=company');
              }}
              className={`w-full flex items-center rounded-full text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all group
                ${isSidebarOpen ? 'gap-5 px-6 py-4' : 'justify-center px-0 py-4'}`}
            >
              <LogOut size={22} strokeWidth={1.5} className="shrink-0 transition-colors group-hover:text-red-400" />
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[15px] font-sans font-medium overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            </motion.button>
            {!isSidebarOpen && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 bg-red-500 text-white text-sm font-sans font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-500" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ── PAGE AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* ── TOP HEADER BAR ── */}
        <header className="h-24 bg-white/80 backdrop-blur-2xl flex items-center justify-between px-10 shrink-0 z-40 sticky top-0 border-b border-gray-100/30">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3.5 rounded-full hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 hover:text-[#2d6a4f] transition-all shadow-sm"
          >
            <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
              <Menu size={24} strokeWidth={1.5} />
            </motion.div>
          </motion.button>

          {/* Breadcrumb */}
          <div className="flex-1 mx-10">
            <p className="text-sm font-sans font-medium text-gray-400">
              Company Portal <span className="mx-2 text-gray-300">/</span>
              <span className="text-[#2d6a4f] font-bold">{activeMenu}</span>
            </p>
          </div>

          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#2d6a4f] font-serif font-bold text-lg cursor-pointer shadow-sm"
          >
            AC
          </motion.div>
        </header>

        {/* ── CHILD PAGE ── */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Outlet />
        </div>
      </div>

      <TarsChatbot />
    </div>
  );
};

export default CompanyLayout;
