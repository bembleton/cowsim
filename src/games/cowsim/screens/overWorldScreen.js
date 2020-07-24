import ppu from '~/ppu';
import spriteManager from '~/spriteManager';
import { isPressed, buttons } from '~/controller';
import { randInt, Randy } from '~/random';
import { palettes } from '../data/colors';
import Link from '../link';
import { SubPixels } from '../utils';
import { drawArea, elevation, isSolid, isWater } from './terrain';
import Hud from './hud';
const { dir } = Link;

const {
  HORIZONTAL,
  VERTICAL,
  enableCommonBackground,
  setMirroring,
  getNametable,
  setBgPalette,
  setSpritePalette,
  setScroll,
} = ppu;

export default class OverworldScreen {
  constructor (game) {
    this.game = game;

    this.scroll = {
      x: 0,
      y: 0
    };

    // current map position
    // each 'screen' is 16x12
    // the full map is 12 screens wide (192 blocks x )

    this.position = {
      x: 16*4,
      y: 12*4,
    };

    // null, 'up', 'down', 'left', 'right'
    this.scrolling = null;
    this.mirroring = HORIZONTAL;

    this.sprites = {};
    this.mapIndicator = {
      sprite: null,
      x: 0,
      y: 0,
      visible: true
    };

    this.hud = new Hud();

    this.player = {
      maxHearts: 3,
      health: 3*4,
      maxStamina: 3*4,
      stamina: 12,
      staminaClock: 0,
      staminaRates: {
        recharge: 120,
        dash: 30,
        swim: 60
      },
      speedWalking: 20,
      speedDash: 32,
      speedSwimming: 8,
      rupees: 255,
      keys: 1,
      bombs: 0,
      dead: false
    };
  }

  load () {
    enableCommonBackground(false);
    this.setBgPalettes();

    setSpritePalette(0, palettes.brownTanGreen); // link
    setSpritePalette(1, palettes.blues); // bomb
    setSpritePalette(2, palettes.blueRedWhite); // 
    // setSpritePalette(3, black, blue, gray, white); // 

    this.mirroring = HORIZONTAL;
    setMirroring(HORIZONTAL);

    // start in top-left corner?
    const { x, y } = this.position;
    drawArea(x, y, 0, 3);

    this.hud.load();

    const link = Link.create();
    link.pos = SubPixels.fromPixels(64, 64);
    link.palette = 0;
    this.link = link;

    Link.draw(link);
  }

  setBgPalettes() {
    setBgPalette(0, palettes.grassAndWater);
    setBgPalette(1, palettes.grassAndDirt);
    setBgPalette(2, palettes.grays);
  }

  unload () {

  }

  onScanline (y) {
    // draw hud
    if (y === 0) {
      // draw one row of black tiles from the bottom,
      // and 1 column of tiles from the right side, of the hud
      setScroll(0, 32);
      setMirroring(HORIZONTAL);
      this.hud.setPalettes();
    } else if (y === 8) {
      // set scroll-y to -8 to center the hud
      setScroll(-16, -8);
    } else if (y === 48) {
      // set the scroll and mirror mode back to normal
      setMirroring(this.mirroring);
      setScroll(this.scroll.x, this.scroll.y);
      // set the camera palettes
      this.setBgPalettes();
    }
  }

  setMirrorMode(mode) {
    setMirroring(mode);
    this.mirroring = mode;
  }

  update () {
    const { hud, scrolling, player, position } = this;
    
    if (player.dead) return;

    if (scrolling) {
      this.doScroll();
    }
    
    this.updateLink();
    hud.update(player, position);
  }

  updateLink () {
    const { link, scrolling, player } = this;
    let { direction, frame, dying, dead } = link;

    if (dead && frame >= 64+32){
      this.removeLink();
      return;
    };

    link.frame = (frame+1) % 256;
    link.moving = scrolling;
    link.lastDirection = direction;

    if (!dying && !scrolling) {
      this.checkInputs();

      link.speed = this.getSpeed();

      // use or regain stamina
      this.updateStamina();
    }

    if (dying && frame === 128) {
      link.dead = true;
      link.frame = 0;
    }
    
    Link.draw(link);
  }

  removeLink() {
    const { link, player } = this;
    Link.remove(link);
    player.dead = true;
  }

