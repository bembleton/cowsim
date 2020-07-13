import SimplexNoise from 'simplex-noise';
import ppu from '~/ppu';
import spriteManager from '~/spriteManager';
import { isPressed, buttons } from '~/controller';
import Animation from '~/animation';
import { randInt } from '~/random';
import text from '~/text';
import Link from '../link';
import { getBlock, drawMetaTile, SubPixels } from '../utils';

const { dir } = Link;

const {
  HORIZONTAL,
  VERTICAL,
  enableCommonBackground,
  setMirroring,
  setNametable,
  getNametable,
  setAttribute,
  setBgPalette,
  setSpritePalette,
  setScroll,
  getScroll,
  getScreenSpaceTile,
  screenToTileX,
  screenToTileY,
  setBackgroundData
} = ppu;


const tiles = {
  blank: 0xee,
  water: 0x46,
  tall_grass: 0x62,
  grass: 0x46,
  dirt: 0x46,
  sand: 0xa0,
  rock: 0x84,
}

// empty, 1/4, 1/2, 3/4, full
const hudTiles = {
  hearts: [0x2b, 0x2c, 0x2d, 0x2e, 0x2f],
  stamina: [0x3b, 0x3c, 0x3d, 0x3e, 0x3f],
  rupee: 0x4b,
  key: 0x4c
};

const hudSprites = {
  mapIndicator: 0x0d,
  bomb: 0x1a
}

const white = 0x20;
const black = 0x3f;
const red = 0x16;
const gray = 0x00;
const blue = 0x11;

const green = 0x29;
const LIGHT_GREEN = 0x29;
const MED_GREEN = 0x1a;
const DARK_GREEN = 0x0b;

const palettes = [
  [black, 0x02, 0x11, 0x21], // water
  [LIGHT_GREEN, DARK_GREEN, DARK_GREEN, MED_GREEN], // grass
  [0x38, 0x08, 0x17, 0x2d],  // dirt
  [black, 0x00, 0x10, 0x20]  // rock
];

const hud_palettes = [
  [blue, 0x0a, 0x36, gray],     // mini map (blue,green,tan,gray)
  [black, 0x06, 0x16, white],   // life (dark red, red)
  [black, 0x0b, 0x2b, white],   // seagreens: stamina
  [black, black, 0x27, white]   // black, gold, white: rupee, text
];

const brownTanGreen = [black, 0x06, 0x27, 0x2A];

const drawTile = (x, y, tile, palette) => {
  const block = getBlock(tile);
  drawMetaTile(x, y, block, palette);
}

let simplex = new SimplexNoise();
const noise2d = (x, y) => {
  return (simplex.noise2D(x, y) + 1) / 2;
};

const exp = 1.1;
const scale = 48; // pixel wide
const mapScale = 12; // 1-quarter scale

const noise = (x, y) => {
  const val = noise2d(x / scale, y / scale);
  return Math.pow(val, exp);
};

/*
0: water
1: tall_grass
2: grass
3: sand
4: dirt
5: rock
*/
const elevation = (x, y) => {
  return Math.floor(noise(x, y) * 6);
};

const tileMap = [
  tiles.water,
  tiles.grass,
  tiles.grass,
  tiles.grass,
  tiles.sand,
  tiles.rock
];

// make this better
const isWater = (e) => e === 0;
const isSolid = (e) => e === 5;

const paletteMap = [0, 1, 1, 1, 2, 3];

const drawMinimap = () => {
  const start = 0x00c0 << 4;  // bytes
  const width = 48;           // pixels
  const height = 32;          // pixels
  let data = 0x00;
  for (let y=0; y<height; y++)
  for (let x=0; x<width; x++) {
    const elev = Math.pow(noise2d(x/mapScale, y/mapScale), exp) * 6;
    const color = paletteMap[Math.floor(elev)] & 0xff;
    data = (data << 2 | color) & 0xff; 
    if (x % 4 === 3) {
      const adr = start + (y*32) + (x >> 2);
      setBackgroundData(adr, data);
    }
  }

  drawTile(0, 0, 0xc0, 0);
  drawTile(1, 0, 0xc2, 0);
  drawTile(2, 0, 0xc4, 0);
  drawTile(0, 1, 0xe0, 0);
  drawTile(1, 1, 0xe2, 0);
  drawTile(2, 1, 0xe4, 0);
};

