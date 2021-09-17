import SPRITES from "./data/sprites";
import { Drop } from "./drop";

export class StaminaVial extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.stamina_vial,
      palette: 0,
      height: 8
    });
  }

  onCollision(player) {
    player.health = Math.min(player.stamina + 4, player.maxStamina);
    this.dispose();
  }
}