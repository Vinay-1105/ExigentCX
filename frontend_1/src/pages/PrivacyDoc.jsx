import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Lock, FileText, UserCheck, Settings,
    Mail, Info, Bell, Globe, Clock, Trash2, Users,
    ChevronRight, AlertCircle, Database, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// ── TABLE OF CONTENTS ──
const tocItems = [
    { id: 'short-version', label: '1. The Short Version' },
    { id: 'information-collect', label: '2. Information We Collect' },
    { id: 'legal-basis', label: '3. Legal Basis for Processing' },
    { id: 'how-we-use', label: '4. How We Use Your Information' },
    { id: 'retention', label: '5. Data Retention' },
    { id: 'children', label: '6. Children\'s Privacy' },
    { id: 'sharing', label: '7. Sharing with Third Parties' },
    { id: 'where-process', label: '8. Where We Process Data' },
    { id: 'cookies', label: '9. Cookies & Tracking' },
    { id: 'data-security', label: '10. Data Security' },
    { id: 'your-rights', label: '11. Your Privacy Rights' },
    { id: 'deleting', label: '12. Deleting or Updating Data' },
    { id: 'contact', label: '13. Contact Us' },
    { id: 'changes', label: '14. Policy Changes' },
];

// ── REUSABLE COMPONENTS ──
const SectionHeading = ({ icon: Icon, title, number }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-[#134e40] text-white text-sm font-black flex items-center justify-center shrink-0">
                {number}
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] dark:bg-[#0eb59a]/10 border border-[#ccfbf1] dark:border-[#0eb59a]/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#0eb59a]" />
            </div>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-[#134e40] leading-tight">
            {title}
        </h2>
    </div>
);

const BulletList = ({ items }) => (
    <ul className="space-y-3 mt-4 text-left">
        {items.map((item, i) => (
            <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.3,
                    delay: i * 0.04,
                    ease: 'easeOut'
                }}
                className="flex items-start gap-3 text-left"
            >
                <span className="w-2 h-2 rounded-full bg-[#0eb59a] shrink-0 mt-[7px]" />
                <span className="text-gray-600 dark:text-gray-400 text-base leading-[1.7] text-left flex-1">
                    {item}
                </span>
            </motion.li>
        ))}
    </ul>
);

const SubHeading = ({ children }) => (
    <div className="flex items-center gap-2.5 mt-8 mb-4">
        <div className="w-1 h-5 bg-[#0eb59a] rounded-full shrink-0" />
        <h3 className="text-[11px] font-black text-[#134e40] uppercase tracking-[0.15em]">
            {children}
        </h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
    </div>
);

const InfoCard = ({ children, color = 'teal' }) => {
    const styles = {
        teal: 'bg-[#f0fdfa] dark:bg-[#0eb59a]/10 border-[#ccfbf1] dark:border-[#0eb59a]/20 border-l-[#0eb59a]',
        amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30 border-l-amber-400 dark:text-amber-300',
        slate: 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 border-l-slate-400 dark:text-gray-300',
    };
    return (
        <div className={`border border-l-4 rounded-2xl p-6 mt-5 text-left ${styles[color]}`}>
            {children}
        </div>
    );
};

