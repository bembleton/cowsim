import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { frameIndex } from "./utils";

export class Rupee extends Drop {
  constructor(x, y, value) {
    const palette = value === 5 ? 2 : 1;
    const sprite = value === 50 ? SPRITES.rupee_dark : SPRITES.rupee_light;
    super(x, y, { sprite, palette });
    this.value = value;
  }

  update(canMove) {
    super.update(canMove);

    if (this.value !== 1) return;

    // blink the yellow rupee
    const frame = frameIndex(this.frame, 8);
    const palette = frame === 0 ? 1 : 2;
    this.updateSprite({ palette });
  }

  onCollision(player) {
    player.rupees = Math.min(player.rupees + this.value, 255);
  }
}