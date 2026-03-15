"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* -----------------------------------------------------------------------
   VoiceInputButton
   Uses the Web Speech API (SpeechRecognition) for voice-to-text.
   Gracefully degrades in browsers without support.
----------------------------------------------------------------------- */

type Props = {
  onTranscript: (text: string) => void;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceInputButton({ onTranscript }: Props) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) setSupported(true);
  }, []);

  const toggle = () => {
    if (!supported) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!supported) return null;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`relative p-2.5 rounded-full transition-all duration-200 ${
        listening
          ? "bg-red-500/20 text-red-400 border border-red-500/40"
          : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
      }`}
      title={listening ? "Stop recording" : "Voice input"}
    >
      <AnimatePresence mode="wait">
        {listening ? (
          <motion.span
            key="mic-off"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
          >
            <MicOff className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="mic"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
          >
            <Mic className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>

      {listening && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20 pointer-events-none" />
      )}
    </motion.button>
  );
}
