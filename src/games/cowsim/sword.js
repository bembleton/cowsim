import { accumulateChance, getRareItem } from "../../random";

const BROKEN = 0;
const SHORT = 1;
const BROAD = 2;
const SERATED = 3;
const MAGIC = 4;
/*

common
rare
magical
legendary

*/

/*
wooden - green
iron   - red
steel  - blue
magic  - blue
broken - broken
*/


// 3 qualities x 5 hilts x 5 blades = 75 variations
// max attack: 12 (blue, magic, magical)
// max speed:  9 (red, master, )
const attributes = {
  palette: {
    0: { attack: 0, speed: 0 },
    1: { attack: 1, speed: 2 },
    2: { attack: 3, speed: 1 }
  },
  hilt: {
    0: { attack: 0, speed: 0 },
    1: { attack: 1, speed: 1 },
    2: { attack: 3, speed: 0 },
    3: { attack: 2, speed: 3 },
    4: { attack: 4, speed: 2 },
  },
  blade: {
    0: { attack: 1, speed: 1 },
    1: { attack: 1, speed: 2 },
    2: { attack: 2, speed: 2 },
    3: { attack: 3, speed: 3 },
    4: { attack: 5, speed: 4 },
  }
};

const getAttrs = (palette, hilt, blade) => {
  const p = attributes.palette;
  const h = attributes.hilt;
  const b = attributes.blade;

  return {
    attack: p[palette].attack + h[hilt].attack + b[blade].attack,
    speed: p[palette].speed + h[hilt].speed + b[blade].speed,
  };
}

// 3 qualities for 5 hilt types. 15 variations
const hiltData = [
  {
    sprite: 0,
    rarity: 20,
    qualities: [75, 20, 5]
  },
  {
    sprite: 1,
    rarity: 40,
    qualities: [50, 30, 15]
  },
  {
    sprite: 2,
    rarity: 20,
    qualities: [10, 60, 30]
  },
  {
    sprite: 3,
    rarity: 10,
    qualities: [0, 50, 50]
  },
  {
    sprite: 4,
    rarity: 5,
    qualities: [0, 25, 75]
  },
];

// generate hilts of each color
const hilts = [];
hiltData.forEach(x => {
  const { sprite } = x;
  for (const palette in x.qualities) {
    hilts.push({
      sprite,
      palette,
      rarity: x.rarity * x.qualities[palette] / 100
    })
  }
})

const blades = [
  {
    sprite: 0,
    name: 'Broken Sword',
    rarity: 10,
  },
  {
    sprite: 1,
    name: 'Short Sword',
    rarity: 20
  },
  {
    sprite: 2,
    name: 'Broad Sword',
    rarity: 30,
  },
  {
    sprite: 3,
    name: 'Jagged Blade',
    rarity: 10,
  },
  {
    sprite: 4,
    name: 'Magical Sword',
    rarity: 5,
  },
]

const uniques = [
  {
    palette: 0,
    hilt: 0,
    blade: 2,
    name: 'Wooden Sword',
    attack: 1,
    speed: 1,
    rarity: 20,
  },
  {
    palette: 1,
    hilt: 0,
    blade: 1,
    name: 'Gladius',
    attack: getAttrs(1, 0, 1).attack + 1,
    speed: getAttrs(1, 0, 1).speed + 2,
    rarity: 20,
  },
  {
    palette: 1,
    hilt: 1,
    blade: 2,
    name: "Soldier's Sword",
    attack: getAttrs(1, 1, 2).attack + 2,
    speed: getAttrs(1, 1, 2).speed + 1,
    rarity: 20,
  },
  {
    palette: 2,
    hilt: 3,
    blade: 3,
    name: 'Gizagiza',
    attack: getAttrs(2, 3, 3).attack + 2,
    speed: getAttrs(2, 3, 3).speed + 2,
    rarity: 10,
  },
  {
    palette: 2,
    hilt: 4,
    blade: 4,
    name: 'Master Sword',
    attack: getAttrs(2, 4, 4).attack + 3,
    speed: getAttrs(2, 4, 4).speed + 3,
    rarity: 2,
  },
  {
    rarity: 200
  }
];


const build = (sword) => {
  const { hilt, blade, name, speed, attack, palette } = sword;
  const sprite = blade * 2;
  const sprite2 = hilt * 2 + 16;
  const sprites = [sprite, sprite2];
  return { name, speed, attack, sprites, palette };
};

export const woodenSword = build(uniques.find(x => x.name === 'Wooden Sword'));

accumulateChance(hilts);
accumulateChance(blades);
accumulateChance(uniques);

export function getRandomSword() {
  // check for a unique drop
  const unique = getRareItem(uniques);
  if (unique.name) return unique;

  // select a hilt
  const { sprite: hilt, palette } = getRareItem(hilts);

  // select a blade
  const { sprite: blade, name } = getRareItem(blades);
  const { attack, speed } = getAttrs(palette, hilt, blade);

  return build({ name, hilt, blade, palette, speed, attack });
}