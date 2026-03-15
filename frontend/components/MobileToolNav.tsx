"use client";

import { motion } from "framer-motion";
import { MessageSquare, LineChart, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { SidebarSection } from "./Sidebar";
import clsx from "clsx";

type Props = {
  activeSection: SidebarSection;
  onSelect: (section: SidebarSection) => void;
};

const items: {
  id: SidebarSection;
  icon: React.ElementType;
  labelKey: "aiAssistant" | "loanPlanner" | "fraudProtection";
}[] = [
  { id: "assistant", icon: MessageSquare, labelKey: "aiAssistant" },
  { id: "fraud", icon: ShieldCheck, labelKey: "fraudProtection" },
  { id: "planner", icon: LineChart, labelKey: "loanPlanner" },
];

export default function MobileToolNav({ activeSection, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 px-4 pb-safe pt-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex flex-col items-center gap-1 py-1 min-w-[64px]"
            >
              <div className={clsx(
                "relative p-2 rounded-xl transition-all duration-300",
                active ? "text-blue-400 bg-blue-500/10" : "text-slate-500 hover:text-slate-300"
              )}>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-blue-500/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
              </div>
              <span className={clsx(
                "text-[10px] font-medium transition-colors duration-300",
                active ? "text-blue-400" : "text-slate-500"
              )}>
                {t[item.labelKey].split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
