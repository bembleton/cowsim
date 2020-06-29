import spriteManager from '~/spriteManager';
import ppu from '~/ppu';
import text from '~/text';
import { isPressed, buttons } from '~/controller';
import Animation from '~/animation';
import { randInt, randBool, choice } from '~/random';
import Link from '../link';
import { fillBlocks, fillWithBrush } from '../utils';

const { dir } = Link;

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

const plants = [0x09, 0x0a, 0x0b, 0x0c];

const dayLength = 4096;
const hourLength = Math.floor(dayLength/12);
const night = dayLength/2;
const timeOfDayColors = [
  0x12,
  0x21,
  0x21,
  0x21,
  0x21,
  0x23,
  0x03,
  0x3f,
  0x3f,
  0x3f,
  0x3f,
  0x03,
];

const subPixelAdd = (subpixel, value) => {
  const x = subpixel + value;
  return {
    // signed byte: -128, 127
  };
}
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
    setBgPalette(3, BLACK, 0x0b, 0x1a, 0x2a); // greens

    //setSpritePalette(0, BLACK, 0x06, 0x27, 0x12); // blue link
    setSpritePalette(0, BLACK, 0x06, 0x27, 0x2A); // green link
    setSpritePalette(1, BLACK, 0x15, 0x26, 0x19); // flower 1
    setSpritePalette(2, BLACK, 0x28, 0x23, 0x09); // flower 2
    setSpritePalette(3, BLACK, 0x2D, 0x10, 0x20); // moon


    // fill the screen with squiggles
    //this.fillWithSquiggles(0,0, 32,60, 2);

    //fillBlocks(4, 4, 8, 3, BLANK, 1);
    
    // add the title
    text(10,10, 'HELLO WORLD!');
    text(10,11, 'PRESS START.');
    
    this.drawGround();

    // time of day
    this.timeOfDay = 0;
    this.moon = spriteManager.requestSprite();
    
    this.drawFlowers();

    this.bunnies = [
      new Bunny(randInt(16,232), (9*16+8), randInt(3)),
      new Bunny(randInt(16,232), (9*16+8), randInt(3)),
      new Bunny(randInt(16,232), (9*16+8), randInt(3)),
      new Bunny(randInt(16,232), (9*16+8), randInt(3)),
    ];

    this.link = Link.create();
    // link should go from 64,64 to 176,104
    this.link.x = 64;
    this.link.y = 64;

    this.updateLink();

    // animate the screen once a second
    // this.titleAnimation = new Animation({
    //     duration: 30,
    //     update: () => this.updateTitleScreen()
    // });

    this.linkAnimation = new Animation({
        framecount: 256,
        update: (frame) => this.updateLink(frame)
    });
  }

  unload () {
    Link.remove(this.link);
    spriteManager.clearSprites();
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

  drawGround () {
    fillBlocks(0, 10, 16, 1, 0x46, 3); // grass
    fillWithBrush(0, 11, 16, 5, {
      palette: 2,
      tiles: [0x46,0x47,0x56,0x57]
    });
    //fillBlocks(0, 11, 16, 5, 0x80, 2); // dirt
  }

  drawFlowers () {
    for (let i=0; i<5; i++) {
      const flower1 = spriteManager.requestSprite();
      const x = randInt(16, 232);
      const y = 9*16+8;
      const sprite = choice(plants);
      const palette = choice([1,2]);
      spriteManager.setSprite(flower1, sprite, x, y, randBool(), false, false, palette);    
    }
  }

  updateTimeOfDay () {
    if (this.timeOfDay >= dayLength) this.timeOfDay = 0;
    if (this.timeOfDay === 0) {
      setSpritePalette(3, BLACK, 0x38, 0x38, 0x38); // sun
    } else if (this.timeOfDay === dayLength/2) {
      setSpritePalette(3, BLACK, 0x2D, 0x10, 0x20); // moon
    }

    if ((this.timeOfDay % hourLength) === 0) {
      let hour = Math.floor(this.timeOfDay/hourLength);
      if (hour > 11) hour = 0;
      setCommonBackground(timeOfDayColors[hour]);
    }
    
    const theta = (2*Math.PI * this.timeOfDay/dayLength)%(Math.PI);
    const x = 128 + 256 * Math.cos(theta);
    let y = 280 - 256 * Math.sin(theta);
    if (x < 0 || x >= 256) y = 240;

    spriteManager.setSprite(this.moon, 0x15, x, y, false, false, false, 3);

    this.timeOfDay += 1;
  }

  updateLink (frame) {
    const { link } = this;
    let { x, y } = link;

    link.frame = frame;
    link.moving = true;

    link.direction = dir.RIGHT;
    
    // move
    link.x = (link.x+1)%256; //x;
    link.y = 9*16; //y;

    Link.draw(link);
  }

  update (time) {
    const { game, linkAnimation, moonAnimation } = this;

    if (isPressed(buttons.START)) {
      game.loadScreen(game.screens.zelda);
      return;
    }

    if (linkAnimation) {
        linkAnimation.update(time);
    }

    this.bunnies.forEach(b => b.update());
    
    this.updateTimeOfDay();
  }
}

class Bunny {
  constructor(x, y, palette) {
    this.xx = x<<3;
    this.yy = y<<3;
    this.state = 'idle';
    this.palette = palette;
    this.sprite = spriteManager.requestSprite();
  }

  unload() {
    spriteManager.freeSprite(this.sprite);
  }

  update() {
    let { xx, yy, dxx, dyy, state, frame, sprite, palette } = this;
    let idx;
    switch (state) {
      case 'idle':
        if (randInt(100) < 1) {
          state = 'jumping';
          dxx = randBool() ? -4 : 4;
          frame = 0;
        }
        idx = 0x16;
        break;
      case 'jumping':
        if (frame < 10) {
          idx = 0x17;
          dyy = -8;
        } else {
          xx += dxx;
          yy += dyy;
          if (dyy < 8) {
            dyy += 1;
          }
          if (yy > (9*16+8)<<3) {
            yy = (9*16+8)<<3;
            state = 'idle';
          }
          idx = dyy <= 0 ? 0x18 : 0x17;
        }
        frame = frame+1;
        break;
    }
    const x = xx>>3;
    const y = yy>>3;
    const flipx = dxx < 0;

    spriteManager.setSprite(sprite, idx, x, y, flipx, false, false, palette);

    this.xx = xx;
    this.yy = yy;
    this.dxx = dxx;
    this.dyy = dyy;
    this.state = state;
    this.frame = frame;
  }
}