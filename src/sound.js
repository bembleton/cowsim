//import { Randy } from './random';
/*
import {
  Synth,
  NoiseSynth,
  Part,
  Loop,
  Transport,
  start,
  context,
  Master
} from 'tone';

const pulseOptions = {
  oscillator:{
    type: pulse
  },
    envelope:{
    release: 0.07
  }
};

const triangleOptions = {
  oscillator:{
    type: triangle
  },
  envelope:{
    release: 0.07
  }
};

const pulse1 = new Synth(pulseOptions).toMaster();
const pulse2 = new Synth(pulseOptions).toMaster();
const triangle = new Synth(triangleOptions).toMaster();
const noise = new NoiseSynth().toMaster();

const part = new Part(function(time, note){
  noise.triggerAttackRelease(note.pitch, note.duration, time, note.velocity);
}, [
    {time: 0,    duration: 8n, pitch: C3, velocity: 0.9}, 
    {time: 0.2, duration: 8n, pitch: C4, velocity: 0.5},
    {time: 0.4, duration: 8n, pitch: C5, velocity: 0.5}
 ]
);

const footsteps = new Loop(time => {
  noise.triggerAttackRelease(0.1, time, 0.1);
}, 8n);

export const play = () => {
  //part.start(0);
  noise.triggerAttackRelease(0.25, '+0', 0.2);
};

export const enable = async (enable) => {
  await start();
  Transport.bpm.value = 150;
  Transport.start();
  context.resume()
  Master.volume.value = -12;
};

export const disable = async () => {
  await enable(false);
}

const noop = () => {};

export const effects = {
  cutGrass: () => noise.triggerAttackRelease(0.25, '+0', 0.2),
  footStep: noop, //() => noise.triggerAttackRelease(0.15, '+0', 0.1)
};
*/

export const Duty = {
  OneEigth: 0.125,
  OneQuarter: 0.25,
  OneHalf: 0.5,
  ThreeQuarters: 0.75,
  0: 0.125,
  1: 0.25,
  2: 0.5,
  3: 0.75
}

class Channel {
  constructor(type) {
    this.type = type;
    this.enabled = true;
    this.params = {
      gain: 0
    };
    //this.timer = 0; // counts down and disables the channel at 0
  }
  setup(context) {
    this.node = new AudioWorkletNode(context, this.type);
    //if (this.timer === 0)
    this.silence();
  }
  /** Applies a single parameter to the AudioWorkletNode */
  setParam(name, value) {
    this.params[name] = value;

    if (this.node && this.node.parameters.has(name) === false) {
      console.warn(`${this.type} Channel does not have a '${name}' parameter`);
    }
  }
  /** Applies parameters to the AudioWorkletNode */
  setParams(params) {
    Object.assign(this.params, params);
  }
  getVolume() {
    return this.params.gain;
  }
  
  getPeriod() {
    return this.params.freqency;
  }
  setVolume(value) {
    this.params.gain = value;
  }
  connect(destination, inputIndex) {
    if (!this.node) return;
    this.node.connect(destination, 0, inputIndex);
  }
  disconnect() {
    if (!this.node) return;
    this.node.disconnect();
  }
  update() {
    // apply the current sound buffer
    const { params } = this;

    if (this.enabled) {
      for (let name in params) {
        if (this.node.parameters.has(name)) {
          this.node.parameters.get(name).value = params[name];
        }
      }
    } else {
      this.node.parameters.get('gain').value = 0;
    }

    // update all sound buffers to advance their frames
    // only output audio from the first sound that emits something
    // remove any that have ended

    // let output = false;
    // this.sounds = this.sounds.filter2(s => {
    //   if (s.hasEnded()) return false;
    //   if (!output) {
    //     const params = s.getParams();
    //     if (params) {
    //       this.setParams(params);
    //       output = true;
    //     }
    //   }
    //   // advance the buffer
    //   return s.update();
    // });
    // if (!output) {
    //   // nothing played so silence the channel
    //   this.setParam('gain', 0);
    // }

    // if (this.timer) {
    //   this.timer--;
    // }
    // if (this.timer === 0) {
    //   this.silence();
    // }
  }
  // setTimer(frames) {
  //   this.timer = frames;
  // }
  silence() {
    this.params.gain = 0;
  }
  // play(sound) {
  //   if (this.sounds.includes(sound)) return;
  //   // newer sounds are prioritized at the front of the sound queue
  //   this.sounds.unshift(sound);
  // }
}

