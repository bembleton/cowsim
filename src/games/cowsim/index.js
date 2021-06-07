import loadBitmap, { loadBitmapInto } from '~/bitmapLoader';
import tileSheet from '~/assets/background.bmp';
import spriteSheet from '~/assets/sprites2.bmp';
import itemsSheet from '~/assets/items.bmp';
import ppu from '~/ppu';
import { setSeed } from './screens/terrain';

import LoadingScreen from './screens/loadingScreen';
import ZeldaScreen from './screens/zeldaScreen';
import OverworldScreen from './screens/overWorldScreen';
import Hud from './screens/hud';
import PauseMenu from './screens/pauseMenu';

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

    setSeed(Math.floor(Math.random()*999999999));

    // load tile sheets
    await loadBitmap(tileSheet, setBackgroundData);
    await loadBitmap(spriteSheet, setSpriteData);
    
    this.spriteSheets = {
      main: new Uint8Array(4096),
      enemies: new Uint8Array(4096),
      items: new Uint8Array(4096)
    };
    
    await loadBitmapInto(itemsSheet, this.spriteSheets.items);
    
    this.hud = new Hud();

    this.screens = {
      title: new LoadingScreen(this),
      world: new OverworldScreen(this),
      pause: new PauseMenu(this),
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
