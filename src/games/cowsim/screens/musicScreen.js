import { colors } from '../data/colors';
import SPRITES from '../data/sprites';
import { fillBlocks, getBlock, fillWithMetaTiles, dialog, SubPixels } from '../utils';
import ppu from '~/ppu';
import text from '~/text';
import { getButtonState, buttons } from '~/controller';
import { Sprite } from '../../../spriteManager';

import zelda from '../../../music/zelda.txt';
import ducks from '../../../music/ducks.txt';
import surfer from '../../../music/ss.txt';
import solstice from '../../../music/solstice.txt';

import { apu } from '../../../sound';
import { GameScreen } from './screen';
import { Sfx } from '../sound';
import { SoundEngine } from '../../../soundEngine';

const BLACK = colors.black;
const WHITE = colors.white;
const RED = colors.red;
const BLUE = colors.blue;
const DARKRED = colors.darkred;
const GRAY = colors.gray;
const DARKGRAY = colors.darkgray;

const BLANK = 0x30;

const blue = 0x12;
const purple = 0x14;
const red = 0x16;
const gold = 0x27;

export default class MusicScreen extends GameScreen {
  constructor (game) {
    super(game);
    this.menuSprite = new Sprite({ index: SPRITES.heart, x: 88, y: 160, palette: 0 });

    this.menu = [
      {label: 'WOOD ELF', data: zelda, song: 0},
      {label: 'RICH DUCK', data: ducks, song: 0},
      {label: 'SURFER', data: surfer, song: 0},
      {label: 'WIZARD', data: solstice, song: 0},
      {label: 'EXIT', exit: true}
    ];

    // for playing custom music
    this.soundEngine = new SoundEngine();
  }

  load () {
    ppu.enableCommonBackground(true);
    ppu.setCommonBackground(BLACK);
    ppu.setMirroring(ppu.HORIZONTAL);
    ppu.setScroll(0, 0);
    
    ppu.setBgPalette(0, BLACK, 0x10, blue, WHITE); // you died
    ppu.setBgPalette(1, BLACK, RED, purple, WHITE); // menu options
    ppu.setBgPalette(2, BLACK, RED, red, WHITE); // menu options
    ppu.setBgPalette(3, BLACK, RED, gold, WHITE); // menu options

    ppu.setSpritePalette(0, BLACK, RED, gold, WHITE); // menu options

    // clear screen
    fillBlocks(0, 0, 16, 13, BLANK, 1);

    dialog(10, 5, `SELECT MUSIC`, 0); // blue

    this.drawMenu();
    this.selectedMenuItem = 0;
    this.menuSprite.update({ x:88, y: 80 });
    
    // VU meters
    //fillBlocks(6, 10, 4, 4, BLANK, 1);

    
    // text(13, 28, '1', 1);
    // text(15, 28, '2', 1);
    // ppu.setNametable(13, 27, 0x48);
    // ppu.setNametable(15, 27, 0x48);
    //ppu.setAttribute(13>>1, 27>>1, )
    fillBlocks(0, 13, 16, 2, BLANK, 0);
    ppu.setNametable(13, 27, 0x31);
    ppu.setNametable(15, 27, 0x31);
    ppu.setNametable(17, 27, 0x49);
    ppu.setNametable(19, 27, 0x60);

    // text(13, 27, 'P');
    // text(15, 27, 'P');
    // text(17, 27, 'T');
    // text(19, 27, 'N');
  }

  unload () {
    this.menuSprite.dispose();
    this.soundEngine.clear();
  }

  drawMenu() {
    for (let i=0; i<this.menu.length; i++) {
      // 104,80
      text(13, 10+i*2, this.menu[i].label);
    }
    this.menuSprite.draw();
  }

  select(i) {
    this.selectedMenuItem = i;
    this.menuSprite.update({ x:88, y: 80 + i*16 });
    this.game.soundEngine.play(Sfx.coin);
  }

  update() {
    const { game, selectedMenuItem, menu } = this;

    this.updateButtonStates();

    if (this.wasPressed(buttons.SELECT)) {
      this.select((selectedMenuItem + 1) % menu.length);
    }

    if (this.wasPressed(buttons.UP)) {
      if (selectedMenuItem > 0) {
        this.select(selectedMenuItem - 1);
      }
    }

    if (this.wasPressed(buttons.DOWN)) {
      if (selectedMenuItem < menu.length - 1) {
        this.select(selectedMenuItem + 1);
      }
    }

    if (this.wasReleased(buttons.START) || this.wasReleased(buttons.A)) {
      const { data, song, exit } = menu[selectedMenuItem];
      
      if (exit) {
        game.loadScreen(game.screens.title);
        return;
      }

      this.soundEngine.load(data);
      this.soundEngine.play(song, true);
    }

    this.soundEngine.silence();
    this.soundEngine.update();

    // VU meters
    this.drawVolume(apu.pulse1, 13);
    this.drawVolume(apu.pulse2, 15);
    this.drawVolume(apu.triangle, 17);
    this.drawVolume(apu.noise, 19);
  }

  drawVolume(channel, x) {
    const level = channel.getVolume() >> 1;
    const freq = channel.getFrequency();
    const oct = octave(freq) >> 1;

    for (let i=0; i<7; i++) {
      const tile = i < level ? 0x33 : 0x30;
      ppu.setNametable(x, 25-i, tile);
      
    }
    ppu.setAttribute(x>>1, 10, oct);
    ppu.setAttribute(x>>1, 11, oct);
    ppu.setAttribute(x>>1, 12, oct);
  }
}

function octave(f) {
  var octzero = 16.35159783;
  return Math.floor(Math.log(f/octzero)/Math.log(2))
}