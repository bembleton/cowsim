import {
  SPRITE_FLIP_X,
  SPRITE_FLIP_Y,
  SPRITE_PRIORITY,
  SPRITE_PALETTE,
  SPRITE_IN_USE,
  getAttributeByte
} from './spriteAttributes';
import ppu from './ppu';
import { copyBitmap } from './bitmapLoader';

// 64 sprites, 4 bytes each
/*
    0: index
    1: screen x
    2: screen y
    3: attributes
        7:  flip x
        6:  flip y
        5:  priority
        4:  in use
        01: palette
*/

class SpriteManager {
  constructor() {
    this.sprites = new Uint8Array(64 * 4);
    this.clearSprites();
  }

  /**
   * Returns an index to an available sprite.
   */
  requestSprite() {
    for (var i = 0; i < 64; i++) {
      const attrs = this.sprites[i * 4 + 3];
      const inUse = (attrs & SPRITE_IN_USE) > 0;
      if (inUse) continue;
      this.sprites[i * 4 + 3] |= SPRITE_IN_USE;
      this.sprites[i * 4 + 2] = 0xff & 240;
      return i;
    }
  }

  /**
   * Releases 
   */
  freeSprite(idx) {
    this.sprites[idx * 4 + 3] &= ~SPRITE_IN_USE;
    this.sprites[idx * 4 + 2] = 0xff & 140;
  }

  draw(display) {
    for (var i = 63; i >= 0; i--) {
      const attrs = this.sprites[i * 4 + 3];
      const inUse = (attrs & SPRITE_IN_USE) > 0;
      const y = this.sprites[i * 4 + 2];
      if (!inUse || y > 240) continue;
      const x = this.sprites[i * 4 + 1];
      const index = this.sprites[i * 4 + 0];

      const flipX = (attrs & SPRITE_FLIP_X) > 0;
      const flipY = (attrs & SPRITE_FLIP_Y) > 0;
      const priority = (attrs & SPRITE_PRIORITY) > 0;
      const palette = attrs & SPRITE_PALETTE;

      this.drawSprite(display, index, x, y, flipX, flipY, priority, palette);
    }
  };

  drawSprite(display, index, x, y, flipX, flipY, priority, palette) {

    for (var pi = 0; pi < 8; pi++) {
      const px = flipX ? 7 - pi : pi;
      const dx = x + pi;
      if (dx < 0 || dx >= 256) continue;

      for (var pj = 0; pj < 8; pj++) {
        const py = flipY ? 7 - pj : pj;
        const dy = y + pj;
        if (dy < 0 || dy >= 240) continue;

        if (priority) {
          const bg = ppu.getPixel(dx, dy);
          if (bg !== ppu.getCommonBackground) continue;
        }

        // check sprite table for pixel value
        const color = ppu.getSpritePixel(index, px, py);
        if (color > 0) {
          const displayColor = ppu.getSpriteColor(palette, color);
          display.setPixel(dx, dy, displayColor);
        }
      }
    }
  }

  setSprite(i, index, x, y, flipX, flipY, priority, palette) {
    this.sprites[i * 4 + 0] = 0xff & index;
    this.sprites[i * 4 + 1] = 0xff & x;
    this.sprites[i * 4 + 2] = 0xff & y;
    this.sprites[i * 4 + 3] = getAttributeByte(flipX, flipY, priority, true, palette);
  };

  updateSprite(i, options) {
    const attrs = this.sprites[i * 4 + 3];
    const {
      index = this.sprites[i * 4 + 0],
      x = this.sprites[i * 4 + 1],
      y = this.sprites[i * 4 + 2],
      flipX = (attrs & SPRITE_FLIP_X) > 0,
      flipY = (attrs & SPRITE_FLIP_Y) > 0,
      priority = (attrs & SPRITE_PRIORITY) > 0,
      palette = attrs & SPRITE_PALETTE
    } = options;

    this.setSprite(i, index, x, y, flipX, flipY, priority, palette);
  }

  clearSprite(i) {
    this.sprites[i * 4 + 0] = 0x00;
    this.sprites[i * 4 + 1] = 0x00;
    this.sprites[i * 4 + 2] = 0x00;
    this.sprites[i * 4 + 3] = 0x00;
  };

  clearSprites() {
    for (var i = 0; i < 64; i++) {
      this.clearSprite(i);
    }
  };

  /** Copies a sprite from an extended bitmap buffer into the ppu sprite table at the selected index */
  loadExtendedSprite(source, srcIndex, targetIndex) {
    const sOffset = (srcIndex >> 4) * 128 + (srcIndex & 0x0f) << 1;
    const tOffset = (targetIndex >> 4) * 128 + (targetIndex & 0x0f) << 1;
    for (let i=0; i<8; i++) {
      const sIdx = sOffset + (i << 5);
      const tIdx = tOffset + (i << 5);
      ppu.setSpriteData(tIdx, source[sIdx]);
      ppu.setSpriteData(tIdx+1, source[sIdx+1]);
    }
  }
}

