import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, UserCheck, Settings, Mail, Info, Bell, Twitter, Facebook, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const privacySections = [
    {
        id: "information-we-collect",
        title: "1. Information We Collect",
        icon: <UserCheck className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg leading-relaxed">When you use CXO Connect, we collect information you share with us directly:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg pl-2">Contact details such as your name, email address, and phone number</li>
                    <li className="text-gray-600 text-lg pl-2">Organisation details and senior-level hiring requirements</li>
                    <li className="text-gray-600 text-lg pl-2">Responses from assessments, scorecards, and hiring preference inputs</li>
                    <li className="text-gray-600 text-lg pl-2">Platform usage data to help us improve your experience</li>
                </ul>
            </>
        )
    },
    {
        id: "how-we-use",
        title: "2. How We Use Your Information",
        icon: <Settings className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg leading-relaxed">The information we collect is used to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg pl-2">Deliver and continuously improve our CXO-level hiring tools</li>
                    <li className="text-gray-600 text-lg pl-2">Generate tailored job descriptions and leadership alignment reports</li>
                    <li className="text-gray-600 text-lg pl-2">Provide culture-fit evaluations, structured interview frameworks, and onboarding recommendations</li>
                    <li className="text-gray-600 text-lg pl-2">Send you relevant updates and service communications</li>
                </ul>
            </>
        )
    },
    {
        id: "information-sharing",
        title: "3. Information Sharing",
        icon: <Shield className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg leading-relaxed">We do not sell or rent your personal information. We may share it only:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg pl-2">When you have given us explicit permission to do so</li>
                    <li className="text-gray-600 text-lg pl-2">With vetted technology partners who help us operate CXO Connect</li>
                    <li className="text-gray-600 text-lg pl-2">When legally required or necessary to protect our platform and users</li>
                    <li className="text-gray-600 text-lg pl-2">In the event of a company merger, acquisition, or restructuring</li>
                </ul>
            </>
        )
    },
    {
        id: "data-security",
        title: "4. Data Security",
        icon: <Lock className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg leading-relaxed">We take the security of your data seriously. Our safeguards include:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg pl-2">End-to-end encrypted data transmission and storage</li>
                    <li className="text-gray-600 text-lg pl-2">Periodic security reviews and vulnerability assessments</li>
                    <li className="text-gray-600 text-lg pl-2">Role-based access controls and multi-factor authentication</li>
                    <li className="text-gray-600 text-lg pl-2">Reliable backup and data recovery systems</li>
                </ul>
            </>
        )
    },
    {
        id: "your-rights",
        title: "5. Your Rights",
        icon: <FileText className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg leading-relaxed">As a user of CXO Connect, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg pl-2">View and review the personal information we hold about you</li>
                    <li className="text-gray-600 text-lg pl-2">Request corrections if any of your data is inaccurate</li>
                    <li className="text-gray-600 text-lg pl-2">Delete your account and all associated data at any time</li>
                    <li className="text-gray-600 text-lg pl-2">Unsubscribe from marketing or promotional communications</li>
                    <li className="text-gray-600 text-lg pl-2">Export a copy of your data in a standard portable format</li>
                </ul>
            </>
        )
    },
    {
        id: "cookies",
        title: "6. Cookies and Tracking",
        icon: <Info className="w-5 h-5 text-[#0eb59a]" />,
        content: <p className="text-gray-600 text-lg leading-relaxed">CXO Connect uses cookies and similar technologies to personalise your experience and understand how our platform is used. You can manage cookie settings through your browser at any time.</p>
    },
    {
        id: "policy-updates",
        title: "7. Policy Updates",
        icon: <Bell className="w-5 h-5 text-[#0eb59a]" />,
        content: <p className="text-gray-600 text-lg leading-relaxed">We may revise this policy as our services evolve. If we make significant changes, we will update the date at the top of this page and inform you where appropriate.</p>
    },
    {
        id: "contact",
        title: "8. Get in Touch",
        icon: <Mail className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <div className="bg-gradient-to-br from-[#f0fdfa] to-white p-6 md:p-8 rounded-2xl border border-[#ccfbf1] shadow-sm">
                <p className="text-[#134e40] mb-4 text-lg">For any questions or concerns about this policy or how your data is handled, reach out to us:</p>
                <div className="space-y-3">
                    <p className="flex items-center gap-3"><strong className="text-[#134e40] bg-white px-3 py-1 rounded shadow-sm border border-[#ccfbf1] text-sm">Email</strong> <a href="mailto:admin@cxoconnect.com" className="text-[#0eb59a] hover:underline font-medium text-lg">admin@cxoconnect.com</a></p>
                    <p className="flex items-center gap-3"><strong className="text-[#134e40] bg-white px-3 py-1 rounded shadow-sm border border-[#ccfbf1] text-sm">Website</strong> <a href="https://www.cxoconnect.com" className="text-[#0eb59a] hover:underline font-medium text-lg">www.cxoconnect.com</a></p>
                </div>
            </div>
        )
    }
];

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pt-20">
            {/* Dark Header Section */}
            <section className="relative py-24 bg-[#111827] border-b border-gray-800">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#134e40]/20 to-[#111827] z-0"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-sm font-medium text-teal-50 tracking-wider uppercase backdrop-blur-md">
                            <Shield size={16} className="text-[#0eb59a]" />
                            LEGAL INFORMATION
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">
                            Privacy <span className="text-[#0eb59a]">Policy</span>
                        </h1>
                        <p className="text-sm text-gray-400 font-light">
                            Last updated: May 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Card */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-24">
                <main className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 lg:p-12 text-left">
                    <div className="space-y-0">
                        {privacySections.map((section, index) => (
                            <motion.section 
                                key={section.id} 
                                id={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`pt-10 pb-10 ${index !== 0 ? 'border-t border-gray-100' : 'pt-0'} ${index === privacySections.length - 1 ? 'pb-0' : ''}`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center shrink-0">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-[#1e3a8a]">{section.title}</h2>
                                </div>
                                <div className="pl-0 sm:pl-13">
                                    {section.content}
                                </div>
                            </motion.section>
                        ))}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
