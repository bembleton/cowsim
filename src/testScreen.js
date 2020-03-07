import ppu from './ppu';

const {
  HORIZONTAL,
  VERTICAL,
  setCommonBackground,
  setMirroring,
  setNametable,
  setAttribute,
  setBgPalette,
  setScroll
} = ppu;

const LIGHT_GREEN = 0x1a;
const DARK_GREEN = 0x0a;
const LIGHT_BLUE = 0x11;
const DARK_BLUE = 0x01;
const LIGHT_BROWN = 0x18;
const DARK_BROWN = 0x08;
const LIGHT_GRAY = 0x10;
const DARK_GRAY = 0x00;

export default class TestScreen {
  constructor (game) {
    this.game = game;
  }

  update (time) {

  }

  load () {
    this.game.clear();
    
    setCommonBackground(LIGHT_GREEN);
    
    setBgPalette(0, LIGHT_GREEN, LIGHT_BROWN, LIGHT_BLUE, DARK_BLUE); // grass,dirt,water,water
    setBgPalette(1, LIGHT_GREEN, DARK_GREEN, LIGHT_BROWN, DARK_BROWN); // grass,grass,dirt,dirt
    setBgPalette(2, LIGHT_GREEN, DARK_GRAY, LIGHT_BROWN, LIGHT_GRAY); // grass,dirt,rock,rock

    setAttribute(0,0,2);
    setNametable(0,0,0x47);

  }
}