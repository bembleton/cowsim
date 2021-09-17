import { Projectile } from "./Projectile";

export class MeleeObject extends Projectile {
  // constructor({ sprite, x, y, width, height, direction, isFriendly, damage }) {
  //   super({ sprite, x, y, width, height, direction, isFriendly, damage });
  // }
  update(game) {
    // update bounds and sprite position
    this.updateBounds();
  }
  onCollision(entity, game) {
    if (entity.takeDamage) {
      entity.takeDamage(this.damage, this.bbox.center(), game);
    }
    else if (this.isFriendly && entity.floating) {
      // collect coins, hearts, bombs, etc
      // floating drops have a bobbing animation
      // heavier drops do not - weapons, keys, chests, etc
      entity.onCollision(game.player, game);
    }
  }
}