const spriteManager = new SpriteManager();

export default spriteManager;

/** Base class for MetaSprite and Sprite */
export class SpriteBase {}
export class Sprite extends SpriteBase {
  constructor(options) {
    super();
    this.index = undefined;
    this.data = {
      index: 0x00,
      palette: 0,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      priority: false
    };
    this.update(options);
  }

  draw() {
    if (this.index !== undefined) return;
    this.index = spriteManager.requestSprite();
    this.rendered = true;
    this.update();
  }

  update(options) {
    const { data } = this;
    const opts = removeUndefinedProps(options || {});
    Object.assign(data, opts);

    if (this.index) {
      spriteManager.updateSprite(this.index, data);
    }
  }

  dispose() {
    if (this.index) {
      spriteManager.clearSprite(this.index);
      this.rendered = false;
      this.index = undefined;
    }
  }
}
 
const removeUndefinedProps = (obj) => {
  return Object.entries(obj).reduce((a,[k,v]) => {
    if (v !== undefined) a[k] = v;
    return a;
  }, {});
};

export class MetaSprite extends SpriteBase {
  constructor({ x = 0, y = 0, sprite, palette, flipX, flipY, priority, width = 1, height = 1, mirrorX = false, mirrorY = false } = {}) {
    super();
    this.rendered = false;
    this.sprites = [];
    Object.assign(this, { x, y, palette, flipX, flipY, priority });
    if (sprite) {
      for (let j=0; j<height; j++)
      for (let i=0; i<width; i++) {
        this.add(sprite + i + j*16, i*8, j*8);
      }
    }
    if (mirrorX) {
      // 16x8, reflected left-right
      this.add(new Sprite({ index: sprite, flipX: true }), 8, 0);
    }
    if (mirrorX && height === 2) {
      // 16x16, reflected left-right
      this.add(new Sprite({ index: sprite + 16, flipX: true }), 8, 8);
    }
    if (mirrorY) {
      // 8x16, reflected up-down
      this.add(new Sprite({ index: sprite, flipY: true }), 0, 8);
    }
    if (mirrorY && height) {
      // 16x16, reflected up-down
      this.add(new Sprite({ index: sprite + 1, flipY: true }), 8, 8);
    }
    if (mirrorX && mirrorY) {
      // 16x16, rflected in both directions
      this.add(new Sprite({ index: sprite, flipX: true, flipY: true }), 8, 8);
    }
  }

  add(sprite, x, y) {
    if (typeof sprite === 'number') {
      sprite = new Sprite({ index: sprite });
    }
    // override the sprite's position using offset from the meta sprite position
    sprite.offset = { x, y };
    sprite.update({
      x: this.x + x,
      y: this.y + y,
      palette: this.palette
    });
    this.sprites.push(sprite);
    return this;
  }

  update(options) {
    const { sprites } = this;

    const {
      x = this.x,
      y = this.y,
      sprite: index, // if sprite is set, set the first sprite and then update all other sprites, keeping the same offsets
      palette = this.palette,
      priority = this.priority,
      flipX = this.flipX,
      flipY = this.flipY
    } = options || {};
    
    Object.assign(this, { x, y, palette, flipX, flipY, priority });

    let l, r, t, b;
    if (flipX || flipY) {
      // get bounds
      const { left, right, top, bottom } = sprites.reduce((a,s) => {
        a.left = Math.min(a.left, s.offset.x);
        a.right = Math.max(a.right, s.offset.x + 8);
        a.top = Math.min(a.top, s.offset.y);
        a.bottom = Math.max(a.bottom, s.offset.y + 8);
        return a;
      }, { left: 256, right: 0, top: 256, bottom: 0 });
      l = left;
      r = right;
      t = top;
      b = bottom;
    }

    const idx_offset = (index !== undefined) 
      ? index - sprites[0].data.index 
      : 0;
    
    sprites.forEach(sprite => {
      const { data, offset } = sprite;
      sprite.update({
        x: flipX ? (x + l + r - offset.x - 8) : (x + offset.x),
        y: flipY ? (y + t + b - offset.y - 8) : (y + offset.y),
        index: data.index + idx_offset,
        palette,
        priority,
        flipX: flipX,
        flipY: flipY
      })
    });

    return this;
  }
  draw() {
    if (this.rendered) return;
    this.rendered = true;
    this.sprites.forEach(x => x.draw());
    return this;
  }
  dispose() {
    if (!this.rendered) return;
    this.sprites.forEach(x => x.dispose());
    this.rendered = false;
  }
}
