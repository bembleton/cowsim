import AnimationFrame from 'animation-frame';
import { isPressed, buttons } from './controller';
// import { inputs, isPressed, getAxis } from './gamepad';
import Display from './display';
import spriteManager from './spriteManager';
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
        this.state = {
            attract: true,
            menuOpen: false,
        }
        this.scroll = {
            x: 0,
            y: 0
        };
        this.animationFrame = new AnimationFrame(30);
    }
    
    async reset () {
        console.log('RESET');
        // load tile sheets
        await loadBitmap(tileSheet, setBackgroundData);
        await loadBitmap(spriteSheet, setSpriteData);
        spriteManager.clearSprites();

        this.loadTitleScreen();
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
        // if (this.titleAnimation) {
        //     this.titleAnimation.update(time);
        // }
        if (this.pacmanAnimation) {
            this.pacmanAnimation.update(time);
        }

        const scrollAmt = 2;
        if (isPressed(buttons.UP)) {
            this.scroll.y -= scrollAmt;
        } else if (isPressed(buttons.DOWN)) {
            this.scroll.y += scrollAmt;
        }
        if (isPressed(buttons.RIGHT)) {
            this.scroll.x += scrollAmt;
        } else if (isPressed(buttons.LEFT)) {
            this.scroll.x -= scrollAmt;
        }

        setScroll(this.scroll.x, this.scroll.y);
    }

    loadTitleScreen () {
        setCommonBackground(BLACK);
        setMirroring(HORIZONTAL);
        setScroll(0, 0);
        this.scroll = {
            x: 0,
            y: 0
        };
        
        setBgPalette(0, BLACK, 0x00, 0x10, WHITE);
        setBgPalette(1, BLACK, 0x11, 0x21, 0x31); // blues
        setBgPalette(2, BLACK, 0x07, 0x17, 0x27); // oranges

        setSpritePalette(0, BLACK, 0x18, 0x28, 0x38); // pacman

        this.clear();
        //this.updateTitleScreen();
        // fill the screen with squiggles
        this.fillWithSquiggles(0,0, 32,60, 2);

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

        this.pacman = {
            x: 68,
            y: 68,
            frame: 0,
            spriteId: spriteManager.requestSprite()
        };
        
        this.updatePacman();

        // animate the screen once a second
        // this.titleAnimation = new Animation({
        //     duration: 30,
        //     update: () => this.updateTitleScreen()
        // });

        this.pacmanAnimation = new Animation({
            duration: 30,
            framecount: 6,
            update: (frame) => this.updatePacman(frame)
        });
    }

    updateTitleScreen () {
        setScroll(0, this.scroll);
        this.scroll += 1;
    }

    // fills a rectangle with squiggles
    fillWithSquiggles (fromx, fromy, tox, toy, palette) {
        // fill the screen with squiggles
        for (let y=fromy; y<toy; y++)
        for (let x=fromx; x<tox; x++) {
            setNametable(x, y, CIRCLE_TL + randInt(2)+2);
        }

        // fill the attribute table with orange
        for (let y=(fromy>>1); y<(toy>>1); y++)
        for (let x=(fromx>>1); x<(tox>>1); x++) {
            setAttribute(x, y, palette);
        }
    }

    updatePacman (frame) {
        let { x, y, spriteId } = this.pacman;
        
        // chomp animation sequence
        let idx = [0,1,2,3,2,1][frame % 6];
        let flipx = false;
        let flipy = false;

        // run around the title
        if (y === 68 && x < 188 - 8) {
            x += 2;     // go right
        } else if (y < 100 -8 && x > 68) {
            idx += 4;
            y += 2;     // go down
            flipy = flipx = true;
        } else if (x > 68) {
            x -= 2;     // go left
            flipx = true;
        } else {
            idx += 4;
            y -= 2;     // go up
        }

        // update sprite
        spriteManager.setSprite (spriteId, idx, x, y, flipx, flipy, false, 0);

        // update state
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
        spriteManager.draw(this.display);
        this.display.draw();
    }
};
