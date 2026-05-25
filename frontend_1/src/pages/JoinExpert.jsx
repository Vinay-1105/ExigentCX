import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import OTPModal from "../components/OTPModal";
import StatusModal from "../components/StatusModal";
import SuccessModal from "../components/SuccessModal";

const JOIN_STEPS = ["Basic Info", "Experience", "Skills", "Pricing", "Account Setup"];

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
		register,
		handleSubmit,
		trigger,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "onChange",
	});

	const watchProfilePic = watch("profilePicture");

	useEffect(() => {
		if (watchProfilePic && watchProfilePic.length > 0) {
			const file = watchProfilePic[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setProfilePreview(reader.result);
				};
				reader.readAsDataURL(file);
			}
		} else {
			setProfilePreview(null);
		}
	}, [watchProfilePic]);

	const checkUniqueField = async (field, value) => {
		if (!value) return true;
		try {
			const { data, error } = await supabase
				.from("expert_applications")
				.select(field)
				.eq(field, value)
				.limit(1)
				.maybeSingle();
			if (error) {
				console.error("Error checking unique field:", error);
				return true;
			}
			return data === null;
		} catch (error) {
			console.error("Error checking unique field:", error);
			return true;
		}
	};

	const handleNext = async () => {
		let fieldsToValidate = [];
		if (currentStep === 0) {
			fieldsToValidate = ["fullName", "profilePicture", "headline", "primaryDomain", "resume"];
		} else if (currentStep === 1) {
			fieldsToValidate = ["currentRole", "currentCompany", "yearsOfExperience"];
		} else if (currentStep === 2) {
			fieldsToValidate = ["keySkills", "servicesOffered"];
		} else if (currentStep === 3) {
			fieldsToValidate = ["hourlyRate"];
		}

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
				const { error } = await supabase.auth.signInWithOtp({
					email: emailValue,
				});
				if (error) throw error;
				setShowOtpModal(true);
			} catch (error) {
				setStatusConfig({
					type: "error",
					title: "OTP Error",
					message: error.message
				});
				setShowStatusModal(true);
			}
		} else {
			trigger("email");
		}
	};

	const handleVerifyOTP = async (otp) => {
		const emailValue = watch("email")?.trim();
		try {
			const { error } = await supabase.auth.verifyOtp({
				email: emailValue,
				token: otp,
				type: "email",
			});
			if (error) throw error;

			setOtpVerified(true);
			setShowOtpModal(false);
			setStatusConfig({
				type: "success",
				title: "Email Verified!",
				message: "Your email has been successfully verified.\nYou're all set to continue."
			});
			setShowStatusModal(true);
		} catch (error) {
			setStatusConfig({
				type: "error",
				title: "Invalid OTP",
				message: error.message
			});
			setShowStatusModal(true);
		}
	};

	const onSubmit = async (data) => {
		const isFinalValid = await trigger(["email", "phone", "govId", "terms"]);

		if (!otpVerified) {
			setStatusConfig({
				type: "warning",
				title: "Verification Required",
				message: "Please verify your email address before submitting the application."
			});
			setShowStatusModal(true);
			return;
		}

		if (!isFinalValid) {
			setShowErrorBanner(true);
			return;
		}

		setLoading(true);
		try {
			let profile_url = "";
			let resume_url = "";
			let gov_id_url = "";

			if (data.profilePicture && data.profilePicture[0]) {
				const file = data.profilePicture[0];
				const fileName = `${Date.now()}-${file.name}`;
				const { data: fileData } = await supabase.storage
					.from("expert-profiles")
					.upload(fileName, file).catch(() => ({ data: { publicUrl: 'mockUrl' } }));

				if (fileData) {
					profile_url = supabase.storage.from("expert-profiles").getPublicUrl(fileName)?.data?.publicUrl || "mock_profile_url";
				}
			}

			if (data.resume && data.resume[0]) {
				const file = data.resume[0];
				const fileName = `${Date.now()}-${file.name}`;
				const { data: fileData } = await supabase.storage
					.from("expert-resumes")
					.upload(fileName, file).catch(() => ({ data: { publicUrl: 'mockUrl' } }));

				if (fileData) {
					resume_url = supabase.storage.from("expert-resumes").getPublicUrl(fileName)?.data?.publicUrl || "mock_resume_url";
				}
			}

			if (data.govId && data.govId[0]) {
				const file = data.govId[0];
				const fileName = `${Date.now()}-${file.name}`;
				const { data: fileData } = await supabase.storage
					.from("expert-verification")
					.upload(fileName, file).catch(() => ({ data: { publicUrl: 'mockUrl' } }));

				if (fileData) {
					gov_id_url = supabase.storage.from("expert-verification").getPublicUrl(fileName)?.data?.publicUrl || "mock_govid_url";
				}
			}

			// Mock DB save
			let dbError = null;
			try {
				const response = await supabase
					.from("expert_applications")
					.insert([
						{
							full_name: data.fullName,
							headline: data.headline,
							primary_domain: data.primaryDomain,
							years_experience: data.yearsOfExperience,
							current_role: data.currentRole,
							current_company: data.currentCompany,
							key_skills: data.keySkills,
							services_offered: data.servicesOffered,
							hourly_rate: data.hourlyRate,
							email: data.email,
							phone: data.phone,
							profile_url: profile_url,
							resume_url: resume_url,
							gov_id_url: gov_id_url,
							github: data.github,
							work_samples: data.workSamples
						},
					]);
				dbError = response.error;
			} catch (e) {
				dbError = null;
			}

			if (dbError) throw dbError;

			setShowSuccessModal(true);
		} catch (error) {
			console.error(error);
			setStatusConfig({
				type: "error",
				title: "Submission Failed",
				message: error.message
			});
			setShowStatusModal(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
			{/* Left Side: Branding Panel */}
			<div className="hidden lg:flex flex-col w-[35%] bg-[#0d1a18] p-12 justify-center items-center text-center z-20">
				<Link to="/" className="mb-auto flex items-center shrink-0">
					<img
						src="/assets/images/LOGO_WHITE.png"
						alt="CXO Connect"
						className="h-10 md:h-12 w-auto object-contain"
					/>
				</Link>
				<div className="mb-auto mt-20 flex flex-col items-center">
					<p className="text-[#0eb59a] font-bold uppercase tracking-wider text-sm mb-4">Sign up</p>
					<h1 className="text-5xl font-extrabold text-white leading-tight">Welcome to <br />our Expert<br />Site</h1>
				</div>
			</div>

			{/* Right Side: Form Area */}
			<div className="relative flex-1 flex items-center justify-center p-5 md:p-8 overflow-hidden z-10">
				{/* Mobile Fallback Background */}
				<div className="absolute inset-0 z-0 pointer-events-none md:hidden bg-gradient-to-br from-teal-400/10 to-transparent"></div>

				{/* Form Card */}
				<div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 hover:shadow-teal-500/10 transition-all duration-500 animate-in fade-in zoom-in-95 duration-700">
					<div className="mb-6">
						<h2 className="text-2xl font-bold mb-2">Expert Onboarding</h2>
						<p className="text-gray-600">Join our premium network of verified professionals and unlock fractional, full-time, and advisory opportunities.</p>
					</div>

					<div className="flex justify-between items-center mb-8 relative">
						{JOIN_STEPS.map((step, index) => (
							<div key={index} className="flex-1 text-center relative">
								<div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${currentStep === index ? 'border-teal-500 bg-teal-50 text-teal-600 font-bold' : currentStep > index ? 'border-teal-400 bg-teal-400 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>{currentStep > index ? <CheckCircle2 size={20} /> : index + 1}</div>
								<span className={`block mt-2 text-xs ${currentStep >= index ? 'text-teal-500 font-semibold' : 'text-gray-400 font-normal'}`}>{step}</span>
							</div>
						))}
					</div>

					{showErrorBanner && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-3 font-medium shadow-sm">
							<AlertCircle size={20} className="flex-shrink-0" />
							Please fill all required details correctly to proceed.
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* STEP 1: Basic Information */}
						{currentStep === 0 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 1: Basic Information</h3>
									<p className="text-gray-500 text-sm mt-1">Let's start by capturing your professional identity.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Full Name *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="John Doe"
										{...register("fullName", { required: "Full Name is required" })}
									/>
									{errors.fullName && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.fullName.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Upload Profile Picture *</label>
									<input
										type="file"
										className="w-full px-4 py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-teal-400 transition-all duration-200 text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:transition-colors file:duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:scale-[1.01]"
										accept=".png, .jpg, .jpeg"
										{...register("profilePicture", { required: "Profile Picture is required" })}
									/>
									<span className="text-xs text-gray-500 mt-1">Professional headshot recommended (PNG, JPG up to 2MB)</span>
									{errors.profilePicture && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.profilePicture.message}</span>}

									{profilePreview && (
										<div className="mt-4 p-4 border rounded-lg bg-gray-50 flex justify-center">
											<img src={profilePreview} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover shadow-sm border-2 border-white" />
										</div>
									)}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Professional Headline *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="e.g. Full Stack Developer | React | Node.js"
										maxLength={100}
										{...register("headline", {
											required: "Headline is required",
											maxLength: { value: 100, message: "Maximum 100 characters allowed" }
										})}
									/>
									{errors.headline && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.headline.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Primary Domain / Expertise *</label>
									<select
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										{...register("primaryDomain", { required: "Primary Domain is required" })}
									>
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
									{errors.primaryDomain && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.primaryDomain.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">GitHub / Behance / Dribbble URL (Optional)</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="https://github.com/yourusername"
										{...register("github", {
											pattern: {
												value: /^https:\/\/(www\.)?(github\.com|behance\.net|dribbble\.com)\/.+/,
												message: "Must be a valid GitHub, Behance, or Dribbble URL starting with https://"
											}
										})}
									/>
									{errors.github && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.github.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Resume Upload (PDF) *</label>
									<input
										type="file"
										className="w-full px-4 py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-teal-400 transition-all duration-200 text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:transition-colors file:duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:scale-[1.01]"
										accept=".pdf"
										{...register("resume", { required: "Resume upload is required" })}
									/>
									{errors.resume && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.resume.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Work Samples / Projects (Optional)</label>
									<textarea
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800 resize-y"
										rows="3"
										placeholder="Share links or brief descriptions of notable projects..."
										{...register("workSamples")}
									></textarea>
								</div>
							</div>
						)}

						{/* STEP 2: Professional Experience */}
						{currentStep === 1 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 2: Professional Experience</h3>
									<p className="text-gray-500 text-sm mt-1">Detail your current role and overall experience.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Current Role / Title *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="Senior Developer"
										{...register("currentRole", { required: "Current Role is required" })}
									/>
									{errors.currentRole && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.currentRole.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Current Company (Optional)</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="Acme Corp"
										{...register("currentCompany")}
									/>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Years of Experience *</label>
									<select
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										{...register("yearsOfExperience", { required: "Years of Experience is required" })}
									>
										<option value="">Select Experience...</option>
										<option value="0-2">0-2 years</option>
										<option value="3-5">3-5 years</option>
										<option value="6-10">6-10 years</option>
										<option value="11-15">11-15 years</option>
										<option value="15+">15+ years</option>
									</select>
									{errors.yearsOfExperience && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.yearsOfExperience.message}</span>}
								</div>
							</div>
						)}

						{/* STEP 3: Skills & Services */}
						{currentStep === 2 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 3: Skills & Services</h3>
									<p className="text-gray-500 text-sm mt-1">Highlight what you bring to the table.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Key Skills (Comma separated) *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="React, Node.js, Python, AWS"
										{...register("keySkills", { required: "Key Skills are required" })}
									/>
									{errors.keySkills && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.keySkills.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Services Offered *</label>
									<textarea
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800 resize-y"
										rows="4"
										placeholder="Describe the services you offer (e.g. Technical consulting, MVP development, code review...)"
										{...register("servicesOffered", { required: "Services Offered is required" })}
									></textarea>
									{errors.servicesOffered && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.servicesOffered.message}</span>}
								</div>
							</div>
						)}

						{/* STEP 4: Pricing */}
						{currentStep === 3 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 4: Pricing</h3>
									<p className="text-gray-500 text-sm mt-1">Set your expectations.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Expected Hourly Rate (USD) *</label>
									<input
										type="number"
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="100"
										min="0"
										{...register("hourlyRate", { required: "Hourly Rate is required" })}
									/>
									{errors.hourlyRate && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.hourlyRate.message}</span>}
								</div>
							</div>
						)}

						{/* STEP 5: Verification & Account Setup */}
						{currentStep === 4 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 5: Account Setup</h3>
									<p className="text-gray-500 text-sm mt-1">Finalize your account access and verification details.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Email Address *</label>
									<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
										<div className="flex-1 w-full">
											<input
												className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
												placeholder="you@example.com"
												{...register("email", {
													required: "Email is required",
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: "Invalid email address"
													},
													validate: async (value) => (await checkUniqueField("email", value)) || "This email is already in use",
												})}
											/>
											{errors.email && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.email.message}</span>}
										</div>
										<button
											type="button"
											className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all duration-150 ${otpVerified ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-800 text-white hover:bg-gray-700 shadow-md hover:scale-105 hover:shadow-lg active:scale-95'}`}
											onClick={handleSendOTP}
											disabled={otpVerified}
										>
											{otpVerified ? "✓ Verified" : "Verify OTP"}
										</button>
									</div>
									{otpVerified && <span className="text-green-600 text-sm font-medium mt-1">Email verified successfully!</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Phone Number *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="+1 234 567 8900"
										{...register("phone", {
											required: "Phone number is required",
											pattern: {
												value: /^\+?[1-9]\d{1,14}$/,
												message: "Please enter a valid phone number"
											}
										})}
									/>
									{errors.phone && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.phone.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Government ID Upload (Optional)</label>
									<input
										type="file"
										className="w-full px-4 py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-teal-400 transition-all duration-200 text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:transition-colors file:duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:scale-[1.01]"
										accept=".pdf, .jpg, .jpeg, .png"
										{...register("govId")}
									/>
									<span className="text-xs text-green-600 font-medium mt-1">
										Note: Uploading a valid ID helps verify your profile and increases trust rating.
									</span>
								</div>

								<div className="flex items-start gap-3 mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<input
										type="checkbox"
										id="terms"
										className="mt-1 w-5 h-5 accent-[var(--primary-accent)] rounded border-gray-300"
										{...register("terms", { required: "You must accept the terms and conditions" })}
									/>
									<div className="flex flex-col">
										<label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">I confirm the information provided is accurate and I agree to the CXOConnect Terms of Service and Privacy Policy.</label>
										{errors.terms && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.terms.message}</span>}
									</div>
								</div>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
							{currentStep > 0 ? (
								<button type="button" className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 flex items-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none" onClick={handleBack} disabled={loading}>
									<ChevronLeft size={18} /> Back
								</button>
							) : <div></div>}

							{currentStep < JOIN_STEPS.length - 1 ? (
								<button type="button" className="px-8 py-2.5 rounded-lg font-bold text-white bg-gray-800 hover:bg-gray-900 flex items-center gap-2 shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-150" onClick={handleNext}>
									Next Step <ChevronRight size={18} />
								</button>
							) : (
								<button type="submit" className="px-8 py-2.5 rounded-lg font-bold text-white bg-teal-500 hover:bg-teal-600 flex items-center gap-2 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-150" disabled={loading}>
									{loading ? "PROCESSING..." : "FINISH REGISTRATION"}
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
			<OTPModal
				isOpen={showOtpModal}
				onClose={() => setShowOtpModal(false)}
				onVerify={handleVerifyOTP}
			/>
			<StatusModal
				isOpen={showStatusModal}
				onClose={() => setShowStatusModal(false)}
				type={statusConfig.type}
				title={statusConfig.title}
				message={statusConfig.message}
			/>
			<SuccessModal 
				isOpen={showSuccessModal} 
				role="expert" 
			/>
		</div>
	);
};

export default JoinExpert;
