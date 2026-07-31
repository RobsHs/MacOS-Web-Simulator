import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useAppStore } from "../store/Appstore.js";
import { AnimatePresence, motion } from "framer-motion";
import { playMinimizeSound } from "../utils/soundEffects.js";

export default function AppWindow({ window: win }) {
  const close = useAppStore((s) => s.closeApp);
  const focus = useAppStore((s) => s.focusApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const rndRef = useRef(null);

  // Calculate initial size and position
  const screenWidth = globalThis.innerWidth || 1200;
  const screenHeight = globalThis.innerHeight || 800;
  const isLaunchpad = win.appId === "Launchpad";
  const isMessages = win.appId === "Messages";
  const isFinder = win.appId === "Finder";
  const isMail = win.appId === "Mail";
  const isMaps = win.appId === "Maps";
  const isFaceTime = win.appId === "FaceTime";
  const isPhone = win.appId === "Phone";
  const isContacts = win.appId === "Contacts";
  const isReminders = win.appId === "Reminders";
  const isCalculator = win.appId === "Calculator";
  const isAboutThisMac = win.appId === "AboutThisMac";
  const isTerminal = win.appId === "Terminal";
  const isVSCode = win.appId === "VSCode";

  const initialWidth = isCalculator 
    ? 260 
    : isAboutThisMac 
      ? 560 
      : isTerminal 
        ? Math.min(720, screenWidth * 0.6) 
        : isVSCode
          ? Math.min(1080, screenWidth * 0.82)
          : (isMail || isMaps || isFaceTime) 
            ? screenWidth * 0.65 
            : (isMessages || isFinder || isPhone || isContacts || isReminders) 
              ? screenWidth * 0.55 
              : isLaunchpad 
                ? screenWidth * 0.45 
                : screenWidth * 0.7;

  const initialHeight = isCalculator 
    ? 380 
    : isAboutThisMac 
      ? 360 
      : isTerminal 
        ? Math.min(450, screenHeight * 0.62) 
        : isVSCode
          ? Math.min(720, screenHeight * 0.8)
          : (isMessages || isFinder || isMail || isMaps || isFaceTime || isPhone || isContacts || isReminders) 
            ? screenHeight * 0.72 
            : isLaunchpad 
              ? screenHeight * 0.65 
              : screenHeight * 0.76;

  const initialX = Math.max(50, (screenWidth - initialWidth) / 2);
  const initialY = Math.max(40, (screenHeight - initialHeight) / 2 - 20);

  // Track current size and position
  const [windowState, setWindowState] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });
  
  // Store pre-maximize state
  const [preMaxState, setPreMaxState] = useState(null);

  // Calculate precise displacement to dock icon
  const calculateGenieTarget = () => {
    let targetId = win.appId;
    if (targetId === "TextEdit" || targetId === "PDFViewer") targetId = "Finder";
    const dockIcon = document.getElementById(`dock-icon-${targetId}`) || document.getElementById(`dock-icon-Finder`);
    
    const screenW = globalThis.innerWidth || 1200;
    const screenH = globalThis.innerHeight || 800;
    let targetX = screenW / 2;
    let targetY = screenH - 35;
    
    if (dockIcon) {
      const rect = dockIcon.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // Relative horizontal position of dock icon across window width (0.0 to 1.0)
    const relX = (targetX - windowState.x) / Math.max(1, windowState.width);
    const originXPercent = Math.max(8, Math.min(92, relX * 100));

    // Exact anchor point at the bottom edge of the window
    const anchorX = windowState.x + windowState.width * (originXPercent / 100);
    const anchorY = windowState.y + windowState.height;

    const shiftX = targetX - anchorX;
    const shiftY = targetY - anchorY;

    return {
      shiftX,
      shiftY,
      origin: `${originXPercent}% 100%`,
    };
  };

  // Genie Animation State
  const [genieTarget, setGenieTarget] = useState(() => calculateGenieTarget());
  const [animState, setAnimState] = useState(win.minimized ? "minimized" : "normal");
  const [isFullyHidden, setIsFullyHidden] = useState(win.minimized || false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Recalculate target right after mount to bind to exact rendered Dock icon rect
  useEffect(() => {
    const target = calculateGenieTarget();
    setGenieTarget(target);
  }, []);

  const prevMinimized = useRef(win.minimized);
  useEffect(() => {
    if (prevMinimized.current !== win.minimized) {
      prevMinimized.current = win.minimized;
      const target = calculateGenieTarget();
      setGenieTarget(target);
      setIsAnimating(true);

      if (win.minimized) {
        setAnimState("minimized");
      } else {
        setIsFullyHidden(false);
        setAnimState("restore");
      }
    }
  }, [win.minimized]);

  const handleGenieComplete = () => {
    setIsAnimating(false);
    if (win.minimized) {
      setIsFullyHidden(true);
    } else {
      setAnimState("normal");
    }
  };

  const handleClose = () => {
    playMinimizeSound();
    const target = calculateGenieTarget();
    setGenieTarget(target);
    setIsVisible(false);
  };

  const handleExitComplete = () => {
    close(win.id);
  };

  const handleMinimize = () => {
    minimize(win.id);
  };

  const handleMaximize = () => {
    toggleMaximize(win.id);
  };

  // Handle maximize/restore
  useEffect(() => {
    if (win.maximized) {
      // Save current state before maximizing
      setPreMaxState({ ...windowState });
      // Maximize: fill screen below top bar
      setWindowState({
        x: 0,
        y: 28,
        width: globalThis.innerWidth || 1920,
        height: (globalThis.innerHeight || 1080) - 28,
      });
    } else if (preMaxState) {
      // Restore to previous size
      setWindowState(preMaxState);
    }
  }, [win.maximized]);

  // Authentic macOS Genie / Scale Animation Variants
  const genieVariants = {
    initial: (custom) => ({
      x: custom?.shiftX || 0,
      y: custom?.shiftY || 0,
      scaleX: 0.06,
      scaleY: 0.03,
      opacity: 0,
    }),
    normal: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    minimized: (custom) => ({
      x: [0, (custom?.shiftX || 0) * 0.35, custom?.shiftX || 0],
      y: [0, (custom?.shiftY || 250) * 0.65, custom?.shiftY || 250],
      scaleX: [1, 0.52, 0.05],
      scaleY: [1, 0.80, 0.02],
      opacity: [1, 0.95, 0],
      transition: {
        duration: 0.32,
        times: [0, 0.45, 1],
        ease: ["easeIn", "easeOut"],
      },
    }),
    restore: (custom) => ({
      x: [custom?.shiftX || 0, (custom?.shiftX || 0) * 0.15, 0],
      y: [custom?.shiftY || 250, (custom?.shiftY || 250) * 0.35, 0],
      scaleX: [0.05, 0.85, 1],
      scaleY: [0.02, 0.92, 1],
      opacity: [0, 0.95, 1],
      transition: {
        duration: 0.32,
        times: [0, 0.42, 1],
        ease: ["easeOut", "easeOut"],
      },
    }),
    exit: (custom) => ({
      x: custom?.shiftX || 0,
      y: custom?.shiftY || 0,
      scaleX: 0.05,
      scaleY: 0.02,
      opacity: 0,
      transition: {
        duration: 0.28,
        ease: [0.32, 0.72, 0, 1],
      },
    }),
  };

  // Outer container maintains element mounted but hidden when completely minimized
  const containerStyle = {
    visibility: isFullyHidden ? "hidden" : "visible",
    pointerEvents: win.minimized ? "none" : "auto",
  };

  // Resize handle styles for better visibility
  const resizeHandleStyles = {
    bottom: { cursor: 'ns-resize' },
    right: { cursor: 'ew-resize' },
    top: { cursor: 'ns-resize' },
    left: { cursor: 'ew-resize' },
    topRight: { cursor: 'nesw-resize' },
    bottomRight: { cursor: 'nwse-resize' },
    bottomLeft: { cursor: 'nesw-resize' },
    topLeft: { cursor: 'nwse-resize' },
  };

  return (
    <div style={containerStyle}>
      <Rnd
        ref={rndRef}
        size={{ width: windowState.width, height: windowState.height }}
        position={{ x: windowState.x, y: windowState.y }}
        minWidth={isCalculator ? 250 : isAboutThisMac ? 480 : 300}
        minHeight={isCalculator ? 360 : isAboutThisMac ? 320 : 200}
        dragHandleClassName="window-drag-handle"
        style={{ 
          zIndex: win.maximized ? 9999 : win.z,
        }}
        resizeHandleStyles={resizeHandleStyles}
        enableResizing={(!win.maximized && !isCalculator && !isAboutThisMac && !win.minimized && !isAnimating) ? {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        } : false}
        onDragStart={() => {
          setIsDragging(true);
          focus(win.id);
        }}
        onDragStop={(e, d) => {
          setIsDragging(false);
          if (!win.maximized) {
            setWindowState(prev => ({ ...prev, x: d.x, y: d.y }));
          }
        }}
        onResizeStart={() => {
          setIsResizing(true);
          focus(win.id);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setIsResizing(false);
          if (!win.maximized) {
            setWindowState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }
        }}
        disableDragging={win.maximized || win.minimized || isAnimating}
      >
        <AnimatePresence onExitComplete={handleExitComplete}>
          {isVisible && (
            <motion.div
              key={win.id}
              custom={genieTarget}
              variants={genieVariants}
              initial={animState === "minimized" ? "minimized" : "initial"}
              animate={animState}
              onAnimationComplete={handleGenieComplete}
              exit="exit"
              className={`flex flex-col overflow-hidden ${
                win.maximized ? "rounded-none" : "rounded-xl"
              } ${
                win.appId === "Launchpad"
                  ? isDarkMode
                    ? "backdrop-blur-3xl bg-[#1e1e1e]/45 border border-white/10 text-white shadow-2xl"
                    : "backdrop-blur-3xl bg-white/65 border border-black/10 text-gray-900 shadow-2xl"
                  : win.appId === "Safari"
                    ? isDarkMode
                      ? "bg-[#1e1e1e] text-white"
                      : "bg-white text-gray-900 shadow-2xl"
                  : win.appId === "FaceTime" || win.appId === "Phone"
                    ? isDarkMode
                      ? "bg-[#1e1e1e] text-white"
                      : "bg-white text-gray-900 shadow-2xl"
                  : win.appId === "Photos" || win.appId === "Music" || win.appId === "Safari" || win.appId === "Notes" || win.appId === "Finder" || win.appId === "TextEdit" || win.appId === "PDFViewer" || win.appId === "Trash" || win.appId === "Messages" || win.appId === "Mail" || win.appId === "Maps" || win.appId === "Phone" || win.appId === "Calendar" || win.appId === "Contacts" || win.appId === "Reminders" || win.appId === "Terminal" || win.appId === "Calculator" || win.appId === "AboutThisMac"
                    ? isDarkMode
                      ? "bg-[#1e1e1e] text-white border border-white/10"
                      : "bg-white text-gray-900 border border-black/10 shadow-2xl"
                    : "backdrop-blur-xl bg-black/40 border border-white/15 text-white shadow-xl"
              } ${isDragging ? "cursor-grabbing" : ""} ${isResizing ? "select-none" : ""}`}
              style={{
                width: '100%',
                height: '100%',
                transformOrigin: genieTarget.origin,
                boxShadow: isFaceTime
                  ? isDragging 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.4)'
                  : isDragging 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                willChange: isDragging || isResizing || isAnimating ? 'transform, opacity' : 'auto',
              }}
            >
              {/* Title Bar - Skip for apps that integrate their own traffic lights */}
              {win.appId !== "Photos" && win.appId !== "Music" && win.appId !== "Safari" && win.appId !== "Notes" && win.appId !== "Finder" && win.appId !== "TextEdit" && win.appId !== "PDFViewer" && win.appId !== "Trash" && win.appId !== "Launchpad" && win.appId !== "Messages" && win.appId !== "Mail" && win.appId !== "Maps" && win.appId !== "FaceTime" && win.appId !== "Phone" && win.appId !== "Calendar" && win.appId !== "Contacts" && win.appId !== "Reminders" && win.appId !== "Terminal" && win.appId !== "Calculator" && win.appId !== "AboutThisMac" && win.appId !== "VSCode" && (
                <div 
                  className={`window-drag-handle relative h-11 bg-linear-to-b from-white/10 to-transparent flex items-center cursor-grab active:cursor-grabbing select-none ${
                    win.maximized ? "" : "rounded-t-xl"
                  }`}
                  onDoubleClick={handleMaximize}
                >
                  {/* Traffic Light Buttons */}
                  <div className="absolute left-4 flex items-center gap-2 group z-10">
                    {/* Close Button */}
                    <div
                      className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); handleClose(); }}
                      title="Close"
                    >
                      <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    {/* Minimize Button */}
                    <div
                      className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
                      title="Minimize"
                    >
                      <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                        <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    {/* Maximize Button */}
                    <div
                      className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
                      title={win.maximized ? "Restore" : "Maximize"}
                    >
                      <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                        {win.maximized ? (
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
 
                  {/* Center Title */}
                  <div className="absolute left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm tracking-wide pointer-events-none">
                    {win.appId}
                  </div>
                </div>
              )}
 
              {/* App Content */}
              <div className={`flex-1 overflow-hidden flex flex-col ${win.appId === "Photos" || win.appId === "Music" || win.appId === "Safari" || win.appId === "Notes" || win.appId === "Finder" || win.appId === "TextEdit" || win.appId === "PDFViewer" || win.appId === "Trash" || win.appId === "Launchpad" || win.appId === "Messages" || win.appId === "Calendar" || win.appId === "Maps" || win.appId === "VSCode" || win.appId === "Terminal" || win.appId === "Calculator" ? "" : "text-white bg-black/20"}`}>
                {React.cloneElement(win.component, { windowId: win.id, maximized: win.maximized, isDragging, isResizing })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Rnd>
    </div>
  );
}
