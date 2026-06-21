import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Building2, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import OTPModal from "../components/OTPModal";
import StatusModal from "../components/StatusModal";
import SuccessModal from "../components/SuccessModal";
import Logo from "../components/Logo";

const JOIN_STEPS = ["Basic Details", "Company Info", "Online Presence", "Account Setup"];

const STEP_ICONS = [Building2, Sparkles, Globe, ShieldCheck];

const JoinCompany = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [logoPreview, setLogoPreview] = useState(null);
	const [otpVerified, setOtpVerified] = useState(false);
	const [showOtpModal, setShowOtpModal] = useState(false);
	const [showAdminOtpModal, setShowAdminOtpModal] = useState(false);
	const [adminOtpVerified, setAdminOtpVerified] = useState(false);
	const [showErrorBanner, setShowErrorBanner] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [statusConfig, setStatusConfig] = useState({ type: "success", title: "", message: "" });
	const [additionalLinks, setAdditionalLinks] = useState([]);

	const {
		register,
		handleSubmit,
		trigger,
		watch,
		setValue,
		formState: { errors },
	} = useForm({ mode: "onChange" });

	const watchLogo = watch("logo");

	useEffect(() => {
		if (watchLogo && watchLogo.length > 0) {
			const file = watchLogo[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => setLogoPreview(reader.result);
				reader.readAsDataURL(file);
			}
		} else {
			setLogoPreview(null);
		}
	}, [watchLogo]);

	const checkUniqueField = async (field, value) => {
		const dbColumn = field === 'companyName' ? 'company_name' :
			field === 'adminEmail' ? 'admin_email' : field;
		try {
			const { data, error } = await supabase
				.from("company_applications")
				.select(dbColumn)
				.eq(dbColumn, value)
				.limit(1)
				.maybeSingle();
			if (error) { console.error("Error checking unique field:", error); return true; }
			return data === null;
		} catch (error) {
			console.error("Error checking unique field:", error);
			return true;
		}
	};

	const addAdditionalLink = () => {
		if (additionalLinks.length < 3)
			setAdditionalLinks([...additionalLinks, { platform: "Website", url: "" }]);
	};

	const removeAdditionalLink = (index) =>
		setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));

	const updateAdditionalLink = (index, field, value) => {
		const updated = [...additionalLinks];
		updated[index][field] = value;
		setAdditionalLinks(updated);
	};

	const handleNext = async () => {
		let fieldsToValidate = [];
		if (currentStep === 0) fieldsToValidate = ["companyName", "logo", "industry", "tagline"];
		else if (currentStep === 1) fieldsToValidate = ["about", "orgType", "orgSize", "companyAge"];
		else if (currentStep === 2) fieldsToValidate = ["website", "email", "contactNumber", "linkedin"];

		const isStepValid = await trigger(fieldsToValidate);

		if (currentStep === 2) {
			if (!otpVerified) {
				setStatusConfig({ type: "warning", title: "Verification Required", message: "Please verify your email address before proceeding to the next step." });
				setShowStatusModal(true);
				return;
			}
			for (const link of additionalLinks) {
				if (link.url && !link.url.startsWith("https://")) {
					setStatusConfig({ type: "error", title: "Invalid URL", message: "All additional link URLs must start with https://" });
					setShowStatusModal(true);
					return;
				}
			}
		}

		if (isStepValid) {
			setShowErrorBanner(false);
			setCurrentStep((prev) => prev + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			setShowErrorBanner(true);
		}
	};

	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
		setShowErrorBanner(false);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSendOTP = async () => {
		const emailValue = watch("email")?.trim();
		if (!errors.email && emailValue) {
			try {
				const { error } = await supabase.auth.signInWithOtp({ email: emailValue });
				if (error) throw error;
				setShowOtpModal(true);
			} catch (error) {
				setStatusConfig({ type: "error", title: "OTP Error", message: error.message });
				setShowStatusModal(true);
			}
		} else { trigger("email"); }
	};

	const handleVerifyOTP = async (otp) => {
		const emailValue = watch("email")?.trim();
		try {
			const { error } = await supabase.auth.verifyOtp({ email: emailValue, token: otp, type: "email" });
			if (error) throw error;
			setOtpVerified(true);
			setShowOtpModal(false);
			setStatusConfig({ type: "success", title: "Email Verified!", message: "Your email has been successfully verified.\nYou're all set to continue." });
			setShowStatusModal(true);
		} catch (error) {
			setStatusConfig({ type: "error", title: "Invalid OTP", message: error.message });
			setShowStatusModal(true);
		}
	};

	const handleSendAdminOTP = async () => {
		const emailValue = watch("adminEmail")?.trim();
		if (!errors.adminEmail && emailValue) {
			try {
				const { error } = await supabase.auth.signInWithOtp({ email: emailValue });
				if (error) throw error;
				setShowAdminOtpModal(true);
			} catch (error) {
				setStatusConfig({ type: "error", title: "OTP Error", message: error.message });
				setShowStatusModal(true);
			}
		} else { trigger("adminEmail"); }
	};

	const handleVerifyAdminOTP = async (otp) => {
		const emailValue = watch("adminEmail")?.trim();
		try {
			const { error } = await supabase.auth.verifyOtp({ email: emailValue, token: otp, type: "email" });
			if (error) throw error;
			setAdminOtpVerified(true);
			setShowAdminOtpModal(false);
			setStatusConfig({ type: "success", title: "Admin Email Verified!", message: "Your administrative email has been successfully verified." });
			setShowStatusModal(true);
		} catch (error) {
			setStatusConfig({ type: "error", title: "Invalid OTP", message: error.message });
			setShowStatusModal(true);
		}
	};

	const onSubmit = async (data) => {
		const isFinalValid = await trigger(["adminName", "adminEmail", "cinNumber", "gstin", "terms"]);
		if (!adminOtpVerified) {
			setStatusConfig({ type: "warning", title: "Admin Verification", message: "Please verify your Admin Email address before submitting the application." });
			setShowStatusModal(true);
			return;
		}
		if (!isFinalValid) { setShowErrorBanner(true); return; }
		setLoading(true);
		try {
			let logo_url = "";
			let coi_url = "";
			if (data.logo && data.logo[0]) {
				const logoFile = data.logo[0];
				const logoFileName = `${Date.now()}-${logoFile.name}`;
				const { data: logoData } = await supabase.storage.from("company-logos").upload(logoFileName, logoFile).catch(() => ({ data: { publicUrl: 'mockUrl' } }));
				if (logoData) logo_url = supabase.storage.from("company-logos").getPublicUrl(logoFileName)?.data?.publicUrl || "mock_logo_url";
			}
			if (data.gstCertificate && data.gstCertificate[0]) {
				const coiFile = data.gstCertificate[0];
				const coiFileName = `${Date.now()}-${coiFile.name}`;
				const { data: coiData } = await supabase.storage.from("certificates").upload(coiFileName, coiFile).catch(() => ({ data: { publicUrl: 'mockUrl' } }));
				if (coiData) coi_url = supabase.storage.from("certificates").getPublicUrl(coiFileName)?.data?.publicUrl || "mock_coi_url";
			}
			let dbError = null;
			try {
				const response = await supabase.from("company_applications").insert([{
					company_name: data.companyName, website: data.website, industry: data.industry,
					org_size: data.orgSize, org_type: data.orgType, tagline: data.tagline,
					about: data.about, logo_url, coi_url, email: data.email,
					admin_name: data.adminName, admin_email: data.adminEmail,
					gstin: data.gstin, cin_number: data.cinNumber,
					contact_number: data.contactNumber, company_age: data.companyAge,
					founded_year: data.foundedYear,
					linkedin: data.linkedin, additional_links: additionalLinks
				}]);
				dbError = response.error;
			} catch (e) { dbError = e; }
			if (dbError) throw dbError;
			setShowSuccessModal(true);
		} catch (error) {
			console.error(error);
			setStatusConfig({ type: "error", title: "Submission Failed", message: error.message });
			setShowStatusModal(true);
		} finally {
			setLoading(false);
		}
	};

	// Shared input class
	const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0eb59a] focus:border-[#0eb59a] focus:bg-white transition-all duration-200 text-gray-800 text-sm";
	const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block";

	const stepSubtitles = [
		"Establish your organization's identity",
		"Tell us about your scale and history",
		"Your digital footprint",
		"Finalize your account access",
	];

	return (
		<div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">

			{/* ── LEFT PANEL — enhanced ── */}
			<div className="hidden lg:flex flex-col w-[38%] bg-[#0d1a18] relative overflow-hidden sticky top-0 h-screen">
				{/* Background layers */}
				<div className="absolute inset-0 bg-gradient-to-br from-[#0d1a18] via-[#0f2320] to-[#0d1a18]" />
				<div className="absolute top-0 left-0 w-80 h-80 bg-[#0eb59a]/8 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-0 w-64 h-64 bg-[#134e40]/20 rounded-full blur-3xl" />
				{/* Subtle grid pattern */}
				<div className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
						backgroundSize: '40px 40px'
					}}
				/>

				<div className="relative z-10 flex flex-col h-full p-10">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-3 shrink-0 group">
						<Logo variant="dark" className="h-14" />
						<span className="text-white font-black text-2xl tracking-[0.1em] font-serif whitespace-nowrap">
							ExigentCX
						</span>
					</Link>

					{/* Main content */}
					<div className="flex-1 flex flex-col justify-center mt-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="flex flex-col items-center"
						>
							<p className="text-[#0eb59a] font-bold uppercase tracking-[0.2em] text-xs mb-4 text-center">Sign Up</p>
							<h1 className="text-4xl font-extrabold text-white leading-tight mb-4 text-center"
								style={{ fontFamily: 'Georgia, serif' }}>
								The Right{' '}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0eb59a] to-emerald-300">
									CXO.
								</span>
								<br />Right Now.
							</h1>
							<p className="text-white/40 text-sm font-light leading-relaxed max-w-xs text-center">
								Join an exclusive network of forward-thinking organizations and connect with elite fractional leadership.
							</p>
						</motion.div>
					</div>

					{/* Back to home — pinned to bottom-left of panel */}
					<Link
						to="/"
						className="absolute bottom-10 left-10 flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/60 hover:text-[#0eb59a] hover:border-[#0eb59a]/40 hover:bg-[#0eb59a]/5 text-sm font-medium transition-all duration-300 group/back w-fit z-20"
					>
						<ChevronLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
						Back to home
					</Link>
				</div>
			</div>

			{/* ── RIGHT PANEL — form ── */}
			<div className="relative flex-1 flex items-start justify-center py-8 px-4 md:px-8 overflow-y-auto">
				<div className="absolute inset-0 pointer-events-none md:hidden bg-gradient-to-br from-teal-400/10 to-transparent" />

				<div className="relative z-10 w-full max-w-2xl">

					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-5"
					>
						<h2 className="text-xl font-black text-gray-900 tracking-tight">Company Onboarding</h2>
						<p className="text-gray-400 text-sm mt-0.5">Join our network and unlock opportunities for your organization.</p>
					</motion.div>

					{/* Step progress — circle indicators */}
					<div className="flex justify-between items-center mb-5 relative">
						{/* Connector line */}
						<div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 z-0" />
						<div
							className="absolute top-4 left-0 h-0.5 bg-[#0eb59a] z-0 transition-all duration-500"
							style={{ width: `${(currentStep / (JOIN_STEPS.length - 1)) * 100}%` }}
						/>
						{JOIN_STEPS.map((step, index) => (
							<div key={index} className="flex-1 flex flex-col items-center gap-1.5 relative z-10">
								<motion.div
									animate={{
										scale: index === currentStep ? 1.15 : 1,
										backgroundColor: index < currentStep ? '#0eb59a' : index === currentStep ? '#ffffff' : '#ffffff',
										borderColor: index <= currentStep ? '#0eb59a' : '#e5e7eb',
									}}
									transition={{ duration: 0.3 }}
									className="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm"
								>
									{index < currentStep ? (
										<CheckCircle2 size={18} className="text-white" />
									) : (
										<span className={`text-xs font-black ${index === currentStep ? 'text-[#0eb59a]' : 'text-gray-300'}`}>
											{index + 1}
										</span>
									)}
								</motion.div>
								<span className={`text-[10px] font-semibold text-center leading-tight ${index === currentStep ? 'text-[#0eb59a]' : index < currentStep ? 'text-gray-400' : 'text-gray-300'}`}>
									{step}
								</span>
							</div>
						))}
					</div>



					{/* Error banner */}
					<AnimatePresence>
						{showErrorBanner && (
							<motion.div
								initial={{ opacity: 0, y: -8, scale: 0.97 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -8, scale: 0.97 }}
								className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium"
							>
								<AlertCircle size={18} className="flex-shrink-0" />
								Please fill all required details correctly to proceed.
							</motion.div>
						)}
					</AnimatePresence>

					{/* Form card */}
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
						className="bg-white border border-gray-100 shadow-lg shadow-gray-100/80 rounded-2xl p-6 md:p-8"
					>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

							{/* STEP 1 */}
							{currentStep === 0 && (
								<>
									<div className="flex flex-col gap-1">
										<label className={labelClass}>Company Name *</label>
										<input className={inputClass} placeholder="e.g. Acme Corp"
											{...register("companyName", {
												required: "Company Name is required",
												validate: async (value) => (await checkUniqueField("companyName", value)) || "This company name already exists",
											})}
										/>
										{errors.companyName && <span className="text-red-500 text-xs mt-0.5">{errors.companyName.message}</span>}
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Upload Company Logo *</label>
										<input type="file" accept=".png, .jpg, .jpeg"
											className="w-full px-4 py-2.5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0eb59a] hover:bg-teal-50/30 transition-all duration-200 text-gray-600 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#134e40] file:text-white hover:file:bg-[#0eb59a]"
											{...register("logo", { required: "Logo is required" })}
										/>
										<span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 2MB</span>
										{errors.logo && <span className="text-red-500 text-xs">{errors.logo.message}</span>}
										{logoPreview && (
											<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-2 p-3 border border-gray-100 rounded-xl bg-gray-50 flex justify-center">
												<img src={logoPreview} alt="Logo Preview" className="h-16 object-contain" />
											</motion.div>
										)}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Industry *</label>
											<select className={inputClass} {...register("industry", { required: "Industry is required" })}>
												<option value="">Select Industry...</option>
												<option value="Information Technology (IT)">Information Technology (IT)</option>
												<option value="Software Development">Software Development</option>
												<option value="Finance & Banking">Finance & Banking</option>
												<option value="Healthcare">Healthcare</option>
												<option value="Education / EdTech">Education / EdTech</option>
												<option value="E-commerce">E-commerce</option>
												<option value="Manufacturing">Manufacturing</option>
												<option value="Marketing & Advertising">Marketing & Advertising</option>
												<option value="Consulting">Consulting</option>
												<option value="Media & Entertainment">Media & Entertainment</option>
												<option value="Real Estate">Real Estate</option>
												<option value="Other">Other</option>
											</select>
											{errors.industry && <span className="text-red-500 text-xs">{errors.industry.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Company Tagline *</label>
											<input className={inputClass} placeholder="e.g. Building the future of AI" maxLength={80}
												{...register("tagline", { required: "Tagline is required", maxLength: { value: 80, message: "Max 80 characters" } })}
											/>
											{errors.tagline && <span className="text-red-500 text-xs">{errors.tagline.message}</span>}
										</div>
									</div>
								</>
							)}

							{/* STEP 2 */}
							{currentStep === 1 && (
								<>
									<div className="flex flex-col gap-1">
										<label className={labelClass}>About the Company *</label>
										<textarea rows="3" className={`${inputClass} resize-none`} placeholder="Describe your company's mission and vision..."
											{...register("about", { required: "About section is required", minLength: { value: 50, message: "Minimum 50 characters required" } })}
										/>
										{errors.about && <span className="text-red-500 text-xs">{errors.about.message}</span>}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Organisation Type *</label>
											<select className={inputClass} {...register("orgType", { required: "Organisation Type is required" })}>
												<option value="">Select Type...</option>
												<option value="Startup">Startup</option>
												<option value="Private Company">Private Company</option>
												<option value="Public Company">Public Company</option>
												<option value="NGO / Non-Profit">NGO / Non-Profit</option>
												<option value="Government Organization">Government Organization</option>
											</select>
											{errors.orgType && <span className="text-red-500 text-xs">{errors.orgType.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Organization Size *</label>
											<select className={inputClass} {...register("orgSize", { required: "Organization Size is required" })}>
												<option value="">Select Size...</option>
												<option value="1-10">1–10 employees</option>
												<option value="11-50">11–50 employees</option>
												<option value="51-200">51–200 employees</option>
												<option value="201-500">201–500 employees</option>
												<option value="500+">500+ employees</option>
											</select>
											{errors.orgSize && <span className="text-red-500 text-xs">{errors.orgSize.message}</span>}
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Company Age *</label>
											<select className={inputClass} {...register("companyAge", { required: "Company Age is required" })}>
												<option value="">Select Age...</option>
												<option value="Just Started (0-1 year)">Just Started (0–1 year)</option>
												<option value="1-3 Years">1–3 Years</option>
												<option value="3-7 Years">3–7 Years</option>
												<option value="7+ Years">7+ Years</option>
											</select>
											{errors.companyAge && <span className="text-red-500 text-xs">{errors.companyAge.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Founded Year *</label>
											<input type="text" className={inputClass} placeholder="e.g. 2020"
												{...register("foundedYear", { 
													required: "Founded Year is required",
													pattern: { value: /^(19|20)\d{2}$/, message: "Enter a valid 4-digit year" }
												})}
											/>
											{errors.foundedYear && <span className="text-red-500 text-xs">{errors.foundedYear.message}</span>}
										</div>
									</div>
								</>
							)}

							{/* STEP 3 */}
							{currentStep === 2 && (
								<>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Website URL *</label>
											<input className={inputClass} placeholder="https://www.example.com"
												{...register("website", { required: "Website URL is required", pattern: { value: /^https:\/\/.+/, message: "URL must start with https://" } })}
											/>
											{errors.website && <span className="text-red-500 text-xs">{errors.website.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Contact Number *</label>
											<input className={inputClass} placeholder="+91 98765 43210"
												{...register("contactNumber", { required: "Contact Number is required", pattern: { value: /^\+?[1-9]\d{1,14}$/, message: "Enter a valid phone number" } })}
											/>
											{errors.contactNumber && <span className="text-red-500 text-xs">{errors.contactNumber.message}</span>}
										</div>
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Official Company Email *</label>
										<div className="flex gap-2 items-start">
											<div className="flex-1">
												<input className={inputClass} placeholder="hr@company.com"
													{...register("email", { required: "Company Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" } })}
												/>
												{errors.email && <span className="text-red-500 text-xs mt-0.5 block">{errors.email.message}</span>}
											</div>
											<button type="button"
												className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${otpVerified ? 'bg-green-100 text-green-700 cursor-default' : 'bg-[#134e40] text-white hover:bg-[#0eb59a] shadow-md hover:scale-105 active:scale-95'}`}
												onClick={handleSendOTP} disabled={otpVerified}
											>
												{otpVerified ? "✓ Done" : "Verify"}
											</button>
										</div>
										{otpVerified && <span className="text-green-600 text-xs font-semibold mt-0.5">✓ Email verified successfully</span>}
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>LinkedIn Page *</label>
										<input className={inputClass} placeholder="https://linkedin.com/company/yourcompany"
											{...register("linkedin", { required: "LinkedIn page is required", pattern: { value: /^https:\/\/linkedin\.com\/company\/.+/, message: "Must start with https://linkedin.com/company/" } })}
										/>
										{errors.linkedin && <span className="text-red-500 text-xs">{errors.linkedin.message}</span>}
									</div>

									<div className="border-t border-gray-100 pt-4">
										<label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Additional Links <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
										{additionalLinks.map((link, index) => (
											<motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-2">
												<select value={link.platform} onChange={(e) => updateAdditionalLink(index, 'platform', e.target.value)}
													className="w-36 border border-gray-200 rounded-xl px-2 py-2 text-xs bg-white focus:ring-2 focus:ring-[#0eb59a] focus:outline-none">
													<option value="Website">🌐 Website</option>
													<option value="X">𝕏 X</option>
													<option value="Instagram">📸 Instagram</option>
													<option value="Facebook">📘 Facebook</option>
													<option value="Other">🔗 Other</option>
												</select>
												<input type="url" placeholder="https://..." value={link.url} onChange={(e) => updateAdditionalLink(index, 'url', e.target.value)}
													className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#0eb59a] focus:outline-none" />
												<button type="button" onClick={() => removeAdditionalLink(index)} className="text-gray-300 hover:text-red-500 transition-colors text-base font-bold">✕</button>
											</motion.div>
										))}
										{additionalLinks.length < 3 ? (
											<button type="button" onClick={addAdditionalLink} className="mt-1 flex items-center gap-1.5 text-[#0eb59a] hover:text-[#134e40] text-xs font-bold transition-colors">
												<span className="text-base">+</span> Add Link
											</button>
										) : (
											<p className="mt-1 text-xs text-gray-300">Maximum 3 links reached</p>
										)}
									</div>
								</>
							)}

							{/* STEP 4 */}
							{currentStep === 3 && (
								<>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Account Admin Name *</label>
											<input className={inputClass} placeholder="Jane Doe"
												{...register("adminName", { required: "Admin Name is required" })}
											/>
											{errors.adminName && <span className="text-red-500 text-xs">{errors.adminName.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>CIN Number *</label>
											<input className={`${inputClass} uppercase`} placeholder="U12345MH2024PTC123456"
												{...register("cinNumber", {
													required: "CIN Number is required",
													pattern: { value: /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i, message: "Invalid CIN format" },
													onChange: (e) => setValue("cinNumber", e.target.value.toUpperCase(), { shouldValidate: true })
												})}
											/>
											{errors.cinNumber && <span className="text-red-500 text-xs">{errors.cinNumber.message}</span>}
										</div>
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Admin Email Address *</label>
										<div className="flex gap-2 items-start">
											<div className="flex-1">
												<input className={inputClass} placeholder="jane.doe@company.com"
													{...register("adminEmail", {
														required: "Admin Email is required",
														pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
														validate: async (value) => (await checkUniqueField("adminEmail", value)) || "Admin Email is already registered"
													})}
												/>
												{errors.adminEmail && <span className="text-red-500 text-xs mt-0.5 block">{errors.adminEmail.message}</span>}
											</div>
											<button type="button"
												className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${adminOtpVerified ? 'bg-green-100 text-green-700 cursor-default' : 'bg-[#134e40] text-white hover:bg-[#0eb59a] shadow-md hover:scale-105 active:scale-95'}`}
												onClick={handleSendAdminOTP} disabled={adminOtpVerified}
											>
												{adminOtpVerified ? "✓ Done" : "Verify"}
											</button>
										</div>
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>GSTIN / Business Reg Number *</label>
										<input className={inputClass} placeholder="29ABCDE1234F2Z5"
											{...register("gstin", {
												required: "GSTIN is required",
												onChange: (e) => setValue("gstin", e.target.value.toUpperCase(), { shouldValidate: true })
											})}
										/>
										{errors.gstin && <span className="text-red-500 text-xs">{errors.gstin.message}</span>}
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Certificate of Incorporation <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
										<input type="file" accept=".pdf, .jpg, .jpeg, .png"
											className="w-full px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0eb59a] hover:bg-teal-50/30 transition-all text-gray-500 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#134e40] file:text-white hover:file:bg-[#0eb59a]"
											{...register("gstCertificate")}
										/>
										<span className="text-xs text-[#0eb59a] font-medium mt-0.5">Uploading your COI helps verify your company faster.</span>
									</div>

									<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
										<input type="checkbox" id="terms"
											className="mt-0.5 w-4 h-4 accent-[#0eb59a] rounded border-gray-300"
											{...register("terms", { required: "You must accept the terms and conditions" })}
										/>
										<div>
											<label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
												I confirm the information provided is accurate and I agree to the ExigentCX Terms of Service and Privacy Policy.
											</label>
											{errors.terms && <span className="text-red-500 text-xs font-medium mt-1 block">{errors.terms.message}</span>}
										</div>
									</div>
								</>
							)}

							{/* Navigation */}
							<div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
								{currentStep > 0 ? (
									<motion.button
										type="button"
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
										className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 flex items-center gap-2 transition-all disabled:opacity-50"
										onClick={handleBack} disabled={loading}
									>
										<ChevronLeft size={16} /> Back
									</motion.button>
								) : <div />}

								{currentStep < JOIN_STEPS.length - 1 ? (
									<motion.button
										type="button"
										whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(19,78,64,0.25)' }}
										whileTap={{ scale: 0.97 }}
										className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#134e40] hover:bg-[#0eb59a] flex items-center gap-2 shadow-md transition-all"
										onClick={handleNext}
									>
										Next <ChevronRight size={16} />
									</motion.button>
								) : (
									<motion.button
										type="submit"
										whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(14,181,154,0.3)' }}
										whileTap={{ scale: 0.97 }}
										className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0eb59a] hover:bg-teal-400 flex items-center gap-2 shadow-lg transition-all disabled:opacity-60"
										disabled={loading}
									>
										{loading ? "Processing..." : "Submit Application"} {!loading && <ChevronRight size={16} />}
									</motion.button>
								)}
							</div>
						</form>
					</motion.div>
				</div>
			</div>

			<OTPModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} onVerify={handleVerifyOTP} />
			<OTPModal isOpen={showAdminOtpModal} onClose={() => setShowAdminOtpModal(false)} onVerify={handleVerifyAdminOTP} />
			<StatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} type={statusConfig.type} title={statusConfig.title} message={statusConfig.message} />
			<SuccessModal isOpen={showSuccessModal} role="company" />
		</div>
	);
};

export default JoinCompany;