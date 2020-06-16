import AnimationFrame from 'animation-frame';
//import { start as startAudio } from 'tone';
import * as sound from './sound';
// import { inputs, isPressed, getAxis } from './gamepad';
import Display from './display';
import spriteManager from './spriteManager';
import ppu from './ppu';
import loadBitmap from './bitmapLoader';
import gametime from './gametime';
import tileSheet from './assets/background2.bmp';
import spriteSheet from './assets/sprites.bmp';
import spriteAttributes from './spriteAttributes';

import LoadingScreen from './screens/loadingScreen';
import TerrainScreen from './screens/terrainScreen';
import ZeldaScreen from './screens/zeldaScreen';
import HudWrapScreen from './screens/hudWrapScreen';

const {
    HORIZONTAL,
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

const BLANK = 0xFF;

export default class Game {
    constructor (canvas) {
        this.display = new Display(canvas.getContext('2d'));
        this.animationFrame = new AnimationFrame(60);
        this.on = false;
        this.running = false;
        this.currentScreen = null;
    }
    
    async power (enable) {
        this.on = ~this.on;
        if (this.on) {
            await this.reset();
            await sound.enable();
            this.play();
        } else {
            this.pause();
            await this.reset();
        }
    }

    async reset () {
        console.log('RESET');

        // load tile sheets
        await loadBitmap(tileSheet, setBackgroundData);
        await loadBitmap(spriteSheet, setSpriteData);
        
        setMirroring(HORIZONTAL);
        setCommonBackground(0x3F);
        setScroll(0, 0);
        for (let i=0;i<4;i++) {
            setBgPalette(i, 0x3F, 0x3F, 0x3F, 0x3F);
            setSpritePalette(i, 0x3F, 0x3F, 0x3F, 0x3F);
        }
        this.clearBackground();
        spriteManager.clearSprites();
        
        this.currentScreen = null;
        this.screens = {
          title: new LoadingScreen(this),
          terrain: new TerrainScreen(this),
          zelda: new ZeldaScreen(this),
          hudWrap: new HudWrapScreen(this)
        };
        this.startingScreen = this.screens.zelda;

        this.draw(); // blank the screen

        if (this.on) {
            // wait a sec ...
            window.setTimeout(() => {
                this.loadScreen(this.startingScreen);
                this.play();
            }, 500);
        }
    }

    loadScreen (screen) {
      this.currentScreen = screen;
      screen.load();
    }

    play () {
        const self = this;

        if (!this.on || this.running) return;

        this.startTime = this.time = new gametime(Date.now(), 0, 0);
        this.fps = 0;

        function tick () {
            const timestamp = Date.now();
            const elapsed = timestamp - self.time.timestamp;
            const time = new gametime(timestamp, elapsed);
            self.time = time;
            self.update(time);
            self.draw();
            self.frameId = self.animationFrame.request(tick);
        }

        this.frameId = this.animationFrame.request(tick);
        this.running = true;
    }

    pause () {
        this.animationFrame.cancel(this.frameId);
        this.running = false;
    }

    update (time) {
        this.fps = Math.floor(1000 / time.elapsed);

        if (this.onUpdate) this.onUpdate();
        
        if (this.currentScreen) {
            this.currentScreen.update(time);
        }
    }

    clearBackground () {
        for (let y=0; y<60; y++)
        for (let x=0; x<32; x++) {
            setNametable(x, y, BLANK);
        }

        for (let y=0; y<30; y++)
        for (let x=0; x<16; x++) {
          setAttribute(x,y,0);
        }
    }

    draw () {
        for (let y=0; y<240; y++){
          if (this.currentScreen && this.currentScreen.onScanLine) this.currentScreen.onScanLine(y);

          for (let x=0; x<256; x++) {
              const color = getPixel(x, y);
              this.display.setPixel(x, y, color);
          }
        }
        spriteManager.draw(this.display);
        this.display.draw();
    }

    setVolume (volume) {
        sound.setVolume(volume);
    }
};
