import { bbox } from "../../boundingBox";
import { frameIndex, SubPixels } from "./utils";
import { Direction } from "./direction";
import SPRITES from './data/sprites';
import { MetaSprite } from "../../spriteManager";
import drops from './drops';
import { choice, rand } from "../../random";

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
  A: [0,0,0,0,5,5,3,3,3,4],
  B: [0,0,0,5,3,3,6,6,6,7],
  C: [0,0,0,0,5,3,3,1,1,7],
  D: [0,0,3,3,3,3,5,2,4,4]
};
const dropChances = {
  A: 0.31,
  B: 0.41,
  C: 0.59,
  D: 0.41
};

// each map screen uses 4 bits to describe which enemies to load
// screens with water will always spawn a zola unless it's a fairy screen
const enemyGroups = {
  0: 'octoroks_red',
  1: 'tektites_red',
  2: 'levers_and_peahats',
  3: 'octoroks_red_and_blue',
  4: 'levers_blue',
  5: 'levers_red',
  6: 'moblins_black',
  7: 'moblins_red_and_black',
  8: 'peahats',
  9: 'peahats_and_lynels',
  10: 'lynels_red',
  11: 'ghost', // custom
  12: 'lynels_blue',
  13: 'tektites_blue',
  14: 'none',  // custom
  15: 'custom' // based on screen type
};

export class Enemy {
  static state = {
    idle: 0,
    moving: 1,
    knockedback: 2,
    stunned: 3,
    dead: 4
  };

  constructor(x, y, dir, sprite, spriteData, palette, health, meleeDamage, dropGroup) {
    this.pos = SubPixels.fromPixels(x, y);
    this.bbox = new bbox(x, y, 16, 16);

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

    this.sprite = sprite;
    this.spriteData = spriteData;
    this.palette = palette;
    this.updateSprite();
  }
  draw() {
    this.sprite.draw();
  }
  update(canMove, game, player) {
    this.frame = (this.frame+1) % 256;
    if (this.damageTimer > 0) this.damageTimer--;
    // todo: flash when damaged?

    if (this.state === Enemy.state.dead) {
      // drop something
      if (this.damageTimer > 0) {
        // death blink
        const frame = this.damageTimer > 8 ? 0 : 1;
        const sprite = SPRITES.death_blink[frame];
        const palette = this.frame % 4;
        this.sprite.update({ palette, sprite });
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
    const { spriteData, dir, damageTimer } = this;
    const { x, y } = this.pos.toPixels();
    
    // SPRITES.enemies.moblin[left] || SPRITES.enemies.moblin[right]
    const sprites = spriteData[dir] || spriteData[Direction.flipped[dir]];
    if (sprites === undefined) console.log(this);
    const singleFrame = !sprites.length;
    const frame = frameIndex(this.frame, 16); // 0 or 1
    const sprite = singleFrame ? sprites : sprites[frame];
    
    const vertical = (dir === Direction.up || dir === Direction.down);
    const flipX = (!vertical && !spriteData[dir]) || (vertical && singleFrame && !!frame);
    const flipY = (vertical && !spriteData[dir]) || (!vertical && singleFrame && !!frame);
    
    const palette = damageTimer > 0 ? frameIndex(this.frame, 2, 4) : this.palette;

    this.sprite.update({ x, y, sprite, palette, flipX, flipY });
  }
  //abstract
  spawnDrop(game) {
    // drop table
    const { pos, dropGroup } = this;
    const chance = dropChances[dropGroup] || 0;
    console.log(`chance to drop: ${chance}`);
    const roll = rand();
    console.log(`roll: ${roll}`);
    if (roll > chance) return;

    const { x, y } = pos.toPixels();
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
    } else {
      // dont take damage again for 48 frames
      this.damageTimer = 48;
      if (this.canBeKnockedBack) {
        this.knockback(fromPos)
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
    const sprites = spriteData[dir] || spriteData[Direction.flipped[dir]];
    const singleFrame = !sprites.length;
    const even = frameIndex(frame, 16); // 0 or 1
    const sprite = singleFrame ? sprites : sprites[even];
    
    const vertical = (dir === Direction.up || dir === Direction.down);
    const flipX = (!vertical && !spriteData[dir]) || (vertical && singleFrame && even);
    const flipY = (vertical && !spriteData[dir]) || (!vertical && singleFrame && even);
  
    return { sprite, flipX, flipY };
  }
}