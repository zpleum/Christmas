"use client";

import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, Facebook } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [showThemeTip, setShowThemeTip] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Show tip after 1.5 seconds
    const timer = setTimeout(() => {
      setShowThemeTip(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismissTip = () => {
    setShowThemeTip(false);
  };

  const navItems = [
    { name: "หน้าหลัก", href: "/" },
    { name: "ติดต่อ", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] py-3 shadow-sm"
          : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`text-4xl font-bold tracking-tight font-[family-name:var(--font-sov-rangbab)] transition-colors duration-300 ${isScrolled ? "text-[var(--foreground)]/80" : "text-white"
              }`}
          >
            Wiraphat
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-4xl font-medium transition-colors duration-300 ${pathname === item.href
                  ? "text-[var(--primary)] font-semibold"
                  : isScrolled
                    ? "text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                    : "text-white hover:text-[var(--primary)]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* Social & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://github.com/zPleum"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${isScrolled
                  ? "text-[var(--foreground)]/70 hover:text-[var(--primary)]"
                  : "text-white hover:text-[var(--primary)]"
                  }`}
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/wiraphat-makwong"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${isScrolled
                  ? "text-[var(--foreground)]/70 hover:text-[var(--primary)]"
                  : "text-white hover:text-[var(--primary)]"
                  }`}
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.facebook.com/wiraphat.makwong"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${isScrolled
                  ? "text-[var(--foreground)]/70 hover:text-[#1877F2]"
                  : "text-white hover:text-[#1877F2]"
                  }`}
              >
                <Facebook size={20} />
              </a>
            </div>

            {/* Divider */}
            <div
              className={`hidden md:block w-px h-6 transition-colors ${isScrolled ? "bg-[var(--border)]" : "bg-white/70"
                }`}
            ></div>

            {/* Theme Toggle */}
            <div className="hidden md:block relative">
              <ThemeToggle scrolled={isScrolled} />

              {/* Theme Tip Popup */}
              <AnimatePresence>
                {showThemeTip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-full right-0 mt-4 w-72 p-4 bg-[var(--background)] border-[var(--background-muted)] rounded-2xl shadow-xl border z-50"
                  >
                    {/* Arrow */}
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-[var(--background)] border-[var(--background-muted)] border-t border-l transform rotate-45"></div>

                    <div className="relative z-10">
                      <p className="text-3xl tracking-wider text-[var(--foreground)] mb-3 font-medium">
                        คุณสามารถลองเปลี่ยนทีมได้ที่นี่ !
                      </p>
                      <button
                        onClick={handleDismissTip}
                        className="text-3xl px-3 py-1.5 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-hover)] transition-colors font-medium w-full"
                      >
                        เข้าใจแล้ว
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger button */}
            <div className="relative md:hidden">
              <button
                ref={hamburgerRef}
                className="p-2 rounded-md transition-colors hover:bg-[var(--muted)]"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} className={`${isScrolled ? "text-[var(--foreground)]/80" : "text-white"}`} />
              </button>

              {/* Tip fixed under hamburger, aligned to the left side of the screen */}
              <AnimatePresence>
                {showThemeTip && hamburgerRef.current && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      position: "fixed",
                      top: hamburgerRef.current.getBoundingClientRect().bottom + 8,
                      left: hamburgerRef.current.getBoundingClientRect().right - 240 - 4,
                      width: 240,
                    }}
                    className="bg-[var(--background)] border border-[var(--background-muted)] px-4 py-3 rounded-xl shadow-lg z-50"
                  >
                    <div
                      className="absolute -top-2 w-4 h-4 bg-[var(--background)] border-r border-t border-[var(--background-muted)] transform rotate-45"
                      style={{
                        right: 18,
                      }}
                    ></div>

                    <p className="text-2xl text-[var(--foreground)] font-medium mb-2 text-center">
                      คลิกที่นี่เพื่อเปิดเมนู
                    </p>
                    <button
                      onClick={handleDismissTip}
                      className="text-xl w-full py-2 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-hover)] transition"
                    >
                      เข้าใจแล้ว
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--background)] shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-[var(--border)]">
                <span className="font-bold text-lg text-[var(--foreground)]">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-3 px-4 text-4xl font-medium rounded-lg transition-colors ${pathname === item.href
                      ? "text-[var(--primary)] font-semibold"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="p-6 border-t border-[var(--border)]">
                <div className="flex flex-col gap-4">
                  {/* Social Links */}
                  <div className="flex justify-center gap-6">
                    <a
                      href="https://github.com/zPleum"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    >
                      <Github size={24} />
                    </a>
                    <a
                      href="https://linkedin.com/in/wiraphat-makwong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    >
                      <Linkedin size={24} />
                    </a>
                    <a
                      href="mailto:contact@zpleum.site"
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    >
                      <Mail size={24} />
                    </a>
                    <a
                      href="https://www.facebook.com/wiraphat.makwong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)]/70 hover:text-[#1877F2] transition-colors"
                    >
                      <Facebook size={24} />
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-[var(--border)]"></div>

                  {/* Theme Toggle */}
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-3">
                      {/* ส่ง prop scrolled: ถ้า light mode ให้เป็น true */}
                      <ThemeToggle className="" scrolled={true} />

                      {showThemeTip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="md:hidden w-full bg-[var(--background)] border border-[var(--background-muted)] px-4 py-4 rounded-xl shadow-lg"
                        >
                          <p className="text-2xl text-[var(--foreground)] font-medium mb-3 text-center">
                            คุณสามารถลองเปลี่ยนธีมได้ที่นี่ !
                          </p>
                          <button
                            onClick={handleDismissTip}
                            className="text-xl w-full py-2 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-hover)] transition"
                          >
                            เข้าใจแล้ว
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
