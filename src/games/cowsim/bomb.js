import { MetaSprite } from "../../spriteManager";
import SPRITES from "./data/sprites";
import { Drop } from "./drop";
import { GameObject } from "./GameObject";
import { Projectile } from "./Projectile";
import { Sfx } from "./sound";

export class Bomb extends Drop {
  
  constructor(x, y) {
    const sprite = SPRITES.bomb;
    super(x, y, { sprite, palette: 2 });
  }

  onCollision(player, game) {
    if (this.thrown) return;
    game.soundEngine.play(Sfx.itemCollect);
    player.bombs = Math.min(player.bombs+4, player.maxBombs);
    if (!player.itemB) {
      player.equipItem({ type: 'bombs', sprite: SPRITES.bomb, palette: 2 });
    }
    this.dispose();
  }
}

export class BombObject extends Projectile {
  // {x, y} center
  constructor({ x, y }) {
    const sprite = new MetaSprite({ x: x-4, y: y-8, sprite: SPRITES.bomb, palette: 2, height: 2 });
    super({ sprite, x: x-16, y: y-16, width: 32, height: 32, isFriendly: true });
    this.timer = 64; // fuse
    this.fused = true;
    this.sprites = [];
  }

  update(game) {
    if (this.timer) {
      this.timer--;
    }

    if (this.timer === 0) {
      if (this.fused) {
        this.explode(game);
      }
      else {
        this.dispose();
      }
    }

    if (this.fused) return;

    // update smoke sprites
    // every 6 frames, change the sprite positions
    // after 24 frames, change the sprite animation index
    const evenOdd = this.timer % 2 === 0
    const sprite = this.timer < 12 ? SPRITES.smoke[1] : SPRITES.smoke[0];

    const { x, y } = this.pos.toPixels();

    if (evenOdd) {
      this.sprites[0].update({ x: x, y: y-8, sprite });
      this.sprites[1].update({ sprite });
      this.sprites[2].update({ x: x+24, y: y+8, sprite });
      this.sprites[3].update({ x: x+16, y: y+24, sprite });
    }
    else {
      this.sprites[0].update({ x: x+16, y: y-8, sprite });
      this.sprites[1].update({ sprite });
      this.sprites[2].update({ x: x-8, y: y+8, sprite });
      this.sprites[3].update({ x: x, y: y+24, sprite });
    }
  }

  explode(game) {
    this.fused = false;
    this.timer = 36;
    const { pos } = this;
    // remove bomb
    this.sprite.dispose();

    // boom
    game.soundEngine.play(Sfx.bombExplode);

    // draw smoke
    const sprite = SPRITES.smoke[0];
    const options = { sprite, height: 2, mirrorX: true, palette: 2 };
    const { x, y } = this.pos.toPixels(); // top left.  bbox is 32x32 and the sprite is in the center
    this.sprites.push(new MetaSprite({ x: x, y: y-8, ...options }));
    this.sprites.push(new MetaSprite({ x: x+8, y: y+8, ...options }));
    this.sprites.push(new MetaSprite({ x: x+24, y: y+8, ...options }));
    this.sprites.push(new MetaSprite({ x: x+16, y: y+24, ...options }));
    this.sprites.forEach(x => x.draw());

    // todo: expose secret doors
  }

  onCollision(entity, game) {
    // only take damage on the frame the bomb explodes
    if (this.fused || this.timer !== 36) return;
    
    if (entity.takeDamage) {
      const damage = 4;
      entity.takeDamage(damage, this.bbox.center(), game);
    }
  }

  dispose() {
    this.sprites.forEach(x => x.dispose());
    super.dispose();
  }
}