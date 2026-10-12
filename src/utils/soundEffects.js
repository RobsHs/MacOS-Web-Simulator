// Audio synthesizer for native macOS system sounds via Web Audio API
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// macOS Iconic Startup Chime (F# Major rich orchestral chime)
export function playBootSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreqs = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99, 466.16]; // F#2, C#3, F#3, A#3, C#4, F#4, A#4
    
    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.45, now + 0.15);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
    masterGain.connect(ctx.destination);

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(4500, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(900, now + 3.5);
    filter.connect(masterGain);

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Slight detune for richness
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      oscGain.gain.setValueAtTime(0.25 / baseFreqs.length, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2 - idx * 0.15);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  } catch (err) {
    console.warn("Could not play boot sound:", err);
  }
}

// macOS Screenshot Shutter Sound
export function playScreenshotSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // White noise buffer for shutter click
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    gain.gain.setValueAtTime(0.3, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch (err) {
    console.warn("Could not play screenshot sound:", err);
  }
}

// macOS Empty Trash Crinkle Sound
export function playTrashSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.28;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch (err) {
    console.warn("Could not play trash sound:", err);
  }
}

// macOS Volume / Navigation Pop Sound
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    console.warn("Could not play pop sound:", err);
  }
}

// macOS Notification / Alert Chime (Glass sound)
export function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1046.5, 1318.51]; // C6, E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      gain.gain.setValueAtTime(0.001, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.28, now + i * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.7);
    });
  } catch (err) {
    console.warn("Could not play notification sound:", err);
  }
}

// macOS Window Minimize Genie Swoosh Sound
export function playMinimizeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.26);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(220, now + 0.26);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (err) {
    console.warn("Could not play minimize sound:", err);
  }
}

// macOS Window Restore Genie Swoosh & Pop Sound
export function playRestoreSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.24);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.24);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);

    // Subtle crisp pop at finish
    setTimeout(() => {
      playPopSound();
    }, 180);
  } catch (err) {
    console.warn("Could not play restore sound:", err);
  }
}

// macOS Screen Unlock Sound
export function playUnlockSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(820, now);
    osc.frequency.exponentialRampToValueAtTime(1240, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const t = ctx.currentTime;
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1380, t);
      osc2.frequency.exponentialRampToValueAtTime(1820, t + 0.05);
      gain2.gain.setValueAtTime(0.15, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.06);
    }, 45);
  } catch (err) {
    console.warn("Could not play unlock sound:", err);
  }
}



