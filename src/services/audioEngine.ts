import { SwitchSound } from '../types/typing';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundType: SwitchSound = 'cherry_blue';
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundType(type: SwitchSound) {
    this.soundType = type;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playKeyDown(isError = false) {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (isError) {
      this.playErrorSound(now);
      return;
    }

    switch (this.soundType) {
      case 'cherry_blue':
        this.playCherryBlue(now);
        break;
      case 'cherry_red':
        this.playCherryRed(now);
        break;
      case 'topre':
        this.playTopre(now);
        break;
    }
  }

  public playKeyUp() {
    if (this.soundType === 'off' || this.volume <= 0) return;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Subtle upstroke release sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);

    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  private playCherryBlue(now: number) {
    if (!this.ctx) return;

    // Stage 1: Crisp click leaf snap (high frequency burst)
    const osc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    const clickFilter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(3400 + Math.random() * 300, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.012);

    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(3200, now);
    clickFilter.Q.setValueAtTime(5, now);

    clickGain.gain.setValueAtTime(this.volume * 0.45, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);

    // Stage 2: Bottom-out clack (noise thump + low resonant body)
    this.playNoiseClack(now + 0.004, 1800, 0.025, 0.35);
    this.playThump(now + 0.004, 260, 0.035, 0.3);
  }

  private playCherryRed(now: number) {
    if (!this.ctx) return;
    // Damped linear bottom out (no click leaf)
    this.playNoiseClack(now, 1200, 0.03, 0.28);
    this.playThump(now, 220, 0.04, 0.32);
  }

  private playTopre(now: number) {
    if (!this.ctx) return;
    // Deep rounded tactile thock (warm dome collapse)
    this.playThump(now, 145 + Math.random() * 15, 0.06, 0.55);
    this.playNoiseClack(now, 750, 0.02, 0.15);
  }

  private playThump(now: number, freq: number, duration: number, volMultiplier: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + duration);

    gain.gain.setValueAtTime(this.volume * volMultiplier, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.005);
  }

  private playNoiseClack(now: number, filterFreq: number, duration: number, volMultiplier: number) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * volMultiplier, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  private playErrorSound(now: number) {
    if (!this.ctx) return;
    // Gentle non-punitive soft woodblock / muted low tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playSuccessChime() {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      const startTime = now + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  public playMetronomeTick(isAccent: boolean = false) {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = isAccent ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, now);
    osc.frequency.exponentialRampToValueAtTime(isAccent ? 300 : 250, now + 0.03);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(400, now);

    const vol = this.volume * (isAccent ? 0.35 : 0.22);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playStreakGoalFanfare() {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Celebratory ascending fanfare with chime notes: G4, C5, E5, G5, C6
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      const startTime = now + idx * 0.08;
      const duration = idx === notes.length - 1 ? 0.6 : 0.28;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.45, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });
  }
}

export const audioEngine = new AudioEngine();
