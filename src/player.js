
const dir = {
    up: 'up',
    right: 'right',
    down: 'down',
    left: 'left'
};
export default class Player {
    constructor (x, y) {
      this.x = x;
      this.y = y;
      this.dx = 0;
      this.dy = 0;
      this.facing = dir.down;

      this.states = {
        idle: new Animation({
          duration: 500,
          framecount: 2,
          update: this.idle
        }),
        walking: 'walking',
        shooting: 'shooting',
        dying: 'dying',
        dead: 'dead',
      };

      this.state = this.states.idle;
    }

    update (time) {
      // get input and update state if necessary
      // this.setState(this.states.walking)
      this.state.update(time);
    }

    idle (frame) {

    }

    isIdle () { this.state === this.states.idle }
    isWalking () { this.state === this.states.walking }
    isShooting () { this.state === this.states.shooting }

    setState (newState) {
      newState.reset();
      this.state = newState;
    }
}