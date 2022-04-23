import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";

export class GameObject {
  constructor({ sprite, x, y, width, height }) {
    this.sprite = sprite;
    this.pos = SubPixels.fromPixels(x, y);
    this.bbox = new bbox(x, y, width, height);
  }

  draw() {
    if (this.sprite) this.sprite.draw();
  }
  update(game) {
  }
  updateBounds() {
    const { x, y } = this.pos.toPixels();
    const { width, height } = this.bbox;
    this.bbox = new bbox(x, y, width, height);
    if (this.sprite) this.sprite.update({ x, y });
  }
  dispose() {
    if (this.sprite) this.sprite.dispose();
    this.disposed = true;
  }
}
