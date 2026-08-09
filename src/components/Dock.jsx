import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAppStore } from "../store/Appstore.js";
import { Safari } from "../app/Safari";
import Spotify from "../app/Spotify";
import Settings from "../app/Settings";
import MacGallery from "../app/Gallary";
import ContactsApp from "../app/Contacts";
import Blogs from "../app/Blogs/BlogsSection.jsx";
import Finder from "../app/Finder";
import Trash from "../app/Trash";
import Launchpad from "../app/Launchpad";
import Messages from "../app/Messages";
import Mail from "../app/Mail";
import Maps from "../app/Maps";
import FaceTime from "../app/FaceTime";
import PhoneApp from "../app/Phone";
import CalendarApp from "../app/Calendar";
import RemindersApp from "../app/Reminders";
import Terminal from "../app/Terminal";
import Calculator from "../app/Calculator";
import VSCode from "../app/VSCode";
import { GlassSurface } from "./ui/glass-surface";
import { Check, Pin, PinOff, RotateCcw } from "lucide-react";
import { playPopSound } from "../utils/soundEffects.js";

const getWindowTitle = (win) => {
  if (win.appId === "TextEdit") {
    return win.component?.props?.file?.name || "untitled.txt";
  }
  if (win.appId === "PDFViewer") {
    return win.component?.props?.file?.name || "document.pdf";
  }
  if (win.appId === "Finder") {
    const path = win.component?.props?.initialPath || "/icloud";
    const segment = path.split("/").pop();
    return `Finder (${segment || "Home"})`;
  }
  if (win.appId === "VSCode") {
    return "Visual Studio Code";
  }
  return win.appId;
};

const getWindowIcon = (win, apps) => {
  if (win.appId === "Finder") {
    return "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png";
  }
  if (win.appId === "Terminal") {
    return "/icons/terminal.svg";
  }
  if (win.appId === "Calculator") {
    return "/icons/calculator.svg";
  }
  if (win.appId === "VSCode") {
    return "/icons/vscode.svg";
  }
  if (win.appId === "TextEdit") {
    return "https://s3.macosicons.com/macosicons/icons/aExwB3ULuk/lowResPngFile_a819aac512e7261fee3310f1bbdaada7_aExwB3ULuk.png";
  }
  if (win.appId === "PDFViewer") {
    return "https://s3.macosicons.com/macosicons/icons/ayIhAsqzsY/lowResPngFile_55b757e27580fefb9bd856a23abf6d0f_low_res_Pdf_Document.png";
  }
  const dockApp = apps?.find((a) => a.id === win.appId);
  return dockApp?.icon || "https://s3-new.macosicons.com/macosicons/parse/MacOS_Default_Folder_icon_GecwaBmkFQ_lowResPng-6d37abc4ac.png";
};

// Default pinned apps in macOS Dock
const DEFAULT_PINNED_APPS = [
  "Finder",
  "Launchpad",
  "Safari",
  "VSCode",
  "Messages",
  "Mail",
  "Maps",
  "Photos",
  "FaceTime",
  "Phone",
  "Calendar",
  "Contacts",
  "Notes",
  "Reminders",
  "Music",
  "Terminal",
  "Calculator",
  "Settings",
];

