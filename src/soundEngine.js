import { fromText } from "./music/famistudio";
import { Frequencies, Notes, Periods } from "./notes";
import { apu, Duty } from "./sound";

class Envelope {
  static Volume = 0;
  static DutyCycle = 1;
  static Pitch = 2;
  static Arpeggio = 3;

  constructor({ type, values, loop, release }) {
    // data
    this.length = values.length;
    this.values = values;
    this.type = type;
    this.loopPoint = loop;
    this.releasePoint = release;
    // state
    this.frame = 0;
    this.released = false;
  }
  /** Attack */
  reset() {
    this.frame = 0;
    this.released = false;
  }
  release() {
    if (this.releasePoint) {
      this.frame = this.releasePoint;
      this.released = true;
    }
  }
  getValue() {
    return this.values[this.frame];
  }
  /** Update envelope by 1 frame */ 
  update() {
    const { loopPoint, releasePoint, released } = this;

    let end;
    if (releasePoint) {
      end = released ? this.length - 1 : releasePoint;
    } else {
      end = this.length - 1;
    }
    
    if (this.frame < end) {
      this.frame++;
    
    } else if (loopPoint && !released) {
      this.frame = loopPoint;
    }
  }
}

class Instrument {
  constructor({ name, envelopes }) {
    this.name = name;
    this.envelopes = [];
    envelopes.forEach(x => {
      const type = Envelope[x.type];
      this.envelopes[type] = new Envelope(x);
    });
  }

  reset() {
    this.envelopes.forEach(e => e && e.reset());
  }
  release() {
    this.envelopes.forEach(e => e && e.release());
  }
  update() {
    this.envelopes.forEach(e => e && e.update());
  }

  getVolume() {
    if (this.envelopes[Envelope.Volume]) {
      return this.envelopes[Envelope.Volume].getValue();
    }
    return 15;
  }

  /** Period offset value */
  getPitchOffset() {
    if (this.envelopes[Envelope.Pitch]) {
      return this.envelopes[Envelope.Pitch].getValue();
    }
    return 0;
  }

  getDuty() {
    if (this.envelopes[Envelope.DutyCycle]) {
      return this.envelopes[Envelope.DutyCycle].getValue();
    }
    return 0;
  }
  /** Semitone offset */
  getArpeggioOffset() {
    if (this.envelopes[Envelope.Arpeggio]) {
      return this.envelopes[Envelope.Arpeggio].getValue();
    }
    return 0;
  }
}

const lerp = (a, b, t) => (b - a) * t + a;

export class SoundEngine {
  constructor() {
    // currently playing sounds
    this.sounds = [];
  }

  load(famitext) {
    const { instruments, songs, arpeggios } = fromText(famitext)
    
    this.instruments = instruments;
    this.arpeggios = arpeggios;
    this.songs = songs.map(x => new Song(x, this));
    this.clear();
  }

  update() {
    // // silence all channels
    //this.silence();

    // update all sound buffers to advance their frames
    // only output audio from the first sound that emits something
    // remove any that have ended

    this.sounds = this.sounds.filter2(x => {
      const { song, repeat } = x;
      song.update();
      if (song.hasEnded() && repeat) {
        song.loop();
      }
      return !song.hasEnded(); 
    });

    // if (this.timer) {
    //   this.timer--;
    // }
    // if (this.timer === 0) {
    //   this.silence();
    // }
  }

  /** Starts playing a song or sound effect */
  play(i, repeat = false) {
    this.stop(i);
    const song = this.songs[i];
    song.play(); // resets position to beginning
    this.sounds.push({ song, repeat });
  }
  /** Pauses all current sounds for the specified number of frames */
  pause(frames) {
    this.sounds.forEach(x => x.song.pause(frames));
  }
  /** Stops a specific song or sound effect */
  stop(i) {
    if (i !== undefined) {
      const song = this.songs[i];
      song && this.sounds.filter2(x => x.song.name !== song.name);
    }
    else {
      this.clear();
    }
  }
  /** Stops all queued sounds */
  clear() {
    this.sounds = [];
    this.silence();
  }
  /** Resets all channels to volume 0 */
  silence() {
    apu.pulse1.setVolume(0);
    apu.pulse2.setVolume(0);
    apu.triangle.setVolume(0);
    apu.noise.setVolume(0);
  }
}

