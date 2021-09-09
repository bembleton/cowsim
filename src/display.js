import colors from'./palette';

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
    const X = x;// * 2;
    const Y = y;// * 2;
    const idx = (Y * ROW_WIDTH + X * BYTES_PER_PIXEL);
    return [
        this.pixels[idx + 0], // r
        this.pixels[idx + 1], // g
        this.pixels[idx + 2], // b
    ];
  }
  
  setPixel (x, y, displayColor, { grayscale, emphasizeRed, emphasizeGreen, emphasizeBlue } = {}) {
    // 0xrrggbb;
    if (grayscale) displayColor &= 0x30;
    emphasizeRed = emphasizeRed ? 3/4 : 1;
    emphasizeGreen = emphasizeGreen ? 3/4 : 1;
    emphasizeBlue = emphasizeBlue ? 3/4 : 1;
    const color = colors[displayColor];
    const r = ((0xff & (color>>16)) * emphasizeGreen * emphasizeBlue) & 0xff; 
    const g = ((0xff & (color>>8)) * emphasizeRed * emphasizeBlue);
    const b = ((0xff & (color)) * emphasizeRed * emphasizeGreen);
    const X = x;// * 2;
    const Y = y;// * 2;
    const idx = Y * ROW_WIDTH + X * BYTES_PER_PIXEL;
    if (idx < 0 || idx >= this.pixels.length) return;
    this.pixels.set([r, g, b, 0xFF], idx);
    //this.pixels.set([r, g, b, 0xFF], idx + BYTES_PER_PIXEL);
    //this.pixels.set([r, g, b, 0xFF], idx + ROW_WIDTH);
    //this.pixels.set([r, g, b, 0xFF], idx + ROW_WIDTH + BYTES_PER_PIXEL);
  }
  
  draw () {
    this.ctx.putImageData(this.buffer, 0, 0);
  }
}

export default Display;
