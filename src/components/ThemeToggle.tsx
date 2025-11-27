"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

interface ThemeToggleProps {
    className?: string;
    scrolled?: boolean; // เพิ่ม prop
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", scrolled = false }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors hover:bg-[var(--muted)] ${className}`}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {theme === "light" ? (
                    <Moon
                        size={20}
                        className={`transition-colors ${scrolled ? "text-blue" : "text-white"
                            }`}
                    />
                ) : (
                    <Sun
                        size={20}
                        className={`transition-colors ${scrolled ? "text-[var(--foreground)]/80" : "text-white"
                            }`}
                    />

                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
