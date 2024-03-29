import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { frameIndex } from "./utils";

export class HeartContainer extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.heart_container,
      palette: 1,
      height: 16,
      mirrorX: true,
      duration: null,
      floating: false
    });
  }

  onCollision(player) {
    player.maxHearts = Math.min(player.maxHearts + 1, 16);
    this.dispose();
  }
}