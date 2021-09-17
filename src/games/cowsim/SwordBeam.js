import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";
import { Direction } from "./direction";
import sprites from "./data/sprites";
import { MetaSprite, Sprite } from "../../spriteManager";
import { MeleeObject } from "./MeleeObject";

export class SwordBeam extends MeleeObject {
  constructor({ x, y, direction, damage }) {
    const horiz = Direction.isHorizontal(direction);
    const sprite1 = horiz ? sprites.weapon + 17 : sprites.weapon;
    const sprite2 = horiz ? sprites.weapon + 1 : sprites.weapon + 16;
    const flipX = direction === Direction.left;
    const flipY = direction === Direction.down;
    const width = horiz ? 16 : 8;
    const height = horiz ? 8 : 16;
    const palette = 0;

    const spritefn = horiz ? MetaSprite.Create16x8 : MetaSprite.Create8x16;
    const options = { palette, flipX, flipY, priority: false };
    const sprite = spritefn(x, y, sprite1, sprite2, options);

    super({ sprite, x, y, width, height, direction, isFriendly: true, damage });

    const speed = 48;
    this.velocity = new SubPixels.fromDirection(direction, speed);
    this.palette = palette;
    this.splashSprites = [];
  }

  update() {
    const { velocity, pos, palette } = this;

    if (!this.sprite.disposed) {
      this.pos = pos.add(velocity);
      this.updateBounds();
      this.sprite.update({ palette });

      // screen clipping
      if (!bbox.GAMEAREA.contains(this.bbox)) {
        this.explode();
      }
    } else {
      this.timer--;
      if (this.timer <= 0) {
        this.dispose();
        return;
      }

      // update splashes
      for (const sprite of this.splashSprites) {
        if (sprite.disposed)
          continue;
        const { x, y, flipX, flipY } = sprite.data;
        const dx = flipX ? 1 : -1;
        const dy = flipY ? 1 : -1;
        if (x + dx < 0 || x + dx > 248 || y + dy < 48 || y + dy > 232) {
          sprite.dispose();
        } else {
          sprite.update({ x: x + dx, y: y + dy, palette });
        }
      }
    }

    this.palette = (palette + 1) % 4;
  }

  explode() {
    if (this.sprite.disposed)
      return;
    const { splashSprites, palette } = this;
    this.sprite.dispose();
    this.bbox = new bbox(0, 0, 0, 0);
    this.timer = 16;
    const { x, y } = this.pos.toPixels();
    const index = sprites.sword_splash;
    splashSprites.push(new Sprite({ x, y, index, flipX: false, flipY: false, palette }));
    splashSprites.push(new Sprite({ x, y, index, flipX: true, flipY: false, palette }));
    splashSprites.push(new Sprite({ x, y, index, flipX: false, flipY: true, palette }));
    splashSprites.push(new Sprite({ x, y, index, flipX: true, flipY: true, palette }));
    for (const sprite of splashSprites) {
      sprite.draw();
    }
  }

  onCollision(entity, game) {
    if (entity.takeDamage) {
      entity.takeDamage(this.damage, this.bbox.center(), game);
      this.explode();
    }
  }

  dispose() {
    for (const sprite of this.splashSprites) {
      sprite.dispose();
    }
    this.splashSprites = [];
    this.timer = 0;
    super.dispose();
  }
}