class Song {
  constructor({ name, length, loopPoint, patternLength, noteLength, patternCustomSettings, channels }, engine) {
    this.name = name;
    this.length = length;
    this.loopPoint = loopPoint;
    this.patternLength = patternLength;
    this.noteLength = noteLength;

    this.customPatternSettings = patternCustomSettings;
    this.channels = channels.map(x => new Channel(x, engine));
    this.position = 0; // pattern index
    this.frame = 0;
  }

  getPatternSetting(index) {
    return this.customPatternSettings[index] || {
      length: this.patternLength,
      noteLength: this.noteLength
    };
  }

  play() {
    this.position = 0;
    this.frame = 0;
  }

  pause(frames) {
    this.pauseTimer = frames;
  }

  stop() {
    this.position = this.length;
    this.frame = 0;
  }

  update() {
    if (this.hasEnded()) return; // do nothing
    if (this.pauseTimer) {
      this.pauseTimer--;
      return;
    }

    const { length, noteLength } = this.getPatternSetting(this.position);
    
    this.channels.forEach(channel => {
      channel.update(this.position, this.frame);
    });

    this.frame++;
    if (this.frame === length*noteLength) {
      // next pattern
      this.frame = 0;
      this.position++;
    }

    // if (this.hasEnded() && this.loopPoint !== undefined) {
    //   // play again
    //   this.position = this.loopPoint;
    // }
  }

  loop() {
    // play again
    this.position = this.loopPoint;
  }

  hasEnded() {
    return this.position === this.length;
  }
}

class Channel {
  constructor({ type, patterns, patternInstances }, engine) {
    this.type = type;
    this.engine = engine;
    this.patterns = patterns;
    this.patternInstances = patternInstances;

    // each channel gets a copy of all the instruments it needs
    this.instruments = {};
    Object.values(patterns).forEach(p => {
      p.notes.forEach(({ instrument: name }) => {
        if (name && this.instruments[name] === undefined) {
          const instrumentData = engine.instruments[name];
          this.instruments[name] = new Instrument(instrumentData);
        }
      });
    });

    this.musicalNote = null;
    this.elapsed = 0; // how long the current note has played
    // channel effects
    this.volume = 15;
    this.vibratoSpeed = 0;
    this.vibratoDepth = 0;
  }

  /** Seeks the channel to a specific pattern and frame and updates active envelopes */
  update(position, frame) {
    const { engine, patternInstances, patterns } = this;
    if (patternInstances[position] === undefined) return;

    const patternName = patternInstances[position];
    const pattern = patterns[patternName].notes;
    const note = pattern[frame]; // the current note or nothing
    if (note) {
      const {
        duration,
        instrument, // envelopes
        volume,
        attack = true,
        vibratoSpeed,
        vibratoDepth
      } = note;
      
      if (duration) this.elapsed = 0; // start a new note
      if (instrument) {
        this.musicalNote = note;
      }
      if (attack && instrument) {
        // reset instrument envelopes
        this.instruments[instrument].reset();
      }
      if (volume !== undefined) this.volume = volume;
      if (vibratoSpeed !== undefined) this.vibratoSpeed = vibratoSpeed;
      if (vibratoDepth !== undefined) this.vibratoDepth = vibratoDepth;
    }
    
    const  { musicalNote } = this;
    if (musicalNote) {
      const instrument = this.instruments[musicalNote.instrument];
      if (musicalNote.release === this.elapsed) {
        instrument.release();
      }

      instrument.update(); // update all the envelopes
      this.play();
      
      this.elapsed++;
      if (this.elapsed >= musicalNote.duration) {
        this.musicalNote = null;
        // set volume to 0?
      }
    }
  }

