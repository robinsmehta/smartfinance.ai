"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Sidebar, { SidebarSection } from "@/components/Sidebar";
import MobileToolNav from "@/components/MobileToolNav";
import AIAssistantChat from "@/components/AIAssistantChat";
import PersonalFinanceAnalyzer from "@/components/PersonalFinanceAnalyzer";
import ScamProtection from "@/components/ScamProtection";
import { useLanguage } from "@/lib/LanguageContext";

const sectionMeta: Record<
  SidebarSection,
  { titleKey: "aiAssistant" | "loanPlanner" | "fraudProtection"; sub: string }
> = {
  assistant: {
    titleKey: "aiAssistant",
    sub: "Chat with an AI guide about loans, savings, banking, and scams.",
  },
  fraud: {
    titleKey: "fraudProtection",
    sub: "Scan messages and screenshots for fraud and scam risks.",
  },
  planner: {
    titleKey: "loanPlanner",
    sub: "Analyze cash flow, project savings growth, and get smart loan suggestions.",
  },
};

export default function ChatPage() {
  const [activeSection, setActiveSection] = useState<SidebarSection>("assistant");
  const { t } = useLanguage();

  const meta = sectionMeta[activeSection] ?? sectionMeta["assistant"];

  return (
    <main className="relative w-full h-screen flex flex-col overflow-hidden">
      <BackgroundAnimation />
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-[64px] md:pt-[72px]">
        <Sidebar activeSection={activeSection} onSelect={setActiveSection} />

        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]/70 backdrop-blur-md">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-slate-900/40 flex items-center justify-between gap-3 flex-shrink-0">
            <div>
              <h1 className="text-xs md:text-base font-semibold text-slate-100 leading-tight">
                {t[meta.titleKey]}
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 max-w-xl truncate md:whitespace-normal">
                {meta.sub}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative mb-[70px] md:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 overflow-auto no-scrollbar"
              >
                {activeSection === "assistant" && <AIAssistantChat />}
                {activeSection === "fraud" && <ScamProtection />}
                {activeSection === "planner" && <PersonalFinanceAnalyzer />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <MobileToolNav activeSection={activeSection} onSelect={setActiveSection} />
    </main>
  );
}
