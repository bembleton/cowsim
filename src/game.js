import AnimationFrame from 'animation-frame';
import keystate from './keybindings';
import Display from './display';
import SpriteManager from './spriteManager';
import ppu from './ppu';
import loadBitmap from './bitmapLoader';
import text from './text';
import gametime from './gametime';
import Animation from './animation';
import tileSheet from './assets/background.bmp';
import spriteSheet from './assets/background.bmp';

const {
    HORIZONTAL,
    VERTICAL,
    setCommonBackground,
    setMirroring,
    setScroll,
    setNametable,
    setAttribute,
    setBgPalette,
    setSpritePalette,
    setSpriteData,
    setBackgroundData,
    getPixel,
} = ppu;

const BLACK = 0x3f;
const WHITE = 0x30;

const BLANK = 0xFF;
const BRICK = 0x30;
const CIRCLE_TL = 0x31;
const CIRCLE_TR = 0x32;
const CIRCLE_BL = 0x33;
const CIRCLE_BR = 0x34;

const rand = () => Math.random();
const randInt = (max) => Math.floor(Math.random() * max);

export default class Game {
    constructor (canvas) {
        this.display = new Display(canvas.getContext('2d'));
        this.spriteManager = new SpriteManager(this.display);
        this.state = {
            attract: true,
            menuOpen: false,
        }
    }
    
    reset () {
        console.log('RESET');
        // load tile sheets
        loadBitmap(tileSheet, ppu.setBackgroundData);
        loadBitmap(spriteSheet, ppu.setSpriteData);
        
        this.loadTitleScreen();
        // animate the screen once a second
        this.titleAnimation = new Animation({
            duration: 1000,
            frames: [
                () => this.loadTitleScreen()
            ]
        });
    }

    start () {
        //this.gametime.currentTime = performance.now();
        //this.startTime = this.gametime.currentTime;
        const animationFrame = new AnimationFrame(20);
        const self = this;

        this.startTime = this.time = new gametime(Date.now(), 0, 0);

        function tick () {
            // this.gametime.elapsed = timestamp - this.gametime.currentTime;
            // this.gametime.currentTime = timeStamp;
            // this.gametime.totalTime = timeStamp - this.startTime;
            const timestamp = Date.now();
            const elapsed = timestamp - self.time.timestamp;
            const totalElapsed = timestamp - self.startTime;
            const time = new gametime(timestamp, elapsed, totalElapsed);
            self.time = time;
    
            self.update(time);
            self.draw();
    
            animationFrame.request(tick);
        }

        animationFrame.request(tick);
    }

    update (time) {
        if (this.titleAnimation) {
            this.titleAnimation.update(time);
        }
    }

    loadTitleScreen () {
        setCommonBackground(BLACK);
        setMirroring(HORIZONTAL);
        setScroll(0, 0);
        
        setBgPalette(0, BLACK, 0x00, 0x10, WHITE);
        setBgPalette(1, BLACK, 0x11, 0x21, 0x31); // blues
        setBgPalette(2, BLACK, 0x07, 0x17, 0x27); // oranges
        
        this.clear();

        // fill the screen with squiggles
        for (let y=0; y<30; y++)
        for (let x=0; x<32; x++) {
            setNametable(x, y, CIRCLE_TL + randInt(2)+2);
        }

        // fill the attribute table with orange
        for (let y=0; y<15; y++)
        for (let x=0; x<16; x++) {
            setAttribute(x, y, 2);
        }

        // add the title
        for (let y=8; y<13; y++)
        for (let x=8; x<24; x++) {
            setNametable(x, y, BLANK);
        }
        for (let y=5; y<6; y++)
        for (let x=5; x<12; x++) {
            setAttribute(x, y, 1);
        }
        text(10,10, 'C O W  S I M');
    }

    clear () {
        setMirroring(HORIZONTAL);
        for (let y=0; y<60; y++)
        for (let x=0; x<32; x++) {
            setNametable(x, y, BLANK);
        }
    }

    draw () {
        for (let y=0; y<240; y++)
        for (let x=0; x<256; x++) {
            const color = getPixel(x, y);
            this.display.setPixel(x, y, color);
        }
        
        this.display.draw();
    }
};
