import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Star, Zap, Target, Heart } from 'lucide-react';
import { useAuthModal } from '../components/AuthModalContext';
import Navbar from '../components/Navbar';

// ── TEAM DATA ──
const founders = [
    {
        id: 1,
        name: 'Ashutosh Sathe',
        role: 'Co-Founder',
        avatar: null,
        initials: 'F1',
        linkedin: 'https://www.linkedin.com/in/businessprofitconsultant/',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        badge: 'Project Head',
    },
    {
        id: 2,
        name: 'Anup Deshpande',
        role: 'Co-Founder',
        avatar: null,
        initials: 'F2',
        linkedin: 'https://www.linkedin.com/in/anup-deshpande03/',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        badge: 'Project Manager',
    },
];

const team = [
    {
        id: 3,
        name: 'Vinay Gore',
        role: 'Frontend Developer',
        avatar: null,
        initials: 'T1',
        linkedin: 'https://www.linkedin.com/in/vinay-gore-b2832328a/',
        twitter: 'https://twitter.com',
        instagram: 'https://www.instagram.com/vinaygore_/?hl=en',
    },
    {
        id: 4,
        name: 'Sarvyagya Prakash',
        role: 'App Developer',
        avatar: null,
        initials: 'T2',
        linkedin: 'https://www.linkedin.com/in/sarvyagyaprakash/',
        twitter: 'https://twitter.com',
        instagram: 'https://www.instagram.com/sarvyagya.prakash/?hl=en',
    },
    {
        id: 5,
        name: 'Suyash Tripathi',
        role: 'Backend Developer',
        avatar: null,
        initials: 'T3',
        linkedin: 'https://www.linkedin.com/in/suytri05/',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
    },
];

// ── FOUNDER CARD ──
const FounderCard = ({ member }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative group cursor-default w-full sm:w-[340px]"
        >
            <motion.div
                animate={{
                    y: hovered ? -10 : 0,
                    boxShadow: hovered
                        ? '0 0 50px rgba(14,181,154,0.35), 0 20px 60px rgba(0,0,0,0.5)'
                        : '0 8px 30px rgba(0,0,0,0.3)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, #1a2f3a 0%, #0f1f2a 100%)',
                    border: hovered ? '1px solid rgba(14,181,154,0.6)' : '1px solid rgba(212,175,55,0.3)',
                }}
            >
                {/* Corner flourishes */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg opacity-60" style={{ borderColor: '#D4AF37' }} />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg opacity-60" style={{ borderColor: '#D4AF37' }} />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg opacity-60" style={{ borderColor: '#D4AF37' }} />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 rounded-br-lg opacity-60" style={{ borderColor: '#D4AF37' }} />

                {/* Glow overlay on hover */}
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(14,181,154,0.08) 0%, transparent 70%)' }}
                />

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Badge */}
                    <motion.div
                        animate={{ scale: hovered ? 1.05 : 1 }}
                        className="mb-5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                        style={{
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))',
                            border: '1px solid rgba(212,175,55,0.5)',
                            color: '#D4AF37',
                        }}
                    >
                        ✦ {member.badge}
                    </motion.div>

                    {/* Avatar */}
                    <motion.div
                        animate={{ scale: hovered ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative mb-5"
                    >
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-2xl font-black text-white overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #1e3a4a, #0d2535)',
                                boxShadow: hovered
                                    ? '0 0 0 3px #0eb59a, 0 0 20px rgba(14,181,154,0.4)'
                                    : '0 0 0 3px #D4AF37, 0 0 15px rgba(212,175,55,0.2)',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <span style={{ color: hovered ? '#0eb59a' : '#D4AF37' }}>{member.initials}</span>
                            )}
                        </div>
                        {/* Pulse ring */}
                        <motion.div
                            animate={{ scale: hovered ? [1, 1.2, 1] : 1, opacity: hovered ? [0.5, 0, 0.5] : 0 }}
                            transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
                            className="absolute inset-0 rounded-full"
                            style={{ border: '2px solid #0eb59a' }}
                        />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-xl font-black text-white mb-1 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        {member.name}
                    </h3>

                    {/* Role */}
                    <p className="text-sm font-bold mb-4" style={{ color: '#D4AF37' }}>
                        {member.role}
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        {[
                            { icon: Linkedin, url: member.linkedin, hoverColor: '#0077B5' },
                            { icon: Twitter, url: member.twitter, hoverColor: '#1DA1F2' },
                            { icon: Instagram, url: member.instagram, hoverColor: '#E1306C' },
                        ].map(({ icon: Icon, url, hoverColor }, idx) => (
                            <motion.a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, color: hoverColor }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.07 }}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    color: '#D4AF37',
                                }}
                            >
                                <Icon size={14} />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ── TEAM CARD ──
