import { useState, useRef, useEffect } from "react";
import { 
  FiSearch, 
  FiArrowLeft, 
  FiArrowRight, 
  FiRefreshCw, 
  FiHome, 
  FiLock, 
  FiExternalLink, 
  FiX, 
  FiPlay, 
  FiCheckCircle, 
  FiShare2, 
  FiThumbsUp, 
  FiCheck,
  FiFolder,
  FiStar,
  FiGitBranch,
  FiBookOpen,
  FiUsers,
  FiMapPin,
  FiBriefcase
} from "react-icons/fi";
import { FaYoutube, FaApple, FaGoogle, FaWikipediaW, FaGithub, FaStar, FaCodeBranch, FaBook } from "react-icons/fa";
import { useAppStore } from "../store/Appstore";

// Traffic lights inside the Safari unified toolbar
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

// Curated 100% playable, verified YouTube Videos
const CURATED_YOUTUBE_VIDEOS = [
  {
    id: "jfKfPfyJRdk",
    title: "lofi hip hop radio 📚 beats to relax/study to",
    channel: "Lofi Girl",
    verified: true,
    views: "68K watching now",
    time: "Live 24/7",
    duration: "LIVE",
    category: "Music",
    description: "Peaceful lofi hip hop beats to study, chill, relax and code to 24/7. Non-stop uninterrupted livestream with high quality audio."
  },
  {
    id: "4xDzrJKXOOY",
    title: "synthwave radio 🌌 beats to chill/game to",
    channel: "Lofi Girl",
    verified: true,
    views: "15K watching now",
    time: "Live 24/7",
    duration: "LIVE",
    category: "Music",
    description: "Cyberpunk retro 80s analog synthesizer beats for late night deep work, programming, and relaxing."
  },
  {
    id: "Tn6-PIqc4UM",
    title: "React in 100 Seconds",
    channel: "Fireship",
    verified: true,
    views: "2.4M views",
    time: "3 years ago",
    duration: "2:18",
    category: "Coding",
    description: "Learn React fundamentals in 100 seconds! What is React, virtual DOM, components, props, hooks, and why it took over frontend web development."
  },
  {
    id: "W6NZfCO5SIk",
    title: "JavaScript Course for Beginners – Your First Step to Web Development",
    channel: "Programming with Mosh",
    verified: true,
    views: "4.8M views",
    time: "2 years ago",
    duration: "1:00:15",
    category: "Coding",
    description: "Learn modern JavaScript programming essentials, variables, objects, functions, and arrays with clear step-by-step visual explanations."
  },
  {
    id: "kqtD5dpn9C8",
    title: "Python for Beginners - Learn Coding with Python in 1 Hour",
    channel: "Programming with Mosh",
    verified: true,
    views: "18.2M views",
    time: "3 years ago",
    duration: "1:00:03",
    category: "Coding",
    description: "Complete Python introduction for absolute beginners. Writing clean Python code, control flow, functions, and building simple programs."
  },
  {
    id: "bMknfKXIFA8",
    title: "React Course - Beginner's Tutorial for React JavaScript Library",
    channel: "freeCodeCamp.org",
    verified: true,
    views: "3.5M views",
    time: "2 years ago",
    duration: "11:55:27",
    category: "Coding",
    description: "Full in-depth comprehensive React course covering state management, effects, custom hooks, and modern component design patterns."
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Queen – Bohemian Rhapsody (Official Video Remastered)",
    channel: "Queen Official",
    verified: true,
    views: "1.7B views",
    time: "15 years ago",
    duration: "5:59",
    category: "Music",
    description: "The official Bohemian Rhapsody video remastered in stunning HD. Originally released in 1975, written by Freddie Mercury."
  },
  {
    id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You (Official Music Video)",
    channel: "Ed Sheeran",
    verified: true,
    views: "6.2B views",
    time: "7 years ago",
    duration: "4:23",
    category: "Music",
    description: "The official music video for Ed Sheeran - Shape of You. Taken from the record-breaking ÷ (Divide) studio album."
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Ed Sheeran - Perfect (Official Music Video)",
    channel: "Ed Sheeran",
    verified: true,
    views: "3.7B views",
    time: "6 years ago",
    duration: "4:39",
    category: "Music",
    description: "Official music video for 'Perfect' filmed in Hintertux, Austria, featuring Zoey Deutch."
  },
  {
    id: "OPf0YbXqDm0",
    title: "Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars",
    channel: "Mark Ronson",
    verified: true,
    views: "5.1B views",
    time: "9 years ago",
    duration: "4:30",
    category: "Music",
    description: "Official video for Uptown Funk by Mark Ronson featuring Bruno Mars. Multi-Grammy winning funk-pop anthem."
  },
  {
    id: "WPni755-Krg",
    title: "Study Music Alpha Waves: Relaxing Studying Music & Brain Concentration",
    channel: "Yellow Brick Cinema",
    verified: true,
    views: "89M views",
    time: "5 years ago",
    duration: "3:00:00",
    category: "Study",
    description: "Alpha wave background music designed to increase focus, soothe stress, and support deep cognitive work."
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",
    channel: "Rick Astley",
    verified: true,
    views: "1.5B views",
    time: "14 years ago",
    duration: "3:32",
    category: "Music",
    description: "The legendary official video remastered in 4K resolution. Directed by Simon West."
  }
];

