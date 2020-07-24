import spriteManager from '~/spriteManager';
import { randInt } from '~/random';
import { SubPixels } from './utils';

const dir = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

function create() {
  const link = {
    pos: SubPixels.fromPixels(0,0),
    direction: dir.DOWN,
    frame: 0,
    moving: false,
    swimming: false,
    drowning: false,
    speed: 24,
    attacking: false,
    canAttack: true,
    palette: 0, // palette number
    sprites: [],
  };

  for (let i=0; i<4; i++){
    link.sprites.push(spriteManager.requestSprite());
  }

  return link;
}

function remove(link) {
  link.sprites.forEach(i => spriteManager.freeSprite(i));
}

function draw(link) {
  const {
    pos, sprites, direction, palette, frame,
    moving, attacking, swimming, drowning, dying, dead
  } = link;

  if (dying || dead) {
    drawDyingLink(link);
    return;
  }

  const { x, y } = pos.toPixels();
  const even = (frame % 16) < 8;
  const third = (frame % 24) < 8;
  const fifth = (frame % 20) < 4;
  
  // 256 frames
  // spin 4 times, once over 64 frames, each dir lasting 16 frames
  // set dir to frame/4

  //const dir = dying ? (frame>>8) % 4 : direction;
  const d =
    drowning ? dir.DOWN : 
    direction;

  const step = (moving || swimming) && even;

  let idx, flipx;
  switch (d) {
    case dir.UP:
      idx = attacking ? 0x44 : 0x28;
      flipx = !attacking && step;
      break;
    case dir.DOWN:
      idx =
        attacking ? 0x40 : 
        (drowning && third) ? 0x46 :
        (drowning && fifth) ? 0x48 :
        0x20 + 2 * step;
      flipx = drowning ? even : false;
      break;
    case dir.LEFT:
    case dir.RIGHT:
      idx = 0x24 + 2 * step;
      flipx = d === dir.LEFT;
      break;
  }

  drawLink(x, y, idx, sprites, flipx, swimming, palette);
}

function drawDyingLink(link) {
  const {
    pos, sprites, palette, frame, dead, dying, swimming
  } = link;

  const { x, y } = pos.toPixels();
  
  // 256 frames
  // spin 4 times, once over 64 frames, each dir lasting 16 frames
  // set dir to frame/4

  //const dir = dying ? (frame>>8) % 4 : direction;
  const d =
    dead || frame < 64 ? dir.DOWN : 
    [dir.DOWN, dir.LEFT, dir.UP, dir.RIGHT][((frame>>3) % 4)];

  let idx;
  let flipx = false;
  switch (d) {
    case dir.UP:
      idx = 0x28;
      break;
    case dir.DOWN:
      idx = 0x20;
      break;
    case dir.LEFT:
      flipx = true;
    case dir.RIGHT:
      idx = 0x24;
      break;
  }

  if (!dead || frame < 64) {
    drawLink(x, y, idx, sprites, flipx, swimming, palette);
  } else if (frame < 64+32) {
    drawPoof(x, y, frame-64, sprites, palette);
  }
}

function drawLink(x, y, idx, sprites, flipx, swimming, palette) {
  const X0 = flipx ? x+8 : x; 
  const X1 = flipx ? x : x+8;

  spriteManager.setSprite(sprites[0], idx,    X0, y,   flipx, false, false, palette);
  spriteManager.setSprite(sprites[1], idx+1,  X1, y,   flipx, false, false, palette);
  spriteManager.setSprite(sprites[2], idx+16, X0, y+8, flipx, false, swimming, palette);
  spriteManager.setSprite(sprites[3], idx+17, X1, y+8, flipx, false, swimming, palette);
}

function drawPoof(x, y, frame, sprites, palette) {
  const idx = frame < 8 ? 0x3d : 0x4d;
  spriteManager.setSprite(sprites[0], idx, x,   y,   false, false, false, palette);
  spriteManager.setSprite(sprites[1], idx, x+8, y,   true, false, false, palette);
  spriteManager.setSprite(sprites[2], idx, x,   y+8, false, true, false, palette);
  spriteManager.setSprite(sprites[3], idx, x+8, y+8, true, true, false, palette);
}

export default { create, remove, dir, draw };