  play() {
    // get all envelope values and calculate the pitch, volume, etc
    const params = {
      volume: 0,
      pitch: 0,
      duty: 0
    };
    const { musicalNote } = this;
    if (musicalNote) {
      const instrument = this.instruments[musicalNote.instrument];
      const volume = instrument.getVolume();
      const gain = this.volume;
      if (gain > 0 && volume > 0) {
        // if both channel gain and envelope are greater than 0, set volume to at least 1
        params.volume = Math.max(1, Math.floor(15 * volume * gain / 225));
      }

      let arpeggioOffset = 0;
      if (musicalNote.arpeggio) {
        const arpeggio = this.engine.arpeggios[musicalNote.arpeggio];
        const { values, loop, length } = arpeggio;
        arpeggioOffset = (this.elapsed < length) ? values[this.elapsed] : values[loop + ((this.elapsed-loop) % (length-loop))];
      } else {
        arpeggioOffset = instrument.getArpeggioOffset();
      }

      const pitch = Notes[musicalNote.value] + arpeggioOffset; //note name to semitone index;
      let slide = 0;
      if (musicalNote.slideTarget) {
        // lerp between value and slideTarget pitches
        const pitch2 = Notes[musicalNote.slideTarget] + arpeggioOffset;
        const delta = Periods[pitch2] - Periods[pitch];
        const t = this.elapsed/musicalNote.duration;
        slide = Math.floor(lerp(0, delta, t));
      }
      
      const bend = instrument.getPitchOffset();
      let vibratoBend = 0;
      if (this.vibratoSpeed > 0) {
        vibratoBend = Math.floor(this.vibratoDepth * Math.sin(Math.PI * 2 * (Date.now() % 1000) / (1000 / this.vibratoSpeed)));
      }

      params.pitch = pitch; // + bend + vibratoBend;
      // if (this.elapsed === 0) {
      //   console.log (`channel: ${this.type}: ${this.musicalNote.value} - ${Frequencies[params.pitch]} Hz`);
      // }
      params.period = Periods[pitch] + slide + bend + vibratoBend;

      params.duty = instrument.getDuty();
    }

    // apply changes to the apu channel if the volume is louder than the current output
    if (this.type === 'Square1' && params.volume >= apu.pulse1.getVolume()) {
      apu.pulse1.setParams({
        gain: params.volume, // 0-15
        frequency: Frequencies[params.pitch],
        duty: Duty[params.duty],
        period: params.period
      });
    }
    if (this.type === 'Square2' && params.volume >= apu.pulse2.getVolume()) {
      apu.pulse2.setParams({
        gain: params.volume, // 0-15
        frequency: Frequencies[params.pitch],
        duty: Duty[params.duty],
        period: params.period
      });
    }
    if (this.type === 'Triangle' && params.volume > 0) {
      apu.triangle.setParams({
        gain: 6,
        frequency: Frequencies[params.pitch],
        period: params.period
      });
    }
    if (this.type === 'Noise' && params.volume >= apu.noise.getVolume()) {
      apu.noise.setParams({
        gain: params.volume, // 0-15
        period: 15 - ((params.pitch+1)%16)
      });
    }
  }
}

// const Note = {
//   time,
//   duration,
//   value,
//   instrument,
//   volume,
//   slideTarget,
//   attack = false
// };

class Pattern {
  constructor({ name }) {
    this.name = name;
    this.notes = []; // notes[] by time
  }
  // getNote(frame) {
  //   let n = this.notes[this.position];
  //   if ()
  //   while (n && n.time < frame) {
  //     this.position++;
  //     n = this.notes[p];
  //   }
  // }
  // seek(frame) {
  //   const next = this.notes[this.position + 1];
  //   if (next && next.time === frame) {
  //     this.position += 1;
  //   }
  //   const cur = this.notes[this.position];
  //   if (cur.time > frame) {
  //     // first note hasn't started yet. 
  //     return;
  //   }
    
  //   if (cur.time === frame) {
  //     // start note
      
  //   }

  //   if ((frame >= cur.time) && (frame < cur.time + cur.duration) && cur.instrument) {
  //     // play with an instrument
  //     cur.instrument.play(note.value);
  //   }
  // }
}