import ppu from '~/ppu';
import Animation from '~/animation';
import spriteManager from '~/spriteManager';
import text from '~/text';
import SPRITES from '../data/sprites';
import { colors, palettes } from '../data/colors';
import tiles from '../data/tiles';
import { drawTile, fillBlocks } from '../utils';
import * as terrain from './terrain';
import { MetaSprite, Sprite } from '../../../spriteManager';

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
 * Max 64 health with 16 hearts
 * @param {*} amount
 * @param {*} maxHearts
 */
const drawHearts = (amount, maxHearts) => {
  let remaining = amount;
  for (let i=0; i<16; i++) {
    const x = 12 + (i % 8);
    const y = 1 - Math.floor(i / 8);
    const tile =
      i >= maxHearts ? 0x30 : 
      (remaining >= 4) ? tiles.hud.hearts[0] :
      tiles.hud.hearts[4-remaining];
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

const renderMinimapToTiles = ({ screenPosition, scale }) => {
  const { x, y } = screenPosition;
  terrain.drawMinimap(x + 8, y + 6, scale);
};


const itemB_px = 22*8;
const itemA_px = 26*8;

export default class Hud {
  constructor() {
    this.map = {
      screenPosition: {
        x: 0,
        y: 0
      },
      scale: 2
    };
    this.sprites = {
      bomb: null,
      mapIndicator: null,
      itemB: null,
      itemA: new MetaSprite({ x: itemA_px , y: 16 })
    };
    this.sprites.itemA.add(SPRITES.weapon, 0, 0);
    this.sprites.itemA.add(SPRITES.weapon + 16, 0, 8);
    this.mapIndicator = {
      x: 16 + 32/2 - 3,
      y: 8 + 32/2 - 3,
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
    fillBlocks(0, 0, 16, 3, tiles.blank, 3);

    // render the minimap as background tiles
    renderMinimapToTiles(this.map);

    // draw the minimap in the hud
    drawTile(1, 0, 0xc0, 0);
    drawTile(2, 0, 0xc2, 0);
    drawTile(1, 1, 0xe0, 0);
    drawTile(2, 1, 0xe2, 0);

    // icons
    setNametable(7, 0, tiles.hud.rupee);
    setNametable(7, 1, tiles.hud.key);
    setNametable(7, 2, tiles.hud.bomb);
    // the bomb indicator is a sprite

    // rupee, key
    setAttribute(3, 0, 1);

    // bomb
    setAttribute(3, 1, 3);

    // rupee, key, bomb text
    setAttribute(4, 0, 1);
    setAttribute(5, 0, 1);
    setAttribute(4, 1, 1);
    setAttribute(5, 1, 1);

    // life
    setAttribute(6, 0, 1);
    setAttribute(7, 0, 1);
    setAttribute(8, 0, 1);
    setAttribute(9, 0, 1);

    // stamina
    setAttribute(6, 1, 2);
    setAttribute(7, 1, 2);
    setAttribute(8, 1, 2);

    const drawItemBox = (x, name) => {
      setNametable(x, 0, tiles.menu.topleft);
      text(x+1, 0, name);
      setNametable(x+2, 0, tiles.menu.topright);
      setNametable(x, 1, tiles.menu.vertical);
      setNametable(x+2, 1, tiles.menu.vertical);
      setNametable(x, 2, tiles.menu.vertical);
      setNametable(x+2, 2, tiles.menu.vertical);
      setNametable(x, 3, tiles.menu.bottomleft);
      setNametable(x+1, 3, tiles.menu.horizontal);
      setNametable(x+2, 3, tiles.menu.bottomright);
    }
    // item B
    drawItemBox(21, 'B');

    // item A
    drawItemBox(25, 'A');

    // sprites.bomb = spriteManager.requestSprite();
    // spriteManager.updateSprite(sprites.bomb, {
    //   x: 56 + 16, y: 16 + 8,
    //   index: SPRITES.bomb_small,
    //   palette: 1
    // });

    sprites.mapIndicator = spriteManager.requestSprite();

    this.rupeeCount = 0;
    this.frame = 0;
  }

  unload() {
    spriteManager.clearSprite(this.sprites.mapIndicator);
    this.setItemB(null);
    this.setItemA(null);
  }

  // called before the screen is rendered in onScanline
  setPalettes() {
    setBgPalette(0, palettes.miniMap);
    setBgPalette(1, palettes.reds);
    setBgPalette(2, palettes.seagreens);
    setBgPalette(3, palettes.blues);
  }

  updateMapIndicator() {
    const { mapIndicator } = this;
    const { visible, x, y } = mapIndicator

    spriteManager.updateSprite(this.sprites.mapIndicator, {
      index: SPRITES.mapIndicator,
      x,
      y: visible ? y : 240,
      palette: 1
    });
    mapIndicator.visible = !visible;
  }

  setPosition(x, y) {
    this.map.screenPosition.x = x;
    this.map.screenPosition.y = y;
    renderMinimapToTiles(this.map);
  }

  update(player) {
    const { hudAnimation, rupeeCount, sprites } = this;
    hudAnimation.update();

    const {
      rupees,
      keys,
      bombs,
      maxHearts,
      health,
      maxStamina,
      stamina,
      overheating,
      speedUp,
      attackUp,
      weapon,
      itemB,
      arrows
    } = player;

    this.frame = (this.frame+1) % 2;
    if (this.frame === 0) {
      this.rupeeCount += Math.sign(rupees - rupeeCount);
    }
    drawCounts(this.rupeeCount, keys, bombs);
    drawHearts(health, maxHearts);
    drawStamina(stamina, maxStamina);
  }

  setItemB(item) {
    if (this.sprites.itemB) {
      this.sprites.itemB.dispose();
    }
    if (!item) return;

    const { sprite, palette } = item;
    // 8x8
    if (sprite === SPRITES.boomerang) {
      this.sprites.itemB = new Sprite({ index: sprite, palette, x: itemB_px, y: 20 });
    } else {
      this.sprites.itemB = new MetaSprite({ palette, x: itemB_px, y: 16 });
      this.sprites.itemB.add(sprite, 0, 0);
      this.sprites.itemB.add(sprite + 16, 0, 8);
    }
    this.sprites.itemB.draw();
  }

  setItemA(item) {
    if (!item) {
      this.sprites.itemA.dispose();
      return;
    }

    // itemA is always SPRITES.weapon which get's updated in the sprite table
    // just update the palette
    const {  palette } = item;
    this.sprites.itemA.update({ palette });
    this.sprites.itemA.draw();
  }
}