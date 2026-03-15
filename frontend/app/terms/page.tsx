"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { motion } from "framer-motion";

const PageContent = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By using SmartFinance.ai, you agree to these Terms and Conditions. If you do not agree, please discontinue use of the platform.",
    },
    {
      title: "2. Use of the Platform",
      content:
        "Our tools are provided for educational and informational purposes only. They do not constitute financial, legal, or tax advice. Always consult a qualified professional before making major financial decisions.",
    },
    {
      title: "3. No Financial Responsibility",
      content:
        "SmartFinance.ai does not guarantee the accuracy, completeness, or suitability of any information or calculations provided. You are solely responsible for any decisions made based on information from the platform.",
    },
    {
      title: "4. User Responsibilities",
      content:
        "You agree not to misuse the platform, attempt unauthorized access, or interfere with the normal operation of our services.",
    },
    {
      title: "5. Changes to These Terms",
      content:
        "We may update these Terms from time to time. Continued use of the platform after changes means you accept the updated Terms.",
    },
    {
      title: "6. Contact",
      content:
        "If you have questions about these Terms, please contact us at support@smartfinance.ai.",
    },
  ];

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 md:py-32">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-white text-center mb-4 md:mb-6"
      >
        Terms & Conditions
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="text-sm md:text-base text-slate-300 text-center max-w-2xl mx-auto mb-10 md:mb-12"
      >
        Please review these terms carefully to understand the scope of our services, your responsibilities, and how SmartFinance.ai is intended to be used.
      </motion.p>

      <div className="bg-slate-900/70 border border-slate-700/80 rounded-2xl p-8 md:p-12 space-y-8 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            <h2 className="text-lg md:text-2xl font-semibold text-blue-400 mb-2 md:mb-3">{section.title}</h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function TermsPage() {
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
