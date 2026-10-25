/**
 * The intro's sound, synthesised in the browser so there is no audio file and
 * nothing to license. About eight seconds, timed to the ring:
 *
 *   0.0 s  a deep drone and a dark swell of air as the ring gathers
 *   2.3 s  the hit as it locks: sub boom, low timpani and a dark brass
 *          "braam" in E minor, deep in the low register
 *   3.0 s  a second, heavier hit and a low horn call under the name
 *   to 8 s the chord rings out in a long hall
 *
 * Browsers only allow sound after someone has interacted with the page, so
 * the stage display creates the context on the crew's first key press or
 * click and passes it in here.
 */

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const noiseBuffer = (ctx: AudioContext, seconds: number) => {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
};

const hall = (ctx: AudioContext, seconds: number, decay: number) => {
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

export const playIntroSting = (ctx: AudioContext, volume = 0.8) => {
  const t0 = ctx.currentTime + 0.05;
  const hit = t0 + 2.3;

  const master = ctx.createGain();
  master.gain.value = volume;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 8;
  comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);

  const verb = hall(ctx, 5, 2.2);
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  verb.connect(wet).connect(master);
  const send = (node: AudioNode, dry = 1) => {
    const d = ctx.createGain();
    d.gain.value = dry;
    node.connect(d).connect(master);
    node.connect(verb);
  };

  // 1. Drone: low fifths opening up under the swell.
  for (const [note, det] of [
    [28, -7],
    [28, 7],
    [35, -5],
    [40, 4],
  ]) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = hz(note);
    o.detune.value = det;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 2;
    lp.frequency.setValueAtTime(90, t0);
    lp.frequency.exponentialRampToValueAtTime(700, hit);
    lp.frequency.exponentialRampToValueAtTime(260, hit + 0.4);
    const g = ctx.createGain();
    env(g, t0, 0.11, 2.2, 0.1, 1.6);
    o.connect(lp).connect(g);
    send(g);
    o.start(t0);
    o.stop(hit + 1.6);
  }

  // 2. Swell of air: high noise rising into the hit, like a reversed cymbal.
  const air = ctx.createBufferSource();
  air.buffer = noiseBuffer(ctx, 2.6);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.setValueAtTime(300, t0);
  hp.frequency.exponentialRampToValueAtTime(2600, hit);
  const ag = ctx.createGain();
  ag.gain.setValueAtTime(0.0001, t0);
  ag.gain.exponentialRampToValueAtTime(0.22, hit - 0.02);
  ag.gain.exponentialRampToValueAtTime(0.0001, hit + 0.12);
  air.connect(hp).connect(ag);
  send(ag, 0.8);
  air.start(t0);
  air.stop(hit + 0.2);

  const boom = (at: number, level: number) => {
    // Sub drop.
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(58, at);
    sub.frequency.exponentialRampToValueAtTime(24, at + 2.2);
    const sg = ctx.createGain();
    env(sg, at, level, 0.008, 0.08, 2.8);
    sub.connect(sg).connect(master);
    sub.start(at);
    sub.stop(at + 2.4);
    // Timpani: a pitched skin plus a short thud of noise.
    const skin = ctx.createOscillator();
    skin.type = "triangle";
    skin.frequency.setValueAtTime(82, at);
    skin.frequency.exponentialRampToValueAtTime(44, at + 0.7);
    const kg = ctx.createGain();
    env(kg, at, level * 0.7, 0.004, 0.02, 1.1);
    skin.connect(kg);
    send(kg, 0.9);
    skin.start(at);
    skin.stop(at + 1.3);
    const thud = ctx.createBufferSource();
    thud.buffer = noiseBuffer(ctx, 0.4);
    const tl = ctx.createBiquadFilter();
    tl.type = "lowpass";
    tl.frequency.value = 260;
    const tg = ctx.createGain();
    env(tg, at, level * 0.9, 0.002, 0.01, 0.32);
    thud.connect(tl).connect(tg);
    send(tg, 0.9);
    thud.start(at);
  };
  boom(hit, 1);
  boom(hit + 0.72, 0.7);

  // 3. The braam: E minor kept low, brass-like as the filter opens a little,
  // then ringing out.
  [28, 35, 40, 47, 52, 55, 59].forEach((note, i) => {
    for (const det of [-9, 0, 9]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = hz(note);
      o.detune.value = det;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.Q.value = 0.8;
      lp.frequency.setValueAtTime(350, hit);
      lp.frequency.exponentialRampToValueAtTime(1500, hit + 0.9);
      lp.frequency.exponentialRampToValueAtTime(420, hit + 4.8);
      const g = ctx.createGain();
      const peak = Math.max(0.016, 0.06 - i * 0.006);
      env(g, hit, peak, 0.08, 1.8, 4);
      o.connect(lp).connect(g);
      send(g);
      o.start(hit);
      o.stop(hit + 5.5);
    }
  });

  // 4. A low horn call as the name lands: a fifth rising, slow and wide.
  [
    [40, 0.75, 1.2],
    [47, 1.25, 2.6],
  ].forEach(([note, off, len]) => {
    for (const det of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = hz(note);
      o.detune.value = det;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      const g = ctx.createGain();
      env(g, hit + off, 0.035, 0.25, len - 0.6, 1.8);
      o.connect(lp).connect(g);
      send(g, 0.7);
      o.start(hit + off);
      o.stop(hit + off + len + 2);
    }
  });
};
