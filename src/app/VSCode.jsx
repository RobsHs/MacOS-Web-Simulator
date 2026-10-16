import React, { useState, useEffect, useRef, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { useAppStore } from "../store/Appstore";
import { playPopSound } from "../utils/soundEffects";
import {
  Folder, File, FileCode, Play, Terminal, SplitSquareVertical,
  RefreshCw, Plus, Trash2, Edit3, Settings, Search, GitBranch,
  Bug, Puzzle, Eye, ChevronRight, ChevronDown, Check, X,
  Maximize2, Minimize2, Copy, Sparkles, Code2, Globe, Command,
  Sliders, Laptop, ExternalLink, AlertCircle, CheckCircle2
} from "lucide-react";

// Traffic lights component inside VS Code Titlebar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group shrink-0 px-3 py-2">
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

// Default initial workspace files
const DEFAULT_FILES = [
  {
    id: "index-html",
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello macOS</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="card">
    <div class="logo">⚡</div>
    <h1>Visual Studio Code</h1>
    <p>Running natively inside macOS RobsHs.</p>
    <div class="counter-box">
      <button id="counter-btn">Click me: 0</button>
      <button id="reset-btn">Reset</button>
    </div>
    <div id="output-log">Waiting for interaction...</div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  },
  {
    id: "styles-css",
    name: "styles.css",
    language: "css",
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  color: #f8fafc;
  padding: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.logo {
  font-size: 40px;
  margin-bottom: 12px;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.counter-box {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #0369a1;
  transform: translateY(-1px);
}

#reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

#reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

#output-log {
  font-size: 12px;
  color: #38bdf8;
  font-family: monospace;
}`,
  },
  {
    id: "app-js",
    name: "app.js",
    language: "javascript",
    content: `// Interactive JavaScript logic
let count = 0;
const counterBtn = document.getElementById("counter-btn");
const resetBtn = document.getElementById("reset-btn");
const logBox = document.getElementById("output-log");

function updateDisplay() {
  counterBtn.textContent = "Click me: " + count;
  logBox.textContent = "Current clicks: " + count + " at " + new Date().toLocaleTimeString();
  console.log("Counter updated:", count);
}

counterBtn.addEventListener("click", () => {
  count++;
  updateDisplay();
});

resetBtn.addEventListener("click", () => {
  count = 0;
  updateDisplay();
});

console.log("App initialized successfully inside VS Code Web!");`,
  },
  {
    id: "main-py",
    name: "main.py",
    language: "python",
    content: `# Python Demo in VS Code
import math

def calculate_primes(n):
    primes = []
    for num in range(2, n + 1):
        is_prime = True
        for i in range(2, int(math.isqrt(num)) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    return primes

print("=== Python Execution Demo ===")
results = calculate_primes(50)
print(f"Primes up to 50: {results}")
print(f"Total primes found: {len(results)}")`,
  },
  {
    id: "readme-md",
    name: "README.md",
    language: "markdown",
    content: `# Visual Studio Code for macOS Simulator

Welcome to the full-featured **Visual Studio Code** inside macOS RobsHs!

## 🚀 Features
- **Real Microsoft Monaco Editor**: Syntax highlighting, IntelliSense, auto-brackets, minimap, formatting.
- **Multiple Languages**: HTML, CSS, JavaScript, TypeScript, Python, Markdown, JSON.
- **Interactive Terminal**: Type shell commands (\`ls\`, \`cat\`, \`run\`, \`echo\`, \`clear\`).
- **Live Preview**: Click the green **Run (▶)** button to see your HTML/CSS/JS code render in real time.
- **Local Persistence**: All your files and code are automatically saved to \`localStorage\`.
- **Customizable**: Create, rename, and delete files with ease.`,
  },
];

// Helper to get file icon and language by file extension
function getFileMeta(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  switch (ext) {
    case "html":
      return { lang: "html", color: "text-orange-500", label: "HTML" };
    case "css":
      return { lang: "css", color: "text-blue-400", label: "CSS" };
    case "js":
    case "jsx":
      return { lang: "javascript", color: "text-yellow-400", label: "JS" };
    case "ts":
    case "tsx":
      return { lang: "typescript", color: "text-sky-400", label: "TS" };
    case "py":
      return { lang: "python", color: "text-emerald-400", label: "PY" };
    case "json":
      return { lang: "json", color: "text-amber-300", label: "JSON" };
    case "md":
      return { lang: "markdown", color: "text-purple-400", label: "MD" };
    default:
      return { lang: "plaintext", color: "text-gray-400", label: "TXT" };
  }
}

export default function VSCode({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // Files & Tabs state (persisted in localStorage)
  const [files, setFiles] = useState(() => {
    try {
      const saved = localStorage.getItem("macos_vscode_files");
      return saved ? JSON.parse(saved) : DEFAULT_FILES;
    } catch {
      return DEFAULT_FILES;
    }
  });

  const [activeFileId, setActiveFileId] = useState("index-html");
  const [openTabs, setOpenTabs] = useState(["index-html", "styles-css", "app-js"]);

  // UI Panels state
  const [activeActivity, setActiveActivity] = useState("explorer"); // explorer, search, git, debug, extensions, settings
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState(false);
  const [bottomTab, setBottomTab] = useState("terminal"); // terminal, preview, output, problems

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState([
    "Microsoft Windows / macOS Darwin Kernel Version 23.5.0",
    "Visual Studio Code Terminal initialized.",
    "Type 'help' to see available commands or 'run app.js' to execute.",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef(null);

  // Output console logs
  const [consoleLogs, setConsoleLogs] = useState([
    "[System] VS Code Monaco runtime ready.",
  ]);

  // Search in files
  const [searchQuery, setSearchQuery] = useState("");

  // New File modal state
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  // Save files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("macos_vscode_files", JSON.stringify(files));
    } catch (e) {
      console.error(e);
    }
  }, [files]);

  // Active file object
  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0];
  }, [files, activeFileId]);

  // Scroll terminal to bottom
  useEffect(() => {
    if (isBottomPanelVisible && bottomTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory, isBottomPanelVisible, bottomTab]);

  // Handle code change in Monaco Editor
  const handleEditorChange = (newContent) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newContent || "" } : f))
    );
  };

  // Open a file tab
  const openFile = (fileId) => {
    playPopSound();
    setActiveFileId(fileId);
    if (!openTabs.includes(fileId)) {
      setOpenTabs((prev) => [...prev, fileId]);
    }
  };

  // Close a file tab
  const closeTab = (e, fileId) => {
    e.stopPropagation();
    playPopSound();
    const nextTabs = openTabs.filter((id) => id !== fileId);
    setOpenTabs(nextTabs);
    if (activeFileId === fileId && nextTabs.length > 0) {
      setActiveFileId(nextTabs[nextTabs.length - 1]);
    }
  };

  // Create new file
  const handleCreateFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const trimmed = newFileName.trim();
    const meta = getFileMeta(trimmed);
    const newFile = {
      id: `file-${Date.now()}`,
      name: trimmed,
      language: meta.lang,
      content: meta.lang === "html" ? "<!DOCTYPE html>\n<html>\n<body>\n  <h1>New Page</h1>\n</body>\n</html>" : `// ${trimmed}\n`,
    };

    setFiles((prev) => [...prev, newFile]);
    setOpenTabs((prev) => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
    setNewFileName("");
    setIsCreatingFile(false);
    playPopSound();
  };

  // Delete file
  const handleDeleteFile = (e, fileId) => {
    e.stopPropagation();
    if (files.length <= 1) return;
    playPopSound();
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setOpenTabs((prev) => prev.filter((id) => id !== fileId));
    if (activeFileId === fileId) {
      const remaining = files.filter((f) => f.id !== fileId);
      setActiveFileId(remaining[0].id);
    }
  };

  // Run Code / Live Preview
  const handleRunCode = () => {
    playPopSound();
    setIsBottomPanelVisible(true);

    if (activeFile?.language === "html" || activeFile?.name.endsWith(".html")) {
      setBottomTab("preview");
    } else if (activeFile?.language === "javascript") {
      setBottomTab("output");
      // Execute in sandbox and capture console.log
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
          originalLog.apply(console, args);
        };

        const runnable = new Function(activeFile.content);
        runnable();
        console.log = originalLog;

        setConsoleLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Running ${activeFile.name}...`,
          ...(logs.length > 0 ? logs : ["(Code executed with no console output)"]),
          "Process finished with exit code 0.",
        ]);
      } catch (err) {
        setConsoleLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Error running ${activeFile.name}:`,
          `❌ ${err.message}`,
        ]);
      }
    } else if (activeFile?.language === "python") {
      setBottomTab("terminal");
      setTerminalHistory((prev) => [
        ...prev,
        `$ python ${activeFile.name}`,
        "=== Python 3.12.0 Virtual Environment ===",
        "Execution output:",
        "Primes up to 50: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]",
        "Total primes found: 15",
        "✓ Program completed successfully.",
      ]);
    } else {
      setBottomTab("preview");
    }
  };

  // Handle Terminal input commands
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const parts = cmd.split(" ");
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    let reply = [];
    switch (command) {
      case "help":
        reply = [
          "Available commands:",
          "  ls, dir           - List files in workspace",
          "  cat [file]        - Display file contents",
          "  node [file]       - Run JavaScript file",
          "  python [file]     - Run Python file",
          "  run               - Run active project preview",
          "  clear             - Clear terminal screen",
          "  echo [text]       - Print text",
          "  date              - Show current date & time",
          "  npm run dev       - Start simulated Vite dev server",
        ];
        break;
      case "ls":
      case "dir":
        reply = files.map((f) => `  ${f.name.padEnd(20)} (${f.language})`);
        break;
      case "cat":
        {
          const found = files.find((f) => f.name.toLowerCase() === arg.toLowerCase());
          if (found) {
            reply = found.content.split("\n");
          } else {
            reply = [`cat: ${arg}: No such file`];
          }
        }
        break;
      case "node":
      case "run":
        {
          const target = arg ? files.find((f) => f.name.toLowerCase() === arg.toLowerCase()) : activeFile;
          if (target) {
            reply = [
              `Running ${target.name}...`,
              `[Output] File executed successfully via V8 engine.`,
            ];
          } else {
            reply = [`File not found: ${arg}`];
          }
        }
        break;
      case "python":
        reply = [
          `Python 3.12.0 running ${arg || activeFile?.name}...`,
          "✓ Process terminated with exit code 0.",
        ];
        break;
      case "npm":
        if (arg === "run dev" || arg === "start") {
          reply = [
            "> my-project@1.0.0 dev",
            "> vite",
            "",
            "  VITE v5.2.0  ready in 184 ms",
            "",
            "  ➜  Local:   http://localhost:5173/",
            "  ➜  Network: use --host to expose",
            "  ➜  press h + enter to show help",
          ];
        } else {
          reply = [`npm: command '${arg}' executed.`];
        }
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      case "echo":
        reply = [arg];
        break;
      case "date":
        reply = [new Date().toString()];
        break;
      default:
        reply = [`zsh: command not found: ${command}. Type 'help' for available commands.`];
    }

    setTerminalHistory((prev) => [...prev, `$ ${cmd}`, ...reply]);
    setTerminalInput("");
  };

  // Combined HTML/CSS/JS for Live Preview iframe
  const livePreviewHtml = useMemo(() => {
    const htmlFile = files.find((f) => f.name.endsWith(".html"))?.content || "<h1>No HTML found</h1>";
    const cssFile = files.find((f) => f.name.endsWith(".css"))?.content || "";
    const jsFile = files.find((f) => f.name.endsWith(".js"))?.content || "";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssFile}</style>
        </head>
        <body>
          ${htmlFile.replace(/<!DOCTYPE html>|<\/?html>|<\/?head>|<\/?body>/gi, "")}
          <script>${jsFile}<\/script>
        </body>
      </html>
    `;
  }, [files]);

  return (
    <div className="vscode-root w-full h-full flex flex-col bg-[#1e1e1e] text-[#cccccc] font-sans select-none overflow-hidden text-[13px]">
      {/* 1. Title Bar (macOS Window Drag Handle + Traffic Lights + Search Capsule + Action Icons) */}
      <div className="window-drag-handle h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between shrink-0 select-none cursor-grab active:cursor-grabbing px-1">
        {/* Left: Traffic Lights */}
        <div className="flex items-center">
          <TrafficLights windowId={windowId} />
          <span className="text-xs text-[#8c8c8c] font-medium hidden sm:inline ml-1">Visual Studio Code</span>
        </div>

        {/* Center: Command Palette / File Quick Switcher */}
        <div
          onClick={() => {
            playPopSound();
            setIsSidebarVisible(true);
            setActiveActivity("explorer");
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2a2a2a] hover:bg-[#333333] border border-[#3c3c3c] text-xs text-[#cccccc] cursor-pointer transition max-w-sm w-full mx-4 justify-center shadow-xs"
        >
          <Search size={12} className="text-[#8c8c8c]" />
          <span className="truncate">my-project &gt; {activeFile?.name || "workspace"}</span>
          <span className="text-[10px] bg-[#1e1e1e] text-[#8c8c8c] px-1.5 py-0.5 rounded border border-[#3c3c3c] ml-auto">
            ⌘P
          </span>
        </div>

        {/* Right Action Icons: Run, Split, Terminal, Layout */}
        <div className="flex items-center gap-1 pr-2">
          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0e639c] hover:bg-[#1177bb] text-white font-medium text-xs transition shadow-xs"
            title="Run Code / Live Preview (▶)"
          >
            <Play size={11} className="fill-white" />
            <span className="hidden md:inline">Run</span>
          </button>

          {/* Toggle Terminal Button */}
          <button
            onClick={() => {
              playPopSound();
              setIsBottomPanelVisible(!isBottomPanelVisible);
            }}
            className={`p-1.5 rounded transition ${
              isBottomPanelVisible ? "bg-[#333333] text-white" : "hover:bg-[#2a2a2a] text-[#8c8c8c]"
            }`}
            title="Toggle Panel / Terminal"
          >
            <Terminal size={14} />
          </button>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => {
              playPopSound();
              setIsSidebarVisible(!isSidebarVisible);
            }}
            className={`p-1.5 rounded transition ${
              isSidebarVisible ? "bg-[#333333] text-white" : "hover:bg-[#2a2a2a] text-[#8c8c8c]"
            }`}
            title="Toggle Primary Sidebar"
          >
            <SplitSquareVertical size={14} />
          </button>
        </div>
      </div>

      {/* 2. Main Workbench Area: Activity Bar + Sidebar + Editor + Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* A. Activity Bar (Far Left Icon Strip) */}
        <div className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col items-center py-2 shrink-0 select-none justify-between">
          <div className="flex flex-col items-center gap-2 w-full">
            <button
              onClick={() => {
                if (activeActivity === "explorer") setIsSidebarVisible(!isSidebarVisible);
                else {
                  setActiveActivity("explorer");
                  setIsSidebarVisible(true);
                }
              }}
              className={`w-full py-2 flex items-center justify-center relative transition ${
                activeActivity === "explorer" && isSidebarVisible ? "text-white" : "text-[#858585] hover:text-white"
              }`}
              title="Explorer"
            >
              {activeActivity === "explorer" && isSidebarVisible && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
              )}
              <Folder size={19} />
            </button>

            <button
              onClick={() => {
                if (activeActivity === "search") setIsSidebarVisible(!isSidebarVisible);
                else {
                  setActiveActivity("search");
                  setIsSidebarVisible(true);
                }
              }}
              className={`w-full py-2 flex items-center justify-center relative transition ${
                activeActivity === "search" && isSidebarVisible ? "text-white" : "text-[#858585] hover:text-white"
              }`}
              title="Search"
            >
              {activeActivity === "search" && isSidebarVisible && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
              )}
              <Search size={19} />
            </button>

            <button
              onClick={() => {
                if (activeActivity === "git") setIsSidebarVisible(!isSidebarVisible);
                else {
                  setActiveActivity("git");
                  setIsSidebarVisible(true);
                }
              }}
              className={`w-full py-2 flex items-center justify-center relative transition ${
                activeActivity === "git" && isSidebarVisible ? "text-white" : "text-[#858585] hover:text-white"
              }`}
              title="Source Control"
            >
              {activeActivity === "git" && isSidebarVisible && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
              )}
              <GitBranch size={19} />
            </button>

            <button
              onClick={() => {
                if (activeActivity === "extensions") setIsSidebarVisible(!isSidebarVisible);
                else {
                  setActiveActivity("extensions");
                  setIsSidebarVisible(true);
                }
              }}
              className={`w-full py-2 flex items-center justify-center relative transition ${
                activeActivity === "extensions" && isSidebarVisible ? "text-white" : "text-[#858585] hover:text-white"
              }`}
              title="Extensions"
            >
              {activeActivity === "extensions" && isSidebarVisible && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
              )}
              <Puzzle size={19} />
            </button>
          </div>

          {/* Bottom Settings Icon */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={() => {
                setActiveActivity("settings");
                setIsSidebarVisible(true);
              }}
              className="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* B. Primary Sidebar (Explorer / Search / Git / Extensions) */}
        {isSidebarVisible && (
          <aside className="w-56 bg-[#181818] border-r border-[#2b2b2b] flex flex-col shrink-0 overflow-hidden select-none">
            {/* Explorer Header */}
            {activeActivity === "explorer" && (
              <>
                <div className="px-4 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#bbbbbb] border-b border-[#252525]">
                  <span>Explorer</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsCreatingFile(true)}
                      className="p-1 hover:bg-[#2a2a2a] rounded text-[#cccccc]"
                      title="New File"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => {
                        playPopSound();
                        setFiles(DEFAULT_FILES);
                      }}
                      className="p-1 hover:bg-[#2a2a2a] rounded text-[#cccccc]"
                      title="Reset Files"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>

                {/* New File Inline Prompt */}
                {isCreatingFile && (
                  <form onSubmit={handleCreateFile} className="p-2 border-b border-[#2b2b2b]">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. component.jsx"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={() => {
                        if (!newFileName) setIsCreatingFile(false);
                      }}
                      className="w-full bg-[#2a2a2a] border border-[#007acc] text-xs px-2 py-1 rounded outline-none text-white font-mono"
                    />
                  </form>
                )}

                {/* Workspace Folder Accordion */}
                <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
                  <div className="px-2 py-1 flex items-center gap-1 text-xs font-semibold text-[#cccccc]">
                    <ChevronDown size={14} />
                    <span className="uppercase tracking-wider">MY-PROJECT</span>
                  </div>

                  {/* File List */}
                  <div className="space-y-0.5 pl-3 pr-1">
                    {files.map((f) => {
                      const meta = getFileMeta(f.name);
                      const isSelected = f.id === activeFileId;
                      return (
                        <div
                          key={f.id}
                          onClick={() => openFile(f.id)}
                          className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer text-xs transition ${
                            isSelected
                              ? "bg-[#37373d] text-white font-medium"
                              : "hover:bg-[#2a2d2e] text-[#cccccc]"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
                            <span className="truncate">{f.name}</span>
                          </div>
                          {files.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteFile(e, f.id)}
                              className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 transition"
                              title="Delete file"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Search Tab */}
            {activeActivity === "search" && (
              <div className="p-3 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#bbbbbb] block">Search</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3c3c3c] text-xs px-2.5 py-1.5 rounded outline-none text-white"
                  />
                </div>
                {searchQuery && (
                  <div className="space-y-1 text-xs text-gray-400">
                    <span className="text-[11px] font-semibold text-gray-300">Results:</span>
                    {files
                      .filter((f) => f.content.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((f) => (
                        <div
                          key={f.id}
                          onClick={() => openFile(f.id)}
                          className="p-1.5 rounded hover:bg-[#2a2a2a] cursor-pointer text-[#cccccc]"
                        >
                          <div className="font-medium text-white">{f.name}</div>
                          <div className="text-[10.5px] text-gray-500 truncate">Match found in file</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Source Control Tab */}
            {activeActivity === "git" && (
              <div className="p-3 space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#bbbbbb] block">Source Control</span>
                <div className="p-2.5 rounded-lg bg-[#252526] border border-[#333333] space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 size={14} />
                    <span>Branch: main</span>
                  </div>
                  <p className="text-[11px] text-gray-400">All changes staged and synced locally with Git repository.</p>
                </div>
              </div>
            )}

            {/* Extensions Tab */}
            {activeActivity === "extensions" && (
              <div className="p-3 space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#bbbbbb] block">Extensions</span>
                <div className="space-y-2">
                  {[
                    { name: "Prettier - Code Formatter", desc: "Code formatting using prettier", installed: true },
                    { name: "Tailwind CSS IntelliSense", desc: "Intelligent Tailwind tooling", installed: true },
                    { name: "Python", desc: "IntelliSense, linting, debugging", installed: true },
                    { name: "ESLint", desc: "Integrates ESLint into VS Code", installed: true },
                  ].map((ext) => (
                    <div key={ext.name} className="p-2 rounded bg-[#252526] border border-[#333333]">
                      <div className="font-medium text-white flex items-center justify-between">
                        <span>{ext.name}</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Enabled</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 mt-0.5 leading-snug">{ext.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* C. Center Editor Area (Tabs + Monaco Code Editor) */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
          {/* File Tabs Bar */}
          <div className="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center overflow-x-auto scrollbar-thin select-none">
            {openTabs.map((tabId) => {
              const file = files.find((f) => f.id === tabId);
              if (!file) return null;
              const meta = getFileMeta(file.name);
              const isActive = file.id === activeFileId;

              return (
                <div
                  key={file.id}
                  onClick={() => openFile(file.id)}
                  className={`group h-full flex items-center gap-2 px-3.5 border-r border-[#2b2b2b] cursor-pointer text-xs font-normal transition shrink-0 ${
                    isActive
                      ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]"
                      : "bg-[#181818] text-[#969696] hover:bg-[#1f1f1f] hover:text-[#cccccc]"
                  }`}
                >
                  <span className={`text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => closeTab(e, file.id)}
                    className="p-0.5 rounded-full hover:bg-[#333333] hover:text-white text-gray-500 transition ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="h-6 bg-[#1e1e1e] border-b border-[#2b2b2b] px-4 flex items-center gap-1.5 text-[11px] text-[#8c8c8c] select-none shrink-0 font-mono">
            <span>my-project</span>
            <ChevronRight size={11} />
            <span className="text-[#cccccc]">{activeFile?.name}</span>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative overflow-hidden">
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                theme={isDarkMode ? "vs-dark" : "vs-dark"}
                onChange={handleEditorChange}
                options={{
                  fontSize: 13.5,
                  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  lineNumbers: "on",
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  renderLineHighlight: "all",
                  folding: true,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No file open. Click a file from Explorer to begin editing.
              </div>
            )}
          </div>

          {/* D. Bottom Panel: Terminal, Live Preview, Output */}
          {isBottomPanelVisible && (
            <div className="h-56 bg-[#181818] border-t border-[#2b2b2b] flex flex-col shrink-0 select-none overflow-hidden">
              {/* Panel Tabs Header */}
              <div className="h-8 bg-[#181818] border-b border-[#2b2b2b] px-3 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setBottomTab("terminal")}
                    className={`pb-1 transition ${
                      bottomTab === "terminal" ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    TERMINAL
                  </button>
                  <button
                    onClick={() => setBottomTab("preview")}
                    className={`pb-1 flex items-center gap-1.5 transition ${
                      bottomTab === "preview" ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Globe size={12} className="text-sky-400" />
                    <span>LIVE PREVIEW</span>
                  </button>
                  <button
                    onClick={() => setBottomTab("output")}
                    className={`pb-1 transition ${
                      bottomTab === "output" ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    OUTPUT
                  </button>
                  <button
                    onClick={() => setBottomTab("problems")}
                    className={`pb-1 transition ${
                      bottomTab === "problems" ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    PROBLEMS (0)
                  </button>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <button
                    onClick={() => setIsBottomPanelVisible(false)}
                    className="hover:text-white transition"
                    title="Close Panel"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto bg-[#181818] p-2.5 font-mono text-xs">
                {/* 1. Terminal Shell */}
                {bottomTab === "terminal" && (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-1 text-[#cccccc]">
                      {terminalHistory.map((line, idx) => (
                        <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                          {line}
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>

                    {/* Terminal Input Line */}
                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-[#252525]">
                      <span className="text-emerald-400 font-bold shrink-0">➜ my-project git:(main)</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Type 'help', 'ls', 'run', 'node app.js'..."
                        className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
                      />
                    </form>
                  </div>
                )}

                {/* 2. Live Web Preview */}
                {bottomTab === "preview" && (
                  <div className="h-full w-full rounded bg-white overflow-hidden shadow-inner">
                    <iframe
                      srcDoc={livePreviewHtml}
                      title="VS Code Live Preview"
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-modals"
                    />
                  </div>
                )}

                {/* 3. Output Logs */}
                {bottomTab === "output" && (
                  <div className="h-full overflow-y-auto space-y-1 text-[#cccccc]">
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Problems */}
                {bottomTab === "problems" && (
                  <div className="h-full flex items-center justify-center text-gray-500 gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>No problems have been detected in the workspace.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] select-none font-sans shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 cursor-pointer hover:bg-black/10 px-1.5 py-0.5 rounded transition">
            <GitBranch size={11} />
            <span>main*</span>
          </div>
          <div className="flex items-center gap-1">
            <X size={11} />
            <span>0</span>
            <AlertCircle size={11} className="ml-1" />
            <span>0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="cursor-pointer hover:bg-black/10 px-1 rounded transition">Ln 1, Col 1</span>
          <span className="cursor-pointer hover:bg-black/10 px-1 rounded transition">Spaces: 2</span>
          <span className="cursor-pointer hover:bg-black/10 px-1 rounded transition">UTF-8</span>
          <span className="cursor-pointer hover:bg-black/10 px-1 rounded transition uppercase">
            {activeFile?.language || "PLAINTEXT"}
          </span>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-black/10 px-1.5 py-0.5 rounded transition">
            <Check size={11} />
            <span>Prettier</span>
          </div>
        </div>
      </div>
    </div>
  );
}

