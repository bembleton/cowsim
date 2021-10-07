import { choice, rand, randInt } from "../../random";
import { MetaSprite } from "../../spriteManager";
import { ArrowObject } from "./ArrowObject";
import SPRITES from './data/sprites';
import { Direction } from "./direction";
import { Enemy } from "./enemy";
import { pixelToTile, SubPixels } from "./utils";

export class Moblin extends Enemy {
  static speed = 12;
  static knockback = 16;

  constructor(x, y, { dir = Direction.down, palette = 1 }) {
    const spriteData = SPRITES.enemies.moblin;
    const { sprite: sprite0 } = Enemy.getSpriteFromState(spriteData, dir, 0);
    const sprite = new MetaSprite({ sprite: sprite0, width: 2, height: 2 });
    const health = palette; // red=1, blue=2, black=3
    const damage = 2 * health; // quarter hearts
    const dropGroup = ['A','C','B'][palette-1]; // red, blue, black

    super(x, y, dir, sprite, spriteData, palette, health, damage, dropGroup);

    this.frame = randInt(256);
    this.canBeKnockedBack = true;
  }

  idle(game, player, time = 64) {
    const { dir, pos, state } = this;
    if (state !== Enemy.state.idle) {
      this.state = Enemy.state.idle;
      this.stateTimer = time;
    }
    if (this.stateTimer === 32) {
      // shoot an arrow
      const { x, y } = this.pos.toPixels();
      const arrow = new ArrowObject({
        x: x+8,
        y: y+8,
        isFriendly: false,
        damage: this.meleeDamage,
        direction: dir,
        palette: 1
      });
      arrow.draw();
      game.objectManager.projectiles.push(arrow)
    }
    if (this.stateTimer === 0) {
      this.state = Enemy.state.moving;
    }
  }

  updateState(game, player) {
    switch (this.state) {
      case Enemy.state.idle:
        this.idle(game, player);
        break;

      case Enemy.state.knockedback:
      case Enemy.state.moving:
        this.move(game, player);
        break;
    }
  }

  move(game, player) {
    const { dir, pos, state } = this;
    let speed = Moblin.speed;
    if (state === Enemy.state.knockedback) {
      // maintain direction, but move backwards a lot faster
      if (this.stateTimer === 0) {
        this.idle(16);
        return;
      }
      speed = -32;
    }

    const velocity = SubPixels.fromDirection(dir, speed);
    this.pos = pos.add(velocity);
    const { x, y } = this.pos.toPixels();
    const onGrid = (y % 16) === 0 && (x % 16) === 0;
    if (onGrid) {
      const nextDirs = this.getNextDirs(game);
    
      if (state === Enemy.state.knockedback) {
        const canKeepMoving = nextDirs.includes(Direction.flipped[dir]);
        if (!canKeepMoving) {
          this.idle(game, player, 16);
          return;
        }
      } else {
        const canKeepMoving = nextDirs.includes(dir);
        if (canKeepMoving && rand() < 0.80) return; // keep moving
        this.dir = nextDirs && choice(nextDirs) || this.dir; // pick a new direction
        if (rand() < 0.50) {
          this.idle(game, player);
          return;
        }
      }
    }
  }

  getNextDirs(game) {
    const { x, y } = this.pos.toPixels();
    const { x: tilex, y: tiley } = pixelToTile(x, y);
    
    const possibleDirections = [];
    if (x % 16 === 0) {
      if (tiley > 4 && game.isPassableTile(tilex, tiley - 1, game)) possibleDirections.push(Direction.up);
      if (tiley < 13 && game.isPassableTile(tilex, tiley + 1, game)) possibleDirections.push(Direction.down);
    }
    if (y % 16 === 0) {
      if (tilex > 1 && game.isPassableTile(tilex - 1, tiley, game)) possibleDirections.push(Direction.left);
      if (tilex < 14 && game.isPassableTile(tilex + 1, tiley, game)) possibleDirections.push(Direction.right);
    }

    return possibleDirections;
  }
}