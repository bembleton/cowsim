import { colors } from '../data/colors';
import SPRITES from '../data/sprites';
import { fillBlocks, dialog, hashToString, stringToHash } from '../utils';
import ppu from '~/ppu';
import text from '~/text';
import { buttons, getButtonState } from '~/controller';
import { Sprite } from '../../../spriteManager';
import { Randy } from '../../../random';
import { Sfx } from '../sound';
import { GameScreen } from './screen';

const BLACK = colors.black;
const WHITE = colors.white;
const RED = colors.red;
const DARKRED = colors.darkred;
const GRAY = colors.gray;
const DARKGRAY = colors.darkgray;
const BLUE = colors.blue;

const BLANK = 0x30;

const menuItemLocations = {
  0: { x:56, y:48 }, // SEED
  1: { x:56, y:80 }, // RANDOM
  2: { x:56, y:96 }, // OK
};

const keyboardChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export default class SetSeedScreen extends GameScreen {
  constructor (game) {
    super(game);
    this.selectedMenuItem = 0;
    this.selectedChar = 0;
    this.menuSprite = new Sprite({ index: SPRITES.heart, x: 0, y: 0, palette: 0 });
    this.keyboardFocus = new Sprite({ index: SPRITES.white_square, x: 0, y: 0, palette: 1, priority: true });
    this.seedFocus = new Sprite({ index: SPRITES.white_square, x: 0, y: 0, palette: 1, priority: true });
    this.seed = '';

    this.menu = [
      { x:56, y:48 },
      { x:56, y:80, label: 'RANDOMIZE' },
      { x:56, y:96, label: 'SAVE' }
    ]
  }

  load () {
    ppu.enableCommonBackground(true);
    ppu.setCommonBackground(BLACK);
    ppu.setMirroring(ppu.HORIZONTAL);
    ppu.setScroll(0, 0);
    
    // bg colors
    ppu.setBgPalette(0, BLACK, BLACK, BLUE, WHITE);    // BG
    // sprites
    ppu.setSpritePalette(0, BLACK, RED, WHITE, WHITE); // heart
    ppu.setSpritePalette(1, BLACK, BLACK, BLACK, BLACK); // text focus

    // clear screen
    fillBlocks(0, 0, 16, 15, BLANK, 0);

    this.drawMenu();
    this.selectMenuItem(0);
    const hash = hashToString(this.game.seed); // convert to a hash code
    this.setSeed(hash);
    this.advanceSelectedChar(0);

    this.buttonState = getButtonState();
    this.frame = 64;
  }

  unload () {
    this.menuSprite.dispose();
    this.keyboardFocus.dispose();
    this.seedFocus.dispose();
  }

  drawMenu() {
    text(10, 2, 'ENTER  SEED', 0)
    dialog(9, 5, '###########', 0); // seed box
    text(10, 10, 'RANDOMIZE', 0);
    text(10, 12, 'SAVE', 0);
    dialog(7, 17, 
     `A B C D E F G H

      J K L M N P Q R

      S T U V W X Y Z

      2 3 4 5 6 7 8 9`, 0);
    this.selectedMenuItem = 0;
    this.menuSprite.draw();
    this.keyboardFocus.draw();
    this.seedFocus.draw();
  }
  
  setSeed(hash) {
    this.seed = hash;
    text(10, 6, hash.padEnd(6, ' ').split('').join(' '));
    const length = hash.length < 6 ? 80 + hash.length : hash.length-1;
    this.seedFocus.update({ x: 80 + length*8 * 2, y: 48 });
  }

  selectMenuItem(item) {
    this.selectedMenuItem = item;
    const { x, y } = this.menu[item];
    this.menuSprite.update({ x, y });
    this.frame = 64;
    
  }

  advanceSelectedChar(offset) {
    this.selectedChar = (this.selectedChar + offset) % 32;
    if (this.selectedChar < 0) this.selectedChar += 32;
    const x = 64 + (this.selectedChar % 8) * 16;
    const y = 144 + (this.selectedChar >> 3) * 16;
    this.keyboardFocus.update({ x, y });
    this.frame = 64;
    this.game.soundEngine.play(Sfx.coin);
  }

  enterSelectedChar() {
    if (this.seed.length < 6) {
      const seed = this.seed + keyboardChars[this.selectedChar];
      this.setSeed(seed);
    }
    this.frame = 64;
    this.game.soundEngine.play(Sfx.bomb);
  }

  eraseChar() {
    if (this.seed.length > 0) {
      const seed = this.seed.substring(0, this.seed.length-1);
      this.setSeed(seed);
    }
    this.frame = 64;
    this.game.soundEngine.play(Sfx.sword);
  }

  randomizeSeed() {
    const hash = new Randy().nextInt() & 0x3fffffff;
    this.setSeed(hashToString(hash));
    this.game.soundEngine.play(Sfx.itemCollect);
  }

  save() {
    const seed = stringToHash(this.seed.padEnd(6, ' '));
    this.game.setSeed(seed);
    this.game.loadScreen(this.game.screens.title);
  }

  update() {
    const { game, selectedMenuItem } = this;

    if (--this.frame < 0) this.frame = 64;

    const focusColor = ((this.frame < 32) || (this.selectedMenuItem !== 0)) ? BLACK : 0x22;
    ppu.setSpritePalette(1, BLACK, BLACK, BLACK, focusColor);

    this.updateButtonStates();

    if (this.wasPressed(buttons.SELECT)) {
      this.selectMenuItem((selectedMenuItem+1) % 3);
      this.game.soundEngine.play(Sfx.coin);
    }

    else if (this.wasPressed(buttons.START)) {
      switch (selectedMenuItem) {
        case 0: break;
        case 1: this.randomizeSeed(); break;
        case 2: break;
      }
    }

    // only exit menu after releasing the save button
    else if (this.wasReleased(buttons.START) || this.wasReleased(buttons.A)) {
      switch (selectedMenuItem) {
        case 2: this.save(); break;
      }
    }

    else if (this.wasPressed(buttons.A)) {
      switch (selectedMenuItem) {
        case 0: this.enterSelectedChar(); break;
        case 1: this.randomizeSeed(); break;
        case 2: break;
      }
    }

    else if (this.selectedMenuItem === 0) {
      if (this.wasPressed(buttons.B)) {
        this.eraseChar();
      }
      else if (this.wasPressed(buttons.LEFT)) {
        this.advanceSelectedChar(-1);
      }
      else if (this.wasPressed(buttons.RIGHT)) {
        this.advanceSelectedChar(1);
      }
      else if (this.wasPressed(buttons.UP)) {
        this.advanceSelectedChar(-8);
      }
      else if (this.wasPressed(buttons.DOWN)) {
        this.advanceSelectedChar(8);
      }
    }
  }

  wasPressed(button) {
    const { previousButtonState, buttonState } = this;
    return !previousButtonState[button] && buttonState[button];
  }
  wasReleased(button) {
    const { previousButtonState, buttonState } = this;
    return previousButtonState[button] && !buttonState[button];
  }
}