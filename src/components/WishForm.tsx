"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, Loader2 } from "lucide-react";
import type { WishFormData, WishSubmitResponse } from "@/types/wishes";

interface WishFormProps {
    onSuccess: () => void;
}

export default function WishForm({ onSuccess }: WishFormProps) {
    const [formData, setFormData] = useState<WishFormData>({
        name: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: "" });

        try {
            const response = await fetch("/api/wishes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data: WishSubmitResponse = await response.json();

            if (data.success) {
                setStatus({
                    type: "success",
                    message: data.message,
                });
                setFormData({ name: "", message: "" });

                // Close modal after short delay
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                setStatus({
                    type: "error",
                    message: data.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const nameLength = formData.name.length;
    const messageLength = formData.message.length;

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="inline-flex items-center gap-3 mb-4"
                >
                    <Heart className="text-red-500" size={32} fill="currentColor" />
                    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                        ส่งความสุขถึงกัน
                    </h2>
                    <Heart className="text-pink-500" size={32} fill="currentColor" />
                </motion.div>
                <p className="text-xl text-[var(--foreground-muted)]">
                    แบ่งปันความรู้สึกดีๆ ในเทศกาลแห่งความสุขนี้
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-lg font-semibold text-[var(--foreground)] mb-2"
                    >
                        ชื่อของคุณ
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-red-500 focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)] text-lg"
                        placeholder="ชื่อ-นามสกุล"
                    />
                    <div className="mt-1 text-sm text-[var(--foreground-muted)] text-right">
                        {nameLength}/100
                    </div>
                </div>

                {/* Message Textarea */}
                <div>
                    <label
                        htmlFor="message"
                        className="block text-lg font-semibold text-[var(--foreground)] mb-2"
                    >
                        ข้อความความสุข
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        maxLength={500}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-green-500 focus:outline-none transition-all resize-none bg-[var(--background)] text-[var(--foreground)] text-lg"
                        placeholder="แบ่งปันความรู้สึกดีๆ ของคุณ..."
                    />
                    <div className="mt-1 text-sm text-[var(--foreground-muted)] text-right">
                        {messageLength}/500
                    </div>
                </div>

                {/* Status Message */}
                {status.type && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-center font-medium ${status.type === "success"
                                ? "bg-green-50 text-green-800 border-2 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800"
                                : "bg-red-50 text-red-800 border-2 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800"
                            }`}
                    >
                        {status.message}
                    </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.message}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ${isSubmitting || !formData.name || !formData.message
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:from-red-700 hover:to-pink-700"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            <span>กำลังส่ง...</span>
                        </>
                    ) : (
                        <>
                            <span>ส่งความสุข</span>
                            <Send size={24} />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
