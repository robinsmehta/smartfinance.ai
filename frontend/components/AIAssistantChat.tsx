"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import VoiceInputButton from "@/components/VoiceInputButton";
import { useLanguage } from "@/lib/LanguageContext";
import { apiChat } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function RenderMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-4 mx-1 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mt-3 mx-1 mb-2 border-b border-slate-700/50 pb-1" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-blue-300 mt-3 mx-1 mb-1" {...props} />,
        p: ({ node, ...props }) => <p className="text-sm text-slate-200 leading-relaxed mx-1 mb-2 last:mb-0" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 space-y-1 mb-3 text-slate-200" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 space-y-1 mb-3 text-slate-200" {...props} />,
        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-slate-400" {...props} />,
        code: ({ node, ...props }) => <code className="bg-slate-900/50 px-1 py-0.5 rounded text-cyan-300 text-xs font-mono" {...props} />,
        img: ({ node, src, alt, ...props }) => (
          <img 
            src={src} 
            alt={alt} 
            className="w-full max-w-sm rounded-xl border border-slate-700 shadow-md my-3 mx-auto" 
            {...props} 
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function AIAssistantChat() {
  const { t, lang } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: t.welcomeMessage, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isSending = useRef(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isSending.current) return;
    
    isSending.current = true;
    const msgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userMsg: Message = { id: msgId, role: "user", content: text.trim(), timestamp: new Date() };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    try {
      const res = await apiChat(text, lang);
      const aiMsg: Message = { 
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
        role: "assistant", 
        content: res.reply, 
        timestamp: new Date() 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const displayErr = err?.message || "Sorry, I am having trouble connecting to my brain. Please check your internet or try again later.";
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Error: ${displayErr}`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
      isSending.current = false;
    }
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
                  <div className={clsx("px-4 py-3 rounded-2xl text-sm", msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20" : "bg-slate-800 rounded-tl-sm border border-slate-700/50 min-w-[200px]")}>
                    {msg.role === "assistant" ? <RenderMessage content={msg.content} /> : <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
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