const TeamCard = ({ member, delay = 0 }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ minWidth: '260px', maxWidth: '320px' }}
            className="relative cursor-default flex-1 w-full sm:w-auto"
        >
            <motion.div
                animate={{
                    y: hovered ? -8 : 0,
                    boxShadow: hovered
                        ? '0 0 35px rgba(14,181,154,0.2), 0 16px 40px rgba(0,0,0,0.4)'
                        : '0 6px 24px rgba(0,0,0,0.25)',
                }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, #162638 0%, #0e1e2c 100%)',
                    border: hovered ? '1px solid rgba(14,181,154,0.4)' : '1px solid rgba(212,175,55,0.2)',
                }}
            >
                {/* Corner flourishes */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l opacity-50" style={{ borderColor: '#D4AF37' }} />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r opacity-50" style={{ borderColor: '#D4AF37' }} />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l opacity-50" style={{ borderColor: '#D4AF37' }} />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r opacity-50" style={{ borderColor: '#D4AF37' }} />

                {/* Glow */}
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(14,181,154,0.06) 0%, transparent 70%)' }}
                />

                <div className="p-6 flex flex-col items-center text-center">
                    {/* Avatar */}
                    <motion.div
                        animate={{ scale: hovered ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative mb-6"
                    >
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-black overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #1e3a4a, #0d2535)',
                                boxShadow: hovered
                                    ? '0 0 0 2px #0eb59a, 0 0 15px rgba(14,181,154,0.3)'
                                    : '0 0 0 2px rgba(212,175,55,0.5)',
                                transition: 'box-shadow 0.3s ease',
                                color: hovered ? '#0eb59a' : '#D4AF37',
                            }}
                        >
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                member.initials
                            )}
                        </div>
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-base font-black text-white mb-1 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        {member.name}
                    </h3>

                    {/* Role */}
                    <p className="text-xs font-bold mb-1" style={{ color: '#0eb59a' }}>
                        {member.role}
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        {[
                            { icon: Linkedin, url: member.linkedin, hoverColor: '#0077B5' },
                            { icon: Twitter, url: member.twitter, hoverColor: '#1DA1F2' },
                            { icon: Instagram, url: member.instagram, hoverColor: '#E1306C' },
                        ].map(({ icon: Icon, url, hoverColor }, idx) => (
                            <motion.a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, color: hoverColor }}
                                whileTap={{ scale: 0.9 }}
                                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(14,181,154,0.3)',
                                    color: '#0eb59a',
                                }}
                            >
                                <Icon size={12} />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ── COUNT-UP STAT ──
