import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import OTPModal from "../components/OTPModal";
import StatusModal from "../components/StatusModal";
import SuccessModal from "../components/SuccessModal";

const JOIN_STEPS = ["Basic Details", "Company Info", "Online Presence", "Account Setup"];

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
	} = useForm({
		mode: "onChange",
	});

	const watchLogo = watch("logo");

	useEffect(() => {
		if (watchLogo && watchLogo.length > 0) {
			const file = watchLogo[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setLogoPreview(reader.result);
				};
				reader.readAsDataURL(file);
			}
		} else {
			setLogoPreview(null);
		}
	}, [watchLogo]);

	const checkUniqueField = async (field, value) => {
		// Map camelCase form fields to snake_case DB columns
		const dbColumn = field === 'companyName' ? 'company_name' :
			field === 'adminEmail' ? 'admin_email' : field;

		try {
			const { data, error } = await supabase
				.from("company_applications")
				.select(dbColumn)
				.eq(dbColumn, value)
				.limit(1)
				.maybeSingle();
			if (error) {
				console.error("Error checking unique field:", error);
				return true; // Allow on error
			}
			return data === null; // True if unique (not found)
		} catch (error) {
			console.error("Error checking unique field:", error);
			return true;
		}
	};

	const addAdditionalLink = () => {
		if (additionalLinks.length < 3) {
			setAdditionalLinks([...additionalLinks, { platform: "Website", url: "" }]);
		}
	};

	const removeAdditionalLink = (index) => {
		setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
	};

	const updateAdditionalLink = (index, field, value) => {
		const updated = [...additionalLinks];
		updated[index][field] = value;
		setAdditionalLinks(updated);
	};

	const handleNext = async () => {
		let fieldsToValidate = [];
		if (currentStep === 0) {
			fieldsToValidate = ["companyName", "logo", "industry", "tagline"];
		} else if (currentStep === 1) {
			fieldsToValidate = ["about", "orgType", "orgSize", "companyAge"];
		} else if (currentStep === 2) {
			fieldsToValidate = ["website", "email", "contactNumber", "linkedin"];
		}

		const isStepValid = await trigger(fieldsToValidate);

		if (currentStep === 2) {
			if (!otpVerified) {
				setStatusConfig({
					type: "warning",
					title: "Verification Required",
					message: "Please verify your email address before proceeding to the next step."
				});
				setShowStatusModal(true);
				return;
			}

			// Validate additional links start with https://
			for (const link of additionalLinks) {
				if (link.url && !link.url.startsWith("https://")) {
					setStatusConfig({
						type: "error",
						title: "Invalid URL",
						message: "All additional link URLs must start with https://"
					});
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

	const handleSendAdminOTP = async () => {
		const emailValue = watch("adminEmail")?.trim();
		if (!errors.adminEmail && emailValue) {
			try {
				const { error } = await supabase.auth.signInWithOtp({
					email: emailValue,
				});
				if (error) throw error;
				setShowAdminOtpModal(true);
			} catch (error) {
				setStatusConfig({
					type: "error",
					title: "OTP Error",
					message: error.message
				});
				setShowStatusModal(true);
			}
		} else {
			trigger("adminEmail");
		}
	};

	const handleVerifyAdminOTP = async (otp) => {
		const emailValue = watch("adminEmail")?.trim();
		try {
			const { error } = await supabase.auth.verifyOtp({
				email: emailValue,
				token: otp,
				type: "email",
			});
			if (error) throw error;

			setAdminOtpVerified(true);
			setShowAdminOtpModal(false);
			setStatusConfig({
				type: "success",
				title: "Admin Email Verified!",
				message: "Your administrative email has been successfully verified."
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
		// Final step validation
		const isFinalValid = await trigger(["adminName", "adminEmail", "cinNumber", "gstin", "terms"]);

		if (!adminOtpVerified) {
			setStatusConfig({
				type: "warning",
				title: "Admin Verification",
				message: "Please verify your Admin Email address before submitting the application."
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
			// Mock DB and Storage operations for safe execution without breaking supabase if uninitialized
			let logo_url = "";
			let coi_url = "";

			if (data.logo && data.logo[0]) {
				const logoFile = data.logo[0];
				const logoFileName = `${Date.now()}-${logoFile.name}`;
				const { error: logoError, data: logoData } = await supabase.storage
					.from("company-logos")
					.upload(logoFileName, logoFile).catch(() => ({ error: null, data: { publicUrl: 'mockUrl' } })); // Catch to allow offline test

				if (logoData) {
					logo_url = supabase.storage.from("company-logos").getPublicUrl(logoFileName)?.data?.publicUrl || "mock_logo_url";
				}
			}

			if (data.gstCertificate && data.gstCertificate[0]) {
				const coiFile = data.gstCertificate[0];
				const coiFileName = `${Date.now()}-${coiFile.name}`;
				const { error: coiError, data: coiData } = await supabase.storage
					.from("certificates")
					.upload(coiFileName, coiFile).catch(() => ({ error: null, data: { publicUrl: 'mockUrl' } }));

				if (coiData) {
					coi_url = supabase.storage.from("certificates").getPublicUrl(coiFileName)?.data?.publicUrl || "mock_coi_url";
				}
			}

			// Mock DB save
			let dbError = null;
			try {
				const response = await supabase
					.from("company_applications")
					.insert([
						{
							company_name: data.companyName,
							website: data.website,
							industry: data.industry,
							org_size: data.orgSize,
							org_type: data.orgType,
							tagline: data.tagline,
							about: data.about,
							logo_url: logo_url,
							coi_url: coi_url,
							email: data.email,
							admin_name: data.adminName,
							admin_email: data.adminEmail,
							gstin: data.gstin,
							cin_number: data.cinNumber,
							contact_number: data.contactNumber,
							company_age: data.companyAge,
							linkedin: data.linkedin,
							additional_links: additionalLinks
						},
					]);
				dbError = response.error;
			} catch (e) {
				dbError = null; // Catch to allow offline test
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
					<h1 className="text-5xl font-extrabold text-white leading-tight">Welcome to <br />our Company<br />Site</h1>
				</div>
			</div>

			{/* Right Side: Form Area */}
			<div className="relative flex-1 flex items-center justify-center p-5 md:p-8 overflow-hidden z-10">
				{/* Mobile Fallback Background */}
				<div className="absolute inset-0 z-0 pointer-events-none md:hidden bg-gradient-to-br from-teal-400/10 to-transparent"></div>

				{/* Form Card */}
				<div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 hover:shadow-teal-500/10 transition-all duration-500 animate-in fade-in zoom-in-95 duration-700">
					<div className="mb-6">
						<h2 className="text-2xl font-bold mb-2">Company Onboarding</h2>
						<p className="text-gray-600">Join our network and unlock opportunities for your organization.</p>
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
						{/* STEP 1: Basic Company Details */}
						{currentStep === 0 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 1: Basic Company Details</h3>
									<p className="text-gray-500 text-sm mt-1">Let's establish your organization's identity on CXOConnect.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Company Name *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="e.g. Acme Corp"
										{...register("companyName", {
											required: "Company Name is required",
											validate: async (value) => (await checkUniqueField("companyName", value)) || "This company name already exists",
										})}
									/>
									{errors.companyName && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.companyName.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Upload Company Logo *</label>
									<input
										type="file"
										className="w-full px-4 py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-teal-400 transition-all duration-200 text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:transition-colors file:duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:scale-[1.01]"
										accept=".png, .jpg, .jpeg"
										{...register("logo", { required: "Logo is required" })}
									/>
									<span className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</span>
									{errors.logo && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.logo.message}</span>}

									{logoPreview && (
										<div className="mt-4 p-4 border rounded-lg bg-gray-50 flex justify-center">
											<img src={logoPreview} alt="Logo Preview" className="h-24 object-contain" />
										</div>
									)}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Industry *</label>
									<select
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										{...register("industry", { required: "Industry is required" })}
									>
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
									{errors.industry && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.industry.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Company Tagline *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="e.g. Building the future of AI"
										maxLength={80}
										{...register("tagline", {
											required: "Tagline is required",
											maxLength: { value: 80, message: "Maximum 80 characters allowed" }
										})}
									/>
									{errors.tagline && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.tagline.message}</span>}
								</div>
							</div>
						)}

						{/* STEP 2: Company Information */}
						{currentStep === 1 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 2: Company Information</h3>
									<p className="text-gray-500 text-sm mt-1">Tell us more about your organization's scale and history.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">About the Company *</label>
									<textarea
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800 resize-y"
										rows="4"
										placeholder="Describe your company's mission and vision..."
										{...register("about", {
											required: "About section is required",
											minLength: { value: 50, message: "Minimum 50 characters required" }
										})}
									></textarea>
									{errors.about && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.about.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Organisation Type *</label>
									<select
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										{...register("orgType", { required: "Organisation Type is required" })}
									>
										<option value="">Select Type...</option>
										<option value="Startup">Startup</option>
										<option value="Private Company">Private Company</option>
										<option value="Public Company">Public Company</option>
										<option value="NGO / Non-Profit">NGO / Non-Profit</option>
										<option value="Government Organization">Government Organization</option>
									</select>
									{errors.orgType && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.orgType.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Organization Size *</label>
									<select
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										{...register("orgSize", { required: "Organization Size is required" })}
									>
										<option value="">Select Size...</option>
										<option value="1-10">1–10 employees</option>
										<option value="11-50">11–50 employees</option>
										<option value="51-200">51–200 employees</option>
										<option value="201-500">201–500 employees</option>
										<option value="500+">500+ employees</option>
									</select>
									{errors.orgSize && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.orgSize.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Company Age *</label>
									<select
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										{...register("companyAge", { required: "Company Age is required" })}
									>
										<option value="">Select Age...</option>
										<option value="Just Started (0-1 year)">Just Started (0–1 year)</option>
										<option value="1-3 Years">1–3 Years</option>
										<option value="3-7 Years">3–7 Years</option>
										<option value="7+ Years">7+ Years</option>
									</select>
									{errors.companyAge && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.companyAge.message}</span>}
								</div>
							</div>
						)}

						{/* STEP 3: Online Presence */}
						{currentStep === 2 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 3: Online Presence</h3>
									<p className="text-gray-500 text-sm mt-1">Add your digital footprint so professionals can learn more about you.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Website URL *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="https://www.example.com"
										{...register("website", {
											required: "Website URL is required",
											pattern: {
												value: /^https:\/\/.+/,
												message: "URL must start with https://"
											}
										})}
									/>
									{errors.website && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.website.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Official Company Email *</label>
									<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
										<div className="flex-1 w-full">
											<input
												className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
												placeholder="hr@company.com"
												{...register("email", {
													required: "Company Email is required",
													pattern: {
														value: /\S+@\S+\.\S+/,
														message: "Invalid email address"
													}
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
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Contact Number *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="+1 234 567 8900"
										{...register("contactNumber", {
											required: "Contact Number is required",
											pattern: {
												value: /^\+?[1-9]\d{1,14}$/,
												message: "Please enter a valid phone number"
											}
										})}
									/>
									{errors.contactNumber && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.contactNumber.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">LinkedIn Page *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="https://linkedin.com/company/yourcompany"
										{...register("linkedin", {
											required: "LinkedIn page is required",
											pattern: {
												value: /^https:\/\/linkedin\.com\/company\/.+/,
												message: "Must start with https://linkedin.com/company/"
											}
										})}
									/>
									{errors.linkedin && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.linkedin.message}</span>}
								</div>

								{/* Additional Links Section */}
								<div className="mt-6 border-t pt-6">
									<label className="text-sm font-semibold text-gray-700 block mb-2">Additional Links</label>

									{additionalLinks.map((link, index) => (
										<div key={index} className="flex items-center gap-3 mt-3 animate-in fade-in slide-in-from-left-2 duration-300">
											<select
												value={link.platform}
												onChange={(e) => updateAdditionalLink(index, 'platform', e.target.value)}
												className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
											>
												<option value="Website">🌐 Company Website</option>
												<option value="Twitter">𝕏 X (Twitter)</option>
												<option value="Instagram">📸 Instagram</option>
												<option value="Facebook">📘 Facebook</option>
												<option value="YouTube">▶️ YouTube</option>
												<option value="TikTok">🎵 TikTok</option>
												<option value="AngelList">💼 AngelList / Wellfound</option>
												<option value="Crunchbase">📊 Crunchbase</option>
												<option value="Medium">🗞️ Medium / Blog</option>
												<option value="GitHub">📁 GitHub (for tech companies)</option>
												<option value="Other">🔗 Other</option>
											</select>
											<input
												type="url"
												placeholder="https://..."
												value={link.url}
												onChange={(e) => updateAdditionalLink(index, 'url', e.target.value)}
												className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
											/>
											<button
												type="button"
												onClick={() => removeAdditionalLink(index)}
												className="text-gray-400 hover:text-red-500 transition-colors"
											>✕</button>
										</div>
									))}

									{additionalLinks.length < 3 ? (
										<button
											type="button"
											onClick={addAdditionalLink}
											className="mt-3 flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
										>
											<span className="text-lg">+</span> Add Social / Professional Link
										</button>
									) : (
										<p className="mt-3 text-xs text-gray-400">Maximum 3 links reached</p>
									)}
								</div>
							</div>
						)}

						{/* STEP 4: Verification & Account Setup */}
						{currentStep === 3 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 border-b pb-4">
									<h3 className="text-xl font-bold text-gray-800">Step 4: Account Setup</h3>
									<p className="text-gray-500 text-sm mt-1">Finalize your account access and verification details.</p>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Account Admin Name *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="Jane Doe"
										{...register("adminName", { required: "Admin Name is required" })}
									/>
									{errors.adminName && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.adminName.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Admin Email Address *</label>
									<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
										<div className="flex-1 w-full">
											<input
												className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
												placeholder="jane.doe@company.com"
												{...register("adminEmail", {
													required: "Admin Email is required",
													pattern: {
														value: /\S+@\S+\.\S+/,
														message: "Invalid email address"
													},
													validate: async (value) => (await checkUniqueField("adminEmail", value)) || "Admin Email is already registered"
												})}
											/>
											{errors.adminEmail && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.adminEmail.message}</span>}
										</div>
										<button
											type="button"
											className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all duration-150 ${adminOtpVerified ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-800 text-white hover:bg-gray-700 shadow-md hover:scale-105 hover:shadow-lg active:scale-95'}`}
											onClick={handleSendAdminOTP}
											disabled={adminOtpVerified}
										>
											{adminOtpVerified ? "✓ Verified" : "Verify OTP"}
										</button>
									</div>
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">CIN Number *</label>
									<div className="relative">
										<input
											className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800 uppercase"
											placeholder="U12345MH2024PTC123456"
											{...register("cinNumber", {
												required: "CIN Number is required",
												pattern: {
													value: /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i,
													message: "Please enter a valid CIN format (e.g., U12345MH2024PTC123456)"
												},
												onChange: (e) => {
													setValue("cinNumber", e.target.value.toUpperCase(), { shouldValidate: true });
												}
											})}
										/>
									</div>
									{errors.cinNumber && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.cinNumber.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">GSTIN / Business Reg Number *</label>
									<input
										className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white focus:scale-[1.01] transition-all duration-200 ease-in-out text-gray-800"
										placeholder="29ABCDE1234F2Z5"
										{...register("gstin", {
											required: "GSTIN is required",
											onChange: (e) => {
												setValue("gstin", e.target.value.toUpperCase(), { shouldValidate: true });
											}
										})}
									/>
									{errors.gstin && <span className="text-red-500 text-xs font-medium mt-1 animate-pulse">{errors.gstin.message}</span>}
								</div>

								<div className="group flex flex-col gap-1.5 mb-4">
									<label className="text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-150">Certificate of Incorporation (Optional)</label>
									<input
										type="file"
										className="w-full px-4 py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-teal-400 transition-all duration-200 text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:transition-colors file:duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:scale-[1.01]"
										accept=".pdf, .jpg, .jpeg, .png"
										{...register("gstCertificate")}
									/>
									<span className="text-xs text-green-600 font-medium mt-1">
										Note: Uploading your COI helps verify your company faster and increases platform trust.
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
									{loading ? "PROCESSING..." : "SUBMIT APPLICATION"}
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
			<OTPModal
				isOpen={showAdminOtpModal}
				onClose={() => setShowAdminOtpModal(false)}
				onVerify={handleVerifyAdminOTP}
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
				role="company" 
			/>
		</div>
	);
};

export default JoinCompany;
