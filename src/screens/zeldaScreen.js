import perlin from 'perlin-noise';
import ppu from '../ppu';
import spriteManager from '../spriteManager';
import { isPressed, buttons } from '../controller';
import { randInt } from '../random';
import { effects } from '../sound.js';

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
} = ppu;


const LIGHT_GREEN = 0x29;
const MED_GREEN = 0x1a;
const DARK_GREEN = 0x0a;

const LIGHT_BLUE = 0x11;
const DARK_BLUE = 0x01;
const LIGHT_BROWN = 0x18;
const DARK_BROWN = 0x08;
const LIGHT_GRAY = 0x10;
const DARK_GRAY = 0x00;
const BLACK = 0x3F;

const dir = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

const left_grass = 0x60; // 0x60
const normal_grass = 0x62; // 0x62
const right_grass = 0x64; // 0x64

const isGrass = (tile) => {
  return (tile >= left_grass && tile <= right_grass + 1) ||
    (tile >= left_grass + 16 && tile <= right_grass + 17)
}

// distance in pixels for tile indices
// accounts for screenwrap
const distance = (x1, y1, x2, y2) => {
  const width = 32;
  const height = 60;

  x1 = clamp(x1, width);
  x2 = clamp(x2, width);
  y1 = clamp(y1, height);
  y2 = clamp(y2, height);
  const dx = Math.min( Math.abs(x2-x1), width - Math.abs(x2-x1) ) * 8;
  const dy = Math.min( Math.abs(y2-y1), height - Math.abs(y2-y1) ) * 8;
  return Math.floor(Math.sqrt(dx*dx + dy*dy));
};

const isLeftOf = (x1, x2) => {
  const width = 32;
  x1 = clamp(x1, width);
  x2 = clamp(x2, width);
  const d = x2-x1;
  return d > 0 && d < width >> 1;
};

const clamp = (a, max) => {
  a %= max; if (a < 0) a+= max;
  return a;
};

export default class TestScreen {
  constructor (game) {
    this.game = game;
    this.scroll = {
      x: 0,
      y: 0
    };
    this.link = {
      x: 120,
      y: 120,
      direction: dir.DOWN,
      frame: 0,
      moving: false,
      attacking: false,
      canAttack: true,
      color: 0,
      sprites: [],
      swordSprite: []
    };
    
  }

  update (time) {
    const scrollAmt = 2;
    const { scroll, link } = this;
    const wasMoving = link.moving;
    link.moving = false;

    if (isPressed(buttons.A) && link.canAttack && !link.attacking) {
      link.attacking = true;
      link.canAttack = false;
      link.frame = 0;
    }

    if (!isPressed(buttons.A)) {
      link.canAttack = true;
    }
    
    if (link.frame >= 24 && link.attacking) {
      link.attacking = false;
      link.frame = 0;
    }

    const canMove = !link.attacking || link.frame > 20;

    if (link.attacking && link.frame < 8) {
      
    } else if (isPressed(buttons.UP)) {
      link.direction = dir.UP;
      if (canMove) {
        scroll.y -= scrollAmt;
        link.moving = true;
      }
    } else if (isPressed(buttons.DOWN)) {
      link.direction = dir.DOWN;
      if (canMove) {
        scroll.y += scrollAmt;
        link.moving = true;
      }
    } else if (isPressed(buttons.RIGHT)) {
      link.direction = dir.RIGHT;
      if (canMove) {
        scroll.x += scrollAmt;
        link.moving = true;
      }
    } else if (isPressed(buttons.LEFT)) {
      link.direction = dir.LEFT;
      if (canMove) {
        scroll.x -= scrollAmt;
        link.moving = true;
      }
    }

    setScroll(scroll.x, scroll.y);
    this.centerx = screenToTileX(128);
    this.centery = screenToTileY(128);

    if (link.attacking) {
      this.attack();
    }

    if (link.moving && (link.frame % 8) === 0) {
      effects.footStep();
    }

    this.updateGrass();

    link.frame = (link.frame + 1) % 256;
    this.drawLink();
  }

  drawLink () {
    const { x, y, sprites, direction, moving, color, frame, swordSprite, attacking } = this.link;
    const even = (frame % 16) < 8;

    let idx, flipx;
    switch (direction) {
      case dir.UP:
        idx = attacking ? 0x44 : 0x28;
        flipx = !attacking && moving && even;
        break;
      case dir.DOWN:
        idx = attacking ? 0x40 : 0x20 + 2 * (moving && even);
        flipx = false;
        break;
      case dir.LEFT:
      case dir.RIGHT:
        idx = 0x24 + 2 * (moving && even);
        flipx = direction === dir.LEFT;
        break;
    }

    const X0 = flipx ? x+8 : x; 
    const X1 = flipx ? x : x+8;
    spriteManager.setSprite(sprites[0], idx, X0, y, flipx, false, false, color);
    spriteManager.setSprite(sprites[1], idx+1, X1, y, flipx, false, false, color);
    spriteManager.setSprite(sprites[2], idx+16, X0, y+8, flipx, false, false, color);
    spriteManager.setSprite(sprites[3], idx+17, X1, y+8, flipx, false, false, color);

    if (attacking) {
      this.drawSword();
    } else {
      // hidden
      spriteManager.setSprite(swordSprite[0], 0x10, 0, 240);
      spriteManager.setSprite(swordSprite[1], 0x11, 0, 240);
    }
  }

