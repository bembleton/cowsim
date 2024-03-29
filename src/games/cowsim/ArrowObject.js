import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";
import sprites from "./data/sprites";
import { MetaSprite } from "../../spriteManager";
import { Projectile } from "./Projectile";
import { Direction } from "./direction";

export class ArrowObject extends Projectile {
  constructor({ x, y, isFriendly, damage, direction, palette = 0 }) {
    const width = Direction.isHorizontal(direction) ? 16 : 8;
    const height = Direction.isVertical(direction) ? 16 : 8;
    
    // use x,y as center
    x = x-width/2;
    y = y-height/2;

    const sprite = MetaSprite.fromData(sprites.arrow, direction, { x, y, palette });

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
