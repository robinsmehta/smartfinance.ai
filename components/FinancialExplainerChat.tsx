"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useLanguage } from "@/lib/LanguageContext";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const aiResponses: Record<string, string> = {
  loan: "A loan is an amount borrowed from a bank or financial institution that you repay with interest over time. In Nepal, interest rates typically range from 8–18% per annum depending on the type of loan. Before taking a loan, ensure your monthly EMI doesn't exceed 40% of your monthly income.",
  savings:
    "Saving regularly is the foundation of financial health. Even saving 10% of your monthly income consistently can build a significant emergency fund within 6 months. In Nepal, consider opening a recurring deposit account for automated saving with better returns than a standard savings account.",
  interest:
    "Interest is the cost of borrowing money or the reward for saving it. Interest rate types include: Simple Interest (applied on original principal only) and Compound Interest (applied on principal + accumulated interest). Compound interest grows faster — a key principle of long-term wealth building.",
  scam: "Common financial scams include prize winning schemes, fake investment opportunities, and phishing for OTPs. Remember: legitimate banks will NEVER ask for your OTP, PIN, or password over call, SMS, or email. Always verify by calling the bank's official number.",
  default:
    "That's a thoughtful financial question. The key is to understand your income, expenses, and financial goals clearly. I recommend tracking your monthly spending, building a 3-month emergency fund, and only investing in instruments you understand. What specific aspect would you like to explore further?",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("loan") || lower.includes("borrow")) return aiResponses.loan;
  if (lower.includes("saving") || lower.includes("save")) return aiResponses.savings;
  if (lower.includes("interest") || lower.includes("rate")) return aiResponses.interest;
  if (lower.includes("scam") || lower.includes("fraud") || lower.includes("otp"))
    return aiResponses.scam;
  return aiResponses.default;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function FinancialExplainerChat() {
  const { t } = useLanguage();

  const initialMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: t.welcomeMessage,
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input.trim();
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(query),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={clsx(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={clsx(
                  "flex gap-3 max-w-[80%] md:max-w-[70%]",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={clsx(
                    "flex-shrink-0 h-8 w-8 mt-1 rounded-full flex items-center justify-center border text-xs font-bold",
                    msg.role === "user"
                      ? "bg-slate-700 border-slate-600 text-slate-200"
                      : "bg-blue-600/10 border-blue-500/30 text-blue-400"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div className={clsx(msg.role === "user" ? "items-end" : "items-start", "flex flex-col gap-1")}>
                  <div
                    className={clsx(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20"
                        : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/50"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-600 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-4 bg-slate-900/60 border-t border-white/5">
        <form
          onSubmit={sendMessage}
          className="flex items-center bg-slate-800/50 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-300 p-1.5"
        >
          <VoiceInputButton onTranscript={(txt) => setInput((prev) => prev + txt)} />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-500 text-sm px-3 py-2"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors flex items-center justify-center shadow-md shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-2">
          SmartFinance AI may make mistakes. Verify important financial decisions.
        </p>
      </div>
    </div>
  );
}
