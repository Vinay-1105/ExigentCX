import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const SuccessModal = ({ isOpen, role }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const title = role === 'company' 
        ? "Application Submitted! 🎉" 
        : "Welcome to CXOConnect! 🎉";
        
    const message = role === 'company'
        ? "Your company application has been successfully submitted. You can now sign in to access your dashboard."
        : "Your expert application has been successfully submitted. Sign in to start exploring opportunities.";

    const signinPath = `/signin?role=${role}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-500">
            <div className="relative overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-10 max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-5 duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 rounded-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal-500/40 ring-4 ring-white/60 animate-bounce" style={{ animationIterationCount: 1 }}>
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-extrabold text-gray-800 mb-3 drop-shadow-sm">
                        {title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>
                    
                    <div className="flex flex-col gap-4 w-full mt-2">
                        <button 
                            onClick={() => navigate(signinPath)}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95"
                        >
                            Sign In as {role === 'company' ? 'Company' : 'Expert'}
                            <ArrowRight size={18} />
                        </button>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white/80 hover:bg-white text-gray-700 font-bold rounded-xl border border-gray-200/60 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:scale-95 backdrop-blur-md"
                        >
                            <Home size={18} />
                            Take me to Home Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