const StyledTable = ({ headers, rows }) => (
    <div className="overflow-x-auto mt-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <table className="w-full text-sm table-fixed">
            <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} className="px-5 py-3.5 text-left text-xs font-black text-[#134e40] uppercase tracking-wider border-b border-[#ccfbf1] dark:border-[#0eb59a]/20 bg-[#f0fdfa] dark:bg-[#0eb59a]/10">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-[#f0fdfa]/50 dark:hover:bg-[#0eb59a]/5 transition-colors duration-150"
                    >
                        {row.map((cell, j) => (
                            <td
                                key={j}
                                className={`px-5 py-4 text-sm leading-relaxed align-top text-left ${j === 0
                                        ? 'font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-100 dark:border-white/5 w-2/5'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {cell}
                            </td>
                        ))}
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>
);

const NoticeBox = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-5 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 border-l-4 border-l-amber-400 rounded-2xl text-left"
    >
        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 leading-relaxed text-left">
            {children}
        </p>
    </motion.div>
);

// ── SECTIONS DATA ──
const sections = [
    {
        id: 'short-version',
        icon: FileText,
        number: '1',
        title: 'The Short Version',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mb-5">
                    Here's a plain-language summary of our key data practices. The full details follow in each section below.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {[
                        { label: 'Information We Collect', text: 'You provide data during onboarding (profile, company details, GST/LinkedIn). We automatically collect usage data and receive third-party verification information.' },
                        { label: 'Legal Basis', text: 'We process data to perform our contract with you, for legitimate business interests, and to comply with legal obligations.' },
                        { label: 'How We Use Data', text: 'To match Companies with verified CXO-level Professionals, manage escrow payments, facilitate contracts/NDAs, ensure marketplace trust, and send service communications.' },
                        { label: 'Data Retention', text: 'We keep your data only as long as your account is active or as needed for legal, tax, and fraud-prevention requirements.' },
                        { label: 'Children', text: 'The Platform is strictly for professionals over 18 and of legal age to contract.' },
                        { label: 'Sharing', text: 'We share data with verified Professionals (during engagements), payment gateways (Razorpay/Stripe), vetting partners, and legal authorities if required.' },
                        { label: 'Security', text: 'Enterprise-grade encryption, access controls, and PCI-DSS compliant payment processing.' },
                    ].map((item, i) => (
                        <div key={i} className="p-5 bg-[#f0fdfa] dark:bg-[#0eb59a]/10 border border-[#ccfbf1] dark:border-[#0eb59a]/20 rounded-xl hover:shadow-md transition-all duration-200 hover:border-[#0eb59a]/40">
                            <p className="text-[11px] font-black text-[#134e40] uppercase tracking-widest mb-2 text-left">{item.label}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-[1.65] text-left">{item.text}</p>
                        </div>
                    ))}
                </div>
                <NoticeBox>
                    We do not sell your personal information to third parties for their own marketing purposes.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'information-collect',
        icon: Database,
        number: '2',
        title: 'Information We Collect',
        content: (
            <>
                <SubHeading>A. Information You Provide Directly</SubHeading>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left font-semibold mt-1">For Companies (Startups, SMEs, Enterprises):</p>
                <BulletList items={[
                    'Registration details: email, LinkedIn URL, GST number (optional but recommended for invoicing)',
                    'Company profile: industry, size, funding stage, business challenges',
                    'Role-based access details (Founder, HR, Finance lead)',
                    'Requirement details: role type (Fractional/Interim/Advisory), functional area, duration, budget range',
                    'Payment and billing information for escrow and milestone payouts',
                    'Communications, NDAs, and contracts signed via the Platform',
                ]} />

                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left font-semibold mt-5">For Professionals (CXOs, Directors, Advisors, Consultants):</p>
                <BulletList items={[
                    'Structured CV builder data: past roles, key outcomes, industries served',
                    'Credentials, certifications, government-issued ID (for vetting), social security/tax numbers',
                    'Availability preferences, engagement types, hourly/monthly rate card',
                    'Bank account/payment details for milestone payouts',
                    'Portfolio, case studies, and client reviews',
                ]} />

                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left font-semibold mt-5">For Admin/PMO Team (Internal Users):</p>
                <BulletList items={[
                    'Vetting notes, interview records, skill tags, dispute resolution logs',
                ]} />

                <SubHeading>B. Information Collected Automatically</SubHeading>
                <BulletList items={[
                    'Device & Connection Info: IP address, browser type, operating system, device IDs',
                    'Usage Data: Pages viewed, clicks, time spent, search filters used, shortlisting activity',
                    'Communication Logs: Chat messages, meeting scheduling data (via in-platform or integrated calendar)',
                    'Transaction Logs: Milestone approvals, escrow status, invoice views',
                ]} />

                <SubHeading>C. Information from Third Parties</SubHeading>
                <BulletList items={[
                    'Vetting & Verification Partners: Identity verification status, background checks (where consented), and professional license validation',
                    'LinkedIn / Other Professional Networks: If you connect, we may import your public profile data to pre-fill your profile',
                    'Payment Processors (Razorpay/Stripe): Payment confirmation, transaction IDs, and escrow status',
                    'Fraud Prevention Services: Risk scores and fraud alerts',
                ]} />
            </>
        ),
    },
    {
        id: 'legal-basis',
        icon: Shield,
        number: '3',
        title: 'Legal Basis for Processing (GDPR / India DPDP Act)',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    We process your personal data only when we have a lawful basis to do so:
                </p>
                <StyledTable
                    headers={['Basis', 'When It Applies']}
                    rows={[
                        ['Contractual Necessity', 'To create your account, post requirements, match professionals, manage escrow, and complete engagements.'],
                        ['Legitimate Interests', 'To improve our matching algorithm, prevent fraud, enforce our Terms of Service, and personalise your experience — provided your rights do not override these interests.'],
                        ['Legal Compliance', 'To comply with tax laws (GST/invoicing), anti-money laundering regulations, and court orders.'],
                        ['Consent', 'For optional marketing communications, testimonials, or data sharing beyond core Platform functionality. You may withdraw consent at any time.'],
                    ]}
                />
            </>
        ),
    },
    {
        id: 'how-we-use',
        icon: Settings,
        number: '4',
        title: 'How We Use Your Information',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">We use your information to:</p>
                <BulletList items={[
                    'Operate the Marketplace: Create profiles, post requirements, match Companies with Professionals, enable chat and meeting scheduling',
                    'Ensure Trust & Safety: Vet Professionals, verify company details, monitor for fraudulent activity, enforce escrow risk controls',
                    'Facilitate Payments: Manage milestone-based escrow, release payments upon approval, generate invoices, handle disputes',
                    'Improve & Personalise: Recommend relevant professionals/opportunities, optimise search filters, reduce cognitive load via guided workflows',
                    'Communicate: Send platform notifications, milestone updates, payment alerts, and (with consent) promotional content about new features',
                    'Comply with Law: Respond to lawful requests from regulatory or law enforcement authorities',
                ]} />
            </>
        ),
    },
    {
        id: 'retention',
        icon: Clock,
        number: '5',
        title: 'How Long We Keep Personal Information',
        content: (
            <>
                <StyledTable
                    headers={['Data Category', 'Retention Period']}
                    rows={[
                        ['Active Account', 'Duration of account activity'],
                        ['Closed Account', 'Up to 7 years (tax, anti-fraud, and legal obligations)'],
                        ['Vetting / Verification Documents', 'Minimum 3 years or as required by compliance standards'],
                        ['Chat Logs & Messages', '12 months after engagement completion (longer if required for disputes)'],
                        ['Anonymised / Aggregated Data', 'Indefinitely for analytics and product improvement'],
                    ]}
                />
            </>
        ),
    },
    {
        id: 'children',
        icon: UserCheck,
        number: '6',
        title: 'Children\'s Privacy',
        content: (
            <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                ExigentCX is strictly for senior professionals and business entities. No one under the age of 18 is permitted to use the Platform. We do not knowingly collect personal information from minors. If we discover such data, we will delete it immediately. Parents or guardians should contact us if they believe a minor has provided us with information.
            </p>
        ),
    },
    {
        id: 'sharing',
        icon: Users,
        number: '7',
        title: 'Sharing Your Personal Information with Third Parties',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">We share your data only in the following circumstances:</p>
                <BulletList items={[
                    'Between Companies and Professionals: When you enter an engagement, both parties can see each other\'s profiles, contact details, and engagement workspace activity. Each party acts as a separate data controller.',
                    'Service Providers: We share data with hosting providers (AWS/GCP), payment processors (Razorpay, Stripe), identity verification vendors, email/SMS infrastructure, and analytics tools. These providers are contractually bound to use data only for ExigentCX purposes.',
                    'Legal & Regulatory Authorities: We disclose data in response to a court order, subpoena, government request, or to enforce our Terms of Service, prevent fraud, or protect safety.',
                    'Corporate Transactions: If ExigentCX is acquired, merged, or sells assets, user data will be transferred to the new entity, subject to the same privacy commitments.',
                    'With Your Consent: For example, publishing a testimonial or participating in a case study.',
                ]} />
                <NoticeBox>
                    Important: We do not sell your personal information to third parties for their own marketing purposes.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'where-process',
        icon: Globe,
        number: '8',
        title: 'Where We Process Your Personal Information',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    ExigentCX operates globally. Your data may be stored or processed in India, the United States, or the European Economic Area (EEA) depending on our service providers.
                </p>
                <BulletList items={[
                    'For users in the EU/EEA/UK, we ensure adequate safeguards (e.g., EU Standard Contractual Clauses) for data transfers.',
                    'For users in India, data may be transferred only in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
                ]} />
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-4">
                    By using ExigentCX, you consent to such cross-border transfers.
                </p>
            </>
        ),
    },
    {
        id: 'cookies',
        icon: Info,
        number: '9',
        title: 'Cookies & Tracking Technologies',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">We use cookies, pixels, and similar technologies to:</p>
                <StyledTable
                    headers={['Cookie Type', 'Purpose', 'Status']}
                    rows={[
                        ['Essential', 'Enable login, session persistence, and secure transactions.', 'Cannot be disabled'],
                        ['Analytics', 'Understand how you use the Platform (e.g., Hotjar, Google Analytics) to improve workflows.', 'Optional'],
                        ['Functional', 'Remember your filters, saved drafts, and preferences.', 'Optional'],
                        ['Marketing (with consent)', 'Measure ad campaign performance on LinkedIn, Google, etc.', 'Consent required'],
                    ]}
                />
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-4">
                    You can manage cookie preferences via your browser settings or our consent banner. Disabling essential cookies will impact Platform functionality.
                </p>
            </>
        ),
    },
    {
        id: 'data-security',
        icon: Lock,
        number: '10',
        title: 'Data Security',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">We implement enterprise-grade security measures:</p>
                <BulletList items={[
                    'Encryption: TLS 1.3 for data in transit; AES-256 for data at rest',
                    'Access Controls: Role-based access (RBAC) for internal Admin/PMO team',
                    'PCI-DSS Compliance: For payment and escrow processing via integrated gateways',
                    'Regular Audits: Penetration testing, vulnerability scanning, and employee privacy training',
                    'Incident Response: We have a breach notification process compliant with applicable laws',
                ]} />
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-4">
                    While we strive for the highest security standards, no method of transmission over the Internet is 100% secure. You are responsible for keeping your login credentials confidential.
                </p>
            </>
        ),
    },
    {
        id: 'your-rights',
        icon: Eye,
        number: '11',
        title: 'Your Privacy Rights (India, EU, US)',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">Depending on your location, you may have the following rights:</p>

                <InfoCard color="teal">
                    <p className="text-sm font-black text-[#134e40] uppercase tracking-wider mb-2 text-left">🇮🇳 India (DPDP Act, 2023)</p>
                    <BulletList items={[
                        'Right to access your personal information',
                        'Right to correction and erasure (limited by legal retention requirements)',
                        'Right to grievance redressal — contact our Data Protection Officer',
                        'Right to nominate a representative',
                    ]} />
                </InfoCard>

                <InfoCard color="amber">
                    <p className="text-sm font-black text-[#134e40] uppercase tracking-wider mb-2 text-left">🇪🇺 EU / EEA / UK (GDPR)</p>
                    <BulletList items={[
                        'Right to access, rectify, or erase your data',
                        'Right to restrict or object to processing (including profiling for matching)',
                        'Right to data portability',
                        'Right to withdraw consent at any time',
                        'Right to lodge a complaint with your supervisory authority',
                    ]} />
                </InfoCard>

                <InfoCard color="slate">
                    <p className="text-sm font-black text-[#134e40] uppercase tracking-wider mb-2 text-left">🇺🇸 US Residents (California, Virginia, Colorado)</p>
                    <BulletList items={[
                        'Right to know what personal information we collect and share',
                        'Right to delete your data (subject to exceptions)',
                        'Right to opt out of \'selling\' or \'sharing\' for targeted advertising — we do not sell your data',
                        'Right to non-discrimination for exercising your rights',
                    ]} />
                </InfoCard>

                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-4">
                    To exercise your rights, please contact us using the details in Section 13.
                </p>
            </>
        ),
    },
    {
        id: 'deleting',
        icon: Trash2,
        number: '12',
        title: 'Deleting or Updating Your Information',
        content: (
            <>
                <BulletList items={[
                    'Update: You can update most profile and company information directly via your dashboard settings (e.g., profile strength meter, rate card, availability).',
                    'Delete: To request account deletion, go to Settings → Request Account Deletion or contact support. We will deactivate your account within 7 days and begin deletion of non-essential data. Some information (e.g., financial transactions, contracts) will be retained for legal compliance.',
                ]} />
                <NoticeBox>
                    Deleting your account will remove you from active engagements. Please complete or transfer any ongoing obligations before deletion.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'contact',
        icon: Mail,
        number: '13',
        title: 'Contact Us (Grievance Officer & DPO)',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mb-4">
                    For any questions, privacy complaints, or to exercise your rights:
                </p>
                <div className="space-y-3 mt-4 text-left">
                    {[
                        {
                            label: 'Customer Support (Privacy Ticket)',
                            email: 'support@exigentcx.com',
                            note: 'Subject: Privacy Request',
                            color: 'border-[#0eb59a] dark:border-[#0eb59a]/20 bg-[#f0fdfa] dark:bg-[#0eb59a]/10'
                        },
                        {
                            label: 'Grievance Officer (India – DPDP Act)',
                            email: 'grievance@exigentcx.com',
                            note: 'For Indian data protection concerns',
                            color: 'border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/40'
                        },
                        {
                            label: 'Data Protection Officer (EU/GDPR)',
                            email: 'dpo@exigentcx.com',
                            note: 'For EU/EEA/UK privacy requests',
                            color: 'border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5'
                        },
                    ].map((item, i) => (
                        <motion.a
                            key={i}
                            href={`mailto:${item.email}`}
                            whileHover={{
                                x: 4,
                                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                            }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-center justify-between 
                      p-4 rounded-2xl border border-l-4 
                      transition-all cursor-pointer group text-left
                      ${item.color}`}
                        >
                            <div>
                                <p className="text-xs font-black 
                        text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 text-left">
                                    {item.label}
                                </p>
                                <p className="text-sm font-bold 
                        text-[#0eb59a] group-hover:text-[#134e40] 
                        transition-colors text-left">
                                    {item.email}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 
                        mt-0.5 text-left">{item.note}</p>
                            </div>
                            <Mail size={16} className="text-gray-300 dark:text-gray-500 
                      group-hover:text-[#0eb59a] transition-colors 
                      shrink-0" />
                        </motion.a>
                    ))}
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl 
                border border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 text-left">
                    <strong className="text-gray-700 dark:text-gray-300">
                        Response Time:
                    </strong> We will respond within 30 days
                    (or as required by applicable law).
                </div>
            </>
        ),
    },
    {
        id: 'changes',
        icon: Bell,
        number: '14',
        title: 'Changes to This Privacy Policy',
        content: (
            <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                We may update this Policy from time to time to reflect changes in law, our Platform, or industry standards. Material changes will be notified via email (to registered users) or via an in-platform banner at least 14 days before they take effect. The "Last Updated" date at the top of this Policy will be revised accordingly. Your continued use of ExigentCX after changes indicates your acceptance of the revised Policy.
            </p>
        ),
    },
];

