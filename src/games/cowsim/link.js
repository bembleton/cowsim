import spriteManager from '~/spriteManager';
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
    pos, sprites, direction, moving, palette, frame, attacking, swimming
  } = link;
  const { x, y } = pos.toPixels();
  const even = (frame % 16) < 8;

  let idx, flipx;
  switch (direction) {
    case dir.UP:
      idx = attacking ? 0x44 : 0x28;
      flipx = !attacking && (moving || swimming) && even;
      break;
    case dir.DOWN:
      idx = attacking ? 0x40 : 0x20 + 2 * ((moving || swimming) && even);
      break;
    case dir.LEFT:
    case dir.RIGHT:
      idx = 0x24 + 2 * ((moving || swimming) && even);
      flipx = direction === dir.LEFT;
      break;
  }

  const X0 = flipx ? x+8 : x; 
  const X1 = flipx ? x : x+8;

  spriteManager.setSprite(sprites[0], idx, X0, y, flipx, false, false, palette);
  spriteManager.setSprite(sprites[1], idx+1, X1, y, flipx, false, false, palette);
  spriteManager.setSprite(sprites[2], idx+16, X0, y+8, flipx, false, swimming, palette);
  spriteManager.setSprite(sprites[3], idx+17, X1, y+8, flipx, false, swimming, palette);
}

export default { create, remove, dir, draw };
