"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { Wish } from "@/types/wishes";
import { getRelativeTime } from "@/lib/time";

interface WishCardProps {
    wish: Wish;
}

export default function WishCard({ wish }: WishCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 w-80 md:w-96"
            style={{ fontFamily: "'Thai', sans-serif" }}
        >
            {/* Animated Border */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative p-1 rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
                {/* Card Content */}
                <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-[calc(1rem-4px)] p-6 h-full relative overflow-hidden font-sans">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-purple-500/5" />

                    {/* Decorative Elements */}
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-2 right-2 text-yellow-400/30"
                    >
                        <Sparkles size={24} fill="currentColor" />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Header with Name */}
                        <div className="flex items-center gap-2 mb-4">
                            <Heart className="text-red-500 flex-shrink-0" size={20} fill="currentColor" />
                            <h3 className="font-bold text-lg text-[var(--foreground)] truncate">
                                {wish.name}
                            </h3>
                        </div>

                        {/* Message */}
                        <p className="text-[var(--foreground-muted)] leading-relaxed mb-4 line-clamp-4">
                            {wish.message}
                        </p>

                        {/* Timestamp */}
                        <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                            <span className="italic">{getRelativeTime(wish.created_at)}</span>
                            <Sparkles className="text-pink-400" size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
