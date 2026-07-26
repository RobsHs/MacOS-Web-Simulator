import { create } from "zustand";
import { songs } from "../constants/songs";
import { playScreenshotSound, playTrashSound, playPopSound, playMinimizeSound, playRestoreSound } from "../utils/soundEffects";

// Create persistent audio instance
export const audioInstance = new Audio('https://pagallworlds.com/wp-content/uploads/2023/06/I-Wanna-Be-Yours-Slowed-Reverb.mp3');
audioInstance.volume = 0.75;

export const useAppStore = create((set, get) => ({
  windows: [],
  maxZ: 1,
  isLocked: false,
  isAudioPlaying: false,
  isDarkMode: localStorage.getItem('os_dark_mode') === 'true',
  currentTrack: songs[1], // Wanna Be Yours as default
  brightness: parseInt(localStorage.getItem('os_brightness') || "100", 10),
  volume: parseInt(localStorage.getItem('os_volume') || "75", 10),
  spotlightOpen: false,
  missionControlOpen: false,
  siriOpen: false,
  forceQuitOpen: false,
  screenshotFlash: false,

  setBrightness: (val) => {
    localStorage.setItem('os_brightness', String(val));
    set({ brightness: val });
  },

  setVolume: (val) => {
    audioInstance.volume = Math.max(0, Math.min(1, val / 100));
    localStorage.setItem('os_volume', String(val));
    set({ volume: val });
  },

  setSpotlightOpen: (open) => set({ spotlightOpen: open }),
  toggleSpotlight: () => set((state) => ({ spotlightOpen: !state.spotlightOpen })),

  setMissionControlOpen: (open) => set({ missionControlOpen: open }),
  toggleMissionControl: () => set((state) => ({ missionControlOpen: !state.missionControlOpen })),

  setSiriOpen: (open) => set({ siriOpen: open }),
  toggleSiri: () => set((state) => ({ siriOpen: !state.siriOpen })),

  setForceQuitOpen: (open) => set({ forceQuitOpen: open }),
  toggleForceQuit: () => set((state) => ({ forceQuitOpen: !state.forceQuitOpen })),

  triggerScreenshot: () => {
    playScreenshotSound();
    set({ screenshotFlash: true });
    setTimeout(() => {
      set({ screenshotFlash: false });
    }, 280);

    // Create a new simulated screenshot file on the desktop
    const desktopFiles = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
    const newScreenshot = {
      id: `screenshot_${Date.now()}`,
      name: `Screenshot ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.png`,
      type: "image",
      size: 1420000,
      date: new Date().toISOString(),
      url: localStorage.getItem("desktop_wallpaper") || "/Wallpaper/GoldenGate_6k.png",
      x: 30 + Math.random() * 80,
      y: 60 + Math.random() * 80,
    };
    const updated = [newScreenshot, ...desktopFiles];
    localStorage.setItem("os_desktop_files", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("os_file_created", { detail: newScreenshot }));
    window.dispatchEvent(new CustomEvent("os_desktop_sync"));
  },

  setCurrentTrack: (track) => set({ currentTrack: track }),
  nextTrack: () => set((state) => {
    const idx = songs.findIndex(s => s.title === state.currentTrack.title);
    const nextIdx = idx === -1 ? 0 : (idx + 1) % songs.length;
    return { currentTrack: songs[nextIdx] };
  }),
  prevTrack: () => set((state) => {
    const idx = songs.findIndex(s => s.title === state.currentTrack.title);
    const prevIdx = idx <= 0 ? songs.length - 1 : idx - 1;
    return { currentTrack: songs[prevIdx] };
  }),
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    localStorage.setItem('os_dark_mode', String(next));
    return { isDarkMode: next };
  }),

  openApp: (appId, component) =>
    set((state) => {
      playPopSound();
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: [
          ...state.windows,
          {
            id: Date.now(),
            appId,
            component,
            minimized: false,
            maximized: false,
            z: newZ,
            prevSize: null,
          },
        ],
      };
    }),

  closeApp: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  focusApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, z: newZ } : w
        ),
      };
    }),

  minimizeApp: (id) =>
    set((state) => {
      playMinimizeSound();
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: true } : w
        ),
      };
    }),

  restoreApp: (id) =>
    set((state) => {
      playRestoreSound();
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z: newZ } : w
        ),
      };
    }),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),

  setLocked: (locked) =>
    set({ isLocked: locked }),

  hideAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true })),
    })),

  toggleAudio: () =>
    set((state) => {
      if (state.isAudioPlaying) {
        audioInstance.pause();
      } else {
        audioInstance.play().catch(() => {});
      }
      return { isAudioPlaying: !state.isAudioPlaying };
    }),

  playAudio: () =>
    set((state) => {
      if (!state.isAudioPlaying) {
        audioInstance.play().catch(() => {});
        return { isAudioPlaying: true };
      }
      return state;
    }),

  pauseAudio: () =>
    set((state) => {
      if (state.isAudioPlaying) {
        audioInstance.pause();
        return { isAudioPlaying: false };
      }
      return state;
    }),
}));
