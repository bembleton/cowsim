import { colors } from '../data/colors';
import SPRITES from '../data/sprites';
import { fillBlocks, getBlock, fillWithMetaTiles, dialog, SubPixels } from '../utils';
import ppu from '~/ppu';
import text from '~/text';
import { isPressed, buttons } from '~/controller';
import { Sprite } from '../../../spriteManager';

const BLACK = colors.black;
const WHITE = colors.white;
const RED = colors.red;
const DARKRED = colors.darkred;
const GRAY = colors.gray;
const DARKGRAY = colors.darkgray;

const BLANK = 0x30;

export default class GameOverScreen {
  constructor (game) {
    this.game = game;
    this.selectedMenuItem = 0;
    this.menuSprite = new Sprite({ index: SPRITES.heart, x: 100, y: 160, palette: 0 });
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
    this.buttonStates = {
      [buttons.SELECT]: false,
      [buttons.START]: false,
    };
  }

  unload () {
    this.menuSprite.dispose();
  }

  drawMenu() {
    text(14, 20, 'RETRY', 1);
    text(14, 22, 'QUIT', 1);
    for (let j=0; j<2; j++)
    for (let i=0; i<3; i++) {
      ppu.setAttribute(7+i, 10+j, 1);
    }
    this.selectedMenuItem = 0;
    this.menuSprite.draw();
  }

  update() {
    const { game, selectedMenuItem } = this;

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

    const selectPressed = isPressed(buttons.SELECT);

    if (selectPressed && !this.buttonStates[buttons.SELECT]) {
      this.selectedMenuItem = (selectedMenuItem+1) % 2;
      this.menuSprite.update({ x:100, y: 160 + this.selectedMenuItem*16 });
    }
    this.buttonStates[buttons.SELECT] = selectPressed;

    if (isPressed(buttons.START)) {
      const screen = [
        this.game.screens.world,
        this.game.screens.title
      ][selectedMenuItem]
      game.loadScreen(screen);
    }
  }
}