// ── MAIN COMPONENT ──
const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('short-version');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY + 140;
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i].id);
                if (el && el.offsetTop <= scrollY) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleScrollButton = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScrollButton, { passive: true });
        return () => window.removeEventListener('scroll', handleScrollButton);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafb] dark:bg-[#0f1117] font-sans pt-20">

            {/* ── DARK HERO HEADER ── */}
            <section className="relative py-20 bg-[#111827] border-b border-gray-800 overflow-hidden">
                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #0eb59a 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#134e40]/20 to-[#111827]" />
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#0eb59a]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 text-sm font-medium text-teal-50 tracking-wider uppercase backdrop-blur-md">
                            <Shield size={15} className="text-[#0eb59a]" />
                            Legal Information
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-3 tracking-tight">
                            Privacy <span className="text-[#0eb59a]">Policy</span>
                        </h1>
                        <p className="text-sm text-gray-400 font-light mb-1">
                            Last Updated: May 2026 &nbsp;·&nbsp; Effective: May 2026
                        </p>
                        <p className="text-xs text-gray-500 mt-2 max-w-xl mx-auto leading-relaxed">
                            ExigentCX is committed to protecting the personal and professional
                            information of its users. This Policy explains how we collect, use,
                            disclose, and safeguard your information.
                        </p>

                        {/* Jump to section pills */}
                        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                            {(() => {
                                const map = {
                                    'Data Security': 'data-security',
                                    'Your Rights': 'your-rights',
                                    'Contact Us': 'contact',
                                };
                                return ['Data Security', 'Your Rights', 'Contact Us'].map((label, i) => (
                                    <motion.button
                                        key={label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        whileHover={{
                                            scale: 1.05,
                                            borderColor: '#0eb59a',
                                            backgroundColor: 'rgba(14,181,154,0.15)'
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => scrollTo(map[label])}
                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-white/8 border border-white/15 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                                    >
                                        <ChevronRight size={11} />
                                        {label}
                                    </motion.button>
                                ));
                            })()}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── MAIN LAYOUT ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24">
                <div className="flex gap-8 items-start">

                    {/* ── LEFT SIDEBAR — Table of Contents ── */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
                        <div className="bg-white dark:bg-[#1a1d23] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-[#f0fdfa] dark:bg-[#0eb59a]/10">
                                <p className="text-xs font-black text-[#134e40] uppercase tracking-widest">
                                    Contents
                                </p>
                            </div>
                            <nav className="p-2">
                                {tocItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => scrollTo(item.id)}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium leading-snug ${activeSection === item.id
                                                ? 'bg-[#134e40] text-white font-bold border-l-4 border-[#0eb59a] rounded-l-none rounded-r-xl pl-2'
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-[#f0fdfa] dark:hover:bg-[#0eb59a]/10 hover:text-[#134e40] rounded-xl transition-all duration-150 cursor-pointer'
                                            }`}
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                            </nav>
                        </div>

                        {/* Quick contact card */}
                        <div className="mt-4 bg-gradient-to-br from-[#134e40] to-[#0eb59a] rounded-2xl p-4 text-white">
                            <Shield size={16} className="text-white/70 mb-2" />
                            <p className="text-xs font-black uppercase tracking-wider mb-1">
                                Privacy Questions?
                            </p>
                            <p className="text-[11px] text-white/70 leading-relaxed mb-3 text-left">
                                Our team responds within 30 days.
                            </p>
                            <a
                                href="mailto:support@exigentcx.com"
                                className="block text-center text-[11px] font-black bg-white/20 hover:bg-white hover:text-[#134e40] transition-all rounded-xl py-2 border border-white/20"
                            >
                                support@exigentcx.com
                            </a>
                        </div>
                    </aside>

                    {/* ── RIGHT CONTENT ── */}
                    <main className="flex-1 min-w-0 text-left">
                        {/* Intro paragraph */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-[#1a1d23] rounded-2xl border border-gray-200 dark:border-white/10 shadow-md p-7 mb-6 border-l-4 border-l-[#0eb59a]"
                        >
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                                By accessing or using ExigentCX including as a Company, Professional,
                                or Admin/PMO user, you acknowledge that you have read, understood, and
                                agree to be bound by this Policy. If you do not agree, please do not use
                                our Platform.
                            </p>
                        </motion.div>

                        {/* All sections */}
                        <div className="bg-white dark:bg-[#1a1d23] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm divide-y divide-gray-100 dark:divide-white/5 text-left">
                            {sections.map((section, index) => (
                                <motion.section
                                    key={section.id}
                                    id={section.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: index * 0.04,
                                        ease: 'easeOut'
                                    }}
                                    className="px-8 py-8 sm:px-10 sm:py-10 scroll-mt-28 group transition-colors duration-200 hover:bg-gray-50/60 dark:hover:bg-white/5 relative text-left"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0eb59a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full" />
                                    <SectionHeading icon={section.icon} title={section.title} number={section.number} />
                                    <div className="pl-0 sm:pl-1">
                                        {section.content}
                                    </div>
                                </motion.section>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })}
                        className="fixed bottom-8 right-8 z-50 w-11 h-11 bg-[#134e40] hover:bg-[#0eb59a] text-white rounded-2xl shadow-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
                    >
                        <ChevronRight size={18} className="-rotate-90" />
                    </motion.button>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;