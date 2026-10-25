/**
 * The intro's sound, synthesised in the browser so there is no audio file and
 * nothing to license. A warm, lifting cue in F sharp major, about eight
 * seconds, timed to the ring:
 *
 *   0.0 s  a deep hit as the ring starts to grow: sub boom and a soft thud,
 *          over a low F sharp drone
 *   0.0 s  a pulsing mid bass at 87 bpm; pads and bass duck on every beat,
 *          which gives the cue its breathing
 *   1.6 s  warm pad chords, one every 1.6 s: F sharp, A sharp minor,
 *          F sharp, D sharp minor 9, then an open A sharp sus2 that lifts
 *          and rings out
 *   1.6 s  a soft bell line on top, rising at the end
 *   3.0 s  a lighter hit as the speakers appear
 *
 * Browsers only allow sound after someone has interacted with the page, so
 * the stage display creates the context on the crew's first key press or
 * click and passes it in here.
 */

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// MIDI note numbers.
const N = {
  Fs1: 30,
  Cs2: 37,
  Fs2: 42,
  As2: 46,
  Cs3: 49,
  Fs3: 54,
  As3: 58,
  Cs4: 61,
  Ds4: 63,
  F4: 65,
  Fs4: 66,
  Gs4: 68,
  As4: 70,
  C5: 72,
  Cs5: 73,
  Ds5: 75,
  F5: 77,
  Fs5: 78,
};

const BEAT = 0.69; // seconds, about 87 bpm
const CHORD = 1.6; // seconds per chord

const noiseBuffer = (ctx: BaseAudioContext, seconds: number) => {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
};

const hall = (ctx: BaseAudioContext, seconds: number, decay: number) => {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
};

/** Gain envelope: silence, attack to peak, hold, release to silence. */
const env = (
  g: GainNode,
  at: number,
  peak: number,
  attack: number,
  hold: number,
  release: number,
) => {
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.setValueAtTime(peak, at + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
};

/** Plays the intro cue and returns a function that fades it out at once. */
export const playIntroSting = (ctx: BaseAudioContext, volume = 0.8) => {
  const t0 = ctx.currentTime + 0.05;
  const end = t0 + 5 * CHORD + 1.6;

  const master = ctx.createGain();
  master.gain.value = volume;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value = 10;
  comp.ratio.value = 3;
  master.connect(comp).connect(ctx.destination);

  const verb = hall(ctx, 4.5, 2.4);
  const wet = ctx.createGain();
  wet.gain.value = 0.38;
  verb.connect(wet).connect(master);

  // Everything but the hits runs through a ducker that dips on each beat.
  const duck = ctx.createGain();
  duck.connect(master);
  duck.connect(verb);
  duck.gain.setValueAtTime(1, t0);
  for (let t = t0; t < end; t += BEAT) {
    // A 30 ms dip rather than a jump, which would click.
    duck.gain.setValueAtTime(1, t);
    duck.gain.linearRampToValueAtTime(0.32, t + 0.03);
    duck.gain.linearRampToValueAtTime(1, t + BEAT * 0.62);
  }

  const send = (node: AudioNode, dest: AudioNode = duck) => node.connect(dest);

  // 1. Low drone: F sharp, with its fifth joining when the chords begin.
  const drone = (note: number, at: number, level: number) => {
    for (const [type, det] of [
      ["sine", 0],
      ["sawtooth", -6],
      ["sawtooth", 6],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = hz(note);
      o.detune.value = det;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = type === "sine" ? 400 : 160;
      const g = ctx.createGain();
      env(
        g,
        at,
        type === "sine" ? level : level * 0.35,
        0.4,
        end - at - 2.2,
        1.8,
      );
      o.connect(lp).connect(g);
      send(g);
      o.start(at);
      o.stop(end);
    }
  };
  drone(N.Fs1, t0, 0.16);
  drone(N.Cs2, t0 + CHORD, 0.12);

  // 2. The pulse: a soft, round mid-bass chord on every beat.
  for (let t = t0 + BEAT; t < end - 1.2; t += BEAT) {
    for (const note of [N.Fs2, N.As2, N.Cs3]) {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = hz(note);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 600;
      const g = ctx.createGain();
      env(g, t, 0.08, 0.03, 0.12, 0.42);
      o.connect(lp).connect(g);
      send(g);
      o.start(t);
      o.stop(t + 0.7);
    }
  }

  // 3. Pads: wide detuned saws behind a gentle filter, one chord per step.
  const chords: number[][] = [
    [N.Fs3, N.As3, N.Cs4, N.Fs4, N.Cs5], // F sharp
    [N.As3, N.Cs4, N.F4, N.Cs5], // A sharp minor
    [N.As3, N.Cs4, N.Fs4, N.Cs5], // F sharp
    [N.As3, N.Ds4, N.Fs4, N.Cs5, N.F5], // D sharp minor 9
    [N.As3, N.C5, N.F4, N.As4, N.F5], // A sharp sus2, open
  ];
  chords.forEach((notes, i) => {
    const at = t0 + CHORD * (i + 1);
    const last = i === chords.length - 1;
    const len = last ? 1.4 : CHORD;
    for (const note of notes) {
      for (const det of [-11, 0, 11]) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = hz(note);
        o.detune.value = det;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.Q.value = 0.7;
        lp.frequency.setValueAtTime(700, at);
        lp.frequency.linearRampToValueAtTime(last ? 2600 : 1500, at + len);
        const g = ctx.createGain();
        const peak = 0.016;
        env(g, at, peak, 0.25, len - 0.2, last ? 2.6 : 0.5);
        o.connect(lp).connect(g);
        send(g);
        o.start(at);
        o.stop(at + len + (last ? 2.8 : 0.7));
      }
    }
  });

  // 4. A soft bell line on top, sine plus a quiet octave, into the hall.
  const bells: [number, number][] = [
    [N.Cs5, 1],
    [N.Cs5, 2],
    [N.Fs5, 2.5],
    [N.Cs5, 3],
    [N.Ds5, 4],
    [N.F5, 5],
  ];
  for (const [note, step] of bells) {
    const at = t0 + CHORD * step;
    for (const [mult, level] of [
      [1, 0.05],
      [2, 0.012],
      [3, 0.005],
    ]) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = hz(note) * mult;
      const g = ctx.createGain();
      env(g, at, level, 0.01, 0.05, step === 5 ? 3.2 : 1.6);
      o.connect(g);
      g.connect(master);
      g.connect(verb);
      o.start(at);
      o.stop(at + 3.6);
    }
  }

  // 5. Hits: a deep one as the ring starts to grow, a lighter one under
  // the speakers. They bypass the ducker so they stay full.
  const hit = (at: number, level: number) => {
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(62, at);
    sub.frequency.exponentialRampToValueAtTime(28, at + 1.6);
    const sg = ctx.createGain();
    env(sg, at, level, 0.006, 0.1, 1.7);
    sub.connect(sg).connect(master);
    sub.start(at);
    sub.stop(at + 2);
    const thud = ctx.createBufferSource();
    thud.buffer = noiseBuffer(ctx, 0.5);
    const tl = ctx.createBiquadFilter();
    tl.type = "lowpass";
    tl.frequency.value = 220;
    const tg = ctx.createGain();
    env(tg, at, level * 0.7, 0.002, 0.02, 0.4);
    thud.connect(tl).connect(tg);
    tg.connect(master);
    tg.connect(verb);
    thud.start(at);
  };
  hit(t0, 0.9);
  hit(t0 + 3.0, 0.45);

  return () => {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.15);
    setTimeout(() => comp.disconnect(), 300);
  };
};
