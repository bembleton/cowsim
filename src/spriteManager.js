import {
    SPRITE_FLIP_X,
    SPRITE_FLIP_Y,
    SPRITE_PRIORITY,
    SPRITE_PALETTE,
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
        10: palette
*/

class SpriteManager {
    constructor(display) {
        this.display = display;
        this.sprites = new Uint8Array(64 * 4);
    }

    draw () {
        for (var i=0; i<64; i++) {
            const spritey = this.sprites[i*4 + 2];
            if (spritey > 240) continue;
            const x = this.sprites[i*4 + 1];
            const index = this.sprites[i*4 + 0];
            const attrs = this.sprites[i*4 + 3];

            const flipX = (attrs & SPRITE_FLIP_X) > 0;
            const flipY = (attrs & SPRITE_FLIP_Y) > 0;
            const priority = (attrs & SPRITE_PRIORITY) > 0;
            const palette = attrs & SPRITE_PALETTE;

            this.drawSprite(index, x, y, flipX, flipY, priority, palette);
        }
    };

    drawSprite (index, x, y, flipX, flipY, priority, palette) {
        for (var pi=0; pi<8; pi++) {
            const px = flipX ? 8-pi : pi;
            for (var pj=0; pj<8; pj++) {
                const py = flipY ? 8-pj : pj;
                // check sprite table for pixel value
                const color = ppu.getSpritePixel(index, px, py);
                const displayColor = ppu.getSpriteColor(palette, color);
                this.display.setPixelColor(x + pi, y + pj, displayColor);
            }
        }
    }

    setSprite (i, index, x, y, flipX, flipY, priority, palette) {
        this.sprites[i*4 + 0] = 0xff & index;
        this.sprites[i*4 + 1] = 0xff & x;
        this.sprites[i*4 + 2] = 0xff & y;
        this.sprites[i*4 + 3] = getAttributeByte(flipX, flipY, priority, palette);
    };

    clearSprite (i) {
        this.sprites[i*4 + 0] = 0xff;
        this.sprites[i*4 + 1] = 0xff;
        this.sprites[i*4 + 2] = 0xff;
        this.sprites[i*4 + 3] = 0xff;
    };

    clearSprites () {
        for (var i=0; i<64; i++) {
            this.clearSprite(i);
        }
    };
}

export default SpriteManager;
