import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Briefcase, User, Shield, CreditCard, AlertTriangle, Scale, Database, XCircle, MapPin, RefreshCw, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const termsSections = [
    {
        id: "acceptance-of-terms",
        title: "1. Acceptance of Terms",
        icon: <CheckCircle className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">By accessing or using CXO Connect and its hiring intelligence tools, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree with any part of these terms, please discontinue use of our platform immediately.</p>
        )
    },
    {
        id: "about-our-services",
        title: "2. About Our Services",
        icon: <Briefcase className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">CXO Connect offers a suite of senior-level hiring tools designed to support smarter recruitment decisions:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Smart job description builder and role alignment scorecard</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Culture and leadership compatibility assessment tool</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Structured and empathetic interview guide generator</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Offers a dropout and early exit risk predictor</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Personalised 30-60-90 day onboarding planner</li>
                </ul>
            </>
        )
    },
    {
        id: "user-responsibilities",
        title: "3. User Responsibilities",
        icon: <User className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">By using CXO Connect, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Provide accurate and truthful information at all times</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Use the platform solely for legitimate professional and business purposes</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Respect the intellectual property of CXO Connect and third parties</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Keep your account credentials confidential and secure</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Comply with all applicable local and national laws and regulations</li>
                </ul>
            </>
        )
    },
    {
        id: "intellectual-property",
        title: "4. Intellectual Property",
        icon: <Shield className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">All content, tools, features, designs, algorithms, and software on CXO Connect are owned by us or our licensors and are protected under applicable copyright, trademark, and intellectual property laws. Unauthorised reproduction or distribution is strictly prohibited.</p>
        )
    },
    {
        id: "payment-terms",
        title: "5. Payment Terms",
        icon: <CreditCard className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">For users on paid plans:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#0eb59a]">
                    <li className="text-gray-600 text-lg md:text-xl pl-2">All fees are non-refundable unless explicitly stated otherwise</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Payments are due as per the billing cycle applicable to your plan</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">We reserve the right to suspend access in the event of non-payment</li>
                    <li className="text-gray-600 text-lg md:text-xl pl-2">Any pricing changes will be communicated with a minimum of 30 days' notice</li>
                </ul>
            </>
        )
    },
    {
        id: "disclaimer-of-warranties",
        title: "6. Disclaimer of Warranties",
        icon: <AlertTriangle className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">CXO Connect is provided on an "as is" basis without warranties of any kind, express or implied. While our tools are built on industry best practices to improve hiring outcomes, we do not guarantee specific results or successful placements.</p>
        )
    },
    {
        id: "limitation-of-liability",
        title: "7. Limitation of Liability",
        icon: <Scale className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">To the fullest extent permitted by law, CXO Connect and its team shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of data, revenue, or business opportunities, arising from your use of the platform.</p>
        )
    },
    {
        id: "data-usage-and-privacy",
        title: "8. Data Usage and Privacy",
        icon: <Database className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">Your use of CXO Connect is also governed by our Privacy Policy. By continuing to use our services, you consent to the collection and use of your information as described therein.</p>
        )
    },
    {
        id: "termination",
        title: "9. Termination",
        icon: <XCircle className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">We reserve the right to suspend or terminate your access to CXO Connect at any time, without prior notice, if you are found to violate these Terms or engage in misuse of the platform.</p>
        )
    },
    {
        id: "governing-law",
        title: "10. Governing Law",
        icon: <MapPin className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">These Terms are governed by and interpreted in accordance with the laws of India. Any disputes arising from the use of the platform shall be subject to the jurisdiction of the Indian courts.</p>
        )
    },
    {
        id: "updates-to-these-terms",
        title: "11. Updates to These Terms",
        icon: <RefreshCw className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">We may revise these Terms as our platform evolves. Material changes will be reflected by updating the date at the top of this page. Continued use of CXO Connect after changes are posted constitutes your acceptance of the revised Terms.</p>
        )
    },
    {
        id: "contact",
        title: "12. Get in Touch",
        icon: <Mail className="w-5 h-5 text-[#0eb59a]" />,
        content: (
            <div className="bg-gradient-to-br from-[#f0fdfa] to-white p-6 md:p-8 rounded-2xl border border-[#ccfbf1] shadow-sm">
                <p className="text-[#134e40] mb-4 text-lg md:text-xl">For any questions about these Terms of Service, please reach out:</p>
                <div className="space-y-3">
                    <p className="flex items-center gap-3"><strong className="text-[#134e40] bg-white px-3 py-1 rounded shadow-sm border border-[#ccfbf1] text-sm">Email</strong> <a href="mailto:admin@cxoconnect.com" className="text-[#0eb59a] hover:underline font-medium text-lg md:text-xl">admin@cxoconnect.com</a></p>
                    <p className="flex items-center gap-3"><strong className="text-[#134e40] bg-white px-3 py-1 rounded shadow-sm border border-[#ccfbf1] text-sm">Website</strong> <a href="https://www.cxoconnect.com" className="text-[#0eb59a] hover:underline font-medium text-lg md:text-xl">www.cxoconnect.com</a></p>
                </div>
            </div>
        )
    }
];

const TermsOfService = () => {
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
                            Terms of <span className="text-[#0eb59a]">Service</span>
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
                        {termsSections.map((section, index) => (
                            <motion.section 
                                key={section.id} 
                                id={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`pt-10 pb-10 ${index !== 0 ? 'border-t border-gray-100' : 'pt-0'} ${index === termsSections.length - 1 ? 'pb-0' : ''}`}
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

export default TermsOfService;
