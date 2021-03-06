export class bbox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  contains(x, y) {
    return (this.x <= x)
      && (x < this.x + this.width)
      && (this.y <= y)
      && (y < this.y + this.height);
  }

  intersects(bbox) {
    const a = this;
    const b = bbox;
    
    return (
      Math.abs((a.x*2 + a.width) - (b.x*2 + b.width)) < (a.width + b.width)
      && Math.abs((a.y*2 + a.height) - (b.y*2 + b.height)) < (a.height + b.height)
    );
  }
}