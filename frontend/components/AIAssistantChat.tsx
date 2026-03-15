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

const quickSuggestions = [
  "What is EMI?",
  "How do home loans work?",
  "How to avoid banking scams?",
  "Best way to save money",
  "How do digital wallets work?",
  "What documents for education loan?",
];

const aiKnowledgeBase: { pattern: RegExp; response: string }[] = [
  {
    pattern: /emi|equated monthly/i,
    response:
      "**EMI (Equated Monthly Installment)** is a fixed payment amount paid by a borrower to a lender each month. It covers both principal and interest.\n\n**Formula:** EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1]\n\nWhere P = principal, r = monthly interest rate, n = number of months.\n\n💡 *Village analogy:* Imagine borrowing rice from a neighbor and returning a little extra each month until the full amount is paid back.",
  },
  {
    pattern: /home loan|house loan|mortgage/i,
    response:
      "**Home Loans** allow you to buy property by borrowing money from a bank.\n\n**Key points:**\n• Down payment: Typically 20-30% of property value\n• Tenure: Up to 20-25 years\n• Interest rates in Nepal: ~9-12% per annum\n• Required docs: Citizenship, income proof, land ownership certificate\n\n💡 Most Nepal banks offer home loans up to NPR 1.5 Crore for salaried individuals.",
  },
  {
    pattern: /scam|fraud|fake|phishing|otp.*ask|click.*link/i,
    response:
      "🚨 **Stay Alert from Financial Scams!**\n\n**Red flags:**\n• Asking for OTP, PIN, or password — banks NEVER do this\n• Prize/lottery claims requiring fees\n• Urgent calls claiming your account is frozen\n• Unknown links in SMS or WhatsApp\n\n**If suspicious:** Hang up, block the number, and call your bank's official helpline directly.",
  },
  {
    pattern: /digital wallet|esewa|khalti|imepay|fonepay|mobile payment/i,
    response:
      "**Digital Wallets in Nepal** let you pay without cash.\n\n**Popular options:**\n• **eSewa** - Most widely used, Pay bills, transfer money\n• **Khalti** - Great for online shopping and ticketing\n• **IMEPay** - Linked to IME remittance\n• **FonePay** - QR-based payments at merchants\n\n💡 These apps are safe if you keep your PIN private and never share OTPs.",
  },
  {
    pattern: /save|saving|savings|emergency fund/i,
    response:
      "**Smart Savings Strategy:**\n\n1. **50-30-20 Rule:** 50% needs, 30% wants, 20% savings\n2. **Emergency Fund:** Save 3-6 months of expenses first\n3. **Fixed Deposits in Nepal:** 8-10% annual interest — better than standard savings (5-6%)\n4. **Recurring Deposit (Bachat Khata):** Auto-debit monthly — great for discipline\n\n💡 *Start small.* Even NPR 2,000/month becomes NPR 24,000 in a year!",
  },
  {
    pattern: /compound interest|compounding/i,
    response:
      "**Compound Interest** is interest earned on both the principal AND previously accumulated interest.\n\n**Simple Interest:** NPR 10,000 at 10% = NPR 1,000/year every year\n**Compound Interest:** NPR 10,000 at 10% compounded = NPR 1,000 → NPR 1,100 → NPR 1,210 (growing each year)\n\n💡 *Village analogy:* Like a mango tree — it grows mangoes, and those mangoes grow more trees, which grow more mangoes!\n\n**Rule of 72:** Divide 72 by interest rate = years to double money. At 8%, money doubles in 9 years!",
  },
  {
    pattern: /remittance|send money|abroad|foreign|विदेश/i,
    response:
      "**Sending/Receiving Remittance to Nepal:**\n\n**Receiving:** IME, Western Union, MoneyGram, or directly to bank accounts\n**Digital:** Wise, Remitly offer lower fees than traditional services\n\n**Tips:**\n• Always verify exchange rates — they vary widely\n• NRN (Non-Resident Nepali) accounts at banks offer convenience\n• Large amounts may need SWIFT transfer through your bank\n\n💡 Nepal receives ~NPR 1.2 trillion in remittances annually — it's a huge part of the economy!",
  },
  {
    pattern: /education loan|student loan|padhai|college/i,
    response:
      "**Education Loan in Nepal:**\n\n**Eligible for:** School fees, college/university, abroad studies\n\n**Required documents:**\n• Citizenship certificate\n• Admission letter from institution\n• Fee structure\n• Guardian/co-borrower income proof\n• Academic certificates\n\n**Nepal SBI Bank, Rastriya Banijya Bank** and most commercial banks offer education loans at 9-12% interest.\n\n💡 For studying abroad, you may need proof of visa and enrollment at a recognized foreign university.",
  },
  {
    pattern: /interest rate|bank rate|fd rate/i,
    response:
      "**Current Nepal Interest Rate Overview (approx):**\n\n| Type | Rate |\n|------|------|\n| Savings Account | 5–7% |\n| Fixed Deposit (1yr) | 8–10% |\n| Home Loan | 9–12% |\n| Personal Loan | 12–18% |\n| Education Loan | 9–12% |\n\n💡 Nepal Rastra Bank (NRB) sets the base rate that commercial banks follow. Check your specific bank for current rates.",
  },
];

