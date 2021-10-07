import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { Sfx } from "./sound";
import { frameIndex } from "./utils";

export class Heart extends Drop {
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.heart,
      palette: 1,
      height: 8
    });
  }

  update(canMove) {
    super.update(canMove);
    
    const frame = frameIndex(this.frame, 8);
    const palette = frame === 0 ? 1 : 2;
    this.updateSprite({ palette });
  }

  onCollision(player, game) {
    player.health = Math.min(player.health + 4, player.maxHearts*4);
    game.soundEngine.stop(Sfx.heartBeat);
    game.soundEngine.play(Sfx.heart);
    this.dispose();
  }
}