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

const clocks = [0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 148, 160, 180];

const getParam = (parameters, name, i) => {
  return parameters[name].length === 1 ? parameters[name][0] : parameters[name][i];
};



class NoiseGenerator extends AudioWorkletProcessor {
  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [
      { name: 'period', defaultValue: 0 }, // [0 to 15] lower periods have higher pitch
      { name: 'gain', defaultValue: 0 } // 0-15
    ];
  }

  constructor() {
    super();
    this.timer = 0;
    this.shiftreg = 0x0961;
    this.float = 0;
  }

  step() {
    // const { shiftreg } = this;
    // // -0000000 00000000
    // const bit0 = (shiftreg & 1);
    // const xor = ((shiftreg>>1) & 1) ^ bit0;
    // this.shiftreg = (shiftreg >> 1) | (xor << 14);
    this.float = Math.random();
  }
  value() {
    return this.float;
    //return (this.shiftreg & 1);
  }

  /** returns 0 or 1 or 0.5*/
  noise(period = 0) {
    const cycles = clocks[period];
    const prev = this.value();

    if ((this.timer <= 0) || (this.timer > cycles)) {
      this.timer = cycles;
      this.step();
    }
    
    this.timer--;

    return this.float;

    // const value = this.value();
    // if (value !== prev) return 0.5;
    // return this.value();
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach(buffer => {
      for(let i=0; i<buffer.length; i++){
        const period = getParam(parameters, 'period', i);
        const noise = this.noise(period);
        const gain = getParam(parameters, 'gain', i); //0-15
        buffer[i] = noise * gain; //0-15
      }
    });

    return true; // wave generators are always on
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

// const dutycycles = [
//   [0,1,0,0,0,0,0,0],
//   [0,1,1,0,0,0,0,0],
//   [0,1,1,1,1,0,0,0],
//   [1,0,0,1,1,1,1,1]
// ];

class PulseGenerator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'duty', defaultValue: 0.5 }, // [.125, .25, .5, .75]
      { name: 'frequency', defaultValue: 440 },
      { name: 'gain', defaultValue: 0 }, //  0-15
      { name: 'sampleRate', defaultValue: 48000 },
      { name: 'period', defaultValue: 0 } 
    ];
  }
  /**
   * frequency = fCPU/(16*(period+1))
   * fCPU=1.789773 MHz for NTSC, 1789.773 KHz
   * 
   * 440 = 1789773.0 / (16 * (period+1))
   * (16 * (period+1)) = 1789773.0 / 440
   * period+1 = 1789773.0 / 440 / 16
   * period = 253  (A 440)
   */

  constructor() {
    super();
    this.step = 0;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const sampleRate = parameters.sampleRate[0];

    output.forEach(channel => {
      for (let i=0; i<channel.length; i++) {
        const frequency = getParam(parameters, 'frequency', i);
        const duty = getParam(parameters, 'duty', i);
        const gain = getParam(parameters, 'gain', i);
        const period = getParam(parameters, 'period', i);
        const hiOrLow = this.getWaveform(frequency, duty, sampleRate, period); // 0 or 1
        channel[i] = hiOrLow * gain; // 0-15
      }
    })

    return true; // wave generators are always on
  }

  getWaveform(frequency, duty, sampleRate, period) {

    // A440: period 126
    // freq = 1789773.0 / (32 * (period+1))
    // 440 = 1789773.0 / (32 * (period+1))
    // F = 1789773.0 / (32 * (period+1))

    // x = 48000 / 440 / 2
    // X = 48000 / F / 2
    //   = 48000 / (1789773.0 / (32 * (period+1))) / 2
    //   = 48000 * 32*(period+1) / 1789773.0 / 2
    //   = 48000 * 32*127 / 1789773.0 / 2
    // X = 48000 * 16 * (period+1) / 1789773.0
    //   = 768000 * (period+1) / 1789773.0
    //   = 48000 * (period+1) / 111860.8125;
    //const samplesPerCycle = Math.floor(sampleRate / frequency / 2);
    const samplesPerCycle = Math.floor(sampleRate * (period+1) / 111860.8125);
    const countHigh = Math.floor(samplesPerCycle * duty);
    //const countLow = sequences - Math.floor(sequences*duty);
    if (samplesPerCycle > 0) {
      this.step = (this.step+1) % samplesPerCycle;
    }
    if (this.step === countHigh) return 0.5;
    if (this.step === samplesPerCycle-1) return 0.5;
    if (this.step < countHigh){
      // 1
      return 1 - (0.2 * this.step / countHigh);
    } else {
      return 0 + (0.2 * (this.step-countHigh) / (samplesPerCycle-countHigh));
    }
  }
}

const triangleSequence = [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
class TriangleGenerator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
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
    const sampleRate = parameters.sampleRate[0]

    output.forEach(channel => {
      for (let i=0; i<channel.length; i++) {
        const frequency = getParam(parameters, 'frequency', i);
        const gain = getParam(parameters, 'gain', i); // 0 or 1
        const stepEnabled = (gain > 0);
        const level = this.getWaveform(frequency, sampleRate, stepEnabled); // 0-15
        channel[i] = level;
      }
    })

    return true; // wave generators are always on
  }

  getWaveform(frequency, sampleRate, stepEnabled = true) {
    const samplesPerCycle = Math.floor(sampleRate / frequency); // number of samples per cycle
    if (stepEnabled) this.step++;
    this.step = this.step % samplesPerCycle; // index of the sample in the current cycle
    const value = triangleSequence[Math.floor(32 * this.step / samplesPerCycle)];
    return value; // 0-15
  }
}

const MAX_GAIN = 1;

class ApuMixer extends AudioWorkletProcessor {
  constructor() {
    super({ numberOfInputs: 4 });
  }

  /**
   * pulse_out = 0.00752 * (pulse1 + pulse2)
   * tnd_out = 0.00851 * triangle + 0.00494 * noise + 0.00335 * dmc
   * output = pulse_out + tnd_out
   */
  static get parameterDescriptors() {
    return [
      { name: 'gain', defaultValue: 0 } // master volume
    ];
  }

  process(inputs, outputs, parameters) {
    for (let i of inputs) {
      if (i.length === 0) return true; // wait for all inputs
    }

    const output = outputs[0];

    output.forEach(channel => {
      for (let i=0; i<channel.length; i++) {
        // channel inputs are 0-15
        const pulse1 =   inputs[0][0][i];
        const pulse2 =   inputs[1][0][i];
        const triangle = inputs[2][0][i];
        const noise =    inputs[3][0][i];
        // combined pulse (0-30 -> ~0.0 - 0.25)
        const pulse_out = 0.00752 * (pulse1 + pulse2);
        // combined triangle, noise, and dmc
        const tnd_out = 0.00851 * triangle + 0.00494 * noise; // + 0.00335 * dmc;  
        // combined output
        const output = pulse_out + tnd_out; // (0.0 - 1.0)
        const gain = getParam(parameters, 'gain', i);
        channel[i] = output * gain * MAX_GAIN;
      }
    })

    return true; // determine GC based on inputs
  }
}

registerProcessor('pulse-generator', PulseGenerator);
registerProcessor('triangle-generator', TriangleGenerator);
registerProcessor('noise-generator', NoiseGenerator);
registerProcessor('apu-mixer', ApuMixer);