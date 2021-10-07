import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { Sfx } from "./sound";

export class Key extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.key,
      palette: 1,
      duration: null,
      floating: false
    });
  }

  onCollision(player, game) {
    player.keys = Math.min(player.keys + 1, 16);
    game.soundEngine.play(Sfx.itemCollect);
    this.dispose();
  }
}