  getSpeed() {
    const { link, player } = this;
    const { moving, swimming, dashing } = link;
    const { speedSwimming, speedWalking, speedDash } = player;
    if (swimming) return speedSwimming;
    if (dashing) return speedDash;
    return speedWalking;
  }

  updateStamina() {
    const { link, player } = this;
    const { health, stamina, maxStamina, staminaRates } = player;
    const { swimming, moving, frame } = link;

    link.drowning = false;

    // swimming
    if (swimming && stamina > 0) {
      if (this.staminaUsageElapsed(staminaRates.swim)) {
        player.stamina -= 1;
      }
    // drowning
    } else if (swimming && stamina === 0 && health > 0) {
      link.drowning = (frame % 128) < 64;
      if (this.staminaUsageElapsed(staminaRates.swim)) {
        this.takeDamage(2);
      }
    // idle
    } else if (!swimming && stamina < maxStamina) {
      const rate = moving ? staminaRates.recharge : staminaRates.recharge/2;
      if (this.staminaUsageElapsed(rate)) {
        player.stamina += 1;
      }
    }
  }

  staminaUsageElapsed(rate) {
    const { player } = this;
    player.staminaClock += 1;
    if (player.staminaClock >= rate) {
      player.staminaClock = 0;
      return true;
    }
    return false;
  }

  takeDamage(amount) {
    const { player } = this;
    const { health, stamina } = this.player;
    player.health -= amount;
    if (player.health < 0) player.health = 0;
    if (player.health === 0) {
      this.die();
    }
  }

  die() {
    // animation
    // end screen
    const { link } = this;
    link.frame = 1;
    link.dead = false;
    link.dying = true;
  }

  checkInputs() {
    const { link, scrolling, player } = this;
    const canMove = !scrolling;

    if (isPressed(buttons.UP)) {
      link.direction = dir.UP;
      this.tryMoveLink();
    } else if (isPressed(buttons.DOWN)) {
      link.direction = dir.DOWN;
      this.tryMoveLink();
    } else if (isPressed(buttons.RIGHT)) {
      link.direction = dir.RIGHT;
      this.tryMoveLink();
    } else if (isPressed(buttons.LEFT)) {
      link.direction = dir.LEFT;
      this.tryMoveLink();
    }

    
  }

  tryMoveLink() {
    const { link, scrolling, player } = this;
    const  { direction, speed, drowning } = link;
    
    if (scrolling) return;
    if (drowning) return;

    link.moving = true;

    const [dx, dy, e1x, e1y, e2x, e2y] = [
      [0, -speed, 0, 8, 15, 8], // UP
      [0, speed, 0, 16, 15, 16], // DOWN
      [-speed, 0, 0, 8, 0, 15], // LEFT
      [speed, 0, 16, 8, 16, 15]  // RIGHT
    ][direction];

    this.coerceLink();
    const newPos = link.pos.add(dx, dy);
    const { x, y } = newPos.toPixels();

    // collisions
    const e1 = this.screenToElevation(x + e1x, y + e1y);
    const e2 = this.screenToElevation(x + e2x, y + e2y);
    if (isSolid(e1) || isSolid(e2)) {
      // push back to a tile edge?
      return;
    }

    // move
    link.pos = newPos;

    // check for water
    const left = link.pos.addPixels(0, 8).toPixels();
    const right = link.pos.addPixels(15, 8).toPixels();
    const { x: leftx, y: lefty } = this.screenToWorld(left); // world tile
    const { x: rightx, y: righty } = this.screenToWorld(right); // world tile
    const lefte = elevation(leftx, lefty);
    const righte = elevation(rightx, righty);
    const swimming = isWater(lefte) && isWater(righte);
    if (link.swimming != swimming) {
      player.staminaClock = 0;
    }
    link.swimming = swimming;

    // scroll at the edge of the screen
    this.checkScreenWrap();
  }

  checkScreenWrap() {
    const { link } = this;
    const { direction } = link;
    const { x, y } = link.pos.toPixels();
    const top = 48;
    const bottom = 240-16;
    const left = 0;
    const right = 256-16;

    if (y < top && direction === dir.UP) {
      link.pos.setPixelY(top);
      this.scrollUp()
    } else if (y > bottom && direction === dir.DOWN) {
      link.pos.setPixelY(bottom);
      this.scrollDown();
    } else if (x < left && direction === dir.LEFT) {
      link.pos.setPixelX(left);
      this.scrollLeft()
    } else if (x > right && direction === dir.RIGHT) {
      link.pos.setPixelX(right);
      this.scrollRight()
    }
  }
  
