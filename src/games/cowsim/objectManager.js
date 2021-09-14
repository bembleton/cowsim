import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";
import { Terrain } from "./terrain";

export class ObjectManager {
  constructor() {
    this.projectiles = [];
    this.drops = [];
    this.creatures = [];
  }
  update(game) {
    this.updateProjectiles(game);
    this.updateCreatures(game);
    this.updateDrops(game);
  }
  updateProjectiles(game) {
    const { projectiles, creatures } = this;
    const { player } = game;
    const link = game.link.getBbox();
    this.projectiles = projectiles.filter2(p => {
      // move
      p.update(game);
      // creature collisions
      if (!p.disposed && p.isFriendly) {
        for (let i=creatures.length-1; i>=0; i--) {
          const c = creatures[i];
          if (p.bbox.intersects(c.bbox)) {
            p.onCollision(c);
          }
        }
      }
      // player collisions
      if(!p.disposed && !p.isFriendly && p.bbox.intersects(link)) {
        p.onCollision(player, game);
      }
      // remove if disposed
      return !p.disposed;
    });
  }
  updateDrops(game) {
    const { drops } = this;
    const { player, stasisCounter } = game;
    const link = game.link.getBbox();
    const canMove = stasisCounter === 0;
    this.drops = drops.filter2(d => {
      d.update(canMove, game);
      
      if(!d.disposed && d.bbox.intersects(link)) {
        d.onCollision(player, game);
        if (d.disposeOnCollision) d.dispose();
      }

      return !d.disposed;
    });
  }
  updateCreatures(game) {
    const { creatures } = this; 
    const { player, stasisCounter } = game;
    const link = game.link.getBbox();
    const canMove = stasisCounter === 0;
    this.creatures = creatures.filter2(c => {
      c.update(canMove, game, player);

      // player collisions
      if(!c.disposed && !c.damageTimer && c.bbox.intersects(link)) {
        c.onCollision(player, game);
      }

      return !c.disposed;
    });
  }
  clear() {
    this.projectiles.forEach(x => x.dispose());
    this.drops.forEach(x => x.dispose());
    this.creatures.forEach(x => x.dispose());

    this.projectiles = [];
    this.drops = [];
    this.creatures = [];
  }
}

export class GameObject {
  constructor({ sprite, x, y, width, height }) {
    this.sprite = sprite;
    this.pos = SubPixels.fromPixels(x, y);
    this.bbox = new bbox(x, y, width, height);
  }

  draw() {
    this.sprite.draw();
  }
  update(game) {
  }
  updateBounds() {
    const { x, y } = this.pos.toPixels();
    const { width, height } = this.bbox;
    this.bbox = new bbox(x, y, width, height);
    this.sprite.update({ x, y });
  }
  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }
}

// arrows, sword beams, magic
export class Projectile extends GameObject {
  constructor({ sprite, x, y, width, height, velocity, floating, onFire, isFriendly, damage }) {
    super({ sprite, x, y, width, height });
    this.velocity = velocity;
    this.floating = floating;
    this.onFire = onFire;
    this.isFriendly = isFriendly;
    this.damage = damage;
  }
  update(game) {
    const { sprite, pos, velocity, floating, onFire } = this;
    
    // move
    this.pos = pos.add(velocity);

    // update bounds and sprite position
    this.updateBounds();
    
    // screen clipping
    if (!bbox.GAMEAREA.contains(this.bbox)) {
      this.dispose();
      return;
    }

    // tile collisions
    if (!floating) {
      // blocked by trees and rocks. are any projectiles?
      // maybe float over trees but not rocks?
      const w = game.screenToWorld({x, y});
      const e = game.terrain.elevation(w.x, w.y);
      if (Terrain.isSolid(e)) {
        this.dispose();
        return;
      }
    }
  }
  onCollision(entity, game) {
    entity.takeDamage(this.damage, this.bbox.center(), game);
    //poof?
    this.dispose();
  }
}

export class MeleeObject extends GameObject {
  constructor({ sprite, x, y, width, height, isFriendly, damage }) {
    super({ sprite, x, y, width, height });
    this.isFriendly = isFriendly;
    this.damage = damage;
  }
  update(game) {
    // update bounds and sprite position
    this.updateBounds();
  }
  onCollision(entity, game) {
    entity.takeDamage(this.damage, this.bbox.center(), game);
  }
}

/*
x,y: topleft
horizontal: MetaSprite.create16x8(x, y, sprite, sprite2, { palette, flipX });
vertical:   MetaSprite.create8x16(x, y, sprite, sprite2, { palette, flipY });
*/