import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import { 
  FiArrowRight, 
  FiPower, 
  FiRotateCcw, 
  FiMoon
} from "react-icons/fi";
import { BsFillPlayFill, BsFillPauseFill, BsFillSkipForwardFill, BsFillSkipBackwardFill } from "react-icons/bs";
import { playPopSound, playUnlockSound } from "../utils/soundEffects";

// macOS Style Wifi Icon
const MacWifiIcon = () => (
  <svg width="17" height="13" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" className="text-white/90">
    <circle cx="12" cy="18" r="1.8" fill="currentColor" stroke="none" />
    <path d="M8.5 14.5a5 5 0 0 1 7 0" />
    <path d="M5 11a10 10 0 0 1 14 0" />
    <path d="M1.5 7.5a15 15 0 0 1 21 0" />
  </svg>
);

// macOS Style Battery Icon (Full with %)
const MacBatteryIcon = () => (
  <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium select-none">
    <span className="text-[11px] font-mono">100%</span>
    <svg width="24" height="12" viewBox="0 0 26 13" fill="none" className="text-white/90">
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor" />
      <path d="M24 4.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

export default function LockScreen({ goNext, isLocked, setStage }) {
  const isAudioPlaying = useAppStore((state) => state.isAudioPlaying);
  const currentTrack = useAppStore((state) => state.currentTrack);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const nextTrack = useAppStore((state) => state.nextTrack);
  const prevTrack = useAppStore((state) => state.prevTrack);
  const windows = useAppStore((state) => state.windows);
  
  const isMusicOpen = windows.some((w) => w.appId === "Music");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [time, setTime] = useState(new Date());

  // Wallpaper State (Managed via Settings > Wallpaper)
  const [lockscreenWallpaper, setLockscreenWallpaper] = useState(() => {
    return localStorage.getItem("lockscreen_wallpaper") || "/Wallpaper/GoldenGate_6k.png";
  });

  // User Profile State
  const [username] = useState(() => localStorage.getItem("lock_username") || "RobsHs");
  const [profilePhoto] = useState(() => {
    return localStorage.getItem("lock_profile_photo") || "https://avatars.githubusercontent.com/u/181097688?v=4";
  });

  // Password Input State
  const [passwordInput, setPasswordInput] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const passwordInputRef = useRef(null);

  // Reset when locked
  useEffect(() => {
    if (isLocked) {
      setIsUnlocking(false);
      setPasswordInput("");
    }
  }, [isLocked]);

  // Sync wallpaper with Settings changes
  useEffect(() => {
    const handleWallpaperChange = (e) => {
      const newWp = e.detail || localStorage.getItem("lockscreen_wallpaper");
      if (newWp) setLockscreenWallpaper(newWp);
    };

    window.addEventListener("lockscreenWallpaperChanged", handleWallpaperChange);
    window.addEventListener("storage", (e) => {
      if (e.key === "lockscreen_wallpaper" && e.newValue) {
        setLockscreenWallpaper(e.newValue);
      }
    });

    return () => {
      window.removeEventListener("lockscreenWallpaperChanged", handleWallpaperChange);
    };
  }, []);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus password input automatically
  useEffect(() => {
    if (isLocked) {
      passwordInputRef.current?.focus();
    }
  }, [isLocked]);

  // Global keydown: any typing focuses password input
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!isLocked) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.activeElement !== passwordInputRef.current) {
        passwordInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isLocked]);

  // Sync Music player
  useEffect(() => {
    if (!isAudioPlaying) return;
    const interval = setInterval(() => {
      const audioEl = document.querySelector("audio");
      if (audioEl) {
        setCurrentTime(audioEl.currentTime);
        setDuration(audioEl.duration || 0);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isAudioPlaying, currentTrack?.title]);

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRemainingTime = (secs, dur) => {
    if (isNaN(secs) || isNaN(dur) || dur === 0) return "-0:00";
    const diff = Math.max(0, dur - secs);
    const m = Math.floor(diff / 60);
    const s = Math.floor(diff % 60);
    return `-${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleUnlock = useCallback(() => {
    playUnlockSound();
    setIsUnlocking(true);
    setTimeout(() => {
      goNext();
    }, 420);
  }, [goNext]);

  const handleSubmitPassword = (e) => {
    if (e) e.preventDefault();
    const requiredPassword = localStorage.getItem("lock_password") || "";
    if (passwordInput === requiredPassword || requiredPassword === "") {
      setIsWrongPassword(false);
      handleUnlock();
    } else {
      setIsWrongPassword(true);
      setPasswordInput("");
      setTimeout(() => setIsWrongPassword(false), 500);
    }
  };

  // Date & Time Formatting (Authentic macOS Sequoia style)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let formattedTime = "";
  let formattedDate = "";

  try {
    formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz
    }).format(time);

    const weekday = new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: tz }).format(time);
    const day = new Intl.DateTimeFormat("id-ID", { day: "numeric", timeZone: tz }).format(time);
    const month = new Intl.DateTimeFormat("id-ID", { month: "long", timeZone: tz }).format(time);
    formattedDate = `${weekday}, ${day} ${month}`;
  } catch {
    formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    formattedDate = time.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  }

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden text-white font-sans select-none
        transition-all duration-[420ms] [transition-timing-function:cubic-bezier(0.2,0.9,0.3,1)] transform-gpu will-change-transform
        ${isUnlocking ? "-translate-y-full opacity-90 scale-102" : "translate-y-0 opacity-100 scale-100"}`}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', sans-serif"
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .shake-animation {
          animation: shake 0.45s ease-in-out;
        }
      `}</style>

      {/* Wallpaper Background with Gentle Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 transform-gpu"
        style={{
          backgroundImage: `url('${lockscreenWallpaper}')`,
          zIndex: 0,
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none" 
        style={{ zIndex: 1 }} 
      />

      {/* TOP STATUS BAR (Exact macOS Style) */}
      <div className="absolute top-0 left-0 right-0 h-11 px-6 flex items-center justify-between z-20 pointer-events-auto">
        {/* Top Left: Apple Logo */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 fill-white/85 drop-shadow-sm" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.71-14.42-5.44-8.83-9.8-18.7-13.08-29.62-3.27-10.92-4.91-21.57-4.91-31.95 0-14.07 3.5-25.75 10.5-35.04 7-9.29 16-14 27-14.15 4.58 0 9.87 1.25 15.88 3.76 6 2.5 10.37 3.82 13.11 3.96 2.5-.24 7.02-1.63 13.56-4.17 6.54-2.53 11.98-3.7 16.32-3.52 14.28.82 25.17 6.13 32.67 15.93-11.66 7.07-17.39 16.73-17.18 28.98.22 9.58 3.92 17.65 11.1 24.2 7.18 6.55 15.7 10.3 25.56 11.25-2.28 7.08-4.99 13.84-8.13 20.28zM119.22 31.85c0-7.39 2.65-14.3 7.95-20.73 5.3-6.43 11.83-10.38 19.59-11.85.33 1.3.49 2.55.49 3.75 0 7.29-2.73 14.14-8.19 20.55-5.46 6.42-12.06 10.23-19.8 11.43-.04-1.05-.04-2.1-.04-3.15z"/>
          </svg>
        </div>

        {/* Top Right: Network + Battery + Language */}
        <div className="flex items-center gap-3">
          {/* Wi-Fi */}
          <div className="p-1 rounded-md hover:bg-white/10 transition cursor-pointer">
            <MacWifiIcon />
          </div>

          {/* Battery */}
          <div className="p-1 rounded-md hover:bg-white/10 transition cursor-pointer">
            <MacBatteryIcon />
          </div>

          {/* Input Source */}
          <div className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/15 text-white/90">
            ID
          </div>
        </div>
      </div>

      {/* CLOCK & DATE SECTION (macOS Sequoia Hero Typography) */}
      <div className="relative w-full flex flex-col items-center pt-20 z-10 pointer-events-none">
        {/* Date Line */}
        <span
          className="text-[23px] tracking-wide font-medium text-white/90 capitalize mb-1"
          style={{
            textShadow: "0 2px 14px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)",
            letterSpacing: "-0.01em"
          }}
        >
          {formattedDate}
        </span>

        {/* Giant Crisp Clock */}
        <span
          className="text-[124px] font-semibold leading-none tracking-tight text-white/95"
          style={{
            textShadow: "0 4px 30px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.6)",
            letterSpacing: "-0.035em"
          }}
        >
          {formattedTime}
        </span>
      </div>

      {/* LOWER THIRD: Music Player (If playing) + User Profile + Password */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 w-[420px] max-w-[92vw]">
        {/* macOS Music Widget (Dynamic Island / Live Activity style) */}
        {isMusicOpen && currentTrack && (
          <div 
            className="w-full relative overflow-hidden rounded-2xl p-3.5 text-white flex flex-col gap-2.5 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300"
            style={{
              background: "rgba(20, 20, 24, 0.45)",
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={currentTrack?.img}
                alt=""
                className="w-13 h-13 rounded-xl object-cover shadow-lg border border-white/15 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white truncate">{currentTrack?.title}</div>
                <div className="text-xs text-white/70 truncate">{currentTrack?.artist}</div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={prevTrack}
                  className="p-1.5 text-white/70 hover:text-white transition cursor-pointer"
                  title="Previous"
                >
                  <BsFillSkipBackwardFill size={15} />
                </button>
                <button
                  onClick={toggleAudio}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow cursor-pointer"
                  title={isAudioPlaying ? "Pause" : "Play"}
                >
                  {isAudioPlaying ? <BsFillPauseFill size={18} /> : <BsFillPlayFill size={18} className="ml-0.5" />}
                </button>
                <button
                  onClick={nextTrack}
                  className="p-1.5 text-white/70 hover:text-white transition cursor-pointer"
                  title="Next"
                >
                  <BsFillSkipForwardFill size={15} />
                </button>
              </div>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-white/50 w-7 text-right font-mono">{formatTime(currentTime)}</span>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  const audioEl = document.querySelector("audio");
                  if (audioEl && duration) {
                    audioEl.currentTime = pct * duration;
                    setCurrentTime(pct * duration);
                  }
                }}
                className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group"
              >
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] text-white/50 w-8 font-mono">{formatRemainingTime(currentTime, duration)}</span>
            </div>
          </div>
        )}

        {/* User Avatar & Name */}
        <div
          className="flex flex-col items-center gap-2.5 pointer-events-none"
        >
          <div className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl">
            <img
              src={profilePhoto}
              alt={username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg";
              }}
            />
          </div>

          <span
            className="text-[17px] font-semibold text-white tracking-wide"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {username}
          </span>
        </div>

        {/* Password Pill Input (Authentic macOS Frosted Glass) */}
        <form
          onSubmit={handleSubmitPassword}
          className={`relative w-56 flex items-center ${isWrongPassword ? "shake-animation" : ""}`}
        >
          <div className="absolute inset-0 rounded-full bg-black/25 backdrop-blur-2xl border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4)] pointer-events-none" />
          <input
            ref={passwordInputRef}
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter Password"
            className="relative w-full h-9 bg-transparent px-4 pr-9 text-white text-xs placeholder-white/55 outline-none font-sans z-10 text-center"
            autoFocus
          />

          {/* Submit Arrow Button */}
          <button
            type="submit"
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-all cursor-pointer z-20 ${
              passwordInput ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
            }`}
            title="Unlock (↵)"
          >
            <FiArrowRight size={13} className="text-white" />
          </button>
        </form>

        <span
          className="text-[11px] text-white/70 font-medium tracking-tight -mt-1"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
        >
          Touch ID or Press Return to Unlock
        </span>

        {/* BOTTOM POWER OPTIONS (Sleep, Restart, Shut Down) */}
        <div className="flex items-center gap-7 pt-4">
          <button
            onClick={() => {
              playPopSound();
            }}
            className="flex flex-col items-center gap-1.5 text-white/75 hover:text-white transition group cursor-pointer"
            title="Sleep"
          >
            <div className="w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-xl border border-white/15 flex items-center justify-center group-hover:scale-105 transition shadow-md">
              <FiMoon size={15} />
            </div>
            <span className="text-[10px] font-medium tracking-tight opacity-80">Sleep</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              if (setStage) setStage("restart");
            }}
            className="flex flex-col items-center gap-1.5 text-white/75 hover:text-white transition group cursor-pointer"
            title="Restart"
          >
            <div className="w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-xl border border-white/15 flex items-center justify-center group-hover:scale-105 transition shadow-md">
              <FiRotateCcw size={15} />
            </div>
            <span className="text-[10px] font-medium tracking-tight opacity-80">Restart</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              if (setStage) setStage("power");
            }}
            className="flex flex-col items-center gap-1.5 text-white/75 hover:text-white transition group cursor-pointer"
            title="Shut Down"
          >
            <div className="w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-xl border border-white/15 flex items-center justify-center group-hover:scale-105 transition shadow-md">
              <FiPower size={15} />
            </div>
            <span className="text-[10px] font-medium tracking-tight opacity-80">Shut Down</span>
          </button>
        </div>
      </div>
    </div>
  );
}