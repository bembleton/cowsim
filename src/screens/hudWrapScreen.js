import SimplexNoise from 'simplex-noise';
import ppu from '../ppu';
import spriteManager from '../spriteManager';
import { isPressed, buttons } from '../controller';
import { randInt } from '../random';

const {
  HORIZONTAL,
  VERTICAL,
  setCommonBackground,
  setMirroring,
  setNametable,
  getNametable,
  setAttribute,
  setBgPalette,
  setSpritePalette,
  setScroll,
  getScroll,
  getScreenSpaceTile,
  screenToTileX,
  screenToTileY,
  setBackgroundData
} = ppu;


const tiles = {
  blank: 0x2e,
  water: 0x46,
  tall_grass: 0x62,
  grass: 0x46,
  dirt: 0x46,
  sand: 0xa0,
  rock: 0x84
}

const white = 0x20;
const black = 0x3f;
const red = 0x16;
const green = 0x29;
const LIGHT_GREEN = 0x29;
const MED_GREEN = 0x1a;
const DARK_GREEN = 0x0b;

const palettes = [
  [black, 0x02, 0x11, 0x21], // water
  [LIGHT_GREEN, DARK_GREEN, DARK_GREEN, MED_GREEN], // grass
  [0x38, 0x08, 0x17, 0x2d], // dirt
  [black, 0x00, 0x10, 0x20]  // rock
];

const hud_palettes = [
  [black, white, white, white],
  [black, white, white, red],
  [0x02, 0x0b, 0x38, 0x00] // mini map
];

const drawTile = (x, y, tile, palette) => {
  setAttribute(x, y, palette);
  const [X, Y] = [x << 1, y << 1];
  setNametable(X, Y, tile);
  setNametable(X+1, Y, tile+1);
  setNametable(X, Y+1, tile+16);
  setNametable(X+1, Y+1, tile+17);
}

let simplex = new SimplexNoise();
const noise2d = (x, y) => {
  return (simplex.noise2D(x, y) + 1) / 2;
};

const exp = 1.1;
const scale = 48;
const mapScale = 12;

const noise = (x, y) => {
  const val = noise2d(x / scale, y / scale);
  return Math.pow(val, exp);
};

/*
0: water
1: tall_grass
2: grass
3: sand
4: dirt
5: rock
*/
const elevation = (x, y) => {
  return Math.floor(noise(x, y) * 6);
};

const tileMap = [
  tiles.water,
  tiles.grass,
  tiles.grass,
  tiles.grass,
  tiles.sand,
  tiles.rock
];

const paletteMap = [0, 1, 1, 1, 2, 3];

const drawMinimap = () => {
  const start = 0x00c0 << 4;  // bytes
  const width = 48;           // pixels
  const height = 32;          // pixels
  let data = 0x00;
  for (let y=0; y<height; y++)
  for (let x=0; x<width; x++) {
    const elev = Math.pow(noise2d(x/mapScale, y/mapScale), exp) * 6;
    const color = paletteMap[Math.floor(elev)] & 0xff;
    data = (data << 2 | color) & 0xff; 
    if (x % 4 === 3) {
      const adr = start + (y*32) + (x >> 2);
      setBackgroundData(adr, data);
    }
  }

  drawTile(0, 0, 0xc0, 2);
  drawTile(1, 0, 0xc2, 2);
  drawTile(2, 0, 0xc4, 2);
  drawTile(0, 1, 0xe0, 2);
  drawTile(1, 1, 0xe2, 2);
  drawTile(2, 1, 0xe4, 2);
};

const drawHud = () => {
  for (let y=0; y<3; y++)
  for (let x=0; x<16; x++) {
    drawTile(x, y, tiles.blank, 0);
  }

  drawMinimap();

  // 4 sprites to cover the bottom of the map
  // for (let i=0; i<4; i++) {
  //   const id = spriteManager.requestSprite();
  //   spriteManager.setSprite(id, 0x14, 16 + 8*i, 40, false, false, false, 0);
  // }
};

// draws map area posx, posy into nametable at namex, namey
const drawArea = (posx, posy, tilex, tiley) => {
  // fill background (16x12 tiles worth)
  for (let y=0; y<12; y++) {
    for (let x=0; x<16; x++) {
      const e = elevation(posx + x, posy + y);
      const tile = tileMap[e]; // 0x1a + e;
      const palette = paletteMap[e];
      drawTile(tilex + x, tiley + y, tile, palette);
    }
  }
}

