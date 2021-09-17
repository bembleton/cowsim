import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { frameIndex } from "./utils";

export class StaminaContainer extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.potion_large,
      palette: 0,
      duration: null,
      floating: false
    });
  }

  // update(canMove) {
  //   super.update(canMove);
  //   const frame = frameIndex(this.frame, 8);
  //   const palette = frame === 0 ? 0 : 2;
  //   this.updateSprite({ palette });
  // }

  onCollision(player) {
    player.maxStamina = Math.min(player.maxStamina + 4, 32);
    this.dispose();
  }
}