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
    const sword = getRandomSword();
    const { hilt, blade } = sword;
    sprite = blade * 2;
    sprite2 = hilt * 2 + 16;
    name = sword.name;
    palette = sword.palette;
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
    const { sprite, palette, duration = 240, height = 16, width = 8, mirrorx = false, mirrory = false, floating = true } = options;
    this.bbox = new bbox(x, y, width, 8);
    this.duration = duration;
    this.frame = 0;
    this.disposed = false;
    this.floating = floating;
    this.float_count = 0;

    if (sprite instanceof SpriteBase) {
      this.sprite = sprite;
    }
    else if (typeof sprite === 'number') {
      this.sprite = new MetaSprite({ x, y, palette });
      this.sprite.add(sprite, 0, 0);
      if (height === 16) {
        // 8x16
        this.sprite.add(sprite + 16, 0, 8);
      }
      if (width === 16) {
        // 16x8
        this.sprite.add(sprite + 1, 8, 0);
      }
      if (height === 16 && width === 16) {
        // 16x16
        this.sprite.add(sprite + 17, 8, 8);
      }
      if (mirrorx) {
        // 16x8, reflected left-right
        this.sprite.add(new Sprite({ index: sprite, flipX: true }), 8, 0);
      }
      if (mirrorx && height === 16) {
        // 16x16, reflected left-right
        this.sprite.add(new Sprite({ index: sprite + 16, flipX: true }), 8, 8);
      }
      if (mirrory) {
        // 8x16, reflected up-down
        this.sprite.add(new Sprite({ index: sprite, flipY: true }), 0, 8);
      }
      if (mirrory && height) {
        // 16x16, reflected up-down
        this.sprite.add(new Sprite({ index: sprite+1, flipY: true }), 8, 8);
      }
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

  draw(spriteManager) {
    this.sprite.draw(spriteManager);
  }

  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }

  onCollision(player) {
  }

  frameIndex (frame, frameDuration, frameCount = 2) {
    return Math.floor(frame / frameDuration) % frameCount;
  }
}