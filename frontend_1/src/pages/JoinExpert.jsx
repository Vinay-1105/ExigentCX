import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, User, Briefcase, Star, DollarSign, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import OTPModal from "../components/OTPModal";
import StatusModal from "../components/StatusModal";
import SuccessModal from "../components/SuccessModal";
import Logo from "../components/Logo";

const JOIN_STEPS = ["Basic Info", "Experience", "Skills", "Pricing", "Account Setup"];
const STEP_ICONS = [User, Briefcase, Star, DollarSign, ShieldCheck];

const JoinExpert = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [profilePreview, setProfilePreview] = useState(null);
	const [otpVerified, setOtpVerified] = useState(false);
	const [showOtpModal, setShowOtpModal] = useState(false);
	const [showErrorBanner, setShowErrorBanner] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [statusConfig, setStatusConfig] = useState({ type: "success", title: "", message: "" });

	const {
		register, handleSubmit, trigger, watch, setValue,
		formState: { errors },
	} = useForm({ mode: "onChange" });

	const watchProfilePic = watch("profilePicture");

	useEffect(() => {
		if (watchProfilePic && watchProfilePic.length > 0) {
			const file = watchProfilePic[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => setProfilePreview(reader.result);
				reader.readAsDataURL(file);
			}
		} else {
			setProfilePreview(null);
		}
	}, [watchProfilePic]);

	const checkUniqueField = async (field, value) => {
		if (!value) return true;
		try {
			const { data, error } = await supabase.from("expert_applications").select(field).eq(field, value).limit(1).maybeSingle();
			if (error) { console.error("Error checking unique field:", error); return true; }
			return data === null;
		} catch (error) {
			console.error("Error checking unique field:", error);
			return true;
		}
	};

	const handleNext = async () => {
		let fieldsToValidate = [];
		if (currentStep === 0) fieldsToValidate = ["fullName", "profilePicture", "headline", "primaryDomain", "resume"];
		else if (currentStep === 1) fieldsToValidate = ["currentRole", "currentCompany", "yearsOfExperience"];
		else if (currentStep === 2) fieldsToValidate = ["keySkills", "servicesOffered"];
		else if (currentStep === 3) fieldsToValidate = ["hourlyRate"];

		const isStepValid = await trigger(fieldsToValidate);
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

	const onSubmit = async (data) => {
		const isFinalValid = await trigger(["email", "phone", "govId", "terms"]);
		if (!otpVerified) {
			setStatusConfig({ type: "warning", title: "Verification Required", message: "Please verify your email address before submitting the application." });
			setShowStatusModal(true);
			return;
		}
		if (!isFinalValid) { setShowErrorBanner(true); return; }
		setLoading(true);
		try {
			let profile_url = "", resume_url = "", gov_id_url = "";
			if (data.profilePicture && data.profilePicture[0]) {
				const file = data.profilePicture[0];
				const fileName = `${Date.now()}-${file.name}`;
				const { data: fileData } = await supabase.storage.from("expert-profiles").upload(fileName, file).catch(() => ({ data: { publicUrl: 'mockUrl' } }));
				if (fileData) profile_url = supabase.storage.from("expert-profiles").getPublicUrl(fileName)?.data?.publicUrl || "mock_profile_url";
			}
			if (data.resume && data.resume[0]) {
				const file = data.resume[0];
				const fileName = `${Date.now()}-${file.name}`;
				const { data: fileData } = await supabase.storage.from("expert-resumes").upload(fileName, file).catch(() => ({ data: { publicUrl: 'mockUrl' } }));
				if (fileData) resume_url = supabase.storage.from("expert-resumes").getPublicUrl(fileName)?.data?.publicUrl || "mock_resume_url";
			}
			if (data.govId && data.govId[0]) {
				const file = data.govId[0];
				const fileName = `${Date.now()}-${file.name}`;
				const { data: fileData } = await supabase.storage.from("expert-verification").upload(fileName, file).catch(() => ({ data: { publicUrl: 'mockUrl' } }));
				if (fileData) gov_id_url = supabase.storage.from("expert-verification").getPublicUrl(fileName)?.data?.publicUrl || "mock_govid_url";
			}
			let dbError = null;
			try {
				const response = await supabase.from("expert_applications").insert([{
					full_name: data.fullName, headline: data.headline, primary_domain: data.primaryDomain,
					years_experience: data.yearsOfExperience, current_role: data.currentRole,
					current_company: data.currentCompany, key_skills: data.keySkills,
					services_offered: data.servicesOffered, hourly_rate: data.hourlyRate,
					email: data.email, phone: data.phone, profile_url, resume_url, gov_id_url,
					github: data.github, work_samples: data.workSamples
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

	const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0eb59a] focus:border-[#0eb59a] focus:bg-white transition-all duration-200 text-gray-800 text-sm";
	const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block";

	const stepSubtitles = [
		"Capture your professional identity",
		"Your current role and experience",
		"Skills and services you offer",
		"Set your rate expectations",
		"Finalize your account access",
	];

	return (
		<div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">

			{/* ── LEFT PANEL ── */}
			<div className="hidden lg:flex flex-col w-[38%] bg-[#0d1a18] relative overflow-hidden sticky top-0 h-screen">
				<div className="absolute inset-0 bg-gradient-to-br from-[#0d1a18] via-[#0f2320] to-[#0d1a18]" />
				<div className="absolute top-0 left-0 w-80 h-80 bg-[#0eb59a]/8 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-0 w-64 h-64 bg-[#134e40]/20 rounded-full blur-3xl" />
				<div className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
						backgroundSize: '40px 40px'
					}}
				/>

				<div className="relative z-10 flex flex-col h-full p-10">
					<Link to="/" className="flex items-center gap-3 shrink-0 group">
						<Logo variant="dark" className="h-14" />
						<span className="text-white font-black text-2xl tracking-[0.1em] font-serif whitespace-nowrap">
							ExigentCX
						</span>
					</Link>

					<div className="flex-1 flex flex-col justify-center mt-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="flex flex-col items-center text-center w-full"
						>
							<p className="text-[#0eb59a] font-bold uppercase tracking-[0.2em] text-xs mb-4 w-full text-center">Sign Up</p>
							<h1 className="text-4xl font-extrabold text-white leading-tight mb-4 w-full text-center"
								style={{ fontFamily: 'Georgia, serif' }}>
								Where{' '}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0eb59a] to-emerald-300">
									Expertise
								</span>
								<br />Meets <br /> Opportunity.
							</h1>
							<p className="text-white/40 text-sm font-light leading-relaxed text-center w-full max-w-[220px]">
								Join an exclusive network of verified CXOs and senior advisors delivering high-impact leadership.
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

			{/* ── RIGHT PANEL ── */}
			<div className="relative flex-1 flex items-start justify-center py-8 px-4 md:px-8 overflow-y-auto">
				<div className="absolute inset-0 pointer-events-none md:hidden bg-gradient-to-br from-teal-400/10 to-transparent" />

				<div className="relative z-10 w-full max-w-2xl">

					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-5"
					>
						<h2 className="text-xl font-black text-gray-900 tracking-tight">Expert Onboarding</h2>
						<p className="text-gray-400 text-sm mt-0.5">Join our premium network of verified professionals and unlock fractional, full-time, and advisory opportunities.</p>
					</motion.div>

					{/* Circle step indicators */}
					<div className="flex justify-between items-center mb-5 relative">
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
										backgroundColor: index < currentStep ? '#0eb59a' : '#ffffff',
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
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Full Name *</label>
											<input className={inputClass} placeholder="John Doe"
												{...register("fullName", { required: "Full Name is required" })}
											/>
											{errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Primary Domain *</label>
											<select className={inputClass} {...register("primaryDomain", { required: "Primary Domain is required" })}>
												<option value="">Select Domain...</option>
												<option value="Software Engineering">Software Engineering</option>
												<option value="Product Management">Product Management</option>
												<option value="Data Science & AI">Data Science & AI</option>
												<option value="Design & UX">Design & UX</option>
												<option value="Marketing & Growth">Marketing & Growth</option>
												<option value="Sales & Business Dev">Sales & Business Dev</option>
												<option value="Finance & Operations">Finance & Operations</option>
												<option value="Other">Other</option>
											</select>
											{errors.primaryDomain && <span className="text-red-500 text-xs">{errors.primaryDomain.message}</span>}
										</div>
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Professional Headline *</label>
										<input className={inputClass} placeholder="e.g. Fractional CFO | Finance Strategy | M&A" maxLength={100}
											{...register("headline", { required: "Headline is required", maxLength: { value: 100, message: "Maximum 100 characters allowed" } })}
										/>
										{errors.headline && <span className="text-red-500 text-xs">{errors.headline.message}</span>}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Profile Picture *</label>
											<input type="file" accept=".png, .jpg, .jpeg"
												className="w-full px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0eb59a] hover:bg-teal-50/30 transition-all text-gray-600 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#134e40] file:text-white hover:file:bg-[#0eb59a]"
												{...register("profilePicture", { required: "Profile Picture is required" })}
											/>
											<span className="text-xs text-gray-400">PNG, JPG up to 2MB</span>
											{errors.profilePicture && <span className="text-red-500 text-xs">{errors.profilePicture.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Resume (PDF) *</label>
											<input type="file" accept=".pdf"
												className="w-full px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0eb59a] hover:bg-teal-50/30 transition-all text-gray-600 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#134e40] file:text-white hover:file:bg-[#0eb59a]"
												{...register("resume", { required: "Resume upload is required" })}
											/>
											{errors.resume && <span className="text-red-500 text-xs">{errors.resume.message}</span>}
										</div>
									</div>

									{profilePreview && (
										<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
											className="p-3 border border-gray-100 rounded-xl bg-gray-50 flex justify-center">
											<img src={profilePreview} alt="Profile Preview" className="h-14 w-14 rounded-full object-cover shadow-sm border-2 border-white" />
										</motion.div>
									)}

									<div className="flex flex-col gap-1">
										<label className={labelClass}>GitHub / Behance / Dribbble <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
										<input className={inputClass} placeholder="https://github.com/yourusername"
											{...register("github", {
												pattern: { value: /^https:\/\/(www\.)?(github\.com|behance\.net|dribbble\.com)\/.+/, message: "Must be a valid GitHub, Behance, or Dribbble URL" }
											})}
										/>
										{errors.github && <span className="text-red-500 text-xs">{errors.github.message}</span>}
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Work Samples <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
										<textarea rows="2" className={`${inputClass} resize-none`} placeholder="Share links or brief project descriptions..."
											{...register("workSamples")}
										/>
									</div>
								</>
							)}

							{/* STEP 2 */}
							{currentStep === 1 && (
								<>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="flex flex-col gap-1">
											<label className={labelClass}>Current Role / Title *</label>
											<input className={inputClass} placeholder="e.g. Fractional CFO"
												{...register("currentRole", { required: "Current Role is required" })}
											/>
											{errors.currentRole && <span className="text-red-500 text-xs">{errors.currentRole.message}</span>}
										</div>

										<div className="flex flex-col gap-1">
											<label className={labelClass}>Current Company <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
											<input className={inputClass} placeholder="Acme Corp"
												{...register("currentCompany")}
											/>
										</div>
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Years of Experience *</label>
										<select className={inputClass} {...register("yearsOfExperience", { required: "Years of Experience is required" })}>
											<option value="">Select Experience...</option>
											<option value="10-13">10-13 years</option>
											<option value="14-17">14-17 years</option>
											<option value="18-20">18-20 years</option>
											<option value="20+">20+ years</option>
										</select>
										{errors.yearsOfExperience && <span className="text-red-500 text-xs">{errors.yearsOfExperience.message}</span>}
									</div>
								</>
							)}

							{/* STEP 3 */}
							{currentStep === 2 && (
								<>
									<div className="flex flex-col gap-1">
										<label className={labelClass}>Key Skills * <span className="text-gray-300 font-normal normal-case">(comma separated)</span></label>
										<input className={inputClass} placeholder="e.g. Financial Modeling, M&A, Fundraising, P&L Management"
											{...register("keySkills", { required: "Key Skills are required" })}
										/>
										{errors.keySkills && <span className="text-red-500 text-xs">{errors.keySkills.message}</span>}
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Services Offered *</label>
										<textarea rows="4" className={`${inputClass} resize-none`}
											placeholder="Describe the services you offer (e.g. Fractional CFO, Board Advisory, Fundraising Strategy, Financial Due Diligence...)"
											{...register("servicesOffered", { required: "Services Offered is required" })}
										/>
										{errors.servicesOffered && <span className="text-red-500 text-xs">{errors.servicesOffered.message}</span>}
									</div>
								</>
							)}

							{/* STEP 4 */}
							{currentStep === 3 && (
								<>
									<div className="flex flex-col gap-1">
										<label className={labelClass}>Expected Monthly Rate (₹) *</label>
										<input type="number" className={inputClass} placeholder="e.g. 200000" min="0"
											{...register("hourlyRate", { required: "Rate is required" })}
										/>
										{errors.hourlyRate && <span className="text-red-500 text-xs">{errors.hourlyRate.message}</span>}
										<span className="text-xs text-gray-400 mt-0.5">Enter your expected monthly engagement rate in INR</span>
									</div>
								</>
							)}

							{/* STEP 5 */}
							{currentStep === 4 && (
								<>
									<div className="flex flex-col gap-1">
										<label className={labelClass}>Email Address *</label>
										<div className="flex gap-2 items-start">
											<div className="flex-1">
												<input className={inputClass} placeholder="you@example.com"
													{...register("email", {
														required: "Email is required",
														pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
														validate: async (value) => (await checkUniqueField("email", value)) || "This email is already in use",
													})}
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
										<label className={labelClass}>Phone Number *</label>
										<input className={inputClass} placeholder="+91 98765 43210"
											{...register("phone", {
												required: "Phone number is required",
												pattern: { value: /^\+?[1-9]\d{1,14}$/, message: "Please enter a valid phone number" }
											})}
										/>
										{errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
									</div>

									<div className="flex flex-col gap-1">
										<label className={labelClass}>Government ID <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
										<input type="file" accept=".pdf, .jpg, .jpeg, .png"
											className="w-full px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0eb59a] hover:bg-teal-50/30 transition-all text-gray-500 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#134e40] file:text-white hover:file:bg-[#0eb59a]"
											{...register("govId")}
										/>
										<span className="text-xs text-[#0eb59a] font-medium mt-0.5">Uploading a valid ID increases your profile trust rating.</span>
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
									<motion.button type="button"
										whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
										className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 flex items-center gap-2 transition-all disabled:opacity-50"
										onClick={handleBack} disabled={loading}
									>
										<ChevronLeft size={16} /> Back
									</motion.button>
								) : <div />}

								{currentStep < JOIN_STEPS.length - 1 ? (
									<motion.button type="button"
										whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(19,78,64,0.25)' }}
										whileTap={{ scale: 0.97 }}
										className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#134e40] hover:bg-[#0eb59a] flex items-center gap-2 shadow-md transition-all"
										onClick={handleNext}
									>
										Next <ChevronRight size={16} />
									</motion.button>
								) : (
									<motion.button type="submit"
										whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(14,181,154,0.3)' }}
										whileTap={{ scale: 0.97 }}
										className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0eb59a] hover:bg-teal-400 flex items-center gap-2 shadow-lg transition-all disabled:opacity-60"
										disabled={loading}
									>
										{loading ? "Processing..." : "Finish Registration"} {!loading && <ChevronRight size={16} />}
									</motion.button>
								)}
							</div>
						</form>
					</motion.div>
				</div>
			</div>

			<OTPModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} onVerify={handleVerifyOTP} />
			<StatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} type={statusConfig.type} title={statusConfig.title} message={statusConfig.message} />
			<SuccessModal isOpen={showSuccessModal} role="expert" />
		</div>
	);
};

export default JoinExpert;