// Helper to extract YouTube video ID from any URL or raw string
const extractYouTubeId = (input) => {
  if (!input) return null;
  const clean = input.trim();
  // 11 char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = clean.match(regExp);
  return match && match[1] ? match[1] : null;
};

// Fallback snapshot of RobsHs GitHub profile
const ROBSHS_PROFILE = {
  login: "RobsHs",
  name: "Gi∞",
  company: "SoftDOT",
  location: "Near MBG",
  bio: "High Risk\nHigh Income",
  avatar_url: "https://avatars.githubusercontent.com/u/181097688?v=4",
  html_url: "https://github.com/RobsHs",
  public_repos: 22,
  followers: 76,
  following: 76
};

// Fallback snapshot of RobsHs Repositories
const INITIAL_ROBSHS_REPOS = [
  {
    id: 1,
    name: "omnitools-ultimate",
    description: "OmniTools Ultimate - Full-Stack Web Application (Node.js/Express + Vanilla JS). iOS 26 Glassmorphism, Zero-Mock Utilities & Media Pipeline. Engineered by RobsHs.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stargazers_count: 5,
    forks_count: 1,
    html_url: "https://github.com/RobsHs/omnitools-ultimate",
    updated_at: "2026-10-17T11:40:00Z",
    isPinned: true
  },
  {
    id: 2,
    name: "devatlas",
    description: "Modern interactive developer atlas and developer tooling suite for high productivity workflows.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/devatlas",
    updated_at: "2026-10-15T09:20:00Z",
    isPinned: true
  },
  {
    id: 3,
    name: "WIN98",
    description: "Classic Windows 98 operating system web simulator with authentic shell, retro apps, and vintage audio.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/WIN98",
    updated_at: "2026-10-12T14:10:00Z",
    isPinned: true
  },
  {
    id: 4,
    name: "windhawk-mods",
    description: "The official collection of Windhawk customization mods for desktop enhancement.",
    language: "C++",
    languageColor: "#f34b7d",
    stargazers_count: 2,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/windhawk-mods",
    updated_at: "2026-10-08T18:00:00Z",
    isPinned: true
  },
  {
    id: 5,
    name: "RobsHs",
    description: "Special GitHub profile repository and portfolio configuration for RobsHs.",
    language: "Markdown",
    languageColor: "#083fa1",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/RobsHs",
    updated_at: "2026-10-01T10:00:00Z",
    isPinned: true
  },
  {
    id: 6,
    name: "simrs-dashboard",
    description: "Modern Hospital Management Information System (SIMRS) analytics dashboard.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/simrs-dashboard",
    updated_at: "2026-09-28T08:30:00Z",
    isPinned: true
  },
  {
    id: 7,
    name: "To-Do-List-Life-Dashboard-CodingCamp-",
    description: "Full-featured task management and life dashboard built during CodingCamp.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/To-Do-List-Life-Dashboard-CodingCamp-",
    updated_at: "2026-09-20T12:00:00Z"
  },
  {
    id: 8,
    name: "custom-start-button",
    description: "Native Windows shell utility to customize taskbar start button behaviors.",
    language: "C++",
    languageColor: "#f34b7d",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/RobsHs/custom-start-button",
    updated_at: "2026-09-15T15:20:00Z"
  }
];

