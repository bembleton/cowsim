import AnimationFrame from 'animation-frame';
import ppu from './ppu';
import Display from './display';
import spriteManager from './spriteManager';
import * as sound from './sound';

const {
  HORIZONTAL,
  enableCommonBackground,
  setCommonBackground,
  setMirroring,
  setNametable,
  setAttribute,
  setSpriteData,
  setBackgroundData,
  getPixel,
  setScroll,
  setBgPalette,
  setSpritePalette,
} = ppu;

let hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

const BLANK = 0xFF;

export default class Console {
  constructor(canvas) {
    this.display = new Display(canvas.getContext('2d'));
    this.animationFrame = new AnimationFrame(60);

    // if the game should not run continuously
    this.paused = false;
    this.on = false;

    const handleVisibilityChange = () => {
      if (document[hidden]) {
        this.stop();
      } else {
        this.loop();
      }
    }

    // pause the console when not in view
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }

  // loads a cartridge/game instance
  load(game) {
    if (this.on) throw new Error('Power off before loading a game');
    if (!game.init) throw new Error('Game should implement "init"')
    if (!game.update) throw new Error('Game should implement "update"')
    this.game = game;
  }

  async power() {
    this.on = ~this.on;

    if (this.on) {
      await this.reset();
      
    } else {
      await this.reset();
    }
  }

  async reset() {
    const { game, on } = this;

    this.stop();

    // reset ppu mode
    setMirroring(HORIZONTAL);
    setScroll(0, 0);
    // reset palettes to black
    
    enableCommonBackground(true);
    setCommonBackground(0x3F);
    for (let i=0;i<4;i++) {
        setBgPalette(i, 0x3F, 0x3F, 0x3F, 0x3F);
        setSpritePalette(i, 0x3F, 0x3F, 0x3F, 0x3F);
    }
    // clear bg tables
    for (let y=0; y<60; y++)
    for (let x=0; x<32; x++) {
        setNametable(x, y, BLANK);
    }
    for (let y=0; y<30; y++)
    for (let x=0; x<16; x++) {
      setAttribute(x,y,0);
    }

    spriteManager.clearSprites();

    this.draw(); // a black screen
    
    if (game && on) {
      await game.init();
    }

    // wait a sec ...
    window.setTimeout(() => {
      this.loop();
    }, 500);
  }

  // run the console continuously
  run() {
    this.paused = false;
    this.loop();
  }

  // set the console to a paused state, but dont reset
  pause() {
    this.paused = true;
    this.stop();
  }

  // run 60 frames per second
  loop() {
    const self = this;
    if (this.paused || !this.on) return;

    function tick () {
      const { paused, animationFrame } = self;
      if (paused) return;
      self.step();
      self.frameId = animationFrame.request(tick);
    }

    this.frameId = this.animationFrame.request(tick);
    sound.enable();
  }

  // stop stepping every frame (either paused or not visible)
  stop() {
    const { animationFrame, frameId } = this;
    animationFrame && frameId && animationFrame.cancel(frameId);
    this.frameId = null;
    sound.disable();
  }

  // advance one frame
  step() {
    if (this.game) {
      this.game.update();
    }
    this.draw();
  }

  // draw the current frame
  draw() {
    const { display, game } = this;

    // draw the background
    for (let y=0; y<240; y++){
      // inform the game which scan line we're updating
      if (game && game.onScanline) {
        game.onScanline(y);
      }

      for (let x=0; x<256; x++) {
        const color = getPixel(x, y);
        display.setPixel(x, y, color);
      }
    }

    // draw all sprites
    spriteManager.draw(display);

    // render to screen
    display.draw();
  }

  setVolume(volume) {
    sound.setVolume(volume);
  }
}

class Game {
  // load assets and initialize state
  // called when the console powers on or resets
  async init() {}
  // called before drawing each frame
  update() {}
  // called before drawing each row of pixels
  onScanline() {}
}