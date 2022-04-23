import { rand } from "../../random";
import { BasicEnemy } from "./basicEnemy";
import SPRITES from './data/sprites';
import { Direction } from "./direction";
import { Rock } from "./rock";

export class Octorok extends BasicEnemy {
  constructor(x, y, { dir = Direction.down, palette = 1 }) {
    const spriteData = SPRITES.enemies.octorok;
    // const { sprite: sprite0 } = Enemy.getSpriteFromState(spriteData, dir, 0);
    // const sprite = new MetaSprite({ sprite: sprite0, width: 2, height: 2 });
    const health = palette; // red=1, blue=2, black=3
    const damage = 2 * health; // quarter hearts
    const dropGroup = ['A', 'B'][palette - 1]; // red, blue
    const speed = rand() < 0.2 ? 12 : 8; // sometime fast?

    super(x, y, dir, spriteData, palette, health, damage, speed, dropGroup);
  }

  // abstract
  getProjectile() {
    const { x, y } = this.pos.toPixels();
    return new Rock({
      x: x + 8,
      y: y + 8,
      direction: this.dir
    });
  }
}
