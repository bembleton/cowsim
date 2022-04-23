import ppu from '~/ppu';
import Animation from '~/animation';
import spriteManager from '~/spriteManager';
import { isPressed, buttons } from '~/controller';
import { randInt, choice, Randy } from '~/random';
import { palettes } from '../data/colors';
import SPRITES from '../data/sprites';
import { Link } from '../link';
import { pixelToTile, SubPixels } from '../utils';
//import { setSeed, drawArea, elevation, isSolid, isWater, isDesert, isGrass, randomPosition, getAreaTopLeft } from './terrain';
import Hud from './hud';
import { MetaSprite } from '../../../spriteManager';
import { Rupee } from '../rupee';
import { Bomb, BombObject } from '../bomb';
import { Inventory } from '../inventory';
import { Heart } from '../heart';
import { Fairy } from '../fairy';
import { HeartContainer } from '../heartContainer';
import { Hourglass } from '../hourglass';
import { StaminaVial } from '../staminaVial';
import { StaminaContainer } from '../staminaContainer';
import { Key } from '../key';
import { getRandomWeapon } from '../drop';
import { weaponDrop } from '../weaponDrop';
import { Direction } from '../direction';
import { Moblin } from '../moblin';
import { woodenSword } from '../sword';
import { Chest } from '../chest';
import { ObjectManager } from '../objectManager';
import { MeleeObject } from "../MeleeObject";
import { SwordBeam } from "../SwordBeam";
import { Biome, Terrain } from '../terrain';
import WorldGenerator, { World } from '../worldGenerator';
import { Sfx, Songs } from '../sound';
import { createEnemy, getEnemiesForBiome } from '../enemies';
import { AttackHelper } from './AttackHelper';
import { GameScreen } from './screen';

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


const creaturesByElevation = {
  0: [], // water
  1: [], // grass
  2: [], // grass
  3: [], // grass
  4: [], // sand
  5: [], // rock 
}


export default class OverworldScreen extends GameScreen {
  constructor (game) {
    super(game);

    this.player = {};
    this.position = {};
    
    this.hud = new Hud(game);

    this.attackHelper = new AttackHelper();

    this.mapIndicator = {
      sprite: null,
      x: 0,
      y: 0,
      visible: true
    };

    this.objectManager = new ObjectManager();
    this.soundEngine = game.soundEngine;

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

    this.recentBoards = [];
    this.treasures = [];
  }

  load () {
    const { game } = this;
    const { terrain, startingLocation } = game; 
    this.terrain = terrain;

    this.hud.load();

    enableCommonBackground(false);
    this.setBgPalettes();

    setSpritePalette(0, palettes.greenTanBrown); // link
    setSpritePalette(1, palettes.redGoldWhite);
    setSpritePalette(2, palettes.navyBlueWhite);
    setSpritePalette(3, palettes.redBlackBlue);

    this.mirroring = HORIZONTAL;
    setMirroring(HORIZONTAL);

    // start in top-left corner?
    const pos = startingLocation; //this.findStartingLocation();
    console.log(`starting position: ${pos.x}, ${pos.y}`)
    const { x, y } = terrain.getAreaTopLeft(pos.x, pos.y);
    console.log(`area topleft: ${x}, ${y}`)
    
    
    terrain.drawArea(x, y, 0, 3);
    this.setPosition(x, y);
    this.checkForOcean();

    //this.hud.setItemB({ sprite: SPRITES.bomb, palette: 2 });

    this.scroll = {
      x: 0,
      y: 0
    };

    // null, 'up', 'down', 'left', 'right'
    this.scrolling = null;
    
    this.frame = 0;
    this.stasisCounter = 0;

    // reset player state on load?
    // todo: player state should come from local storage
    this.player = {
      maxHearts: 3,
      health: 3*4,
      maxStamina: 3*4,
      stamina: 12,
      staminaClock: 0,
      staminaRates: { // frames per tick. less is faster
        recharge: 120,
        dash: 30,
        swim: 60,
        chargingSlash: 30
      },
      speedWalking: 20,
      speedDash: 32,
      speedSwimming: 8,
      rupees: 0,
      keys: 0,
      bombs: 0,
      maxBombs: 8,
      itemA: null, // sword
      itemB: null, // { type, sprite, palette }
      itemTimer: 0, // delay before using again
      inventory: new Inventory(),
      hurtTimer: 0, // delay before taking more damage
      //attackTimer: 0,
      //attackState: Attack.ready,
      dead: false,
      equipWeapon: this.equipWeapon.bind(this),
      takeDamage: this.takeDamage.bind(this),
      equipItem: this.equipItem.bind(this)
    };
    
    this.playerMeleeObject = null;
    this.playerProjectile = null;

    const link = new Link();
    const { x: px, y: py } = this.worldToScreen(pos);
    console.log(`link position: ${px}, ${py}`)
    link.pos = SubPixels.fromPixels(px, py);
    link.palette = 0;
    this.link = link;

    link.draw();

    this.attackHelper.load();

    this.recentBoards = [];
    this.treasures = {};
    this.resetKillCounter();

    const startingArea = World.getAreaId(pos.x, pos.y);
    this.spawnAreaMapEntity(startingArea);
    // const { type, x, y, ...rest } = mapEntities[startingArea];
    // const { x: tilex, y: tiley } = this.findAvailableScreenTile();
    // const startingWeapon = this.dropWeapon(0, 0, woodenSword);
    // this.spawnTreasure(tilex, tiley, startingWeapon);

    this.loading = true;
    this.loadingProgress = 120;
  }

  resetKillCounter() {
    this.killCounter = 0;
    this.forceDrop = false;
    console.debug(`KillCounter Reset`);
  }

  incrementKillCounter() {
    this.killCounter++;
    this.forceDrop = this.killCounter > 10;
    console.debug(`KillCounter: ${this.killCounter}.${this.forceDrop ? ' forceDrop: set' : ''}`);
  }

  spawnAreaMapEntity(areaId) {
    const entity = this.game.mapEntities[areaId];
    if (!entity) return;

    const { type, x, y } = entity;
    const { x: tilex, y: tiley } = this.worldToTile(x, y);

    switch (type) {
      case 'Chest': {
        // todo: handle contents
        // const { contents } = entity;
        const item = this.dropWeapon(0, 0, woodenSword);
        this.spawnTreasure(tilex, tiley, item);
      }
      // case 'Dungeon'
      // case 'Cave'
    }
  }

  setBgPalettes() {
    if (this.player.dead) {
      const level = this.gameOverTimer>>4;
      this.setBgGameOverPalettes(level);
    } else {
      setBgPalette(0, palettes.grassAndWater); // LGREEN, DGREEN, BLUE, LBLUE
      setBgPalette(1, palettes.grassAndDirt); // LGREEN, DGREEN, TAN, PINK
      setBgPalette(2, palettes.grays);  // TAN, BLACK, DGRAY, LGRAY
      // reserved
      // BLACK, X, X, WHITE  dialog box
    }
  }

  /** level: 0-3 where 0 is completely blacks */
  setBgGameOverPalettes(level) {
    const palette = [
      palettes.blacks1,
      palettes.blacks2,
      palettes.blacks3,
      palettes.blacks4,
    ][level];
    setBgPalette(0, palette);
    setBgPalette(1, palette);
    setBgPalette(2, palette);
    setBgPalette(3, palette);
  }

  unload () {
    this.soundEngine.clear();
    this.attackHelper.unload();
  }

  onScanline (y) {
    if (this.player.dead) return;

    const progress = this.loadingProgress;
    const loading = progress > 0;
    const isFirstVisibleLine = y === (loading ? progress : 0);
    const firstNonProgressLine = loading && y === progress;

    if (y < progress || y > 240-progress) {
      // draw black
      setScroll(0, 32-y);
      setMirroring(HORIZONTAL);
      return;
    }

    // set the correct palette for the first visible line of the hud and world
    if (isFirstVisibleLine && y < 48) {
      if (y < 8) {
        // draw one row of black tiles from the bottom of the hud
        // to mask the top part of the minimap
        setScroll(0, 32);
      } else {
        // first line between 8 and 48
        // set scroll-y to -8 to center the hud
        setScroll(0, -8);
      }
      setMirroring(HORIZONTAL);
      this.hud.setPalettes();
    }
    else if (y === 8) {
      // set scroll-y to -8 to center the hud
      setScroll(0, -8);
    }
    else if (isFirstVisibleLine || y === 48) {
      // set the scroll and mirror mode back to normal
      setMirroring(this.mirroring);
      setScroll(this.scroll.x, this.scroll.y);
      // set the camera palettes
      this.setBgPalettes();
    }
    
    if (y >= 48 && this.shimmer.count > 0 && !loading) {
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

  findAvailableScreenTile () {
    const { terrain, position: { x: posx, y: posy } } = this;

    const cols = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    for (let i=0; i<10; i++) {
      const xi = randInt(cols.length);
      const x = cols[xi] + posx;
      const y = randInt(1, 11) + posy;
      const e = terrain.elevation(x, y);
      if (!Terrain.isWater(e) && !Terrain.isSolid(e)) {
        return this.worldToTile(x, y);
      }
    }

    return null;
  }

  getBiome() {
    return this.terrain.getBiome(World.getAreaId(this.position.x, this.position.y))
  }

  checkForOcean() {
    const biome = this.getBiome();
    
    if (biome === Biome.water) {
      this.game.soundEngine.play(Sfx.ocean, true);
    }
  }

  spawnCreatures () {
    const { terrain, position: { x: posx, y: posy }, recentBoards } = this;

    const board = this.getBoardId();
    const { enemies = randInt(6) } = recentBoards.find(b => b.board === board) || {};
    if (enemies === 0) return;

    const cols = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    const areaId = World.getAreaId(posx, posy);
    const biome = this.terrain.getBiome(areaId);
    const enemyTypes = getEnemiesForBiome(biome);
    if (enemyTypes.length === 0) return;

    for (let i=0; i<enemies; i++) {
      const xi = randInt(cols.length);
      const x = cols[xi] + posx;
      const y = randInt(1, 11) + posy;
      const e = terrain.elevation(x, y);
      if (!Terrain.isWater(e) && !Terrain.isSolid(e)) {
        cols.splice(xi, 1); // avoid placing enemies in the same column
        const { x: px, y: py } = this.worldToScreen({x, y});
        const { type, palette } = choice(enemyTypes);
        this.spawnCreature(px, py, type, palette);
      }
    }
  }

  spawnCreature (px, py, type, palette) {
    const creature = createEnemy(type, px, py, { palette });
    creature.draw();
    this.objectManager.creatures.push(creature);
  }

  spawnTreasure (tilex, tiley, contents) {
    const { x, y } = this.tileToScreen(tilex, tiley);
    const chest = new Chest(x, y, contents);
    this.spawnDrop(chest);
    return chest;
  }

  spawnTreasures() {
    const { treasures } = this;
    const board = this.getBoardId();
    const drops = treasures[board];
    if (!drops) return;
    for (const drop of drops) {
      this.spawnDrop(drop);
    }
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
    console.log('spawning a', drop);
    drop.draw();
    this.objectManager.drops.push(drop);
    if (drop instanceof Fairy) {
      this.soundEngine.play(Sfx.fairy);
    }
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
    const drop = new weaponDrop(px, py, weapon, metaSprite);
    return drop;
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

  equipItem(item) {
    this.player.itemB = item.type;
    this.hud.setItemB(item);
  }

  freezeTime () {
    this.stasisCounter = 255;
  }

  update () {
    const { hud, scrolling, player, position, shimmer, frame, stasisCounter } = this;
    
    this.updateButtonStates();

    if (player.dead) {
      if (this.gameOverTimer) {
        this.gameOverTimer--;
        const level = this.gameOverTimer>>4;
        this.setBgGameOverPalettes(level);
        if (this.gameOverTimer === 0) {
          this.showGameOver();
        }
      }
      return;
    }

    if (this.loadingProgress > 0) this.loadingProgress -= 2;
    else if (this.loading) {
      // finished fading in
      this.loading = false;
      this.startMusic();
    }

    if (scrolling) {
      this.doScroll();
    }

    this.frame = (frame+1) % 256;
    if (stasisCounter > 0 && this.frame % 2 === 0) {
      this.stasisCounter--;
    }
    
    this.updateLink();
    this.objectManager.update(this);

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

    if (player.itemTimer) {
      this.updateItem();
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
    // if (link.attacking) {
    //   this.drawWeapon();
    // }
  }

  removeLink() {
    const { link, player } = this;
    link.dispose();
    player.dead = true;
    this.gameOverTimer = 63;
    this.objectManager.clear();
    this.hud.unload();
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
    const { chargingSlash, swimming, moving, frame } = link;

    link.drowning = false;

    // powering up a slash
    if (chargingSlash && stamina > 0) {
      if (this.staminaUsageElapsed(staminaRates.chargingSlash)) {
        player.stamina -= 1;
      }
    // swimming  
    } else if (swimming && stamina > 0) {
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
    } else {
      this.soundEngine.play(Sfx.hurt);
      if (player.health <= 4) {
        this.soundEngine.play(Sfx.heartBeat, true);
      }
    }

    this.resetKillCounter();
  }

  die() {
    // animation
    // end screen
    const { link } = this;
    link.frame = 0;
    link.dead = false;
    link.dying = true;
    this.objectManager.clear();
    this.soundEngine.clear();
    // death jingle
    this.soundEngine.play(Sfx.death);
  }

  showGameOver() {
    this.game.loadScreen(this.game.screens.gameOver);
  }

  startMusic(delay) {
    this.soundEngine.play(Songs.overworld, true);
    if (delay) {
      this.soundEngine.songs[Songs.overworld].pause(delay);
    }
  }

  /** not scrolling, not dying */
  checkInputs() {
    const { link, player } = this;

    if (this.loading) return;

    if (isPressed(buttons.START)) {
      // open menu
      return;
    }

    if (link.stunned) {
      this.tryMoveLink();
      return;
    }

    // attack states
    // 1. idle
    // 2. jab/charging
    // 3. slash/discharging/beam
    // 4. cooldown

    // attack transitions
    //   1. idle
    // 1-2. jab when A is pressed
    //   2. charge up to X
    //   2. flash sword when charge == X
    // 2-3. when A is released, if charge amount > X, perform a slash attack
    //   3. discharge for N frames when A is released
    //   3. if A is pressed again and health is max, perform a sword beam, cancel slash
    //   4. prevent attack for P frames

    // parry
    // slash attack can parry Octorok projectiles

    this.attackHelper.update(this);

    // if (isPressed(buttons.A) && link.canAttack && this.player.weapon) {
    //   if (!link.attacking) {
    //     this.soundEngine.play(Sfx.sword);
    //   }

    //   link.attacking = true; // this means the attack is charging
      
    //   if (link.attackFrame < 64) {
    //     link.attackFrame++;
    //   }
    //   return;
    // } else if (!isPressed(buttons.A) && link.canAttack && link.attackFrame > 0) {
    //   // start attacking and counting down
    //   link.canAttack = false;
    //   return;
    // }

    if (link.attacking) return;

    if (isPressed(buttons.B)) {
      this.useItem();
    }
    
    if (isPressed(buttons.UP)) {
      if (link.direction === (link.direction = Direction.up)) {
        this.tryMoveLink();
      }
    } else if (isPressed(buttons.DOWN)) {
      if (link.direction === (link.direction = Direction.down)) {
        this.tryMoveLink();
      }
    } else if (isPressed(buttons.RIGHT)) {
      if (link.direction === (link.direction = Direction.right)) {
        this.tryMoveLink();
      }
    } else if (isPressed(buttons.LEFT)) {
      if (link.direction === (link.direction = Direction.left)) {
        this.tryMoveLink();
      }
    }

    
  }

  useItem() {
    const { player, link } = this;
    const { itemTimer } = this;
    if (player.itemTimer > 0) return; // wait to use it again
    switch (player.itemB) {
      case 'bombs':
        if (player.bombs === 0) return;
        player.bombs--;
        player.itemTimer = 64; // place once a second
        link.direction

        // place a bomb in front of the player
        const pos = link.pos.toPixels();
        const { x, y } = SubPixels.fromDirection(link.direction, 16).add(pos).add(8, 8);
        const bomb = new BombObject({ x, y });
        bomb.draw();
        this.objectManager.projectiles.push(bomb);
        this.soundEngine.play(Sfx.bomb);
        break;
      case 'boomerang':

    }
  }

  updateItem() {
    if (this.player.itemTimer === 0) return;
    switch (this.player.itemB) {
      case 'bombs':
        this.player.itemTimer--;
        break;
      case 'boomerang':
        // wait for boomerang to return
        break;
    }
  }

  /** draws SPRITES.weapon using link's direction and position */
  drawWeapon() {
    const {
      pos, direction, attackFrame
    } = this.link;
    
    const { x: posx, y: posy } = pos.toPixels();
    // min and max jab position based on frame
    const offset = (attackFrame < 4) ? 3 : 12;
    // get sword position based on direction and offset
    // the x offset varies a few pixels between up and down
    const [x,y] = {
      'up': [posx+3, posy-offset],
      'down': [posx+5, posy+offset],
      'left': [posx-offset, posy+6],
      'right': [posx+offset, posy+6],
    }[direction];

    if (!this.playerMeleeObject || this.playerMeleeObject.disposed) {
      // make a new sprite
      const horiz = Direction.isHorizontal(direction);
      // const sprite1 = horiz ? SPRITES.weapon+17 : SPRITES.weapon;
      // const sprite2 = horiz ? SPRITES.weapon+1 : SPRITES.weapon+16;
      // const flipX = direction === Direction.left;
      // const flipY = direction === Direction.down;
      const width = horiz ? 16 : 8;
      const height = horiz ? 8 : 16;

      const { palette, attack: damage } = this.player.weapon;
      const sprite = MetaSprite.fromData(SPRITES.sword, direction, { x, y, palette });
      //const options = { palette, flipX, flipY, priority: false };

      // if (horiz) {
      //   this.link.weaponSprite = MetaSprite.Create16x8(x, y, sprite1, sprite2, options);
      // } else {
      //   this.link.weaponSprite = MetaSprite.Create8x16(x, y, sprite1, sprite2, options);
      // }

      this.playerMeleeObject = new MeleeObject({ sprite, x, y, width, height, isFriendly: true, damage });
      
      this.objectManager.projectiles.push(this.playerMeleeObject);
      this.playerMeleeObject.draw();

      if (this.player.health === this.player.maxHearts*4) {
        // sword beam
        if (!this.playerProjectile || this.playerProjectile.disposed) {
          this.playerProjectile = new SwordBeam({ x, y, direction, damage });
      
          this.objectManager.projectiles.push(this.playerProjectile);
          this.playerProjectile.draw();
        }
      }

    } else {
      // update pos
      this.playerMeleeObject.pos = SubPixels.fromPixels(x, y);
    }
  }

  tryMoveLink() {
    const { terrain, link, scrolling, player } = this;
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
    if (Terrain.isSolid(e1) || Terrain.isSolid(e2)) {
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
    const lefte = terrain.elevation(leftx, lefty);
    const righte = terrain.elevation(rightx, righty);
    const swimming = Terrain.isWater(lefte) && Terrain.isWater(righte);
    if (link.swimming != swimming) {
      player.staminaClock = 0;
    }
    link.swimming = swimming;

    // check climate
    this.shimmer.enabled = Terrain.isDesert(lefte);

    // scroll at the edge of the screen
    this.checkScreenWrap();
  }

  getBoardId() {
    const { position } = this;
    return World.getAreaId(position.x, position.y);
  }

  checkScreenWrap() {
    const { link, pos, recentBoards } = this;
    const { direction } = link;
    const { x, y } = link.pos.toPixels();
    const top = 48;
    const bottom = 240-16;
    const left = 0;
    const right = 256-16;

    const board = this.getBoardId();

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

    // save board state
    recentBoards.filter2(b => b.board !== board).push({
      board,
      enemies: this.objectManager.creatures.length
    });
    if (recentBoards.length > 8) recentBoards.shift();

    // save treasures
    if (this.objectManager.drops.length) {
      this.treasures[board] = [...this.objectManager.drops];
    } else {
      delete this.treasures[board];
    }

    // clear creatures and drops
    this.objectManager.clear();

    // stop the ocean sound if it's playing
    this.game.soundEngine.stop(Sfx.ocean);
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
    const { terrain, position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(HORIZONTAL);
    // load next screen below
    terrain.drawArea(posx, posy + 12, 0, 15);
    this.setPosition(posx, posy + 12);
    this.scrolling = 'down';
  }

  scrollRight () {
    const { terrain, position } = this;
    const { x: posx, y: posy } = position;
    
    this.setMirrorMode(VERTICAL);
    // load next screen to the right
    terrain.drawArea(posx + 16, posy, 16, 3);
    this.setPosition(posx + 16, posy);
    this.scrolling = 'right';
  }

  scrollUp () {
    const { terrain, position } = this;
    const { x: posx, y: posy } = position;

    this.setMirrorMode(HORIZONTAL);
    // copy current screen to the top portion of the lower page
    // todo: instead of rerendering, just copy nametable and attributes
    terrain.drawArea(posx, posy, 0, 15);
    
    // set view to lower page
    this.scroll.y = 12*16;
    setScroll(0, 12*16);

    // load next screen above
    // could optimize by drawing rows as we scroll?
    terrain.drawArea(posx, posy - 12, 0, 3);
    this.setPosition(posx, posy - 12);
    this.scrolling = 'up';
  }

  scrollLeft () {
    const { terrain, position } = this;
    const { x: posx, y: posy } = position;

    this.setMirrorMode(VERTICAL);
    // copy current screen to the right
    terrain.drawArea(posx, posy, 16, 3);
    this.scroll.x = 16*16;
    setScroll(256, 0);

    // load next screen on the left
    // could optimize by drawing rows as we scroll?
    terrain.drawArea(posx - 16, posy, 0, 3);
    this.setPosition(posx - 16, posy);
    this.scrolling = 'left';
  }

  finishScolling () {
    this.scrolling = null;
    this.setMirrorMode(HORIZONTAL);
    if (this.scroll.x > 0 || this.scroll.y > 0) {
      // copy to first nametable
      this.terrain.drawArea(this.position.x, this.position.y, 0, 3);
      this.scroll.x = 0;
      this.scroll.y = 0;
      this.setMirrorMode(HORIZONTAL);
    }

    this.spawnCreatures();
    this.spawnTreasures();

    // ocean?
    console.log(`loaded screen: (${this.position.x/16}, ${this.position.y/12})`);
    this.checkForOcean();
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
    return this.terrain.elevation(posx, posy);
  }

  isPassableTile(tilex, tiley, game) {
    const { x: wx, y: wy } = this.tileToWorld(tilex, tiley);
    const e = this.terrain.elevation(wx, wy);
    return !Terrain.isWater(e) && !Terrain.isSolid(e);
  }

}