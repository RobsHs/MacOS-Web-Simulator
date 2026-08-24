import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store/Appstore";

// Traffic lights component inside Terminal
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-3 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function Terminal({ windowId }) {
  const openApp = useAppStore((s) => s.openApp);
  const closeApp = useAppStore((s) => s.closeApp);
  const [history, setHistory] = useState([
    {
      type: "output",
      content: "Last login: " + new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }) + " on ttys002\nType 'help' for available commands or 'neofetch' for system info.",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [currentDir, setCurrentDir] = useState("~");
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [theme, setTheme] = useState("default"); // default, amber, green, hacker

  const username = localStorage.getItem("lock_username") || "RobsHs";
  const hostname = "RobsHs-MacBook-Pro";
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const matrixCanvasRef = useRef(null);

  // Filesystem simulation
  const fs = {
    "~": ["Desktop", "Documents", "Downloads", "Pictures", "Music", "Applications", "README.md", ".zshrc"],
    "~/Desktop": ["Notes.txt", "Project-Report.pdf", "Screenshot_2026.png"],
    "~/Documents": ["Resume.pdf", "Work_Plan.md", "Portfolio.code-workspace"],
    "~/Downloads": ["macOS_Sequoia_Installer.dmg", "cursor-setup.exe", "soundtrack.mp3"],
    "~/Pictures": ["Wallpaper_GoldenGate.png", "Profile.jpg", "Avatars"],
    "~/Applications": ["Safari", "Finder", "Notes", "Spotify", "Calculator", "Settings", "Photos", "Terminal"],
  };

  const fileContents = {
    "README.md": "# macOS Web Simulator\nA premium, interactive web-based macOS desktop simulator built with modern React & Tailwind CSS.",
    ".zshrc": "export ZSH=$HOME/.oh-my-zsh\nZSH_THEME=\"robbyrussell\"\nplugins=(git zsh-autosuggestions)\nsource $ZSH/oh-my-zsh.sh",
    "Notes.txt": "Project Roadmap:\n- Implement Apple Silicon M4 Pro emulation\n- Smooth dock magnification curve\n- Spotlight search and instant calculations\n- Native audio feedback effects",
    "Work_Plan.md": "Q4 Priorities:\n1. Polish UI responsiveness\n2. Integrate Web Audio API sounds\n3. Enhance multi-window coordination",
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isMatrixActive]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Matrix falling rain animation effect
  useEffect(() => {
    if (!isMatrixActive || !matrixCanvasRef.current) return;
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const chars = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1234567890ABCDEF@#$%&*";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => 1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || (e.ctrlKey && e.key.toLowerCase() === "c")) {
        setIsMatrixActive(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMatrixActive]);

  const handleCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { type: "input", content: "", dir: currentDir }]);
      return;
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    const parts = trimmed.split(" ").filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newHistory = [...history, { type: "input", content: trimmed, dir: currentDir }];

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          content: [
            "Available commands:",
            "  help              Show this help list",
            "  neofetch          Display macOS system info & ASCII art",
            "  clear             Clear the terminal screen",
            "  ls                List files and directories",
            "  pwd               Print current working directory",
            "  cd <dir>          Change directory (e.g. cd Desktop, cd ..)",
            "  cat <file>        View contents of a file",
            "  echo <text>       Display text on screen",
            "  date              Print current system date and time",
            "  whoami            Print current logged in username",
            "  uname -a          Print Darwin system kernel info",
            "  say <message>     Speak aloud using text-to-speech voice",
            "  open <app>        Launch an app (e.g. open safari, open calc)",
            "  weather [city]    View ASCII weather forecast",
            "  cmatrix           Run Matrix digital rain (Press Esc to exit)",
            "  theme <color>     Change theme (default, amber, green, hacker)",
            "  history           List recently executed commands",
            "  exit              Close Terminal window",
          ].join("\n"),
        });
        break;

      case "clear":
        setHistory([]);
        setCurrentInput("");
        return;

      case "neofetch":
      case "fastfetch":
        newHistory.push({
          type: "neofetch",
          content: {
            user: `${username.toLowerCase()}@${hostname.toLowerCase()}`,
            os: "macOS RobsHs 15.3 (Build 26R01) aarch64",
            host: "MacBook Pro - RobsHs Edition (Apple Silicon M4 Pro)",
            kernel: "Darwin 24.3.0",
            uptime: "4 days, 12 hours, 38 mins",
            packages: "148 (brew)",
            shell: "zsh 5.9 (arm64-apple-darwin24.0)",
            resolution: `${window.innerWidth}x${window.innerHeight} @ 120Hz (ProMotion)`,
            de: "Aqua (Liquid Glass UI)",
            wm: "Quartz Compositor",
            terminal: "Apple Terminal 2.15",
            cpu: "Apple M4 Pro (14 cores, 10 performance and 4 efficiency)",
            gpu: "Apple M4 Pro (20-core Metal 3 Engine)",
            memory: "18.4 GB / 36.0 GB (Unified Memory)",
          },
        });
        break;

      case "pwd":
        newHistory.push({ type: "output", content: `/Users/${username}/${currentDir.replace(/^~/, "")}`.replace(/\/+/g, "/") });
        break;

      case "whoami":
        newHistory.push({ type: "output", content: username.toLowerCase().replace(/\s+/g, "_") });
        break;

      case "date":
        newHistory.push({ type: "output", content: new Date().toString() });
        break;

      case "uname":
        newHistory.push({
          type: "output",
          content: "Darwin MacBook-Pro.local 24.3.0 Darwin Kernel Version 24.3.0: Mon Jan 13 21:18:04 PST 2026; root:xnu-11215.81.4~3/RELEASE_ARM64_T6030 arm64",
        });
        break;

      case "ls": {
        const items = fs[currentDir] || [];
        newHistory.push({
          type: "ls",
          items: items.map((name) => ({
            name,
            isDir: !name.includes(".") && name !== "README.md" && name !== ".zshrc",
          })),
        });
        break;
      }

      case "cd": {
        const target = args[0] || "~";
        if (target === "~" || target === "") {
          setCurrentDir("~");
        } else if (target === ".." || target === "../") {
          if (currentDir === "~") {
            newHistory.push({ type: "output", content: "cd: permission denied: /Users" });
          } else {
            setCurrentDir("~");
          }
        } else {
          const resolved = target.startsWith("~/") ? target : `${currentDir}/${target}`.replace("~//", "~/");
          if (fs[resolved]) {
            setCurrentDir(resolved);
          } else if (fs[`~/${target}`]) {
            setCurrentDir(`~/${target}`);
          } else {
            newHistory.push({ type: "error", content: `cd: no such file or directory: ${target}` });
          }
        }
        break;
      }

      case "cat": {
        const file = args[0];
        if (!file) {
          newHistory.push({ type: "error", content: "cat: missing file argument" });
        } else if (fileContents[file]) {
          newHistory.push({ type: "output", content: fileContents[file] });
        } else {
          newHistory.push({ type: "error", content: `cat: ${file}: No such file or directory` });
        }
        break;
      }

      case "echo":
        newHistory.push({ type: "output", content: args.join(" ") });
        break;

      case "say": {
        const phrase = args.join(" ") || "Hello from macOS Web Simulator!";
        newHistory.push({ type: "output", content: `Speaking: "${phrase}"` });
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
        break;
      }

      case "cmatrix":
        setIsMatrixActive(true);
        newHistory.push({ type: "output", content: "Entering Matrix rain. Press Escape or Ctrl+C to return." });
        break;

      case "weather": {
        const city = args.join(" ") || "San Francisco";
        newHistory.push({
          type: "output",
          content: [
            `Weather report: ${city}`,
            "      \\   /     Clear",
            "       .-.      72 °F (22 °C)",
            "    ― (   ) ―   Wind: 8 mph WSW",
            "       `-’      Humidity: 54%",
            "      /   \\     Visibility: 10 mi",
          ].join("\n"),
        });
        break;
      }

      case "open": {
        const targetApp = args[0]?.toLowerCase();
        if (!targetApp) {
          newHistory.push({ type: "error", content: "Usage: open <app_name> (e.g. open safari, open calc, open notes)" });
        } else {
          const appMap = {
            safari: "Safari",
            calc: "Calculator",
            calculator: "Calculator",
            terminal: "Terminal",
            finder: "Finder",
            settings: "Settings",
            spotify: "Music",
            music: "Music",
            notes: "Notes",
            messages: "Messages",
            mail: "Mail",
            photos: "Photos",
            gallery: "Photos",
          };
          const matched = appMap[targetApp];
          if (matched) {
            newHistory.push({ type: "output", content: `Opening ${matched}...` });
            window.dispatchEvent(new CustomEvent("os_open_app_request", { detail: { appId: matched } }));
          } else {
            newHistory.push({ type: "error", content: `open: Application '${args[0]}' not found.` });
          }
        }
        break;
      }

      case "theme": {
        const chosen = args[0]?.toLowerCase();
        if (["default", "amber", "green", "hacker"].includes(chosen)) {
          setTheme(chosen);
          newHistory.push({ type: "output", content: `Terminal theme updated to: ${chosen}` });
        } else {
          newHistory.push({ type: "error", content: "Available themes: default, amber, green, hacker" });
        }
        break;
      }

      case "history":
        newHistory.push({
          type: "output",
          content: commandHistory.map((item, idx) => `  ${idx + 1}  ${item}`).join("\n"),
        });
        break;

      case "exit":
        if (windowId) {
          closeApp(windowId);
          return;
        }
        break;

      default:
        newHistory.push({
          type: "error",
          content: `zsh: command not found: ${cmd}. Type 'help' to see available commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setCurrentInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextPointer = historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
        setHistoryPointer(nextPointer);
        setCurrentInput(commandHistory[nextPointer]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer !== -1) {
        const nextPointer = historyPointer + 1;
        if (nextPointer < commandHistory.length) {
          setHistoryPointer(nextPointer);
          setCurrentInput(commandHistory[nextPointer]);
        } else {
          setHistoryPointer(-1);
          setCurrentInput("");
        }
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setHistory([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setHistory((prev) => [...prev, { type: "input", content: `${currentInput}^C`, dir: currentDir }]);
      setCurrentInput("");
      setHistoryPointer(-1);
    }
  };

  // Color theme mapping
  const themeClasses = {
    default: "bg-[#18181b]/95 text-[#f4f4f5]",
    amber: "bg-[#1a1202]/95 text-[#fbbf24]",
    green: "bg-[#051a08]/95 text-[#4ade80]",
    hacker: "bg-[#000000]/98 text-[#00ff66]",
  };

  return (
    <div
      className={`h-full w-full flex flex-col font-mono text-[13px] select-text relative overflow-hidden backdrop-blur-2xl ${themeClasses[theme] || themeClasses.default}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Unified Window Titlebar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-white/10 bg-black/25 select-none shrink-0 window-drag-handle">
        <TrafficLights windowId={windowId} />
        <div className="flex items-center gap-1.5 text-xs text-white/70 font-sans font-medium">
          <span className="opacity-90">{username}</span>
          <span className="opacity-40">—</span>
          <span className="opacity-60">zsh</span>
          <span className="opacity-40">—</span>
          <span className="opacity-60">{currentDir}</span>
        </div>
        <div className="w-14 text-right text-[10px] text-white/30 font-sans">80x24</div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-2">
        {history.map((entry, idx) => (
          <div key={idx} className="leading-relaxed">
            {entry.type === "input" ? (
              <div className="flex items-start gap-2">
                <span className="text-[#38bdf8] font-bold">{username}@{hostname}</span>
                <span className="text-[#a855f7]">{entry.dir}</span>
                <span className="text-white/60">%</span>
                <span className="text-white">{entry.content}</span>
              </div>
            ) : entry.type === "error" ? (
              <div className="text-red-400 whitespace-pre-wrap">{entry.content}</div>
            ) : entry.type === "neofetch" ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-2">
                {/* Rainbow Apple ASCII Art */}
                <div className="md:col-span-4 font-mono text-[11px] leading-tight select-none font-bold">
                  <div className="text-emerald-400">                    c.'</div>
                  <div className="text-emerald-400">                 ,xNMM.</div>
                  <div className="text-emerald-400">               .OMMMMo</div>
                  <div className="text-emerald-400">               OMMM0,</div>
                  <div className="text-yellow-400">     .;loddo:' loolloddol;.</div>
                  <div className="text-yellow-400">   cKMMMMMMMMMMNWMMMMMMMMMM0:</div>
                  <div className="text-yellow-400"> .KMMMMMMMMMMMMMMMMMMMMMMMWd.</div>
                  <div className="text-amber-500"> XMMMMMMMMMMMMMMMMMMMMMMMX.</div>
                  <div className="text-amber-500">;MMMMMMMMMMMMMMMMMMMMMMMM:</div>
                  <div className="text-red-500">:MMMMMMMMMMMMMMMMMMMMMMMM:</div>
                  <div className="text-red-500">.MMMMMMMMMMMMMMMMMMMMMMMMX.</div>
                  <div className="text-purple-400"> kMMMMMMMMMMMMMMMMMMMMMMMWd.</div>
                  <div className="text-purple-400">  'XMMMMMMMMMMMMMMMMMMMMMMk.</div>
                  <div className="text-blue-400">    'OWMMMMMMMMMMMMMMMMMMO.</div>
                  <div className="text-blue-400">      .:dKWMMMMMMMMMWKx:.</div>
                  <div className="text-blue-400">          .ldkOOkdl.</div>
                </div>
                {/* Specs */}
                <div className="md:col-span-8 space-y-0.5 text-xs">
                  <div className="font-bold text-[#38bdf8] pb-1 border-b border-white/10">
                    {entry.content.user}
                  </div>
                  <div><span className="text-yellow-400 font-bold">OS:</span> {entry.content.os}</div>
                  <div><span className="text-yellow-400 font-bold">Host:</span> {entry.content.host}</div>
                  <div><span className="text-yellow-400 font-bold">Kernel:</span> {entry.content.kernel}</div>
                  <div><span className="text-yellow-400 font-bold">Uptime:</span> {entry.content.uptime}</div>
                  <div><span className="text-yellow-400 font-bold">Packages:</span> {entry.content.packages}</div>
                  <div><span className="text-yellow-400 font-bold">Shell:</span> {entry.content.shell}</div>
                  <div><span className="text-yellow-400 font-bold">Resolution:</span> {entry.content.resolution}</div>
                  <div><span className="text-yellow-400 font-bold">DE:</span> {entry.content.de}</div>
                  <div><span className="text-yellow-400 font-bold">CPU:</span> {entry.content.cpu}</div>
                  <div><span className="text-yellow-400 font-bold">GPU:</span> {entry.content.gpu}</div>
                  <div><span className="text-yellow-400 font-bold">Memory:</span> {entry.content.memory}</div>
                  <div className="flex gap-1 pt-2">
                    <span className="inline-block w-4 h-3 bg-black"></span>
                    <span className="inline-block w-4 h-3 bg-red-500"></span>
                    <span className="inline-block w-4 h-3 bg-emerald-500"></span>
                    <span className="inline-block w-4 h-3 bg-yellow-500"></span>
                    <span className="inline-block w-4 h-3 bg-blue-500"></span>
                    <span className="inline-block w-4 h-3 bg-purple-500"></span>
                    <span className="inline-block w-4 h-3 bg-cyan-500"></span>
                    <span className="inline-block w-4 h-3 bg-white"></span>
                  </div>
                </div>
              </div>
            ) : entry.type === "ls" ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
                {entry.items.map((item, i) => (
                  <span
                    key={i}
                    className={`font-semibold ${item.isDir ? "text-[#60a5fa]" : "text-white/80"}`}
                  >
                    {item.name}
                    {item.isDir ? "/" : ""}
                  </span>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-white/90">{entry.content}</div>
            )}
          </div>
        ))}

        {/* Current Active Input Prompt */}
        {!isMatrixActive && (
          <div className="flex items-center gap-2">
            <span className="text-[#38bdf8] font-bold">{username}@{hostname}</span>
            <span className="text-[#a855f7]">{currentDir}</span>
            <span className="text-white/60">%</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-white"
              autoFocus
              spellCheck={false}
            />
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Matrix Canvas Overlay */}
      {isMatrixActive && (
        <div className="absolute inset-0 bg-black z-30 flex flex-col">
          <div className="absolute top-2 right-4 z-40 text-xs text-white/70 bg-black/80 px-2.5 py-1 rounded border border-white/20">
            Press <kbd className="font-bold text-emerald-400">Esc</kbd> to exit
          </div>
          <canvas ref={matrixCanvasRef} className="w-full h-full" />
        </div>
      )}
    </div>
  );
}

