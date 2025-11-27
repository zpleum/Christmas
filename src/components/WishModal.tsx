"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface WishModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function WishModal({ isOpen, onClose, children }: WishModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl pointer-events-auto"
                        >
                            {/* Decorative Sparkles */}
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-6 -left-6 text-yellow-400 drop-shadow-lg z-10"
                            >
                                <Sparkles size={40} fill="currentColor" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    rotate: -360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-6 -right-6 text-pink-400 drop-shadow-lg z-10"
                            >
                                <Sparkles size={36} fill="currentColor" />
                            </motion.div>

                            {/* Animated Border */}
                            <motion.div
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="relative bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 bg-[length:200%_auto] rounded-3xl p-1 shadow-2xl"
                            >
                                {/* Modal Content Container */}
                                <div className="bg-white dark:bg-gray-900 rounded-[calc(1.5rem-4px)] relative overflow-hidden">
                                    {/* Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-green-500/5 to-blue-500/5" />

                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                                        aria-label="Close modal"
                                    >
                                        <X size={24} />
                                    </button>

                                    {/* Content */}
                                    <div className="relative z-10 p-8 md:p-12">
                                        {children}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
