import SPRITES from "./data/sprites";
import { Drop } from "./drop";

export class Bomb extends Drop {
  constructor(x, y) {
    const sprite = SPRITES.bomb;
    super(x, y, { sprite, palette: 2 });
  }

  onCollision(player) {
    if (this.thrown) return;
    player.bombs = Math.min(player.bombs+4, player.maxBombs);
    if (!player.itemB) {
      player.itemB = 'bombs';
    }
  }
}