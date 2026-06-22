import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthModal } from './AuthModalContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const MotionLink = motion(Link);

const smoothScrollTo = (targetPosition, duration) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            window.scrollTo(0, targetPosition);
        }
    };

    requestAnimationFrame(animation);
};

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { openModal } = useAuthModal();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    if (location.pathname === '/company-dashboard') {
        return null;
    }

    const handleScrollTarget = (e, targetId) => {
        e.preventDefault();
        setIsOpen(false);
        if (location.pathname === '/') {
            const section = document.getElementById(targetId);
            if (section) {
                const targetPosition = section.getBoundingClientRect().top + window.scrollY - 80;
                smoothScrollTo(targetPosition, 1000);
            }
        } else {
            navigate(`/#${targetId}`);
        }
    };

    // Dark frosted glass navbar — teal logo pops on this
    const navBg = isOpen
        ? 'bg-[#0d1a14] border-b border-white/10'
        : scrolled
            ? 'bg-[#0d1a14]/95 backdrop-blur-xl shadow-lg border-b border-white/5'
            : 'bg-[#0d1a14]/75 backdrop-blur-md';

    return (
        <nav className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out px-6 md:px-12 ${isOpen ? 'h-auto py-6 flex-col items-start' : 'h-20'
            } flex justify-between items-center ${navBg}`}>

            <div className="flex justify-between items-center w-full md:w-auto shrink-0 h-full">
                <Link
                    to="/"
                    className="flex items-center shrink-0 gap-3 md:ml-4"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Dark navbar → teal logo mark */}
                    <Logo variant="dark" className="h-10 md:h-12 lg:h-14" />
                    <span className="text-white font-black text-xl md:text-2xl lg:text-3xl tracking-[0.12em] font-serif whitespace-nowrap">
                        ExigentCX
                    </span>
                </Link>
                <motion.button
                    className="block md:hidden bg-transparent border-none text-white hover:text-[#0eb59a] cursor-pointer ml-auto transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    whileTap={{ rotate: 90, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.button>
            </div>

            <div className={`hidden md:flex gap-8 items-center h-full ${isOpen ? '!flex flex-col items-start w-full gap-6 mt-6 pb-4' : ''}`}>
                <MotionLink
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`text-[15px] font-medium tracking-wide transition-colors duration-300 relative cursor-pointer group ${location.pathname === '/' ? 'text-[#0eb59a]' : 'text-gray-300 hover:text-white'
                        }`}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                >
                    Home
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0eb59a] transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}></span>
                </MotionLink>

                <motion.a
                    href="#about-platform"
                    onClick={(e) => handleScrollTarget(e, 'about-platform')}
                    className="text-[15px] font-medium tracking-wide transition-colors duration-300 relative cursor-pointer text-gray-300 hover:text-white group"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                >
                    Platform
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-[#0eb59a] transition-all duration-300 w-0 group-hover:w-full"></span>
                </motion.a>

                <motion.a
                    href="#services"
                    onClick={(e) => handleScrollTarget(e, 'services')}
                    className="text-[15px] font-medium tracking-wide transition-colors duration-300 relative cursor-pointer text-gray-300 hover:text-white group"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                >
                    Services
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-[#0eb59a] transition-all duration-300 w-0 group-hover:w-full"></span>
                </motion.a>

                <motion.a
                    href="#membership"
                    onClick={(e) => handleScrollTarget(e, 'membership')}
                    className="text-[15px] font-medium tracking-wide transition-colors duration-300 relative cursor-pointer text-gray-300 hover:text-white group"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                >
                    Membership
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-[#0eb59a] transition-all duration-300 w-0 group-hover:w-full"></span>
                </motion.a>

                <motion.a
                    href="#contact-us"
                    onClick={(e) => handleScrollTarget(e, 'contact-us')}
                    className="text-[15px] font-medium tracking-wide transition-colors duration-300 relative cursor-pointer text-gray-300 hover:text-white group"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                >
                    Contact
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-[#0eb59a] transition-all duration-300 w-0 group-hover:w-full"></span>
                </motion.a>

                <ThemeToggle />

                <div className="flex flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0 md:ml-4 justify-start">
                    <motion.button
                        className="relative overflow-hidden flex items-center gap-2 text-white font-semibold transition-all duration-500 text-[15px] group px-6 py-2.5 rounded-full bg-[#134e40] hover:bg-[#0eb59a] border border-[#0eb59a]/30 hover:border-[#0eb59a] shadow-[0_0_15px_rgba(14,181,154,0.15)] hover:shadow-[0_0_25px_rgba(14,181,154,0.4)]"
                        onClick={() => { setIsOpen(false); openModal(); }}
                        whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(14,181,154,0.45)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                    >
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none"></span>
                        <UserPlus size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
                        <span className="relative z-10 tracking-wide">Join / Sign In</span>
                    </motion.button>

                    <motion.button
                        className="relative overflow-hidden flex items-center gap-2 text-white font-semibold transition-all duration-500 text-[15px] group px-6 py-2.5 rounded-full bg-[#134e40] hover:bg-[#0eb59a] border border-[#0eb59a]/30 hover:border-[#0eb59a] shadow-[0_0_15px_rgba(14,181,154,0.15)] hover:shadow-[0_0_25px_rgba(14,181,154,0.4)]"
                        onClick={() => { setIsOpen(false); navigate('/admin-signup'); }}
                        whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(14,181,154,0.45)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                    >
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none"></span>
                        <UserPlus size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
                        <span className="relative z-10 tracking-wide">Admin</span>
                    </motion.button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;