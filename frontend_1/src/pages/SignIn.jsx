import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import OTPBox from "../components/OTPBox";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";

const SignIn = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const role = queryParams.get("role") || "company";

	useEffect(() => {
		const isExpertMock = localStorage.getItem("sb-mock-auth") === "true";
		const isCompanyDemo = localStorage.getItem("demo_company") === "true";

		if (isExpertMock || isCompanyDemo) {
			localStorage.removeItem("sb-mock-auth");
			localStorage.removeItem("demo_company");
			localStorage.removeItem("demo_expert");
			localStorage.removeItem("mock-role");
			// Force a hard reload to re-initialize the Supabase client
			window.location.reload();
		}
	}, []);

	useEffect(() => {
		// Handle error query parameter from redirects (e.g. from expired magic link)
		const urlError = queryParams.get("error");
		if (urlError) {
			setError(decodeURIComponent(urlError));

			// Clean up the URL search params so the error message doesn't persist on page reloads
			const newParams = new URLSearchParams(location.search);
			newParams.delete("error");
			const newSearch = newParams.toString();
			navigate({
				pathname: location.pathname,
				search: newSearch ? `?${newSearch}` : ""
			}, { replace: true });
		}
	}, [location.search, navigate]);

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [loginMethod, setLoginMethod] = useState("otp"); // for experts
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [otp, setOtp] = useState("");
	const [showOtp, setShowOtp] = useState(false);
	const [resolvedEmail, setResolvedEmail] = useState("");

	const handleSendOTP = async (e) => {
		if (e) e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");

		try {
			localStorage.setItem('logging_in_role', role);
			if (role === "admin") {
				const cleanEmail = identifier.trim();
				if (!cleanEmail || !password) {
					setError("Please fill out both email and password.");
					setLoading(false);
					return;
				}

				if (cleanEmail === "admin@cxo.com" && password === "admin12345") {
					localStorage.setItem('sb-mock-auth', 'true');
					localStorage.setItem('user_role', 'admin');
					localStorage.removeItem('demo_company');
					localStorage.removeItem('demo_expert');
					navigate("/admin-dashboard");
					return;
				}

				const { data, error: sbError } = await supabase.auth.signInWithPassword({
					email: cleanEmail,
					password: password
				});

				if (sbError) throw sbError;

				localStorage.setItem('user_role', 'admin');
				localStorage.removeItem('demo_company');
				localStorage.removeItem('demo_expert');
				navigate("/admin-dashboard");
				return;
			} else if (role === "company") {
				const cleanEmail = identifier.trim();
				console.log("🔍 Searching for company admin email:", `"${cleanEmail}"`);

				if (cleanEmail === "demo@cxo.com") {
					localStorage.setItem('demo_company', 'true');
					localStorage.setItem('user_role', 'company');
					localStorage.removeItem('demo_expert');
					localStorage.setItem('sb-mock-auth', 'true');
					localStorage.removeItem('mock-role');
					navigate("/company-dashboard");
					return;
				}

				let targetEmail = cleanEmail;
				let backendVerified = false;

				// Try to verify company email using Supabase directly first (much faster, no backend cold starts or localhost timeout)
				try {
					const { data: sbData, error: sbError } = await supabase
						.from("company_applications")
						.select("admin_email")
						.eq("admin_email", cleanEmail)
						.limit(1)
						.maybeSingle();

					if (sbError) {
						throw sbError;
					}

					if (sbData && sbData.admin_email) {
						targetEmail = sbData.admin_email.trim();
						backendVerified = true;
					} else {
						// If query succeeded but returned no data, it means company not found
						throw new Error("Company not found");
					}
				} catch (sbErr) {
					if (sbErr.message === "Company not found") {
						throw sbErr;
					}

					console.warn("Direct Supabase query failed, falling back to backend check:", sbErr);

					// Fallback: try to verify company email with the backend if available
					try {
						const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
						
						// Set up a 2-second timeout to avoid long hangs on hosted site
						const controller = new AbortController();
						const timeoutId = setTimeout(() => controller.abort(), 2000);

						const res = await fetch(`${baseUrl}/api/auth/check-company-email`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ email: cleanEmail }),
							signal: controller.signal
						});
						clearTimeout(timeoutId);

						if (res.ok) {
							const data = await res.json();
							if (data && data.email) {
								targetEmail = data.email.trim();
								backendVerified = true;
							}
						} else {
							// If backend explicitly says company not found (404), respect it
							if (res.status === 404) {
								throw new Error("Company not found");
							}
							console.warn(`Backend responded with status ${res.status}.`);
						}
					} catch (fetchErr) {
						// If it was a "Company not found" error, propagate it
						if (fetchErr.message === "Company not found") {
							throw fetchErr;
						}
						console.error("Backend check fallback failed:", fetchErr);
						// Proceed with cleanEmail as a last resort to avoid blocking users
					}
				}

				setResolvedEmail(targetEmail);

				localStorage.removeItem('demo_company');
				const { error: authError } = await supabase.auth.signInWithOtp({
					email: targetEmail,
					options: {
						emailRedirectTo: window.location.origin + "/company-dashboard"
					}
				});
				if (authError) throw authError;

				localStorage.setItem('user_role', 'company');
				localStorage.removeItem('demo_expert');
				localStorage.removeItem('sb-mock-auth');
				localStorage.removeItem('mock-role');
				setMessage(`OTP sent to ${targetEmail}`);
				setShowOtp(true);
			} else {
				// 👨‍💼 EXPERT LOGIN
				const cleanIdentifier = identifier.trim();
				if (cleanIdentifier === "demo@cxo.com") {
					localStorage.setItem("sb-mock-auth", "true");
					localStorage.setItem("demo_expert", "true");
					localStorage.setItem("mock-role", "expert");
					localStorage.setItem('user_role', 'expert');
					localStorage.removeItem('demo_company');
					window.location.href = "/expert-dashboard";
					return;
				}
				if (loginMethod === "otp") {
					const { error } = await supabase.auth.signInWithOtp({
						email: cleanIdentifier,
						options: {
							emailRedirectTo: window.location.origin + "/expert-dashboard"
						}
					});

					if (error) throw error;

					localStorage.setItem('user_role', 'expert');
					localStorage.removeItem('demo_company');
					setMessage(`OTP sent to ${cleanIdentifier}`);
					setShowOtp(true);
				} else {
					const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
					const response = await fetch(`${baseUrl}/api/auth/send-magic-link`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: cleanIdentifier,
							redirectTo: window.location.origin + "/expert-dashboard"
						}),
					});

					const data = await response.json();
					if (!response.ok) throw new Error(data.error || "Failed to send magic link");

					localStorage.setItem('user_role', 'expert');
					localStorage.removeItem('demo_company');
					setMessage(`Magic link sent to ${cleanIdentifier}`);
				}
			}
		} catch (err) {
			console.error("SignIn Error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuthSignIn = async (provider) => {
		try {
			localStorage.setItem('logging_in_role', role);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: provider,
				options: {
					redirectTo: window.location.origin + (role === "company" ? "/company-dashboard" : role === "admin" ? "/admin-dashboard" : "/expert-dashboard")
				}
			});
			if (error) throw error;
		} catch (err) {
			console.error("OAuth Error:", err);
			setError(err.message);
		}
	};

	return (
		<div className="relative min-h-screen bg-gray-50 dark:bg-[#0d1a14] flex items-center justify-center">
			{/* Back Button */}
			<button
				onClick={() => navigate("/")}
				className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#0d2318] hover:bg-teal-50 dark:hover:bg-[#0eb59a]/10 text-gray-600 dark:text-gray-300 hover:text-[#134e40] border border-gray-200 dark:border-white/10 hover:border-teal-200 shadow-sm transition-all duration-300 hover:shadow-md group active:scale-95 min-h-[44px]"
			>
				<ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
				<span className="text-xs font-bold tracking-wider uppercase">Back</span>
			</button>

			<SignIn2
				email={identifier}
				setEmail={setIdentifier}
				password={password}
				setPassword={setPassword}
				handleSignIn={handleSendOTP}
				error={error || message}
				title={`Sign In as ${role === "company" ? "Company" : role === "admin" ? "Admin" : "Expert"}`}
				description={role === "company" ? "Enter your Admin Email Address" : role === "admin" ? "Enter your administrator credentials" : "Enter your registered email"}
				buttonText={loading ? "SENDING..." : (role === "admin" ? "SIGN IN" : (loginMethod === "magiclink" ? "SEND MAGIC LINK" : "SEND OTP"))}
				showPassword={role === "admin"}
				role={role}
				loginMethod={loginMethod}
				setLoginMethod={setLoginMethod}
				onOAuthSignIn={handleOAuthSignIn}
				showOtp={showOtp}
			>
				{showOtp ? (
					<OTPBox
						email={role === "company" ? resolvedEmail : identifier}
						role={role}
						onSuccess={() => navigate(role === "company" ? "/company-dashboard" : "/expert-dashboard")}
					/>
				) : (
					<div className="mt-2 p-3 bg-[#0eb59a]/10 border border-[#0eb59a]/20 rounded-2xl text-left w-full">
						<p className="text-[10px] font-black text-[#0a8c77] uppercase tracking-wider mb-2 flex items-center gap-1">
							<span>💡</span> Demo Quick Fill
						</p>
						{role === "admin" && (
							<button
								onClick={(e) => {
									e.preventDefault();
									setIdentifier("admin@cxo.com");
									setPassword("admin12345");
								}}
								className="w-full text-xs text-[#0a8c77] hover:text-[#0eb59a] font-bold text-left bg-white dark:bg-white/5 border border-[#0eb59a]/25 dark:border-[#0eb59a]/40 p-2.5 rounded-xl flex flex-col gap-0.5 hover:shadow-sm transition-all"
							>
								<span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">Click to fill Admin:</span>
								<span>Email: admin@cxo.com</span>
								<span>Password: admin12345</span>
							</button>
						)}
						{role === "company" && (
							<button
								onClick={(e) => {
									e.preventDefault();
									setIdentifier("demo@cxo.com");
								}}
								className="w-full text-xs text-[#0a8c77] hover:text-[#0eb59a] font-bold text-left bg-white dark:bg-white/5 border border-[#0eb59a]/25 dark:border-[#0eb59a]/40 p-2.5 rounded-xl flex flex-col gap-0.5 hover:shadow-sm transition-all"
							>
								<span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">Click to fill Company:</span>
								<span>Email: demo@cxo.com</span>
							</button>
						)}
						{role === "expert" && (
							<button
								onClick={(e) => {
									e.preventDefault();
									setIdentifier("demo@cxo.com");
								}}
								className="w-full text-xs text-[#0a8c77] hover:text-[#0eb59a] font-bold text-left bg-white dark:bg-white/5 border border-[#0eb59a]/25 dark:border-[#0eb59a]/40 p-2.5 rounded-xl flex flex-col gap-0.5 hover:shadow-sm transition-all"
							>
								<span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">Click to fill Expert:</span>
								<span>Email: demo@cxo.com</span>
							</button>
						)}
					</div>
				)}
			</SignIn2>
		</div>
	);
};

export default SignIn;
