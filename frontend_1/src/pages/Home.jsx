import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Briefcase, ChevronLeft, ChevronRight, CheckCircle2, Check, UserPlus, Star, Shield, Target, Edit, Search, Lock, Monitor, Users, MapPin, Mail, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '../components/AuthModalContext';
import Footer from '../components/Footer';
import TarsChatbot from '../components/TarsChatbot';
import Toast from '../components/Toast';

const slides = [
    {
        title: "The Problem for Companies",
        content: "Organizations struggle to find experienced CXOs or Advisors quickly. Traditional hiring processes are slow, costly, and inflexible, delaying critical business needs.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "The Problem for Professionals",
        content: "Experienced leaders face limited visibility into flexible, meaningful project opportunities and lack a trusted ecosystem to leverage their expertise.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
    },
    {
        title: "The Market Gap",
        content: "Current solutions fail to connect demand with verified senior talent. Job portals lack project-based roles, while top firms are rigid and expensive.",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Our Solution",
        content: "CXOConnect is a verified marketplace connecting companies with professionals quickly and securely via AI matching and robust governance.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2070&auto=format&fit=crop"
    }
];

const trustedCompanies = [
    "Company 1", "Company 2", "Company 3", "Company 4", "Company 5",
    "Company 6", "Company 7", "Company 8", "Company 9", "Company 10"
];

