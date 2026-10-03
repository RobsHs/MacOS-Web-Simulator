import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/Appstore";

export default function ForceQuit({ isOpen, onClose }) {
  const windows = useAppStore((s) => s.windows);
  const closeApp = useAppStore((s) => s.closeApp);
  const [selectedWinId, setSelectedWinId] = useState(null);

  if (!isOpen) return null;

  const handleForceQuit = () => {
    if (selectedWinId) {
      closeApp(selectedWinId);
      setSelectedWinId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/40 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-[380px] rounded-2xl bg-[#282828]/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl p-5 flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Force Quit Applications</h2>
          <p className="text-xs text-white/60 leading-relaxed">
            If an app doesn’t respond for a while, select its name and click Force Quit.
          </p>
        </div>

        {/* Running Apps List */}
        <div className="h-44 rounded-xl bg-black/40 border border-white/10 p-1.5 overflow-y-auto space-y-0.5">
          {windows.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-white/40">
              No active applications
            </div>
          ) : (
            windows.map((win) => (
              <div
                key={win.id}
                onClick={() => setSelectedWinId(win.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  selectedWinId === win.id
                    ? "bg-blue-600 text-white font-medium"
                    : "hover:bg-white/10 text-white/90"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>{win.appId}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleForceQuit}
            disabled={!selectedWinId}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
              selectedWinId
                ? "bg-red-500 hover:bg-red-600 text-white active:scale-95 cursor-pointer"
                : "bg-red-500/30 text-white/40 cursor-not-allowed"
            }`}
          >
            Force Quit
          </button>
        </div>
      </motion.div>
    </div>
  );
}

