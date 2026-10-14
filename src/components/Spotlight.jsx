import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiArrowRight, FiCommand, FiFolder, FiFile, FiCheck } from "react-icons/fi";
import { useAppStore } from "../store/Appstore";

// Import app components
import { Safari } from "../app/Safari";
import Spotify from "../app/Spotify";
import Settings from "../app/Settings";
import MacGallery from "../app/Gallary";
import Finder from "../app/Finder";
import Blogs from "../app/Blogs/BlogsSection";
import Messages from "../app/Messages";
import Mail from "../app/Mail";
import Maps from "../app/Maps";
import FaceTime from "../app/FaceTime";
import PhoneApp from "../app/Phone";
import CalendarApp from "../app/Calendar";
import ContactsApp from "../app/Contacts";
import RemindersApp from "../app/Reminders";
import Terminal from "../app/Terminal";
import Calculator from "../app/Calculator";
import AboutThisMac from "../app/AboutThisMac";
import VSCode from "../app/VSCode";
import Launchpad from "../app/Launchpad";
import Trash from "../app/Trash";

export default function Spotlight({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedResult, setCopiedResult] = useState(false);
  const inputRef = useRef(null);

  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);

  const allApps = [
    {
      id: "Finder",
      title: "Finder",
      subtitle: "System File Manager",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
    },
    {
      id: "Launchpad",
      title: "Launchpad",
      subtitle: "View All Applications",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Launchpad__MacOS_Tahoe__ncy8MiCAOA_lowResPng-ffd58d03cd.png",
      comp: <Launchpad />,
    },
    {
      id: "Safari",
      title: "Safari",
      subtitle: "Web Browser",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Safari__MacOS_Tahoe__utug9Rt8g6_lowResPng-e86f84b6e9.png",
      comp: <Safari />,
    },
    {
      id: "VSCode",
      title: "Visual Studio Code",
      subtitle: "Code Editing & Web Development",
      icon: "/icons/vscode.svg",
      comp: <VSCode />,
    },
    {
      id: "Terminal",
      title: "Terminal",
      subtitle: "Command Line zsh",
      icon: "/icons/terminal.svg",
      comp: <Terminal />,
    },
    {
      id: "Calculator",
      title: "Calculator",
      subtitle: "Standard & Scientific Calculator",
      icon: "/icons/calculator.svg",
      comp: <Calculator />,
    },
    {
      id: "Messages",
      title: "Messages",
      subtitle: "iMessage & Conversations",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Messages_macOS_Golden_Gate_ow94O6GAvP-2934473a5d.png",
      comp: <Messages />,
    },
    {
      id: "Mail",
      title: "Mail",
      subtitle: "Email Accounts & Inbox",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Mail_macOS_Golden_Gate_3BIjmD3GZM-ae5977fd03.png",
      comp: <Mail />,
    },
    {
      id: "Maps",
      title: "Maps",
      subtitle: "World Navigation & Real-time Location",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Maps_macOS_Golden_Gate_jOxvDFgSHw-b6ceac8cd4.png",
      comp: <Maps />,
    },
    {
      id: "Photos",
      title: "Photos",
      subtitle: "Photo Library & Wallpapers",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Photos_macOS_Golden_Gate_mxVHKSuSHM-06d7e83102.png",
      comp: <MacGallery />,
    },
    {
      id: "FaceTime",
      title: "FaceTime",
      subtitle: "Video & Audio Calls",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Facetime_macOS_Golden_Gate_Qxnt8DtlwP-e0839d42d8.png",
      comp: <FaceTime />,
    },
    {
      id: "Phone",
      title: "Phone",
      subtitle: "Phone Calls & Keypad",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Phone_macOS_Golden_Gate_NWKA493TFf-bffc4d8efc.png",
      comp: <PhoneApp />,
    },
    {
      id: "Calendar",
      title: "Calendar",
      subtitle: "Schedules & Events",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Calender_25y2FI4DUz_lowResPng-d649f6c721.png",
      comp: <CalendarApp />,
    },
    {
      id: "Contacts",
      title: "Contacts",
      subtitle: "Address Book",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Contacts_macOS_Golden_Gate_oKWnz3UDu6-20ba74faaf.png",
      comp: <ContactsApp />,
    },
    {
      id: "Notes",
      title: "Notes",
      subtitle: "iCloud Notes & Writing",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Notes__MacOS_Tahoe__Tn8SuaHtAM_lowResPng-632fb908b1.png",
      comp: <Blogs />,
    },
    {
      id: "Reminders",
      title: "Reminders",
      subtitle: "Tasks & To-Do Lists",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Reminders_macOS_Golden_Gate_EVBkfKEpyn-b296bae148.png",
      comp: <RemindersApp />,
    },
    {
      id: "Music",
      title: "Music",
      subtitle: "Spotify & Audio Player",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Music_macOS_Golden_Gate_LJox0IObSI-d626e3640a.png",
      comp: <Spotify />,
    },
    {
      id: "Settings",
      title: "System Settings",
      subtitle: "Preferences & System Configuration",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
      comp: <Settings />,
    },
    {
      id: "AboutThisMac",
      title: "About This Mac",
      subtitle: "Apple M4 Pro Hardware Overview",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      comp: <AboutThisMac />,
    },
    {
      id: "Trash",
      title: "Trash",
      subtitle: "Bin & Deleted Files",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png",
      comp: <Trash />,
    },
  ];

  // Try math evaluation
  const evaluateMath = (expr) => {
    try {
      const sanitized = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**");
      if (/^[\d\s+\-*/().%^eE]+$/.test(sanitized)) {
        // Safe math evaluator using Function with restricted scope
        const res = Function(`"use strict"; return (${sanitized})`)();
        if (typeof res === "number" && !isNaN(res) && isFinite(res)) {
          return res;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const mathResult = query.trim() ? evaluateMath(query.trim()) : null;

  // Filter apps
  const filteredApps = query.trim()
    ? allApps.filter(
        (app) =>
          app.title.toLowerCase().includes(query.toLowerCase()) ||
          app.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : allApps;

  // Desktop files search
  const desktopFiles = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
  const filteredFiles = query.trim()
    ? desktopFiles.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Combine items for navigation
  const results = [];
  if (mathResult !== null) {
    results.push({ type: "math", value: mathResult });
  }
  filteredApps.forEach((app) => results.push({ type: "app", data: app }));
  filteredFiles.forEach((f) => results.push({ type: "file", data: f }));

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setCopiedResult(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const launchItem = (item) => {
    if (!item) return;
    if (item.type === "math") {
      navigator.clipboard.writeText(String(item.value));
      setCopiedResult(true);
      setTimeout(() => {
        onClose();
      }, 600);
      return;
    }
    if (item.type === "app") {
      const existing = windows.find((w) => w.appId === item.data.id);
      if (existing) {
        if (existing.minimized) restoreApp(existing.id);
        focusApp(existing.id);
      } else {
        openApp(item.data.id, item.data.comp);
      }
      onClose();
      return;
    }
    if (item.type === "file") {
      openApp("Finder", <Finder initialPath="/desktop" />);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        launchItem(results[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999999] flex items-start justify-center pt-28 bg-black/30 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="w-[640px] max-w-[90vw] rounded-2xl bg-[#1c1c1e]/90 text-white backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.18)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-white/10">
          <FiSearch className="w-5 h-5 text-white/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            className="w-full bg-transparent border-none outline-none text-xl font-light text-white placeholder-white/35 caret-blue-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-xs text-white/40 hover:text-white px-2 py-0.5 rounded-full bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
          {/* Math calculation result preview */}
          {mathResult !== null && (
            <div
              onClick={() => launchItem({ type: "math", value: mathResult })}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                selectedIndex === 0 ? "bg-blue-600 text-white" : "hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
                  =
                </div>
                <div>
                  <div className="text-xl font-medium tracking-tight">
                    {Number(mathResult).toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60">Calculation Result (Click to copy)</div>
                </div>
              </div>
              {copiedResult ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <FiCheck /> Copied
                </span>
              ) : (
                <span className="text-xs opacity-60">Press ↵</span>
              )}
            </div>
          )}

          {/* Section: Applications */}
          {filteredApps.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-white/40 px-3 py-1.5 uppercase tracking-wider">
                Applications
              </div>
              {filteredApps.map((app, idx) => {
                const itemIndex = (mathResult !== null ? 1 : 0) + idx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={app.id}
                    onClick={() => launchItem({ type: "app", data: app })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-600 text-white" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon}
                        alt=""
                        className="w-8 h-8 rounded-lg object-contain shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{app.title}</div>
                        <div className="text-xs text-white/60">{app.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-white/80 flex items-center gap-1">
                        Open <FiArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: Files */}
          {filteredFiles.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-semibold text-white/40 px-3 py-1.5 uppercase tracking-wider">
                Documents & Files
              </div>
              {filteredFiles.map((file, idx) => {
                const itemIndex = (mathResult !== null ? 1 : 0) + filteredApps.length + idx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={file.id}
                    onClick={() => launchItem({ type: "file", data: file })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-600 text-white" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiFile className="w-6 h-6 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-white/60">Desktop Document</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-white/80 flex items-center gap-1">
                        Show in Finder <FiArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {results.length === 0 && (
            <div className="py-8 text-center text-sm text-white/40">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center justify-between text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span>↑ ↓ to navigate</span>
            <span>↵ to open</span>
            <span>esc to close</span>
          </div>
          <div>Spotlight</div>
        </div>
      </motion.div>
    </div>
  );
}