/** Draw the static hud content */
const drawHud = () => {
  for (let y=0; y<3; y++)
  for (let x=0; x<16; x++) {
    drawTile(x, y, tiles.blank, 3);
  }

  drawMinimap();

  // icons
  setNametable(7, 0, hudTiles.rupee);
  setNametable(7, 1, hudTiles.key);

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
};

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
    const tile = (remaining >= 4) ? hudTiles.hearts[0] : hudTiles.hearts[4-remaining]
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
    const tile = (remaining >= 4) ? hudTiles.stamina[0] : hudTiles.stamina[4-remaining]
    setNametable(x, y, tile);
    if (remaining >= 4) {
      remaining -= 4;
    } else {
      remaining = 0;
    }
  }
};

// draws map area posx, posy into nametable at namex, namey
const drawArea = (posx, posy, tilex, tiley) => {
  // fill background (16x12 tiles worth)
  for (let y=0; y<12; y++) {
    for (let x=0; x<16; x++) {
      const e = elevation(posx + x, posy + y);
      const tile = tileMap[e]; // 0x1a + e;
      const palette = paletteMap[e];
      drawTile(tilex + x, tiley + y, tile, palette);
    }
  }
}

export default class HudWrapScreen {
  constructor (game) {
    this.game = game;

    this.scroll = {
      x: 0,
      y: 0
    };

    // current map position
    // each 'screen' is 16x12
    // the full map is 12 screens wide
    // position is 192x
    this.position = {
      x: 16*4,
      y: 12*4,
    };

    // null, 'up', 'down', 'left', 'right'
    this.scrolling = null;
    this.mirroring = HORIZONTAL;

    this.sprites = {};
    this.mapIndicator = {
      sprite: null,
      x: 0,
      y: 0,
      visible: true
    };

    this.hudAnimation = new Animation({
      duration: 700,
      update: () => this.updateMapIndicator()
    });

    this.player = {
      maxHearts: 3,
      health: 3*4,
      maxStamina: 3*4,
      stamina: 12,
      staminaClock: 0,
      staminaRates: {
        recharge: 120,
        dash: 30,
        swim: 60
      },
      speedWalking: 16,
      speedDash: 32,
      speedSwimming: 8,
      rupees: 255,
      keys: 1,
      bombs: 0
    };
  }

  load () {
    simplex = new SimplexNoise();

    enableCommonBackground(false);
    palettes.forEach((x,i) => {
      setBgPalette(i, x);
    });

    setSpritePalette(0, brownTanGreen); // link
    setSpritePalette(1, black, blue, gray, white); // bomb
    setSpritePalette(2, black, blue, red, white); // 
    setSpritePalette(3, black, blue, gray, white); // 

    this.mirroring = HORIZONTAL;
    setMirroring(HORIZONTAL);

    // start in top-left corner?
    const { x, y } = this.position;
    drawArea(x, y, 0, 3);

    drawHud();

    const bomb = spriteManager.requestSprite();
    spriteManager.updateSprite(bomb, {
      x: 56 + 16, y: 16 + 8,
      index: 0x2d,
      palette: 1
    });

    this.mapIndicator.sprite = spriteManager.requestSprite();
    this.updateMapIndicator();

    const link = Link.create();
    link.pos = SubPixels.fromPixels(64, 64);
    link.palette = 0;
    this.link = link;

    Link.draw(link);
  }

  unload () {

  }

