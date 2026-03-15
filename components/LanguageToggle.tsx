"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-full p-1 gap-1">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          lang === "en"
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setLang("np")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          lang === "np"
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "text-slate-400 hover:text-white"
        }`}
      >
        नेपाली
      </motion.button>
    </div>
  );
}
