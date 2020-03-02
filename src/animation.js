export default class Animation {
    constructor ({ frames, duration }) {
        this.frames = frames;
        this.duration = duration;
        this.currentFrame = 0;
        this.time = 0;
    }

    update (time) {
        this.time += time.elapsed;
        if (this.time >= this.duration) {
            this.time -= this.duration;
            if (this.currentFrame >= this.frames.length) {
                this.currentFrame = 0;
            }
            this.frames[this.currentFrame++]();
        }
    }
}