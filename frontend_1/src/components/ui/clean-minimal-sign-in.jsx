"use client";

import * as React from "react";
import { LogIn, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

const SignIn2 = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
  error,
  title = "Sign in with email",
  description = "Make a new doc to bring your words, data, and teams together. For free",
  buttonText = "Get Started",
  showPassword = true,
  loginMethod,
  setLoginMethod,
  role,
  onOAuthSignIn,
  showOtp,
  children
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(13,26,24,0.55) 0%, rgba(14,181,154,0.25) 50%, rgba(13,26,24,0.55) 100%)' }} />
      <div className="absolute inset-0 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm bg-white/90 dark:bg-[#12141c]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/50 dark:border-white/10 text-black dark:text-white"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 4px 20px rgba(14,181,154,0.15)",
              "0 4px 30px rgba(14,181,154,0.35)",
              "0 4px 20px rgba(14,181,154,0.15)"
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-[#1b1d24] mb-6"
        >
          <LogIn className="w-7 h-7 text-[#0eb59a]" />
        </motion.div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
          {description}
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              disabled={showOtp}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border-2
              focus:outline-none focus:ring-4 focus:ring-[#0eb59a]/25 
              focus:border-[#0eb59a]
              text-black text-sm font-medium transition-all
              shadow-sm
              ${showOtp 
                  ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-400 dark:text-white dark:placeholder-gray-400 cursor-not-allowed' 
                  : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/15 dark:text-white dark:placeholder-gray-400'
              }`}
              onChange={(e) => !showOtp && setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !showOtp && handleSignIn(e)}
            />
          </div>
          {showOtp && (
            <p className="text-xs text-[#0eb59a] font-medium mt-1 ml-1 
            flex items-center gap-1">
                <span>✓</span> OTP sent to {email}
            </p>
          )}

          {showPassword && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                <Lock className="w-4 h-4" />
              </span>
              <input
                placeholder="Password"
                type="password"
                value={password}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-gray-300 dark:border-white/15 focus:outline-none focus:ring-4 focus:ring-[#0eb59a]/25 focus:border-[#0eb59a] bg-white dark:bg-white/5 text-black dark:text-white text-sm font-medium shadow-sm transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {role === "expert" && setLoginMethod && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-400">Login Method</label>
              <div className="flex gap-2 bg-gray-50 dark:bg-white/5 p-1.5 rounded-xl border border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setLoginMethod("otp")}
                  className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all duration-200 ${
                    loginMethod === "otp"
                      ? "bg-[#0eb59a] text-white shadow-md"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  OTP
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("magiclink")}
                  className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all duration-200 ${
                    loginMethod === "magiclink"
                      ? "bg-[#0eb59a] text-white shadow-md"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Magic Link
                </button>
              </div>
            </div>
          )}

          <div className="w-full flex flex-col items-end">
            {error && (
              <div className="text-xs text-red-500 text-left w-full mb-1">{error}</div>
            )}
            {showPassword && (
              <button className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-[#0eb59a] relative group/forgot transition-colors">
                Forgot password?
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#0eb59a] group-hover/forgot:w-full transition-all duration-300"></span>
              </button>
            )}
          </div>
        </div>
        {!showOtp && (
          <motion.button
            onClick={handleSignIn}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(14,181,154,0.4)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-gradient-to-b from-[#0eb59a] to-[#0a8c77] text-white font-semibold py-2.5 rounded-xl shadow-lg cursor-pointer mb-4 mt-2"
          >
            {buttonText}
          </motion.button>
        )}
        {children}
        {!showOtp && (
          <>
            <div className="flex items-center w-full my-2">
              <div className="flex-grow border-t border-dashed border-gray-200 dark:border-white/10"></div>
              <span className="mx-2 text-xs text-gray-400 dark:text-gray-500">Or sign in with</span>
              <div className="flex-grow border-t border-dashed border-gray-200 dark:border-white/10"></div>
            </div>            <div className="flex gap-3 w-full justify-center mt-2">
              <button
                onClick={() => onOAuthSignIn && onOAuthSignIn('google')}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-[#4285F4] hover:shadow-md hover:shadow-[#4285F4]/20 hover:scale-110 active:scale-95 transition-all duration-200 grow cursor-pointer"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
              </button>
              <button
                onClick={() => onOAuthSignIn && onOAuthSignIn('linkedin_oidc')}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#0a66c2]/5 hover:border-[#0a66c2] hover:shadow-md hover:shadow-[#0a66c2]/20 hover:scale-110 active:scale-95 transition-all duration-200 grow cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0a66c2]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                onClick={() => onOAuthSignIn && onOAuthSignIn('twitter')}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-900 hover:shadow-md hover:shadow-black/10 hover:scale-110 active:scale-95 transition-all duration-200 grow cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-black dark:text-white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              New here?{" "}
              <a
                href={role === "company" ? "/join-company" : role === "admin" ? "/admin-signup" : "/join-expert"}
                className="text-[#0eb59a] font-semibold relative group/join transition-colors hover:text-[#134e40]"
              >
                Join as {role === "company" ? "Company" : role === "admin" ? "Admin" : "Expert"}
                <span className="absolute -bottom-0.5 left-0 w-full h-px bg-[#0eb59a] scale-x-0 group-hover/join:scale-x-100 origin-left transition-transform duration-300"></span>
              </a>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export { SignIn2 };
