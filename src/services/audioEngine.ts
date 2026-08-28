export type SoundType = 'brown' | 'pink' | 'rain' | 'waves';

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentType: SoundType | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private lfoOsc: OscillatorNode | null = null;
  private timerId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: SoundType, volume: number = 0.5, durationMinutes?: number) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentType = type;
    this.isRunning = true;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    // Smooth fade in over 1.5 seconds
    this.masterGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 1.5);
    this.masterGain.connect(this.ctx.destination);

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'pink') {
      // Pink noise synthesis (Paul Kellet's filter method)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      // Brown noise (integrated white noise)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    } else {
      // White noise base for Rain and Waves
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    const whiteSource = this.ctx.createBufferSource();
    whiteSource.buffer = noiseBuffer;
    whiteSource.loop = true;

    if (type === 'rain') {
      // Rain: Pink/white noise through lowpass + bandpass filters
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(800, this.ctx.currentTime);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(200, this.ctx.currentTime);

      whiteSource.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(this.masterGain);

      this.filterNodes = [lowpass, highpass];
    } else if (type === 'waves') {
      // Ocean Waves: Lowpass filter modulated by slow LFO (sine wave period ~10-12s)
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(450, this.ctx.currentTime);
      lowpass.Q.setValueAtTime(2, this.ctx.currentTime);

      const waveGain = this.ctx.createGain();
      waveGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // ~12 sec wave swell
      
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(350, this.ctx.currentTime); // modulate cutoff frequency

      lfo.connect(lfoGain);
      lfoGain.connect(lowpass.frequency);

      whiteSource.connect(lowpass);
      lowpass.connect(this.masterGain);

      lfo.start();
      this.lfoOsc = lfo;
      this.filterNodes = [lowpass];
    } else {
      // Brown or Pink noise direct connection
      whiteSource.connect(this.masterGain);
    }

    whiteSource.start();
    this.noiseNode = whiteSource;

    // Optional duration timer with fade out
    if (durationMinutes && durationMinutes > 0) {
      if (this.timerId) window.clearTimeout(this.timerId);
      this.timerId = window.setTimeout(() => {
        this.fadeOutAndStop(5);
      }, durationMinutes * 60 * 1000);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public fadeOutAndStop(fadeSeconds: number = 2) {
    if (this.masterGain && this.ctx && this.isRunning) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeSeconds);
      window.setTimeout(() => {
        this.stop();
      }, fadeSeconds * 1000);
    } else {
      this.stop();
    }
  }

  public stop() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.lfoOsc) {
      try { this.lfoOsc.stop(); } catch (_) {}
      this.lfoOsc.disconnect();
      this.lfoOsc = null;
    }
    if (this.noiseNode) {
      try { (this.noiseNode as AudioBufferSourceNode).stop(); } catch (_) {}
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    this.filterNodes.forEach(f => f.disconnect());
    this.filterNodes = [];
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    this.isRunning = false;
    this.currentType = null;
  }

  public getStatus() {
    return {
      isPlaying: this.isRunning,
      currentType: this.currentType
    };
  }
}

export const audioEngine = new ProceduralAudioEngine();

