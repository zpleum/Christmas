"use client";

import { useEffect, useState, useRef } from "react";
import WishCard from "./WishCard";
import type { Wish, WishesResponse } from "@/types/wishes";

export default function WishesCarousel() {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);
    const isHovered = useRef(false);
    const animationFrameId = useRef<number>(0);

    // Fetch wishes
    const fetchWishes = async () => {
        try {
            const response = await fetch("/api/wishes");
            const data: WishesResponse = await response.json();

            if (data.success) {
                setWishes(data.wishes);
            }
        } catch (error) {
            console.error("Error fetching wishes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchWishes();
    }, []);

    // Poll for new wishes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Only poll if page is visible
            if (document.visibilityState === "visible") {
                fetchWishes();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll loop
    useEffect(() => {
        const scrollLoop = () => {
            const el = scrollRef.current;
            if (!el) return;

            // Only auto-scroll if not hovering and not dragging
            if (!isHovered.current && !isDragging.current) {
                el.scrollLeft += 1; // Adjust speed here
            }

            // Infinite scroll logic: if scrolled past half, reset to 0
            // We assume content is duplicated at least once
            if (el.scrollLeft >= el.scrollWidth / 2) {
                el.scrollLeft = 0;
            }

            animationFrameId.current = requestAnimationFrame(scrollLoop);
        };

        // Start loop
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(scrollLoop);

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [wishes]); // Restart loop when wishes change

    // Drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        const el = scrollRef.current;
        if (!el) return;

        isDragging.current = true;
        startX.current = e.pageX - el.offsetLeft;
        scrollLeftStart.current = el.scrollLeft;
        el.style.cursor = 'grabbing';
    };

    const onMouseLeave = () => {
        isDragging.current = false;
        isHovered.current = false;
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };

    const onMouseUp = () => {
        isDragging.current = false;
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();

        const el = scrollRef.current;
        if (!el) return;

        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 2; // Scroll speed multiplier
        el.scrollLeft = scrollLeftStart.current - walk;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                    <p className="mt-4 text-[var(--foreground-muted)]">กำลังโหลดความสุข...</p>
                </div>
            </div>
        );
    }

    if (wishes.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-2xl text-[var(--foreground-muted)]">
                    ยังไม่มีความสุขที่ถูกส่งมา
                    <br />
                    เป็นคนแรกที่แบ่งปันความรู้สึกดีๆ กันเถอะ! 🎄
                </p>
            </div>
        );
    }

    // Duplicate wishes 4 times to ensure smooth infinite scroll on wide screens
    const duplicatedWishes = [...wishes, ...wishes, ...wishes, ...wishes];

    return (
        <div className="relative w-screen overflow-hidden py-8 group fixed left-1/2 -translate-x-1/2">
            {/* Scrolling Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden w-full cursor-grab select-none"
                onMouseEnter={() => (isHovered.current = true)}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                }}
            >
                {duplicatedWishes.map((wish, index) => (
                    <WishCard key={`${wish.id}-${index}`} wish={wish} />
                ))}
            </div>

            {/* Hide scrollbar for Chrome/Safari/Opera */}
            <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
