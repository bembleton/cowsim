import SimplexNoise from 'simplex-noise';
import ppu from '~/ppu';
import { Randy } from '~/random';
import { drawTile, drawMetaTile } from './utils';
const {
  setNametable,
  setBackgroundData
} = ppu;


/** Terrain scaling
 *  
 * larger numbers make the map smoother, with less variation
 */
 const elevationScale = 64;
 const exp = 1.3;

/*
  The world is 16x16 screens
  Each game screen is 16x12 tiles
  Each pixel represents a 2x2, 16x16 tile block, displayed as the average elevation for the 4 tiles
  The full map image is 128 x 96 pixels, stored in a tile sheet, being 16x12, 8x8 pixel tiles
  In the full map, a screen is represented by 8x6 pixels (16x16 total screens)

  # = 16x16 tile
  
  ## ## ## ## ## ## ## ##
  ## ## ## ## ## ## ## ##
  -- -- -- -- -- -- -- --
  ## ## ## ## ## ## ## ##
  ## ## ## ## ## ## ## ##
  -- -- -- -- -- -- -- --
  ## ## ## ## ## ## ## ##
  ## ## ## ## ## ## ## ##
  -- -- -- -- -- -- -- --
  ## ## ## ## ## ## ## ##
  ## ## ## ## ## ## ## ##
  -- -- -- -- -- -- -- --
  ## ## ## ## ## ## ## ##
  ## ## ## ## ## ## ## ##
  -- -- -- -- -- -- -- --
  ## ## ## ## ## ## ## ##
  ## ## ## ## ## ## ## ##

*/

const screenWidth = 16;  // tiles
const screenHeight = 12; // tiles
const mapWidth = screenWidth * 16;  // 256 tiles
const mapHeight = screenHeight * 16; // 192 tiles // 49,152 total tiles

export const Biome = {
  water: 0,
  plains: 1,
  forest: 2,
  desert: 3,
  mountains: 4
};

const elevation2Biome = (e) => {
  switch (e) {
    case 0: return Biome.water;
    case 1:
    case 3: return Biome.plains;
    case 2:
    case 6: return Biome.forest;
    case 4: return Biome.desert;
    default: return Biome.mountains;
  }
};

class Area {
  /** Constructs a new area elevation cache for an area at posx, posy */
  constructor(posx, posy, seed, terrain) {
    // area based randomizer
    this.randomizer = new Randy(seed + posx + posy*mapWidth);
    const biomeCounts = [0,0,0,0,0];
    // elevation cache
    this.elevations = [];
    for (let y=-1; y<13; y++)
    for (let x=-1; x<17; x++) {
      const elevation = terrain.elevation(posx + x, posy + y);
      this.elevations[(y+1)*18 + (x+1)] = elevation;
      biomeCounts[elevation2Biome(elevation)] += 1;
    }
    this.biomeStats = biomeCounts;
    let max = 0;
    this.biome = 0;
    for (let i=0; i<5; i++) {
      // water is more important
      const count = i === 0 ? biomeCounts[i]*2 : biomeCounts[i];
      if (count > max) {
        this.biome = i;
        max = count;
      }
    }
    
    //console.debug(`biome: (${posx},${posy}): ${this.biome} from ${biomeCounts}`);
  }
  
  /** Gets the elevation for the x,y position of the Area */
  elevation(x, y) {
    return this.elevations[(y+1)*18 + (x+1)];
  }
  
  /** Draws the area into the nametable at tilex, tiley */
  draw(tilex, tiley) {
    // fill background (16x12 tiles worth)
    for (let y=0; y<12; y++) {
      for (let x=0; x<16; x++) {
        // 0 water
        // 1,2,3 grass
        // 4 sand
        // 5 rock
        const e = this.elevation(x, y);
        if (e === 0) {
          this.drawWaterOrSand(x, y, tilex, tiley, 0); // water
        } else if (e === 4) {
          this.drawWaterOrSand(x, y, tilex, tiley, 1); // sand
        } else if (e === 5) {
          this.drawRock(x, y, tilex, tiley);
        } else if (e === 6) {
          drawTile(x + tilex, y + tiley, 0xa8, 1); // tree
        } else {
          this.drawGrass(x+tilex, y+tiley, e);
        }

        // TODO:  Background tiles for
        // caves
        // dungeons
        // buildings and features
        // trees
      }
    }
  }
  
