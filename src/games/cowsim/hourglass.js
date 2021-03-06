import SPRITES from "./data/sprites";
import { Drop } from "./drop";

export class Hourglass extends Drop {

  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.hourglass,
      palette: 1
    });
  }

  onCollision(player, screen) {
    screen.freezeTime();
  }
}