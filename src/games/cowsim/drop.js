import { bbox } from "../../boundingBox";
import { accumulateChance, getRareItem } from "../../random";
import { MetaSprite, Sprite, SpriteBase } from "../../spriteManager";
import {
  weapons
} from "./data/items";
import { getRandomSword } from "./sword";

accumulateChance(weapons);

export function getRandomWeapon() {
  let { sprite, palette, name } = getRareItem(weapons);
  let sprite2 = sprite+16;

  if (name === 'Sword') {
    return getRandomSword();
  }

  return {
    name,
    sprites: [sprite, sprite2],
    palette,
    // attack,
    // speed,
    // type
  }
}

const float_table = [0,-1,-1,0,1,1];

export class Drop {

  constructor(x, y, options) {
    const { sprite, palette, duration = 240, height = 16, width = 8, mirrorX, mirrorY, floating = true } = options;
    
    const effectiveWidth = mirrorX ? width * 2 : width;
    this.bbox = new bbox(x, y, effectiveWidth, 8);
    this.duration = duration;
    this.frame = 0;
    this.disposed = false;
    this.floating = floating;
    this.float_count = 0;
    this.disposeOnCollision = true;

    if (sprite instanceof SpriteBase) {
      this.sprite = sprite;
    }
    else if (typeof sprite === 'number') {
      // height: 16, mirrorX: true
      this.sprite = new MetaSprite({
        x, y,
        sprite,
        palette,
        height: mirrorY ? 1 : height / 8,
        width: mirrorX ? 1 : width / 8,
        mirrorX,
        mirrorY
      });
    }
  }

  update(canMove = true) {
    this.frame = (this.frame+1) & 0xff;
    if (canMove && (this.frame & 0x01) === 0 && this.duration) {
      this.duration -= 1;
      if (this.duration <= 0) {
        this.dispose();
        return;
      }
    }

    if (canMove && this.floating && (this.frame % 4) === 0) {
      this.float_count = (this.float_count+1) % 6;
      const dy = float_table[this.float_count];
      const y = this.bbox.y;
      this.updateSprite({ y: y + dy });
    }
  }

  updateSprite(options) {
    const { x, y } = options;
    if (x !== undefined) this.bbox.x = x;
    if (y !== undefined) this.bbox.y = y;
    this.sprite.update(options);
  }

  draw() {
    this.sprite.draw();
  }

  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }

  onCollision(player, game) {
  }

  frameIndex (frame, frameDuration, frameCount = 2) {
    return Math.floor(frame / frameDuration) % frameCount;
  }
}