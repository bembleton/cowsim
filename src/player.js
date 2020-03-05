import spriteManager from './spriteManager';
import { buttons, isPressed } from './controller';

const dir = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

export default class Player {
    constructor (x, y) {
      this.x = x;
      this.y = y;
      this.direction = dir.down;

      this.states = {
        idle: new Animation({
          duration: 500,
          framecount: 2,
          update: this.idleUpdate
        }),
        walking: 'walking',
        shooting: 'shooting',
        dying: 'dying',
        dead: 'dead',
      };

      this.state = this.states.idle;

      this.sprite = {
        id: spriteManager.requestSprite(),
        idx: 0,
        flipx: false,
        flipy: false,
        palette: 0
      };
    }

    update (time) {
      // get input and update state if necessary
      if (isPressed(buttons.UP)) {
        this.direction = dir.up;

      } else if (isPressed(buttons.RIGHT)) {
        this.direction = dir.right;
      } else if (isPressed(buttons.DOWN)) {
        this.direction = dir.down;
      } else if (isPressed(buttons.LEFT)) {
        this.direction = dir.LEFT;
      }

      // this.setState(this.states.walking)
      this.state.update(time);
    }

    idleUpdate (frame) {
      const { sprite, direction } = this;
      sprite.idx = 2 + frame % 2;
      if (direction === dir.UP || direction === dir.DOWN) {
        sprite.idx += 4;
      }
      sprite.flipx = direction === dir.LEFT;
      sprite.flipy = direction === dir.DOWN;
    }

    walk () {
      const { sprite, direction } = this;
      sprite.idx = 2 + frame % 2;
      if (direction === dir.UP || direction === dir.DOWN) {
        sprite.idx += 4;
      }
      sprite.flipx = direction === dir.LEFT;
      sprite.flipy = direction === dir.DOWN;
    }

    isIdle () { this.state === this.states.idle }
    isWalking () { this.state === this.states.walking }
    isShooting () { this.state === this.states.shooting }

    setDirection (dir) {
      this.direction = dir;
    }


    setState (newState) {
      newState.reset();
      this.state = newState;
    }

    draw () {
      const { sprite: { id, idx, flipx, flipy, palette} } = this;
      spriteManager.setSprite(id, idx, x, y, flipx, flipy, false, palette);
    }
}