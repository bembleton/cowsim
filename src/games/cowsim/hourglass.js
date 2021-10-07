import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { Sfx } from "./sound";

export class Hourglass extends Drop {

  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.hourglass,
      palette: 1,
      floating: false
    });
  }

  onCollision(player, game) {
    game.soundEngine.play(Sfx.itemCollect);
    game.freezeTime(); // todo: play clock sound
    this.dispose();
  }
}