import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";

export class GameObject {
  constructor({ sprite, x, y, width, height }) {
    this.sprite = sprite;
    this.pos = SubPixels.fromPixels(x, y);
    this.bbox = new bbox(x, y, width, height);
  }

  draw() {
    this.sprite.draw();
  }
  update(game) {
  }
  updateBounds() {
    const { x, y } = this.pos.toPixels();
    const { width, height } = this.bbox;
    this.bbox = new bbox(x, y, width, height);
    this.sprite.update({ x, y });
  }
  dispose() {
    this.sprite.dispose();
    this.disposed = true;
  }
}
