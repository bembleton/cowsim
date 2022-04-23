import { bbox } from "../../boundingBox";
import { frameIndex, SubPixels } from "./utils";
import { Direction } from "./direction";
import SPRITES from './data/sprites';
import { MetaSprite } from "../../spriteManager";
import drops from './drops';
import { choice, rand } from "../../random";
import { Sfx } from "./sound";

const dropsById = {
  0: drops.Rupee,
  1: drops.Rupee5,
  2: drops.Rupee50,
  3: drops.Heart,
  4: drops.Fairy,
  5: drops.StaminaVial,
  6: drops.Bomb,
  7: drops.Hourglass
};

const dropTables = {
  A: [0,3,0,4,0,3,3,0,0,3],
  B: [6,0,7,0,3,6,0,6,3,3],
  C: [0,3,0,1,3,7,0,0,0,1],
  D: [3,4,0,3,4,3,3,3,0,3],
  forced: [4,4,6,6,6,2]
};

const dropChances = {
  A: 0.31,
  B: 0.41,
  C: 0.59,
  D: 0.41
};

export class Enemy {
  static state = {
    idle: 'idle',
    moving: 'moving',
    knockedback: 'knockedback',
    stunned: 'stunned',
    dead: 'dead'
  };

  constructor(x, y, dir, spriteData, palette, health, meleeDamage, dropGroup, width = 2, height = 2) {
    this.pos = SubPixels.fromPixels(x, y);
    this.bbox = new bbox(x, y, width*8, height*8);

    this.frame = 0;
    this.state = Enemy.state.idle;
    this.stateTimer = 0; // frames to next state
    this.dir = dir;
    this.damageTimer = 0; // palette cycling
    this.disposed = false;

    this.health = health;
    this.meleeDamage = meleeDamage;
    this.dropGroup = dropGroup;
    this.canBeKnockedBack = false;

    const sprite = Enemy.getSpriteFromState(spriteData, dir, this.frame);

    // add missing height and width
    this.sprite = new MetaSprite({ x, y, height, width, ...sprite });
    this.spriteData = spriteData;
    this.palette = palette;
  }

  draw() {
    this.sprite.draw();
  }

  update(canMove, game, player) {
    this.frame = (this.frame+1) % 256;
    if (this.damageTimer > 0) this.damageTimer--;

    if (this.state === Enemy.state.dead) {
      // drop something
      if (this.damageTimer > 0) {
        // death blink
        const frame = this.damageTimer > 8 ? 0 : 1;
        const sprite = SPRITES.death_blink[frame];
        const palette = this.frame % 4;
        this.sprite.update({ palette, sprite }); // mirroring??
      } else {
        this.spawnDrop(game);
        this.dispose();
      }
    } else {
      if (canMove) {
        this.stateTimer && this.stateTimer--;
        this.updateState(game, player);
      }
      const { x, y } = this.pos.toPixels();
      this.bbox.x = x;
      this.bbox.y = y;
      this.updateSprite();
    }
  }

  //abstract
  updateState() {
  }

  updateSprite() {
    const { spriteData, dir, damageTimer, frame } = this;
    const { x, y } = this.pos.toPixels();
    
    const palette = damageTimer > 0 ? frameIndex(frame, 2, 4) : this.palette;
    const sprite = Enemy.getSpriteFromState(spriteData, dir, frame);
    this.sprite.update({ x, y, ...sprite, palette });

    // SPRITES.enemies.moblin[left] || SPRITES.enemies.moblin[right]
    // const sprites = spriteData[dir] || spriteData[Direction.flipped[dir]];
    // if (sprites === undefined) console.log(this);
    // const singleFrame = !sprites.length;
    // const frame = frameIndex(this.frame, 16); // 0 or 1
    // const sprite = singleFrame ? sprites : sprites[frame];
    
    // const vertical = (dir === Direction.up || dir === Direction.down);
    // const flipX = (!vertical && !spriteData[dir]) || (vertical && singleFrame && !!frame);
    // const flipY = (vertical && !spriteData[dir]) || (!vertical && singleFrame && !!frame);
  }

  //abstract
  spawnDrop(game) {
    // drop table
    let dropGroup = this.dropGroup;

    if (!game.forceDrop) {
      const chance = dropChances[dropGroup] || 0;
      const roll = rand();
      console.log(`Rolling for drop: ${roll} / ${chance}`);
      if (roll > chance) return;
      
    } else {
      console.debug(`Forced drop...`);
      dropGroup = 'forced';
      game.resetKillCounter();
    }

    const { x, y } = this.pos.toPixels();
    const dropClass = dropsById[ choice(dropTables[dropGroup]) ];
    const drop = new dropClass(x, y);
    game.spawnDrop(drop);
  }
  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }
  onCollision(player, game) {
    player.takeDamage(this.meleeDamage, game);
  }
  takeDamage(damage, fromPos, game) {
    if (this.state === Enemy.state.dead) return;
    if (this.damageTimer > 0) return; // already hurt
    
    this.health -= damage;
    if (this.health <= 0)  {
      this.die();
      game.soundEngine.play(Sfx.kill);
      game.incrementKillCounter();
    } else {
      // dont take damage again for 48 frames
      this.damageTimer = 48;
      if (this.canBeKnockedBack) {
        this.knockback(fromPos);
        game.soundEngine.play(Sfx.stun);
      }
    }
  }
  knockback(fromPos) {
    const towardsForce = new SubPixels(fromPos.x, fromPos.y).subtract(this.bbox.center());
    const dir = towardsForce.toDirection();
    const { x, y } = this.pos.toPixels();
    const yAligned = (dir === Direction.up || dir === Direction.Down) && (x % 16) === 0;
    const xAligned = (dir === Direction.left || dir === Direction.right) && (y % 16) === 0;

    // if the enemy is not aligned on a grid in the direction of the force, do nothing
    if (!yAligned && !xAligned) return;

    // face the attack
    this.dir = dir;
    this.pos = SubPixels.fromPixels(x & ~1, y & ~1); // align to the nearest even pixel
    this.state = Enemy.state.knockedback;
    this.stateTimer = 16;

  }
  die() {
    //poof
    this.state = Enemy.state.dead;
    const { x, y } = this.pos.toPixels();
    this.sprite.dispose();
    this.sprite = new MetaSprite({ sprite: SPRITES.death_blink[0], x, y, mirrorX: true, mirrorY: true });
    this.sprite.draw();
    // wait for drop
    this.damageTimer = 16;
  }

  static getSpriteFromState(spriteData, dir, frame) {
    const flipped = spriteData[dir] === undefined;
    const sprites = !flipped ? spriteData[dir] : spriteData[Direction.flipped[dir]];
    const singleFrame = !sprites.length;
    const even = frameIndex(frame, 16); // 0 or 1
    const sprite = singleFrame ? sprites : sprites[even];
    
    // sprite can be a number or a sprite object
    const vertical = Direction.isVertical(dir);
    let flipX, flipY;
    
    const { mirrorX, mirrorY } = sprite;
    if (!mirrorX) {
      flipX = (!vertical && flipped) || (vertical && singleFrame && even);
    }
    if (!mirrorY) {
      flipY = (vertical && flipped) || (!vertical && singleFrame && even);
    }
  
    if (isNaN(sprite)) {
      return { ...sprite, flipX, flipY };
    } else {
      return { sprite, flipX, flipY };
    }
  }
}