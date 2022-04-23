import { Projectile } from "./Projectile";
import { Rock } from "./rock";

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
    const { projectiles, creatures, drops } = this;
    const { player, attackHelper } = game;
    const meleeObject = attackHelper.meleeObject;
    const parryObject = meleeObject && meleeObject.type == Projectile.Type.slash ? meleeObject : null;

    const link = game.link.getBbox();
    this.projectiles = projectiles.filter2(p => {
      // move
      p.update(game);
      // creature collisions
      if (!p.disposed && p.isFriendly) {
        for (let i=creatures.length-1; i>=0; i--) {
          const c = creatures[i];
          if (p.bbox.intersects(c.bbox)) {
            p.onCollision(c, game);
          }
        }
      }
      // drop collisions
      if (!p.disposed && p.isFriendly) {
        for (let i=drops.length-1; i>=0; i--) {
          const d = drops[i];
          if (p.bbox.intersects(d.bbox)) {
            p.onCollision(d, game);
          }
        }
      }
      // player can parry rocks
      if (!p.disposed && p instanceof Rock && parryObject && !parryObject.disposed && p.bbox.intersects(parryObject.bbox)) {
        // reverse direction and make the projectile friendly
        p.parry();
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
      
      if(!d.disposed && link.contains(d.bbox.center())) {
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
    const linkCenter = link.center();
    const canMove = stasisCounter === 0;
    this.creatures = creatures.filter2(c => {
      c.update(canMove, game, player);

      // player collisions
      if(canMove && !c.disposed && !c.damageTimer && c.bbox.contains(linkCenter)) {
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