import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";
import sprites from "./data/sprites";
import { Sprite } from "../../spriteManager";
import { Projectile } from "./Projectile";

export class Rock extends Projectile {
  constructor({ x, y, direction }) {
    const width = 8;
    const height = 8;
    const isFriendly = false;
    const palette = 0;
    const damage = 2;
    

    // use x,y as center
    x = x - width / 2;
    y = y - height / 2;

    const sprite = new Sprite({ x, y, index: sprites.rock, palette });

    super({ sprite, x, y, width, height, direction, isFriendly, damage });
    this.velocity = SubPixels.fromDirection(direction, 48);
  }
  update(game) {
    const { pos, velocity } = this;
    // update bounds and sprite position
    this.pos = pos.add(velocity);
    this.updateBounds();
    // screen clipping
    if (!bbox.GAMEAREA.contains(this.bbox)) {
      this.blip();
    }
  }
  parry() {
    this.isFriendly = true;
    this.velocity = this.velocity.mul(-1);
  }
  blip() {
    // todo: draw SPRITES.hit
    this.dispose();
  }
  onCollision(entity, game) {
    if (entity.takeDamage) {
      entity.takeDamage(this.damage, this.bbox.center(), game);
    }
    else if (this.isFriendly && entity.floating) {
      // collect coins, etc
      entity.onCollision(game.player, game);
    }
    this.dispose();
  }
}
