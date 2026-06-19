import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Send } from 'lucide-react';

const TarsChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Welcome! I am TARS, here to guide you to the right expertise. What can I help with today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loadingText, setLoadingText] = useState("Thinking about it...");
    const messagesEndRef = useRef(null);
    // Use a ref to ensure we always have the absolute latest messages for context history
    const messagesRef = useRef(messages);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const loadingPhrases = [
        "Thinking about it...",
        "Hmm...",
        "Let me think...",
        "Processing...",
        "Looking into that..."
    ];

    const scrollToBottom = () => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

            let loadingInterval = setInterval(() => {
                setLoadingText(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
            }, 1500);

            // Map previous messages using the ref to absolutely guarantee no stale context
            const formattedMessages = messagesRef.current
                .filter(m => m.role !== 'assistant' || m.content !== 'Welcome! I am TARS, here to guide you to the right expertise. What can I help with today?')
                .map(m => ({ role: m.role, content: m.content }));
            
            formattedMessages.push({ role: "user", content: userMessage });

            const response = await fetch(`${baseUrl}/api/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ messages: formattedMessages })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            clearInterval(loadingInterval);
            
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error("Error generating response:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* The Floating Button */}
            {!isOpen && (
                <motion.div
                    onClick={() => setIsOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    animate={{ width: isHovered ? 'auto' : '56px' }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, cursor: 'pointer', height: '56px', borderRadius: '9999px', overflow: 'hidden' }}
                    className="bg-[#134e40] border-2 border-[#0eb59a]/40 flex items-center justify-end shadow-2xl"
                    whileTap={{ scale: 0.93 }}
                >
                    <AnimatePresence>
                        {isHovered && (
                            <motion.span
                                key="tars-label"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                className="font-bold tracking-widest text-sm uppercase text-white pl-5 pr-3 whitespace-nowrap"
                            >
                                Ask Tars
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Circle icon with pulsing glow — always visible, anchored right */}
                    <motion.div
                        className="relative shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden flex items-center justify-center bg-[#0eb59a]"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(14,181,154,0.4)",
                                "0 0 20px rgba(14,181,154,0.6)",
                                "0 0 0px rgba(14,181,154,0.4)"
                            ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                        {/* Online indicator dot */}
                        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-[#0eb59a] rounded-full animate-pulse border border-[#134e40]" />
                    </motion.div>
                </motion.div>
            )}



            {/* The Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}
                        className="w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-[#f8f9fa] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-[#134e40] p-4 flex items-center justify-between text-white shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                                    <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">ASK TARS</h3>
                                    <p className="text-xs text-white/80">Chat Support</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                                            <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div 
                                        className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap text-left ${
                                            msg.role === 'user' 
                                            ? 'bg-[#134e40] text-white rounded-br-sm shadow-md' 
                                            : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                                        <img src="/favicon.png" alt="TARS" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm">
                                        <div className="flex gap-2 items-center h-full text-xs font-medium text-gray-500 italic">
                                            <span>{loadingText}</span>
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                                <span className="w-1.5 h-1.5 bg-[#0eb59a] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#134e40] flex items-center gap-3">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-white rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb59a] text-gray-800 shadow-inner"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="text-white p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TarsChatbot;
