import ppu from '~/ppu';

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

export const fillWithBrush = (x, y, width, height, brush) => {
  const {
    palette,
    tiles
  } = brush;

  /**
   * tiles: [a,b,c,d]
   *   [a][b]
   *   [c][d]
   */
  
  const toy = y+height;
  const tox = x+width;

  // fill the tile indices
  for (let j=(y<<1); j<(toy<<1); j++)
  for (let i=(x<<1); i<(tox<<1); i++) {
    const dx = i%2;
    const dy = j%2;
    setNametable(i, j, tiles[(dy<<1) + dx]);
  }

  // fill the attribute table
  for (let j=y; j<toy; j++)
  for (let i=x; i<tox; i++) {
    setAttribute(i, j, palette);
  }
};