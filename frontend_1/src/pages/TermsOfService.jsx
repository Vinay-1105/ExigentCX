import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Lock, FileText, UserCheck, Settings,
    Mail, Bell, Globe, Clock, Users, CreditCard,
    ChevronRight, AlertCircle, Scale, XCircle,
    MapPin, Award, CheckCircle, Briefcase, Info,
    RefreshCw, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// ── TABLE OF CONTENTS ──
const tocItems = [
    { id: 'overview', label: '1. Overview & Key Principles' },
    { id: 'definitions', label: '2. Definitions' },
    { id: 'eligibility', label: '3. Eligibility' },
    { id: 'account-reg', label: '4. Account Registration & Vetting' },
    { id: 'role-cxoconnect', label: '5. Role of ExigentCX' },
    { id: 'user-contracts', label: '6. User Contracts' },
    { id: 'requirement-posting', label: '7. Requirement Posting' },
    { id: 'fees', label: '8. Fees, Commissions & Payments' },
    { id: 'escrow', label: '9. Escrow-Based Payments' },
    { id: 'non-circumvention', label: '10. Non-Circumvention' },
    { id: 'dispute', label: '11. Dispute Resolution' },
    { id: 'pmo-role', label: '12. Admin / PMO Role' },
    { id: 'confidentiality', label: '13. Confidentiality & Privacy' },
    { id: 'ip-rights', label: '14. Intellectual Property' },
    { id: 'prohibited', label: '15. Prohibited Conduct' },
    { id: 'termination', label: '16. Termination & Suspension' },
    { id: 'liability', label: '17. Limitation of Liability' },
    { id: 'indemnification', label: '18. Indemnification' },
    { id: 'warranties', label: '19. Warranties & Disclaimers' },
    { id: 'governing-law', label: '20. Governing Law' },
    { id: 'notices', label: '21. Notices' },
    { id: 'general', label: '22. General Provisions' },
    { id: 'contact', label: '23. Contact Us' },
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
        <h2 className="text-xl md:text-2xl font-black text-[#134e40] leading-tight text-left">
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
                transition={{ duration: 0.3, delay: i * 0.04, ease: 'easeOut' }}
                className="flex items-start gap-3 text-left"
            >
                <span className="w-2 h-2 rounded-full bg-[#0eb59a] shrink-0 mt-[7px]" />
                <span className="text-gray-600 dark:text-gray-400 text-base leading-[1.7] text-left flex-1">{item}</span>
            </motion.li>
        ))}
    </ul>
);