/** A class used to buffer updates to an APU channel */
export class SoundSequence {
  constructor(channel, data, dataWidth, options) {
    this.channel = channel;
    this.data = data;
    this.dataWidth = dataWidth;
    
    Object.assign(this, options);
    this.loop = options.loop || false;

    this.reset();
  }

  /** Resets and enqueues the sound in the channel */
  play() {
    this.reset();
    this.channel.play(this);
  }

  /** Resets to the beginning of the buffer */
  reset() {
    this.frame = 0;
    this.position = 0;
  }

  /** Returns true when there is nothing left to play in the buffer */
  hasEnded() {
    return this.position >= this.data.length;
  }

  /** Gets Channel params for the current frame, or null if nothing should be played (silence) */
  getParams() {}

  /** Advances the sound buffer one frame. Returns false if there is nothing left to play. */
  update() {
    const { data } = this;
    const duration = data[this.position];
    if (this.frame >= duration-1) {
      this.position += this.dataWidth;
      this.frame = 0;
    } else {
      this.frame++;
    }

    if (this.hasEnded()) {
      if (this.loop) this.position = 0;
      else return false;
    }

    return true;
  }

  /** Stops the sound from playing */
  stop() {
    // seek to the end of the buffer
    this.position = this.data.length;
  }
}

export class Envelope {
  static None = { attack: 0, decay: 1, sustain: 1 };
  static Simple = { attack: 0, decay: 1, sustain: 10/16 };
  static Decay = { attack: 0, decay: 1, sustain: 0 };
  static FadeIn = { attack: 1, decay: 0, sustain: 0 };
  static FadeAndDecay = { attack: 0.5, decay: 0.5, sustain: 0 };
}

export class Vibrato {
  static None = { amount: 0, rate: 0 };
  static Simple = { amount: 0.01, rate: 8 };
  static Heavy = { amount: 0.03, rate: 8 };
}

export class PulseSequence extends SoundSequence {
  constructor(channel, data, options = {}) {
    // data: [duration, note, ...]
    super(channel, data, 2, options);
    this.gain = options.gain || 1;
    this.duty = options.duty || Duty.OneHalf;
    this.envelope = options.envelope || Envelope.None;
    this.vibrato = options.vibrato || Vibrato.None;
  }
  getParams() {
    const { data, position, frame, duty, envelope, vibrato } = this;
    const duration = data[position];
    const note = data[position+1];
    if (note === 0) return null;
    const gain = this.gain * getEnvelopeAmount(frame, duration, envelope);
    const frequency = note * getVibratoAmount(frame, duration, vibrato);
    return { duty, gain, frequency };
  }
}

export class TriangleSequence extends SoundSequence {
  constructor(data, options = {}) {
    // data: [duration, note, ...]
    super(apu.triangle, data, 2, options);
    this.envelope = options.envelope || { attack: 0, decay: 0.6, sustain: 0.8 };
    this.vibrato = options.vibrato || Vibrato.None;
  }
  getParams() {
    const { data, position, frame, envelope, vibrato } = this;
    const duration = data[position];
    const note = data[position+1];
    if (note === 0) return null;
    const gain = getEnvelopeAmount(frame, duration, envelope);
    const frequency = note * getVibratoAmount(frame, duration, vibrato);
    return { frequency, gain };
  }
}

export class NoiseSequence extends SoundSequence {
  constructor(data, options = {}) {
    // data: [duration, period:0-15, ...]
    // higher periods have a lower pitch
    // period 0 disables output
    super(apu.noise, data, 2, options);
    this.gain = options.gain || 1;
    this.envelope = options.envelope || Envelope.None;
  }
  getParams() {
    const { data, position, frame, envelope } = this;
    const duration = data[position];
    const period = data[position+1];
    if (period === 0) {
      return null;
    }
    const gain = this.gain * getEnvelopeAmount(frame, duration, envelope);
    return { gain, period };
  }
}

