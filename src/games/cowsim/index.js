import loadBitmap from '~/bitmapLoader';
import tileSheet from '~/assets/background2.bmp';
import spriteSheet from '~/assets/sprites.bmp';
import ppu from '~/ppu';

import LoadingScreen from './screens/loadingScreen';
import ZeldaScreen from './screens/zeldaScreen';

const {
  HORIZONTAL,
  setCommonBackground,
  setMirroring,
  setNametable,
  setAttribute,
  setSpriteData,
  setBackgroundData,
  getPixel,
  setScroll,
  setBgPalette,
  setSpritePalette,
} = ppu;

class Cowsim {
  // implements Game.init
  async init() {
    console.log('Resetting the game');

    // load tile sheets
    await loadBitmap(tileSheet, setBackgroundData);
    await loadBitmap(spriteSheet, setSpriteData);

    this.screens = {
      title: new LoadingScreen(this),
      zelda: new ZeldaScreen(this),
    };

    this.loadScreen(this.screens.title);
  }

  // implements Game.update
  update() {
    this.currentScreen.update();
  }

  loadScreen(screen) {
    const current = this.currentScreen;
    this.currentScreen = screen;
    current && current.unload();
    screen.load();
  }
}

export default Cowsim;
