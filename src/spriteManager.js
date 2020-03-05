import {
  SPRITE_FLIP_X,
  SPRITE_FLIP_Y,
  SPRITE_PRIORITY,
  SPRITE_PALETTE,
  SPRITE_IN_USE,
  getAttributeByte
} from './spriteAttributes';
import ppu from './ppu';

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
      return i;
    }
  }

  /**
   * Releases 
   */
  freeSprite(index) {
    this.sprites[i * 4 + 3] &= ~SPRITE_IN_USE;
  }

  draw(display) {
    for (var i = 0; i < 64; i++) {
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
      for (var pj = 0; pj < 8; pj++) {
        const py = flipY ? 7 - pj : pj;

        if (priority) {
          const bg = ppu.getPixel(x + pi, y + pj);
          if (bg !== ppu.getCommonBackground) continue;
        }

        // check sprite table for pixel value
        const color = ppu.getSpritePixel(index, px, py);
        if (color > 0) {
          const displayColor = ppu.getSpriteColor(palette, color);
          display.setPixel(x + pi, y + pj, displayColor);
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
}

const spriteManager = new SpriteManager();

export default spriteManager;
