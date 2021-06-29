import { MetaSprite } from "../../spriteManager";
import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { frameIndex, SubPixels } from "./utils";

export class Chest extends Drop {
  constructor(x, y, contents) {
    const sprite = new MetaSprite({
      x, y,
      sprite: SPRITES.chest_closed,
      palette: 0,
      height: 2,
      width: 1,
      mirrorX: true
    });

    super(x, y, {
      sprite,
      palette: 0,
      height: 16,
      mirrorX: true,
      duration: null
    });

    this.disposeOnCollision = false;
    this.open = false;
    this.contents = contents;
    this.contentsPos = SubPixels.fromPixels(x+4, y);
  }

  update(canMove, game) {
    const { contentsDxdy, contentsPos, contents, open } = this;
    if (!open || !contents) return;
    
    if (contentsDxdy.y >= 20) {
      game.spawnDrop(contents);
      this.contents = null;
      return;
    }

    this.contentsDxdy = contentsDxdy.add(0, 1);
    this.contentsPos = contentsPos.add(this.contentsDxdy);

    const { x, y } = this.contentsPos.toPixels();
    this.contents.updateSprite({ x, y });
  }

  onCollision(player, game) {
    if (this.open) return;
    this.open = true;
    this.updateSprite({ sprite: SPRITES.chest_open });
    // 0 2
    // 1 3
    this.sprite.sprites[0].update({ palette: 1 });
    this.sprite.sprites[2].update({ palette: 1 });

    // spawn the contents and toss it out
    const { contents, contentsPos } = this;
    const { x, y } = contentsPos.toPixels();

    this.contents.updateSprite({ x, y });
    const dx = x < 128 ? 8 : -8;
    this.contentsDxdy = new SubPixels(dx, -20);
    contents.draw();
  }
}