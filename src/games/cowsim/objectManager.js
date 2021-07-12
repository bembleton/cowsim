import { bbox } from "../../boundingBox";
import { SubPixels } from "./utils";

export class ObjectManager {
  constructor() {
    this.projectiles = [];
    this.drops = [];
    this.enemies = [];
    this.weapon
  }
}

class GameObject {
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
  dispose() {
    this.sprite.dispose();
  }
}

class Projectile extends GameObject {
  constructor({ sprite, x, y, width, height, velocity, floating }) {
    super({ sprite });
    this.velocity = velocity;
    this.floating = floating;
  }
  update(game) {
    const { sprite, velocity, floating } = this;
    const { pos } = sprite;
  }
}