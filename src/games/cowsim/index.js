import loadBitmap, { loadBitmapInto } from '~/bitmapLoader';
import tileSheet from '~/assets/background.bmp';
import spriteSheet from '~/assets/sprites2.bmp';
import itemsSheet from '~/assets/items.bmp';
import ppu from '~/ppu';
import LoadingScreen from './screens/loadingScreen';
import ZeldaScreen from './screens/zeldaScreen';
import OverworldScreen from './screens/overWorldScreen';
import Hud from './screens/hud';
import PauseMenu from './screens/pauseMenu';
import GameOverScreen from './screens/gameOverScreen';
import { Randy } from '../../random';
import { hashToString, stringToHash } from './utils';
import SetSeedScreen from './screens/setSeedScreen';
import { Terrain } from './terrain';
import WorldGenerator from './worldGenerator';
import { SoundEngine } from '../../soundEngine';
import MusicScreen from './screens/musicScreen';

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

    const seed = new Randy().nextInt() & 0x3fffffff; // 30 bits
    this.setSeed(seed);

    // load tile sheets
    await loadBitmap(tileSheet, setBackgroundData);
    await loadBitmap(spriteSheet, setSpriteData);
    
    this.spriteSheets = {
      main: new Uint8Array(4096),
      enemies: new Uint8Array(4096),
      items: new Uint8Array(4096)
    };
    
    await loadBitmapInto(itemsSheet, this.spriteSheets.items);
    this.soundEngine = new SoundEngine();

    this.screens = {
      title: new LoadingScreen(this),
      enterSeed: new SetSeedScreen(this),
      world: new OverworldScreen(this),
      pause: new PauseMenu(this),
      zelda: new ZeldaScreen(this),
      gameOver: new GameOverScreen(this),
      music: new MusicScreen(this)
    };

    this.loadScreen(this.screens.title);
  }

  setSeed(seed) {
    const hash = hashToString(seed);
    console.log(`Setting seed to "${hash}" = ${seed}`);
    this.seed = seed;

    const { terrain, startingLocation, mapEntities } = WorldGenerator.generate(seed);
    this.terrain = terrain;
    this.startingLocation = startingLocation;
    this.mapEntities = mapEntities;
  }

  // implements Game.update
  update() {
    this.soundEngine.silence();
    this.currentScreen && this.currentScreen.update();
    this.soundEngine.update();
  }

  onScanline(y) {
    const current = this.currentScreen;
    current && current.onScanline && current.onScanline(y);
  }

  loadScreen(screen) {
    this.currentScreen && this.currentScreen.unload();
    this.currentScreen = screen;
    screen.load();
  }
}

export default Cowsim;
