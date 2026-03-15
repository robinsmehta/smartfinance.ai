"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { motion } from "framer-motion";

const PageContent = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: "Your privacy is important to us. This Privacy Policy explains how SmartFinance.ai collects, uses, and protects your personal information when you use our platform. By using our services, you agree to the collection and use of information in accordance with this policy."
    },
    {
      title: "2. Information We Collect",
      content: "We may collect the following types of information: Name and Email Address (when you contact us), Messages (when you use our financial tools), and Usage Data (anonymous data about how you interact with our platform, such as features used and time spent)."
    },
    {
      title: "3. How We Use Information",
      content: "The information we collect is used to: provide and improve our services, respond to your inquiries and support requests, analyze platform usage to enhance user experience, and ensure the security of our platform."
    },
    {
      title: "4. Data Security",
      content: "We are committed to protecting your data. We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure."
    },
    {
      title: "5. Third-Party Services",
      content: "We may use third-party services, such as AI APIs for our chatbot and analytics tools to understand usage. These third parties have their own privacy policies, and we recommend you review them."
    },
    {
      title: "6. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at privacy@smartfinance.ai."
    }
  ];

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 md:py-32">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-white text-center mb-4 md:mb-6"
      >
        Privacy Policy
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="text-sm md:text-base text-slate-300 text-center max-w-2xl mx-auto mb-10 md:mb-12"
      >
        Learn how SmartFinance.ai handles your data, keeps your information secure, and uses third-party services to power the experience.
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

export default function PrivacyPolicyPage() {
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
