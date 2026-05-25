import { useState, useEffect } from "react";
import OTPInput from "./OTPInput";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Toast from "./Toast";

const OTPBox = ({ email, role, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  // ⏱ Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔑 VERIFY OTP
  const handleVerify = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp.join(""),
      type: "email",
    });

    if (error) {
      setError(error.message);
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  // 🔁 RESEND
  const resendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setToast({ visible: true, message: error.message, type: "error" });
    } else {
      setTimer(30);
      setToast({ visible: true, message: "Verification code resent!", type: "success" });
    }
  };

  return (
    <div className="mt-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <h3 className="text-gray-900 text-xl font-bold mb-2">Enter OTP</h3>
      <p className="text-sm text-gray-500 mb-6">Enter the 6-digit code sent to your email</p>

      <OTPInput otp={otp} setOtp={setOtp} />

      <button
        onClick={handleVerify}
        className="w-full mt-8 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        {loading ? "VERIFYING..." : "Verify OTP"}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold mt-4"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-sm text-gray-400">
        {timer > 0 ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            Resend in <span className="font-bold text-gray-600">{timer}s</span>
          </span>
        ) : (
          <p>
            Didn't receive the code?{" "}
            <button onClick={resendOtp} className="text-teal-600 font-semibold hover:underline">
              Resend OTP
            </button>
          </p>
        )}
      </div>
      <Toast 
        isVisible={toast.visible} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })} 
      />
    </div>
  );
};

export default OTPBox;