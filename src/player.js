const state = {
    idle: {
        update: (player, time) => {
            
        }
    },
    walking: 'walking',
    shooting: 'shooting',
    jumping: 'jumping',
    dying: 'dying',
    dead: 'dead',
};
const dir = {
    up: 'up',
    right: 'right',
    down: 'down',
    left: 'left'
};
export default class Player {
    constructor (x, y) {
        this.state = state.idle;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.facing = dir.down;
    }

    update (time) {
        switch (this.state) {
            case state.idle:
        }
    }
}