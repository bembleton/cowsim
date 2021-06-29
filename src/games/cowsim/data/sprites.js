
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

  // efects
  slash: 0x47, // 48, 57, 58
  smoke: [0x49, 0x4a, 0x4b],
  hit: 0x4c,
  mapIndicator: 0x5c,
  death_blink: [0x5d, 0x4d],
  sword_splash: 0x4e,
  magic_splash: 0x4f,

  // weapons
  weapon: 0x40,
  boomerang: [0x42, 0x43, 0x52],
  banana_peel: 0x53,
  secondary_item: 0x44,
  arrow: 0x45,

  plants: [0x80, 0x81, 0x82, 0x83],
  moon: 0x90,
  circle: 0x94,
  bunny_sit: 0x91,
  bunny_stand: 0x92,
  bunny_jump: 0x93,

  enemies: {
    moblin: {
      down: 0xa0,
      up: 0xa2,
      right: [0xa4, 0xa6]
    },
    octorok: {
      down: [0xa8, 0xaa],
      right: [0xac, 0xae]
    }
  }
};
