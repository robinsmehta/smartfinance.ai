"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-10 mt-auto bg-[#0f172a] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-6 text-sm text-slate-400">
          <a
            href="/terms"
            className="hover:text-blue-400 transition-colors duration-300 relative group"
          >
            {t.termsConditions}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <span className="text-slate-700">|</span>
          <a
            href="/privacy"
            className="hover:text-cyan-400 transition-colors duration-300 relative group"
          >
            {t.privacyPolicy}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <p className="text-slate-500 text-sm font-light">
          {t.footerCopyright}
        </p>
      </div>
    </footer>
  );
}
