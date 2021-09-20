import { apu, Duration, Duty, Envelope, NoiseSound, Note, PulseSound, Vibrato } from '../../sound';

const { C, Cs, Db, D, Ds, Eb, E, F, Fs, Gb, G, Gs, Ab, A, As, Bb, B } = Note;
const { Sixt, TriE, Egth, TriQ, DotE, Qrtr, DotQ, Half, DotH, Whol } = Duration;

class Song {
  constructor(sounds) {
    this.sounds = sounds;
  }
  play() {
    this.sounds.forEach(s => s.play());
  }
  stop() {
    this.sounds.forEach(s => s.stop());
  }
}

const theme_pulse1_data = [
  // bar 5
  Qrtr, A/2,
  DotQ, E/2,
  Egth, A/2,
  Sixt, A/2,
  Sixt, B/2,
  Sixt, Cs,
  Sixt, D,
  // 6
  Half, E,
  Egth, 0,
  Egth, E,
  TriE, E,
  TriE, F,
  TriE, G,
  // 7
  Half, A,
  Egth, 0,
  Egth, A,
  TriE, A,
  TriE, G,
  TriE, F,
  // 8
  DotE, G,
  Sixt, F,
  Half, E,
  Qrtr, E,
  // 9
  Egth, D,
  Sixt, D,
  Sixt, E,
  Half, F,
  Egth, E,
  Egth, D,
  // 10
  Egth, C,
  Sixt, C,
  Sixt, D,
  Half, E,
  Egth, D,
  Egth, C,
  // 11
  Egth, B/2,
  Sixt, B/2,
  Sixt, Cs,
  Half, Ds,
  Qrtr, Fs,
  // 12
  Egth, E,
  Sixt, E/2,
  Sixt, E/2,
  Egth, E/2,
  Sixt, E/2,
  Sixt, E/2,
  Egth, E/2,
  Sixt, E/2,
  Sixt, E/2,
  Egth, E/2,
  Egth, E/2,
  // 13
  Qrtr, A/2,
  DotQ, E/2,
  Egth, A/2,
  Sixt, A/2,
  Sixt, B/2,
  Sixt, Cs,
  Sixt, D,
  // 14
  Half, E,
  Egth, 0,
  Egth, E,
  TriE, E,
  TriE, F,
  TriE, G,
  // 15
  Half, A,
  Qrtr, 0,
  Qrtr, C*2,
  // 16
  Qrtr, B,
  Half, Gs,
  Qrtr, E,
  // 17
  DotH, F,
  Qrtr, A,
  // 18
  Qrtr, Gs,
  Half, E,
  Qrtr, E,
  // 19
  DotH, F,
  Qrtr, A,
  // 20
  Qrtr, Gs,
  Half, E,
  Qrtr, Cs,
  // 21
  DotH, D,
  Qrtr, F,
  // 22
  Qrtr, E,
  Half, C,
  Qrtr, A/2,
  // 23
  Egth, B/2,
  Sixt, B/2,
  Sixt, Cs,
  Half, Ds,
  Qrtr, Fs,
  // 24
  Egth, E,
  Sixt, E/2,
  Sixt, E/2,
  Egth, E/2,
  Sixt, E/2,
  Sixt, E/2,
  Egth, E/2,
  Sixt, E/2,
  Sixt, E/2,
  Egth, E/2,
  Egth, E/2,
  // repeat at bar 5
];

const theme_snare_data = [
  Sixt, 3,
  Sixt, 0,
  Sixt, 3,
  Sixt, 3
];

export class Music {
  static Theme = new Song([
    new PulseSound(apu.pulse1, theme_pulse1_data, {
      loop: true,
      gain: 0.5,
      duty: Duty.OneQuarter,
      envelope: { attack: 0, decay: 0.8, sustain: 10/16 },
      vibrato: Vibrato.Simple
    }),
    new NoiseSound(apu.noise, theme_snare_data, {
      loop: true,
      gain: 0.2,
      envelope: Envelope.Decay,
    })
  ]);
}