import spriteManager from '~/spriteManager';
import { randInt } from '~/random';
import { frameIndex, SubPixels } from './utils';
import SPRITES from './data/sprites';
import { bbox } from '../../boundingBox';
import { MetaSprite, Sprite } from '../../spriteManager';
import { Direction } from './direction';

const dir = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

export class Link {
  constructor() {
    const x = 0;
    const y = 0;
    const sprite = SPRITES.link.up;
    const palette = 0;

    this.pos = SubPixels.fromPixels(x, y);
    this.direction = Direction.up;
    this.frame = 0;
    this.moving = false;
    this.swimming = false;
    this.drowning = false;
    this.hurt = false;
    this.attackFrame = 0;
    this.attacking = false;
    this.canAttack = true;
    this.palette = palette;
    this.sprite = new MetaSprite({ x, y, sprite, palette, width: 2, height: 2 });
    this.weaponSprite = new MetaSprite().add(0,0,0).add(0,0,0);
    this.shieldSprite = null;

    // vertical
    //this.weaponSprite = new MetaSprite({ sprite: SPRITES.weapon, height: 2, width: 1 });
    // horizontal
    //this.weaponSprite.update({ sprite: SPRITES.weapon+1 });
    //this.weaponSprite.sprites[1].offset = { x:8, y:0 };

  }
  getBbox() {
    const { x, y } = this.pos.toPixels();
    const height = 15;
    // todo: account for animation differences?
    if (this.direction === Direction.up || this.direction === Direction.down) {
      return new bbox(x+2, y+1, 12, 15);
    } else {
      return new bbox(x+1, y+1, 14, 15);
    }
  }
  draw() {
    const {
      pos, direction, moving, attacking, swimming, drowning, hurt, dying, dead
    } = this;
  
    if (dying || dead) {
      this.drawDying();
      return;
    }
  
    const frame = this.frame;
    const { x, y } = pos.toPixels();
    
    // frame splits
    const even = (frame % 16) < 8;
    const third = (frame % 24) < 8;
    const fifth = (frame % 20) < 4;
    
    const dir = drowning ? Direction.down : direction;
  
    // step is animationFrame 0 or 1
    const animationFrame = (moving || swimming || drowning) ? frameIndex(frame, 16, 2) : 0;
    
    const palette = hurt ? frameIndex(frame, 2, 4) : this.palette;
    const { sprite, flipX, flipY } = this.getSpriteFromState(dir, animationFrame);
    this.sprite.update({ x, y, sprite, flipX, flipY, palette });

    // hide lower sprites when swimming
    this.sprite.sprites[2].update({ priority: swimming });
    this.sprite.sprites[3].update({ priority: swimming });

    this.sprite.draw();

    // if (attacking) {
    //   this.weaponSprite.draw();
    //   this.drawWeapon();
    // } else {
    //   this.weaponSprite.dispose();
    // }
  }

  // drawWeapon() {
  //   const {
  //     pos, direction, attackFrame, weaponSprite
  //   } = this;
  //   const { x: posx, y: posy } = pos.toPixels();

  //   let flipX = false;
  //   let flipY = false;
  //   // extends out in 3 frames
  //   let x, y, x2, y2;
  //   const offset = (attackFrame < 4) ? 3 : 12;
  //   const priority = false;
  //   //const sprite = direction === Direction.down || direction === Direction.up ? SPRITES.weapon : SPRITES.weapon+1;
  //   let sprite, sprite2;
  //   // const offset =
  //   //   frame < 4 ? 3 :
  //   //   frame < 20 ? 12 :
  //   //   frame < 23 ? (23-frame)*3 :
  //   //   3;

  //   switch (direction) {
  //     case Direction.up:
  //       x = posx + 3;
  //       y = posy - offset;
  //       x2 = x;
  //       y2 = y+8;
  //       sprite = SPRITES.weapon;
  //       sprite2 = SPRITES.weapon+16;
  //       break;
  //     case Direction.down:
  //       x = posx + 5;
  //       y = posy + offset;
  //       x2 = x;
  //       y2 = y+8;
  //       flipY = true;
  //       sprite = SPRITES.weapon+16;
  //       sprite2 = SPRITES.weapon;
  //       break;
  //     case Direction.right:
  //       x = posx + offset;
  //       y = posy + 6;
  //       x2 = x+8;
  //       y2 = y;
  //       sprite = SPRITES.weapon+17;
  //       sprite2 = SPRITES.weapon+1;
  //       break;
  //     case Direction.left:
  //       x = posx - offset;
  //       y = posy + 6;
  //       x2 = x+8;
  //       y2 = y;
  //       flipX = true;
  //       sprite = SPRITES.weapon+1;
  //       sprite2 = SPRITES.weapon+17;
  //       break;
  //   }

