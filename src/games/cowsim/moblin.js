import { ArrowObject } from "./ArrowObject";
import { BasicEnemy } from "./basicEnemy";
import SPRITES from './data/sprites';
import { Direction } from "./direction";

export class Moblin extends BasicEnemy {
  constructor(x, y, { dir = Direction.down, palette = 1 }) {
    const spriteData = SPRITES.enemies.moblin;
    //const { sprite: sprite0 } = Enemy.getSpriteFromState(spriteData, dir, 0);
    //const sprite = new MetaSprite({ sprite: sprite0, width: 2, height: 2 });
    const health = palette; // red=1, blue=2, black=3
    const damage = 2 * health; // quarter hearts
    const dropGroup = ['A','C','B'][palette-1]; // red, blue, black
    const speed = 8;

    super(x, y, dir, spriteData, palette, health, damage, speed, dropGroup);
  }

  // abstract
  getProjectile() {
    const { x, y } = this.pos.toPixels();
    return new ArrowObject({
      x: x+8,
      y: y+8,
      isFriendly: false,
      damage: this.meleeDamage,
      direction: this.dir,
      palette: 1
    });
  }
}