function getAIResponse(input: string): string {
  for (const { pattern, response } of aiKnowledgeBase) {
    if (pattern.test(input)) return response;
  }
  return "That's an insightful financial question! The key to good financial decisions is understanding your income, expenses, and goals.\n\n**General advice:**\n• Track every rupee you spend for one month\n• Build an emergency fund before investing\n• Only borrow what your income can comfortably repay\n• Diversify savings across bank FDs and safe instruments\n\nCould you be more specific? I can help with loans, savings, interest rates, digital payments, or scam protection.";
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderMessage(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-bold text-white mb-1">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith("• ")) {
      return <p key={i} className="ml-2 text-slate-300">• {line.slice(2)}</p>;
    }
    if (line.startsWith("💡")) {
      return <p key={i} className="text-cyan-400 text-xs mt-2 italic">{line}</p>;
    }
    if (line.startsWith("🚨")) {
      return <p key={i} className="text-red-400 font-semibold">{line}</p>;
    }
    const boldInline = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="text-slate-200" dangerouslySetInnerHTML={{ __html: boldInline }} />;
  });
}

export default function AIAssistantChat() {
  const { t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: t.welcomeMessage, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: getAIResponse(text), timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <div className="flex flex-col h-full">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className={clsx("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={clsx("flex gap-3 max-w-[82%] md:max-w-[70%]", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={clsx("flex-shrink-0 h-8 w-8 mt-1 rounded-full flex items-center justify-center border text-xs", msg.role === "user" ? "bg-slate-700 border-slate-600" : "bg-blue-600/10 border-blue-500/30")}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-blue-400" />}
                </div>
                <div className={clsx("flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className={clsx("px-4 py-3 rounded-2xl text-sm leading-relaxed space-y-1", msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20" : "bg-slate-800 rounded-tl-sm border border-slate-700/50")}>
                    {msg.role === "assistant" ? renderMessage(msg.content) : <p>{msg.content}</p>}
                  </div>
                  <span className="text-[10px] text-slate-600 px-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center"><Bot className="w-4 h-4 text-blue-400" /></div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-4 py-2 border-t border-white/5">
        <p className="text-[10px] text-slate-500 mb-2">{t.quickSuggestions}</p>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((q) => (
            <motion.button
              key={q}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(q)}
              className="px-3 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500/50 hover:text-blue-300 transition-all"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-slate-900/60 border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex items-center bg-slate-800/50 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-300 p-1.5">
          <VoiceInputButton onTranscript={(txt) => setInput((prev) => prev + txt)} />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.chatPlaceholder} className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-500 text-sm px-3 py-2" />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} type="submit" disabled={!input.trim()} className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20">
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-2">SmartFinance AI may make mistakes. Verify important financial decisions.</p>
      </div>
    </div>
  );
}
