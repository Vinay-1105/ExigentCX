import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from './AuthModalContext';

const Footer = () => {
    const navigate = useNavigate();
    const { openModal } = useAuthModal();

    const handleNavigation = (e, path, hash = null) => {
        e.preventDefault();
        if (path) {
            navigate(path);
            window.scrollTo(0, 0);
        } else if (hash) {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate(`/#${hash}`);
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <footer className="relative bg-[#111827] text-white pt-24 pb-12 px-6 overflow-hidden mt-0">
            {/* Animated Gradient Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0eb59a] to-transparent opacity-50"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0eb59a]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#134e40]/20 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="max-w-7xl mx-auto relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
                    <motion.div variants={itemVariants} className="lg:col-span-4 max-w-md">
                        <div
                            className="inline-block cursor-pointer mb-8 group flex items-center shrink-0"
                            onClick={(e) => handleNavigation(e, '/')}
                        >
                            <img
                                src="/assets/images/LOGO_WHITE.png"
                                alt="CXO Connect"
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed font-light mb-10 transition-colors">
                            Bridging the gap between visionary companies and the senior leaders who bring their stories to life.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Facebook, Instagram].map((Icon, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer text-gray-400 hover:text-[#0eb59a] hover:bg-white/10 hover:border-[#0eb59a]/30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(14,181,154,0.2)] backdrop-blur-sm"
                                >
                                    <Icon size={22} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Columns Container */}
                    <div className="lg:col-span-8 flex flex-wrap justify-between gap-12 lg:gap-16">
                        <motion.div variants={itemVariants} className="flex flex-col gap-6">
                            <h4 className="text-white text-xl font-semibold mb-2 relative inline-block w-fit">
                                Platform
                                <span className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#0eb59a]"></span>
                            </h4>
                            <div className="flex flex-col gap-6">
                                <a href="#" className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Find Talent</span>
                                </a>
                                <a href="#" className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Find Projects</span>
                                </a>
                                <a href="#" onClick={(e) => handleNavigation(e, null, 'membership')} className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Membership</span>
                                </a>
                                <button onClick={openModal} className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group text-left p-0 bg-transparent border-none">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Join the Network</span>
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-6">
                            <h4 className="text-white text-xl font-semibold mb-2 relative inline-block w-fit">
                                Company
                                <span className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#0eb59a]"></span>
                            </h4>
                            <div className="flex flex-col gap-6">
                                <a href="#" onClick={(e) => handleNavigation(e, null, 'about-us')} className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>About Us</span>
                                </a>
                                <a href="#" onClick={(e) => handleNavigation(e, null, 'contact-us')} className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Contact</span>
                                </a>
                                <a href="#" className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Resources & Blog</span>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-6">
                            <h4 className="text-white text-xl font-semibold mb-2 relative inline-block w-fit">
                                Legal
                                <span className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#0eb59a]"></span>
                            </h4>
                            <div className="flex flex-col gap-6">
                                <a href="#" onClick={(e) => handleNavigation(e, '/privacy-policy')} className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Privacy Policy</span>
                                </a>
                                <a href="#" onClick={(e) => handleNavigation(e, '/terms-of-service')} className="text-gray-400 text-lg font-light hover:text-white transition-colors flex items-center gap-2 group">
                                    <ChevronRight size={14} className="text-[#0eb59a] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    <span>Terms of Service</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div variants={itemVariants} className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs tracking-widest uppercase relative">
                    <span>© {new Date().getFullYear()} CXOCONNECT. ALL RIGHTS RESERVED.</span>
                    <span className="font-bold text-[#0eb59a] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] animate-pulse"></span>
                        Designed for Precision.
                    </span>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;
