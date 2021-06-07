export const rand = () => Math.random();
export const randInt = (maxOrMin, max) => {
  if (max !== undefined) {
    return Math.floor(Math.random() * (max - maxOrMin) + maxOrMin);
  }
  return Math.floor(Math.random() * maxOrMin);
}
export const randBool = () => Math.random() < 0.5;
export const choice = (...choices) => {
  if (choices.length === 1 && Array.isArray(choices[0])) choices = choices[0];
  const i = Math.floor(Math.random() * choices.length);
  return choices[i];
}

export class Randy {
  static C1  = BigInt(0x9E3779B97F4A7C15);  //saves generating BigInt constructor again and again.
  static C2  = BigInt(0xBF58476D1CE4E5B9);
  static C3  = BigInt(0x94D049BB133111EB);
  static FB1 = BigInt(30);                  //shifting
  static FB2 = BigInt(27);
  static FB3 = BigInt(31);

  constructor (seed) {
    this.reset(seed);
  }

  reset(seed) {
    this.x = BigInt(seed || new Date().getTime());
  }

  next() {
    return this.nextInt() / 0xffffffff;
  }

  nextBool() {
    return (this.nextInt() & 1) === 1;
  }

  nextInt(max) {
    var z;
    this.x += Randy.C1;
    
    z = this.x;
    z = z ^ (z >> Randy.FB1) * Randy.C2;
    z = z ^ (z >> Randy.FB2) * Randy.C3;
    z = z ^ (z >> Randy.FB3);
    const n = Number(BigInt.asUintN(32, z));
    return max !== undefined ? (n % max) : n;
  }
}

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