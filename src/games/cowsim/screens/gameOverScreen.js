import { colors } from '../data/colors';
import SPRITES from '../data/sprites';
import { fillBlocks, getBlock, fillWithMetaTiles, dialog, SubPixels } from '../utils';
import ppu from '~/ppu';
import text from '~/text';
import { buttons } from '~/controller';
import { Sprite } from '../../../spriteManager';
import { GameScreen } from './screen';
import { Sfx } from '../sound';

const BLACK = colors.black;
const WHITE = colors.white;
const RED = colors.red;
const DARKRED = colors.darkred;
const GRAY = colors.gray;
const DARKGRAY = colors.darkgray;

const BLANK = 0x30;

export default class GameOverScreen extends GameScreen {
  constructor (game) {
    super(game);
    
    this.selectedMenuItem = 0;
    this.menuSprite = new Sprite({ index: SPRITES.heart, x: 100, y: 160, palette: 0 });

    this.menu = [
      {label: 'RETRY', screen: 'world'},
      {label: 'QUIT', screen: 'title'},
    ]
  }

  load () {
    ppu.enableCommonBackground(true);
    ppu.setCommonBackground(BLACK);
    ppu.setMirroring(ppu.HORIZONTAL);
    ppu.setScroll(0, 0);
    
    ppu.setBgPalette(0, BLACK, BLACK, BLACK, BLACK); // you died
    ppu.setBgPalette(1, BLACK, RED, BLACK, WHITE); // menu options
    ppu.setSpritePalette(0, BLACK, RED, WHITE, WHITE); // menu options

    // clear screen
    fillBlocks(0, 0, 16, 15, BLANK, 0);

    // YOU DIED tiles
    for (let j=0; j<2; j++)
    for (let i=0; i<10; i++) {
      ppu.setNametable(11+i, 14+j, 0xE6 + i +j*16);
    }

    // darken reds on the screen to 56%
    // emphasizing only green or blue will set reds to 75%
    ppu.emphasizeGreen(true);
    ppu.emphasizeBlue(true);

    // fade YOU DIED in over 3 seconds
    // show menu after 2 seconds
    this.frame = 192;
  }

  unload () {
    this.menuSprite.dispose();
  }

  drawMenu() {
    for (let i=0; i<this.menu.length; i++) {
      text(14, 20+i*2, this.menu[i].label, 1);
    }
    
    for (let j=0; j<2; j++)
    for (let i=0; i<3; i++) {
      ppu.setAttribute(7+i, 10+j, 1);
    }
    this.selectedMenuItem = 0;
    this.menuSprite.update({ x:100, y: 160 + this.selectedMenuItem*16 });
    this.menuSprite.draw();
  }

  select(i) {
    this.selectedMenuItem = i;
    this.menuSprite.update({ x:100, y: 160 + i*16 });
    this.game.soundEngine.play(Sfx.coin);
  }

  update() {
    const { game, selectedMenuItem, menu } = this;

    if (this.frame) {
      const frame = --this.frame;
      if (frame === 160) {
        ppu.setBgPalette(0, BLACK, DARKRED, DARKRED, BLACK);
      } else if (frame === 128) {
        ppu.setBgPalette(0, BLACK, DARKRED, RED, BLACK);
        // 75% brightness
        ppu.emphasizeGreen(false);
        ppu.emphasizeBlue(true);
      } else if (frame === 96) {
        // full brightness
        ppu.emphasizeGreen(false);
        ppu.emphasizeBlue(false);
      }

      if (frame === 0) {
        this.drawMenu();
      } else {
        return;
      }
    }

    this.updateButtonStates();

    if (this.wasPressed(buttons.SELECT)) {
      this.select((selectedMenuItem+1) % menu.length);
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
      const screen = this.menu[this.selectedMenuItem].screen;
      game.loadScreen(this.game.screens[screen]);
    }
  }
}