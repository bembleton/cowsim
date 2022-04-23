import { GameObject } from "./GameObject";

// arrows, sword beams, magic
export class Projectile extends GameObject {
  static Type = {
    melee: 0,
    swordBeam: 1,
    arrow: 2,
    boomerang: 3,
    magic: 4,
    explosion: 5,
    fire: 6,
    slash: 7
  };
  constructor({ sprite, x, y, width, height, direction, isFriendly, damage, type }) {
    super({ sprite, x, y, width, height });
    this.direction = direction;
    this.damage = damage;
    this.isFriendly = isFriendly;
    this.type = type;
  }
  // abstract
  update(game) {
    // const { sprite, pos } = this;
    // // move
    // this.pos = pos.add(velocity);
    // // update bounds and sprite position
    // this.updateBounds();
    // // screen clipping
    // if (!bbox.GAMEAREA.contains(this.bbox)) {
    //   this.dispose();
    //   return;
    // }
    // // tile collisions
    // const w = game.screenToWorld({x, y});
    // const e = game.terrain.elevation(w.x, w.y);
    // if (Terrain.isSolid(e)) {
    //   this.dispose();
    //   return;
    // }
  }
  // abstract
  onCollision(entity, game) {
    // // enemy or player
    // if (entity.takeDamage) {
    //   entity.takeDamage(this.damage, this.bbox.center(), game);
    // }
    // // drop (boomerang and arrow can pick up items)
    // else if (this.isFriendly && entity instanceof Drop) {
    //   entity.onCollision(game.player, game);
    // }
    // //poof?
    // this.dispose();
  }
}
