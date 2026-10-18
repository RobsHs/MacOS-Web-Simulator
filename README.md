# macOS RobsHs — Next-Gen Web Simulator

<div align="center">

![macOS RobsHs Preview](preview/preview.png)

[![Live Demo](https://img.shields.io/badge/Demo-macos--me.web.app-007AFF?style=for-the-badge&logo=safari&logoColor=white)](https://macos-me.web.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  A high-fidelity, interactive <b>macOS Sequoia</b> desktop environment running natively in the modern browser. Built from the ground up with <b>React 19</b>, <b>Vite 7</b>, <b>Tailwind CSS 4</b>, and procedural <b>Web Audio API</b> synthesis.
</p>

[**Explore Live Demo »**](https://macos-me.web.app) · [Report Bug](https://github.com/RobsHs/MacOS-Web-Simulator/issues) · [Request Feature](https://github.com/RobsHs/MacOS-Web-Simulator/issues)

</div>

---

## 🌟 Overview

**macOS RobsHs** is an authentic browser-based operating system simulator designed to push modern web standards to their limits. It replicates the exact visual polish, kinetic physics, spring-damping animations, and sound design of macOS Sequoia.

Whether it is running real JavaScript code inside a full **Monaco-powered Visual Studio Code**, exploring the globe with live **GPS Geolocation on Maps**, playing curated video embeds on **Safari**, or experiencing real-time procedural sound synthesis, every interaction has been engineered for sub-frame responsiveness and tactile delight.

---

## ✨ Key Features

### 🖥️ Desktop & Window Management
- **Smooth Window Physics**: Draggable, resizable, and stackable window manager with automatic z-index focus tracking powered by Zustand.
- **macOS Genie Minimize & Restore**: Physics-based window warping and spring-damped minimize/restore transitions targeting the exact Dock icon origin.
- **Liquid Glass Design System**: Authentic Sequoia glassmorphism with `backdrop-filter: blur(40px) saturate(180%)`, ambient specular highlights, and dynamic Dark/Light modes.
- **Customizable macOS Dock**: Parabolic Gaussian magnification curve on mouse hover, active running indicators, launch bounce animations, and right-click **Pin / Unpin** context controls.

### 💻 Developer & Utility Apps
- **Visual Studio Code (Monaco Editor)**: Integrated full-featured code editor with syntax highlighting, multi-tab file workspace, line numbering, and a sandboxed runtime execution preview.
- **Interactive Terminal**: Emulates zsh with interactive commands (`help`, `neofetch`, `clear`, `date`, `whoami`, `echo`, `theme`, and more).
- **Calculator**: Authentic macOS Calculator replica with real arithmetic computation, clear indicators, and keyboard input support.
- **Spotlight Search**: Triggerable via `Cmd/Ctrl + Space` or menu bar icon. Supports real-time math evaluation (`12 * 8.5`, `sqrt(144)`) and deep system application indexing.

### 🌐 Safari & Communication
- **Safari Browser**: Unified address bar, navigation history (back/forward/reload), native GitHub client viewer (`github.com/RobsHs`), and embeddable YouTube video player with live search.
- **Interactive Maps**: Powered by Leaflet with OpenStreetMap tiles, automatic browser GPS geolocation, zoom controls, and landmark discovery.
- **Mail & Messages**: Comprehensive communication suite featuring macOS Sequoia layouts, contact photo posters, audio dictation controls, and rich team workspaces.
- **FaceTime & Phone**: Realistic caller overlays, keypad dialer, call duration timers, and optional webcam video integration.

### 🎨 Personalization & System Sound
- **Dual Wallpaper Engine**: System Settings manager featuring 12+ official 6K macOS dynamic wallpapers, custom image uploading, and real-time dual previews for both Desktop and Lock Screen.
- **Web Audio API Sound Synthesizer**: Custom procedural audio engine generating native macOS UI sound effects (click, error pop, camera shutter, and trash empty) with sub-4ms latency.
- **Sequoia Lock Screen & Boot**: Authentic clock typography, wake/sleep transitions, editable user avatar, and smooth password unlock.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 7](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Code Editor** | [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) & Custom Apple Vector SVGs |
| **Deployment** | [Firebase Hosting](https://firebase.google.com/products/hosting) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RobsHs/MacOS-Web-Simulator.git
   cd MacOS-Web-Simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
MacOS-Web-Simulator/
├── public/
│   ├── icons/            # Official macOS vector SVG & raster icons
│   └── Wallpaper/        # High-resolution 6K macOS dynamic wallpapers
├── src/
│   ├── app/              # Individual macOS Applications
│   │   ├── Calculator.jsx    # Calculator with real math engine
│   │   ├── Calendar.jsx      # Multi-view Calendar suite
│   │   ├── Contacts.jsx      # Address book & contact posters
│   │   ├── FaceTime.jsx      # Video conferencing with webcam support
│   │   ├── Finder.jsx        # Virtual file system & storage explorer
│   │   ├── Gallary.jsx       # Photo gallery & wallpaper picker
│   │   ├── Launchpad.jsx     # Fullscreen app grid
│   │   ├── Mail.jsx          # Mail client with smart summaries
│   │   ├── Maps.jsx          # Leaflet GPS geolocation mapping
│   │   ├── Messages.jsx      # iMessage client with reactions
│   │   ├── Phone.jsx         # Phone dialer & call logs
│   │   ├── Reminders.jsx     # Task management
│   │   ├── Safari.jsx        # Browser with YouTube & GitHub views
│   │   ├── Settings.jsx      # Wallpaper & system preferences
│   │   ├── Spotify.jsx       # Streaming media player
│   │   ├── Terminal.jsx      # Zsh terminal emulator
│   │   ├── Trash.jsx         # Recycle bin with sound effects
│   │   └── VSCode.jsx        # Monaco Editor multi-tab workspace
│   ├── components/       # Core System Components
│   │   ├── AppWindow.jsx     # Window shell with traffic lights & genie physics
│   │   ├── Dock.jsx          # Magnified dock with pin/unpin system
│   │   ├── Spotlight.jsx     # Spotlight launcher & math engine
│   │   ├── TopBar.jsx        # Dynamic menu bar with live status indicators
│   │   └── ControlCenter.jsx # Quick settings & sliders
│   ├── layouts/          # System Stage Layouts
│   │   ├── DesktopWindow.jsx # Desktop environment
│   │   ├── LockScreen.jsx    # Authentic Sequoia lock screen
│   │   └── PowerScreen.jsx   # Boot sequence & progress bar
│   ├── store/
│   │   └── Appstore.js       # Centralized window & system state store
│   └── utils/
│       └── soundEffects.js   # Procedural Web Audio API sound synthesizer
├── package.json
└── vite.config.js
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/RobsHs/MacOS-Web-Simulator/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <b>macOS RobsHs</b> · Crafted with ❤️ by <a href="https://github.com/RobsHs">RobsHs</a>
</div>
