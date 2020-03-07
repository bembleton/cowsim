import AnimationFrame from 'animation-frame';
// import { inputs, isPressed, getAxis } from './gamepad';
import Display from './display';
import spriteManager from './spriteManager';
import ppu from './ppu';
import loadBitmap from './bitmapLoader';
import gametime from './gametime';
import tileSheet from './assets/background.bmp';
import spriteSheet from './assets/sprites.bmp';
import LoadingScreen from './loadingScreen';
import TerrainScreen from './terrainScreen';
import spriteAttributes from './spriteAttributes';
import TestScreen from './testScreen';

const {
    HORIZONTAL,
    setMirroring,
    setNametable,
    setAttribute,
    setSpriteData,
    setBackgroundData,
    getPixel,
} = ppu;

const BLANK = 0xFF;

export default class Game {
    constructor (canvas) {
        this.display = new Display(canvas.getContext('2d'));
        this.animationFrame = new AnimationFrame(60);
        this.screens = {
          title: new LoadingScreen(this),
          terrain: new TerrainScreen(this),
          test: new TestScreen(this)
        };
        this.currentScreen = {};
    }
    
    async reset () {
        console.log('RESET');
        // load tile sheets
        await loadBitmap(tileSheet, setBackgroundData);
        await loadBitmap(spriteSheet, setSpriteData);
        spriteManager.clearSprites();
        this.loadScreen(this.screens.title);
    }

    loadScreen (screen) {
      this.currentScreen = screen;
      screen.load();
    }

    play () {
        const self = this;

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
    }

    pause () {
        this.animationFrame.cancel(this.frameId);
    }

    update (time) {
        this.fps = Math.floor(1000 / time.elapsed);

        if (this.onUpdate) {
            this.onUpdate();
        }
        
        this.currentScreen.update(time);
    }

    clear () {
        setMirroring(HORIZONTAL);
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
        for (let y=0; y<240; y++)
        for (let x=0; x<256; x++) {
            const color = getPixel(x, y);
            this.display.setPixel(x, y, color);
        }
        spriteManager.draw(this.display);
        this.display.draw();
    }
};