const CountUpStat = ({ value, inView, large }) => {
    const [display, setDisplay] = useState('0');
    const isSymbol = isNaN(Number(value));

    useEffect(() => {
        if (!inView) return;
        if (isSymbol) { setDisplay(value); return; }
        const end = Number(value);
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(String(Math.round(eased * end)));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, value, isSymbol]);

    return (
        <motion.p
            className={`${large ? 'text-5xl' : 'text-4xl'} font-black mb-1`}
            style={{ color: '#D4AF37', fontFamily: 'Georgia, serif' }}
            initial={{ opacity: 0, scale: isSymbol ? 0.7 : 1 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: isSymbol ? 0.7 : 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            {display}
        </motion.p>
    );
};

// ── MAIN PAGE ──
const AboutUs = () => {
    const navigate = useNavigate();
    const { openModal } = useAuthModal();
    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d1f2d 40%, #091820 100%)' }}
        >
            <Navbar />

            {/* Dot-grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(rgba(14,181,154,0.08) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Ambient glow blobs */}
            <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(14,181,154,0.06)' }} />
            <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(212,175,55,0.04)' }} />

            {/* ── HERO ── */}
            <section className="relative z-10 pt-32 pb-20 text-center px-4 sm:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Top label */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: '#D4AF37' }}>
                            The Visionaries
                        </span>
                        <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
                    </div>

                    {/* Main heading */}
                    <h1
                        className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight"
                        style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 60px rgba(14,181,154,0.15)' }}
                    >
                        Meet The Visionaries
                    </h1>

                    {/* Gold underline */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '120px' }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-0.5 mx-auto mb-6"
                        style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                    />

                    <p className="text-lg font-light max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Building the future of fractional leadership in India.
                    </p>

                    {/* Star rating */}
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.08, type: 'spring' }}
                            >
                                <Star size={14} fill="#D4AF37" className="text-amber-400" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── FOUNDER QUOTE ── */}
            <section className="relative z-10 px-4 sm:px-8 lg:px-12 pb-16 max-w-6xl mx-auto">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.18 } }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative rounded-3xl p-6 sm:p-10 text-center"
                    style={{
                        background: 'linear-gradient(145deg, rgba(212,175,55,0.06), rgba(14,181,154,0.04))',
                        border: '1px solid rgba(212,175,55,0.15)',
                    }}
                >
                    <motion.div
                        className="text-6xl mb-4 leading-none"
                        style={{ color: 'rgba(212,175,55,0.3)', fontFamily: 'Georgia, serif' }}
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
                    >"</motion.div>
                    <p className="text-xl sm:text-2xl font-light leading-relaxed mb-6 italic" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Georgia, serif' }}>
                        <motion.span
                            className="block"
                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                        >
                            India has thousands of world-class CXOs sitting on the sidelines. And thousands of companies that desperately need them, but can't afford full-time.
                        </motion.span>
                        <motion.span
                            className="block mt-2"
                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                        >
                            We built ExigentCX to close that gap.
                        </motion.span>
                    </p>
                    <motion.div
                        className="h-px w-16 mx-auto mb-4"
                        style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                        variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.5 } } }}
                    />
                    <motion.p
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: '#D4AF37' }}
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
                    >— The Founders</motion.p>
                </motion.div>
            </section>

            {/* ── HONEST STATS ── */}
            <section className="relative z-10 px-4 sm:px-8 lg:px-12 pb-16">
                <div ref={statsRef} className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { value: '5', label: 'Founding Experts', sub: 'Hand-picked, verified CXOs' },
                        { value: '1', label: 'Big Mission', sub: 'Redefining fractional hiring' },
                        { value: '∞', label: 'Potential', sub: 'And just getting started', large: true },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            whileHover={{ y: -4 }}
                            className="text-center p-6 rounded-2xl"
                            style={{
                                background: 'linear-gradient(145deg, rgba(26,47,58,0.8), rgba(15,31,42,0.8))',
                                border: '1px solid rgba(212,175,55,0.2)',
                            }}
                        >
                            <CountUpStat value={stat.value} inView={statsInView} large={!!stat.large} />
                            <p className="text-sm font-black text-white mb-1">{stat.label}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FOUNDERS ROW ── */}
            <section className="relative z-10 px-4 sm:px-8 lg:px-12 pb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(212,175,55,0.6)' }}>
                        ✦ Founders
                    </span>
                </motion.div>

                <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 items-center">
                    {founders.map((founder) => (
                        <FounderCard key={founder.id} member={founder} />
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="relative z-10 flex items-center justify-center gap-4 px-6 mb-12">
                <div className="flex-1 max-w-xs h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2))' }} />
                <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '12px' }}>◆</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(212,175,55,0.5)' }}>Core Team</span>
                <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '12px' }}>◆</span>
                <div className="flex-1 max-w-xs h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.2), transparent)' }} />
            </div>

            {/* ── TEAM ROW ── */}
            <section className="relative z-10 px-4 sm:px-8 lg:px-12 pb-20">
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 flex-wrap max-w-6xl mx-auto items-center">
                    {team.map((member, idx) => (
                        <TeamCard key={member.id} member={member} delay={idx * 0.1} />
                    ))}
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="relative z-10 px-4 sm:px-8 lg:px-12 pb-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-6 sm:mb-10"
                    >
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(212,175,55,0.6)' }}>What Drives Us</span>
                            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
                        </div>
                        <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>Our Values</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { icon: Zap, title: 'Speed with Trust', desc: 'Great companies can\'t wait months to find leadership. We move fast, but never at the cost of quality or integrity.' },
                            { icon: Target, title: 'Precision Matching', desc: 'We don\'t spray resumes. Every connection we make is intentional, deeply vetted, and built to last.' },
                            { icon: Heart, title: 'People First', desc: 'Behind every requirement is a founder with a dream. Behind every expert is a career with purpose. We honour both.' },
                        ].map((val, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.12, duration: 0.6 }}
                                whileHover="cardHover"
                                variants={{ cardHover: { y: -6, boxShadow: '0 20px 50px rgba(14,181,154,0.12)' } }}
                                className="p-7 rounded-2xl relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(145deg, #162638, #0e1e2c)',
                                    border: '1px solid rgba(212,175,55,0.15)',
                                }}
                            >
                                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l opacity-40" style={{ borderColor: '#D4AF37' }} />
                                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r opacity-40" style={{ borderColor: '#D4AF37' }} />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l opacity-40" style={{ borderColor: '#D4AF37' }} />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r opacity-40" style={{ borderColor: '#D4AF37' }} />
                                <motion.div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                                    variants={{ cardHover: { rotate: 8, scale: 1.15 } }}
                                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    <val.icon size={18} style={{ color: '#D4AF37' }} />
                                </motion.div>
                                <h3 className="text-base font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>{val.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MISSION STRIP ── */}
            <section className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden py-6 px-4 sm:py-8 sm:px-6 text-center"
                    style={{ background: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 40%, #F4C430 60%, #D4AF37 100%)' }}
                >
                    {/* Shimmer */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                        className="absolute inset-0 w-1/3 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                    />
                    <p className="text-lg font-black text-[#0a1628] tracking-wide relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                        Our Mission — Redefining CXO hiring in India.
                    </p>
                    <p className="text-sm font-semibold text-[#0a1628]/70 mt-1 relative z-10">
                        Connecting India's best fractional CXOs with high-growth companies.
                    </p>
                    <motion.button
                        onClick={openModal}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14,181,154,0.5)' }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="mt-5 px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest relative z-20 bg-[#0a1628] text-[#D4AF37] border-2 border-[#0a1628]/30 hover:bg-[#0eb59a] hover:text-[#0a1628] hover:border-[#0eb59a] transition-all duration-300 cursor-pointer"
                    >
                        Join the Network
                    </motion.button>

                    {/* Diamond accent */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[#0a1628]/20 text-4xl pointer-events-none">◆</div>
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#0a1628]/20 text-4xl pointer-events-none">◆</div>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutUs;