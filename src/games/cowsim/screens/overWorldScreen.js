import ppu from '~/ppu';
import Animation from '~/animation';
import spriteManager from '~/spriteManager';
import { isPressed, buttons } from '~/controller';
import { randInt, choice, Randy } from '~/random';
import { palettes } from '../data/colors';
import SPRITES from '../data/sprites';
import { Link } from '../link';
import { pixelToTile, SubPixels } from '../utils';
import { setSeed, drawArea, elevation, isSolid, isWater, isDesert, isGrass, randomPosition, getAreaTopLeft } from './terrain';
import Hud from './hud';
import { MetaSprite } from '../../../spriteManager';
import { Rupee } from '../rupee';
import { Bomb } from '../bomb';
import { Inventory } from '../inventory';
import { Heart } from '../heart';
import { Fairy } from '../fairy';
import { HeartContainer } from '../heartContainer';
import { Hourglass } from '../hourglass';
import { StaminaVial } from '../staminaVial';
import { StaminaContainer } from '../staminaContainer';
import { Key } from '../key';
import { getRandomWeapon } from '../drop';
import { Weapon } from '../Weapon';
import { Direction } from '../direction';
import { Moblin } from '../moblin';
import { woodenSword } from '../sword';
import { Chest } from '../chest';

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
    // the full map is 16 screens wide (16x16 = 256 blocks wide)
    // and 16 screens tall (16x12 = 192 blocks tall)
    this.position = {
      x: 16 * 16/2,
      y: 12 * 16/2,
    };

    // null, 'up', 'down', 'left', 'right'
    this.scrolling = null;
    this.mirroring = HORIZONTAL;

    this.mapIndicator = {
      sprite: null,
      x: 0,
      y: 0,
      visible: true
    };

    this.hud = new Hud();

    this.frame = 0;
    this.stasisCounter = 0;

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
      rupees: 0,
      keys: 0,
      bombs: 0,
      maxBombs: 8,
      itemA: null, // sword
      itemB: null, // 
      inventory: new Inventory(),
      hurtTimer: 0,
      dead: false,
      equipWeapon: this.equipWeapon.bind(this),
      takeDamage: this.takeDamage.bind(this)
    };

    this.creatures = [];
    this.drops = [];

    // support for 2 dynamic 8x16 sprites
    this.treasureDropSprites = [
      new MetaSprite().add(0xf0, 0, 0).add(0xf1, 0, 8),
      new MetaSprite().add(0xf2, 0, 0).add(0xf3, 0, 8),
    ];

    const shimmerAnimation = new Animation({
      frameskip: 2,
      framecount: 32,
      update: (f) => {
        let { enabled, count, maxCount } = this.shimmer;
        this.shimmer.frame = f;
        if (enabled && count < maxCount) {
          this.shimmer.count++;
        }
        else if (!enabled && count > 0) {
          this.shimmer.count -= 4;
        }
      }
    });
    
    this.shimmer = {
      enabled: false,
      frame: 0, // 0-31
      count: 0, // 0-511
      maxCount: 128*4,
      maxAmount: 2.5,
      update: shimmerAnimation.update.bind(shimmerAnimation)
    };
  }

  load () {
    enableCommonBackground(false);
    this.setBgPalettes();

    setSpritePalette(0, palettes.greenTanBrown); // link
    setSpritePalette(1, palettes.redGoldWhite);
    setSpritePalette(2, palettes.navyBlueWhite);
    setSpritePalette(3, palettes.redBlackBlue);

    this.mirroring = HORIZONTAL;
    setMirroring(HORIZONTAL);

    // start in top-left corner?
    const pos = this.findStartingLocation();
    console.log(`starting position: ${pos.x}, ${pos.y}`)
    const { x, y } = getAreaTopLeft(pos.x, pos.y);
    console.log(`area topleft: ${x}, ${y}`)
    drawArea(x, y, 0, 3);
    this.setPosition(x, y);
    this.hud.load();
    this.hud.setItemB({ sprite: SPRITES.bomb, palette: 2 });

    const link = new Link();
    const { x: px, y: py } = this.worldToScreen(pos);
    console.log(`link position: ${px}, ${py}`)
    link.pos = SubPixels.fromPixels(px, py);
    link.palette = 0;
    this.link = link;

    link.draw();

    const { x: tilex, y: tiley } = this.findAvailableScreenTile();
    const startingWeapon = this.dropWeapon(0, 0, woodenSword);
    this.spawnTreasure(tilex, tiley, startingWeapon);
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
      // draw one row of black tiles from the bottom of the hud
      // to mask the top part of the minimap
      setScroll(0, 32);
      setMirroring(HORIZONTAL);
      this.hud.setPalettes();
    } else if (y === 8) {
      // set scroll-y to -8 to center the hud
      setScroll(0, -8);
    } else if (y === 48) {
      // set the scroll and mirror mode back to normal
      setMirroring(this.mirroring);
      setScroll(this.scroll.x, this.scroll.y);
      // set the camera palettes
      this.setBgPalettes();
    }
    
    if (y >= 48 && this.shimmer.count > 0) {
      const { frame, count, maxCount, maxAmount } = this.shimmer;
      const amount = ((count > 127 ? count : 0)/maxCount) * maxAmount;
      const dx = Math.floor(Math.sin( Math.PI * 2 *(y + frame) / 32 ) * amount);
      setScroll(this.scroll.x + dx, this.scroll.y);
    }
  }

  setMirrorMode(mode) {
    setMirroring(mode);
    this.mirroring = mode;
  }

  findStartingLocation () {
    while (true) {
      let pos = randomPosition();
      let e = elevation(pos.x, pos.y);
      if (isGrass(e)) return pos;
    }
  }

  findAvailableScreenTile () {
    const { position: { x: posx, y: posy } } = this;

    const cols = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    for (let i=0; i<10; i++) {
      const xi = randInt(cols.length);
      const x = cols[xi] + posx;
      const y = randInt(1, 11) + posy;
      const e = elevation(x, y);
      if (!isWater(e) && !isSolid(e)) {
        return this.worldToTile(x, y);
      }
    }

    return null;
  }

  spawnCreatures () {
    const { position: { x: posx, y: posy } } = this;
    // spawn 3 to 8 creatures
    const toSpawn = randInt(3,7);
    const cols = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    for (let i=0; i<toSpawn; i++) {
      const xi = randInt(cols.length);
      const x = cols[xi] + posx;
      const y = randInt(1, 11) + posy;
      const e = elevation(x, y);
      if (!isWater(e) && !isSolid(e)) {
        cols.splice(xi, 1);
        const { x: px, y: py } = this.worldToScreen({x, y});
        this.spawnCreature(px, py)
      }
    }
  }

  spawnCreature (px, py) {
    const type = choice('moblin');
    console.log(`spawning a ${type} at ${px}, ${py}`)

    let creature;
    switch (type) {
      case 'moblin':
        creature = new Moblin(px, py, { dir: Direction.down, palette: choice(1,2,3) });
        break;
    }
    creature.draw();
    this.creatures.push(creature);
  }

  spawnTreasure (tilex, tiley, contents) {
    const { x, y } = this.tileToScreen(tilex, tiley);
    const drop = new Chest(x, y, contents);
    drop.draw();
    this.drops.push(drop);
  }

  getRandomDrop (px, py) {
    const type = choice('rupee', 'bomb', 'heart', 'staminaVial', 'fairy', 'heartContainer', 'staminaContainer', 'hourglass', 'key', 'weapon');
    let drop;
    switch (type) {
      case 'rupee':
        drop = new Rupee(px, py, choice(1, 5, 50));
        break;
      case 'bomb':
        drop = new Bomb(px, py);
        break;
      case 'heart':
        drop = new Heart(px, py);
        break;
      case 'staminaVial':
        drop = new StaminaVial(px, py);
        break;
      case 'staminaContainer':
        drop = new StaminaContainer(px, py);
        break;
      case 'fairy':
        drop = new Fairy(px, py);
        break;
      case 'heartContainer':
        drop = new HeartContainer(px, py);
        break;
      case 'hourglass':
        drop = new Hourglass(px, px);
        break;
      case 'key':
        drop = new Key(px, px);
        break;
      case 'weapon':
        drop = this.dropWeapon(px, py);
        break;
    }
    return drop;
  }

  spawnDrop (drop) {
    drop.draw();
    this.drops.push(drop);
  }

  dropWeapon (px, py, weapon = null) {
    weapon = weapon || getRandomWeapon();
    console.log('weapon', weapon);
    const { sprites, palette } = weapon;
    // sprites indexes are in items.bmp
    // copy the sprite into the dynamic weapon drop slot in the spritesheet
    spriteManager.loadExtendedSprite(this.game.spriteSheets.items, sprites[0], 0xf0);
    spriteManager.loadExtendedSprite(this.game.spriteSheets.items, sprites[1], 0xf1);

    const metaSprite = this.treasureDropSprites[0];
    console.log(metaSprite);
    metaSprite.update({ x: px, y: py, palette });
    const drop = new Weapon(px, py, weapon, metaSprite);
    return drop;
  }

  clearCreatures (...creatures) {
    (creatures.length ? creatures : this.creatures).forEach(x => x.dispose());
    this.creatures = [];
  }

  clearDrops (...drops) {
    (drops.length ? drops : this.drops).forEach(x => x.dispose());
    this.drops = [];
  }

  equipWeapon (weapon) {
    const { sprites, palette } = weapon;
    // copy the sprite into the dynamic weapon drop slot in the spritesheet
    spriteManager.loadExtendedSprite(this.game.spriteSheets.items, sprites[0], SPRITES.weapon);
    spriteManager.loadExtendedSprite(this.game.spriteSheets.items, sprites[1], SPRITES.weapon + 16);
    spriteManager.loadExtendedSprite(this.game.spriteSheets.items, sprites[0] + 1, SPRITES.weapon + 1);
    spriteManager.loadExtendedSprite(this.game.spriteSheets.items, sprites[1] + 1, SPRITES.weapon + 17);

    this.player.weapon = weapon;
    this.hud.setItemA(weapon)
  }

  freezeTime () {
    this.stasisCounter = 255;
  }

  update () {
    const { hud, scrolling, player, position, shimmer, frame, stasisCounter } = this;
    
    if (player.dead) return;

    if (scrolling) {
      this.doScroll();
    }

    this.frame = (frame+1) % 256;
    if (stasisCounter > 0 && this.frame % 2 === 0) {
      this.stasisCounter--;
    }
    
    this.updateLink();
    this.updateCreatures();
    this.updateDrops();
    // projectiles
    // enemies
    // drops
    // weapon

    hud.update(player);
    shimmer.update();
  }

  updateLink () {
    const { link, scrolling, player, stasisCounter } = this;
    let { direction, frame, dying, dead } = link;
    const { hurtTimer } = player;

    if (dead){
      this.removeLink();
      return;
    };

    if (hurtTimer) {
      player.hurtTimer--;
    }

    link.hurt = hurtTimer > 0;
    link.stunned = hurtTimer > 40;
    link.frame = (frame+1) % 256;
    link.moving = scrolling;
    link.lastDirection = direction;
    link.palette = stasisCounter > 0 ? stasisCounter % 4 : 0;

    // attack state
    if (!link.canAttack && link.attacking) {
      if (link.attackFrame > 0) {
        link.attackFrame--;
      } else {
        link.attacking = false;
        link.canAttack = true; // todo: cooldown
      }
    }

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
    
    link.draw();
  }

  updateCreatures() {
    const { creatures, player, stasisCounter } = this;
    const link = this.link.getBbox();
    const canMove = stasisCounter === 0;
    this.creatures = creatures.filter(c => {
      c.update(canMove, this, player);
      
      // projectile collisions
      // if (!c.disposed && c.bbox.intersects()) {

      // }

      if(!c.disposed && c.bbox.intersects(link)) {
        c.onCollision(player, this);
        
      }

      return !c.disposed;
    });
  }

  updateDrops() {
    const { drops, player, stasisCounter } = this;
    const link = this.link.getBbox();
    const canMove = stasisCounter === 0;
    for (let i=drops.length-1; i>=0; i--) {
      const d = drops[i];
      d.update(canMove, this);
      
      if(!d.disposed && d.bbox.intersects(link)) {
        d.onCollision(player, this);
        if (d.disposeOnCollision) d.dispose();
      }

      if (d.disposed) drops.splice(i, 1);
    }
  }

  removeLink() {
    const { link, player } = this;
    link.dispose();
    player.dead = true;
  }

  getSpeed() {
    const { link, player } = this;
    const { moving, swimming, dashing, stunned } = link;
    const { speedSwimming, speedWalking, speedDash } = player;
    if (stunned) return 64;
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
    const { hurtTimer } = this.player;
    if (hurtTimer > 0) return;
    player.hurtTimer = 48;

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
    link.frame = 0;
    link.dead = false;
    link.dying = true;
  }

  /** not scrolling, not dying */
  checkInputs() {
    const { link, player } = this;

    if (isPressed(buttons.START)) {
      // open menu
      return;
    }

    if (link.stunned) {
      this.tryMoveLink();
      return;
    }

    if (isPressed(buttons.A) && link.canAttack) {
      // if not attacking, and attackFrame == 0,
      // start powering up the attackFrame while A is pressed,
      // until attackFrame is X,
      // then set attacking to true,
      // and start counting attackFrame down
      link.attacking = true;
      if (link.attackFrame < 64) {
        link.attackFrame++;
      }
      return;
    } else if (!isPressed(buttons.A) && link.canAttack && link.attackFrame > 0) {
      // start attacking and counting down
      link.canAttack = false;
      return;
    }

    if (link.attacking) return;
    
    if (isPressed(buttons.UP)) {
      link.direction = Direction.up;
      this.tryMoveLink();
    } else if (isPressed(buttons.DOWN)) {
      link.direction = Direction.down;
      this.tryMoveLink();
    } else if (isPressed(buttons.RIGHT)) {
      link.direction = Direction.right;
      this.tryMoveLink();
    } else if (isPressed(buttons.LEFT)) {
      link.direction = Direction.left;
      this.tryMoveLink();
    }

    
  }

  tryMoveLink() {
    const { link, scrolling, player } = this;
    const  { drowning, stunned } = link;
    
    if (scrolling) return;
    if (drowning) return;

    link.moving = !stunned; // walk animation

    const speed = this.getSpeed();
    const direction = stunned ? Direction.flipped[link.direction] : link.direction;

    const [dx, dy, e1x, e1y, e2x, e2y] = {
      up:    [0,-speed, 0,8,  15,8], // UP
      down:  [0, speed, 0,16, 15,16], // DOWN
      left:  [-speed,0, 0,8,  0,15], // LEFT
      right: [speed, 0, 16,8, 16,15]  // RIGHT
    }[direction];

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
    // prevent knockback off the screen
    if (stunned) {
      if (x < 0) newPos.setPixelX(0);
      if (x > 240) newPos.setPixelX(240);
      if (y < 48) newPos.setPixelY(48);
      if (y > 224) newPos.setPixelY(224);
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

    // check climate
    this.shimmer.enabled = isDesert(lefte);

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

    if (y < top && direction === Direction.up) {
      link.pos.setPixelY(top);
      this.scrollUp()
    } else if (y > bottom && direction === Direction.down) {
      link.pos.setPixelY(bottom);
      this.scrollDown();
    } else if (x < left && direction === Direction.left) {
      link.pos.setPixelX(left);
      this.scrollLeft()
    } else if (x > right && direction === Direction.right) {
      link.pos.setPixelX(right);
      this.scrollRight()
    } else {
      return;
    }

    // clear creatures and drops
    this.clearCreatures();
    this.clearDrops();
  }
  
  coerceLink() {
    const { link } = this;
    const { direction, lastDirection, pos } = link;
    const { x, y } = pos.toPixels();

    if (link.moving) {
      // coerce alignment to half-blocks (8 pixels)
      if (direction === Direction.up || direction === Direction.down) {
        if (x % 8 > 0) {
          const min = lastDirection === Direction.LEFT ? 4 : 3;
          const dx = (x % 8) < min ? -1 : 1;
          link.pos = pos.addPixels(dx, 0);
        }
      } else {
        if (y % 8 > 0) {
          const min = lastDirection === Direction.up ? 4 : 3;
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
          this.finishScolling();
        }
        break;
      case 'right':
        this.scroll.x += scrollAmt;
        if (x > left) {
          link.pos = link.pos.add(-dspx, 0);
        }
        // finished scrolling?
        if (this.scroll.x === 16*16) {
          this.finishScolling();
        }
        break;
      case 'up':
        this.scroll.y -= scrollAmt;
        if (y < bottom) {
          link.pos = link.pos.add(0, dspy);
        }
        // finished scrolling?
        if (this.scroll.y === 0) {
          this.finishScolling();
        }
        break;
      case 'left':
        this.scroll.x -= scrollAmt;
        if (x < right) {
          link.pos = link.pos.add(dspx, 0);
        }
        // finished scrolling?
        if (this.scroll.x === 0) {
          this.finishScolling();
        }
        break;
    }
    setScroll(scroll.x, scroll.y);
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.hud.setPosition(x, y);
  }

  scrollDown () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(HORIZONTAL);
    // load next screen below
    drawArea(posx, posy + 12, 0, 15);
    this.setPosition(posx, posy + 12);
    this.scrolling = 'down';
  }

  scrollRight () {
    const { position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(VERTICAL);
    // load next screen to the right
    drawArea(posx + 16, posy, 16, 3);
    this.setPosition(posx + 16, posy);
    this.scrolling = 'right';
  }

  scrollUp () {
    const { position } = this;
    const { x: posx, y: posy } = position;

    this.setMirrorMode(HORIZONTAL);
    // copy current screen to the top portion of the lower page
    // todo: instead of rerendering, just copy nametable and attributes
    drawArea(posx, posy, 0, 15);
    
    // set view to lower page
    this.scroll.y = 12*16;
    setScroll(0, 12*16);

    // load next screen above
    // could optimize by drawing rows as we scroll?
    drawArea(posx, posy - 12, 0, 3);
    this.setPosition(posx, posy - 12);
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
    this.setPosition(posx - 16, posy);
    this.scrolling = 'left';
  }

  finishScolling () {
    this.scrolling = null;
    this.setMirrorMode(HORIZONTAL);
    if (this.scroll.x > 0 || this.scroll.y > 0) {
      // copy to first nametable
      drawArea(this.position.x, this.position.y, 0, 3);
      this.scroll.x = 0;
      this.scroll.y = 0;
      this.setMirrorMode(HORIZONTAL);
    }

    this.spawnCreatures();
  }

  /**
   * converts sprite position to world position in blocks
   * @param {*} spritePos screen position in pixels
   * @param {*} pos world position offset
   */
  screenToWorld({ x, y }) {
    const { x: tilex, y: tiley } = pixelToTile(x, y); // screen tiles
    return this.tileToWorld(tilex, tiley); // world position
  };

  tileToWorld(tilex, tiley) {
    const { position } = this;
    const { x: posx, y: posy } = position;
    return {
      x: posx + tilex,    // offset by the current screen position
      y: posy + tiley - 3 // ignore hud
    }
  }

  tileToScreen(tilex, tiley) {
    return {
      x: (tilex << 4),
      y: (tiley << 4)
    };
  }

  /** convert a world position to pixel coordinates */
  worldToScreen({ x, y }) {
    const { x: posx, y: posy } = this.position; // topleft tile
    const [tilex, tiley] = [x - posx, y - posy + 3];
    return {
      x: (tilex << 4),
      y: (tiley << 4)
    };
  }

  worldToTile(x, y) {
    const { position } = this;
    const { x: posx, y: posy } = position;
    return {
      x: x - posx,    // offset by the current screen position
      y: y - posy + 3 // ignore hud
    }
  }

  /**
   * gets the 8x8 tile for a given pixel position 
   */
  screenToNametable(x, y) {
    const i = (x>>3);
    const j = (y>>3);
    return getNametable(i, j);
  }

  /** gets elevation at a pixel coordinate */
  screenToElevation(x, y) {
    const { x: posx, y: posy } = this.screenToWorld({ x, y });
    return elevation(posx, posy);
  }

  isPassableTile(tilex, tiley, game) {
    const { x: wx, y: wy } = this.tileToWorld(tilex, tiley);
    const e = elevation(wx, wy);
    return !isWater(e) && !isSolid(e);
  }

}