export default function Dock() {
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);
  const minimizeApp = useAppStore((s) => s.minimizeApp);
  const maxZ = useAppStore((s) => s.maxZ);
  const closeApp = useAppStore((s) => s.closeApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const [hoveredApp, setHoveredApp] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [bouncingAppId, setBouncingAppId] = useState(null);
  const [dockContextMenu, setDockContextMenu] = useState(null);

  const leaveTimeoutRef = useRef(null);

  const [hasTrashedItems, setHasTrashedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("os_trash");
      return saved ? JSON.parse(saved).length > 0 : false;
    } catch {
      return false;
    }
  });

  // Pinned Apps State (persisted in localStorage)
  const [pinnedAppIds, setPinnedAppIds] = useState(() => {
    try {
      const saved = localStorage.getItem("macos_dock_pinned_apps");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.includes("VSCode")) {
            parsed.splice(3, 0, "VSCode");
            localStorage.setItem("macos_dock_pinned_apps", JSON.stringify(parsed));
          }
          return parsed;
        }
      }
      return DEFAULT_PINNED_APPS;
    } catch {
      return DEFAULT_PINNED_APPS;
    }
  });

  // Save pinned apps to localStorage
  const savePinnedApps = (newPins) => {
    setPinnedAppIds(newPins);
    try {
      localStorage.setItem("macos_dock_pinned_apps", JSON.stringify(newPins));
    } catch (e) {
      console.error(e);
    }
  };

  const togglePinApp = (appId) => {
    playPopSound();
    if (pinnedAppIds.includes(appId)) {
      savePinnedApps(pinnedAppIds.filter((id) => id !== appId));
    } else {
      savePinnedApps([...pinnedAppIds, appId]);
    }
  };

  const resetPinnedApps = () => {
    playPopSound();
    savePinnedApps(DEFAULT_PINNED_APPS);
  };

  // Master catalog of all available apps
  const allMasterApps = useMemo(
    () => [
      {
        id: "Finder",
        label: "Finder",
        icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
        comp: <Finder />,
      },
      {
        id: "Launchpad",
        label: "Launchpad",
        icon: "https://s3-new.macosicons.com/macosicons/parse/Launchpad__MacOS_Tahoe__ncy8MiCAOA_lowResPng-ffd58d03cd.png",
        comp: <Launchpad />,
      },
      {
        id: "Safari",
        label: "Safari",
        icon: "https://s3-new.macosicons.com/macosicons/parse/Safari__MacOS_Tahoe__utug9Rt8g6_lowResPng-e86f84b6e9.png",
        comp: <Safari />,
      },
      {
        id: "VSCode",
        label: "Visual Studio Code",
        icon: "/icons/vscode.svg",
        comp: <VSCode />,
      },
      {
        id: "Messages",
        label: "Messages",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Messages_macOS_Golden_Gate_ow94O6GAvP-2934473a5d.png",
        comp: <Messages />,
      },
      {
        id: "Mail",
        label: "Mail",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Mail_macOS_Golden_Gate_3BIjmD3GZM-ae5977fd03.png",
        comp: <Mail />,
      },
      {
        id: "Maps",
        label: "Maps",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Maps_macOS_Golden_Gate_jOxvDFgSHw-b6ceac8cd4.png",
        comp: <Maps />,
      },
      {
        id: "Photos",
        label: "Photos",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Photos_macOS_Golden_Gate_mxVHKSuSHM-06d7e83102.png",
        comp: <MacGallery />,
      },
      {
        id: "FaceTime",
        label: "FaceTime",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Facetime_macOS_Golden_Gate_Qxnt8DtlwP-e0839d42d8.png",
        comp: <FaceTime />,
      },
      {
        id: "Phone",
        label: "Phone",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Phone_macOS_Golden_Gate_NWKA493TFf-bffc4d8efc.png",
        comp: <PhoneApp />,
      },
      {
        id: "Calendar",
        label: "Calendar",
        icon: "https://s3-new.macosicons.com/macosicons/parse/Calender_25y2FI4DUz_lowResPng-d649f6c721.png",
        comp: <CalendarApp />,
      },
      {
        id: "Contacts",
        label: "Contacts",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Contacts_macOS_Golden_Gate_oKWnz3UDu6-20ba74faaf.png",
        comp: <ContactsApp />,
      },
      {
        id: "Notes",
        label: "Notes",
        icon: "https://s3-new.macosicons.com/macosicons/parse/Notes__MacOS_Tahoe__Tn8SuaHtAM_lowResPng-632fb908b1.png",
        comp: <Blogs />,
      },
      {
        id: "Reminders",
        label: "Reminders",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Reminders_macOS_Golden_Gate_EVBkfKEpyn-b296bae148.png",
        comp: <RemindersApp />,
      },
      {
        id: "Music",
        label: "Music",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Music_macOS_Golden_Gate_LJox0IObSI-d626e3640a.png",
        comp: <Spotify />,
      },
      {
        id: "Terminal",
        label: "Terminal",
        icon: "/icons/terminal.svg",
        comp: <Terminal />,
      },
      {
        id: "Calculator",
        label: "Calculator",
        icon: "/icons/calculator.svg",
        comp: <Calculator />,
      },
      {
        id: "Settings",
        label: "Settings",
        icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
        comp: <Settings />,
      },
    ],
    []
  );

  // Compute visible apps: Pinned apps + Running Unpinned apps + Utilities
  const apps = useMemo(() => {
    const list = [];

    // 1. All pinned apps in user-specified order
    pinnedAppIds.forEach((id) => {
      const found = allMasterApps.find((a) => a.id === id);
      if (found) list.push({ ...found, isPinned: true });
    });

    // 2. Add any currently running unpinned apps
    windows.forEach((win) => {
      let targetId = win.appId;
      if (targetId === "TextEdit" || targetId === "PDFViewer") targetId = "Finder";
      if (!pinnedAppIds.includes(targetId)) {
        const alreadyInList = list.some((a) => a.id === targetId);
        if (!alreadyInList) {
          const found = allMasterApps.find((a) => a.id === targetId);
          if (found) {
            list.push({ ...found, isPinned: false });
          }
        }
      }
    });

    // 3. Divider
    list.push({ divider: true });

    // 4. Folder (Desktop Folder)
    list.push({
      id: "Folder",
      label: "Desktop Folder",
      icon: "https://s3-new.macosicons.com/macosicons/parse/MacOS_Default_Folder_icon_GecwaBmkFQ_lowResPng-6d37abc4ac.png",
      comp: <Finder initialPath="/desktop" />,
      isPinned: true,
      isSystem: true,
    });

    // 5. Trash
    list.push({
      id: "Trash",
      label: "Trash",
      icon: hasTrashedItems
        ? "https://s3.macosicons.com/macosicons/icons/yrypldfXBR/lowResPngFile_c3be764d323d03b2ce9921be92216fca_yrypldfXBR.png"
        : "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png",
      comp: <Trash />,
      isPinned: true,
      isSystem: true,
    });

    return list;
  }, [pinnedAppIds, windows, hasTrashedItems, allMasterApps]);

  useEffect(() => {
    const handleTrashUpdated = (e) => {
      setHasTrashedItems(e.detail.hasFiles);
    };

    const handleFileTrashed = () => {
      setHasTrashedItems(true);
    };

    const handleOpenAppRequest = (e) => {
      const targetId = e.detail?.appId;
      const found = allMasterApps.find((a) => a.id?.toLowerCase() === targetId?.toLowerCase());
      if (found) {
        handleAppClick(found);
      }
    };

    const handlePinToggleRequest = (e) => {
      const targetId = e.detail?.appId;
      if (targetId) {
        togglePinApp(targetId);
      }
    };

    const handleCloseMenu = () => {
      setDockContextMenu(null);
    };

    window.addEventListener("os_trash_updated", handleTrashUpdated);
    window.addEventListener("os_file_trash", handleFileTrashed);
    window.addEventListener("os_open_app_request", handleOpenAppRequest);
    window.addEventListener("os_dock_pin_toggle", handlePinToggleRequest);
    window.addEventListener("click", handleCloseMenu);

    return () => {
      window.removeEventListener("os_trash_updated", handleTrashUpdated);
      window.removeEventListener("os_file_trash", handleFileTrashed);
      window.removeEventListener("os_open_app_request", handleOpenAppRequest);
      window.removeEventListener("os_dock_pin_toggle", handlePinToggleRequest);
      window.removeEventListener("click", handleCloseMenu);
    };
  }, [allMasterApps, pinnedAppIds]);

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredApp(null);
      setHoveredIndex(null);
    }, 150);
  };

  const handleMouseEnterIcon = (app, index) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setHoveredApp(app);
    setHoveredIndex(index);
  };

  const isAppOpen = (appId) => {
    if (appId === "Finder" || appId === "Folder") {
      return windows.some((w) => w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer");
    }
    return windows.some((w) => w.appId === appId);
  };

  // Silky smooth continuous Gaussian curve for macOS Dock magnification
  const getIconScale = (index) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance > 3) return 1;
    return 1 + 0.36 * Math.exp(-Math.pow(distance / 1.45, 2));
  };

  const handleAppClick = (app) => {
    playPopSound();
    setBouncingAppId(app.id);
    setTimeout(() => {
      setBouncingAppId(null);
    }, 750);

    if (app.url) {
      window.open(app.url, "_blank");
      return;
    }
    if (app.action) {
      app.action();
      return;
    }

    const existingWindow = windows.find((w) => {
      if (app.id === "Finder" || app.id === "Folder") {
        return w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer";
      }
      return w.appId === app.id;
    });

    if (existingWindow) {
      if (existingWindow.minimized) {
        restoreApp(existingWindow.id);
        focusApp(existingWindow.id);
      } else if (existingWindow.z === maxZ) {
        minimizeApp(existingWindow.id);
      } else {
        focusApp(existingWindow.id);
      }
    } else {
      openApp(app.id, app.comp);
    }
  };

  // Right-click context menu on dock icon
  const handleContextMenu = (e, app) => {
    e.preventDefault();
    e.stopPropagation();
    if (app.divider) return;

    playPopSound();
    const rect = e.currentTarget.getBoundingClientRect();
    setDockContextMenu({
      app,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <>
      <div
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-end px-2 py-1 rounded-2xl h-[58px] overflow-visible transition-all duration-200 z-[99999]"
        onMouseLeave={handleMouseLeave}
      >
        <GlassSurface
          tint={isDarkMode ? 0.05 : 0.02}
          radius={18}
          blur={22}
          chroma={0.12}
          specular={false}
          className="absolute inset-0 -z-10 shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)]"
        />
        {apps.map((app, index) => {
          if (app.divider)
            return (
              <div
                key={`divider-${index}`}
                className="w-px bg-white/20 rounded-full mx-1 self-stretch my-1.5"
              />
            );

          const scale = getIconScale(index);
          const baseSize = 46;
          const iconSize = baseSize * scale;
          const appWindows = windows.filter((w) => {
            if (app.id === "Finder") {
              return w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer";
            }
            return w.appId === app.id;
          });
          const hasWindows = appWindows.length > 0;

          return (
            <div
              key={app.id}
              id={`dock-icon-${app.id}`}
              onMouseEnter={() => handleMouseEnterIcon(app, index)}
              onClick={() => handleAppClick(app)}
              onContextMenu={(e) => handleContextMenu(e, app)}
              className={`
                relative
                flex flex-col items-center justify-end
                cursor-pointer px-0.5
                active:scale-90 transition-transform
                ${bouncingAppId === app.id ? "mac-dock-jumping" : ""}
              `}
              style={{
                transformOrigin: "bottom center",
                marginBottom: hoveredIndex !== null ? `${(scale - 1) * 22}px` : "0px",
                transition: "transform 0.12s cubic-bezier(0.2, 0, 0, 1), margin-bottom 0.12s cubic-bezier(0.2, 0, 0, 1)",
              }}
            >
              {/* Tooltip / Window Previews */}
              {hoveredApp?.id === app.id && !dockContextMenu && (
                hasWindows && app.id === "Finder" ? (
                  <div
                    className="
                      absolute -top-[140px] left-1/2 -translate-x-1/2
                      flex gap-3 p-3 rounded-xl
                      bg-gray-950/90 text-white shadow-2xl
                      backdrop-blur-xl pointer-events-auto
                      z-50 border border-white/10 min-w-[150px]
                    "
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => {
                      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    {appWindows.map((win) => {
                      const title = getWindowTitle(win);
                      const iconUrl = getWindowIcon(win, apps);
                      return (
                        <div
                          key={win.id}
                          onClick={() => {
                            restoreApp(win.id);
                            focusApp(win.id);
                          }}
                          className={`
                            relative group/preview flex flex-col items-center gap-1.5 p-2 rounded-lg 
                            transition duration-150 cursor-pointer min-w-[95px] max-w-[130px]
                            ${win.minimized ? "bg-white/5 opacity-75 hover:opacity-100 hover:bg-white/10" : "bg-white/10 hover:bg-white/15"}
                          `}
                        >
                          <div className="w-16 h-12 rounded bg-black/40 flex items-center justify-center relative shadow-inner border border-white/5">
                            <img src={iconUrl} alt="" className="w-8 h-8 object-contain" />
                            {win.minimized && (
                              <span className="absolute bottom-1 right-1 text-[8px] bg-yellow-500/80 text-black px-1 rounded font-semibold scale-90">min</span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium truncate max-w-[110px] text-center" title={title}>
                            {title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="
                      absolute -top-11 left-1/2 -translate-x-1/2
                      px-3 py-1 rounded-md
                      bg-gray-950/85 text-white text-xs font-medium
                      shadow-lg backdrop-blur-md pointer-events-none
                      whitespace-nowrap z-50 border border-white/10
                    "
                  >
                    {app.label}
                  </div>
                )
              )}

              <div
                className="
                  rounded-xl
                  flex items-center justify-center
                  overflow-hidden select-none
                "
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                  transition: "width 0.12s cubic-bezier(0.2, 0, 0, 1), height 0.12s cubic-bezier(0.2, 0, 0, 1)",
                }}
              >
                <img
                  src={app.icon}
                  alt={app.label}
                  className="w-full h-full object-contain rounded-xl pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Dot indicator for open apps */}
              {isAppOpen(app.id) && (
                <div
                  className="absolute -bottom-1 w-1 h-1 bg-white/95 rounded-full"
                  style={{
                    boxShadow: "0 0 5px rgba(255,255,255,0.8)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* macOS Dock Right-Click Context Menu (Pin / Unpin / Quit / Open) */}
      {dockContextMenu && (
        <div
          className="fixed z-[100000] rounded-xl py-1.5 w-52 shadow-[0_16px_40px_rgba(0,0,0,0.45)] border text-xs select-none backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: Math.max(10, Math.min(window.innerWidth - 220, dockContextMenu.x - 100)),
            bottom: Math.max(70, window.innerHeight - dockContextMenu.y + 14),
            backgroundColor: isDarkMode ? "rgba(32, 32, 34, 0.92)" : "rgba(255, 255, 255, 0.92)",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
            color: isDarkMode ? "#ffffff" : "#1f2937",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-1.5 font-semibold border-b border-black/5 dark:border-white/10">
            <img src={dockContextMenu.app.icon} alt="" className="w-4 h-4 object-contain rounded" />
            <span className="truncate">{dockContextMenu.app.label}</span>
          </div>

          <div className="py-1">
            {/* Pin / Unpin Action (Hide for system Trash/Folder) */}
            {!dockContextMenu.app.isSystem && (
              <button
                onClick={() => {
                  togglePinApp(dockContextMenu.app.id);
                  setDockContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007AFF] hover:text-white transition cursor-pointer text-left font-medium"
              >
                <span>{pinnedAppIds.includes(dockContextMenu.app.id) ? "Remove from Dock" : "Keep in Dock"}</span>
                {pinnedAppIds.includes(dockContextMenu.app.id) && <Check size={13} className="shrink-0" />}
              </button>
            )}

            <button
              onClick={() => {
                handleAppClick(dockContextMenu.app);
                setDockContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007AFF] hover:text-white transition cursor-pointer text-left"
            >
              <span>{isAppOpen(dockContextMenu.app.id) ? "Show Window" : "Open"}</span>
            </button>

            {isAppOpen(dockContextMenu.app.id) && (
              <button
                onClick={() => {
                  playPopSound();
                  const appWins = windows.filter((w) => w.appId === dockContextMenu.app.id);
                  appWins.forEach((w) => closeApp(w.id));
                  setDockContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-red-600 hover:text-white text-red-500 transition cursor-pointer text-left"
              >
                <span>Quit</span>
              </button>
            )}
          </div>

          {/* Reset Dock Option */}
          <div className="pt-1 mt-0.5 border-t border-black/5 dark:border-white/10">
            <button
              onClick={() => {
                resetPinnedApps();
                setDockContextMenu(null);
              }}
              className="w-full px-3 py-1 hover:bg-[#007AFF] hover:text-white transition text-gray-400 hover:text-white text-[11px] text-left cursor-pointer"
            >
              Reset Dock to Default
            </button>
          </div>
        </div>
      )}
    </>
  );
}
