import ppu from './ppu';
import { rand, randInt } from './random';

const {
  HORIZONTAL,
  VERTICAL,
  setCommonBackground,
  setMirroring,
  setNametable,
  setAttribute,
  setBgPalette,
} = ppu;

function Terrain() {
  this.size = 32 + 1;
  this.max = this.size - 1;
  this.map = new Float32Array(this.size * this.size);
}

Terrain.prototype.get = function(x, y) {
  if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
  return this.map[x + this.size * y];
};

Terrain.prototype.set = function(x, y, val) {
  this.map[x + this.size * y] = val;
};

Terrain.prototype.generate = function(roughness) {
  var self = this;

  this.set(0, 0, self.max);
  this.set(this.max, 0, self.max / 2);
  this.set(this.max, this.max, 0);
  this.set(0, this.max, self.max / 2);

  divide(this.max);
  return this.map;

  function divide(size) {
    var x, y, half = size / 2;
    var scale = roughness * size;
    if (half < 1) return;

    for (y = half; y < self.max; y += size) {
      for (x = half; x < self.max; x += size) {
        square(x, y, half, Math.random() * scale * 2 - scale);
      }
    }
    for (y = 0; y <= self.max; y += half) {
      for (x = (y + half) % size; x <= self.max; x += size) {
        diamond(x, y, half, Math.random() * scale * 2 - scale);
      }
    }
    divide(size / 2);
  }

  function average(values) {
    var valid = values.filter(function(val) { return val !== -1; });
    var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
    return total / valid.length;
  }

  function square(x, y, size, offset) {
    var ave = average([
      self.get(x - size, y - size),   // upper left
      self.get(x + size, y - size),   // upper right
      self.get(x + size, y + size),   // lower right
      self.get(x - size, y + size)    // lower left
    ]);
    self.set(x, y, ave + offset);
  }

  function diamond(x, y, size, offset) {
    var ave = average([
      self.get(x, y - size),      // top
      self.get(x + size, y),      // right
      self.get(x, y + size),      // bottom
      self.get(x - size, y)       // left
    ]);
    self.set(x, y, ave + offset);
  }
};

const getWater = (up, down, left, right) => {
  const [u, d, l, r] = [up == 0, down == 0, left == 0, right == 0];
  if (u && d && l && r) {
    // check corners
    return 0x70 + randInt(3);
  }
  if (u && d && l && !r) return 0x65 + randInt(2) * 0x10;
  if (u && d && !l && r) return 0x66 + randInt(2) * 0x10;
  //if (u && d && !l && !r)
  if (u && !d && l && r) return 0x55 + randInt(2);
  if (u && !d && l && !r) return 0x54;
  if (u && !d && !l && r) return 0x53;
  //if (u && !d && !l && !r)
  if (!u && d && l && r) return 0x45 + randInt(2);
  if (!u && d && l && !r) return 0x44;
  if (!u && d && !l && r) return 0x43;
  //if (!u && d && !l && !r) return 0x43;
  //if (!u && !d && l && r)
};

const getRock = (up, down, left, right) => {
  const [u, d, l, r] = [up == 5, down == 5, left == 5, right == 5];
  if (u && d && l && r) {
    // check corners
    return 0x80 + randInt(2);
  }
  if (u && d && l && !r) return 0x6A + randInt(2) * 0x10;
  if (u && d && !l && r) return 0x69 + randInt(2) * 0x10;
  //if (u && d && !l && !r)
  if (u && !d && l && r) return 0x59 + randInt(2);
  if (u && !d && l && !r) return 0x58;
  if (u && !d && !l && r) return 0x57;
  //if (u && !d && !l && !r)
  if (!u && d && l && r) return 0x49 + randInt(2);
  if (!u && d && l && !r) return 0x48;
  if (!u && d && !l && r) return 0x47;
  //if (!u && d && !l && !r) return 0x43;
  //if (!u && !d && l && r)
};

const LIGHT_GREEN = 0x1a;
const DARK_GREEN = 0x0a;
const LIGHT_BLUE = 0x11;
const DARK_BLUE = 0x01;
const LIGHT_BROWN = 0x1B;
const DARK_BROWN = 0x08;
const LIGHT_GRAY = 0x10;
const DARK_GRAY = 0x00;

const load = () => {
  /**
   * 000 - water
   * 001 - tallgrass
   * 010 - grass
   * 011 - dirt
   * 100 - sand
   * 101 - rock
  */
  
  setMirroring(VERTICAL);
  setCommonBackground(LIGHT_GREEN);
  setBgPalette(0, LIGHT_GREEN, LIGHT_BROWN, LIGHT_BLUE, DARK_BLUE); // grass,dirt,water,water
  setBgPalette(1, LIGHT_GREEN, DARK_GREEN, LIGHT_BROWN, DARK_BROWN); // grass,grass,dirt,dirt
  setBgPalette(2, LIGHT_GREEN, DARK_GRAY, LIGHT_BROWN, LIGHT_GRAY); // grass,dirt,rock,rock
  // 33x33 square
  const terrain = new Terrain();
  const map = terrain.generate(0.7);
  // normalize map from 0 to 5
  const min = map.reduce((p,val) => Math.min(p,val));
  const max = map.reduce((p,val) => Math.max(p,val));
  const attributes = map.map(x => Math.floor(6 * (x-min) / (max - min)));
  
  // only take 32x15
  for (var y=0;y<15;y++)
  for (var x=0;x<32;x++) {
    const height = attributes[y * 33 + x];
    let palette;
    if (height == 0) palette = 0; // water
    else if (height < 5) palette = 1; // grass
    else palette = 2; // rock
    setAttribute(x, y, palette);
  }

  const getAttribute = (x,y) => {
    if (x < 0) x += 64;
    x %= 64;
    if (y < 0) y += 30;
    y %= 30;
    return attributes[(y>>1) * 33 + (x>>1)];
  }

  const getTile = (height, up, down, left, right, corner) => {
    if (height == 0) { // water
      return getWater(up, down, left, right);
    }
    else if (height < 5) { // grass
      return ((height + 3) << 4) + randInt(3);
    }
    else { // rock
      return getRock(up, down, left, right);
    }
  };
  
  // fill in tiles
  for (var y=0;y<30;y++)
  for (var x=0;x<64;x++) {
    const height = getAttribute(x,y);
    let palette;
    const isright = (x % 2);
    const isbottom = (y % 2);
    const up = isbottom ? height : getAttribute(x, y-1);
    const down = isbottom ? getAttribute(x, y+1) : height;
    const left = isright ? height : getAttribute(x-1, y);
    const right = isright ? getAttribute(x+1, y) : height;
    const corner = getAttribute(isright ? x+1 : x-1, isbottom ? y+1 : y-1);
    const tile = getTile(height, up, down, left, right, corner);
    setNametable(x, y, tile);
  }
};

export default { load };
