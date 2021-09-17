import { Drop } from "./drop";

export class weaponDrop extends Drop {
  constructor(x, y, weapon, metaSprite) {
    super(x, y, {
      sprite: metaSprite,
      duration: null,
      floating: false
    });
    this.weapon = weapon;
  }

  onCollision(player) {
    player.equipWeapon(this.weapon);
    this.dispose();
  }
}