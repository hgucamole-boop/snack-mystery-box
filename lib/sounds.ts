// Web Audio API sound effects — no external files needed

const MUTE_KEY = 'snackdrop_muted';

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_KEY) === 'true';
}

export function setMuted(muted: boolean) {
  localStorage.setItem(MUTE_KEY, muted ? 'true' : 'false');
}

export function toggleMute(): boolean {
  const next = !isMuted();
  setMuted(next);
  return next;
}

const audioCtx = () => {
  if (!(window as any).__snackDropAudioCtx) {
    (window as any).__snackDropAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__snackDropAudioCtx as AudioContext;
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (isMuted()) return;
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, volume = 0.08) {
  if (isMuted()) return;
  const ctx = audioCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

/** Whoosh — filtered noise sweep played when the reel starts spinning */
export function playWhoosh() {
  if (isMuted()) return;
  playNoise(1.2, 0.1);
  // Add a descending sweep for extra whoosh feel
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

/** Tick — quick click played as reel items pass the indicator */
export function playTick() {
  playTone(1800, 0.04, 'square', 0.06);
}

/** Ding — bright two-tone chime when result is revealed */
export function playDing() {
  playTone(880, 0.3, 'sine', 0.18);
  setTimeout(() => playTone(1320, 0.4, 'sine', 0.15), 100);
}

/** Fanfare — ascending notes for ULTRA / LEGENDARY pulls */
export function playFanfare() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.5, 'sine', 0.18), i * 120);
  });
  // Shimmer noise on top
  setTimeout(() => playNoise(0.6, 0.05), 400);
}

/** Error buzz */
export function playError() {
  playTone(180, 0.3, 'sawtooth', 0.1);
}
