import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { frameIndex } from "./utils";

export class HeartContainer extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.heart_container,
      palette: 1,
      height: 16,
      mirrorx: true,
      duration: null
    });
  }

  onCollision(player) {
    player.maxHearts = Math.min(player.maxHearts + 1, 16);
  }
}