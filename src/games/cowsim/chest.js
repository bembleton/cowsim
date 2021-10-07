import { MetaSprite } from "../../spriteManager";
import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { Sfx } from "./sound";
import { frameIndex, SubPixels } from "./utils";

export class Chest extends Drop {
  constructor(x, y, contents) {
    // bottom sprite
    const sprite = new MetaSprite({
      x, y: y+8,
      sprite: SPRITES.chest_closed+16,
      palette: 0,
      mirrorX: true
    });

    super(x, y, {
      sprite,
      palette: 0,
      height: 16,
      mirrorX: true,
      duration: null,
      floating: false
    });

    this.lidSprite = new MetaSprite({
      x, y,
      sprite: SPRITES.chest_closed,
      palette: 0,
      mirrorX: true
    })

    this.disposeOnCollision = false;
    this.opened = false;
    this.openingTimer = 0;
    this.contents = contents;
    this.contentsPos = SubPixels.fromPixels(x+4, y);
  }

  draw() {
    super.draw();
    this.lidSprite.draw();
  }

  dispose() {
    super.dispose();
    this.lidSprite.dispose();
  }

  update(canMove, game) {
    const { contentsDxdy, contentsPos, contents, opened } = this;
    if (this.openingTimer) {
      this.openingTimer--;
      if (this.openingTimer === 0) {
        this.drawContents();
        this.open();
        // start music again
        game.startMusic(160);
      }
    }
    if (!opened || !contents) return;
    
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

  open() {
    this.opened = true;
    //this.updateSprite({ sprite: SPRITES.chest_open });
    // 0 2
    // 1 3
    this.lidSprite.dispose();
    this.lidSprite.update({ sprite: SPRITES.chest_open, palette: 1 });
    this.lidSprite.draw();
  }

  drawContents() {
    this.lidSprite.dispose();
    
    // spawn the contents and toss it out
    const { contents, contentsPos } = this;
    const { x, y } = contentsPos.toPixels();

    this.contents.updateSprite({ x, y });
    const dx = x < 128 ? 8 : -8;
    this.contentsDxdy = new SubPixels(dx, -20);
    contents.draw();
  }

  onCollision(player, game) {
    if (this.opened || this.openingTimer) return;

    // stop music
    game.soundEngine.stop();
    game.soundEngine.play(Sfx.chest);
    // wait for the fanfare
    this.openingTimer = 356;
    //this.open();
  }
}