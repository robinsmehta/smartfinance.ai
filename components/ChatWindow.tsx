"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I am SmartFinance AI. I can help you understand loans, savings, interest, and other financial decisions. How can I assist you today?",
  },
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "That's a great question about personal finance. Let me explain that in simple terms...",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto w-full border border-white/5 bg-[#0f172a]/50 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden mt-24 mb-6">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-slate-900/50">
        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <Bot className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-200">Financial Assistant</h2>
          <p className="text-xs text-cyan-400">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={clsx(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={clsx(
                  "flex gap-3 max-w-[85%] md:max-w-[75%]",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={clsx(
                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border",
                    msg.role === "user"
                      ? "bg-slate-800 border-slate-700"
                      : "bg-blue-600/10 border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.1)]"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                <div
                  className={clsx(
                    "px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-[0_4px_14px_rgba(37,99,235,0.2)]"
                      : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-4 md:px-6 md:py-6 bg-slate-900/60 border-t border-white/5">
        <form
          onSubmit={handleSend}
          className="relative flex items-center bg-slate-800/50 rounded-full border border-slate-700 focus-within:border-blue-500/50 focus-within:bg-slate-800 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all duration-300 p-1"
        >
          <button
            type="button"
            className="p-3 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about loans, savings, interest..."
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 placeholder:text-slate-500 text-sm md:text-base px-2 py-3"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim()}
            className="p-3 m-1 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
