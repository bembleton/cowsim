/** SWORD BLADES */
// 0: broken
// 1: short
// 2: broad
// 3: serated
// 4: magical

/** HILTS */
// 0: gladius
// 1: fighter
// 2: master
// 3: 


const sword = {
  hilts: [
    {
      attack: 1,
      speed: 0
    },
    {
      attack: 1
    }
  ]
};

export const weapon_projectile = [
  'none',   // 0
  'beam',   // 1
  'flame',  // 2
  'magic'   // 3
];

class Weapon {
  sprites = []; // [hilt, point]
  name = '';
  attack = 1;
  speed = 1;
  type = 0;
  palette = 0;
}

/** Sprites are defined in items.bmp */

export const weapons = [
  {
    sprite: 0x00,
    name: 'Sword',
    palette: 0,
    rarity: 200,
    type: 1
  },
  {
    sprite: 0x20,
    name: 'Deku Stick',
    palette: 0,
    rarity: 50,
    type: 0
  },
  {
    sprite: 0x22,
    name: 'Torch',
    palette: 1,
    rarity: 50,
    type: 2
  },
  {
    sprite: 0x22,
    name: 'Blue Torch',
    palette: 2,
    rarity: 10,
    type: 2
  },
  {
    sprite: 0x24,
    name: 'Wood Axe',
    palette: 0,
    rarity: 40,
    type: 0
  },
  {
    sprite: 0x24,
    name: 'Carpenter Axe',
    palette: 1,
    rarity: 60,
    type: 0
  },
  {
    sprite: 0x26,
    name: 'Axe',
    palette: 1,
    rarity: 80,
    type: 0
  },
  {
    sprite: 0x26,
    name: "Fighter's Axe",
    palette: 2,
    rarity: 40,
    type: 0
  },
  {
    sprite: 0x28,
    name: 'Double Axe',
    palette: 1,
    rarity: 30,
    type: 0
  },
  {
    sprite: 0x28,
    name: 'Battle Axe',
    palette: 2,
    rarity: 10,
    type: 0
  },
  {
    sprite: 0x2a,
    name: 'Mallet',
    palette: 1,
    rarity: 40,
    type: 0
  },
  {
    sprite: 0x2a,
    name: 'Hammer',
    palette: 2,
    rarity: 30,
    type: 0
  },
  {
    sprite: 0x2e,
    name: 'Quarter Staff',
    palette: 0,
    rarity: 30,
    type: 0
  },
  {
    sprite: 0x2c,
    name: 'Flame Staff',
    palette: 1,
    rarity: 10,
    type: 2
  },
  {
    sprite: 0x2e,
    name: 'Forest Wand',
    palette: 0,
    rarity: 15,
    type: 3
  },
  {
    sprite: 0x2e,
    name: 'Ice Wand',
    palette: 2,
    rarity: 5,
    type: 3,
  },
];


