import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark 
                ? 'Switch to light mode' 
                : 'Switch to dark mode'
            }
            className={`relative flex items-center w-[64px] h-[32px] rounded-full p-[3px] cursor-pointer transition-colors duration-400 border focus:outline-none ${
                isDark 
                    ? 'bg-[#1a2e28] border-white/10' 
                    : 'bg-white/15 border-white/20'
            }`}
        >
            {/* Sun icon — always visible on left */}
            <span className={`absolute left-[8px] z-10 transition-all duration-300 ${
                isDark 
                    ? 'text-gray-500 opacity-50' 
                    : 'text-amber-400 opacity-100'
            }`}>
                <Sun size={14} strokeWidth={2.5} />
            </span>

            {/* Moon icon — always visible on right */}
            <span className={`absolute right-[8px] z-10 transition-all duration-300 ${
                isDark 
                    ? 'text-[#0eb59a] opacity-100' 
                    : 'text-gray-400 opacity-40'
            }`}>
                <Moon size={14} strokeWidth={2.5} />
            </span>

            {/* Sliding circle */}
            <motion.div
                layout
                transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 35 
                }}
                className={`relative z-20 w-[26px] h-[26px] rounded-full shadow-md flex items-center justify-center ${
                    isDark 
                        ? 'bg-[#0d1a14] ml-auto' 
                        : 'bg-white ml-0'
                }`}
            >
                {/* Icon inside the sliding circle */}
                {isDark ? (
                    <Moon 
                        size={12} 
                        strokeWidth={2.5} 
                        className="text-[#0eb59a]" 
                    />
                ) : (
                    <Sun 
                        size={12} 
                        strokeWidth={2.5} 
                        className="text-amber-400" 
                    />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