export default class HudWrapScreen {
  constructor (game) {
    this.game = game;

    this.scroll = {
      x: 0,
      y: 0
    };

    // current map position
    this.position = {
      x: 0,
      y: 0,
    };

    // null, 'up', 'down', 'left', 'right'
    this.scrolling = null;

    game.onScanLine = (y) => {
      if (y === 0) {
        // draw hud
        setScroll(0, 0);
        hud_palettes.forEach((x,i) => {
          setBgPalette(i, x[0], x[1], x[2], x[3]);
        });

      } else if (y === 48) {
        setScroll(this.scroll.x, this.scroll.y);
        palettes.forEach((x,i) => {
          setBgPalette(i, x[0], x[1], x[2], x[3]);
        });
      }
    };
  }

  load () {
    simplex = new SimplexNoise();

    setCommonBackground(green);
    palettes.forEach((x,i) => {
      setBgPalette(i, x[0], x[1], x[2], x[3]);
    });
    setSpritePalette(0, black, black, black, black);

    setMirroring(HORIZONTAL);

    // start in top-left corner?
    const [posx, posy] = [0, 0];
    drawArea(posx, posy, 0, 3);

    drawHud();
  }

  update () {
    const scrollAmt = 4;
    const { scroll, scrolling } = this;

    if (scrolling) {
      // continue scrolling
      switch (scrolling) {
        case 'down':
          this.scroll.y += scrollAmt;
          if (this.scroll.y === 12*16) {
            // copy to first nametable
            // could optimize by drawing rows as we scroll?
            drawArea(this.position.x, this.position.y, 0, 3);
            // and reset the scroll to 0,0
            this.scroll.y = 0;
            this.scrolling = null;
          }
          break;
        case 'right':
          this.scroll.x += scrollAmt;
          if (this.scroll.x === 16*16) {
            // copy to first nametable
            // could optimize by drawing rows as we scroll?
            drawArea(this.position.x, this.position.y, 0, 3);
            // and reset the scroll to 0,0
            this.scroll.x = 0;
            this.scrolling = null;
            setMirroring(HORIZONTAL);
          }
          break;
        case 'up':
          this.scroll.y -= scrollAmt;
          if (this.scroll.y === 0) {
            this.scrolling = null;
          }
          break;
        case 'left':
          this.scroll.x -= scrollAmt;
          if (this.scroll.x === 0) {
            this.scrolling = null;
            setMirroring(HORIZONTAL);
          }
          break;
      }
      setScroll(scroll.x, scroll.y);

    } else if (isPressed(buttons.UP)) {
      this.scrollUp();
    } else if (isPressed(buttons.DOWN)) {
      this.scrollDown();
    } else if (isPressed(buttons.RIGHT)) {
      this.scrollRight();
    } else if (isPressed(buttons.LEFT)) {
      this.scrollLeft();
    }

    
  }

  scrollDown () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    setMirroring(HORIZONTAL);
    // load next screen below
    drawArea(posx, posy + 12, 0, 15);
    this.position.y += 12;
    this.scrolling = 'down';
  }

  scrollRight () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    setMirroring(VERTICAL);
    // load next screen to the right
    drawArea(posx + 16, posy, 16, 3);
    this.position.x += 16;
    this.scrolling = 'right';
  }

  scrollUp () {
    const { position } = this;
    const { x: posx, y: posy } = position;

    setMirroring(HORIZONTAL);
    // copy current screen below
    drawArea(posx, posy, 0, 15);
    this.scroll.y = 12*16;
    setScroll(0, 12*16);

    // load next screen above
    // could optimize by drawing rows as we scroll?
    drawArea(posx, posy - 12, 0, 3);
    this.position.y -= 12;
    this.scrolling = 'up';
  }

  scrollLeft () {
    const { position } = this;
    const { x: posx, y: posy } = position;

    setMirroring(VERTICAL);
    // copy current screen to the right
    drawArea(posx, posy, 16, 3);
    this.scroll.x = 16*16;
    setScroll(256, 0);

    // load next screen on the left
    // could optimize by drawing rows as we scroll?
    drawArea(posx - 16, posy, 0, 3);
    this.position.x -= 16;
    this.scrolling = 'left';
  }
}