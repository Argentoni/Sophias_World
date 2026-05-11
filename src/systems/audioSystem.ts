export class AudioSystem {
  private context: AudioContext | null = null;

  play(sound: string, volume: number): void {
    if (typeof window === "undefined") return;
    const ctx = this.context ?? new AudioContext();
    this.context = ctx;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = sound === "soft" ? "sine" : "triangle";
    oscillator.frequency.value = frequencyFor(sound);
    gain.gain.value = Math.max(0, Math.min(0.2, volume * 0.18));
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    oscillator.stop(ctx.currentTime + 0.2);
  }
}

export const audioSystem = new AudioSystem();

function frequencyFor(sound: string): number {
  if (sound === "sip") return 520;
  if (sound === "page") return 360;
  if (sound === "sparkle") return 880;
  if (sound === "slide") return 640;
  if (sound === "soft") return 300;
  return 720;
}
