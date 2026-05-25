import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from './AuthModalContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
    const { isMenuOpen, closeModal } = useAuthModal();
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        closeModal();
        navigate(path);
    };

    return (
        <AnimatePresence>
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 backdrop-blur-md bg-black/20 flex items-center justify-center p-4" onClick={closeModal}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-10 z-50 w-full max-w-4xl relative flex flex-col md:flex-row gap-8 items-stretch" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" onClick={closeModal}>
                            <X size={24} />
                        </button>
                        
                        {/* Left Side */}
                        <div className="flex-1 flex flex-col items-center text-center justify-center space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">First time to this website?</h3>
                                <p className="text-gray-500 text-lg">Create a new account to get started.</p>
                            </div>
                            <div className="flex flex-col gap-4 w-full max-w-xs">
                                <button className="bg-[#0eb59a] hover:bg-[#0b9680] text-white font-medium py-3 px-6 rounded-md transition-all duration-200 ease-out shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-95 w-full" onClick={() => handleNavigation('/join-company')}>
                                    Join as a company
                                </button>
                                <button className="bg-[#0eb59a] hover:bg-[#0b9680] text-white font-medium py-3 px-6 rounded-md transition-all duration-200 ease-out shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-95 w-full" onClick={() => handleNavigation('/join-expert')}>
                                    Join as an expert
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:flex flex-col justify-center items-center w-8">
                            <div className="h-full w-px bg-gray-200 relative mx-auto">
                                <div className="absolute left-[-6px] top-0 h-full w-px bg-gray-200"></div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex-1 flex flex-col items-center text-center justify-center space-y-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Already a member?</h3>
                                <p className="text-gray-500 text-lg">Welcome back! Please log in.</p>
                            </div>
                            <div className="flex flex-col gap-4 w-full max-w-xs">
                                <button className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-md transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-105 active:scale-95 w-full" onClick={() => handleNavigation('/signin?role=company')}>
                                    Already a company
                                </button>
                                <button className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-md transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-105 active:scale-95 w-full" onClick={() => handleNavigation('/signin?role=expert')}>
                                    Already an expert
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
