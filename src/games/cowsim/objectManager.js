import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";
import { setSeed, drawArea, elevation, isSolid, isWater, isDesert, isGrass, randomPosition, getAreaTopLeft } from '../terrain';

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
  updateProjectiles(gane) {
    const { projectiles, creatures } = this;
    const { player } = game;
    const link = game.link.getBbox();
    this.projectiles = projectiles.filter(p => {
      // move
      p.update(game);
      
      //collisions
      if (!p.disposed && p.isFriendly) {
        for (let i=creatures.length-1; i>=0; i--) {
          const c = creatures[i];
          if (p.bbox.intersects(c)) {
            p.onCollision(c);
          }
        }
      }

      if(!p.disposed && !p.isFriendly && p.bbox.intersects(link)) {
        p.onCollision(player, game);
        p.dispose();
      }

      return !p.disposed;
    });
  }
  updateDrops(game) {
    const { drops } = this;
    const { player, stasisCounter } = game;
    const link = game.link.getBbox();
    const canMove = stasisCounter === 0;
    for (let i=drops.length-1; i>=0; i--) {
      const d = drops[i];
      d.update(canMove, game);
      
      if(!d.disposed && d.bbox.intersects(link)) {
        d.onCollision(player, game);
        if (d.disposeOnCollision) d.dispose();
      }

      if (d.disposed) drops.splice(i, 1);
    }
  }
  updateCreatures(game) {
    const { creatures } = this; 
    const { player, stasisCounter } = game;
    const link = game.link.getBbox();
    const canMove = stasisCounter === 0;
    this.creatures = creatures.filter(c => {
      c.update(canMove, game, player);
      
      // projectile collisions
      // if (!c.disposed && c.bbox.intersects()) {

      // }

      if(!c.disposed && c.bbox.intersects(link)) {
        c.onCollision(player, game);
        
      }

      return !c.disposed;
    });
  }
}

class GameObject {
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
  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }
}

class Projectile extends GameObject {
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
    this.pos = pos.add(velocity);
    const { x, y } = this.pos.toPixels();
    this.bbox = new bbox(x, y, this.bbox.width, this.bbox.height);
    
    // screen bounds
    const bounds = new bbox(0,48,256,240-48);
    if (!bounds.contains(this.bbox)) {
      this.dispose();
      return;
    }

    if (!floating) {
      // blocked by trees and rocks
      const w = game.screenToWorld({x, y});
      const e = elevation(w.x, w.y);
      if (isSolid(e)) {
        this.dispose();
        return;
      }
    }
  }
  onCollision(entity, game) {
    entity.takeDamage(this.damage, game);
  }
}