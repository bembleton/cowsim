import ppu from '~/ppu';
import text from '~/text';
import TILES from './data/tiles';

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
}

export const frameIndex = (frame, frameDuration, frameCount = 2) => {
  return Math.floor(frame / frameDuration) % frameCount;
}

/** Converts sprite pixel to tile coordinates */
export const pixelToTile = (px, py) => ({
  x: (px >> 4),
  y: (py >> 4)
});

//  8: 1 (0) = 1<<4 + 0.  8>>4 = 1
//  4: 0 (4) = 0<<4 + 4.  4>>4 = 0
// -4: 0 (-4) = 0<<4 + -4. -4>>4 = -1
// -9: -1


/*
0000: 0
0001: 1
0010: 2
0011: 3
0100: 4
0101: 5
0110: 6
0111: 7
1000: -8
1001: -7
1010: -6
1011: -5
1100: -4
1101: -3
1110: -2
1111: -1


*/