/*
75 bpm

Frames    Duration
-------------------------
192       Whole note
96        Half note
72        Dotted Quarter
48        Quarter note
32        Triplet Quarter
24        Eigth note
16        Triplet Eigth
12        Sixteenth        

*/

export const Notes = {
  C0: 16.351875,
  Cs0: 17.32375,
  Db0: 17.32375,
  D0: 18.35375,
  Ds0: 19.445625,
  Eb0: 19.445625,
  E0: 20.601875,
  F0: 21.826875,
  Fs0: 23.124375,
  Gb0: 23.124375,
  G0: 24.5,
  Gs0: 25.95625,
  Ab0: 25.95625,
  A0: 27.5,
  As0: 29.135,
  Bb0: 29.135,
  B0: 30.8675,
  C1: 32.70375,
  Cs1: 34.6475,
  Db1: 34.6475,
  D1: 36.7075,
  Ds1: 38.89125,
  Eb1: 38.89125,
  E1: 41.20375,
  F1: 43.65375,
  Fs1: 46.24875,
  Gb1: 46.24875,
  G1: 49,
  Gs1: 51.9125,
  Ab1: 51.9125,
  A1: 55,
  As1: 58.27,
  Bb1: 58.27,
  B1: 61.735,
  C2: 65.4075,
  Cs2: 69.295,
  Db2: 69.295,
  D2: 73.415,
  Ds2: 77.7825,
  Eb2: 77.7825,
  E2: 82.4075,
  F2: 87.3075,
  Fs2: 92.4975,
  Gb2: 92.4975,
  G2: 98,
  Gs2: 103.825,
  Ab2: 103.825,
  A2: 110,
  As2: 116.54,
  Bb2: 116.54,
  B2: 123.47,
  C3: 130.815,
  Cs3: 138.59,
  Db3: 138.59,
  D3: 146.83,
  Ds3: 155.565,
  Eb3: 155.565,
  E3: 164.815,
  F3: 174.615,
  Fs3: 184.995,
  Gb3: 184.995,
  G3: 196,
  Gs3: 207.65,
  Ab3: 207.65,
  A3: 220,
  As3: 233.08,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  Cs4: 277.18,
  Db4: 277.18,
  D4: 293.66,
  Ds4: 311.13,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  Gb4: 369.99,
  G4: 392,
  Gs4: 415.3,
  Ab4: 415.3,
  A4: 440,
  As4: 466.16,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.26,
  Cs5: 554.36,
  Db5: 554.36,
  D5: 587.32,
  Ds5: 622.26,
  Eb5: 622.26,
  E5: 659.26,
  F5: 698.46,
  Fs5: 739.98,
  Gb5: 739.98,
  G5: 784,
  Gs5: 830.6,
  Ab5: 830.6,
  A5: 880,
  As5: 932.32,
  Bb5: 932.32,
  B5: 987.76,
  C6: 1046.52,
  Cs6: 1108.72,
  Db6: 1108.72,
  D6: 1174.64,
  Ds6: 1244.52,
  Eb6: 1244.52,
  E6: 1318.52,
  F6: 1396.92,
  Fs6: 1479.96,
  Gb6: 1479.96,
  G6: 1568,
  Gs6: 1661.2,
  Ab6: 1661.2,
  A6: 1760,
  As6: 1864.64,
  Bb6: 1864.64,
  B6: 1975.52,
  C7: 2093.04,
  Cs7: 2217.44,
  Db7: 2217.44,
  D7: 2349.28,
  Ds7: 2489.04,
  Eb7: 2489.04,
  E7: 2637.04,
  F7: 2793.84,
  Fs7: 2959.92,
  Gb7: 2959.92,
  G7: 3136,
  Gs7: 3322.4,
  Ab7: 3322.4,
  A7: 3520,
  As7: 3729.28,
  Bb7: 3729.28,
  B7: 3951.04
};

/*
BPM is quarter notes per minute
60 fps is 3600 frames per minute

Quarter note length = 3600/BPM
*/


