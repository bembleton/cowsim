import SimplexNoise from 'simplex-noise';
import ppu from '~/ppu';
import { randInt, Randy } from '~/random';
import tiles from '../data/tiles';
import { drawTile, drawMetaTile, SubPixels } from '../utils';

const {
  setNametable,
  setBackgroundData
} = ppu;


/* terrain generation */
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


// the map seed is set when the page loads
const baseSeed = new Date().getTime();

// general game randomizer for enemies, drops, etc
export const randy = new Randy(baseSeed);

// gets a randy instance for a specific map area
// used to add deterministic terrain variations
let area_randomizer = null;
const getAreaRandomizer = (posx, posy) => {
  const mapBlocksWidth = 192;
  const seed = baseSeed + posx + posy*mapBlocksWidth;
  const r = new Randy(seed);
  // throw away the first 5 values
  for (let i=0; i<5; i++) r.next();
  return r;
}

/*
0: water
1: grass1
2: grass2
3: grass3
4: sand
5: rock
*/
export const elevation = (x, y) => {
  // taper map edges to 0 to create a continent
  //0,0 - 192,96 ?
  const mapWidth = 192; //12*16
  const mapHeight = 128; //8*16
  let n = noise(x, y);
  const oceanSize = 16;
  const dx = Math.max(0, mapWidth/2 - Math.abs(mapWidth/2 - x));
  const dy = Math.max(0, mapHeight/2 - Math.abs(mapHeight/2 - y));
  if (dx < oceanSize) n *= dx/oceanSize;
  if (dy < oceanSize) n *= dy/oceanSize;
  return Math.floor(n * 6);
};

// make this better
export const isWater = (e) => e === 0;
export const isSolid = (e) => e === 5;
export const isGrass = (e) => e > 0 && e < 4;


const area_elevations = [];
const setAreaElevation = (x, y, e) => {
  area_elevations[(y+1)*18 + (x+1)] = e;
}
const getAreaElevation = (x, y) => area_elevations[(y+1)*18 + (x+1)];

const drawWaterOrSand = (x, y, tilex, tiley, palette) => {
  const u = isGrass(getAreaElevation(x, y-1)) << 0;
  const r = isGrass(getAreaElevation(x+1, y)) << 0;
  const d = isGrass(getAreaElevation(x, y+1)) << 0;
  const l = isGrass(getAreaElevation(x-1, y)) << 0;

  x += tilex;
  y += tiley;

  if (palette === 1) {
    if (!u && !r && !d && !l) {
      if (area_randomizer.next() < 0.75) {
        drawMetaTile(x, y, [0x32, 0x32, 0x32, 0x32], 1);
      } else {
        drawTile(x, y, 0x55, 1);
      }
      // plant?
      if (area_randomizer.next() < 0.01) {
        const plant = area_randomizer.nextBool() ? 0xa1 : 0xa0;
        const X = (x<<1) + area_randomizer.nextBool();
        const Y = (y<<1) + area_randomizer.nextBool();
        setNametable(X, Y, plant);
      }
      return;
    }
  }
  const tl = 0x55 - l - (u*16);
  const tr = 0x56 + r - (u*16);
  const bl = 0x65 - l + (d*16);
  const br = 0x66 + r + (d*16);

  drawMetaTile(x, y, [tl,tr,bl,br], palette);
};

const drawGrass = (x, y, e) => {
  let tile = 0x40 + (e-1)*32;
  if (area_randomizer.next() < 0.1) {
    if (e === 1) {
      // blank grass
      drawMetaTile(x, y, [0x30, 0x30, 0x30, 0x30], 1);
      return;
    }
    // variation
    tile += 2;
  }
  drawTile(x, y, tile, 1);

  // plant?
  if (e !== 2 && area_randomizer.next() < 0.01) {
    const plant = area_randomizer.nextBool() ? 0xb1 : 0xb0;
    const X = (x<<1) + area_randomizer.nextBool();
    const Y = (y<<1) + area_randomizer.nextBool();
    setNametable(X, Y, plant);
  }
};

const drawRock = (x, y, tilex, tiley) => {
  // sand edges
  const u = (getAreaElevation(x, y-1) === 4) << 0;
  const r = (getAreaElevation(x+1, y) === 4) << 0;
  const d = (getAreaElevation(x, y+1) === 4) << 0;
  const l = (getAreaElevation(x-1, y) === 4) << 0;

  x += tilex;
  y += tiley;

  if (!u && !r && !d && !l) {
    drawTile(x, y, (y%2 ^ x%2) ? 0x84 : 0x88, 2);
    return;
  }
  const tl = 0x84 + (l*32) + (u*2);
  const tr = 0x85 + (r*32) + (u*2);
  const bl = 0x94 + (l*32) + (d*2);
  const br = 0x95 + (r*32) + (d*2);

  drawMetaTile(x, y, [tl,tr,bl,br], 2);
};

// draws map area posx, posy into nametable at namex, namey
export const drawArea = (posx, posy, tilex, tiley) => {
  area_randomizer = getAreaRandomizer(posx, posy);

  // fill elevation table +- one row and column
  for (let y=-1; y<13; y++)
  for (let x=-1; x<17; x++) {
    setAreaElevation(x, y, elevation(posx + x, posy + y));
  }
  // fill background (16x12 tiles worth)
  for (let y=0; y<12; y++) {
    for (let x=0; x<16; x++) {
      // 0 water
      // 1,2,3 grass
      // 4 sand
      // 5 rock
      const e = getAreaElevation(x, y);
      if (e === 0) drawWaterOrSand(x, y, tilex, tiley, 0);
      else if (e === 4) drawWaterOrSand(x, y, tilex, tiley, 1);
      else if (e === 5) drawRock(x, y, tilex, tiley);
      else drawGrass(x+tilex, y+tiley, e);

      //todo draw dungeons, items
    }
  }
}

/** draws the current terrain elevation to the hud minimap */
export const drawMinimap = () => {
  const start = 0x00c0 << 4;  // byte offset in the background tilesheet
  const width = 48;           // pixels
  const height = 32;          // pixels
  const scaleX = 192/width;
  const scaleY = 128/height;

  const paletteMap = [0, 1, 1, 1, 2, 3];

  let data = 0x00;
  for (let y=0; y<height; y++)
  for (let x=0; x<width; x++) {
    const [posx, posy] = [x*scaleX, y*scaleY];
    const elev = elevation(posx, posy);
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