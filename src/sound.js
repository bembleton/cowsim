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
const noop = () => {};

export const effects = {
  cutGrass: () => noise.triggerAttackRelease(0.25, '+0', 0.2),
  footStep: noop, //() => noise.triggerAttackRelease(0.15, '+0', 0.1)
};

export const setVolume = (volume) => {
  Master.volume.value = volume;
}