// Reusable scroll animation wrapper
const AnimatedSection = ({ children, className, id, style }) => (
    <motion.section
        className={className}
        id={id}
        style={style}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.section>
);

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const { openModal } = useAuthModal();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    const maxSlide = slides.length - 1;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
        }, 8000); // Automatically slide every 8 seconds
        return () => clearInterval(timer);
    }, [maxSlide]);

    const nextSlide = () => setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));

    return (
        <div className="bg-[#fafafa] min-h-screen text-gray-900 font-sans selection:bg-[#0eb59a] selection:text-white pt-20">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 bg-white">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        disablePictureInPicture
                        className="w-full h-full object-cover opacity-80"
                        onEnded={(e) => { e.target.play(); }}
                    >
                        <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Very subtle overlay to smooth out the video */}
                    <div className="absolute inset-0 bg-white/10"></div>
                    {/* Fade to white ONLY at the very bottom edge to blend with the next section */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>

                <motion.div
                    className="relative z-20 max-w-5xl mx-auto px-6 text-center"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1] text-[#111827]">
                        Elite Expertise.<br /><span className="text-[#134e40]">Leadership on Demand.</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-600 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
                        Connect with vetted CXOs and senior advisors to solve your most critical business challenges on demand and managed by experts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <button onClick={openModal} className="px-10 py-4 rounded-full bg-[#134e40] text-white font-semibold text-lg hover:bg-[#0eb59a] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 group">
                            Get Started
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-10 py-4 rounded-full bg-white text-[#134e40] border-2 border-[#134e40] font-semibold text-lg hover:bg-[#134e40] hover:text-white transition-all duration-300 w-full sm:w-auto shadow-sm">
                            Learn More
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Trusted by Industry Leaders */}
            <div className="py-16 bg-white border-b border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Your Expertise, Your Terms.</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Join an exclusive ecosystem of industry leaders. Access high-impact advisory projects with guaranteed milestone-based payouts.</p>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] group">
                    <div className="flex w-fit animate-marquee group-hover:[animation-play-state:paused]">
                        {/* First Set */}
                        <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 w-max">
                            {trustedCompanies.map((company, index) => (
                                <div key={`company-1-${index}`} className="text-2xl md:text-3xl font-bold text-gray-400 hover:text-gray-900 transition-colors duration-300 cursor-default select-none shrink-0">
                                    {company}
                                </div>
                            ))}
                        </div>
                        {/* Second Set for seamless loop */}
                        <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 w-max">
                            {trustedCompanies.map((company, index) => (
                                <div key={`company-2-${index}`} className="text-2xl md:text-3xl font-bold text-gray-400 hover:text-gray-900 transition-colors duration-300 cursor-default select-none shrink-0">
                                    {company}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
                    <p className="text-gray-500 text-lg"><span className="font-bold text-blue-900">50+</span> companies trust our proven recruitment frameworks</p>
                </div>
            </div>

            {/* Dark Green Impact Section (Updated Content for Two-Sided Marketplace) */} 
            <AnimatedSection className="py-24 px-6 max-w-7xl mx-auto">
                <div className="bg-[#134e40] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="flex-1 p-12 md:p-16 flex flex-col justify-center relative z-10">
                        <div className="flex items-center gap-2 text-yellow-400 mb-8">
                            <span className="text-white/80 text-sm font-medium ml-2 tracking-wider uppercase">Trusted Ecosystem</span>
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-[1.1]">
                            The premier <br className="hidden md:block" />two-sided marketplace.
                        </h2>
                        <div className="space-y-8 max-w-xl">
                            <p className="text-teal-50 text-xl font-light opacity-90">
                                CXOConnect bridges the gap between:
                            </p>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 bg-[#0eb59a]/20 p-1 rounded-full">
                                        <Check className="text-[#0eb59a]" size={16} />
                                    </div>
                                    <span className="text-teal-50 text-lg leading-relaxed"><strong className="text-white font-semibold">Companies</strong> seeking impactful leadership.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 bg-[#0eb59a]/20 p-1 rounded-full">
                                        <Check className="text-[#0eb59a]" size={16} />
                                    </div>
                                    <span className="text-teal-50 text-lg leading-relaxed"><strong className="text-white font-semibold">Senior Professionals</strong> seeking flexible engagements.</span>
                                </li>
                            </ul>
                            <div className="border-l-4 border-[#0eb59a] pl-6 py-2 bg-white/5 rounded-r-2xl">
                                <p className="text-teal-50/90 text-base leading-relaxed italic">
                                    Supported by an expert Admin layer to ensure trust, meticulous vetting, and seamless managed delivery.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button onClick={openModal} className="bg-white text-[#134e40] px-10 py-4 rounded-full font-bold hover:bg-[#0eb59a] hover:text-white transition-all duration-300 inline-flex items-center gap-3 group/btn shadow-lg">
                                    Explore Engagements <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" alt="Expert Consulting" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                </div>
            </AnimatedSection>

            {/* How It Works Section */}
            <AnimatedSection className="py-12 w-full relative overflow-hidden bg-[#fafafa]" id="about-us">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-12 px-6 lg:px-12 relative overflow-hidden">
                        {/* Background Ambient Blurs for Light Theme */}
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0eb59a]/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#134e40]/5 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="text-center mb-16 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight font-serif">How It Works</h2>
                                <p className="text-base text-gray-500 font-light">Two distinct journeys, one perfect match</p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 relative z-10">
                            {/* Vertical Divider for Desktop */}
                            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent -translate-x-1/2"></div>

                            {/* For CXOs Column */}
                            <div className="lg:pr-10 flex flex-col gap-8">
                                <div className="text-center lg:text-left">
                                    <h3 className="text-2xl font-bold text-[#0eb59a] mb-2 tracking-tight">For CXOs</h3>
                                    <p className="text-gray-500 text-sm font-light">Your path to meaningful leadership roles</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Item 1 */}
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center text-[#0eb59a] shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#0eb59a] group-hover:text-white transition-all duration-300">
                                            <Edit size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#0eb59a] transition-colors">Build your leadership profile, your way</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm font-light">Share your expertise, past outcomes, and availability, guided step-by-step with personal assistant support</p>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Item 2 */}
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center text-[#0eb59a] shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#0eb59a] group-hover:text-white transition-all duration-300">
                                            <Search size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#0eb59a] transition-colors">Get discovered by the right companies</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm font-light">Our AI matching engine scores your leadership style and culture fit against founder needs before any introduction is made</p>
                                        </div>
                                    </motion.div>

                                    {/* Item 3 */}
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center text-[#0eb59a] shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#0eb59a] group-hover:text-white transition-all duration-300">
                                            <Lock size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#0eb59a] transition-colors">Unlock high-value engagements</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm font-light">Access pre-qualified fractional, interim, and advisory roles with contracts and payments built in</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* For Companies Column */}
                            <div className="lg:pl-10 flex flex-col gap-8 mt-12 lg:mt-0">
                                <div className="text-center lg:text-left">
                                    <h3 className="text-2xl font-bold text-[#134e40] mb-2 tracking-tight">For Companies</h3>
                                    <p className="text-gray-500 text-sm font-light">Find your next strategic leader</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Item 1 */}
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#134e40] shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#134e40] group-hover:text-white transition-all duration-300">
                                            <Monitor size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#134e40] transition-colors">Define your leadership need in minutes</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm font-light">Use our guided requirement wizard to articulate your real business challenge — not just a job title</p>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Item 2 */}
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#134e40] shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#134e40] group-hover:text-white transition-all duration-300">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#134e40] transition-colors">Get matched with verified senior leaders</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm font-light">AI-powered shortlisting of CXOs who fit your industry, stage, and culture, not just keywords</p>
                                        </div>
                                    </motion.div>

                                    {/* Item 3 */}
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#134e40] shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#134e40] group-hover:text-white transition-all duration-300">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#134e40] transition-colors">Onboard with confidence and governance</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm font-light">Kick off engagements with structured milestones, escrow-backed payments, and PMO oversight from day one</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Blurred Carousel Slider Section */}
            <AnimatedSection className="py-32 w-full overflow-hidden relative" id="problems">
                <div className="absolute inset-0 bg-[#111827]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1914] to-[#111827]"></div>
                </div>

                <div className="max-w-[100vw] mx-auto relative z-10 flex flex-col items-center overflow-hidden">

                    <h2 className="text-center text-5xl md:text-6xl text-white mb-20 font-serif font-bold tracking-tight">What problem can we <span className="text-[#0eb59a]">solve together?</span></h2>

                    <div className="relative w-full flex items-center justify-center px-4 md:px-0">
                        {/* Wrapper for the slides to handle the overflow and flex layout */}
                        <div className="w-full max-w-7xl relative flex justify-center items-center h-[500px]">
                            <AnimatePresence initial={false}>
                                {slides.map((slide, idx) => {
                                    // Determine position relative to currentSlide
                                    let position = 'hidden'; // Default
                                    let zIndex = 0;
                                    let x = 0;
                                    let scale = 0.8;
                                    let opacity = 0;
                                    let blur = 'blur(10px)';

                                    if (idx === currentSlide) {
                                        position = 'center';
                                        zIndex = 30;
                                        x = 0;
                                        scale = 1;
                                        opacity = 1;
                                        blur = 'blur(0px)';
                                    } else if (idx === currentSlide - 1 || (currentSlide === 0 && idx === maxSlide)) {
                                        position = 'left';
                                        zIndex = 20;
                                        x = '-70%';
                                        scale = 0.85;
                                        opacity = 0.6;
                                        blur = 'blur(6px)';
                                    } else if (idx === currentSlide + 1 || (currentSlide === maxSlide && idx === 0)) {
                                        position = 'right';
                                        zIndex = 20;
                                        x = '70%';
                                        scale = 0.85;
                                        opacity = 0.6;
                                        blur = 'blur(6px)';
                                    }

                                    if (position === 'hidden') return null;

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                x,
                                                scale,
                                                opacity,
                                                filter: blur,
                                                zIndex,
                                            }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            className="absolute w-[90%] md:w-[60%] lg:w-[45%] h-full cursor-pointer"
                                            onClick={() => setCurrentSlide(idx)}
                                        >
                                            <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-2xl group border border-white/10">
                                                <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
                                                <div className="absolute bottom-0 left-0 w-full p-10 z-10 flex flex-col justify-end">
                                                    <h3 className="text-3xl text-white mb-4 font-semibold">{slide.title}</h3>
                                                    <p className="text-gray-300 leading-relaxed text-lg line-clamp-3">{slide.content}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Left Arrow overlaid on the left card */}
                            <button className="absolute left-[5%] lg:left-[15%] z-40 bg-[#134e40]/80 backdrop-blur-md shadow-2xl text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer transition-all hover:bg-[#0eb59a] hover:scale-110" onClick={prevSlide}>
                                <ChevronLeft size={28} />
                            </button>

                            {/* Right Arrow overlaid on the right card */}
                            <button className="absolute right-[5%] lg:right-[15%] z-40 bg-[#134e40]/80 backdrop-blur-md shadow-2xl text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer transition-all hover:bg-[#0eb59a] hover:scale-110" onClick={nextSlide}>
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center mt-12 z-20 relative">
                        {slides.map((_, i) => (
                            <span key={i} className={`h-3 rounded-full cursor-pointer transition-all duration-500 ${i === currentSlide ? 'bg-[#0eb59a] w-10 shadow-[0_0_10px_#0eb59a]' : 'bg-white/30 w-3 hover:bg-white/60'}`} onClick={() => setCurrentSlide(i)}></span>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Membership Section */}
            <AnimatedSection className="py-24 px-6 max-w-7xl mx-auto bg-white rounded-[3rem] mt-24 border border-gray-100 shadow-xl" id="membership">
                <div className="text-center mb-16">

                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Membership benefits</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Join a curated community of top-tier executives and forward-thinking companies. Gain access to premium opportunities and resources.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
                    <div className="p-8 rounded-3xl bg-[#f8fafc] border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all hover:-translate-y-2">
                        <div className="w-16 h-16 rounded-full bg-[#0eb59a]/10 flex items-center justify-center mb-6 text-[#0eb59a]">
                            <Target size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Curated Matches</h3>
                        <p className="text-gray-600">AI-driven matching ensures you connect with the exact expertise or role you're looking for.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-[#134e40] text-white border border-[#134e40] flex flex-col items-center text-center hover:shadow-2xl transition-all scale-105 shadow-xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0eb59a]/20 rounded-full blur-2xl"></div>
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-[#0eb59a]">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Verified Network</h3>
                        <p className="text-teal-50/80 mb-8">Every member undergoes rigorous vetting to ensure a high-trust environment.</p>
                        <button onClick={openModal} className="mt-auto bg-[#0eb59a] text-white px-8 py-3 rounded-full font-bold w-full hover:bg-teal-400 transition-colors shadow-lg">Become a Member</button>
                    </div>

                    <div className="p-8 rounded-3xl bg-[#f8fafc] border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all hover:-translate-y-2">
                        <div className="w-16 h-16 rounded-full bg-[#0eb59a]/10 flex items-center justify-center mb-6 text-[#0eb59a]">
                            <Star size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">PMO Governance</h3>
                        <p className="text-gray-600">Dedicated support to manage deliverables, escrow, and project success smoothly.</p>
                    </div>
                </div>
            </AnimatedSection>

            {/* Gateways Image Section */}
            <AnimatedSection className="py-32 px-6 max-w-7xl mx-auto">
                <div className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>

                        <h2 className="text-4xl md:text-6xl text-gray-900 font-serif font-bold tracking-tight">Be a part of our story.</h2>
                    </div>
                    <p className="text-gray-600 text-xl max-w-md md:text-right font-light">A high-trust ecosystem for managed consulting, interim leadership, and strategic transformation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex flex-col group cursor-pointer" onClick={openModal}>
                        <div className="h-[400px] md:h-[500px] w-full overflow-hidden mb-8 relative rounded-[2rem] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Companies" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                            <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
                                <h4 className="text-4xl text-white mb-3 font-semibold group-hover:text-[#0eb59a] transition-colors">Hire a CXO</h4>
                                <p className="text-gray-300 mb-8 text-lg font-light">Find top-tier fractional executives.</p>
                                <button className="bg-white text-[#134e40] px-8 py-3 rounded-full font-bold text-sm group-hover:bg-[#0eb59a] group-hover:text-white transition-colors shadow-lg">
                                    Join as Company
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col group cursor-pointer" onClick={openModal}>
                        <div className="h-[400px] md:h-[500px] w-full overflow-hidden mb-8 relative rounded-[2rem] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                            {/* Fixed image URL for Experts */}
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Experts" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                            <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
                                <h4 className="text-4xl text-white mb-3 font-semibold group-hover:text-[#0eb59a] transition-colors">Executive Opportunities</h4>
                                <p className="text-gray-300 mb-8 text-lg font-light">Discover flexible, high-impact engagements.</p>
                                <button className="bg-white text-[#134e40] px-8 py-3 rounded-full font-bold text-sm group-hover:bg-[#0eb59a] group-hover:text-white transition-colors shadow-lg">
                                    Join as Expert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* High-End Contact Us Section */}
            <AnimatedSection className="w-full relative py-32 overflow-hidden" id="contact-us">
                {/* Background Image with Premium Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop" alt="Contact Office" className="w-full h-full object-cover scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/95 via-[#111827]/90 to-[#134e40]/90 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side: Contact Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-left"
                        >

                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">Let's build <br/>the <span className="text-[#0eb59a]">future.</span></h2>
                            <p className="text-gray-300 text-lg md:text-xl font-light mb-12 max-w-lg leading-relaxed">
                                Join our exclusive network of forward-thinking companies and elite fractional leaders. We're ready to answer your questions.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#0eb59a]/20 border border-[#0eb59a]/30 flex items-center justify-center text-[#0eb59a] group-hover:bg-[#0eb59a] group-hover:text-white transition-colors duration-300">
                                        <MapPin size={26} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Headquarters</p>
                                        <p className="text-white text-base">Office 302, EON Free Zone,<br/>Kharadi, Pune, 411014</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#0eb59a]/20 border border-[#0eb59a]/30 flex items-center justify-center text-[#0eb59a] group-hover:bg-[#0eb59a] group-hover:text-white transition-colors duration-300">
                                        <Mail size={26} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Direct Line</p>
                                        <p className="text-white text-base">admin@cxoconnect.com<br/>+91-9874561230</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side: Form Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/5 border border-white/10 p-8 sm:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0eb59a]/20 rounded-full blur-[80px] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#134e40]/20 rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10 tracking-tight">Stay Updated</h3>
                            <p className="text-gray-400 font-light mb-10 relative z-10 text-lg">Subscribe for platform updates and exclusive insights.</p>

                            <form className="flex flex-col gap-6 relative z-10" onSubmit={(e) => { e.preventDefault(); setShowToast(true); }}>
                                <div className="space-y-2 group">
                                    <label className="text-gray-300 text-xs font-bold uppercase tracking-widest ml-1">Email Address <span className="text-[#0eb59a]">*</span></label>
                                    <div className="relative">
                                        <input type="email" required placeholder="Enter your email address" className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-500 focus:outline-none focus:border-[#0eb59a] focus:bg-white/5 transition-all duration-300 text-lg" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-[#0eb59a] text-white px-8 py-5 rounded-2xl font-bold hover:bg-teal-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(14,181,154,0.3)] text-lg flex items-center justify-center gap-3 group mt-4">
                                    Get Updates <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </AnimatedSection>

            <Footer />
            <Toast 
                isVisible={showToast} 
                message="Successfully subscribed to our newsletter!" 
                type="success"
                onClose={() => setShowToast(false)} 
            />

            {/* Ask Tars Chat Bubble */}
            <TarsChatbot />
        </div>
    );
};

export default Home;