export function Safari({ initialUrl = "https://www.google.com/webhp?igu=1", windowId, isDragging, isResizing }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // YouTube Integrated Player State
  const [ytActiveVideo, setYtActiveVideo] = useState(CURATED_YOUTUBE_VIDEOS[0]);
  const [ytCategory, setYtCategory] = useState("Semua");
  const [ytSearchQuery, setYtSearchQuery] = useState("");
  const [ytCustomSearchActive, setYtCustomSearchActive] = useState(false);
  const [ytLiked, setYtLiked] = useState(false);
  const [ytCopied, setYtCopied] = useState(false);

  // GitHub Viewer State
  const [githubProfile, setGithubProfile] = useState(ROBSHS_PROFILE);
  const [githubRepos, setGithubRepos] = useState(INITIAL_ROBSHS_REPOS);
  const [githubRepoSearch, setGithubRepoSearch] = useState("");
  const [githubActiveTab, setGithubActiveTab] = useState("overview"); // overview | repositories
  const [isFollowingGithub, setIsFollowingGithub] = useState(false);

  const iframeRef = useRef(null);

  // Check URL types
  const isYouTube = currentUrl.toLowerCase().includes("youtube.com") || currentUrl.toLowerCase().includes("youtu.be");
  const isGitHub = currentUrl.toLowerCase().includes("github.com");

  // Fetch live RobsHs data if connected
  useEffect(() => {
    let isMounted = true;
    const fetchGitHubData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/RobsHs"),
          fetch("https://api.github.com/users/RobsHs/repos?sort=updated&per_page=15")
        ]);

        if (userRes.ok && isMounted) {
          const userData = await userRes.json();
          setGithubProfile((prev) => ({ ...prev, ...userData }));
        }

        if (reposRes.ok && isMounted) {
          const reposData = await reposRes.json();
          if (Array.isArray(reposData) && reposData.length > 0) {
            const formatted = reposData.map((r, i) => ({
              id: r.id,
              name: r.name,
              description: r.description || "No description provided.",
              language: r.language || "Code",
              languageColor: r.language === "JavaScript" ? "#f1e05a" : r.language === "TypeScript" ? "#3178c6" : r.language === "C++" ? "#f34b7d" : r.language === "HTML" ? "#e34c26" : "#083fa1",
              stargazers_count: r.stargazers_count || 0,
              forks_count: r.forks_count || 0,
              html_url: r.html_url,
              updated_at: r.updated_at,
              isPinned: i < 6
            }));
            setGithubRepos(formatted);
          }
        }
      } catch {
        // Fallback already preloaded
      }
    };

    fetchGitHubData();
    return () => { isMounted = false; };
  }, []);

  const processUrl = (input) => {
    let processed = input.trim();

    // Check GitHub input -> ALWAYS redirect to RobsHs GitHub profile as requested!
    const lower = processed.toLowerCase();
    if (
      lower === "github" ||
      lower === "github.com" ||
      lower === "www.github.com" ||
      lower === "https://github.com" ||
      lower === "https://github.com/" ||
      lower === "http://github.com" ||
      lower === "http://github.com/"
    ) {
      return "https://github.com/robshs";
    }

    if (lower.startsWith("github.com/")) {
      return "https://" + processed;
    }

    // Check YouTube input
    const ytId = extractYouTubeId(processed);
    if (ytId) {
      return `https://www.youtube.com/watch?v=${ytId}`;
    }

    if (
      lower === "youtube" ||
      lower === "youtube.com" ||
      lower === "www.youtube.com" ||
      lower === "https://youtube.com" ||
      lower === "https://www.youtube.com" ||
      lower === "https://youtube.com/" ||
      lower === "https://www.youtube.com/"
    ) {
      return "https://www.youtube.com";
    }

    // Google query if no dot or has spaces
    if (!processed.includes(".") || processed.includes(" ")) {
      return `https://www.google.com/search?igu=1&q=${encodeURIComponent(processed)}`;
    }

    // Add https if missing
    if (!processed.startsWith("http://") && !processed.startsWith("https://")) {
      processed = "https://" + processed;
    }

    // Optimize Wikipedia for responsive mobile framing
    if (processed.includes("wikipedia.org") && !processed.includes(".m.wikipedia.org")) {
      processed = processed.replace("wikipedia.org", "m.wikipedia.org");
    }

    // Optimize Google for iframe framing
    if (processed.includes("google.com/search") && !processed.includes("igu=1")) {
      processed += (processed.includes("?") ? "&" : "?") + "igu=1";
    }

    return processed;
  };

  const navigate = (inputUrl) => {
    const target = processUrl(inputUrl);
    
    // Check if target is YouTube video
    const ytId = extractYouTubeId(target);
    if (ytId) {
      const existing = CURATED_YOUTUBE_VIDEOS.find((v) => v.id === ytId);
      if (existing) {
        setYtActiveVideo(existing);
        setYtCustomSearchActive(false);
      } else {
        setYtActiveVideo({
          id: ytId,
          title: `YouTube Video (${ytId})`,
          channel: "YouTube Creator",
          verified: false,
          views: "Watching Now",
          time: "Direct Link",
          duration: "HD",
          category: "Video",
          description: "Playing directly via official embedded player."
        });
        setYtCustomSearchActive(false);
      }
    }

    setCurrentUrl(target);
    setIsLoading(true);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(target);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    navigate(url);
    setUrl("");
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      try {
        iframeRef.current.src = iframeRef.current.src;
      } catch {}
    } else {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const goHome = () => {
    navigate("https://www.google.com/webhp?igu=1");
  };

  const openExternal = () => {
    const clean = currentUrl.replace("?igu=1", "").replace("&igu=1", "");
    window.open(clean, "_blank", "noopener,noreferrer");
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const getDisplayUrl = () => {
    if (isYouTube) {
      if (ytCustomSearchActive && ytSearchQuery) {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearchQuery)}`;
      }
      return ytActiveVideo ? `https://www.youtube.com/watch?v=${ytActiveVideo.id}` : "https://www.youtube.com";
    }
    if (isGitHub) {
      return "https://github.com/robshs";
    }
    return currentUrl.replace("?igu=1", "").replace("&igu=1", "");
  };

  // Select video in YouTube mode
  const handleSelectYtVideo = (video) => {
    setYtActiveVideo(video);
    setYtCustomSearchActive(false);
    setYtLiked(false);
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    setCurrentUrl(videoUrl);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(videoUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Search within YouTube
  const handleYtSearch = (e) => {
    e.preventDefault();
    const query = ytSearchQuery.trim();
    if (!query) return;

    // Check if raw URL or ID
    const maybeId = extractYouTubeId(query);
    if (maybeId) {
      handleSelectYtVideo({
        id: maybeId,
        title: `YouTube Video: ${maybeId}`,
        channel: "YouTube Creator",
        verified: false,
        views: "Direct Link",
        time: "Just now",
        duration: "HD",
        category: "Video",
        description: "Loaded directly via video URL/ID."
      });
      return;
    }

    // Check curated match
    const found = CURATED_YOUTUBE_VIDEOS.find(
      (v) => v.title.toLowerCase().includes(query.toLowerCase()) || v.category.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      handleSelectYtVideo(found);
      return;
    }

    // Real Live YouTube search query embed player!
    setYtCustomSearchActive(true);
    setYtActiveVideo({
      id: `search_${encodeURIComponent(query)}`,
      title: `Hasil Pencarian: "${query}"`,
      channel: "YouTube Live Search",
      verified: true,
      views: "Live Query",
      time: "Now",
      duration: "Playlist",
      category: "Search",
      description: `Menampilkan hasil pencarian langsung dari YouTube untuk kata kunci: "${query}". Video pertama akan diputar otomatis secara langsung di player.`
    });
  };

  const filteredYtVideos = CURATED_YOUTUBE_VIDEOS.filter((v) => {
    if (ytCategory !== "Semua" && v.category !== ytCategory) return false;
    if (ytSearchQuery.trim() && !ytCustomSearchActive) {
      return (
        v.title.toLowerCase().includes(ytSearchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(ytSearchQuery.toLowerCase())
      );
    }
    return true;
  });

  const filteredGithubRepos = githubRepos.filter((r) => {
    if (!githubRepoSearch.trim()) return true;
    return (
      r.name.toLowerCase().includes(githubRepoSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(githubRepoSearch.toLowerCase()) ||
      r.language.toLowerCase().includes(githubRepoSearch.toLowerCase())
    );
  });

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden transition-colors duration-200 select-none ${isDarkMode ? "bg-[#1c1c1e] text-white" : "bg-white text-gray-800"}`}>
      {/* Safari Unified Toolbar */}
      <div className={`window-drag-handle flex items-center gap-2 px-3.5 py-2.5 transition-colors border-b ${
        isDarkMode ? "bg-[#252527] border-white/10 text-white" : "bg-[#f5f5f7] border-black/10 text-gray-800"
      }`}>
        {/* macOS Traffic Lights */}
        <TrafficLights windowId={windowId} />

        {/* Back / Forward / Refresh */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded-md transition-colors ${
              historyIndex > 0
                ? isDarkMode ? "hover:bg-white/10 text-white cursor-pointer" : "hover:bg-black/5 text-gray-800 cursor-pointer"
                : isDarkMode ? "text-gray-600 cursor-not-allowed" : "text-gray-300 cursor-not-allowed"
            }`}
            title="Back"
          >
            <FiArrowLeft size={15} />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded-md transition-colors ${
              historyIndex < history.length - 1
                ? isDarkMode ? "hover:bg-white/10 text-white cursor-pointer" : "hover:bg-black/5 text-gray-800 cursor-pointer"
                : isDarkMode ? "text-gray-600 cursor-not-allowed" : "text-gray-300 cursor-not-allowed"
            }`}
            title="Forward"
          >
            <FiArrowRight size={15} />
          </button>
          <button
            onClick={refresh}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-gray-800"
            } ${isLoading ? "animate-spin" : ""}`}
            title="Reload"
          >
            <FiRefreshCw size={13} />
          </button>
        </div>

        {/* Smart URL / Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border text-xs transition-all shadow-xs ${
            isDarkMode
              ? "bg-[#18181a] border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
              : "bg-white border-black/15 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
          }`}>
            <FiLock size={12} className={isDarkMode ? "text-emerald-400" : "text-emerald-600"} />
            <input
              type="text"
              value={isFocused ? url : getDisplayUrl()}
              onFocus={() => {
                setIsFocused(true);
                setUrl(getDisplayUrl());
              }}
              onBlur={() => {
                setIsFocused(false);
                setUrl("");
              }}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Search or enter website name (e.g. youtube.com, github.com)..."
              className={`w-full bg-transparent outline-none font-sans text-xs ${isDarkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
            />
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={goHome}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${isDarkMode ? "hover:bg-white/10 text-white/80" : "hover:bg-black/5 text-gray-700"}`}
            title="Google Home"
          >
            <FiHome size={15} />
          </button>
          <button
            onClick={openExternal}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${isDarkMode ? "hover:bg-white/10 text-white/80" : "hover:bg-black/5 text-gray-700"}`}
            title="Buka di Tab Asli Browser"
          >
            <FiExternalLink size={15} />
          </button>
        </div>
      </div>

      {/* Safari Favorites / Bookmarks Bar */}
      <div className={`px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] font-medium border-b shrink-0 scrollbar-none ${
        isDarkMode ? "bg-[#1f1f21] border-white/5 text-white/80" : "bg-[#ebebee] border-black/5 text-gray-700"
      }`}>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-40 mr-1">Favorit:</span>

        <button
          onClick={() => navigate("https://www.youtube.com")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            isYouTube
              ? "bg-red-500/20 text-red-400 border border-red-500/30 font-semibold"
              : isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <FaYoutube className="text-red-500" size={13} />
          <span>YouTube</span>
        </button>

        <button
          onClick={() => navigate("https://github.com/robshs")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            isGitHub
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold"
              : isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <FaGithub size={12} className={isGitHub ? "text-purple-400" : ""} />
          <span>GitHub (RobsHs)</span>
        </button>

        <button
          onClick={() => navigate("https://www.google.com/webhp?igu=1")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            currentUrl.includes("google.com")
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold"
              : isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <FaGoogle className="text-blue-500" size={12} />
          <span>Google</span>
        </button>

        <button
          onClick={() => navigate("https://www.apple.com")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            currentUrl.includes("apple.com")
              ? "bg-white/20 text-white font-semibold"
              : isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <FaApple size={13} />
          <span>Apple</span>
        </button>

        <button
          onClick={() => navigate("https://id.m.wikipedia.org")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            currentUrl.includes("wikipedia.org")
              ? "bg-emerald-500/20 text-emerald-400 font-semibold"
              : isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <FaWikipediaW size={12} />
          <span>Wikipedia</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* CASE A: Native YouTube Player Mode (100% Working, Never Refuses to Connect!) */}
        {isYouTube ? (
          <div className="flex-1 flex flex-col bg-[#0f0f0f] text-white overflow-y-auto">
            {/* YouTube Internal Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-20">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
                onClick={() => {
                  setYtCategory("Semua");
                  setYtCustomSearchActive(false);
                  setYtActiveVideo(CURATED_YOUTUBE_VIDEOS[0]);
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                  <FiPlay className="w-4 h-4 fill-white text-white ml-0.5" />
                </div>
                <span className="font-bold text-lg tracking-tight flex items-center gap-1.5">
                  YouTube <span className="text-[10px] bg-red-600/30 text-red-400 px-1.5 py-0.5 rounded font-mono font-semibold">100% LIVE</span>
                </span>
              </div>

              {/* YouTube Search Form */}
              <form onSubmit={handleYtSearch} className="flex-1 max-w-lg mx-6">
                <div className="flex items-center bg-[#222] border border-white/10 rounded-full px-3.5 py-1.5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
                  <FiSearch className="text-gray-400 mr-2 shrink-0" size={14} />
                  <input
                    type="text"
                    value={ytSearchQuery}
                    onChange={(e) => setYtSearchQuery(e.target.value)}
                    placeholder="Cari video apa saja atau tempel link YouTube..."
                    className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-400 font-sans"
                  />
                  {ytSearchQuery && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setYtSearchQuery("");
                        setYtCustomSearchActive(false);
                      }} 
                      className="text-gray-400 hover:text-white cursor-pointer mr-1.5"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition"
                  >
                    Cari
                  </button>
                </div>
              </form>

              <div className="flex items-center gap-2">
                <button
                  onClick={openExternal}
                  className="text-xs text-white/80 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-white/10"
                >
                  <span>Buka di YouTube.com</span>
                  <FiExternalLink size={12} />
                </button>
              </div>
            </div>

            {/* Video Player Section */}
            <div className="p-6 max-w-5xl mx-auto w-full space-y-4">
              {ytActiveVideo && (
                <div className="space-y-3">
                  {/* YouTube Embed Player */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/15 relative">
                    <iframe
                      key={ytCustomSearchActive ? `search-${ytSearchQuery}` : ytActiveVideo.id}
                      src={
                        ytCustomSearchActive
                          ? `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(ytSearchQuery)}&autoplay=1`
                          : `https://www.youtube-nocookie.com/embed/${ytActiveVideo.id}?autoplay=1&enablejsapi=1`
                      }
                      title={ytActiveVideo.title}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Metadata & Controls */}
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold text-white leading-snug">{ytActiveVideo.title}</h1>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/70 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-red-600 to-amber-600 flex items-center justify-center font-bold text-base shadow">
                          {ytActiveVideo.channel.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1 text-sm">
                            {ytActiveVideo.channel}
                            {ytActiveVideo.verified && <FiCheckCircle className="text-blue-400" size={13} />}
                          </div>
                          <div className="text-[11px] text-white/50">{ytActiveVideo.views} • {ytActiveVideo.time}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setYtLiked(!ytLiked)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition border ${
                            ytLiked 
                              ? "bg-red-600 text-white border-red-500 shadow-sm" 
                              : "bg-white/10 hover:bg-white/15 text-white border-white/5"
                          }`}
                        >
                          <FiThumbsUp size={13} className={ytLiked ? "fill-white" : ""} />
                          <span>{ytLiked ? "Disukai" : "Suka"}</span>
                        </button>

                        <button
                          onClick={() => {
                            const link = ytCustomSearchActive
                              ? `https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearchQuery)}`
                              : `https://www.youtube.com/watch?v=${ytActiveVideo.id}`;
                            navigator.clipboard.writeText(link);
                            setYtCopied(true);
                            setTimeout(() => setYtCopied(false), 2000);
                          }}
                          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition border border-white/5"
                        >
                          {ytCopied ? (
                            <>
                              <FiCheck className="text-emerald-400" size={13} />
                              <span className="text-emerald-400 font-semibold">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <FiShare2 size={13} />
                              <span>Bagikan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 bg-white/5 p-3.5 rounded-xl border border-white/10 leading-relaxed font-sans">
                      {ytActiveVideo.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Category Filter Chips */}
              <div className="pt-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    {["Semua", "Music", "Coding", "Study"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setYtCategory(cat);
                          setYtCustomSearchActive(false);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                          ytCategory === cat && !ytCustomSearchActive
                            ? "bg-white text-black font-semibold shadow"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-white/40">
                    {filteredYtVideos.length} Video Pilihan
                  </span>
                </div>

                {/* Video Grid Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                  {filteredYtVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleSelectYtVideo(video)}
                      className={`group rounded-xl p-2.5 transition-all cursor-pointer flex flex-col space-y-2 border ${
                        ytActiveVideo?.id === video.id && !ytCustomSearchActive
                          ? "bg-white/15 border-red-500/50 shadow-md"
                          : "bg-white/5 hover:bg-white/10 border-white/5"
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 shadow">
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <FiPlay className="ml-0.5 fill-white" size={16} />
                          </div>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-[10px] font-mono px-1.5 py-0.5 rounded text-white font-medium">
                          {video.duration}
                        </span>
                      </div>

                      {/* Video Title & Author */}
                      <div>
                        <h3 className="text-xs font-semibold text-white/95 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                          {video.title}
                        </h3>
                        <div className="text-[11px] text-white/60 mt-1 flex items-center gap-1">
                          {video.channel}
                          {video.verified && <FiCheckCircle className="text-blue-400 inline" size={10} />}
                        </div>
                        <div className="text-[10px] text-white/40">{video.views} • {video.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isGitHub ? (
          /* CASE B: Native RobsHs GitHub Client (Never Refuses to Connect!) */
          <div className="flex-1 flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-y-auto font-sans">
            {/* GitHub Top Header Bar */}
            <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/robshs" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:opacity-80 transition flex items-center gap-2"
                >
                  <FaGithub size={30} />
                  <span className="font-bold text-base tracking-tight text-white hidden sm:inline">GitHub</span>
                </a>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-1.5 text-xs text-[#8b949e]">
                  <span>/</span>
                  <span className="text-white font-semibold">RobsHs</span>
                </div>
              </div>

              {/* GitHub Toolbar Actions */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-[#8b949e]">
                  <FiSearch size={13} className="mr-2" />
                  <input
                    type="text"
                    value={githubRepoSearch}
                    onChange={(e) => setGithubRepoSearch(e.target.value)}
                    placeholder="Cari repositori RobsHs..."
                    className="bg-transparent outline-none text-white w-44 placeholder-[#8b949e]"
                  />
                  {githubRepoSearch && (
                    <button onClick={() => setGithubRepoSearch("")} className="cursor-pointer hover:text-white">
                      <FiX size={12} />
                    </button>
                  )}
                </div>

                <a
                  href="https://github.com/robshs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition shadow-xs cursor-pointer"
                >
                  <span>Buka di GitHub.com</span>
                  <FiExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Profile Content Container */}
            <div className="max-w-6xl mx-auto w-full px-6 py-6 flex flex-col md:flex-row gap-8">
              {/* Left Column: Profile Card */}
              <div className="w-full md:w-72 shrink-0 space-y-4">
                <div className="relative group">
                  <img
                    src={githubProfile.avatar_url}
                    alt={githubProfile.name}
                    className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-[#30363d] shadow-xl object-cover"
                  />
                  <div className="absolute bottom-2 right-4 w-7 h-7 rounded-full bg-[#238636] border-2 border-[#0d1117] flex items-center justify-center text-white text-[10px]" title="Online">
                    ✓
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white leading-tight">{githubProfile.name}</h1>
                  <h2 className="text-lg text-[#8b949e] font-light">@{githubProfile.login}</h2>
                </div>

                <button
                  onClick={() => setIsFollowingGithub(!isFollowingGithub)}
                  className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isFollowingGithub
                      ? "bg-[#21262d] border-[#8b949e] text-white"
                      : "bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-white"
                  }`}
                >
                  {isFollowingGithub ? (
                    <>
                      <FiCheck size={13} className="text-emerald-400" />
                      <span>Following</span>
                    </>
                  ) : (
                    <span>Follow</span>
                  )}
                </button>

                <p className="text-xs text-white/90 whitespace-pre-line leading-relaxed font-mono bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
                  {githubProfile.bio}
                </p>

                {/* Follower Stats */}
                <div className="flex items-center gap-3 text-xs text-[#8b949e]">
                  <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                    <FiUsers size={13} />
                    <b className="text-white">{githubProfile.followers}</b> followers
                  </div>
                  <span>·</span>
                  <div className="hover:text-[#58a6ff] cursor-pointer">
                    <b className="text-white">{githubProfile.following}</b> following
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-[#8b949e] pt-2 border-t border-[#30363d]">
                  {githubProfile.company && (
                    <div className="flex items-center gap-2 text-white/80">
                      <FiBriefcase size={14} className="text-[#8b949e] shrink-0" />
                      <span>{githubProfile.company}</span>
                    </div>
                  )}
                  {githubProfile.location && (
                    <div className="flex items-center gap-2 text-white/80">
                      <FiMapPin size={14} className="text-[#8b949e] shrink-0" />
                      <span>{githubProfile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/80">
                    <FaGithub size={14} className="text-[#8b949e] shrink-0" />
                    <a href="https://github.com/robshs" target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline">
                      github.com/robshs
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Repositories & Pinned Works */}
              <div className="flex-1 space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-[#30363d] pb-2 text-sm font-medium">
                  <button
                    onClick={() => setGithubActiveTab("overview")}
                    className={`flex items-center gap-2 pb-2 -mb-2 border-b-2 transition cursor-pointer ${
                      githubActiveTab === "overview"
                        ? "border-[#f78166] text-white font-semibold"
                        : "border-transparent text-[#8b949e] hover:text-white"
                    }`}
                  >
                    <FiBookOpen size={14} />
                    <span>Overview</span>
                  </button>

                  <button
                    onClick={() => setGithubActiveTab("repositories")}
                    className={`flex items-center gap-2 pb-2 -mb-2 border-b-2 transition cursor-pointer ${
                      githubActiveTab === "repositories"
                        ? "border-[#f78166] text-white font-semibold"
                        : "border-transparent text-[#8b949e] hover:text-white"
                    }`}
                  >
                    <FiFolder size={14} />
                    <span>Repositories</span>
                    <span className="bg-[#30363d] text-white text-[11px] px-2 py-0.5 rounded-full font-mono">
                      {githubRepos.length}
                    </span>
                  </button>
                </div>

                {/* TAB 1: Overview (Pinned Repositories) */}
                {githubActiveTab === "overview" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Pinned Repositories</h3>
                      <span className="text-xs text-[#8b949e]">Karya Unggulan RobsHs</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {githubRepos.slice(0, 6).map((repo) => (
                        <div
                          key={repo.id}
                          className="p-4 rounded-xl border border-[#30363d] bg-[#161b22] hover:border-[#8b949e] transition flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-sm text-[#58a6ff] hover:underline flex items-center gap-1.5"
                              >
                                <FaBook size={12} className="text-[#8b949e]" />
                                <span>{repo.name}</span>
                              </a>
                              <span className="text-[10px] text-[#8b949e] border border-[#30363d] px-1.5 py-0.5 rounded-full font-mono">
                                Public
                              </span>
                            </div>

                            <p className="text-xs text-[#8b949e] line-clamp-3 leading-relaxed">
                              {repo.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-[#8b949e] pt-2 border-t border-[#30363d]/40">
                            <div className="flex items-center gap-3">
                              {repo.language && (
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: repo.languageColor }}
                                  />
                                  <span>{repo.language}</span>
                                </div>
                              )}
                              {repo.stargazers_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <FaStar size={11} className="text-amber-400" />
                                  <span>{repo.stargazers_count}</span>
                                </div>
                              )}
                            </div>

                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#58a6ff] hover:underline flex items-center gap-1"
                            >
                              <span>Lihat Kode</span>
                              <FiExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: Repositories List */}
                {githubActiveTab === "repositories" && (
                  <div className="space-y-3">
                    {/* Filter Input */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-[#8b949e]">
                        <FiSearch size={14} className="mr-2" />
                        <input
                          type="text"
                          value={githubRepoSearch}
                          onChange={(e) => setGithubRepoSearch(e.target.value)}
                          placeholder="Filter repositori berdasarkan nama..."
                          className="w-full bg-transparent outline-none text-white placeholder-[#8b949e]"
                        />
                      </div>
                    </div>

                    <div className="divide-y divide-[#30363d] border-t border-[#30363d]">
                      {filteredGithubRepos.map((repo) => (
                        <div key={repo.id} className="py-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-base text-[#58a6ff] hover:underline"
                              >
                                {repo.name}
                              </a>
                              <span className="text-[10px] text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full font-mono">
                                Public
                              </span>
                            </div>

                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-[#21262d] hover:bg-[#30363d] text-white px-2.5 py-1 rounded-md border border-[#30363d] transition flex items-center gap-1"
                            >
                              <FaStar size={11} className="text-amber-400" />
                              <span>Star</span>
                            </a>
                          </div>

                          <p className="text-xs text-[#8b949e] leading-relaxed">
                            {repo.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-[#8b949e] pt-1">
                            {repo.language && (
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: repo.languageColor }}
                                />
                                <span>{repo.language}</span>
                              </div>
                            )}

                            {repo.stargazers_count > 0 && (
                              <div className="flex items-center gap-1">
                                <FaStar size={11} className="text-amber-400" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                            )}

                            <span>Diperbarui baru-baru ini</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* CASE C: Standard Iframe Web Browser */
          <div className="w-full h-full relative flex flex-col">
            {/* Loading Spinner */}
            {isLoading && (
              <div className={`absolute inset-0 z-10 flex items-center justify-center transition-colors ${isDarkMode ? "bg-[#1c1c1e]" : "bg-white"}`}>
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-white/60">Memuat halaman web...</span>
                </div>
              </div>
            )}

            {/* Smart Frame Banner for external sites */}
            {!currentUrl.includes("google.com") && (
              <div className={`px-4 py-1.5 text-xs flex items-center justify-between border-b shrink-0 ${
                isDarkMode ? "bg-black/30 border-white/5 text-white/70" : "bg-black/5 border-black/5 text-gray-600"
              }`}>
                <span className="truncate mr-2">
                  🔒 Menampilkan situs: <b className="text-white/90 font-mono">{currentUrl.split("/")[2] || currentUrl}</b>
                </span>
                <button
                  onClick={openExternal}
                  className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  <span>Buka Tab Baru</span>
                  <FiExternalLink size={11} />
                </button>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={currentUrl}
              onLoad={handleIframeLoad}
              className={`w-full flex-1 border-none ${isDragging || isResizing ? "pointer-events-none" : ""}`}
              referrerPolicy="no-referrer"
              title="Safari Browser"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Safari;
