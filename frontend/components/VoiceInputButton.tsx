"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { apiSTT } from "@/lib/api";

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
  const [processing, setProcessing] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR || (typeof window !== "undefined" && navigator.mediaDevices)) setSupported(true);
  }, []);

  const startNativeSpeech = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return false;

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    return true;
  };

  const startAdvancedSpeech = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
        
        setProcessing(true);
        try {
          const res = await apiSTT(file);
          if (res.text) onTranscript(res.text);
        } catch (err) {
          console.error("STT error:", err);
        } finally {
          setProcessing(false);
        }
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      return true;
    } catch (err) {
      console.error("Mic access error:", err);
      return false;
    }
  };

  const toggle = async () => {
    if (!supported) return;

    if (listening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      } else if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setListening(false);
      return;
    }

    // Try Native Speech first (fastest)
    const success = startNativeSpeech();
    if (!success) {
      // Fallback to Server-side STT via MediaRecorder
      const advSuccess = await startAdvancedSpeech();
      if (advSuccess) setListening(true);
    } else {
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={processing}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`relative p-2.5 rounded-full transition-all duration-200 ${
        listening
          ? "bg-red-500/20 text-red-400 border border-red-500/40"
          : processing
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
      }`}
      title={listening ? "Stop recording" : processing ? "Processing..." : "Voice input"}
    >
      <AnimatePresence mode="wait">
        {processing ? (
          <motion.span key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.span>
        ) : listening ? (
          <motion.span key="mic-off" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
            <MicOff className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span key="mic" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
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
