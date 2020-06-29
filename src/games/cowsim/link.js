import spriteManager from '~/spriteManager';

const dir = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

function create() {
  const link = {
    x: 0,
    y: 0,
    direction: dir.DOWN,
    frame: 0,
    moving: false,
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
  const { x, y, sprites, direction, moving, palette, frame, attacking } = link;
  const even = (frame % 16) < 8;

  let idx, flipx;
  switch (direction) {
    case dir.UP:
      idx = attacking ? 0x44 : 0x28;
      flipx = !attacking && moving && even;
      break;
    case dir.DOWN:
      idx = attacking ? 0x40 : 0x20 + 2 * (moving && even);
      break;
    case dir.LEFT:
    case dir.RIGHT:
      idx = 0x24 + 2 * (moving && even);
      flipx = direction === dir.LEFT;
      break;
  }

  const X0 = flipx ? x+8 : x; 
  const X1 = flipx ? x : x+8;

  spriteManager.setSprite(sprites[0], idx, X0, y, flipx, false, false, palette);
  spriteManager.setSprite(sprites[1], idx+1, X1, y, flipx, false, false, palette);
  spriteManager.setSprite(sprites[2], idx+16, X0, y+8, flipx, false, false, palette);
  spriteManager.setSprite(sprites[3], idx+17, X1, y+8, flipx, false, false, palette);
}

export default { create, remove, dir, draw };
