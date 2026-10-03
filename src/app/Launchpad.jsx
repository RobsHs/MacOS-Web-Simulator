import React, { useState } from "react";
import { useAppStore } from "../store/Appstore";
import { LayoutGrid, ChevronDown, Plus } from "lucide-react";
import { Safari } from "./Safari";
import Spotify from "./Spotify";
import Settings from "./Settings";
import MacGallery from "./Gallary";
import Blogs from "./Blogs/BlogsSection.jsx";
import Finder from "./Finder";
import Trash from "./Trash";
import FaceTime from "./FaceTime";
import PhoneApp from "./Phone";
import Messages from "./Messages";
import Mail from "./Mail";
import Maps from "./Maps";
import Terminal from "./Terminal";
import Calculator from "./Calculator";
import CalendarApp from "./Calendar";
import ContactsApp from "./Contacts";
import RemindersApp from "./Reminders";
import VSCode from "./VSCode";

// Traffic lights component
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find(w => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-4 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function Launchpad({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);

  const [expandedSections, setExpandedSections] = useState({
    suggestions: false,
    productivity: false,
    creativity: false,
    info: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLaunch = (app) => {
    if (app.url) {
      window.open(app.url, "_blank");
    } else {
      const existingWindow = windows.find((w) => w.appId === app.appId);
      if (existingWindow) {
        if (existingWindow.minimized) {
          restoreApp(existingWindow.id);
        } else {
          focusApp(existingWindow.id);
        }
      } else {
        openApp(app.appId, app.comp);
      }
    }
  };

  const allApps = [
    {
      appId: "Finder",
      label: "Finder",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
    },
    {
      appId: "Safari",
      label: "Safari",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Safari__MacOS_Tahoe__utug9Rt8g6_lowResPng-e86f84b6e9.png",
      comp: <Safari />,
    },
    {
      appId: "VSCode",
      label: "Visual Studio Code",
      icon: "/icons/vscode.svg",
      comp: <VSCode />,
    },
    {
      appId: "Messages",
      label: "Messages",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Messages_macOS_Golden_Gate_ow94O6GAvP-2934473a5d.png",
      comp: <Messages />,
    },
    {
      appId: "Mail",
      label: "Mail",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Mail_macOS_Golden_Gate_3BIjmD3GZM-ae5977fd03.png",
      comp: <Mail />,
    },
    {
      appId: "Maps",
      label: "Maps",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Maps_macOS_Golden_Gate_jOxvDFgSHw-b6ceac8cd4.png",
      comp: <Maps />,
    },
    {
      appId: "Terminal",
      label: "Terminal",
      icon: "/icons/terminal.svg",
      comp: <Terminal />,
    },
    {
      appId: "Calculator",
      label: "Calculator",
      icon: "/icons/calculator.svg",
      comp: <Calculator />,
    },
    {
      appId: "Photos",
      label: "Photos",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Photos_macOS_Golden_Gate_mxVHKSuSHM-06d7e83102.png",
      comp: <MacGallery />,
    },
    {
      appId: "FaceTime",
      label: "FaceTime",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Facetime_macOS_Golden_Gate_Qxnt8DtlwP-e0839d42d8.png",
      comp: <FaceTime />,
    },
    {
      appId: "Phone",
      label: "Phone",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Phone_macOS_Golden_Gate_NWKA493TFf-bffc4d8efc.png",
      comp: <PhoneApp />,
    },
    {
      appId: "Calendar",
      label: "Calendar",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Calender_25y2FI4DUz_lowResPng-d649f6c721.png",
      comp: <CalendarApp />,
    },
    {
      appId: "Contacts",
      label: "Contacts",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Contacts_macOS_Golden_Gate_oKWnz3UDu6-20ba74faaf.png",
      comp: <ContactsApp />,
    },
    {
      appId: "Notes",
      label: "Notes",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Notes__MacOS_Tahoe__Tn8SuaHtAM_lowResPng-632fb908b1.png",
      comp: <Blogs />,
    },
    {
      appId: "Reminders",
      label: "Reminders",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Reminders_macOS_Golden_Gate_EVBkfKEpyn-b296bae148.png",
      comp: <RemindersApp />,
    },
    {
      appId: "Music",
      label: "Music",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Music_macOS_Golden_Gate_LJox0IObSI-d626e3640a.png",
      comp: <Spotify />,
    },
    {
      appId: "Podcasts",
      label: "Podcasts",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Podcasts_macOS_Golden_Gate_PLHwgdc3Fl-4abdcae811.png",
    },
    {
      appId: "TV",
      label: "TV",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_TV_macOS_Golden_Gate_j8weRAj4mw-f0424494f0.png",
    },
    {
      appId: "AppStore",
      label: "App Store",
      icon: "https://s3-new.macosicons.com/macosicons/parse/App_Store__MacOS_Tahoe__ZTpqalXxE3_lowResPng-b755fc1237.png",
    },
    {
      appId: "Pages",
      label: "Pages",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Pages__Apple_Creative_Studio__hHeqYyTXZ3_lowResPng-7a5fbcd210.png",
    },
    {
      appId: "Numbers",
      label: "Numbers",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Numbers__Apple_Creative_Studio__pfooNXbNnX_lowResPng-665922f586.png",
    },
    {
      appId: "Keynote",
      label: "Keynote",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Keynote__Apple_Creative_Studio__SlTcHVkQP5_lowResPng-aac0878b95.png",
    },
    {
      appId: "Settings",
      label: "Settings",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
      comp: <Settings />,
    },
    {
      appId: "Github",
      label: "GitHub (RobsHs)",
      icon: "https://s3-new.macosicons.com/macosicons/parse/GitHub_mm0mJOQEAS_lowResPng-6e5b90d2c7.png",
      url: "https://github.com/robshs",
    },
    {
      appId: "linkedin",
      label: "LinkedIn",
      icon: "https://s3-new.macosicons.com/macosicons/parse/LinkedIn_ZcwY6Altec_lowResPng-59b3305d8f.png",
      url: "https://linkedin.com",
    },
    {
      appId: "Trash",
      label: "Trash",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png",
      comp: <Trash />,
    }
  ];

  const getAppsByList = (names) => {
    return allApps.filter((app) => names.includes(app.appId));
  };

  const categories = [
    {
      id: "suggestions",
      title: "Suggestions",
      actionLabel: "Show More",
      actionLabelActive: "Show Less",
      apps: getAppsByList(["Safari", "VSCode", "Music", "Notes", "Photos", "Calendar"]),
    },
    {
      id: "productivity",
      title: "Productivity",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["VSCode", "Terminal", "Calculator", "Notes", "Reminders", "Calendar", "Mail", "Pages", "Numbers", "Keynote"]),
    },
    {
      id: "creativity",
      title: "Creativity",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Photos", "Music", "Podcasts", "TV", "Messages", "FaceTime"]),
    },
    {
      id: "info",
      title: "Information & Reading",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Maps", "Contacts", "Phone", "Settings", "Github", "linkedin", "Finder", "Trash"]),
    },
  ];

  return (
    <div 
      className="flex flex-col h-full w-full select-none text-[13px]"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
      }}
    >
      {/* Top Header */}
      <header className="window-drag-handle flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <TrafficLights windowId={windowId} />
          <div className="flex items-center gap-2">
            <img 
              src="https://s3-new.macosicons.com/macosicons/parse/App_Store__MacOS_Tahoe__ZTpqalXxE3_lowResPng-b755fc1237.png"
              alt="App Store icon" 
              className="w-5 h-5 object-contain"
            />
            <span className={`font-semibold text-[15px] ${isDarkMode ? "text-white/90" : "text-gray-900/90"}`}>Apps</span>
          </div>
        </div>
        
        <button className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition ${
          isDarkMode 
            ? "border-white/10 bg-white/5 hover:bg-white/10 text-white/80" 
            : "border-black/10 bg-black/5 hover:bg-black/10 text-gray-800"
        }`}>
          <LayoutGrid size={14} />
          <ChevronDown size={12} />
        </button>
      </header>

      {/* Main categories scrollable list */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 notes-no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isExpanded = expandedSections[cat.id];
          const displayApps = isExpanded ? cat.apps : cat.apps.slice(0, 5);
          
          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[14px] ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                  {cat.title}
                </span>
                {cat.apps.length > 5 && (
                  <button 
                    onClick={() => toggleSection(cat.id)}
                    className="text-blue-500 hover:text-blue-600 text-[12px] font-medium transition"
                  >
                    {isExpanded ? cat.actionLabelActive : cat.actionLabel}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-5 gap-y-5 justify-items-center">
                {displayApps.map((app) => (
                  <div 
                    key={app.appId} 
                    onClick={() => handleLaunch(app)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group text-center"
                  >
                    <div className="relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                      <img 
                        src={app.icon} 
                        alt={app.label} 
                        className="w-full h-full object-cover rounded-xl"
                        draggable={false}
                      />
                    </div>
                    <span className={`text-[11px] font-medium truncate max-w-full leading-tight transition ${
                      isDarkMode ? "text-white/80 group-hover:text-white" : "text-gray-800 group-hover:text-black"
                    }`}>
                      {app.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
