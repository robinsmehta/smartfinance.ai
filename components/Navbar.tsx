"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { labelKey: "aboutUs" as const, href: "/#about" },
    { labelKey: "contactUs" as const, href: "/#contact" },
    { labelKey: "terms" as const, href: "/#terms" },
    { labelKey: "privacy" as const, href: "/#privacy" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled
          ? "bg-[#0f172a]/80 backdrop-blur-md border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-full px-6 md:px-8 flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
              SmartFinance
            </span>
            <span className="font-light text-slate-300">.ai</span>
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="relative group hover:text-white transition-colors duration-300"
            >
              {t[link.labelKey]}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          <LanguageToggle />

          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
            >
              {t.tryAI}
            </motion.button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
          <button className="text-slate-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
