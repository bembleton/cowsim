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
import spriteSheet from './assets/sprites.bmp';

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
        this.spriteManager.clearSprites();

        this.loadTitleScreen();
    }

    start () {
        const animationFrame = new AnimationFrame(30);
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
    
            animationFrame.request(tick);
        }

        animationFrame.request(tick);
    }

    update (time) {
        this.fps = Math.floor(1000 / time.elapsed);

        if (this.onUpdate) {
            this.onUpdate();
        }
        if (this.titleAnimation) {
            this.titleAnimation.update(time);
        }
        if (this.pacmanAnimation) {
            this.pacmanAnimation.update(time);
        }
    }

    loadTitleScreen () {
        setCommonBackground(BLACK);
        setMirroring(HORIZONTAL);
        setScroll(0, 0);
        
        setBgPalette(0, BLACK, 0x00, 0x10, WHITE);
        setBgPalette(1, BLACK, 0x11, 0x21, 0x31); // blues
        setBgPalette(2, BLACK, 0x07, 0x17, 0x27); // oranges

        setSpritePalette(0, BLACK, 0x18, 0x28, 0x38); // pacman

        this.clear();
        this.updateTitleScreen();
        this.pacman = {
            x: 64,
            y: 64,
            frame: 0
        };
        this.updatePacman();

        // animate the screen once a second
        this.titleAnimation = new Animation({
            duration: 1000,
            frames: [
                () => this.updateTitleScreen()
            ]
        });

        this.pacmanAnimation = new Animation({
            duration: 30,
            frames: [
                () => this.updatePacman()
            ]
        });
    }

    updateTitleScreen () {
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
        text(10,10, 'HELLO WORLD!');
    }

    updatePacman () {
        let { x, y, frame } = this.pacman;
        let idx = [0,1,2,3,2,1][frame];
        let flipx = false;
        let flipy = false;
        
        if (y === 64 && x < 192 - 8) {
            x += 2;
        } else if (y < 104 -8 && x > 64) {
            idx += 4;
            y += 2;
            flipy = flipx = true;
        } else if (x > 64) {
            x -= 2;
            flipx = true;
        } else {
            idx += 4;
            y -= 2;
        }
        this.spriteManager.setSprite (0, idx, x, y, flipx, flipy, false, 0);
        this.pacman.frame = (frame + 1) % 6;
        this.pacman.x = x;
        this.pacman.y = y;


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
        this.spriteManager.draw();
        this.display.draw();
    }
};