  onScanline (y) {
    // draw hud
    if (y === 0) {
      // draw one row of black tiles from the bottom,
      // and 1 column of tiles from the right side, of the hud
      setScroll(0, 32);
      setMirroring(HORIZONTAL);
      // set the hud palettes
      hud_palettes.forEach((x,i) => {
        setBgPalette(i, x);
      });
    } else if (y === 8) {
      // set scroll-y to -8 to center the hud
      setScroll(-16, -8);
    } else if (y === 48) {
      // set the scroll and mirror mode back to normal
      setMirroring(this.mirroring);
      setScroll(this.scroll.x, this.scroll.y);
      // set the camera palettes
      palettes.forEach((x,i) => {
        setBgPalette(i, x);
      });
    }
  }

  setMirrorMode(mode) {
    setMirroring(mode);
    this.mirroring = mode;
  }

  update () {
    const { scrolling } = this;
    
    if (scrolling) {
      this.doScroll();
    }

    this.updateLink();
    this.updateHud();
  }

  updateHud() {
    const { hudAnimation, player } = this;
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

  updateMapIndicator() {
    const { mapIndicator, position } = this;
    const { sprite, visible } = mapIndicator
    spriteManager.updateSprite(sprite, {
      index: hudSprites.mapIndicator,
      x: 16 + position.x/4,
      y: visible ? 8 + position.y/4 : 240,
      palette: 2
    });
    mapIndicator.visible = !visible;
  }

  updateLink () {
    const { link, scrolling, player } = this;
    let { direction, frame } = link;

    const canMove = !scrolling;
    link.frame = (frame+1) % 256;
    link.moving = scrolling;
    link.lastDirection = direction;

    if (scrolling) {
      // noop
    } else if (isPressed(buttons.UP)) {
      link.direction = dir.UP;
      if (canMove) {
        link.moving = true;
        this.tryMoveLinkUp();
      }
    } else if (isPressed(buttons.DOWN)) {
      link.direction = dir.DOWN;
      if (canMove) {
        link.moving = true;
        this.tryMoveLinkDown();
      }
    } else if (isPressed(buttons.RIGHT)) {
      link.direction = dir.RIGHT;
      if (canMove) {
        link.moving = true;
        this.tryMoveLinkRight();
      }
    } else if (isPressed(buttons.LEFT)) {
      link.direction = dir.LEFT;
      if (canMove) {
        link.moving = true;
        this.tryMoveLinkLeft();
      }
    }

    this.coerceLink();

    // in water?
    if (!this.scrolling) {
      const screenPos = link.pos.toPixels();
      screenPos.x += 8;
      screenPos.y += 8; // link's feet
      const { x, y } = this.screenToWorld(screenPos); // world tile
      const e = elevation(x, y);
      const swimming = isWater(e);
      if ((!link.swimming && swimming) || (link.swimming && !swimming)) {
        player.staminaClock = 0;
      }
      link.swimming = swimming;
    }

    link.speed = this.getSpeed();

    // use or regain stamina
    this.updateStamina();
    
    Link.draw(link);
  }

  getSpeed() {
    const { link, player } = this;
    const { moving, swimming, dashing } = link;
    const { speedSwimming, speedWalking, speedDash } = player;
    if (swimming) return speedSwimming;
    if (dashing) return speedDash;
    return speedWalking;
  }

  updateStamina() {
    const { link, player } = this;
    const { health, stamina, maxStamina, staminaRates } = player;
    const { swimming, moving } = link;

    // swimming
    if (swimming && stamina > 0) {
      if (this.staminaUsageElapsed(staminaRates.swim)) {
        player.stamina -= 1;
      }
    // drowning
    } else if (swimming && stamina === 0 && health > 0) {
      if (this.staminaUsageElapsed(staminaRates.swim)) {
        this.takeDamage(2);
      }
    // idle
    } else if (!swimming && stamina < maxStamina) {
      const rate = moving ? staminaRates.recharge : staminaRates.recharge/2;
      if (this.staminaUsageElapsed(rate)) {
        player.stamina += 1;
      }
    }
  }

  staminaUsageElapsed(rate) {
    const { player } = this;
    player.staminaClock += 1;
    if (player.staminaClock >= rate) {
      player.staminaClock = 0;
      return true;
    }
    return false;
  }

  takeDamage(amount) {
    const { player } = this;
    const { health, stamina } = this.player;
    player.health -= amount;
    if (player.health < 0) player.health = 0;
    if (player.health === 0) {
      this.die();
    }
  }

  die() {
    // animation
    // end screen
  }

  tryMoveLinkUp() {
    const { link, scroll } = this;
    const { speed: dv } = link;

    const newPos = link.pos.add(0, -dv);
    const { x, y } = newPos.toPixels();
    const e1 = this.screenToElevation(x, y+8);
    const e2 = this.screenToElevation(x+15, y+8);

    // collisions
    if (isSolid(e1) || isSolid(e2)) {
      // push back to a tile edge?
      return;
    }

    // move
    link.pos = newPos;

    // scroll at the edge of the screen
    const top = 48;
    if (y <= top) {
      link.pos.setPixelY(top);
      this.scrollUp()
    }
  }

  tryMoveLinkDown() {
    const { link } = this;
    const { speed: dv } = link;

    const newPos = link.pos.add(0, dv);
    const { x, y } = newPos.toPixels();
    const e1 = this.screenToElevation(x, y+16);
    const e2 = this.screenToNametable(x+15, y+16);

    // collisions
    if (isSolid(e1) || isSolid(e2)) {
      // push back to a tile edge?
      return;
    }

    // move
    link.pos = newPos;

    // scroll at the edge of the screen
    const bottom = 240-16;
    if (y >= bottom) {
      link.pos.setPixelY(bottom);
      this.scrollDown();
    }
  }

  tryMoveLinkRight() {
    const { link } = this;
    const { speed: dv } = link;

    const newPos = link.pos.add(dv, 0);
    const { x, y } = newPos.toPixels();
    const e1 = this.screenToElevation(x+16, y+8);
    const e2 = this.screenToElevation(x+16, y+15);

    // collisions
    if (isSolid(e1) || isSolid(e2)) {
      return;
    }

    // move
    link.pos = newPos;

    // scroll at the edge of the screen
    const right = 256-16;
    if (x >= right) {
      link.pos.setPixelX(right);
      this.scrollRight()
    }
  }

  tryMoveLinkLeft() {
    const { link } = this;
    const { speed: dv } = link;

    const newPos = link.pos.add(-dv, 0);
    const { x, y } = newPos.toPixels();
    const e1 = this.screenToElevation(x, y+8);
    const e2 = this.screenToElevation(x, y+15);

    // collisions
    if (isSolid(e1) || isSolid(e2)) {
      return;
    }

    // move
    link.pos = newPos;

    // scroll at the edge of the screen
    const left = 0;
    if (x <= left) {
      link.pos.setPixelX(left);
      this.scrollLeft()
    }
  }
  
  coerceLink() {
    const { link } = this;
    const { direction, lastDirection, pos } = link;
    const { x, y } = pos.toPixels();

    if (link.moving) {
      // coerce alignment to half-blocks (8 pixels)
      if (direction === dir.UP || direction === dir.DOWN) {
        if (x % 8 > 0) {
          const min = lastDirection === dir.LEFT ? 4 : 3;
          const dx = (x % 8) < min ? -1 : 1;
          link.pos = pos.addPixels(dx, 0);
        }
      } else {
        if (y % 8 > 0) {
          const min = lastDirection === dir.UP ? 4 : 3;
          const dy = (y % 8) < min ? -1 : 1;
          link.pos = pos.addPixels(0, dy);
        }
      }
    }
  }

  doScroll() {
    const scrollAmt = 4;
    const { scroll, scrolling, link } = this;
    const { x, y } = link.pos.toPixels();

    const top = 48;
    const left = 0;
    const right = 256-16;
    const bottom = 240-16;

    // left to right: 256/4 = 64 frames
    // link needs to move from x:240 to x:0 in 64 frames = 3.75 px/frame = 60 spx
    const dspx = 60;

    // top to bottom: 192/4 = 48 frames
    // link needs to move from y:48 to y:224 in 48 frames. 3.66 px/frame = 59 spx
    const dspy = 59;

    switch (scrolling) {
      case 'down':
        this.scroll.y += scrollAmt;
        if (y > top) {
          link.pos = link.pos.add(0, -dspy);
        }
        // finished scrolling?
        if (this.scroll.y === 12*16) {
          // copy to first nametable
          // could optimize by drawing rows as we scroll?
          drawArea(this.position.x, this.position.y, 0, 3);
          // and reset the scroll to 0,0
          this.scroll.y = 0;
          this.scrolling = null;
        }
        break;
      case 'right':
        this.scroll.x += scrollAmt;
        if (x > left) {
          link.pos = link.pos.add(-dspx, 0);
        }
        // finished scrolling?
        if (this.scroll.x === 16*16) {
          // copy to first nametable
          // could optimize by drawing rows as we scroll?
          drawArea(this.position.x, this.position.y, 0, 3);
          // and reset the scroll to 0,0
          this.scroll.x = 0;
          this.scrolling = null;
          this.setMirrorMode(HORIZONTAL);
        }
        break;
      case 'up':
        this.scroll.y -= scrollAmt;
        if (y < bottom) {
          link.pos = link.pos.add(0, dspy);
        }
        // finished scrolling?
        if (this.scroll.y === 0) {
          this.scrolling = null;
        }
        break;
      case 'left':
        this.scroll.x -= scrollAmt;
        if (x < right) {
          link.pos = link.pos.add(dspx, 0);
        }
        // finished scrolling?
        if (this.scroll.x === 0) {
          this.scrolling = null;
          this.setMirrorMode(HORIZONTAL);
        }
        break;
    }
    setScroll(scroll.x, scroll.y);
  }

  scrollDown () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(HORIZONTAL);
    // load next screen below
    drawArea(posx, posy + 12, 0, 15);
    this.position.y += 12;
    this.scrolling = 'down';
  }

