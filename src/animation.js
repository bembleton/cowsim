export default class Animation {
  constructor ({ update, duration = 0, frameskip = 0, framecount = 1 }) {
    this.onUpdate = update;
    this.duration = duration;
    this.frameskip = frameskip;
    this.framecount = framecount;
    this.currentFrame = 0;
    this.time = 0;
  }

  update (gametime) {
    const { duration, frameskip, framecount, onUpdate } = this;
    let shouldUpdate = false;
    
    if (duration) {
      this.time += gametime.elapsed;
      if (this.time >= duration) {
        shouldUpdate = true;
        this.time -= duration;
      }
    } else if (frameskip > 0) {
      if (time++ >= frameskip) {
        shouldUpdate = true;
        this.time = 0;
      }
    } else {
      // every frame
      shouldUpdate = true;
    }
      
    if (shouldUpdate) {
      if (this.currentFrame >= framecount) {
          this.currentFrame = 0;
      }
      onUpdate(this.currentFrame++);
    }
  }

  reset () {
    this.time = 0;
    this.currentFrame = 0;
  }
}