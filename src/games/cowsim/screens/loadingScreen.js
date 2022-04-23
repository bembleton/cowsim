import spriteManager from '~/spriteManager';
import ppu from '~/ppu';
import text from '~/text';
import { isPressed, buttons } from '~/controller';
import Animation from '~/animation';
import { rand, randInt, randBool, choice } from '~/random';
import Link from '../link';
import { fillBlocks, getBlock, fillWithMetaTiles, dialog, SubPixels } from '../utils';
import sprites from '../data/sprites';
import { palettes } from '../data/colors';
import { Sprite } from '../../../spriteManager';
import { Sfx, Songs } from '../sound';
import sounddata from '../../../music/zelda.txt';
import { GameScreen } from './screen';

//import { apu, Duration, Duty, Envelope, NoiseSequence, Note,PulseSequence, Vibrato } from '../../../sound';
//import { Music } from '../music';

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

const BLANK = 0x30;

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

export default class LoadingScreen extends GameScreen {
  constructor (game) {
    super(game);

    this.selectedMenuItem = 0;
    this.menuSprite = new Sprite({ index: sprites.heart, x: 80, y: 96, palette: 1 });
    this.soundEngine = game.soundEngine;

    this.menu = [
      {label:'START', screen: 'world'},
      {label:'SET SEED', screen: 'enterSeed'},
      {label: 'MUSIC', screen: 'music'}
    ]
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
    
    setBgPalette(0, BLACK, BLACK, 0x17, 0x27); // title
    setBgPalette(1, BLACK, BLACK, 0x21, WHITE); // blues
    setBgPalette(2, BLACK, 0x07, 0x17, 0x27); // oranges
    setBgPalette(3, BLACK, 0x0b, 0x1a, 0x2a); // greens

    //setSpritePalette(0, BLACK, 0x06, 0x27, 0x12); // blue link
    setSpritePalette(0, palettes.greenTanBrown); // green link
    setSpritePalette(1, palettes.redGoldWhite); // flower 1
    setSpritePalette(2, yellowLavenderGreen); // flower 2
    setSpritePalette(3, grays); // moon


    // fill the screen with squiggles
    //this.fillWithSquiggles(0,0, 32,60, 2);

    fillBlocks(0, 0, 16, 10, BLANK, 1);
    
    // add the title
    dialog(9, 4, `THE EPIC OF

    C O W S I M`, 0);
    
    this.selectedMenuItem = 0;
    this.drawMenu();
    this.selectedMenuItem = 0;
    this.menuSprite.update({ x:80, y: 96 });
    this.menuSprite.draw();
    this.drawGround();

    this.updateButtonStates();

    // time of day
    this.timeOfDay = 4095;
    this.moon = spriteManager.requestSprite();
    this.updateTimeOfDay();
    
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

    this.linkAnimation = new Animation({
        framecount: 256,
        update: (frame) => this.updateLink(frame)
    });

    this.soundEngine.load(sounddata);
    this.soundEngine.play(Songs.title, true);
  }

  unload () {
    Link.remove(this.link);
    this.menuSprite.dispose();
    spriteManager.clearSprites();
    this.soundEngine.clear();
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

  drawMenu() {
    for (let i=0; i<this.menu.length; i++) {
      // 96,96
      text(12, 12+i*2, this.menu[i].label);
    }
  }

  setSeletectedMenuItem(item) {
    this.selectedMenuItem = item;
    this.menuSprite.update({ x:80, y: 96 + item*16 });
    this.game.soundEngine.play(Sfx.coin);
  }

  update (time) {
    const { game, linkAnimation, moonAnimation, selectedMenuItem, menu } = this;

    this.updateButtonStates();

    if (this.wasPressed(buttons.SELECT)) {
      this.setSeletectedMenuItem((selectedMenuItem+1) % menu.length);
    }

    if (this.wasPressed(buttons.UP)) {
      if (selectedMenuItem > 0) {
        this.setSeletectedMenuItem(selectedMenuItem - 1);
      }
    }

    if (this.wasPressed(buttons.DOWN)) {
      if (selectedMenuItem < menu.length - 1) {
        this.setSeletectedMenuItem(selectedMenuItem + 1);
      }
    }

    if (this.wasReleased(buttons.START) || this.wasReleased(buttons.A)) {
      const screen = menu[selectedMenuItem].screen
      game.loadScreen(game.screens[screen]);
      return;
    }
    
    if (linkAnimation) {
        linkAnimation.update(time);
    }

    this.bunnies.forEach(b => b.update());
  }
}

class Bunny {
  constructor(x, y, palette) {
    this.xx = x<<3;
    this.yy = y<<3;
    this.state = 'idle';
    this.palette = palette;
    this.sprite = spriteManager.requestSprite();
    //this.bunnySound = new NoiseSequence(apu.noise, [6, 5], { gain: 0.2, envelope: Envelope.Decay });
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
            // apu.pulse2.setVolume(randInt(4, 6)/16);
            // apu.pulse2.setDuty(Duty.OneQuarter);
            // apu.pulse2.setEnvelope({ attack: 0, decay: 1, sustain: 0.1 });
            // apu.pulse2.play(randInt(150,200), 6);
            
            //this.bunnySound.play();
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