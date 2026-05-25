import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import { X, AlertCircle } from "lucide-react";


const OTPModal = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (error) setError(""); // Clear error on input
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      onVerify(otpValue);
    } else {
      setError("Please enter all 6 digits");
    }
  };

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-md bg-black/20 flex items-center justify-center">
      <form 
        className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-8 z-50 w-full max-w-md mx-4 relative animate-scale-up flex flex-col items-center" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 text-center mb-6">We have sent a verification code to your email</p>

        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              required
              maxLength="1"
              type="text"
              className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        <button 
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] mt-2" 
          type="submit"
        >
          Verify
        </button>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-red-500 text-xs font-bold mt-3"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 transition-colors" 
          type="button" 
          onClick={onClose}
        >
          ×
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Didn't receive the code?
          <button 
            className="ml-1 text-teal-600 cursor-pointer hover:underline font-medium" 
            type="button" 
            onClick={() => setShowToast(true)}
          >
            Resend Code
          </button>
        </p>

        <Toast 
          isVisible={showToast} 
          message="Verification code resent!" 
          type="success"
          onClose={() => setShowToast(false)} 
        />
      </form>
    </div>
  );
};

export default OTPModal;
