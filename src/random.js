export const rand = () => Math.random();
export const randInt = (maxOrMin, max) => {
  if (max !== undefined) {
    return Math.floor(Math.random() * (max - maxOrMin) + maxOrMin);
  }
  return Math.floor(Math.random() * maxOrMin);
}
export const randBool = () => Math.random() < 0.5;
export const choice = (choices) => {
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