import ppu from '~/ppu';
import text from '~/text';
import TILES from './data/tiles';
import { Direction } from './direction';

const {
  HORIZONTAL,
  VERTICAL,
  setCommonBackground,
  setMirroring,
  setScroll,
  setNametable,
  setAttribute,
  setBgPalette,
  setSpritePalette,
} = ppu;

// /** returns tile ids for a 2x2 block of tiles */
// const twoByTwoTile = (idx) => [idx, idx+1, idx+16, idx+17];

// /** Table of tiles to fill a given block */
// const block_table = [
//   [0x40]
// ];

/** Fills the background with a tile in 2x2 blocks and palette */
/** x, y, width, and height are in units of blocks */
export const fillBlocks = (x, y, width, height, tile, palette) => {
  const toy = y+height;
  const tox = x+width;

  // fill the tile indices
  for (let j=(y<<1); j<(toy<<1); j++)
  for (let i=(x<<1); i<(tox<<1); i++) {
      setNametable(i, j, tile);
  }

  // fill the attribute table
  for (let j=y; j<toy; j++)
  for (let i=x; i<tox; i++) {
      setAttribute(i, j, palette);
  }
};

/**
 * metaTileSheet
 * 8x8
 * b00111111  0-63
 */

/**
 * Draws a 2x2 meta tile
 * @param {*} x attribute table position
 * @param {*} y attribute table position
 * @param {*} metaTile tile array of length 4
 * @param {*} palette palette index
 */
export const drawMetaTile = (x, y, metaTile, palette) => {
  const [X, Y] = [x<<1, y<<1];
  setNametable(X, Y, metaTile[0]);
  setNametable(X+1, Y, metaTile[1]);
  setNametable(X, Y+1, metaTile[2]);
  setNametable(X+1, Y+1, metaTile[3]);
  setAttribute(x, y, palette);
};

/**
 * Gets a meta tile with ab/cd tile indices
 * @param {*} tile 
 */
export const getBlock = (tile) => [tile, tile+1, tile+16, tile+17];

export const drawTile = (x, y, tile, palette) => {
  const block = getBlock(tile);
  drawMetaTile(x, y, block, palette);
};

export const fillWithMetaTiles = (x, y, width, height, metaTile, palette) => {
  for (let j=0; j<height; j++)
  for (let i=0; i<width; i++) {
    drawMetaTile(x+i, y+j, metaTile, palette);
  }
};

/**
 * 
 * @param {number} x tile column
 * @param {number} y tile row
 * @param {string} message 
 */
export const dialog = (x, y, message, palette) => {
  let lines = message.split('\n').map(l => l.trim());
  const width = lines.reduce((p,v) => Math.max(p,v.length), 0) + 2;
  const height = lines.length + 2;
  lines = lines.map(l => l.padEnd(width - 2, ' '));
  
  for (let i=0; i<width; i++) {
    if (i === 0) {
      setNametable(x+i, y, TILES.menu.topleft);           // top left corner
      setNametable(x+i, y+height-1, TILES.menu.bottomleft);  // bottom left corner
    } else if (i < width-1) {
      setNametable(x+i, y, TILES.menu.horizontal);           // top edges
      setNametable(x+i, y+height-1, TILES.menu.horizontal);  // bottom edges
    } else {
      setNametable(x+i, y, TILES.menu.topright);           // top right corner
      setNametable(x+i, y+height-1, TILES.menu.bottomright);  // bottom right corner
    }
  }

  for (let i=0; i<lines.length; i++) {
    setNametable(x, y+1+i, TILES.menu.vertical);
    text(x+1, y+1+i, lines[i]);
    setNametable(x+width-1, y+1+i, TILES.menu.vertical);
  }

  // fill the attribute table
  for (let j=y>>1; j<(y+height+1)>>1; j++)
  for (let i=x>>1; i<(x+width)>>1; i++) {
      setAttribute(i, j, palette);
  }
};

const getSubPixels = (...args) => {
  let x, y;
  if (args.length === 2) {
    [x, y] = args;
  } else if (args[0].length == 2) {
    [x, y] = args[0];
  } else {
    x = args[0].x;
    y = args[0].y;
  }
  return { x, y };
}

/** 16 subpixels per pixel */
export class SubPixels {
  /**
   * creates a new subpixel vector
   * @param {*} x 16 subpixels per pixel
   * @param {*} y 16 subpixels per pixel
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
  static fromPixels(x, y) {
    return new SubPixels(x<<4, y<<4);
  }

  static units_per_pixel = 16;
  
  /**
   * returns the current pixel value
   */
  toPixels() {
    return {
      x: this.x >> 4,
      y: this.y >> 4
    };
  }

  /**
   * adds a subpixel. 
   * @param  {...any} args can be x, y args, an array or an object
   */
  add(...args) {
    const { x, y } = getSubPixels(...args);
    return new SubPixels(this.x + x, this.y + y);
  }

  subtract(...args) {
    const { x, y } = getSubPixels(...args);
    return new SubPixels(this.x - x, this.y - y);
  }

  addPixels(x, y) {
    return new SubPixels(this.x + (x<<4), this.y + (y<<4));
  }

  setPixelX(x) {
    this.x = x<<4;
  }
  setPixelY(y) {
    this.y = y<<4;
  }

  mod(...args) {
    const { x, y } = getSubPixels(...args);
    return new SubPixels(this.x % x, this.y % y);
  }

  toDirection() {
    //if (this.x === 0 && this.y === 0) return undefined;
    if (Math.abs(this.x) >= Math.abs(this.y)) {
      return this.x < 0 ? Direction.left : Direction.right;
    } else {
      return this.y < 0 ? Direction.up : Direction.down;
    }
  }
}

export const frameIndex = (frame, frameDuration, frameCount = 2) => {
  return Math.floor(frame / frameDuration) % frameCount;
}

/** Converts sprite pixel to tile coordinates */
export const pixelToTile = (px, py) => ({
  x: (px >> 4),
  y: (py >> 4)
});

// filter2 modifies the original array but still returns a reference
// https://stackoverflow.com/questions/30304719/javascript-fastest-way-to-remove-object-from-array
Array.prototype.filter2 = function filter2 (predicate) {
  let i, j;

  for (i = 0, j = 0; i < this.length; ++i) {
      if (predicate(this[i])) {
          this[j] = this[i];
          ++j;
      }
  }

  while (j < this.length) {
      this.pop();
  }

  return this;
}

// 32 characters
const hashChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** 1 to 6 characters, uppercase alphanumeric, excluding 0, 1, I, and O */
export const stringToHash = (str) => {
  let hash = 0;
  for (let c=str.length-1; c>=0; c--) {
    hash = hash << 5;
    hash += hashChars.indexOf(str[c]); // 0-31
  }
  return hash;
}

export const hashToString = (hash) => {
  let str = "";
  hash &= 0x3fffffff; // 30 bits, 6x 5-bit characters.
  while (hash > 0) {
    str += hashChars[hash & 0x1f];
    hash = hash >>> 5;
  }
  return str.padStart(6, hashChars[0]);
}
