import {
    colors,
    getColorByte
} from'./palette';

const WIDTH = 256;
const HEIGHT = 240;
const BYTES_PER_PIXEL = 4;
const ROW_WIDTH = WIDTH * BYTES_PER_PIXEL;

class Display {
    constructor (ctx) {
        this.ctx = ctx;
        this.buffer = new ImageData(WIDTH, HEIGHT);
        this.pixels = this.buffer.data;
    }

    getPixel (x, y) {
        const idx = y * ROW_WIDTH + x * BYTES_PER_PIXEL;
        return [
            this.pixels[idx + 0], // r
            this.pixels[idx + 1], // g
            this.pixels[idx + 2], // b
        ];
    }
    
    setPixel (x, y, displayColor) {
        const r = getColorByte(displayColor, 0);
        const g = getColorByte(displayColor, 1);
        const b = getColorByte(displayColor, 2);
        const idx = y * ROW_WIDTH + x * BYTES_PER_PIXEL;
        
        this.pixels[idx + 0] = r;
        this.pixels[idx + 1] = g;
        this.pixels[idx + 2] = b;
        this.pixels[idx + 3] = 0xFF;
    }
    
    draw () {
        this.ctx.putImageData(this.buffer, 0, 0);
    }
}

export default Display;