const NumberedList = ({ items }) => (
    <ul className="space-y-3 mt-4 text-left">
        {items.map((item, i) => (
            <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: 'easeOut' }}
                className="flex items-start gap-3 text-left"
            >
                <span className="w-6 h-6 rounded-lg bg-[#134e40] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-base leading-[1.7] text-left flex-1">{item}</span>
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
        red: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/30 border-l-red-400 dark:text-red-300',
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
                <tr className="bg-[#f0fdfa] dark:bg-[#0eb59a]/10">
                    {headers.map((h, i) => (
                        <th key={i} className="px-5 py-3.5 text-left text-xs font-black text-[#134e40] uppercase tracking-wider border-b border-[#ccfbf1] dark:border-[#0eb59a]/20">
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
                            <td key={j} className={`px-5 py-4 text-sm leading-relaxed align-top text-left ${j === 0 ? 'font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-100 dark:border-white/5 w-2/5' : 'text-gray-600 dark:text-gray-400'}`}>
                                {cell}
                            </td>
                        ))}
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>
);

const NoticeBox = ({ children, color = 'amber' }) => {
    const styles = {
        amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30 border-l-amber-400',
        red: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/30 border-l-red-400',
        teal: 'bg-[#f0fdfa] dark:bg-[#0eb59a]/10 border-[#ccfbf1] dark:border-[#0eb59a]/20 border-l-[#0eb59a]',
    };
    const textStyles = {
        amber: 'text-amber-800 dark:text-amber-300',
        red: 'text-red-800 dark:text-red-300',
        teal: 'text-[#134e40]',
    };
    const iconStyles = {
        amber: 'text-amber-500',
        red: 'text-red-500',
        teal: 'text-[#0eb59a]',
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-5 flex items-start gap-3 p-4 border border-l-4 rounded-2xl text-left ${styles[color]}`}
        >
            <AlertCircle size={20} className={`shrink-0 mt-0.5 ${iconStyles[color]}`} />
            <p className={`text-sm font-semibold leading-relaxed text-left ${textStyles[color]}`}>{children}</p>
        </motion.div>
    );
};

// ── SECTIONS DATA ──
const sections = [
    {
        id: 'overview',
        number: '1',
        icon: Info,
        title: 'Overview & Key Principles',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mb-4">
                    ExigentCX provides a trusted, governance-driven marketplace for senior leadership engagement. The Platform is founded on the following key principles:
                </p>
                <StyledTable
                    headers={['Principle', 'Description']}
                    rows={[
                        ['Vetted Network Only', 'Every Professional undergoes identity verification, credential review, and interview before approval on the Platform.'],
                        ['Escrow Protection', 'Milestone-based payments are held in escrow and released only upon mutual approval or PMO resolution, ensuring trust for both parties.'],
                        ['PMO Governance', 'Admin/PMO team monitors engagements, flags risks, and resolves disputes to maintain marketplace integrity.'],
                        ['No Employment', 'ExigentCX is not an employer. All engagements are independent contractor relationships between Companies and Professionals.'],
                    ]}
                />
            </>
        ),
    },
    {
        id: 'definitions',
        number: '2',
        icon: FileText,
        title: 'Definitions',
        content: (
            <StyledTable
                headers={['Term', 'Definition']}
                rows={[
                    ['"Company"', 'A startup, SME, or enterprise that posts requirements and engages Professionals through the Platform.'],
                    ['"Professional"', 'A CXO, Director, Advisor, Consultant, or senior expert who offers services via the Platform and has been vetted by ExigentCX.'],
                    ['"PMO"', 'The internal Admin/Project Management Office team that governs vetting, milestone release, and dispute resolution.'],
                    ['"Engagement"', 'A specific role (fractional, interim, advisory, project) between a Company and a Professional.'],
                    ['"Milestone"', 'A defined deliverable or payment trigger within an Engagement.'],
                    ['"Escrow"', "Funds held by ExigentCX's payment partner (Razorpay/Stripe) pending milestone completion."],
                    ['"User Contract"', 'The binding agreement between Company and Professional formed on the Platform, incorporating these Terms.'],
                ]}
            />
        ),
    },
    {
        id: 'eligibility',
        number: '3',
        icon: UserCheck,
        title: 'Eligibility',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">You may not use ExigentCX if any of the following conditions apply:</p>
                <BulletList items={[
                    'You are under 18 years of age.',
                    'You are unable to form legally binding contracts.',
                    'You are suspended or banned from the Platform.',
                    'You are subject to sanctions under Indian, US, EU, or other applicable law.',
                ]} />
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-5">
                    Companies must have a valid GST (India) or equivalent tax ID where required. Professionals must provide government-issued ID and professional credentials for vetting.
                </p>
            </>
        ),
    },
    {
        id: 'account-reg',
        number: '4',
        icon: Settings,
        title: 'Account Registration & Vetting',
        content: (
            <>
                <SubHeading>A. Companies</SubHeading>
                <BulletList items={[
                    'Provide email, LinkedIn, GST (optional), company profile (industry, size, funding stage).',
                    'Role-based access (Founder, HR, Finance lead) is permitted.',
                    'One account per legal entity unless approved otherwise.',
                ]} />

                <SubHeading>B. Professionals</SubHeading>
                <BulletList items={[
                    'Complete structured CV builder (roles, outcomes, industries served).',
                    'Upload credentials, ID proof (PAN/Aadhaar/Passport/Driving Licence).',
                    'Agree to background verification (where permitted by law).',
                    'Set availability and rate card (hourly/monthly).',
                ]} />

                <SubHeading>C. Vetting by Admin/PMO</SubHeading>
                <BulletList items={[
                    'Every Professional application is reviewed by PMO.',
                    'May include interview, skill tagging, and reference checks.',
                    'ExigentCX may reject any application without providing a reason.',
                ]} />
                <NoticeBox color="teal">
                    You must keep your account credentials confidential. You are responsible for all activities under your account.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'role-cxoconnect',
        number: '5',
        icon: Globe,
        title: 'Role of ExigentCX – Marketplace Only',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    ExigentCX is a technology platform and administrative intermediary, not a party to any engagement between Company and Professional.
                </p>
                <BulletList items={[
                    'We facilitate matching, contracts, NDAs, escrow payments, and communication.',
                    'We do not supervise, control, or direct any Professional\'s work.',
                    'We are not an employer, joint employer, or labour-hire agency.',
                    'No employment relationship exists between ExigentCX and any Professional, ExigentCX and any Company, or Company and Professional (unless explicitly contracted separately).',
                    'Professionals are independent contractors. Companies are responsible for compliance with local labour laws.',
                ]} />
            </>
        ),
    },
    {
        id: 'user-contracts',
        number: '6',
        icon: Briefcase,
        title: 'User Contracts Between Companies & Professionals',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    When a Company invites a Professional and the Professional accepts, the following terms apply:
                </p>
                <BulletList items={[
                    'A User Contract is formed directly between Company and Professional.',
                    'The Platform generates an auto-NDA and engagement letter based on requirement details.',
                    'The User Contract incorporates these Terms and any milestone/payment schedule.',
                ]} />
                <SubHeading>Key Obligations</SubHeading>
                <StyledTable
                    headers={['Party', 'Obligation']}
                    rows={[
                        ['Company', 'Pay agreed fees via escrow, provide timely feedback, and approve deliverables reasonably.'],
                        ['Professional', 'Deliver services as described, meet milestones, and maintain confidentiality throughout the engagement.'],
                    ]}
                />
                <NoticeBox color="amber">
                    Both parties agree that ExigentCX is not liable for performance or non-performance of any User Contract.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'requirement-posting',
        number: '7',
        icon: Database,
        title: 'Requirement Posting & Engagement Types',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">Companies may post requirements for the following engagement types:</p>
                <StyledTable
                    headers={['Engagement Type', 'Description', 'Typical Duration']}
                    rows={[
                        ['Fractional Leadership', 'Ongoing part-time CXO role (e.g., 10–20 hrs/week)', '3–12 months'],
                        ['Interim Leadership', 'Full-time temporary role filling a gap in the org', '3–6 months'],
                        ['Advisory / Consulting', 'Project-based or retainership advisory engagement', '1–6 months'],
                        ['Managed Transformation', 'PMO-led delivery with multiple experts', '3–18 months'],
                    ]}
                />
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-4">
                    Each requirement must specify: functional area, duration, budget range, and urgency. ExigentCX reserves the right to remove any requirement that violates these Terms.
                </p>
            </>
        ),
    },
    {
        id: 'fees',
        number: '8',
        icon: CreditCard,
        title: 'Fees, Commissions & Payments',
        content: (
            <>
                <SubHeading>A. For Companies</SubHeading>
                <BulletList items={[
                    'Platform Fee: 5%–10% of engagement value (varies by plan; disclosed before posting).',
                    'Escrow Handling Fee: As charged by the payment partner (Razorpay/Stripe).',
                    'Managed Consulting (Optional): Additional fee for PMO-led delivery.',
                ]} />

                <SubHeading>B. For Professionals</SubHeading>
                <BulletList items={[
                    'Platform Commission: 10% of each milestone payment received (unless a promotional rate applies).',
                    'Withdrawal Fee: As per payment gateway (if applicable).',
                    'Verification Fee: One-time fee may apply for enhanced vetting (e.g., background check).',
                ]} />

                <SubHeading>C. General</SubHeading>
                <BulletList items={[
                    'All fees are in Indian Rupees (INR) or as specified in USD for global engagements.',
                    'Fees are non-refundable except as provided in the Dispute Resolution section.',
                    'ExigentCX may change fees with 30 days\' notice.',
                ]} />
            </>
        ),
    },
    {
        id: 'escrow',
        number: '9',
        icon: Lock,
        title: 'Escrow-Based Milestone Payments',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mb-4">
                    To ensure trust and payment security, all payments are handled via escrow. The escrow workflow operates as follows:
                </p>
                <div className="space-y-3 mt-4">
                    {[
                        { step: '1', text: 'Company posts requirement with budget and milestone structure.' },
                        { step: '2', text: 'Upon engagement acceptance, Company deposits funds into escrow (Razorpay/Stripe).' },
                        { step: '3', text: 'Milestones are defined (e.g., 30% kick-off, 40% mid-point, 30% completion).' },
                        { step: '4', text: 'Professional submits deliverable; Company approves or requests changes.' },
                        { step: '5', text: 'Upon approval, milestone funds are released to Professional.' },
                        { step: '6', text: 'If no response from Company within 7 days of completion notice, funds auto-release (subject to PMO review if disputed).' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3"
                        >
                            <span className="w-7 h-7 rounded-xl bg-[#134e40] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {item.step}
                            </span>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.7] text-left flex-1">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
                <SubHeading>Escrow Release Conditions</SubHeading>
                <BulletList items={[
                    'Mutual written approval via the Platform.',
                    'PMO decision after dispute resolution.',
                    'Failure of the Company to respond within the specified timeline.',
                ]} />
                <NoticeBox color="red">
                    No Chargebacks: By using escrow, Company agrees not to initiate chargebacks with their bank or card issuer. All disputes must be resolved via ExigentCX's internal PMO process.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'non-circumvention',
        number: '10',
        icon: AlertCircle,
        title: 'Non-Circumvention & Off-Platform Engagements',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    To protect the integrity of the marketplace, the following non-circumvention terms apply:
                </p>
                <BulletList items={[
                    'For 24 months after first introduction or engagement on ExigentCX, you agree not to engage any Professional identified via the Platform outside the Platform.',
                    'Conversion Fee: To move an engagement off-platform before 24 months, you must pay either 13% of projected annual compensation (hourly rate × 2,080 hrs/year) or ₹2,50,000, whichever is greater — unless otherwise agreed in writing.',
                    'After 24 months, off-platform engagement is permitted at no additional cost.',
                    'Enterprise clients with a separate MSA have tailored non-circumvention terms.',
                ]} />
                <NoticeBox color="red">
                    Violation may result in account suspension and legal action to recover applicable fees.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'dispute',
        number: '11',
        icon: Scale,
        title: 'Dispute Resolution & Governance (PMO Layer)',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    ExigentCX provides a managed dispute resolution process overseen by the internal PMO team:
                </p>
                <SubHeading>A. Milestone Disputes (Work Quality / Deliverables)</SubHeading>
                <BulletList items={[
                    'Either party can raise a dispute within 7 days of milestone submission or approval.',
                    'PMO will review evidence (documents, chat logs, deliverables).',
                    'PMO may order partial/full release, rework at Professional\'s cost, or a refund to Company.',
                ]} />

                <SubHeading>B. Non-Payment Disputes</SubHeading>
                <BulletList items={[
                    'If Company fails to fund escrow, the engagement is suspended.',
                    'If Professional fails to deliver, the milestone may be reversed.',
                ]} />

                <SubHeading>C. Governance</SubHeading>
                <BulletList items={[
                    'PMO decisions are final and binding for disputes up to ₹5,00,000.',
                    'For larger amounts, either party may pursue arbitration or court proceedings (see Section 20).',
                    'PMO shall act as an ordinary reasonable person, not as a legal tribunal.',
                ]} />
                <NoticeBox color="teal">
                    Both parties agree to cooperate fully with PMO investigations.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'pmo-role',
        number: '12',
        icon: Users,
        title: 'Admin / PMO Role & Vetting Workflow',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mb-2">
                    The ExigentCX Admin/PMO team is responsible for the following platform governance functions:
                </p>
                <StyledTable
                    headers={['Function', 'Description']}
                    rows={[
                        ['Vetting', 'Reviewing Professional applications, conducting interviews, and skill tagging.'],
                        ['Monitoring', 'Tracking active engagements, milestone progress, and risk flags (delay, dispute).'],
                        ['Escrow Control', 'Approving milestone releases in cases of no-response or active dispute.'],
                        ['Dispute Resolution', 'Investigating and ruling on disagreements between Companies and Professionals.'],
                    ]}
                />
                <NoticeBox color="teal">
                    You agree that PMO has the right to access engagement workspaces (chats, documents, milestone status) solely for governance purposes.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'confidentiality',
        number: '13',
        icon: Lock,
        title: 'Confidentiality & Data Privacy',
        content: (
            <BulletList items={[
                'Both Companies and Professionals agree to keep each other\'s confidential information (business plans, financials, trade secrets) strictly confidential.',
                'NDAs generated via the Platform are legally binding on both parties.',
                'ExigentCX processes personal data as described in our Privacy Policy. We do not sell your data.',
                'Professional Obligation: You must not disclose the Company\'s internal information even after the engagement ends.',
            ]} />
        ),
    },
    {
        id: 'ip-rights',
        number: '14',
        icon: Award,
        title: 'Intellectual Property Rights',
        content: (
            <StyledTable
                headers={['Category', 'Policy']}
                rows={[
                    ['Professional\'s IP', 'Any pre-existing tools, methodologies, or code remain the Professional\'s property and are not transferred by default.'],
                    ['Deliverables IP', 'Unless otherwise agreed in writing, all deliverables created specifically for the engagement become the Company\'s property upon full payment.'],
                    ['Platform IP', 'ExigentCX\'s software, design, algorithms, and content are owned by ExigentCX. You may not copy, scrape, or reverse-engineer the Platform.'],
                ]}
            />
        ),
    },
    {
        id: 'prohibited',
        number: '15',
        icon: XCircle,
        title: 'Prohibited Conduct',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    You agree not to engage in any of the following activities on or in connection with the Platform:
                </p>
                <NumberedList items={[
                    'Post false, misleading, or deceptive requirement descriptions.',
                    'Share contact information (email, phone, WhatsApp) in public posts to bypass Platform messaging.',
                    'Solicit or accept payments outside the Platform\'s escrow system.',
                    'Harass, threaten, or abuse any user or ExigentCX staff.',
                    'Use the Platform for any illegal purpose (including money laundering or fraud).',
                    'Upload malware or attempt to breach the Platform\'s security.',
                    'Create multiple accounts to circumvent vetting or account bans.',
                ]} />
                <NoticeBox color="red">
                    Violation may result in immediate termination and forfeiture of escrowed funds where ExigentCX suffers a loss.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'termination',
        number: '16',
        icon: RefreshCw,
        title: 'Termination & Suspension',
        content: (
            <>
                <SubHeading>A. By You</SubHeading>
                <BulletList items={[
                    'You may close your account at any time via Settings.',
                    'Closed accounts have no claim to refunds of fees already paid.',
                ]} />

                <SubHeading>B. By ExigentCX</SubHeading>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mt-2">We may suspend or terminate your account without prior notice if:</p>
                <BulletList items={[
                    'You breach these Terms.',
                    'You fail to pay fees or cause a chargeback.',
                    'You engage in circumvention of the Platform.',
                    'We are required to do so by law.',
                ]} />

                <SubHeading>C. Effect of Termination</SubHeading>
                <BulletList items={[
                    'Ongoing engagements will be allowed to conclude or be transferred.',
                    'Escrowed funds will be released according to milestone status and PMO direction.',
                    'You lose access to your dashboard, chat history, and match data.',
                    'You remain liable for any outstanding fees.',
                ]} />
            </>
        ),
    },
    {
        id: 'liability',
        number: '17',
        icon: Scale,
        title: 'Limitation of Liability',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">To the maximum extent permitted by applicable law:</p>
                <BulletList items={[
                    'ExigentCX shall not be liable for any indirect, incidental, special, or consequential damages (including lost profits, loss of reputation, or loss of data).',
                    'Our total aggregate liability to you shall not exceed the total fees paid by you to ExigentCX in the 3 months preceding the claim.',
                    'We are not responsible for acts or omissions of any Company or Professional.',
                    'We are not responsible for delays caused by payment gateways or third-party services.',
                    'We are not responsible for unauthorized access to your account due to your failure to secure credentials.',
                ]} />
            </>
        ),
    },
    {
        id: 'indemnification',
        number: '18',
        icon: Shield,
        title: 'Indemnification',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    You agree to indemnify and hold harmless ExigentCX, its affiliates, officers, employees, and PMO team from any claims, damages, losses, or expenses (including legal fees) arising from:
                </p>
                <BulletList items={[
                    'Your breach of these Terms.',
                    'Your violation of any law or third-party rights.',
                    'Any claim that a Professional was misclassified as an independent contractor by your Company.',
                    'Any dispute between you and another user (except as resolved via PMO).',
                ]} />
            </>
        ),
    },
    {
        id: 'warranties',
        number: '19',
        icon: CheckCircle,
        title: 'Warranties & Disclaimers',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                    ExigentCX provides the Platform "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not warrant that:
                </p>
                <BulletList items={[
                    'The Platform will be uninterrupted, error-free, or secure at all times.',
                    'Any match, recommendation, or vetting will guarantee a successful engagement.',
                    "Professionals' profiles are 100% accurate (though we vet to a reasonable standard).",
                ]} />
                <NoticeBox color="amber">
                    We expressly disclaim all implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </NoticeBox>
            </>
        ),
    },
    {
        id: 'governing-law',
        number: '20',
        icon: MapPin,
        title: 'Governing Law & Dispute Resolution',
        content: (
            <StyledTable
                headers={['Category', 'Details']}
                rows={[
                    ['Governing Law', 'These Terms are governed by the laws of India.'],
                    ['Jurisdiction', 'Courts in Mumbai, Maharashtra shall have exclusive jurisdiction for disputes not resolved by arbitration.'],
                    ['Arbitration', 'Disputes exceeding ₹5,00,000 shall be resolved by a sole arbitrator via the Mumbai Centre for International Arbitration (MCIA), conducted in English in Mumbai.'],
                    ['Costs', 'Each party bears its own costs; the arbitrator may award costs to the prevailing party.'],
                    ['Small Claims', 'PMO decision is final and binding for disputes under ₹5,00,000; no arbitration required.'],
                ]}
            />
        ),
    },
    {
        id: 'notices',
        number: '21',
        icon: Bell,
        title: 'Notices',
        content: (
            <BulletList items={[
                'Legal notices to ExigentCX must be sent to legal@cxoconnect.com and via registered post to our registered office.',
                'Notices to you will be sent to your registered email address. Notice is deemed received 24 hours after sending.',
            ]} />
        ),
    },
    {
        id: 'general',
        number: '22',
        icon: Settings,
        title: 'General Provisions',
        content: (
            <StyledTable
                headers={['Provision', 'Details']}
                rows={[
                    ['Amendment', 'ExigentCX may update these Terms with 14 days\' notice (via email or Platform banner). Continued use constitutes acceptance.'],
                    ['Assignment', 'You may not assign these Terms without our consent. We may assign them in a merger or acquisition.'],
                    ['Severability', 'If any provision is found unenforceable, the remainder of these Terms remains in full effect.'],
                    ['Waiver', 'Our failure to enforce any right does not constitute a waiver of that right.'],
                    ['Force Majeure', 'We are not liable for delays or failures caused by events beyond our reasonable control.'],
                ]}
            />
        ),
    },
    {
        id: 'contact',
        number: '23',
        icon: Mail,
        title: 'Contact Us',
        content: (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left mb-4">
                    For questions, complaints, or legal notices, please use the following contacts:
                </p>
                <div className="space-y-3">
                    {[
                        {
                            label: 'Customer Support',
                            email: 'support@cxoconnect.com',
                            note: 'Engagement issues and general queries',
                            color: 'border-[#0eb59a] dark:border-[#0eb59a]/20 bg-[#f0fdfa] dark:bg-[#0eb59a]/10',
                        },
                        {
                            label: 'Legal / Terms Inquiries',
                            email: 'legal@cxoconnect.com',
                            note: 'For legal and contractual matters',
                            color: 'border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/40',
                        },
                        {
                            label: 'Grievance Officer (India – DPDP Act)',
                            email: 'grievance@cxoconnect.com',
                            note: 'For Indian data protection concerns',
                            color: 'border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5',
                        },
                        {
                            label: 'PMO Governance Escalations',
                            email: 'pmo@cxoconnect.com',
                            note: 'For milestone and dispute escalations',
                            color: 'border-emerald-300 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-950/40',
                        },
                    ].map((item, i) => (
                        <motion.a
                            key={i}
                            href={`mailto:${item.email}`}
                            whileHover={{ x: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-center justify-between p-4 rounded-2xl border border-l-4 transition-all cursor-pointer group ${item.color}`}
                        >
                            <div className="text-left">
                                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                                <p className="text-sm font-bold text-[#0eb59a] group-hover:text-[#134e40] transition-colors">{item.email}</p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{item.note}</p>
                            </div>
                            <Mail size={16} className="text-gray-300 dark:text-gray-500 group-hover:text-[#0eb59a] transition-colors shrink-0" />
                        </motion.a>
                    ))}
                </div>
            </>
        ),
    },
];

