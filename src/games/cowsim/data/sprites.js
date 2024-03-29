const mirrorX = true;
const mirrorY = true;
const flipX = true;
const flipY = true;

export default {
  // link
  link_down: 0x00,
  link_up: 0x02,
  link_right: [0x04, 0x06],
  link_attack_right: 0x08,
  link_attack_down: 0x20,
  link_attack_up: 0x22,
  link_right_with_shield: [0x24, 0x25],
  link_get_item: 0x26,
  shield: 0x27,
  shield_attack_down: 0x28,
  shield_attack_up: 0x38,
  shield_right: 0x29,

  link: {
    down: 0x00,
    up: 0x02,
    right: [0x04, 0x06],
    attacking: {
      down: 0x20,
      up: 0x22,
      right: 0x08
    }
  },

  // item drops
  rupee_dark: 0x0a,
  rupee_light: 0x0b,
  bomb: 0x0c,
  key: 0x0d,
  heart: 0x0e,
  stamina_vial: 0x1e,
  heart_container: 0x0f,
  hourglass: 0x2a,
  fairy: [0x2b, 0x2c],
  bomb_small: 0x2d,
  rupee_small: 0x3d,
  potion_small: 0x2e, // move to seconday_item slot
  potion_large: 0x2f, // move to seconday_item slot
  chest_closed: 0x60, // move to seconday_item slot
  chest_open: 0x61, // move to seconday_item slot

  // effects
  //slash: 0x47, // 48, 57, 58
  smoke: [0x49, 0x4a, 0x4b],
  hit: 0x4c,
  mapIndicator: 0x5c,
  death_blink: [0x5d, 0x4d],
  sword_splash: 0x4e,
  magic_splash: 0x4f,
  white_square: 0x62,

  // slash offsets are from link top-left
  slash: {
    right: [
      { tiles: [{tile:0x67, x:8, y:16, flipX, flipY}] },
      { tiles: [{tile:0x57, x:16, y:10}, {tile:0x58, x:11, y:15}] },
      { tiles: [{tile:0x77, x:15, y:2}, {tile:0x78, x:16, y:10}] },
      { tiles: [{tile:0x58, x:11, y:15}]},
    ],
    up: [
      { tiles: [{tile:0x77, x:15, y:2}] },
      { tiles: [{tile:0x47, x:6, y:-8}, {tile:0x48, x:11, y:3}] },
      { tiles: [{tile:0x67, x:-2, y:-8}, {tile:0x68, x:6, y:-8}] },
      { tiles: [{tile:0x48, x:11, y:3}] },
    ],
    left: [
      { tiles: [{ tile:0x67, x:-2, y:-8 }] },
      { tiles: [{tile:0x57, x:-8, y:2, flipX, flipY}, {tile:0x58, x:-3, y:-3, flipX, flipY}] },
      { tiles: [{tile:0x77, x:-8, y:10,  flipX, flipY}, {tile:0x78, x:-8, y:2, flipX, flipY}] },
      { tiles: [{tile:0x58, x:-3, y:-3, flipX, flipY}] },
    ],
    down: [
      { tiles: [{ tile:0x77, x:-8, y:10 }] },
      { tiles: [{tile:0x47, x:0, y:16, flipX, flipY}, {tile:0x48, x:-5, y:11, flipX, flipY}] },
      { tiles: [{tile:0x67, x:8, y:16, flipX, flipY}, {tile:0x68, x:0, y:16, flipX, flipY}] },
      { tiles: [{tile:0x48, x:-5, y:11, flipX, flipY}] },
    ]
  },

  // weapons
  weapon: 0x40,
  sword: {
    up: { tile: 0x40, height: 2 },
    right: { 
      tiles: [{tile:0x51}, {tile:0x41, x:8}]
    }
  },
  boomerang: [0x42, 0x43, 0x52],
  banana_peel: 0x53,
  secondary_item: 0x44,
  //arrow: 0x45,
  arrow: {
    up: { tile: 0x45, height: 2 },
    right: { 
      tiles: [{tile:0x56}, {tile:0x46, x:8}]
    }
  },
  rock: 0x90,

  plants: [0x80, 0x81, 0x82, 0x83],
  moon: 0x90,
  circle: 0x94,
  bunny_sit: 0x91,
  bunny_stand: 0x92,
  bunny_jump: 0x93,

  /**
   * Enemy sprite data
   * 
   * All sprites are 16x16,
   * Missing direction data implies that the mirrored direction should be flipped,
   * Single-sprite directions imply they should be mirrored perpendicularly on alternating frames
   * Todo: allow 8x16 and 16x8 sprites that get mirrored, eg, octorok
   */
  enemies: {
    moblin: {
      down: 0xa0,
      up: 0xa2,
      right: [0xa4, 0xa6]
    },
    octorok: {
      down: [
        { tile:0xa8, height:2, mirrorX },
        { tile:0xa9, height:2, mirrorX },
      ],
      right: [
        { tile:0xaa, width:2, mirrorY },
        { tile:0xba, width:2, mirrorY },
      ]
    }
  },
};

/*
sprite data
{
  [dir]: tile | Array<tile> | Array<{sprite}> | {sprite}
}

sprite
{
  tile: int | tiles: Array<sprite>,
  height = 8,
  width = 8,
  mirrorX = false,
  mirrorY = false,
  offsetX = 0,
  offsetY = 0
}
*/