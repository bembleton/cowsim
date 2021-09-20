const BIT_NOISE1 = 0xB5297A4D;
const BIT_NOISE2 = 0x68E31DA4;
const BIT_NOISE3 = 0x1B56C4E9;
const PRIME1 = 198491317;

const Squirrel3 = (position, seed) => {
  let mangled = position;
  mangled *= BIT_NOISE1;
  mangled += seed;
  mangled = (mangled ^ (mangled >>> 8)) >>> 0;
  mangled += BIT_NOISE2;
  mangled = (mangled ^ (mangled << 8)) >>> 0;
  mangled *= BIT_NOISE3;
  mangled ^= (mangled >>> 8);
  return mangled >>> 0;
}

class Randy {
  constructor (seed = Date.now()) {
    this.reset(seed);
  }

  reset(seed) {
    if (seed !== undefined) this.seed = seed;
    this.position = 0;
  }

  /** Random float between 0 and 1 */
  next() {
    return this.nextInt() / 0xffffffff;
  }

  /** Random boolean */
  nextBool() {
    return (this.nextInt() & 1) === 1;
  }

  /** Random integer */
  nextInt(max) {
    const n = Squirrel3(this.position++, this.seed);
    return max !== undefined ? (n % max) : n;
  }

  valueFor(x, y) {
    return Squirrel3(x + y*1010747, this.seed) / 0xffffffff;
  }
}

const randy = new Randy();
const clocks = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];

const getParam = (parameters, name, i) => {
  return parameters[name].length === 1 ? parameters[name][0] : parameters[name][i];
};

const MAX_GAIN = 0.5;

class NoiseGenerator extends AudioWorkletProcessor {
  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [
      { name: 'period', defaultValue: 0 }, // [0 to 15]
      { name: 'gain', defaultValue: 0 }
    ];
  }

  constructor() {
    super();
    this.value = false;
    this.timer = 0;
  }

  /** returns 0 or 1 */
  noise(period = 0) {
    if (this.timer === 0) {
      this.timer = clocks[period];
      this.value = randy.nextBool();
    }
    
    this.timer--;
    return this.value;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach(buffer => {
      for(let i=0; i<buffer.length; i++){
        const period = getParam(parameters, 'period', i);
        const noise = this.noise(period) ? 1 : -1;
        const gain = getParam(parameters, 'gain', i);
        buffer[i] = noise * gain * MAX_GAIN;
      }
    });

    return true;
  }
}

class GainProcessor extends AudioWorkletProcessor {

  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [{ name: 'gain', defaultValue: 1 }];
  }

  constructor() {
    // The super constructor call is required.
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      for (let i = 0; i < inputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i] * getParam(parameters, 'gain', i) * MAX_GAIN;
      }
    }

    return true;
  }
}

class PulseGenerator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'duty', defaultValue: 0.5 }, // [.125, .25, .5, .75]
      { name: 'frequency', defaultValue: 440 },
      { name: 'gain', defaultValue: 0 },
      { name: 'sampleRate', defaultValue: 48000 }
    ];
  }

  constructor() {
    super();
    this.step = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const sampleRate = 48000; //parameters.sampleRate[0];

    output.forEach(channel => {
      for (let i=0; i<channel.length; i++) {
        const frequency = getParam(parameters, 'frequency', i);
        const duty = getParam(parameters, 'duty', i);
        const gain = getParam(parameters, 'gain', i);
        channel[i] = this.getWaveform(frequency, duty, sampleRate) * gain * MAX_GAIN;
      }
    })

    return true;
  }

  getWaveform(frequency, duty, sampleRate) {
    const samplesPerCycle = Math.floor(sampleRate / frequency);
    const countHigh = Math.floor(samplesPerCycle * duty);
    //const countLow = sequences - Math.floor(sequences*duty);
    this.step = (this.step+1) % samplesPerCycle;
    return (this.step <= countHigh) ? 1 : -1;
  }
}

const triangleSequence = [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
class TriangleGenerator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'frequency', defaultValue: 440 },
      { name: 'gain', defaultValue: 1 },
      { name: 'sampleRate', defaultValue: 48000 }
    ];
  }

  constructor() {
    super();
    this.step = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const sampleRate = parameters.sampleRate[0]

    output.forEach(channel => {
      for (let i=0; i<channel.length; i++) {
        const frequency = getParam(parameters, 'frequency', i);
        const gain = getParam(parameters, 'gain', i);
        channel[i] = this.getWaveform(frequency, sampleRate) * gain * MAX_GAIN;
      }
    })

    return true;
  }

  getWaveform(frequency, sampleRate) {
    const samplesPerCycle = Math.floor(sampleRate / frequency); // number of samples per cycle
    this.step = (this.step+1) % samplesPerCycle; // index of the sample in the current cycle
    const value = (Math.floor(32 * this.step / samplesPerCycle) - 7.5) / 7.5;
    return value; // -1 to 1
  }
}

registerProcessor('pulse-generator', PulseGenerator);
registerProcessor('triangle-generator', TriangleGenerator);
registerProcessor('noise-generator', NoiseGenerator);
registerProcessor('channel-gain', GainProcessor);