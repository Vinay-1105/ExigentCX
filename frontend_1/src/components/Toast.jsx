import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ 
  isVisible, 
  message, 
  type = "info", 
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const configs = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-teal-500" />,
      bg: "bg-teal-50/90",
      border: "border-teal-200"
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bg: "bg-red-50/90",
      border: "border-red-200"
    },
    info: {
      icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50/90",
      border: "border-blue-200"
    }
  };

  const config = configs[type] || configs.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-4 left-1/2 z-[300] min-w-[300px]"
        >
          <div className={`${config.bg} backdrop-blur-xl border ${config.border} p-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="flex-1 text-sm font-semibold text-gray-800">{message}</div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
