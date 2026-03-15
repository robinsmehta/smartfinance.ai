"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const PageContent = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="py-24 md:py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-2xl mx-auto text-slate-300 text-sm md:text-base"
        >
          We’d love to hear from you. Whether you have a question, feedback, or need assistance, feel free to reach out.
        </motion.p>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-900/70 border border-slate-700/80 rounded-2xl p-8 md:p-9 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">Send a Message</h3>
              <p className="text-xs md:text-sm text-slate-400 mb-6">
                Share your questions, feedback, or support requests and our team will get back to you as soon as possible.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">Name</label>
                  <input type="text" id="name" className="w-full bg-slate-800/60 border border-slate-600/80 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70" placeholder="Your Name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">Email</label>
                  <input type="email" id="email" className="w-full bg-slate-800/60 border border-slate-600/80 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">Subject</label>
                  <input type="text" id="subject" className="w-full bg-slate-800/60 border border-slate-600/80 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70" placeholder="Question about loans" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">Message</label>
                  <textarea id="message" rows={4} className="w-full bg-slate-800/60 border border-slate-600/80 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70" placeholder="Your message..."></textarea>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-full shadow-lg shadow-blue-600/40 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 mt-8 md:mt-0 max-w-md md:max-w-none"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white">Contact Information</h3>
            <div>
              <h4 className="font-semibold text-slate-300">Email</h4>
              <a href="mailto:support@smartfinance.ai" className="text-blue-400 hover:text-blue-300 transition-colors">text@smartfinance.ai</a>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300">Location</h4>
              <p className="text-slate-400">Kathmandu, Nepal</p>
            </div>
             <div>
              <h4 className="font-semibold text-slate-300">Office Hours</h4>
              <p className="text-slate-400">Sunday - Friday, 9 AM - 5 PM (NPT)</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};


export default function ContactPage() {
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
