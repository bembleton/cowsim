import SPRITES from "./data/sprites";
import { Drop } from "./drop";

export class Key extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.key,
      palette: 1,
      duration: null
    });
  }

  onCollision(player) {
    player.keys = Math.min(player.keys + 1, 16);
  }
}