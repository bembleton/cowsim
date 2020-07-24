import ppu from '~/ppu';
import Animation from '~/animation';
import spriteManager from '~/spriteManager';
import text from '~/text';
import SPRITES from '../data/sprites';
import { colors, palettes } from '../data/colors';
import tiles from '../data/tiles';
import { drawTile } from '../utils';
import { drawMinimap } from './terrain';

const {
  setNametable,
  setAttribute,
  setBgPalette,
  setBackgroundData
} = ppu;


const drawCounts = (rupees, keys, bombs) => {
  text(8, 0, rupees.toString().padEnd(3, ' '));
  text(8, 1, keys.toString().padEnd(3, ' '));
  text(8, 2, bombs.toString().padEnd(3, ' '));
};

/**
 * Life. Each heart contains up to 4 health
 * Max 48 health with 12 hearts
 * @param {*} amount
 * @param {*} maxHearts
 */
const drawHearts = (amount, maxHearts) => {
  let remaining = amount;
  for (let i=0; i<maxHearts; i++) {
    const x = 12 + (i % 6);
    const y = 1 - Math.floor(i / 6);
    const tile = (remaining >= 4) ? tiles.hud.hearts[0] : tiles.hud.hearts[4-remaining]
    setNametable(x, y, tile);
    if (remaining >= 4) {
      remaining -= 4;
    } else {
      remaining = 0;
    }
  }
};

/**
 * Stamina. The stamina bar has a max value of 24 in increments of 4
 * @param {*} amount 
 * @param {*} max 
 */
const drawStamina = (amount, maxAmount) => {
  let remaining = amount;
  const segments = maxAmount>>2;
  for (let i=0; i<segments; i++) {
    const x = 12 + i;
    const y = 2;
    const tile = (remaining >= 4) ? tiles.hud.stamina[0] : tiles.hud.stamina[4-remaining]
    setNametable(x, y, tile);
    if (remaining >= 4) {
      remaining -= 4;
    } else {
      remaining = 0;
    }
  }
};

export default class Hud {
  constructor() {
    this.sprites = {
      bomb: null,
      mapIndicator: null
    };
    this.mapIndicator = {
      x: 0,
      y: 0,
      visible: true
    };

    this.hudAnimation = new Animation({
      duration: 700,
      update: () => this.updateMapIndicator()
    });
  }

  load() {
    const { sprites } = this;

    /** Draw the static hud content */
    for (let y=0; y<3; y++)
    for (let x=0; x<16; x++) {
      drawTile(x, y, tiles.blank, 3);
    }

    drawMinimap();

    // icons
    setNametable(7, 0, tiles.hud.rupee);
    setNametable(7, 1, tiles.hud.key);
    // the bomb indicator is a sprite

    // rupee, key
    setAttribute(3, 0, 3);

    // rupee, key, bomb text
    setAttribute(4, 0, 3);
    setAttribute(5, 0, 3);
    setAttribute(4, 1, 3);
    setAttribute(5, 1, 3);

    // life
    setAttribute(6, 0, 1);
    setAttribute(7, 0, 1);
    setAttribute(8, 0, 1);

    // stamina
    setAttribute(6, 1, 2);
    setAttribute(7, 1, 2);
    setAttribute(8, 1, 2);

    sprites.bomb = spriteManager.requestSprite();
    spriteManager.updateSprite(sprites.bomb, {
      x: 56 + 16, y: 16 + 8,
      index: SPRITES.bomb,
      palette: 1
    });

    sprites.mapIndicator = spriteManager.requestSprite();
  }

  // called before the screen is rendered in onScanline
  setPalettes() {
    setBgPalette(0, palettes.miniMap);
    setBgPalette(1, palettes.reds);
    setBgPalette(2, palettes.seagreens);
    setBgPalette(3, palettes.golds);
  }

  updateMapIndicator() {
    const { mapIndicator } = this;
    const { visible, x, y } = mapIndicator

    spriteManager.updateSprite(this.sprites.mapIndicator, {
      index: SPRITES.mapIndicator,
      x,
      y: visible ? y : 240,
      palette: 2
    });
    mapIndicator.visible = !visible;
  }

  update(player, position) {
    const { mapIndicator, hudAnimation } = this;
    mapIndicator.x = 16 + (position.x >> 2);
    mapIndicator.y = 8 + (position.y >> 2);
    hudAnimation.update();

    const {
      rupees,
      keys,
      bombs,
      maxHearts,
      health,
      maxStamina,
      stamina
    } = player;

    drawCounts(rupees, keys, bombs);
    drawHearts(health, maxHearts);
    drawStamina(stamina, maxStamina);
  }
}