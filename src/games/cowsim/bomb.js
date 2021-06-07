import SPRITES from "./data/sprites";
import { Drop } from "./drop";

export class Bomb extends Drop {
  static dropped = 0;
  static held = 1;
  static thrown = 2;

  constructor(x, y, state = Bomb.dropped) {
    const sprite = SPRITES.bomb;
    super(x, y, { sprite, palette: 2 });
    this.state = state;
  }

  onCollision(player) {
    if (this.thrown) return;
    player.bombs = Math.min(player.bombs+4, player.maxBombs);
    if (!player.itemB) {
      player.itemB = 'bombs';
    }
  }
}