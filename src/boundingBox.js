export class bbox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  contains(x, y) {
    if (x instanceof bbox) return this.containsBbox(x);
    if (x.x !== undefined && x.y !== undefined) return this.containsPoint(x); // point
    return this.containsPoint(x, y);
  }
  containsPoint(point) {
    return (this.x <= point.x)
      && (point.x < this.x + this.width)
      && (this.y <= point.y)
      && (point.y < this.y + this.height);
  }
  containsBbox(bbox) {
    const a = this;
    const b = bbox;
    return b.x >= a.x && b.x+b.width <= a.x+a.width && b.y >= a.y && b.y+b.height <= a.y+a.height;
  }
  intersects(bbox) {
    const a = this;
    const b = bbox;
    
    return (
      Math.abs((a.x*2 + a.width) - (b.x*2 + b.width)) < (a.width + b.width)
      && Math.abs((a.y*2 + a.height) - (b.y*2 + b.height)) < (a.height + b.height)
    );
  }
  center() {
    return {
      x: this.x + this.width/2,
      y: this.y + this.height/2
    };
  }
}

// Constants
bbox.HUD = new bbox(0,0,256,48);        // HUD
bbox.GAMEAREA = new bbox(0,48,256,192); // playable game area