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
    type: "pulse"
  },
    envelope:{
    release: 0.07
  }
};

const triangleOptions = {
  oscillator:{
    type: "triangle"
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
    {time: 0,    duration: "8n", pitch: "C3", velocity: 0.9}, 
    {time: 0.2, duration: "8n", pitch: "C4", velocity: 0.5},
    {time: 0.4, duration: "8n", pitch: "C5", velocity: 0.5}
 ]
);

const footsteps = new Loop(time => {
  noise.triggerAttackRelease(0.1, time, 0.1);
}, "8n");

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
  ThreeQuarters: 0.75
}

class Channel {
  constructor(type) {
    this.type = type;
    this.sounds = [];
  }
  setup(context) {
    this.node = new AudioWorkletNode(context, this.type);
  }
  /** Applies a single parameter to the AudioWorkletNode */
  setParam(name, value) {
    if (!this.node) return;
    this[name] = value;
    this.node.parameters.get(name).value = value;
  }
  /** Applies parameters to the AudioWorkletNode */
  setParams(params) {
    for (let name in params) {
      if (this.node.parameters.has(name)) {
        this[name] = params[name];
        this.node.parameters.get(name).value = params[name];
      }
    }
  }
  connect(destination) {
    if (!this.node) return;
    this.node.connect(destination);
  }
  disconnect() {
    if (!this.node) return;
    this.node.disconnect();
  }
  update() {
    // update all sound buffers to advance their frames
    // only output audio from the first sound that emits something
    // remove any that have ended
    let output = false;
    this.sounds = this.sounds.filter2(s => {
      if (s.hasEnded()) return false;
      if (!output) {
        const params = s.getParams();
        if (params) {
          this.setParams(params);
          output = true;
        }
      }
      // advance the buffer
      return s.update();
    });
    if (!output) {
      // nothing played so silence the channel
      this.setParam('gain', 0);
    }
  }
  play(sound) {
    if (this.sounds.includes(sound)) return;
    // newer sounds are prioritized at the front of the sound queue
    this.sounds.unshift(sound);
  }
}

/** A class used to buffer updates to an APU channel */
class Sound {
  constructor(channel, data, dataWidth, options) {
    this.channel = channel;
    this.data = data;
    this.dataWidth = dataWidth;
    this.loop = options.loop || false;
  }

  /** Resets to the beginning of the buffer and starts playing the sound */
  play() {
    this.frame = 0;
    this.position = 0;
    this.channel.play(this);
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

export class PulseSound extends Sound {
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

export class NoiseSound extends Sound {
  constructor(channel, data, options = {}) {
    // data: [duration, period:0-15, ...]
    // higher periods have a lower pitch
    // period 0 disables output
    super(channel, data, 2, options);
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

// Octave 4
export const Note = {
  C: 261.63,
  Cs: 277.18,
  Db: 277.18,
  D: 293.66,
  Ds: 311.13,
  Eb: 311.13,
  E: 329.63,
  F: 349.23,
  Fs: 369.99,
  Gb: 369.99,
  G: 392,
  Gs: 415.3,
  Ab: 415.3,
  A: 440,
  As: 466.16,
  Bb: 466.16,
  B: 493.88
};

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
//   TriE: 14, 
//   Egth: 20, 
//   TriQ: 26, 
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

class NoiseChannel extends Channel {
  constructor() {
    super('noise-generator');
    this.period = 0;
    this.gain = 0;
  }
  setup(context) {
    super.setup(context);
    
    this.setParams({
      gain: this.gain,
      period: this.period
    });

    return this;
  }
  // 0-15
  setPeriod(value) {
    this.setParam('period', value);
  }
  setVolume(value) {
    this.setParam('gain', value);
  }
}

class PulseChannel extends Channel {
  constructor() {
    super('pulse-generator');
    this.frequency = 220;
    this.duty = Duty.OneHalf;
    this.gain = 0;
  }
  setup(context) {
    super.setup(context);
    this.setParams({
      sampleRate: context.sampleRate,
      frequency: this.frequency,
      duty: this.duty,
      gain: this.gain
    });
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
  
  // setEnvelope(envelope) {
  //   this.envelope = envelope;
  // }
  // setVibrato(vibrato) {
  //   this.vibrato = vibrato;
  // }
  // setTremelo(tremelo) {
  //   this.tremelo = tremelo;
  // }

  // update() {
  //   const { frame, duration, frequency: note, envelope, volume, vibrato } = this
  //   if (frame >= duration) {
  //     this.setParam('gain', 0);
  //     return;
  //   }

  //   const { frequency, gain } = getSample(frame, duration, note, envelope, vibrato);
  //   this.setParam('gain', Math.floor(gain * volume * 16) / 16); // quantized to 16 levels
  //   this.setParam('frequency', frequency);

  //   this.frame++;
  // }

  // play(note, duration, options) {
  //   this.frequency = note;
  //   this.duration = duration;
  //   this.frame = 0;
  // }


}

export class Apu {
  constructor() {
    this.connecting = false;
    this.context = null;
    this.volume = 0.1;

    this.pulse1 = new PulseChannel();
    this.pulse2 = new PulseChannel();
    this.noise = new NoiseChannel();
  }
  async connect() {
    if (this.connecting) return;
    
    if (!this.context) {
      this.connecting = true;
      const context = new (window.AudioContext || window.webkitAudioContext)();
      await context.audioWorklet.addModule('apu-service.js');

      const master = new GainNode(context);
      master.gain.value = this.volume;
      this.master = master;

      this.pulse1.setup(context).connect(master);
      this.pulse2.setup(context).connect(master);
      this.noise.setup(context).connect(master);
      //const triangle = new AudioWorkletNode(context, 'triangle-generator');
      //triangle.parameters.get('gain').value = 0;

      this.context = context;

      this.connecting = false;
    }

    if (!this.connected) {
      this.master.connect(this.context.destination);
      this.connected = true;
    }
  }

  setVolume(value) {
    this.volume = value;
    if (this.master) {
      this.master.gain.value = value;
    }
  }

  update() {
    const { connecting, context, pulse1, pulse2, triangle, noise } = this;
    if (connecting || !context) return;
    pulse1.update();
    pulse2.update();
    //triangle.update();
    noise.update();
  }

  disconnect() {
    if (this.connected) {
      this.master.disconnect();
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