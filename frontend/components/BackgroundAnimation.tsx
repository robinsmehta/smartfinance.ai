"use client";

import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0f1e]">
      {/* Dark navy background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] opacity-90 z-0"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-10 
      before:absolute before:inset-0 before:bg-[size:4rem_4rem] before:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-600/20 blur-[60px] md:blur-[100px] mix-blend-screen z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-cyan-500/10 blur-[80px] md:blur-[120px] mix-blend-screen z-10"
      />

      <div className="hidden md:block">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[30%] left-[60%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[90px] mix-blend-screen z-10"
        />
      </div>
    </div>
  );
}
