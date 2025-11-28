"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Snowflake, Gift, Star, Sparkles, Heart, TreePine } from "lucide-react";
import WishModal from "@/components/WishModal";
import WishForm from "@/components/WishForm";
import WishesCarousel from "@/components/WishesCarousel";

export default function Home() {
    const [isWishModalOpen, setIsWishModalOpen] = useState(false);
    const [snowflakes, setSnowflakes] = useState<Array<{
        id: number;
        initialX: number;
        animateX: number;
        animateY: number;
        duration: number;
        delay: number;
        size: number;
    }>>([]);

    useEffect(() => {
        // Generate snowflakes only on client-side
        const flakes = [...Array(30)].map((_, i) => ({
            id: i,
            initialX: Math.random() * window.innerWidth,
            animateX: Math.random() * window.innerWidth,
            animateY: window.innerHeight + 100,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            size: Math.random() * 20 + 10,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <main className="flex-1 flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background with Multiple Gradients */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br 
            from-red-950/80 via-green-950/80 to-blue-950/80">
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr 
            from-yellow-950/50 to-pink-950/50">
                    </div>

                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>


                    {/* Animated Gradient Orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-red-400/30 to-pink-400/30 rounded-full blur-3xl"
                    ></motion.div>
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl"
                    ></motion.div>
                </div>

                {/* Floating Snowflakes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {snowflakes.map((flake) => (
                        <motion.div
                            key={flake.id}
                            initial={{ y: -100, x: flake.initialX }}
                            animate={{
                                y: flake.animateY,
                                x: flake.animateX,
                            }}
                            transition={{
                                duration: flake.duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: flake.delay,
                            }}
                            className="absolute"
                        >
                            <Snowflake
                                size={flake.size}
                                className="text-blue-400/50 dark:text-blue-300/30 drop-shadow-lg"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto"
                    >

                        {/* Main Heading with Enhanced Gradient and Decorations */}
                        <div className="relative">
                            {/* Decorative Elements Around Text */}
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-16 left-1/4 text-red-500"
                            >
                                <Gift size={56} className="drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, -360],
                                }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="absolute -top-12 right-1/4 text-yellow-400"
                            >
                                <Star size={48} fill="currentColor" className="drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute top-1/4 -left-20 text-green-500"
                            >
                                <TreePine size={64} className="drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -180, -360],
                                }}
                                transition={{ duration: 7, repeat: Infinity }}
                                className="absolute top-1/4 -right-20 text-red-600"
                            >
                                <TreePine size={64} className="drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    y: [0, 20, 0],
                                    x: [0, 10, 0],
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute bottom-10 left-1/3 text-pink-400"
                            >
                                <Heart size={52} fill="currentColor" className="drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.4, 1],
                                }}
                                transition={{ duration: 10, repeat: Infinity }}
                                className="absolute bottom-16 right-1/3 text-blue-400"
                            >
                                <Snowflake size={48} className="drop-shadow-2xl" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-7xl md:text-9xl lg:text-[12rem] font-black leading-none relative"
                            >
                                {/* Glow Effect Behind Text */}
                                <div className="absolute inset-0 blur-3xl opacity-50">
                                    <span className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">
                                        Merry Christmas
                                    </span>
                                </div>

                                {/* Main Text */}
                                <motion.span
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="relative bg-gradient-to-r from-red-600 via-yellow-500 via-green-600 via-pink-600 to-red-600 bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-2xl"
                                    style={{ WebkitTextStroke: "3px rgba(255,255,255,0.15)" }}
                                >
                                    Merry Christmas
                                </motion.span>

                                {/* Sparkle Effects */}
                                <motion.div
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                    className="absolute top-0 left-1/4 text-yellow-300"
                                >
                                    <Sparkles size={32} fill="currentColor" />
                                </motion.div>
                                <motion.div
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, -180, -360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 1.5,
                                        delay: 0.5,
                                    }}
                                    className="absolute top-1/3 right-1/4 text-pink-300"
                                >
                                    <Sparkles size={28} fill="currentColor" />
                                </motion.div>
                            </motion.h1>

                            {/* Festive Subtitle */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="mt-8 flex items-center justify-center gap-4"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span className="text-5xl">🎄</span>
                                </motion.div>
                                <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-200 via-red-200 to-green-200 bg-clip-text text-transparent drop-shadow-lg">
                                    สุขสันต์วันคริสต์มาส
                                </p>
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span className="text-5xl">🎅</span>
                                </motion.div>
                            </motion.div>

                            {/* Decorative Line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="mt-8 flex items-center justify-center gap-4"
                            >
                                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-400 to-red-500 rounded-full"></div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Star size={32} className="text-yellow-400" fill="currentColor" />
                                </motion.div>
                                <div className="w-32 h-1 bg-gradient-to-l from-transparent via-green-400 to-green-500 rounded-full"></div>
                            </motion.div>
                        </div>

                        {/* Subtitle with Icons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col items-center gap-4 mb-16"
                        >
                        </motion.div>
                        <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-200 via-green-200 to-red-200 bg-clip-text text-transparent drop-shadow-lg">
                            เว็บไซต์นี้ถูกสร้างโดย เด็กชายวีรภัทร มากวงษ์
                        </p>
                    </motion.div>
                </div>

                {/* Enhanced Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-auto"
                    >
                        <path
                            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                            fill="var(--background)"
                            fillOpacity="0.8"
                        />
                    </svg>
                </div>
            </section>

            {/* Message Section */}
            <section className="relative py-24 bg-[var(--background)]">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Decorative Icons with Better Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex justify-center gap-12 mb-16"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    y: [0, -10, 0],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                                <Gift size={64} className="text-red-500 relative z-10 drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
                                <Star size={64} className="text-yellow-500 relative z-10 drop-shadow-2xl" fill="currentColor" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    rotate: [0, -10, 10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"></div>
                                <Heart size={64} className="text-pink-500 relative z-10 drop-shadow-2xl" fill="currentColor" />
                            </motion.div>
                        </motion.div>

                        {/* Enhanced Message Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="relative">
                                {/* Decorative Stars */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-12 -left-12 text-yellow-400 drop-shadow-2xl"
                                >
                                    <Star size={48} fill="currentColor" />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-10 -right-10 text-red-400 drop-shadow-2xl"
                                >
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute -bottom-10 -left-10 text-green-400 drop-shadow-2xl"
                                >
                                    <Sparkles size={40} />
                                </motion.div>

                                {/* Main Card with Enhanced Gradient Border */}
                                <motion.div
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 8, repeat: Infinity }}
                                    className="relative p-1 rounded-[2.5rem] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 bg-[length:200%_auto] shadow-2xl"
                                >
                                    <div className="bg-[var(--card-bg)] backdrop-blur-2xl rounded-[calc(2.5rem-4px)] p-12 md:p-20 relative overflow-hidden">
                                        {/* Enhanced Glow Effects */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-yellow-500/10 via-green-500/10 to-blue-500/10 pointer-events-none"></div>
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Top Decoration */}
                                            <div className="flex justify-center mb-10">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        animate={{ scaleX: [0, 1] }}
                                                        transition={{ duration: 1, delay: 1 }}
                                                        className="w-20 h-1 bg-gradient-to-r from-transparent via-red-400 to-red-500 rounded-full"
                                                    ></motion.div>
                                                    <Gift className="text-red-500 drop-shadow-lg" size={40} />
                                                    <motion.div
                                                        animate={{ scaleX: [0, 1] }}
                                                        transition={{ duration: 1, delay: 1 }}
                                                        className="w-20 h-1 bg-gradient-to-l from-transparent via-green-400 to-green-500 rounded-full"
                                                    ></motion.div>
                                                </div>
                                            </div>

                                            {/* Main Message */}
                                            <p className="text-4xl md:text-6xl text-[var(--foreground)] leading-relaxed mb-10 text-center font-bold">
                                                <span className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                                                    ในช่วงเทศกาลแห่งความสุขนี้
                                                </span>
                                                <br />
                                                <span className="text-[var(--foreground)] drop-shadow-md">
                                                    ขออวยพรให้ทุกคนมีความสุข สุขภาพแข็งแรง
                                                </span>
                                                <br />
                                                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                                                    และเต็มไปด้วยความอบอุ่นจากคนที่คุณรัก
                                                </span>
                                            </p>

                                            {/* Divider with Animation */}
                                            <div className="flex items-center justify-center gap-4 my-10">
                                                <motion.div
                                                    animate={{ scaleX: [0, 1] }}
                                                    transition={{ duration: 1, delay: 1.5 }}
                                                    className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[var(--border)] to-[var(--border)] rounded-full"
                                                ></motion.div>
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Heart className="text-pink-500 drop-shadow-lg" size={28} fill="currentColor" />
                                                </motion.div>
                                                <motion.div
                                                    animate={{ scaleX: [0, 1] }}
                                                    transition={{ duration: 1, delay: 1.5 }}
                                                    className="w-24 h-[2px] bg-gradient-to-l from-transparent via-[var(--border)] to-[var(--border)] rounded-full"
                                                ></motion.div>
                                            </div>

                                            {/* Quote */}
                                            <p className="text-2xl md:text-3xl text-[var(--foreground-muted)] italic text-center font-light leading-relaxed">
                                                "Christmas is not just a day,
                                                <br />
                                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold not-italic">
                                                    it's a feeling of love and joy
                                                </span>
                                                "
                                            </p>

                                            {/* Bottom Decoration */}
                                            <div className="flex justify-center mt-10 gap-3">
                                                {[...Array(7)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [0.5, 1, 0.5],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: i * 0.15,
                                                        }}
                                                    >
                                                        <div className="w-6 h-1 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 shadow-lg"></div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Greeting Cards Section */}
            <section className="relative py-32 bg-gradient-to-b from-[var(--christmas-gradient-from)] to-[var(--christmas-gradient-to)]">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-block mb-6"
                        >
                            <div className="p-4 bg-gradient-to-br from-red-500/10 to-green-500/10 rounded-3xl border-2 border-red-200/50 dark:border-red-800/50">
                                <Sparkles className="text-red-500" size={32} />
                            </div>
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl lg:text-8xl font-black mb-8">
                            <span className="tracking-wider bg-gradient-to-r from-green-600 via-red-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                                ส่งความสุขถึงกัน
                            </span>
                        </h2>
                        <p className="text-2xl md:text-4xl text-[var(--foreground-muted)] max-w-3xl mx-auto font-medium">
                            แบ่งปันความรักและความอบอุ่นในเทศกาลนี้
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {[
                            {
                                icon: Gift,
                                title: "แบ่งปันความสุข",
                                description: "มอบของละรอยยิ้มให้คนที่คุณรัก",
                                gradient: "from-red-500 via-pink-500 to-red-600",
                                borderColor: "border-red-200 dark:border-red-800",
                            },
                            {
                                icon: Star,
                                title: "ความหวังดี",
                                description: "ขอให้ปีใหม่เต็มไปด้วยความสำเร็จ",
                                gradient: "from-yellow-500 via-orange-500 to-yellow-600",
                                borderColor: "border-yellow-200 dark:border-yellow-800",
                            },
                            {
                                icon: Heart,
                                title: "ความรักและอบอุ่น",
                                description: "ใช้เวลากับครอบครัวและคนที่รัก",
                                gradient: "from-pink-500 via-red-500 to-pink-600",
                                borderColor: "border-pink-200 dark:border-pink-800",
                            },
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -15 }}
                                className="group relative"
                            >
                                {/* Glow Effect on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500`}></div>

                                <div className={`relative bg-[var(--card-bg)] backdrop-blur-xl rounded-3xl p-10 border-2 ${card.borderColor} shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden`}>
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`}></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className={`inline-flex p-6 bg-gradient-to-br ${card.gradient} rounded-3xl mb-8 shadow-2xl`}
                                        >
                                            <card.icon className="text-white drop-shadow-lg" size={48} />
                                        </motion.div>
                                        <h3 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6 leading-tight" style={{ letterSpacing: '0.03em' }}>
                                            {card.title}
                                        </h3>
                                        <p className="text-2xl md:text-4xl text-[var(--foreground-muted)] leading-relaxed font-medium">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Enhanced Contact CTA Section */}
            < section className="relative py-40 overflow-hidden" >
                {/* Animated Background */}
                < motion.div
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
                    }
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-red-600 via-green-600 via-yellow-600 to-red-600 bg-[length:200%_auto]"
                >
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                    {/* Floating Orbs */}
                    <motion.div
                        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    ></motion.div>
                    <motion.div
                        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                    ></motion.div>
                </motion.div >

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-8 py-4 mb-8 text-lg font-bold bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full text-white shadow-2xl"
                        >
                            <Sparkles size={24} />
                            <span className="text-3xl" style={{ letterSpacing: '0.15em' }}>ส่งคำอวยพร</span>
                        </motion.div>

                        <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 text-white drop-shadow-2xl" style={{ letterSpacing: '0.05em' }}>
                            ส่งความสุขถึงทุกคน
                        </h2>

                        <p className="text-2xl md:text-3xl text-white/95 mb-14 leading-relaxed font-medium drop-shadow-lg">
                            อยากส่งคำอวยพรหรือความสุขมาให้เราไหม?
                            <br />
                            เรายินดีรับฟังทุกความรู้สึกดีๆ จากคุณ
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group"
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                                {/* Animated Border */}
                                <motion.div
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-400 via-yellow-400 to-pink-400 bg-[length:200%_auto] rounded-full p-[3px]"
                                >
                                    <div className="w-full h-full bg-white rounded-full"></div>
                                </motion.div>

                                {/* Button Content */}
                                <button
                                    onClick={() => setIsWishModalOpen(true)}
                                    className="relative flex items-center gap-4 px-16 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-2xl rounded-full shadow-2xl overflow-hidden border-4 border-white/40 cursor-pointer"
                                >
                                    {/* Shine Effect */}
                                    <motion.div
                                        animate={{
                                            x: ["-100%", "200%"],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 1,
                                        }}
                                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                    ></motion.div>

                                    {/* Text */}
                                    <span className="text-4xl relative z-10 drop-shadow-lg" style={{ letterSpacing: '0.05em' }}>ส่งข้อความ</span>

                                    {/* Animated Heart */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            rotate: [0, 10, -10, 0],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="relative z-10"
                                    >
                                        <Heart size={25} className="drop-shadow-lg" fill="currentColor" />
                                    </motion.div>

                                    {/* Sparkles */}
                                    <motion.div
                                        animate={{
                                            rotate: 360,
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -top-2 -right-2 text-yellow-300"
                                    >
                                        <Sparkles size={24} fill="currentColor" />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            rotate: -360,
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute -bottom-2 -left-2 text-pink-300"
                                    >
                                        <Sparkles size={20} fill="currentColor" />
                                    </motion.div>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Wishes Display Section */}
            <section className="relative py-32 overflow-hidden">
                {/* Animated Background */}
                <motion.div
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 via-pink-600 to-blue-600 bg-[length:200%_auto]"
                >
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                </motion.div>

                <div className="relative z-10 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-8 py-4 mb-8 text-lg font-bold bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full text-white shadow-2xl"
                        >
                            <Heart size={24} fill="currentColor" />
                            <span className="text-3xl" style={{ letterSpacing: '0.15em' }}>ความสุขจากทุกคน</span>
                            <Heart size={24} fill="currentColor" />
                        </motion.div>

                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white drop-shadow-2xl" style={{ letterSpacing: '0.05em' }}>
                            ข้อความความสุขที่ถูกส่งมา
                        </h2>

                        <p className="text-2xl md:text-3xl text-white/95 leading-relaxed font-medium drop-shadow-lg max-w-3xl mx-auto">
                            แบ่งปันความรู้สึกดีๆ และความอบอุ่นในเทศกาลแห่งความสุขนี้
                        </p>
                    </motion.div>

                    {/* Wishes Carousel */}
                    <WishesCarousel />
                </div>
            </section>

            {/* Wish Modal */}
            <WishModal isOpen={isWishModalOpen} onClose={() => setIsWishModalOpen(false)}>
                <WishForm onSuccess={() => setIsWishModalOpen(false)} />
            </WishModal>
        </main>
    );
}