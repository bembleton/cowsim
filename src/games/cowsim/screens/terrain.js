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
let simplex; // = new SimplexNoise();

// the map seed is set when the page loads
let baseSeed; // = new Date().getTime();

// general game randomizer for enemies, drops, etc
export const randy = new Randy(0);

export const setSeed = function (seed) {
  baseSeed = seed;
  console.log(`Seed: ${seed}`);
  randy.reset(seed);
  // todo seed the noise function, too
  const randomFn = randy.next.bind(randy);
  simplex = new SimplexNoise(randomFn);
};

const noise2d = function (x, y) {
  // x and y should be from 0 to +1 (to prevent tiling)
  // noise2D return values -1 to +1
  // normalize to 0 to +1
  return (simplex.noise2D(x, y) + 1) / 2;
};

const exp = 1.0;

/** Terrain scaling
 *  
 * larger numbers make the map smoother, with less variation
 */
const elevationScale = 64;

/*
  The world is 16x16 screens
  Each game screen is 16x12 tiles
  Each pixel represents a 2x2, 16x16 tile block, displayed as the average elevation for the 4 tiles
  The full map is 128 x 96 pixels, stored in a tile sheet, being 16x12, 8x8 pixel tiles
  In the full map, a screen is represented by 8x6 pixels (16x16 total screens)
*/

const screenWidth = 16;  // tiles
const screenHeight = 12; // tiles
const mapWidth = screenWidth * 16;  // 256 tiles
const mapHeight = screenHeight * 16; // 192 tiles

const noise = (x, y) => {
  const nx = x / elevationScale;
  const ny =  y / elevationScale;
  const val = (
    1.0 * noise2d(nx, ny)
    + 0.5 * noise2d(2 * nx, 2 * ny)
  ) / 1.5;
  return Math.pow(val, exp);
};


// gets a randy instance for a specific map area
// used to add deterministic terrain variations
let area_randomizer = null;
const getAreaRandomizer = (posx, posy) => {
  const seed = baseSeed + posx + posy*mapWidth;
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
  //0,0 - 256,192 ?
  //const mapWidth = 256; //16*16
  //const mapHeight = 192; //12*16
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
export const isDesert = (e) => e === 4;
export const isSolid = (e) => e === 5;
export const isGrass = (e) => e > 0 && e < 4;

/** Returns a random position within the map bounds. It could be anywhere. */
export const randomPosition = () => ({
  x: randInt(mapWidth),
  y: randInt(mapHeight)
});

export const getAreaTopLeft = (x, y) => ({
  x: Math.floor(x / screenWidth) * screenWidth,
  y: Math.floor(y / screenHeight) * screenHeight
})

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

  // grass sand/water edges
  // const ul = isGrass(getAreaElevation(x-1, y-1)) << 7;
  // const uu = u << 6;
  // const ur = isGrass(getAreaElevation(x+1, y-1)) << 5;
  // const ll = l << 4;
  // const rr = r << 3;
  // const dl = isGrass(getAreaElevation(x-1, y+1)) << 2;
  // const dd = d << 1;
  // const dr = isGrass(getAreaElevation(x+1, y+1)) << 0;

  x += tilex;
  y += tiley;

  if (palette === 1) {
    // sand
    if (!u && !r && !d && !l) {
      // no edges
      if (area_randomizer.next() < 0.75) {
        drawMetaTile(x, y, [0x48, 0x48, 0x48, 0x48], 1);
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

  

  let tl,tr,bl,br;

  const state = 0; //ul|uu|ur|ll|rr|dl|dd|dr;
  switch (state) {
    // diagonals?
    /*
    case 0b01101000: //u&r // 104
      tl = 0x43;
      br = 0x43;
      tr = 0x41;
      bl = 0x32;
      break;
    case 0b00001011: //d&r // 11
      tl = 0x32;
      br = 0x51;
      tr = 0x53;
      bl = 0x53;
      break;
    case 0b00010110: //d&l // 22
      tl = 0x52;
      br = 0x52;
      tr = 0x32;
      bl = 0x50;
      break;
    case 0b11010000: //u&l / 208
      tl = 0x40;
      br = 0x32;
      tr = 0x42;
      bl = 0x42;
      break;
    */
    default:
      tl = 0x55 - l - (u*16);
      tr = 0x56 + r - (u*16);
      bl = 0x65 - l + (d*16);
      br = 0x66 + r + (d*16);
      break;
  }

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
      if (e === 0) drawWaterOrSand(x, y, tilex, tiley, 0); // water
      else if (e === 4) drawWaterOrSand(x, y, tilex, tiley, 1); // sand
      else if (e === 5) drawRock(x, y, tilex, tiley);
      else drawGrass(x+tilex, y+tiley, e);

      //todo draw dungeons
    }
  }
}

/** draws the current terrain elevation to the hud minimap */
export const drawMinimap = (centerX, centerY, scale) => {
  const start = 0x00c0 << 4;  // byte offset in the background tilesheet, tile xC0, 16 bytes per tile, sort of
  const width = 32            // minimap pixels
  const height = 32           // minimap pixels
  const minimapWidth = mapWidth / scale;   // world tiles. (192 tiles / scale 2) = 96
  const minimapHeight = mapHeight / scale; // world tiles. (128 tiles / scale 2) = 64

  const paletteMap = [0, 1, 1, 1, 2, 3];
  const [offsetX, offsetY] = [(centerX - minimapWidth/2), (centerY - minimapHeight/2)];
  const viewToWorld = (x,y) => [offsetX + (x/width) * minimapWidth, offsetY + (y/height) * minimapHeight];

  let data = 0x00;
  for (let y=0; y<height; y++)
  for (let x=0; x<width; x++) {
    const [posx, posy] = viewToWorld(x, y);
    const elev = elevation(posx, posy);
    const color = paletteMap[Math.floor(elev)] & 0xff;
    data = (data << 2 | color) & 0xff; 
    if (x % 4 === 3) {
      const adr = start + (y*32) + (x >> 2);
      setBackgroundData(adr, data);
    }
  }
};