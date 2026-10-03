import React, { useState } from "react";
import { useAppStore } from "../store/Appstore";

const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  return (
    <div className="flex items-center gap-2 group mr-4 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="w-3 h-3 bg-[#febc2e] rounded-full opacity-60 cursor-not-allowed"></div>
      <div className="w-3 h-3 bg-[#28c840] rounded-full opacity-60 cursor-not-allowed"></div>
    </div>
  );
};

export default function AboutThisMac({ windowId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [updateStatus, setUpdateStatus] = useState(null);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const handleCheckUpdate = () => {
    setUpdateStatus("checking");
    setTimeout(() => {
      setUpdateStatus("up-to-date");
    }, 1800);
  };

  return (
    <div className={`h-full w-full flex flex-col ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#ececec] text-gray-900"} select-none overflow-hidden font-sans`}>
      {/* Window Title & Tabs */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-white/10 bg-black/10 window-drag-handle">
        <TrafficLights windowId={windowId} />
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-black/20 rounded-md p-0.5 text-xs font-medium">
          {["overview", "displays", "storage", "support"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded capitalize transition-all ${
                activeTab === tab
                  ? "bg-white/20 text-white shadow-sm font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-10"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center">
        {activeTab === "overview" && (
          <div className="flex items-center gap-8 max-w-xl mx-auto">
            {/* Mac Hardware Illustration */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="w-32 h-20 bg-linear-to-b from-gray-700 to-gray-900 rounded-t-lg border border-gray-600 shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="w-28 h-16 bg-blue-900/60 rounded flex items-center justify-center">
                  <svg width="24" height="28" viewBox="0 0 170 170" fill="white" className="opacity-70">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/>
                  </svg>
                </div>
              </div>
              <div className="w-36 h-2 bg-gray-500 rounded-b shadow-md"></div>
              <div className="w-10 h-0.5 bg-gray-600 rounded"></div>
            </div>

            {/* Hardware Information */}
            <div className="space-y-2 text-xs flex-1">
              <div>
                <h2 className="text-xl font-bold tracking-tight">MacBook Pro</h2>
                <p className="text-white/60">16-inch, RobsHs Special Edition</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex">
                  <span className="text-white/50 w-24">Chip</span>
                  <span className="font-semibold text-white">Apple M4 Pro (14 cores)</span>
                </div>
                <div className="flex">
                  <span className="text-white/50 w-24">Graphics</span>
                  <span className="font-semibold text-white">20-Core GPU</span>
                </div>
                <div className="flex">
                  <span className="text-white/50 w-24">Memory</span>
                  <span className="font-semibold text-white">36 GB Unified Memory</span>
                </div>
                <div className="flex">
                  <span className="text-white/50 w-24">Startup Disk</span>
                  <span className="font-semibold text-white">Macintosh HD</span>
                </div>
                <div className="flex">
                  <span className="text-white/50 w-24">macOS</span>
                  <span className="font-semibold text-white">RobsHs 15.3 (Build 26R01)</span>
                </div>
                <div className="flex">
                  <span className="text-white/50 w-24">Serial</span>
                  <span className="font-mono text-white/80">ROBS-HS24-M4PRO</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={handleCheckUpdate}
                  className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 text-xs font-medium border border-white/10 transition-colors"
                >
                  Software Update...
                </button>
                {updateStatus === "checking" && (
                  <span className="text-xs text-blue-400 animate-pulse">Checking for updates...</span>
                )}
                {updateStatus === "up-to-date" && (
                  <span className="text-xs text-emerald-400">Your Mac is up to date</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "displays" && (
          <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-56 h-32 rounded-lg bg-linear-to-tr from-blue-600/30 to-purple-600/30 border border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-xs font-semibold text-white/80">Liquid Retina XDR</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">16.2-inch Built-in Liquid Retina XDR Display</h3>
              <p className="text-xs text-white/60">3456 × 2234 Native Resolution @ 120Hz (ProMotion)</p>
              <p className="text-xs text-white/40 mt-1">1,000,000:1 contrast ratio, 1600 nits peak HDR brightness</p>
            </div>
          </div>
        )}

        {activeTab === "storage" && (
          <div className="space-y-4 max-w-lg mx-auto w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-700 border border-white/20 flex items-center justify-center text-lg font-bold">
                💾
              </div>
              <div>
                <h3 className="font-bold text-sm">Macintosh HD</h3>
                <p className="text-xs text-white/60">682.4 GB available of 1 TB SSD</p>
              </div>
            </div>

            {/* Storage Progress Bar */}
            <div className="h-6 w-full rounded-md bg-white/10 overflow-hidden flex border border-white/10">
              <div className="h-full bg-blue-500 w-[14%]" title="macOS (42 GB)"></div>
              <div className="h-full bg-yellow-500 w-[12%]" title="Applications (96 GB)"></div>
              <div className="h-full bg-purple-500 w-[10%]" title="Developer (64 GB)"></div>
              <div className="h-full bg-pink-500 w-[8%]" title="Photos & Media (48 GB)"></div>
              <div className="h-full bg-emerald-500 w-[6%]" title="System Data (32 GB)"></div>
              <div className="h-full bg-white/5 flex-1" title="Free Space (682 GB)"></div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs text-white/80 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>macOS (42 GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span>Apps (96 GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Developer (64 GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span>Media (48 GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>System (32 GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                <span className="text-white/50">Free (682 GB)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-4 max-w-md mx-auto text-center text-xs">
            <h3 className="font-bold text-sm">macOS & Hardware Resources</h3>
            <p className="text-white/70">
              Need assistance with your Mac? Browse official documentation, specifications, or community support forums.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="https://support.apple.com/mac"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-lg bg-white/10 hover:bg-white/15 block text-left transition-colors border border-white/5"
              >
                <div className="font-bold text-white mb-0.5">macOS Help</div>
                <div className="text-[11px] text-white/50">User guide & tutorials</div>
              </a>
              <a
                href="https://developer.apple.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-lg bg-white/10 hover:bg-white/15 block text-left transition-colors border border-white/5"
              >
                <div className="font-bold text-white mb-0.5">Apple Developer</div>
                <div className="text-[11px] text-white/50">APIs & documentation</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