// ── MAIN COMPONENT ──
const TermsOfService = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
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

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const quickLinks = {
        'Fees & Payments': 'fees',
        'Prohibited Conduct': 'prohibited',
        'Contact Us': 'contact',
    };

    return (
        <div className="min-h-screen bg-[#f8fafb] dark:bg-[#0f1117] font-sans pt-20">

            {/* ── DARK HERO HEADER ── */}
            <section className="relative py-20 bg-[#111827] border-b border-gray-800 overflow-hidden">
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
                            Terms of <span className="text-[#0eb59a]">Service</span>
                        </h1>
                        <p className="text-sm text-gray-400 font-light mb-1">
                            Last Updated: May 2026 &nbsp;·&nbsp; Effective: May 2026
                        </p>
                        <p className="text-xs text-gray-500 mt-2 max-w-xl mx-auto leading-relaxed">
                            These Terms govern your access to and use of the ExigentCX website, mobile applications, and related services. By using the Platform, you agree to be bound by these Terms.
                        </p>

                        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                            {Object.entries(quickLinks).map(([label, id], i) => (
                                <motion.button
                                    key={label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    whileHover={{ scale: 1.05, borderColor: '#0eb59a', backgroundColor: 'rgba(14,181,154,0.15)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => scrollTo(id)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-white/8 border border-white/15 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                                >
                                    <ChevronRight size={11} />
                                    {label}
                                </motion.button>
                            ))}
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
                                <p className="text-xs font-black text-[#134e40] uppercase tracking-widest">Contents</p>
                            </div>
                            <nav className="p-2 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                {tocItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => scrollTo(item.id)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer leading-snug
                      ${activeSection === item.id
                                                ? 'bg-[#134e40] text-white font-bold border-l-4 border-[#0eb59a] rounded-l-none rounded-r-xl pl-2'
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-[#f0fdfa] dark:hover:bg-[#0eb59a]/10 hover:text-[#134e40]'
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
                            <p className="text-xs font-black uppercase tracking-wider mb-1">Legal Questions?</p>
                            <p className="text-[11px] text-white/70 leading-relaxed mb-3">Our team responds within 30 days.</p>
                            <a
                                href="mailto:legal@cxoconnect.com"
                                className="block text-center text-[11px] font-black bg-white/20 hover:bg-white hover:text-[#134e40] transition-all rounded-xl py-2 border border-white/20"
                            >
                                legal@cxoconnect.com
                            </a>
                        </div>
                    </aside>

                    {/* ── RIGHT CONTENT ── */}
                    <main className="flex-1 min-w-0 text-left">

                        {/* Intro card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-[#1a1d23] rounded-2xl border border-gray-200 dark:border-white/10 border-l-4 border-l-[#0eb59a] shadow-md p-7 mb-6"
                        >
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-[1.75] text-left">
                                Welcome to ExigentCX. These Terms of Service ("Terms") govern your access to and use of the ExigentCX website, mobile applications, and related services (collectively, the "Platform"). ExigentCX is a two-sided marketplace connecting Companies (startups, SMEs, enterprises) with Verified Senior Professionals (CXOs, Directors, Advisors, Consultants) for fractional leadership, interim roles, advisory projects, and managed transformation programs.
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
                                    transition={{ duration: 0.35, delay: index * 0.03, ease: 'easeOut' }}
                                    className="px-8 py-8 sm:px-10 sm:py-10 scroll-mt-28 group transition-colors duration-200 hover:bg-gray-50/60 dark:hover:bg-white/5 relative text-left"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0eb59a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full" />
                                    <SectionHeading icon={section.icon} title={section.title} number={section.number} />
                                    <div className="text-left">{section.content}</div>
                                </motion.section>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            {/* ── BACK TO TOP BUTTON ── */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

export default TermsOfService;