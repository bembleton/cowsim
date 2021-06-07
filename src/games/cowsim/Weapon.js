import { Drop } from "./drop";

export class Weapon extends Drop {
  constructor(x, y, weapon, metaSprite) {
    super(x, y, {
      sprite: metaSprite,
      height: 16,
      duration: null
    });
    this.weapon = weapon;
  }

  onCollision(player) {
    player.equipWeapon(this.weapon);
  }
}