// 75 BPM
// export const Duration = {
//   Sixt: 12,
//   TriE: 16,
//   Egth: 24,
//   TriQ: 32,
//   DotE: 36,
//   Qrtr: 48,
//   DotQ: 72,
//   Half: 96,
//   DotH: 144,
//   Whol: 192
// };

// 90 BPM
// export const Duration = {
//   Sixt: 10, 
//   TriE: 13, // apprx. one of three needs to be 14, or add 1 frame delay for every 3
//   Egth: 20, 
//   TriQ: 26, // apprx. two of three needs to be 27, or add 2 frames of delay for every 3
//   DotE: 30, 
//   Qrtr: 40, 
//   DotQ: 60, 
//   Half: 80, 
//   DotH: 120,
//   Whol: 160 
// };

// 100 BPM
export const Duration = {
  Sixt: 9,
  TriE: 12,
  Egth: 18,
  TriQ: 24,
  DotE: 27,
  Qrtr: 36,
  DotQ: 54,
  Half: 72,
  DotH: 108,
  Whol: 144
};

// 120 BPM
/*
  Sixt: 7.5,  // sixteenth durations should alternate between 7 and 8
  TriE: 10,
  Egth: 15,
  TriQ: 20,
  DotE: 22.5, // three sixteenths (7+8+7 or 8+7+8, 22 or 23)
  Qrtr: 30,
  DotQ: 45,
  Half: 60,
  DotH: 90,
  Whol: 120
*/

// 300 BPM
// export const Duration = {
//   Sixt: 3,
//   TriE: 4,
//   Egth: 6,
//   TriQ: 8,
//   DotE: 9,
//   Qrtr: 12,
//   DotQ: 18,
//   Half: 24,
//   DotH: 36,
//   Whol: 48
// };

// 150 BPM
// export const Duration = {
//   Sixt: 6,
//   TriE: 8,
//   Egth: 12,
//   TriQ: 16,
//   DotE: 18,
//   Qrtr: 24,
//   DotQ: 36,
//   Half: 48,
//   DotH: 72,
//   Whol: 96
// };

const lerp = (a, b, t) => (b-a)*t + a;

export const getEnvelopeAmount = (frame, duration, envelope) => {
  const { attack, decay, sustain, release } = envelope;
  const t = frame/duration;
  let volume = 1;
  if (t < attack) {
    volume = lerp(0, 1, t/attack);
  }
  else if (t < attack+decay) {
    volume = lerp(1, sustain, (t-attack)/(decay-attack))
  }
  else {
    const t0 = attack+decay;
    volume = lerp(sustain, 0, (t-t0)/(1-t0))
  }
  return volume;
}
export const getVibratoAmount = (frame, duration, vibrato) => {
  if (vibrato && vibrato.amount > 0.001 && vibrato.rate > 0) {
    const f = 60/vibrato.rate; // frames per vibrato cycle
    const t = frame/duration;
    const weight = 1 + (vibrato.amount * t * Math.sin(frame/f * Math.PI*2));
    return weight;
  }
  return 1;
}
const getSample = (frame, duration, note, envelope, vibrato) => {
  if (note < 40) return { frequency: note, gain: 0 };

  const volume = getEnvelopeAmount(frame, duration, envelope);
  const pitchFactor = getVibratoAmount(frame, duration, vibrato);
  
  return { frequency: note*pitchFactor, gain: volume };
}

const noiseFrequencies = [13, 19, 29, 41, 59, 89, 126, 179, 268, 380, 538, 806, 1140, 1613, 2418, 3419];

class NoiseChannel extends Channel {
  constructor() {
    super('noise-generator');
    this.setParams({
      period: 0
    });
  }
  setup(context) {
    super.setup(context);
    return this;
  }
  // 0-15
  setPeriod(value) {
    this.setParam('period', value);
  }
  setVolume(value) {
    this.setParam('gain', value);
  }
  getFrequency() {
    return 48000 / noiseFrequencies[this.params.period];
  }
}

