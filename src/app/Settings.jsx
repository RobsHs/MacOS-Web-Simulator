import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/Appstore";
import { FiSun, FiMoon, FiVolume2, FiImage, FiMonitor, FiHardDrive, FiHelpCircle, FiSliders, FiCheck, FiUpload, FiLink, FiLock } from "react-icons/fi";
import { playPopSound } from "../utils/soundEffects";

// Overview Tab Content
const OverviewTab = () => (
  <div className="flex items-start gap-8 py-8 px-8 justify-center max-w-2xl mx-auto">
    {/* macOS Logo */}
    <div className="shrink-0">
      <img 
        src="https://www.iclarified.com/images/news/97556/465566/465566.jpg" 
        alt="macOS Sequoia" 
        className="w-28 h-28 rounded-full object-cover shadow-xl border border-white/10"
      />
    </div>

    {/* System Information */}
    <div className="flex-1 text-xs">
      <h1 className="text-2xl font-bold text-white mb-0.5">macOS RobsHs</h1>
      <p className="text-white/50 text-xs mb-5">Version 15.3 RobsHs Edition (Build 26R01)</p>

      <div className="space-y-2">
        <div className="flex">
          <span className="text-white/50 w-28">MacBook Pro</span>
          <span className="text-white/90 font-medium">16-inch, RobsHs Special Edition</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Chip</span>
          <span className="text-white/90 font-medium">Apple M4 Pro (14 cores)</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Memory</span>
          <span className="text-white/90 font-medium">36 GB Unified Memory</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Startup Disk</span>
          <span className="text-white/90 font-medium">Macintosh HD</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Display</span>
          <span className="text-white/90 font-medium">Liquid Retina XDR (3456 × 2234)</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Graphics</span>
          <span className="text-white/90 font-medium">20-Core Metal 3 GPU</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Serial Number</span>
          <span className="text-white/90 font-mono">ROBS-HS24-M4PRO</span>
        </div>
      </div>
    </div>
  </div>
);

// Appearance Tab
const AppearanceTab = () => {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const [accent, setAccent] = useState("blue");

  const colors = [
    { id: "multicolor", bg: "bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500" },
    { id: "blue", bg: "bg-blue-500" },
    { id: "purple", bg: "bg-purple-500" },
    { id: "pink", bg: "bg-pink-500" },
    { id: "red", bg: "bg-red-500" },
    { id: "orange", bg: "bg-orange-500" },
    { id: "yellow", bg: "bg-yellow-400" },
    { id: "green", bg: "bg-emerald-500" },
    { id: "graphite", bg: "bg-gray-400" },
  ];

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 text-xs text-white">
      <div>
        <h3 className="font-semibold text-sm mb-3">Appearance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => {
              if (isDarkMode) toggleDarkMode();
            }}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              !isDarkMode ? "border-blue-500 bg-white/10 ring-2 ring-blue-500/30" : "border-white/10 hover:bg-white/5"
            }`}
          >
            <div className="w-16 h-10 rounded-md bg-[#ececec] border border-gray-300 flex items-center justify-center text-gray-800">
              <FiSun className="w-5 h-5 text-amber-500" />
            </div>
            <span className="font-medium">Light</span>
          </div>

          <div
            onClick={() => {
              if (!isDarkMode) toggleDarkMode();
            }}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              isDarkMode ? "border-blue-500 bg-white/10 ring-2 ring-blue-500/30" : "border-white/10 hover:bg-white/5"
            }`}
          >
            <div className="w-16 h-10 rounded-md bg-[#18181b] border border-white/20 flex items-center justify-center text-white">
              <FiMoon className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-medium">Dark</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10">
        <h3 className="font-semibold text-sm mb-3">Accent Color</h3>
        <div className="flex items-center gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setAccent(c.id);
                playPopSound();
              }}
              className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                accent === c.id ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-neutral-900" : "hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Displays Tab Content
