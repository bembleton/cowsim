import spriteManager from '~/spriteManager';
import ppu from '~/ppu';
import text from '~/text';
import { isPressed, buttons } from '~/controller';
import Animation from '~/animation';
import { randInt, randBool, choice } from '~/random';
import Link from '../link';
import { fillBlocks, getBlock, fillWithMetaTiles, dialog, SubPixels } from '../utils';
import sprites from '../data/sprites';
import { palettes } from '../data/colors';

const { dir } = Link;

const {
    HORIZONTAL,
    VERTICAL,
    enableCommonBackground,
    setCommonBackground,
    setMirroring,
    setScroll,
    setNametable,
    setAttribute,
    setBgPalette,
    setSpritePalette,
} = ppu;

const BLACK = 0x3F;
const DARKGRAY = 0x2D;
const LIGHTGRAY = 0x10;
const WHITE = 0x30;
const ORANGE = 0x19;

const BLANK = 0xFF;
const BRICK = 0x30;
const CIRCLE_TL = 0x31;
const CIRCLE_TR = 0x32;
const CIRCLE_BL = 0x33;
const CIRCLE_BR = 0x34;

const dayLength = 4096;
const hourLength = Math.floor(dayLength/12);
const night = dayLength/2;
const timeOfDayColors = [
  0x03, 0x12, 0x12, 0x12, 0x12, 0x22,
  0x03, 0x3f, 0x3f, 0x3f, 0x3f, 0x03,
];

const brownTanGreen       = [BLACK, 0x06, 0x27, 0x2A];
const yellowLavenderGreen = [BLACK, 0x37, 0x23, 0x09];
const redOrangeGreen      = [BLACK, 0x15, 0x26, 0x19];
const grays               = [BLACK, 0x2D, 0x10, 0x20];

export default class LoadingScreen {
  constructor (game) {
    this.game = game;
  }

  load () {
    enableCommonBackground(true);
    setCommonBackground(BLACK);
    setMirroring(HORIZONTAL);
    setScroll(0, 0);
    this.scroll = {
        x: 0,
        y: 0
    };
    
    setBgPalette(0, 0x07, BLACK, 0x17, 0x27); // title
    setBgPalette(1, BLACK, 0x11, 0x21, 0x31); // blues
    setBgPalette(2, BLACK, 0x07, 0x17, 0x27); // oranges
    setBgPalette(3, BLACK, 0x0b, 0x1a, 0x2a); // greens

    //setSpritePalette(0, BLACK, 0x06, 0x27, 0x12); // blue link
    setSpritePalette(0, palettes.greenTanBrown); // green link
    setSpritePalette(1, redOrangeGreen); // flower 1
    setSpritePalette(2, yellowLavenderGreen); // flower 2
    setSpritePalette(3, grays); // moon


    // fill the screen with squiggles
    //this.fillWithSquiggles(0,0, 32,60, 2);

    //fillBlocks(4, 4, 8, 3, BLANK, 1);
    
    // add the title
    dialog(9, 7, `THE EPIC OF

    C O W S I M

    PRESS START`, 2);
    
    this.drawGround();

    // time of day
    this.timeOfDay = 0;
    this.moon = spriteManager.requestSprite();
    
    //this.drawFlowers();

    const bunnyColors = [1,2,3];
    this.bunnies = [
      new Bunny(randInt(16,232), (9*16+8), choice(bunnyColors)),
      new Bunny(randInt(16,232), (9*16+8), choice(bunnyColors)),
      new Bunny(randInt(16,232), (9*16+8), choice(bunnyColors)),
      new Bunny(randInt(16,232), (9*16+8), choice(bunnyColors)),
    ];

    this.link = Link.create();
    this.link.pos = SubPixels.fromPixels(64, 9*16);

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
    const grass = getBlock(0x45);
    fillWithMetaTiles(0, 10, 16, 1, grass, 3);
    const stone = getBlock(0x84);
    fillWithMetaTiles(0, 11, 16, 4, stone, 2);
  }

  drawFlowers () {
    for (let i=0; i<5; i++) {
      const i = spriteManager.requestSprite();
      const x = randInt(16, 232);
      const y = 9*16+8;
      const index = choice(sprites.plants);
      const palette = choice([1,2]);
      spriteManager.updateSprite(i, { index, x, y, flipX: randBool(), palette });    
    }
  }

  updateTimeOfDay () {
    if (this.timeOfDay >= dayLength) this.timeOfDay = 0;
    const isDay = this.timeOfDay < dayLength/2;

    if ((this.timeOfDay % hourLength) === 0) {
      let hour = Math.floor(this.timeOfDay/hourLength);
      if (hour > 11) hour = 0;
      setCommonBackground(timeOfDayColors[hour]);
    }

    
    const index = isDay ? sprites.circle : sprites.moon;
    const palette = isDay ? 2 : 3;
    const theta = (2*Math.PI * this.timeOfDay/dayLength)%(Math.PI);
    const x = 128 + 256 * Math.cos(theta);
    let y = 280 - 256 * Math.sin(theta);
    if (x < 0 || x >= 256) y = 240;

    spriteManager.updateSprite(this.moon, { index, x, y, palette });

    this.timeOfDay += 1;
  }

  updateLink (frame) {
    const { link } = this;
    let { pos } = link;

    link.frame = frame;
    link.moving = true;

    link.direction = dir.RIGHT;
    
    // move
    const v = new SubPixels(20, 0);
    const max = SubPixels.fromPixels(256,240);
    link.pos = pos.add(v).mod(max);
    
    Link.draw(link);
  }

  update (time) {
    const { game, linkAnimation, moonAnimation } = this;

    if (isPressed(buttons.START)) {
      game.loadScreen(game.screens.world);
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
        idx = sprites.bunny_sit;
        break;
      case 'jumping':
        if (frame < 10) {
          idx = sprites.bunny_stand;
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
          idx = dyy <= 0 ? sprites.bunny_jump : sprites.bunny_stand;
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