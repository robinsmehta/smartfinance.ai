"use client";

import { motion } from "framer-motion";
import { MessageSquare, LineChart, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export type SidebarSection =
  | "assistant"
  | "planner"
  | "fraud";

type Props = {
  activeSection: SidebarSection;
  onSelect: (section: SidebarSection) => void;
};

const items: {
  id: SidebarSection;
  icon: React.ElementType;
  labelKey:
    | "aiAssistant"
    | "loanPlanner"
    | "fraudProtection";
  accent: string;
}[] = [
  { id: "assistant", icon: MessageSquare, labelKey: "aiAssistant", accent: "from-blue-500/80 to-cyan-400/80" },
  { id: "fraud", icon: ShieldCheck, labelKey: "fraudProtection", accent: "from-red-500/80 to-amber-400/80" },
  { id: "planner", icon: LineChart, labelKey: "loanPlanner", accent: "from-emerald-500/80 to-cyan-400/80" },
];

export default function Sidebar({ activeSection, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex w-72 flex-col px-4 py-5">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 rounded-3xl bg-slate-950/60 border border-white/10 shadow-[0_18px_50px_rgba(15,23,42,0.9)] backdrop-blur-2xl flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-4 pb-3 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
            SmartFinance.ai
          </p>
          <p className="text-xs text-slate-400">
            Trusted AI tools for everyday finance.
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: active ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(item.id)}
                className={`group relative w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/15 via-slate-900/90 to-transparent border border-white/10 shadow-[0_0_40px_rgba(56,189,248,0.35)]"
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  />
                )}

                <div className="relative flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900/80 border border-slate-700/70 flex items-center justify-center flex-shrink-0">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-300"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="relative text-xs font-semibold tracking-tight">
                      {t[item.labelKey]}
                    </span>
                    {active && (
                      <span className="relative text-[10px] text-cyan-300/80">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {active && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className={`relative ml-auto h-5 w-1 rounded-full bg-gradient-to-b ${item.accent}`}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/5 text-[10px] text-slate-500">
          SmartFinance.ai does not provide legal or tax advice. Always verify
          critical decisions with a professional.
        </div>
      </motion.div>
    </aside>
  );
}