  drawSword () {
    const { link } = this;
    const { frame, swordSprite, direction } = link;
    let x,y;
    const offset =
      frame < 4 ? 3 :
      frame < 20 ? 12 :
      frame < 23 ? (23-frame)*3 :
      3;

    switch (direction) {
      case dir.UP:
        x = link.x + 3;
        y = link.y - offset;
        spriteManager.setSprite(swordSprite[0], 0x12, x, y, false, false, false, 1);
        spriteManager.setSprite(swordSprite[1], 0x13, x, y+8, false, false, false, 1);
        break;
      case dir.DOWN:
        x = link.x + 5;
        y = link.y + offset;
        spriteManager.setSprite(swordSprite[0], 0x13, x, y, false, true, false, 1);
        spriteManager.setSprite(swordSprite[1], 0x12, x, y+8, false, true, false, 1);
        break;
      case dir.RIGHT:
        x = link.x + offset;
        y = link.y + 6;
        spriteManager.setSprite(swordSprite[0], 0x10, x, y, false, false, false, 1);
        spriteManager.setSprite(swordSprite[1], 0x11, x+8, y, false, false, false, 1);
        break;
      case dir.LEFT:
        x = link.x - offset;
        y = link.y + 6;
        spriteManager.setSprite(swordSprite[0], 0x11, x, y, true, false, false, 1);
        spriteManager.setSprite(swordSprite[1], 0x10, x+8, y, true, false, false, 1);
        break;
    }
  }

  load () {
    setScroll(0, 0);
    this.centerx = screenToTileX(128);
    this.centery = screenToTileY(128);

    setCommonBackground(LIGHT_GREEN);
    
    setBgPalette(0, LIGHT_GREEN, DARK_GREEN, DARK_GREEN, MED_GREEN); // grass,grass,dirt,dirt
    setBgPalette(1, LIGHT_GREEN, LIGHT_GREEN, MED_GREEN, MED_GREEN); // grass,dirt,water,water

    setSpritePalette(0, BLACK, 0x06, 0x27, 0x12); // blue link
    setSpritePalette(1, BLACK, 0x02, 0x12, 0x30); // white sword

    const noise = perlin.generatePerlinNoise(16, 30);

    // fill background
    for (let y=0; y<30; y++)
    for (let x=0; x<16; x++) {

      const X = x << 1;
      const Y = y << 1;

      if (noise[y * 16 + x] < 0.5) {
        this.drawBlank(X, Y);
      } else {
        setAttribute(x,y,0);
        
        this.drawGrass(X, Y);
        this.drawGrass(X+1, Y);
        this.drawGrass(X, Y+1);
        this.drawGrass(X+1, Y+1);
      }
    }

    spriteManager.clearSprites();
    this.link.swordSprite[0] = spriteManager.requestSprite();
    this.link.swordSprite[1] = spriteManager.requestSprite();
    
    this.link.sprites = [];
    for (let i=0; i<4; i++){
      this.link.sprites.push(spriteManager.requestSprite());
    }
  }

  drawBlank (X, Y) {
    setAttribute(X >> 1, Y >> 1, 1);
        
    setNametable(X, Y, 0x46);
    setNametable(X+1, Y, 0x47);
    setNametable(X, Y+1, 0x56);
    setNametable(X+1, Y+1, 0x57);
  }

  // x 0-32
  // y 0-30
  drawGrass(x, y) {
    const tile = this.getGrassTile(x, y);
    setNametable(x, y, tile);
  }

  getGrassTile (x, y) {
    const { centerx, centery } = this;
    let grass = normal_grass;
    const d = distance(x, y, centerx, centery);

    if ((x >= centerx - 2 && x <= centerx + 2) &&
        (y <= centery + 2 && y >= centery - 2) &&
        (d < 24)) {
          grass = isLeftOf(x, centerx) ? left_grass : right_grass;
    }

    // determine corner
    return grass + (x % 2) + ((y % 2)*16);
  }

  attackAt (x, y) {
    const tile = getNametable(x, y);
    if (isGrass(tile)) {
      // gut some grass
      this.drawBlank(x, y);
      effects.cutGrass();
    }
  }

  attack () {
    const { link, centerx: x, centery: y } = this;
    const { direction } = link;
    const [tx, ty] = [x & 0xfe, y & 0xfe];

    this.attackAt(tx, ty);
    if (direction === dir.UP) this.attackAt(tx, ty - 2);
    if (direction === dir.DOWN) this.attackAt(tx, ty + 2);
    if (direction === dir.LEFT) this.attackAt(tx - 2, ty);
    if (direction === dir.RIGHT) this.attackAt(tx + 2, ty);
  }

  updateGrass () {
    const { centerx: x, centery: y } = this;
    
    for (let j=y-4; j<y+4; j++)  // surrounding attributes
    for (let i=x-4; i<x+4; i++) {
      const tile = getNametable(i, j);
      if (isGrass(tile)) {
        this.drawGrass(i, j);
      }
    }
  }
}