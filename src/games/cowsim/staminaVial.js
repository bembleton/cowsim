import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { Sfx } from "./sound";

export class StaminaVial extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.stamina_vial,
      palette: 0,
      height: 8
    });
  }

  onCollision(player, game) {
    player.stamina = Math.min(player.stamina + 4, player.maxStamina);
    game.soundEngine.play(Sfx.heart);
    this.dispose();
  }
}