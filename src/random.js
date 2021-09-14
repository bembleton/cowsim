

/**
 * Math for Game Programmers: Noise-Based RNG
 * Squirrel Eiserloh
 */
const BIT_NOISE1 = 0xB5297A4D;
const BIT_NOISE2 = 0x68E31DA4;
const BIT_NOISE3 = 0x1B56C4E9;
const PRIME1 = 198491317;

// 1D noise (hash) function
export const Squirrel3 = (position, seed) => {
  let mangled = position;
  mangled *= BIT_NOISE1;
  mangled += seed;
  mangled = (mangled ^ (mangled >>> 8)) >>> 0;
  mangled += BIT_NOISE2;
  mangled = (mangled ^ (mangled << 8)) >>> 0;
  mangled *= BIT_NOISE3;
  mangled ^= (mangled >>> 8);
  return mangled >>> 0;
};

export const SquirrelNoise2D = (x, y, seed) => {
  return Squirrel3(x + y*PRIME1, seed);
};

export class Randy {
  constructor (seed = Date.now()) {
    this.reset(seed);
  }

  reset(seed) {
    if (seed !== undefined) this.seed = seed;
    this.position = 0;
  }

  /** Random float between 0 and 1 */
  next() {
    return this.nextInt() / 0xffffffff;
  }

  /** Random boolean */
  nextBool() {
    return (this.nextInt() & 1) === 1;
  }

  /** Random integer */
  nextInt(max) {
    const n = Squirrel3(this.position++, this.seed);
    return max !== undefined ? (n % max) : n;
  }

  valueFor(x, y) {
    return Squirrel3(x + y*1010747, this.seed) / 0xffffffff;
  }
}

/** Non-seeded random functions */
const _randy = new Randy();
export const rand = () => _randy.next();
export const randInt = (maxOrMin, max) => {
  if (max !== undefined) {
    return (_randy.nextInt() - maxOrMin) % max;
  }
  return _randy.nextInt() % maxOrMin;
}
export const randBool = () => _randy.nextBool();
export const choice = (...choices) => {
  if (choices.length === 1 && Array.isArray(choices[0])) choices = choices[0];
  const i = _randy.nextInt(choices.length);
  return choices[i];
}
/*******/

export const accumulateChance = (arry) => {
  const count = arry.reduce((a,x) => a + x.rarity, 0);
  let a = 0;
  for (const x of arry) {
    const chance = x.rarity/count;
    a += chance;
    x.chance = a;
  }
}

export const getRareItem = (arry, chance = undefined) => {
  chance = chance !== undefined ? chance : rand();
  // arry is sorted by chance asc
  // find the first item that has a cumulative rarity higher than the random chance
  return arry.find(x => x.chance >= chance);
}