  drawWaterOrSand(x, y, tilex, tiley, palette) {
    const { randomizer } = this;

    // get surrounding elevations to determine tile edging
    const u = Terrain.isGrass(this.elevation(x, y-1)) << 0;
    const r = Terrain.isGrass(this.elevation(x+1, y)) << 0;
    const d = Terrain.isGrass(this.elevation(x, y+1)) << 0;
    const l = Terrain.isGrass(this.elevation(x-1, y)) << 0;
  
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
        if (randomizer.next() < 0.75) {
          drawMetaTile(x, y, [0x48, 0x48, 0x48, 0x48], 1);
        } else {
          drawTile(x, y, 0x55, 1);
        }
        // plant?
        if (randomizer.next() < 0.01) {
          const plant = randomizer.nextBool() ? 0xa1 : 0xa0;
          const X = (x<<1) + randomizer.nextBool();
          const Y = (y<<1) + randomizer.nextBool();
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
  }

  drawGrass(x, y, e) {
    const { randomizer } = this;
    let tile = 0x40 + (e-1)*32;
    if (randomizer.next() < 0.1) {
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
    if (e !== 2 && randomizer.next() < 0.01) {
      const plant = randomizer.nextBool() ? 0xb1 : 0xb0;
      const X = (x<<1) + randomizer.nextBool();
      const Y = (y<<1) + randomizer.nextBool();
      setNametable(X, Y, plant);
    }
  }

  drawRock(x, y, tilex, tiley) {
    // sand edges
    const u = (this.elevation(x, y-1) === 4) << 0;
    const r = (this.elevation(x+1, y) === 4) << 0;
    const d = (this.elevation(x, y+1) === 4) << 0;
    const l = (this.elevation(x-1, y) === 4) << 0;
  
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
  }
}

const oceanFilter = (x, y) => {
  const nx = x/256;
  const ny = y/192;
  return (1 - Math.pow(2*nx-1, 4)) * (1 - Math.pow(2*ny-1, 4));
};

export class Terrain {
  constructor(seed) {
    this.baseSeed = seed;
    this.randomizer = new Randy(seed + 0x2DE5E5);
    this.simplex = new SimplexNoise(() => this.randomizer.next());
    this.biomes = this.computeBiomes(); // 16x16 array indexed by area id

    // gets a randy instance for a specific map area
    // used to add deterministic terrain variations
    //this.area_randomizer = null;
  }

  noise2d(x, y) {
    // x and y should be from 0 to +1 (to prevent tiling)
    // noise2D return values -1 to +1
    // normalize to 0 to +1
    return (this.simplex.noise2D(x, y) + 1) / 2;
  }

  noise (x, y) {
    // nx = x/64
    const nx = x / elevationScale;
    const ny =  y / elevationScale;
    const val = (
      1.0 * this.noise2d(nx, ny)
      + 0.5 * this.noise2d(2 * nx, 2 * ny)
      + 0.20 * this.noise2d(4 * nx, 4 * ny)
    ) * oceanFilter(x, y) / 1.7;
    const r = Math.pow(val, exp);
    return Math.floor(Math.min(5, r * 8))
  }

  /*
  0: water
  1: grass1
  2: grass2
  3: grass3
  4: sand
  5: rock
  */
  elevation(x, y) {
    // taper map edges to 0 to create a continent
    //0,0 - 256,192 ?
    //const mapWidth = 256; //16*16
    //const mapHeight = 192; //12*16
    let n = this.noise(x, y);
    if (n === 2) {
      if (this.randomizer.valueFor(x, y) < 0.15) {
        return 6; // tree
      }
    }
    return n;
  }

  computeBiomes() {
    // biome cache
    const biomes = [];

    for (let y=0; y<16; y++)
    for (let x=0; x<16; x++) {
      const id = x + 16*y;
      const area = new Area(x*16, y*12, this.baseSeed, this);
      biomes[id] = area.biome;
    }

    return biomes;
  }

  // make this better
  static isWater = (e) => e === 0; //differentiate ocean and lakes?
  static isDesert = (e) => e === 4;
  static isSolid = (e) => e >= 5; // rocks, trees
  static isGrass = (e) => e > 0 && e < 4;
  static isPassable = (e) => e > 0 && e < 5;

  getAreaTopLeft(x, y) {
    return {
      x: x - (x % screenWidth),
      y: y - (y % screenHeight)
    }
  }

  // draws map area with top-left terrain position (posx,posy) into nametable at (namex,namey)
  drawArea(posx, posy, tilex, tiley) {
    // todo: cache area
    const area = new Area(posx, posy, this.baseSeed, this);
    area.draw(tilex, tiley);
  }

  /** Calculates the  biome for a given position */
  getBiome(posx, posy) {
    // todo: cache area
    const area = new Area(posx, posy, this.baseSeed, this);
    return area.biome;
  }

  /** draws the current terrain elevation to the hud minimap */
  drawMinimap(centerX, centerY, scale) {
    const start = 0x00c0 << 4;  // byte offset in the background tilesheet, tile xC0, 16 bytes per tile, sort of
    const width = 32            // minimap pixels
    const height = 32           // minimap pixels
    const minimapWidth = mapWidth / scale / (256/192);   // world tiles. (192 tiles / scale 2) = 96
    const minimapHeight = mapHeight / scale; // world tiles. (128 tiles / scale 2) = 64

    const paletteMap = [0, 1, 1, 1, 2, 3, 1];
    const [offsetX, offsetY] = [(centerX - minimapWidth/2), (centerY - minimapHeight/2)];
    const viewToWorld = (x,y) => [offsetX + (x/width) * minimapWidth, offsetY + (y/height) * minimapHeight];

    let data = 0x00;
    for (let y=0; y<height; y++)
    for (let x=0; x<width; x++) {
      const [posx, posy] = viewToWorld(x, y);
      const elev = this.elevation(posx, posy);
      const e = Math.floor(elev);

      const color = (e == 2 
        ? (x+y*width)%5 == 0 ? paletteMap[5] : paletteMap[2]
        : paletteMap[e])  & 0xff;

      data = (data << 2 | color) & 0xff; 
      if (x % 4 === 3) {
        const adr = start + (y*32) + (x >> 2);
        // write to the background tile sheet
        setBackgroundData(adr, data);
      }
    }
  }

  /** deprecated */
  randomPosition() {
    var rand = new Randy();
    return {
      x: rand.nextInt(mapWidth),
      y: rand.nextInt(mapHeight)
    }
  }

  drawMapImage(canvasCtx) {
    const buffer = new ImageData(128, 96);
    const pixels = buffer.data;

    const BYTES_PER_PIXEL = 4;
    const BYTES_PER_ROW = BYTES_PER_PIXEL * 128;

    for (let y=0; y<96; y++)
    for (let x=0; x<128; x++) {
      const idx = (BYTES_PER_ROW * y) + (x * BYTES_PER_PIXEL);
      let e = this.elevation(x*2, y*2);
      if (e === 6) e = 2; // trees are really at elevation 2
      const color = e == 2 
        ? idx%5 == 0 ? 0x666666 : 0x005200
        : map_colors[e];
      
      const r = 0xff & (color>>16);
      const g = 0xff & (color>>8);
      const b = 0xff & (color);
      pixels.set([r, g, b, 0xFF], idx);
    }
    canvasCtx.putImageData(buffer, 0, 0);
  }
}

const map_colors = [
  0x155FD9, // water
  0x005200, // grass
  0x005200,
  0x005200,
  0xFECCC5, // sand
  0x666666  // rock
];