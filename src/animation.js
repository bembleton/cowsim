export default class Animation {
    constructor ({ update, duration, frameCount }) {
        this.onUpdate = update;
        this.duration = duration;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.time = 0;
    }

    update (time) {
        this.time += time.elapsed;
        if (this.time >= this.duration) {
            this.time -= this.duration;
            if (this.frameCount) {
              if (this.currentFrame >= this.frameCount) {
                  this.currentFrame = 0;
              }
              this.onUpdate(this.currentFrame++);
            } else {
              this.onUpdate();
            }
        }
    }
}