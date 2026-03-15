"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { motion } from "framer-motion";
import { ShieldCheck, Bot, TrendingUp, Calculator } from "lucide-react";

const PageContent = () => {
  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          About Our Platform
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-2xl mx-auto text-slate-300 text-sm md:text-base"
        >
          We are dedicated to empowering individuals with the financial knowledge and tools they need to make informed decisions and secure their financial future.
        </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900/70 border border-slate-700/70 rounded-2xl p-8 md:p-10 shadow-[0_18px_45px_rgba(15,23,42,0.8)]">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-4">Our Mission</h2>
            <p className="text-center text-slate-300 leading-relaxed text-sm md:text-base">
              Our mission is to make financial knowledge accessible, help users avoid scams, and provide simple yet powerful tools for planning loans and savings. We believe everyone deserves a chance to achieve financial well-being.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-6 md:mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Bot, title: "Smart Financial Explainer", desc: "AI-powered chat to answer your financial questions." },
              { icon: Calculator, title: "Loan Eligibility Simulator", desc: "Simulate loans and check your affordability." },
              { icon: ShieldCheck, title: "Financial Scam Detector", desc: "Analyze messages for potential scams." },
              { icon: TrendingUp, title: "Savings Goal Planner", desc: "Plan and visualize your path to your savings goals." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-slate-900/70 border border-slate-700/80 rounded-2xl p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,0.85)]"
              >
                <item.icon className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-900/70 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-6">Why Choose Us</h2>
          <ul className="space-y-4 text-slate-300 text-sm md:text-base">
            {[
              "Simple and intuitive financial tools for everyone.",
              "AI-powered insights to guide your financial decisions.",
              "A secure and privacy-focused platform you can trust.",
              "Easy-to-use interface designed for clarity and speed.",
            ].map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="leading-relaxed">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <motion.a
          href="/chat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-blue-600/40 hover:bg-blue-500 transition-colors text-sm md:text-base"
        >
          Get Started
        </motion.a>
      </section>
    </div>
  );
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col relative w-full overflow-hidden bg-slate-900">
      <BackgroundAnimation />
      <Navbar />
      <div className="flex-1 w-full">
        <PageContent />
      </div>
      <Footer />
    </main>
  );
}