const DisplaysTab = () => {
  const brightness = useAppStore((s) => s.brightness);
  const setBrightness = useAppStore((s) => s.setBrightness);

  return (
    <div className="py-6 px-8 max-w-xl mx-auto space-y-6 text-xs text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-56 h-32 bg-linear-to-br from-blue-600/30 to-purple-600/30 rounded-lg border border-white/20 flex items-center justify-center shadow-lg">
          <div className="w-44 h-24 bg-neutral-900 rounded border border-white/10 flex items-center justify-center">
            <span className="text-white/60 text-[11px]">Built-in Display</span>
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-sm">Liquid Retina XDR Display</h3>
          <p className="text-white/50 text-[11px]">3456 × 2234 Native Resolution @ 120Hz (ProMotion)</p>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-white/10">
        <div>
          <div className="flex justify-between items-center mb-1.5 font-medium">
            <span>Brightness</span>
            <span className="text-white/60">{brightness}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <span>Automatically adjust brightness</span>
          <input type="checkbox" defaultChecked className="toggle-checkbox accent-blue-500 w-4 h-4 cursor-pointer" />
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <span>True Tone</span>
          <input type="checkbox" defaultChecked className="toggle-checkbox accent-blue-500 w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// Wallpaper Tab (Desktop & Lock Screen Manager)
const WallpaperTab = () => {
  const [currentDesktopWp, setCurrentDesktopWp] = useState(() => {
    return localStorage.getItem("desktop_wallpaper") || "/Wallpaper/GoldenGate_6k.png";
  });
  const [currentLockWp, setCurrentLockWp] = useState(() => {
    return localStorage.getItem("lockscreen_wallpaper") || "/Wallpaper/GoldenGate_6k.png";
  });

  const [target, setTarget] = useState("both"); // "both" | "lockscreen" | "desktop"
  const [customUrl, setCustomUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef(null);

  const wallpapers = [
    { id: "sonoma-light", name: "macOS Sonoma Light", category: "Sonoma", src: "/Wallpaper/macOS-Sonoma-light.jpg" },
    { id: "sonoma-dark", name: "macOS Sonoma Dark", category: "Sonoma", src: "/Wallpaper/macOS-Sonomaa-dark.jpg" },
    { id: "tahoe-6k", name: "macOS Tahoe 6K", category: "Tahoe", src: "/Wallpaper/26-Tahoe-Light-6K-thumb.jpeg" },
    { id: "tahoe-beach", name: "Lake Tahoe Beach", category: "Tahoe", src: "/Wallpaper/26-Tahoe-Beach-Dawn-thumb.jpeg" },
    { id: "goldengate-day", name: "Golden Gate 6K Day", category: "Golden Gate", src: "/Wallpaper/GoldenGate_6k.png" },
    { id: "goldengate-night", name: "Golden Gate 6K Night", category: "Golden Gate", src: "/Wallpaper/Golden_Dark_6k.png" },
    { id: "bigsur-day", name: "macOS Big Sur 6K Day", category: "Big Sur", src: "/Wallpaper/11-0-Big-Sur-Day-6k.jpg" },
    { id: "bigsur-night", name: "Big Sur Mountains Night", category: "Big Sur", src: "/Wallpaper/big-sur-mountains-night-dark-macos-big-sur-stock-california-6016x6016-1493.jpg" },
    { id: "ventura-light", name: "macOS Ventura Light", category: "Ventura", src: "/Wallpaper/13-Ventura-Light.jpg" },
    { id: "catalina-dark", name: "macOS Catalina Dark", category: "Catalina", src: "/Wallpaper/macOS-Catalina-Dark-Mode.jpg" },
    { id: "macbook-air", name: "MacBook Air Graphic", category: "Abstract", src: "/Wallpaper/15-inch-MacBook-Air-wallpaper-1.webp" },
    { id: "ferrari-f1", name: "Scuderia Ferrari F1", category: "Motorsport", src: "/Wallpaper/formula-1-formula-cars-ferrari-ferrari-f1-ferrari-formula-1-hd-wallpaper-79f662068bca0f4ad0cb02dae8b765b3.jpg" },
  ];

  const applyWallpaper = (src) => {
    playPopSound();

    if (target === "both" || target === "lockscreen") {
      localStorage.setItem("lockscreen_wallpaper", src);
      setCurrentLockWp(src);
      window.dispatchEvent(new CustomEvent("lockscreenWallpaperChanged", { detail: src }));
    }

    if (target === "both" || target === "desktop") {
      localStorage.setItem("desktop_wallpaper", src);
      setCurrentDesktopWp(src);
      window.dispatchEvent(new CustomEvent("wallpaperChanged", { detail: src }));
    }

    const label = target === "both" 
      ? "Desktop & Lock Screen" 
      : target === "lockscreen" 
        ? "Lock Screen" 
        : "Desktop";
    setStatusMessage(`Wallpaper ${label} berhasil diperbarui!`);
    setTimeout(() => setStatusMessage(""), 2800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      applyWallpaper(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    applyWallpaper(customUrl.trim());
    setCustomUrl("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5 text-xs text-white">
      {/* Dual Preview Cards (macOS Sequoia / Sonoma Settings Style) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Lock Screen Preview */}
        <div 
          onClick={() => {
            setTarget("lockscreen");
            playPopSound();
          }}
          className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all cursor-pointer ${
            target === "lockscreen" || target === "both" 
              ? "border-blue-500 bg-white/10 shadow-lg ring-2 ring-blue-500/20" 
              : "border-white/10 hover:border-white/30 bg-white/5"
          }`}
        >
          <div className="aspect-16/10 w-full rounded-xl overflow-hidden relative shadow-md bg-neutral-900 border border-white/10">
            <img src={currentLockWp} alt="Lock Screen Wallpaper" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
              <span className="text-[14px] font-semibold tracking-tight text-white/95 leading-none shadow-sm">08:55</span>
              <span className="text-[8px] text-white/80 font-medium tracking-wide">Minggu, 18 Oktober</span>
              <div className="w-4 h-4 rounded-full bg-white/30 border border-white/40 mt-1.5" />
            </div>
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-black/60 text-white/90 backdrop-blur-xs flex items-center gap-1">
              <FiLock size={8} />
              <span>Lock Screen</span>
            </div>
          </div>
          <span className="font-semibold text-xs text-white/90">Layar Terkunci</span>
        </div>

        {/* Desktop Preview */}
        <div 
          onClick={() => {
            setTarget("desktop");
            playPopSound();
          }}
          className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all cursor-pointer ${
            target === "desktop" || target === "both" 
              ? "border-blue-500 bg-white/10 shadow-lg ring-2 ring-blue-500/20" 
              : "border-white/10 hover:border-white/30 bg-white/5"
          }`}
        >
          <div className="aspect-16/10 w-full rounded-xl overflow-hidden relative shadow-md bg-neutral-900 border border-white/10">
            <img src={currentDesktopWp} alt="Desktop Wallpaper" className="w-full h-full object-cover" />
            {/* Mini Menu Bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-black/40 backdrop-blur-xs flex items-center px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
            {/* Mini Dock */}
            <div className="absolute bottom-1 inset-x-4 h-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 rounded-sm bg-blue-400" />
              <div className="w-1.5 h-1.5 rounded-sm bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />
            </div>
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-black/60 text-white/90 backdrop-blur-xs flex items-center gap-1">
              <FiMonitor size={8} />
              <span>Desktop</span>
            </div>
          </div>
          <span className="font-semibold text-xs text-white/90">Desktop</span>
        </div>
      </div>

      {/* Target Selector Buttons */}
      <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-white/70 font-medium pl-1">Terapkan Perubahan Ke:</span>
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg">
          <button
            onClick={() => {
              setTarget("both");
              playPopSound();
            }}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
              target === "both" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            Keduanya
          </button>
          <button
            onClick={() => {
              setTarget("lockscreen");
              playPopSound();
            }}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
              target === "lockscreen" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            Lock Screen Saja
          </button>
          <button
            onClick={() => {
              setTarget("desktop");
              playPopSound();
            }}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
              target === "desktop" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            Desktop Saja
          </button>
        </div>
      </div>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-1.5">
            <FiCheck className="text-emerald-400" />
            <span>{statusMessage}</span>
          </span>
        </div>
      )}

      {/* Custom Upload & Custom URL Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition border border-white/15 cursor-pointer shadow-sm text-xs shrink-0"
        >
          <FiUpload size={13} />
          <span>Unggah dari Komputer</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <form onSubmit={handleCustomUrlSubmit} className="w-full flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus-within:border-blue-500 transition">
            <FiLink size={12} className="text-white/50" />
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Masukkan link gambar kustom..."
              className="w-full bg-transparent outline-none text-white placeholder-white/40 font-sans text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-medium text-xs transition cursor-pointer shrink-0"
          >
            Terapkan
          </button>
        </form>
      </div>

      {/* Official macOS Wallpapers Catalog */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-white">Koleksi Wallpaper macOS Resmi</h3>
          <span className="text-[11px] text-white/50">Klik untuk langsung menerapkan</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1">
          {wallpapers.map((wp) => {
            const isLockActive = currentLockWp === wp.src;
            const isDesktopActive = currentDesktopWp === wp.src;
            const isFullyActive = isLockActive && isDesktopActive;

            return (
              <div
                key={wp.id}
                onClick={() => applyWallpaper(wp.src)}
                className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer shadow-md flex flex-col ${
                  isFullyActive || (target === "lockscreen" && isLockActive) || (target === "desktop" && isDesktopActive)
                    ? "border-blue-500 ring-2 ring-blue-500/40 shadow-blue-500/20 scale-102"
                    : "border-white/10 hover:border-white/40 hover:scale-101"
                }`}
              >
                <div className="aspect-16/10 w-full relative bg-black/40 overflow-hidden">
                  <img
                    src={wp.src}
                    alt={wp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {(isLockActive || isDesktopActive) && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <FiCheck size={12} />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/60 text-white/90 backdrop-blur-xs">
                    {wp.category}
                  </span>
                </div>
                <div className="p-2 bg-neutral-900/90 backdrop-blur-xs">
                  <div className="text-[11px] font-medium text-white truncate">{wp.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Storage Tab Content
const StorageTab = () => (
  <div className="py-6 px-8 max-w-xl mx-auto space-y-4 text-xs text-white">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-neutral-700 flex items-center justify-center text-xl shadow-md border border-white/10">
        💾
      </div>
      <div>
        <h3 className="font-semibold text-sm">Macintosh HD</h3>
        <p className="text-white/50 text-[11px]">682.4 GB available of 1 TB SSD</p>
      </div>
    </div>

    {/* Storage Usage Bar */}
    <div className="w-full h-6 bg-neutral-700 rounded-md overflow-hidden flex border border-white/10">
      <div className="h-full bg-blue-500 w-[14%]" title="macOS (42 GB)"></div>
      <div className="h-full bg-yellow-500 w-[12%]" title="Applications (96 GB)"></div>
      <div className="h-full bg-purple-500 w-[10%]" title="Developer (64 GB)"></div>
      <div className="h-full bg-pink-500 w-[8%]" title="Photos & Media (48 GB)"></div>
      <div className="h-full bg-emerald-500 w-[6%]" title="System (32 GB)"></div>
      <div className="h-full bg-neutral-600 flex-1" title="Available (682 GB)"></div>
    </div>

    {/* Legend */}
    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
        <span className="text-white/70">macOS (42 GB)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <span className="text-white/70">Apps (96 GB)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
        <span className="text-white/70">Developer (64 GB)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
        <span className="text-white/70">Media (48 GB)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
        <span className="text-white/70">System (32 GB)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-500"></div>
        <span className="text-white/50">Free (682 GB)</span>
      </div>
    </div>
  </div>
);

// Sound Tab Content
const SoundTab = () => {
  const volume = useAppStore((s) => s.volume);
  const setVolume = useAppStore((s) => s.setVolume);

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 text-xs text-white">
      <h3 className="font-semibold text-sm mb-3">Sound Output</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1.5 font-medium">
            <span>Output Volume</span>
            <span className="text-white/60">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <div className="font-medium">MacBook Pro Speakers</div>
            <div className="text-[11px] text-white/50">Built-in High-Fidelity 6-Speaker Sound System</div>
          </div>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <span>Play user interface sound effects</span>
          <input type="checkbox" defaultChecked className="toggle-checkbox accent-blue-500 w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "General", icon: <FiSliders /> },
    { id: "appearance", label: "Appearance", icon: <FiSun /> },
    { id: "wallpaper", label: "Wallpaper", icon: <FiImage /> },
    { id: "displays", label: "Displays", icon: <FiMonitor /> },
    { id: "sound", label: "Sound", icon: <FiVolume2 /> },
    { id: "storage", label: "Storage", icon: <FiHardDrive /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "appearance":
        return <AppearanceTab />;
      case "wallpaper":
        return <WallpaperTab />;
      case "displays":
        return <DisplaysTab />;
      case "sound":
        return <SoundTab />;
      case "storage":
        return <StorageTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]/95 backdrop-blur-2xl flex flex-col rounded-b-xl overflow-hidden select-none font-sans">
      {/* Tab Bar */}
      <div className="flex justify-center gap-1 pt-2 pb-2 bg-black/20 border-b border-white/10 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              playPopSound();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white/20 text-white shadow-sm font-semibold"
                : "text-white/60 hover:text-white/90 hover:bg-white/5"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}
