import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";
import sprites from "./data/sprites";
import { MetaSprite } from "../../spriteManager";
import { Projectile } from "./Projectile";
import { Direction } from "./direction";

export class ArrowObject extends Projectile {
  constructor({ x, y, isFriendly, damage, direction, palette = 0 }) {
    // const sprite = MetaSprite.fromData(sprites.arrow, direction);
    // const width = Direction.isHorizontal ? 16 : 8;
    // const height = Direction.isVertical ? 16 : 8;


    const horiz = Direction.isHorizontal(direction);
    const sprite1 = horiz ? sprites.arrow + 17 : sprites.arrow;
    const sprite2 = horiz ? sprites.arrow + 1 : sprites.arrow + 16;
    const flipX = direction === Direction.left;
    const flipY = direction === Direction.down;
    const width = horiz ? 16 : 8;
    const height = horiz ? 8 : 16;
    

    x = x-width/2;
    y = y-height/2;
    const spritefn = horiz ? MetaSprite.Create16x8 : MetaSprite.Create8x16;
    const options = { palette, flipX, flipY, priority: false };
    const sprite = spritefn(x, y, sprite1, sprite2, options);

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
