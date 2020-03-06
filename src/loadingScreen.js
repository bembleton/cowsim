import spriteManager from './spriteManager';
import ppu from './ppu';
import text from './text';
import { isPressed, buttons } from './controller';
import Animation from './animation';

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

export default class LoadingScreen {
  constructor (game) {
    this.game = game;
  }

  load () {
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

    this.game.clear();
    //this.updateTitleScreen();
    // fill the screen with squiggles
    this.fillWithSquiggles(0,0, 32,60, 2);

    // add the title
    for (let y=8; y<15; y++)
    for (let x=8; x<24; x++) {
        setNametable(x, y, BLANK);
    }
    for (let y=5; y<7; y++)
    for (let x=5; x<12; x++) {
        setAttribute(x, y, 1);
    }
    text(10,10, 'HELLO WORLD!');
    text(10,12, 'PRESS START ');

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
        framecount: 12,
        update: (frame) => this.updatePacman(frame)
    });
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
    let idx = [0,1,2,3,2,1][(frame>>1) % 6];
    let flipx = false;
    let flipy = false;

    // run around the title
    if (y === 68 && x < 188 - 8) {
        x += 1;     // go right
    } else if (y < 100 -8 && x > 68) {
        idx += 4;
        y += 1;     // go down
        flipy = flipx = true;
    } else if (x > 68) {
        x -= 1;     // go left
        flipx = true;
    } else {
        idx += 4;
        y -= 1;     // go up
    }

    // update sprite
    spriteManager.setSprite (spriteId, idx, x, y, flipx, flipy, false, 0);

    // update state
    this.pacman.x = x;
    this.pacman.y = y;
  }

  update (time) {
    const { game, pacmanAnimation } = this;

    if (isPressed(buttons.START)) {
      game.loadScreen(game.screens.terrain);
    }

    if (pacmanAnimation) {
        pacmanAnimation.update(time);
    }
  }
}