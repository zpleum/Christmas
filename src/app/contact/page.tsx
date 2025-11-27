"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Github, Facebook, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [captchaToken, setCaptchaToken] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const turnstileRef = useRef<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if captcha token exists
        if (!captchaToken) {
            setSubmitStatus({
                type: 'error',
                message: 'กรุณายืนยันว่าคุณไม่ใช่บอท',
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    captchaToken
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: 'ส่งข้อความสำเร็จ! ผมจะติดต่อกลับเร็วๆ นี้ครับ',
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setCaptchaToken('');

                // Reset Turnstile widget
                if (turnstileRef.current) {
                    turnstileRef.current.reset();
                }

                if (data.mailtoLink) {
                    window.location.href = data.mailtoLink;
                }
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
                });

                // Reset captcha on error
                setCaptchaToken('');
                if (turnstileRef.current) {
                    turnstileRef.current.reset();
                }
            }
        } catch {
            setSubmitStatus({
                type: 'error',
                message: 'เกิดข้อผิดพลาด กรุณาส่งอีเมลถึงผมโดยตรง',
            });

            // Reset captcha on error
            setCaptchaToken('');
            if (turnstileRef.current) {
                turnstileRef.current.reset();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--christmas-gradient-from)] via-[var(--christmas-gradient-via)] to-[var(--christmas-gradient-to)]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-24">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-4"
                >

                    <h1 className="!text-[120px] md:text-6xl lg:text-7xl font-bold">
                        <span className="tracking-wider bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                            ติดต่อเรา
                        </span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Contact Information Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Contact Info Card */}
                        <div className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] shadow-xl">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                ข้อมูลติดต่อ
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Mail className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] mb-1">Email</h3>
                                        <a
                                            href="mailto:wiraphat.makwong@gmail.com"
                                            className="text-[var(--foreground-muted)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                                        >
                                            wiraphat.makwong@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <MapPin className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] mb-1">Location</h3>
                                        <p className="text-[var(--foreground-muted)] text-sm">Thailand</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Facebook className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] mb-1">Facebook</h3>
                                        <a
                                            href="https://www.facebook.com/wiraphat.makwong"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[var(--foreground-muted)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                                        >
                                            Wiraphat Makwong
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 pt-8 border-t border-[var(--border)]">
                                <h3 className="tracking-wider font-semibold text-[var(--foreground)] mb-4 text-3xl">ติดตามเรา</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="https://github.com/zPleum"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all hover:scale-110"
                                    >
                                        <Github size={20} />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/wiraphat.makwong"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[#1877F2] hover:text-white transition-all hover:scale-110"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                    <a
                                        href="https://discord.com/users/837918998242656267"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[#5865F2] hover:text-white transition-all hover:scale-110"
                                    >
                                        <MessageCircle size={20} />
                                    </a>
                                    <a
                                        href="mailto:wiraphat.makwong@gmail.com"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--accent-blue)] hover:text-white transition-all hover:scale-110"
                                    >
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Availability Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="rounded-2xl p-6 border shadow-xl"
                            style={{
                                background: 'linear-gradient(to bottom right, var(--availability-bg-from), var(--availability-bg-to))',
                                borderColor: 'var(--availability-border)'
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                    <span className="w-3 h-3 bg-green-500 rounded-full block animate-pulse"></span>
                                    <span className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                                </div>
                                <span className="font-bold" style={{ color: 'var(--availability-text)' }}>พร้อมรับงาน</span>
                            </div>
                            <p className="text-3xl" style={{ color: 'var(--availability-text-muted)' }}>
                                ปัจจุบันพร้อมรับงานฟรีแลนซ์และงานประจำ
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-[var(--border)] shadow-xl">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                                ส่งข้อความถึงเรา
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-2xl font-semibold text-[var(--foreground)] mb-2">
                                            ชื่อของคุณ
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="text-2xl w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)]"
                                            placeholder="ชื่อ-นามสกุล"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-2xl font-semibold text-[var(--foreground)] mb-2">
                                            อีเมลของคุณ
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)]"
                                            placeholder="example@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-2xl font-semibold text-[var(--foreground)] mb-2">
                                        หัวข้อ
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="text-2xl w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)]"
                                        placeholder="สอบถามเกี่ยวกับโปรเจค"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-2xl font-semibold text-[var(--foreground)] mb-2">
                                        ข้อความ
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="text-2xl w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all resize-none bg-[var(--background)] text-[var(--foreground)]"
                                        placeholder="บอกเล่าเกี่ยวกับโปรเจคของคุณ..."
                                    />
                                </div>

                                {submitStatus.type && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-xl flex items-center gap-3 ${submitStatus.type === 'success'
                                            ? 'bg-green-50 text-green-800 border-2 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800'
                                            : 'bg-red-50 text-red-800 border-2 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800'
                                            }`}
                                    >
                                        {submitStatus.type === 'success' && <CheckCircle2 size={20} />}
                                        <span className="font-medium">{submitStatus.message}</span>
                                    </motion.div>
                                )}

                                {/* Cloudflare Turnstile Captcha */}
                                <div className="flex justify-center">
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                                        onSuccess={(token: string) => setCaptchaToken(token)}
                                        onError={() => {
                                            setCaptchaToken('');
                                            setSubmitStatus({
                                                type: 'error',
                                                message: 'เกิดข้อผิดพลาดในการโหลด Captcha กรุณาลองใหม่อีกครั้ง',
                                            });
                                        }}
                                        onExpire={() => setCaptchaToken('')}
                                        options={{
                                            theme: 'auto',
                                            size: 'normal',
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !captchaToken}
                                    className={`text-4xl w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 ${isSubmitting || !captchaToken ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Contact Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto"
                >
                    <a
                        href="mailto:wiraphat.makwong@gmail.com"
                        className="group bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] hover:shadow-2xl hover:scale-105 transition-all text-center"
                    >
                        <div className="inline-flex p-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Mail className="text-white" size={32} />
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] mb-2 text-lg">Email</h3>
                        <p className="text-3xl text-[var(--foreground-muted)]">ตอบกลับเร็ว</p>
                    </a>

                    <a
                        href="https://www.facebook.com/wiraphat.makwong"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] hover:shadow-2xl hover:scale-105 transition-all text-center"
                    >
                        <div className="inline-flex p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Facebook className="text-white" size={32} />
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] mb-2 text-lg">Facebook</h3>
                        <p className="text-3xl text-[var(--foreground-muted)]">ติดต่อผ่านโซเชียลมีเดีย</p>
                    </a>

                    <a
                        href="https://github.com/zPleum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] hover:shadow-2xl hover:scale-105 transition-all text-center"
                    >
                        <div className="inline-flex p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Github className="text-white" size={32} />
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] mb-2 text-lg">GitHub</h3>
                        <p className="text-3xl text-[var(--foreground-muted)]">ดูผลงานของผม</p>
                    </a>
                </motion.div>
            </main>
        </div>
    );
}