  coerceLink() {
    const { link } = this;
    const { direction, lastDirection, pos } = link;
    const { x, y } = pos.toPixels();

    if (link.moving) {
      // coerce alignment to half-blocks (8 pixels)
      if (direction === dir.UP || direction === dir.DOWN) {
        if (x % 8 > 0) {
          const min = lastDirection === dir.LEFT ? 4 : 3;
          const dx = (x % 8) < min ? -1 : 1;
          link.pos = pos.addPixels(dx, 0);
        }
      } else {
        if (y % 8 > 0) {
          const min = lastDirection === dir.UP ? 4 : 3;
          const dy = (y % 8) < min ? -1 : 1;
          link.pos = pos.addPixels(0, dy);
        }
      }
    }
  }

  doScroll() {
    const scrollAmt = 4;
    const { scroll, scrolling, link } = this;
    const { x, y } = link.pos.toPixels();

    const top = 48;
    const left = 0;
    const right = 256-16;
    const bottom = 240-16;

    // left to right: 256/4 = 64 frames
    // link needs to move from x:240 to x:0 in 64 frames = 3.75 px/frame = 60 spx
    const dspx = 60;

    // top to bottom: 192/4 = 48 frames
    // link needs to move from y:48 to y:224 in 48 frames. 3.66 px/frame = 59 spx
    const dspy = 59;

    switch (scrolling) {
      case 'down':
        this.scroll.y += scrollAmt;
        if (y > top) {
          link.pos = link.pos.add(0, -dspy);
        }
        // finished scrolling?
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
        if (x > left) {
          link.pos = link.pos.add(-dspx, 0);
        }
        // finished scrolling?
        if (this.scroll.x === 16*16) {
          // copy to first nametable
          // could optimize by drawing rows as we scroll?
          drawArea(this.position.x, this.position.y, 0, 3);
          // and reset the scroll to 0,0
          this.scroll.x = 0;
          this.scrolling = null;
          this.setMirrorMode(HORIZONTAL);
        }
        break;
      case 'up':
        this.scroll.y -= scrollAmt;
        if (y < bottom) {
          link.pos = link.pos.add(0, dspy);
        }
        // finished scrolling?
        if (this.scroll.y === 0) {
          this.scrolling = null;
        }
        break;
      case 'left':
        this.scroll.x -= scrollAmt;
        if (x < right) {
          link.pos = link.pos.add(dspx, 0);
        }
        // finished scrolling?
        if (this.scroll.x === 0) {
          this.scrolling = null;
          this.setMirrorMode(HORIZONTAL);
        }
        break;
    }
    setScroll(scroll.x, scroll.y);
  }

  scrollDown () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(HORIZONTAL);
    // load next screen below
    drawArea(posx, posy + 12, 0, 15);
    this.position.y += 12;
    this.scrolling = 'down';
  }

  scrollRight () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(VERTICAL);
    // load next screen to the right
    drawArea(posx + 16, posy, 16, 3);
    this.position.x += 16;
    this.scrolling = 'right';
  }

  scrollUp () {
    const { position } = this;
    const { x: posx, y: posy } = position;

    this.setMirrorMode(HORIZONTAL);
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

    this.setMirrorMode(VERTICAL);
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

  /**
   * converts sprite position to world position in blocks
   * @param {*} spritePos screen position in pixels
   * @param {*} pos world position offset
   */
  screenToWorld({ x, y }) {
    const { position } = this;
    const { x: posx, y: posy } = position;
    const i = (x>>4); // px to block
    const j = (y>>4) - 3; // exclude hud
    return {
      x: posx + i,
      y: posy + j
    }
  };

  /**
   * gets the tile for a given pixel position 
   */
  screenToNametable(x, y) {
    const i = (x>>3);
    const j = (y>>3);
    return getNametable(i, j);
  }

  screenToElevation(x, y) {
    const { x: posx, y: posy } = this.screenToWorld({ x, y });
    return elevation(posx, posy);
  }

}