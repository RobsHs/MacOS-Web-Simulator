import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/Appstore";
import { FiPlus, FiX } from "react-icons/fi";

export default function MissionControl({ isOpen, onClose }) {
  const windows = useAppStore((s) => s.windows);
  const focusApp = useAppStore((s) => s.focusApp);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const closeApp = useAppStore((s) => s.closeApp);

  if (!isOpen) return null;

  const handleSelectWindow = (win) => {
    if (win.minimized) {
      restoreApp(win.id);
    }
    focusApp(win.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999998] bg-black/60 backdrop-blur-2xl flex flex-col p-8 select-none"
        onClick={onClose}
      >
        {/* Top Space Bar (Spaces / Desktops) */}
        <div className="flex items-center justify-center gap-4 py-2 shrink-0">
          <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-2xl border border-white/15 shadow-xl">
            <div className="px-4 py-2 rounded-xl bg-blue-500/40 text-white font-semibold text-xs border border-blue-400/50 shadow-inner">
              Desktop 1
            </div>
            <div className="px-4 py-2 rounded-xl hover:bg-white/10 text-white/70 font-medium text-xs transition-colors cursor-pointer">
              Desktop 2
            </div>
            <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 transition-colors">
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Windows Grid View (Exposé) */}
        <div className="flex-1 flex items-center justify-center p-6">
          {windows.length === 0 ? (
            <div className="text-center text-white/50 space-y-2">
              <div className="text-2xl font-light">No Open Windows</div>
              <div className="text-xs text-white/40">Open an application from the Dock or Spotlight</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
              {windows.map((win) => (
                <motion.div
                  key={win.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectWindow(win);
                  }}
                  className="group relative rounded-2xl bg-[#1c1c1e]/90 border border-white/20 p-3 shadow-2xl cursor-pointer hover:border-blue-400/80 transition-all flex flex-col h-[220px]"
                >
                  {/* Window Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-semibold text-xs text-white/90 truncate flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      {win.appId}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeApp(win.id);
                      }}
                      className="w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Window Mockup Preview */}
                  <div className="flex-1 rounded-xl bg-black/40 mt-2 flex flex-col items-center justify-center overflow-hidden relative border border-white/5">
                    <div className="text-3xl opacity-80 mb-2">🖥️</div>
                    <span className="text-xs text-white/60 font-medium">Click to focus</span>
                    {win.minimized && (
                      <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        Minimized
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="text-center text-xs text-white/40 pb-2">
          Press <kbd className="font-semibold text-white/60">Esc</kbd> or click anywhere to exit Mission Control
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

