import { randInt } from "../../random";
import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { Sfx } from "./sound";
import { frameIndex, SubPixels } from "./utils";

const turn_table = [4,8,9,10,6,2,1,0];
const getVelocity = (dir) => {
  const encoded = turn_table[dir];
  return {
    x: (encoded >> 2) - 1, // 0,1,2 -> -1, 0, 1
    y: (encoded & 0x03) - 1
  }
}
export class Fairy extends Drop {
  static speed = 12; // subpixels per frame
  constructor(x, y) {
    super(x, y, {
      sprite: SPRITES.fairy[0],
      palette: 1
    });

    this.pos = SubPixels.fromPixels(x, y);
    this.direction = 0;
    this.move_timer = 32;
  }

  update(canMove = true) {
    super.update(canMove);
    
    const frame = frameIndex(this.frame, 4);
    const sprite = SPRITES.fairy[frame];

    // update position
    if (canMove) {
      const { x, y } = this.move();
      this.updateSprite({ x, y, sprite });
    } else {
      this.updateSprite({ sprite });
    }
  }

  move() {
    let pos = this.pos;
    this.move_timer--;
    if (this.move_timer === 0) {
      const turn = randInt(3)-1; // -1,0,1
      this.direction = (this.direction + turn + 8) % 8;
      this.move_timer = 32;
    }
    const v = getVelocity(this.direction);
    pos = pos.add(v.x * Fairy.speed, v.y * Fairy.speed);
    let { x, y } = pos.toPixels();

    if (x < 16 || x > 232 || y < 64 || y > 208) {
      // reverse
      this.direction = (this.direction + 4) % 8
      const v = getVelocity(this.direction);
      pos = pos.add(v.x * Fairy.speed, v.y * Fairy.speed);
    }

    this.pos = pos;

    return pos.toPixels();
  }

  onCollision(player, game) {
    player.health = Math.min(player.health + 12, player.maxHearts*4);
    game.soundEngine.stop(Sfx.heartBeat);
    game.soundEngine.play(Sfx.itemCollect);
    this.dispose();
  }
}