class PulseChannel extends Channel {
  constructor() {
    super('pulse-generator');
    this.setParams({
      frequency: 220,
      duty: Duty.OneHalf
    });
  }
  setup(context) {
    super.setup(context);
    this.setParam('sampleRate', context.sampleRate);
    return this;
  }
  /** {Duty} */
  setDuty(duty) {
    this.setParam('duty', duty);
  }
  /** 0-15 */
  setVolume(value) {
    this.setParam('gain', value);
  }
  setFrequency(frequency) {
    this.setParam('frequency', frequency);
  }
  getFrequency() {
    return this.params.frequency;
  }
}

class TriangleChannel extends Channel {
  constructor() {
    super('triangle-generator');
    this.setParams({
      frequency: 220
    });
  }
  setup(context) {
    super.setup(context);
    this.setParam('sampleRate', context.sampleRate);
    return this;
  }
  setFrequency(frequency) {
    this.setParam('frequency', frequency);
  }
  getFrequency() {
    return this.params.frequency;
  }
}

class ApuMixer {
  constructor(pulse1, pulse2, triangle, noise) {
    this.volume = 0.8;
    this.pulse1 = pulse1;
    this.pulse2= pulse2;
    this.triangle = triangle;
    this.noise = noise;
    this.out = null;
    
    return this;
  }
  setup(context) {
    this.node = new AudioWorkletNode(context, 'apu-mixer', { numberOfInputs: 4 });

    this.pulse1.setup(context).connect(this.node, 0);   // inputs[0]
    this.pulse2.setup(context).connect(this.node, 1);   // inputs[1]
    this.noise.setup(context).connect(this.node, 2);    // inputs[2]
    this.triangle.setup(context).connect(this.node, 3); // inputs[3]

    const filterEnabled = false;

    if (filterEnabled) {
      // filters
      const highPass = context.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 90;
      highPass.Q.value = 15; // 0-30 db?

      const lowPass = context.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.value = 14000;
      lowPass.Q.value = 3; // 0-30 db?
      
      this.node.connect(lowPass);
      lowPass.connect(highPass);
      //this.out = lowPass;
      this.out = highPass;
    } else {
      this.out = this.node;
    }
  }
  connect(destination) {
    this.out.connect(destination);
    this.setVolume(this.volume);
  }
  disconnect() {
    this.out.disconnect();
  }
  setVolume(value) {
    this.volume = value;
    if (this.node) {
      this.node.parameters.get('gain').value = value;
    }
  }
}

export class Apu {
  constructor() {
    this.connecting = false;
    this.canConnect = false;
    this.context = null;

    this.pulse1 = new PulseChannel();
    this.pulse2 = new PulseChannel();
    this.triangle = new TriangleChannel();
    this.noise = new NoiseChannel();

    this.mixer = new ApuMixer(this.pulse1, this.pulse2, this.triangle, this.noise);
  }

  async connect() {
    if (this.connecting || !this.canConnect) return;
    
    if (!this.context) {
      this.connecting = true;
      const context = new (window.AudioContext || window.webkitAudioContext)();
      await context.audioWorklet.addModule('apu-service.js');

      this.mixer.setup(context);
      this.context = context;
      this.connecting = false;
    }

    if (!this.connected) {
      this.mixer.connect(this.context.destination);
      this.connected = true;
    }
  }

  setVolume(value) {
    this.mixer.setVolume(value);
  }

  silence() {
    this.pulse1.setVolume(0);
    this.pulse2.setVolume(0);
    this.triangle.setVolume(0);
    this.noise.setVolume(0);
  }

  update() {
    const { connecting, context, pulse1, pulse2, triangle, noise } = this;
    if (connecting || !context) return;
    // apply changes
    pulse1.update();
    pulse2.update();
    noise.update();
    triangle.update();
  }

  disconnect() {
    if (this.connected) {
      this.mixer.disconnect();
    }
    this.connected = false;
  }
}

export const apu = new Apu();

// export const enable = async (enable) => {
//   if (enable) {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     await context.audioWorklet.addModule('apu-service.js');
//     apu.connect(context);
//   }
//   if (!enable && apu) {
//     apu.disconnect();
//   }
// };

// export const disable = async () => {
//   await enable(false);
// }

// export const setVolume = (volume) => {
//   apu.volume.value = volume;
// }