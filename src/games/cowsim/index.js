import loadBitmap from '~/bitmapLoader';
import tileSheet from '~/assets/background.bmp';
import spriteSheet from '~/assets/sprites.bmp';
import ppu from '~/ppu';

import LoadingScreen from './screens/loadingScreen';
import ZeldaScreen from './screens/zeldaScreen';
import OverworldScreen from './screens/overWorldScreen';

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
      world: new OverworldScreen(this),
      zelda: new ZeldaScreen(this),
    };

    this.loadScreen(this.screens.title);
  }

  // implements Game.update
  update() {
    this.currentScreen.update();
  }

  onScanline(y) {
    const current = this.currentScreen;
    current && current.onScanline && current.onScanline(y);
  }

  loadScreen(screen) {
    const current = this.currentScreen;
    this.currentScreen = screen;
    current && current.unload();
    screen.load();
  }
}

export default Cowsim;
