import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiX, FiSend } from "react-icons/fi";
import { useAppStore } from "../store/Appstore";

export default function Siri({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("What can I help you with?");
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef(null);
  const openApp = useAppStore((s) => s.openApp);
  const toggleAudio = useAppStore((s) => s.toggleAudio);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResponse("What can I help you with?");
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    setIsThinking(true);
    setResponse("");

    setTimeout(() => {
      let reply = "";
      if (q.includes("weather")) {
        reply = "It's currently 72°F and sunny in Cupertino with a light breeze.";
      } else if (q.includes("time")) {
        reply = `The time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
      } else if (q.includes("joke")) {
        reply = "Why do programmers prefer dark mode? Because light attracts bugs!";
      } else if (q.includes("who are you") || q.includes("your name")) {
        reply = "I'm Siri, your intelligent assistant built into macOS.";
      } else if (q.includes("music") || q.includes("play song")) {
        reply = "Playing your favourite tracks on Apple Music.";
        toggleAudio();
      } else if (q.includes("open safari") || q.includes("browse")) {
        reply = "Opening Safari.";
        window.dispatchEvent(new CustomEvent("os_open_app_request", { detail: { appId: "Safari" } }));
      } else if (q.includes("terminal")) {
        reply = "Opening Terminal.";
        window.dispatchEvent(new CustomEvent("os_open_app_request", { detail: { appId: "Terminal" } }));
      } else if (q.includes("calculator") || q.includes("calc")) {
        reply = "Opening Calculator.";
        window.dispatchEvent(new CustomEvent("os_open_app_request", { detail: { appId: "Calculator" } }));
      } else {
        reply = `I found some interesting information about "${query}" on the web.`;
      }

      setResponse(reply);
      setIsThinking(false);
      speak(reply);
      setQuery("");
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999999] flex items-end justify-end p-8 bg-black/10 select-none pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="w-[360px] rounded-3xl bg-[#1c1c1e]/90 text-white backdrop-blur-3xl border border-white/20 shadow-2xl p-5 flex flex-col space-y-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Siri Glow Orb Animation */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 blur-[6px] animate-spin" style={{ animationDuration: "3s" }}></div>
                <div className="relative w-6 h-6 rounded-full bg-linear-to-tr from-cyan-300 via-purple-400 to-pink-500 shadow-lg"></div>
              </div>
              <span className="font-semibold text-sm tracking-wide">Siri</span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white/70 transition-colors"
            >
              <FiX />
            </button>
          </div>

          {/* Response Bubble */}
          <div className="min-h-[64px] flex items-center justify-center text-center px-3 py-2 bg-black/30 rounded-2xl border border-white/5">
            {isThinking ? (
              <div className="flex items-center gap-1.5 py-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            ) : (
              <p className="text-sm font-light text-white/90 leading-relaxed">{response}</p>
            )}
          </div>

          {/* Input Prompt */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-2 border border-white/10">
            <FiMic className="w-4 h-4 text-white/60" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Siri anything..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-white/40"
            />
            {query && (
              <button type="submit" className="text-blue-400 hover:text-blue-300 transition-colors">
                <FiSend className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