/*
  00 000 000
         hilt
     point
  palette

  101
*/
export const consumables = [
  /*
  {
    sprite: 0x00,
    palette: 0,
    hearts: 0,  quarter hearts
    stamina: 0, stamina ticks
    speed: true, 1.5x
    attack: true, 2x
    armor: true, 1.5x
    name: 'Monarch Butterfly',
  },
  */
 /** Resources */
  {
    sprite: 0x70,
    palette: 1,
    name: 'Berry',
  },
  {
    sprite: 0x70,
    palette: 2,
    name: 'Blueberry',
  },
  {
    sprite: 0x71,
    palette: 0,
    name: 'Strawberry',
  },
  {
    sprite: 0x72,
    palette: 0,
    name: 'Green Apple',
  },
  {
    sprite: 0x72,
    palette: 1,
    name: 'Apple',
  },
  {
    sprite: 0x73,
    palette: 2,
    name: 'Egg',
  },
  {
    sprite: 0x74,
    palette: 1,
    name: 'Butterfly',
  },
  {
    sprite: 0x74,
    palette: 2,
    name: 'Moth',
  },
  {
    sprite: 0x75,
    palette: 1,
    name: 'Hyrulian Herb',
  },
  {
    sprite: 0x76,
    palette: 2,
    name: 'Mirk Leaf',
  },
  {
    sprite: 0x77,
    palette: 1,
    name: 'Red Mushroom',
  },
  {
    sprite: 0x78,
    palette: 0,
    name: 'Brown Mushroom',
  },
  {
    sprite: 0x79,
    palette: 2,
    name: 'White Mushroom',
  },
  {
    sprite: 0x7a,
    palette: 1,
    name: 'Meat',
  },
  {
    sprite: 0x7b,
    palette: 1,
    name: 'Yellow Perch',
  },
  {
    sprite: 0x7b,
    palette: 2,
    name: 'Bluegill',
  },
  {
    sprite: 0x7c,
    palette: 1,
    name: 'Redfish',
  },
  {
    sprite: 0x7c,
    palette: 2,
    name: 'Bluefish',
  },
  {
    sprite: 0x7d,
    palette: 1,
    name: 'Trout',
  },
  {
    sprite: 0x7d,
    palette: 2,
    name: 'Blue Trout',
  },
  /** Prepared Meals */
  {
    sprite: 0x80,
    palette: 1,
    name: 'Cooked Meat',
  },
  {
    sprite: 0x81,
    palette: 1,
    name: 'Meat Kebab',
  },
  {
    sprite: 0x82,
    palette: 1,
    name: 'Sticky Rice',
  },
  {
    sprite: 0x83,
    palette: 1,
    name: 'Mushroom Kabob',
  },
  {
    sprite: 0x84,
    palette: 1,
    name: 'Roasted Apple',
  },
  {
    sprite: 0x85,
    palette: 0,
    name: 'Taco',
  },
  {
    sprite: 0x86,
    palette: 0,
    name: 'Hamburger',
  },
  /** plates */
  {
    sprite: 0x87,
    palette: 1,
    name: 'Cooked Fruit',
  },
  {
    sprite: 0x88,
    palette: 1,
    name: 'Blackened Fish',
  },
  {
    sprite: 0x89,
    palette: 1,
    name: 'Steamed Fish',
  },
  {
    sprite: 0x8a,
    palette: 1,
    name: 'Steamed Meat',
  },
  {
    sprite: 0x8b,
    palette: 0,
    name: 'Greens and Berries',
  },
  {
    sprite: 0x8c,
    palette: 1,
    name: 'Fried Eggs',
  },
  {
    sprite: 0x8d,
    palette: 1,
    name: 'Ham and Eggs',
  },
  {
    sprite: 0x8e,
    palette: 1,
    name: 'Bacon and Eggs',
  },
  {
    sprite: 0x8f,
    palette: 1,
    name: 'Steak',
  },
  {
    sprite: 0x90,
    palette: 1,
    name: 'Noodles',
  },
  {
    sprite: 0x91,
    palette: 1,
    name: 'Sushi',
  },
  {
    sprite: 0x92,
    palette: 0,
    name: 'Mushroom Salad',
  },
  {
    sprite: 0x93,
    palette: 0,
    name: 'Stuffed Mushrooms',
  },
  {
    sprite: 0x94,
    palette: 0,
    name: 'Mushroom Soup',
  },
  {
    sprite: 0x94,
    palette: 1,
    name: 'Rice Poridge',
  },
  {
    sprite: 0x95,
    palette: 0,
    name: 'Split Pea Soup',
  },
  {
    sprite: 0x95,
    palette: 1,
    name: 'Tomato Soup',
  },
  
];

/*
0: green-gold-brown
1: red-gold-white
2: dblue-blue-white
3: dgreen-green-white
*/

/*
strength - attack goes up
health   - hearts go up
stamina
speed
armor
*/