  //   weaponSprite.sprites[0].update({ index: sprite, x, y, flipX, flipY, priority });
  //   weaponSprite.sprites[1].update({ index: sprite2, x: x2, y: y2, flipX, flipY, priority });
  // }

  /** select a 2x2 sprite with flipping
   * this doesnt compose partial sprites
   */
  getSpriteFromState(dir, animationFrame) {
    const { attacking } = this;
    const spriteData = attacking ? SPRITES.link.attacking : SPRITES.link;

    const hasDirection = spriteData[dir] !== undefined;
    const sprites = hasDirection ? spriteData[dir] : spriteData[Direction.flipped[dir]];
    const singleFrame = !sprites.length;
    const sprite = singleFrame ? sprites : sprites[animationFrame];
    
    const vertical = Direction.isVertical(dir);
    const flipX = (!vertical && !hasDirection) || (vertical && singleFrame && animationFrame === 1);
    const flipY = (vertical && !hasDirection) || (!vertical && singleFrame && animationFrame === 1);
  
    return { sprite, flipX, flipY };
  }

  drawDying() {
    const { dead, frame } = this;

    // spin 
    const dir = dead ? Direction.down : [
      Direction.down,
      Direction.left,
      Direction.up,
      Direction.right
    ][frameIndex(frame, 8, 4)];
    const { sprite, flipX } = this.getSpriteFromState(dir, 0);
    this.sprite.update({ sprite, flipX })
  }

  drawPoof() {
    const index = SPRITES.death_blink[frame < 8 ? 0 : 1];
    const flipX = true;
    const flipY = true;

    this.sprite.sprites[0].update({ index });
    this.sprite.sprites[1].update({ index, flipX });
    this.sprite.sprites[2].update({ index, flipY });
    this.sprite.sprites[3].update({ index, flipX, flipY });
  }
  dispose() {
    this.sprite.dispose();
    this.weaponSprite.dispose();
  }
}

function create() {
  const link = {
    pos: SubPixels.fromPixels(0,0),
    getBbox: function() {
      const { x, y } = this.pos.toPixels();
      return new bbox(x, y, 16, 16);
    },
    direction: dir.DOWN,
    frame: 0,
    moving: false,
    swimming: false,
    drowning: false,
    hurt: false,
    speed: 24,
    attackFrame: 0,
    attacking: false,
    canAttack: true,
    palette: 0, // palette number
    weaponSprites: [
      spriteManager.requestSprite(),
      spriteManager.requestSprite()
    ],
    shieldSprites: [

    ],
    sprites: [],
    itemA: null,
    itemB: null,
    items: 0
  };

  for (let i=0; i<4; i++){
    link.sprites.push(spriteManager.requestSprite());
  }

  return link;
}

function remove(link) {
  link.weaponSprites.forEach(i => spriteManager.freeSprite(i));
  link.sprites.forEach(i => spriteManager.freeSprite(i));
}

function draw(link) {
  const {
    pos, sprites, direction, frame,
    moving, attacking, swimming, drowning,
    hurt, dying, dead
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
      idx = attacking ? SPRITES.link_attack_up : SPRITES.link_up;
      flipx = !attacking && step;
      break;
    case dir.DOWN:
      idx =
        attacking ? SPRITES.link_attack_down : 
        (drowning && third) ? 0x46 :
        (drowning && fifth) ? 0x48 :
        SPRITES.link_down;
      flipx = drowning ? even : step;
      break;
    case dir.LEFT:
    case dir.RIGHT:
      idx = 
        attacking ? SPRITES.link_attack_right :
        SPRITES.link_right[1*step];
      flipx = d === dir.LEFT;
      break;
  }

  const palette = hurt ? ((frame >> 1) % 4) : link.palette;
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
      idx = SPRITES.link_up;
      break;
    case dir.DOWN:
      idx = SPRITES.link_down;
      break;
    case dir.LEFT:
      flipx = true;
    case dir.RIGHT:
      idx = SPRITES.link_right;
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
  const idx = SPRITES.death_blink[frame < 8 ? 0 : 1];
  spriteManager.setSprite(sprites[0], idx, x,   y,   false, false, false, palette);
  spriteManager.setSprite(sprites[1], idx, x+8, y,   true, false, false, palette);
  spriteManager.setSprite(sprites[2], idx, x,   y+8, false, true, false, palette);
  spriteManager.setSprite(sprites[3], idx, x+8, y+8, true, true, false, palette);
}

export default { create, remove, dir, draw };