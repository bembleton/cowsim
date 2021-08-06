import { bbox } from "../../boundingBox";
import { frameIndex, SubPixels } from "./utils";
import { Direction } from "./direction";
import { MetaSprite } from "../../spriteManager";

export class Enemy {
  static state = {
    idle: 0,
    moving: 1,
    knockedback: 2,
    stunned: 3,
    dead: 4
  };

  constructor(x, y, dir, sprite, spriteData, palette, health, meleeDamage) {
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
    if (this.state === Enemy.state.dead) {
      this.damageTimer--;
      if (this.damageTimer <= 0) {
        this.spawnDrop(game);
        this.dispose();
        return;
      }
      const frame = this.damageTimer > 4 ? 0 : 1;
      const sprite = SPRITES.death_blink[frame];
      const palette = this.frame % 4;
      this.sprite.update({ palette, sprite });
    } else {
      if (canMove) {
        this.stateTimer && this.stateTimer--;
        this.updateState(game, player);
      }
      const { x, y } = this.pos.toPixels();
      this.bbox.x = x;
      this.bbox.y = y;
    }
    this.updateSprite();
  }
  //abstract
  updateState() {
  }
  updateSprite() {
    const { spriteData, dir, palette } = this;
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
    
    this.sprite.update({ x, y, sprite, palette, flipX, flipY });
  }
  //abstract
  spawnDrop(game) {
  }
  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }
  onCollision(player, game) {
    player.takeDamage(this.meleeDamage, game);
  }
  takeDamage(damage, game) {
    if (this.damageTimer > 0) return;
    this.damageTimer = 48;

    this.health -= damage;
    if (this.health <= 0)  {
      this.die();
    }
  }

  die() {
    //poof
    this.state = Enemy.state.dead;
    this.damageTimer = 8;
    const { x, y } = this.pos.toPixels();
    this.sprite = new MetaSprite({ x, y, mirrorX: true, mirrorY: true })
    //drop
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