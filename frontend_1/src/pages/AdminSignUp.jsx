import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff, Check, X, ArrowLeft, LayoutGrid, Compass, Fingerprint, Grid } from 'lucide-react';
import Logo from '../components/Logo';
import SuccessModal from '../components/SuccessModal';

const AdminSignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Password validation criteria
    const isMinLength = password.length >= 10;
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const isValid = isMinLength && hasNumber && hasLetter;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            setError('Please fill out all fields.');
            return;
        }

        if (!isValid) {
            setError('Please satisfy all password criteria before registering.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let signUpResponse;
            // Support local mock or standard Supabase client signup flow
            if (supabase.auth.signUp) {
                signUpResponse = await supabase.auth.signUp({
                    email: email.trim(),
                    password: password,
                    options: {
                        data: {
                            role: 'admin'
                        }
                    }
                });
            } else {
                // Mock execution for development fallback
                await new Promise((resolve) => setTimeout(resolve, 1200));
                signUpResponse = { data: { user: { id: 'mock-admin-id', email: email.trim() } }, error: null };
            }

            if (signUpResponse.error) {
                throw signUpResponse.error;
            }

            // Save admin session state locally (matching project conventions)
            localStorage.setItem('user_role', 'admin');
            setShowSuccess(true);
        } catch (err) {
            console.error('Admin Registration Error:', err);
            setError(err.message || 'Failed to register administrator account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignUp = async (provider) => {
        setLoading(true);
        setError('');
        try {
            if (supabase.auth.signInWithOAuth) {
                const { error: sbError } = await supabase.auth.signInWithOAuth({
                    provider: provider,
                    options: {
                        redirectTo: window.location.origin + '/'
                    }
                });
                if (sbError) throw sbError;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                localStorage.setItem('user_role', 'admin');
                setShowSuccess(true);
            }
        } catch (err) {
            setError(err.message || 'Social sign up failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-[#070a09] overflow-hidden relative font-sans text-gray-800 dark:text-gray-200">

            {/* ── LEFT PANEL (BRAND GRID SHOWCASE) ── */}
            <div className="hidden lg:flex flex-col w-[45%] bg-[#08120e] relative overflow-hidden p-12 border-r border-[#134e40]/15">
                {/* Background glow & mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#070e0b] via-[#0d1c17] to-[#040807] z-0" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0eb59a]/10 rounded-full blur-[100px] z-0" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#134e40]/20 rounded-full blur-[80px] z-0" />

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.06] z-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(14, 181, 154, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 181, 154, 0.25) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Header Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <Logo variant="dark" className="h-10 md:h-12" />
                    <span className="text-white font-extrabold text-xl md:text-2xl tracking-[0.15em] font-serif ">
                        ExigentCX
                    </span>
                </div>

                {/* Title & Copy */}
                <div className="relative z-10 my-auto max-w-md mx-auto text-center flex flex-col items-center justify-center">
                    <span className="text-[#0eb59a] font-bold text-xs tracking-[0.3em] uppercase block mb-4">
                        SIGN UP
                    </span>
                    <h1
                        className="text-4xl md:text-5xl font-black text-white leading-[1.15] mb-6"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0eb59a] to-emerald-300 font-serif text-center">Platform Administration Panel</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed text-center">
                        Manage platform operations, oversee talent vetting, governance, analytics, and moderation.
                    </p>
                </div>

                {/* Bottom left Back Button instead of the info line */}
                <div className="absolute bottom-10 left-10 z-20">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#134e40]/15 hover:bg-[#134e40]/30 text-[#0eb59a] hover:text-white border border-[#0eb59a]/20 hover:border-[#0eb59a]/50 transition-all duration-300 backdrop-blur-md group cursor-pointer"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-xs font-bold tracking-wider uppercase">Back</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center px-6 md:px-16 py-8 relative overflow-y-auto h-full z-10 bg-white dark:bg-[#070908]">
                {/* Subtle grid pattern with light white stripes */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="w-full max-w-[420px] flex flex-col justify-between h-full min-h-[560px]">
                    {/* Spacer */}
                    <div />

                    {/* Main Form Box */}
                    <div className="my-auto py-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Sign Up</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 font-light">
                                Enter your credentials to access your executive dashboard.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2.5 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Address */}
                            <div className="flex flex-col">
                                <label className="text-[10px] tracking-[0.2em] font-bold text-gray-700 dark:text-gray-200 uppercase mb-2">
                                    ACCOUNT
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-gray-50 dark:bg-[#0c0f0d] border-2 border-gray-300 dark:border-[#1d2722] focus:border-[#0eb59a] focus:ring-1 focus:ring-[#0eb59a]/30 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all outline-none"
                                />
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 italic mt-1.5 block">
                                    *Please enter your email
                                </span>
                            </div>

                            {/* Password input */}
                            <div className="flex flex-col relative">
                                <label className="text-[10px] tracking-[0.2em] font-bold text-gray-700 dark:text-gray-200 uppercase mb-2">
                                    PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-gray-50 dark:bg-[#0c0f0d] border-2 border-gray-300 dark:border-[#1d2722] focus:border-[#0eb59a] focus:ring-1 focus:ring-[#0eb59a]/30 rounded-lg pl-4 pr-11 py-3 text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Dynamic password helper checkmarks */}
                                <div className="mt-3.5 space-y-1.5 bg-gray-50 dark:bg-[#0a0d0c] border border-gray-300 dark:border-[#141b18] rounded-lg p-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${isMinLength ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {isMinLength ? <Check size={10} /> : <X size={10} />}
                                        </span>
                                        <span className={isMinLength ? 'text-emerald-400/80 font-medium' : 'text-gray-400 dark:text-gray-500 font-light'}>
                                            At least 10 digits/characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${hasNumber ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {hasNumber ? <Check size={10} /> : <X size={10} />}
                                        </span>
                                        <span className={hasNumber ? 'text-emerald-400/80 font-medium' : 'text-gray-400 dark:text-gray-500 font-light'}>
                                            At least one numeric digit (0-9)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${hasLetter ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {hasLetter ? <Check size={10} /> : <X size={10} />}
                                        </span>
                                        <span className={hasLetter ? 'text-emerald-400/80 font-medium' : 'text-gray-400 dark:text-gray-500 font-light'}>
                                            At least one letter (a-z, A-Z)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Remember me & Forget Password */}
                            <div className="flex justify-between items-center text-xs py-1">
                                <label className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 accent-[#0eb59a] bg-gray-50 dark:bg-[#0c0f0d] border border-gray-200 dark:border-[#1d2722] rounded cursor-pointer"
                                    />
                                    <span>Remember Me</span>
                                </label>
                                <span className="text-[#0eb59a] hover:text-[#0b9c84] transition-colors cursor-pointer">
                                    Forgot your password?
                                </span>
                            </div>

                            {/* Sign Up Action Button */}
                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className="w-full bg-[#0eb59a] hover:bg-[#0c9c84] disabled:bg-[#0c9c84]/30 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 tracking-wide text-sm shadow-[0_0_15px_rgba(14,181,154,0.15)] hover:shadow-[0_0_25px_rgba(14,181,154,0.45)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none" />
                                {loading ? 'CREATING ACCOUNT...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs text-gray-500 font-light">
                            Already have an account?{' '}
                            <Link to="/signin?role=admin" className="text-[#0eb59a] hover:text-[#0b9c84] transition-colors font-medium ml-1">
                                Sign in now
                            </Link>
                        </div>

                        {/* Social Provider integrations section matching the UI */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-5">
                                <div className="h-px bg-gray-200 dark:bg-[#1d2722] flex-1" />
                                <span className="text-[9px] tracking-[0.25em] font-bold text-gray-400 dark:text-gray-500 px-4">
                                    OR SIGN UP WITH
                                </span>
                                <div className="h-px bg-gray-200 dark:bg-[#1d2722] flex-1" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {/* Apple Account */}
                                <button
                                    type="button"
                                    title="Apple Account"
                                    onClick={() => handleOAuthSignUp('apple')}
                                    className="flex items-center justify-center w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 hover:border-black dark:hover:border-white hover:shadow-md hover:shadow-black/10 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                                    >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black dark:fill-white">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.21.12.32.12.92 0 2.01-.58 2.5-1.45z" />
                                    </svg>
                                </button>

                                {/* Gmail Account */}
                                <button
                                    type="button"
                                    title="Gmail Account"
                                    onClick={() => handleOAuthSignUp('google')}
                                    className="flex items-center justify-center w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 hover:border-[#4285F4] hover:shadow-md hover:shadow-[#4285F4]/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                    </svg>
                                </button>

                                {/* Microsoft Account */}
                                <button
                                    type="button"
                                    title="Microsoft Account"
                                    onClick={() => handleOAuthSignUp('azure')}
                                    className="flex items-center justify-center w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 hover:border-[#f25022] hover:shadow-md hover:shadow-[#f25022]/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                                >
                                    <svg viewBox="0 0 23 23" className="w-4 h-4">
                                        <rect x="0" y="0" width="10" height="10" fill="#f25022" />
                                        <rect x="12" y="0" width="10" height="10" fill="#7fba00" />
                                        <rect x="0" y="12" width="10" height="10" fill="#00a4ef" />
                                        <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Privacy Policy & Terms of Service links */}
                    <div className="text-center text-[10px] text-gray-500 dark:text-gray-600 font-light border-t border-gray-200 dark:border-[#141b18] pt-6 mt-4">
                        <div className="mb-2">
                            © 2026 ExigentCX. Executive Tier Platforms.
                        </div>
                        <div className="space-x-3 text-gray-400 dark:text-gray-500">
                            <Link to="/privacy-policy" className="hover:text-[#0eb59a] transition-colors">
                                Privacy Policy
                            </Link>
                            <span>•</span>
                            <Link to="/terms-of-service" className="hover:text-[#0eb59a] transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal Popup */}
            <SuccessModal isOpen={showSuccess} role="admin" />
        </div>
    );
};

export default AdminSignUp;
