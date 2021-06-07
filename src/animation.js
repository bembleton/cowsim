export default class Animation {
  constructor ({ update, duration = 0, frameskip = 0, framecount = 1 }) {
    this.onUpdate = update;
    this.duration = duration;
    this.frameskip = frameskip;
    this.framecount = framecount;
    this.currentFrame = 0;
    this.time = 0;
  }

  update () {
    const { duration, frameskip, framecount, onUpdate } = this;
    let shouldUpdate = false;
    
    if (duration) {
      this.time += 1000/60.0; // 16.6 ms
      if (this.time >= duration) {
        shouldUpdate = true;
        this.time -= duration;
      }
    } else if (frameskip > 0) {
      if (this.time++ >= frameskip) {
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

class KeyframeAnimation {
  constructor(keyFrames) {
    this.frame = 0;
    this.keyframes = keyframes;
  }
  update() {
    const keyframe = this.keyframes[this.frame++];
    if (keyframe) keyframe();
  }
}
