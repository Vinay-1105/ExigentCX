import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Info, X } from "lucide-react";

const StatusModal = ({ 
  isOpen, 
  onClose, 
  type = "success", // "success" | "error" | "warning" | "info"
  title, 
  message,
  buttonText = "Continue"
}) => {
  const configs = {
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-teal-500" />,
      bgColor: "bg-teal-50",
      borderColor: "border-teal-500",
      buttonColor: "bg-teal-500 hover:bg-teal-600",
      titleColor: "text-gray-900"
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      buttonColor: "bg-red-500 hover:bg-red-600",
      titleColor: "text-red-900"
    },
    warning: {
      icon: <AlertCircle className="w-12 h-12 text-amber-500" />,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      titleColor: "text-amber-900"
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-500" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      titleColor: "text-blue-900"
    }
  };

  const config = configs[type] || configs.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 p-10 flex flex-col items-center gap-6 max-w-md w-full overflow-hidden"
          >
            {/* Background Accent Gradient */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${config.bgColor}`} />
            
            {/* Icon Container */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className={`w-24 h-24 rounded-full ${config.bgColor} border-4 ${config.borderColor} flex items-center justify-center shadow-inner`}
            >
              {config.icon}
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className={`text-3xl font-extrabold tracking-tight ${config.titleColor}`}>
                {title}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className={`w-full ${config.buttonColor} text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] text-lg`}
            >
              {buttonText}
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