  scrollRight () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(VERTICAL);
    // load next screen to the right
    drawArea(posx + 16, posy, 16, 3);
    this.position.x += 16;
    this.scrolling = 'right';
  }

  scrollUp () {
    const { position } = this;
    const { x: posx, y: posy } = position;

    this.setMirrorMode(HORIZONTAL);
    // copy current screen below
    drawArea(posx, posy, 0, 15);
    this.scroll.y = 12*16;
    setScroll(0, 12*16);

    // load next screen above
    // could optimize by drawing rows as we scroll?
    drawArea(posx, posy - 12, 0, 3);
    this.position.y -= 12;
    this.scrolling = 'up';
  }

  scrollLeft () {
    const { position } = this;
    const { x: posx, y: posy } = position;

    this.setMirrorMode(VERTICAL);
    // copy current screen to the right
    drawArea(posx, posy, 16, 3);
    this.scroll.x = 16*16;
    setScroll(256, 0);

    // load next screen on the left
    // could optimize by drawing rows as we scroll?
    drawArea(posx - 16, posy, 0, 3);
    this.position.x -= 16;
    this.scrolling = 'left';
  }

  /**
   * converts sprite position to world position in blocks
   * @param {*} spritePos screen position in pixels
   * @param {*} pos world position offset
   */
  screenToWorld({ x, y }) {
    const { position } = this;
    const { x: posx, y: posy } = position;
    const i = (x>>4); // px to block
    const j = (y>>4) - 3; // exclude hud
    return {
      x: posx + i,
      y: posy + j
    }
  };

  /**
   * gets the tile for a given pixel position 
   */
  screenToNametable(x, y) {
    const i = (x>>3);
    const j = (y>>3);
    return getNametable(i, j);
  }

  screenToElevation(x, y) {
    const { x: posx, y: posy } = this.screenToWorld({ x, y });
    return elevation(posx, posy);
  }

}