import { isPressed, buttons } from '~/controller';
import SPRITES from '../data/sprites';
import { SubPixels } from '../utils';
import { MetaSprite, Sprite } from '../../../spriteManager';
import { Direction } from '../direction';
import { MeleeObject } from "../MeleeObject";
import { SwordBeam } from "../SwordBeam";
import { Sfx } from '../sound';
import { Projectile } from '../Projectile';

export const Attack = {
  ready: 0,
  jabbing: 1,
  slashing: 2,
  withdrawing: 3,
  coolingdown: 4
};

const max_charge_frames = 24;
const jab_frames = 8;
const douple_tap_time = 8; // allowed frames to input a double A press

const jab_offsets = [3,3,3,3,12,12,12,3];

/*
tap: jab (ready & wasPressed, start timer)
double-tap: sword beam (wasPressed & timer>0, start timer)
-and-hold: (isPressed for timer, spin attack)
*/
export class AttackHelper {
  constructor() {
    this.swordBeam = null;
    this.meleeObject = null;
    this.slashSprites = [
      new Sprite(),
      new Sprite()
    ];
    this.load();
  }

  load() {
    this.state = Attack.ready;
    this.charged = false; // when timer == max
    this.timer = 0;
  }

  update(game) {
    const { player } = game;
    const hasWeapon = !!player.weapon;

    switch (this.state) {
      case Attack.ready:
        if (game.wasPressed(buttons.A) && hasWeapon) {
          this.jab(game);
        }
        break;

      case Attack.jabbing:
        if (this.timer === 0) {
          this.withdraw(game);
        }
        else if (game.wasPressed(buttons.A)) {
          // double tap start slash
          this.slash(game);
        } else {
          this.timer--;
        }
        this.drawWeapon(game);
        break;

      case Attack.slashing:
        if (this.timer === 0) {
          this.cooldown(game);
          break;
        }
        else if (this.timer > 21 && !isPressed(buttons.A) && this.canDoSwordBeam(game)) {
          // double-tapped for beam and canceled slash
          this.doSwordBeam(game);
          break;
        }
        else if (this.timer <= 21 && ((this.timer - 3) % 6) === 0) {
          this.rotatePlayer(game);
        }
        this.drawWeapon(game);
        this.timer--;
        break;

      case Attack.withdrawing:
        if (this.timer === 0) {
          this.cooldown(game);
          break;
        }
        else if (game.wasPressed(buttons.A)) {
          // double tap start slash
          this.slash(game);
        } else {
          //this.drawWeapon(game);
          this.timer--;
        }
        break;

      case Attack.coolingdown:
        if (this.timer === 0) {
          this.state = Attack.ready;
        }
        else { this.timer--; }
        break;
    }
  }

  /*
  update(game) {
    const { player } = game;

    switch (this.state) {
      case Attack.ready:
        if (game.wasPressed(buttons.A) && player.weapon) {
          this.jab(game);
        }
        break;

      case Attack.jabbing:
        if (isPressed(buttons.A)) {
          if (this.timer < max_charge_frames) {
            this.timer++;
          } else {
            if (player.stamina > 0) {
              // flash weapon and start using stamina
              this.charged = true;
              game.link.chargingSlash = true;
            }
            else {
              // too tired
              this.withdraw(game);
            }
          }
        }
        else if (this.charged) {
          this.slash(game);
        }
        else {
          this.withdraw(game);
        }
        this.drawWeapon(game);
        break;

      case Attack.slashing:
        if (this.timer === 0) {
          this.cooldown(game);
          return;
        }
        else if (this.timer > 21 && isPressed(buttons.A)) {
          this.doSwordBeam(game);
        }
        else if (this.timer <= 21 && ((this.timer - 3) % 6) === 0) {
          this.rotatePlayer(game);
        }
        this.drawWeapon(game);
        this.timer--;
        break;

      case Attack.withdrawing:
        if (this.timer === 0) {
          this.cooldown(game);
          return;
        }
        else {
          this.drawWeapon(game);
          this.timer--;
        }
        break;

      case Attack.coolingdown:
        if (this.timer === 0) {
          this.state = Attack.ready;
        }
        else { this.timer--; }
        break;
    }
  }
  */

  unload() {
    const { meleeObject, swordBeam, slashSprites } = this;
    meleeObject && meleeObject.dispose();
    swordBeam && swordBeam.dispose();
    slashSprites.forEach(x => x.dispose());
  }

  jab(game) {
    this.state = Attack.jabbing;
    game.link.attacking = true;
    this.timer = jab_frames - 1;
    game.soundEngine.play(Sfx.sword);
  }

  canDoSwordBeam(game) {
    // already used a beam
    if (this.swordBeam && !this.swordBeam.disposed) {
      return false;
    }

    // not enough health or stamina
    const player = game.player;
    const { stamina, maxHearts, health, weapon } = player;
    if (stamina < 1 || health < maxHearts * 4) {
      return false;
    }

    return true;
  }

  doSwordBeam(game) {
    const player = game.player;

    // use some stamina
    player.stamina -= 1;

    const { pos, direction } = game.link;
    const { x: posx, y: posy } = pos.toPixels();
    const offset = 12;
    // get sword position based on direction and offset
    // the x offset varies a few pixels between up and down
    const [x, y] = {
      'up': [posx + 3, posy - offset],
      'down': [posx + 5, posy + offset],
      'left': [posx - offset, posy + 6],
      'right': [posx + offset, posy + 6],
    }[direction];

    const damage = player.weapon.attack;
    this.swordBeam = new SwordBeam({ x, y, direction, damage });
    game.objectManager.projectiles.push(this.swordBeam);
    this.swordBeam.draw();

    // cancel slash
    this.cooldown(game);
  }
  withdraw(game) {
    // this.charged = false;
    // game.link.chargingSlash = false;
    this.state = Attack.withdrawing;
    this.timer = douple_tap_time; // wait time for double-tap
    this.meleeObject.dispose();
  }
  slash(game) {
    // this.charged = false;
    // game.link.chargingSlash = false;
    this.state = Attack.slashing;
    this.timer = 30; // 10 animation frames, 3 frames each
    this.meleeObject.dispose();
    const damage = game.player.weapon.attack;
    const link = game.link.pos.toPixels();
    const x = link.x-8;
    const y = link.y-8;
    
    this.meleeObject = new MeleeObject({
      x,
      y,
      width: 32,
      height: 32,
      isFriendly: true,
      damage,
      type: Projectile.Type.slash
    });
    game.objectManager.projectiles.push(this.meleeObject);
  }
  rotatePlayer(game) {
    game.link.direction = {
      'right': Direction.up,
      'up': Direction.left,
      'left': Direction.down,
      'down': Direction.right
    }[game.link.direction];
  }
  cooldown(game) {
    this.state = Attack.coolingdown;
    game.link.attacking = false;
    this.timer = 8; // frames before allowing another attack
    this.meleeObject.dispose();
    this.slashSprites.forEach(x => x.dispose());
  }

  drawWeapon(game) {
    const { pos, direction } = game.link;
    const { timer } = this;

    const { x: posx, y: posy } = pos.toPixels();

    if (this.state === Attack.jabbing) {
      // Draw a normal sword
      // min and max jab position based on frame
      const offset = jab_offsets[timer];

      // get sword position based on direction and offset
      // the x offset varies a few pixels between up and down
      const [x, y] = {
        'up': [posx + 3, posy - offset],
        'down': [posx + 5, posy + offset],
        'left': [posx - offset, posy + 6],
        'right': [posx + offset, posy + 6],
      }[direction];

      if (!this.meleeObject || this.meleeObject.disposed) {
        // make a new sprite
        const horiz = Direction.isHorizontal(direction);
        // const sprite1 = horiz ? SPRITES.weapon+17 : SPRITES.weapon;
        // const sprite2 = horiz ? SPRITES.weapon+1 : SPRITES.weapon+16;
        // const flipX = direction === Direction.left;
        // const flipY = direction === Direction.down;
        const width = horiz ? 16 : 8;
        const height = horiz ? 8 : 16;

        const { palette, attack: damage } = game.player.weapon;
        const sprite = MetaSprite.fromData(SPRITES.sword, direction, { palette });
        //const options = { palette, flipX, flipY, priority: false };
        // if (horiz) {
        //   this.link.weaponSprite = MetaSprite.Create16x8(x, y, sprite1, sprite2, options);
        // } else {
        //   this.link.weaponSprite = MetaSprite.Create8x16(x, y, sprite1, sprite2, options);
        // }
        this.meleeObject = new MeleeObject({ sprite, x, y, width, height, isFriendly: true, damage });

        game.objectManager.projectiles.push(this.meleeObject);
        this.meleeObject.draw();

      } else {
        // update pos
        this.meleeObject.pos = SubPixels.fromPixels(x, y);
      }
    }

    if (this.state === Attack.slashing) {
      const [intro, a, b, end] = SPRITES.slash[direction]; // 
      const frame = 9 - Math.floor((this.timer - 1) / 3); // timer is 30 to 1.  frame is 0-9
      let spriteData;
      if (frame === 0) {
        spriteData = intro;
      } else if (frame === 9) {
        spriteData = end;
      } else {
        spriteData = (frame % 2) === 1 ? a : b;
      }

      //this.meleeObject.sprite.dispose();
      //const { palette } = game.player.weapon;
      //this.meleeObject.sprite = new MetaSprite({ x: posx, y: posy, palette });
      //this.meleeObject.sprite.draw();
      const sprites = this.slashSprites;
      const { tiles } = spriteData;
      const update = (s, tile) => {
        if (tile) {
          const { tile: index, x, y, flipX = false, flipY = false } = tile;
          s.update({ index, x: x+posx, y: y+posy, flipX, flipY });
        } else {
          s.update({ y: 240 });
        }
      }

      update(sprites[0], tiles[0]);
      update(sprites[1], tiles[1]);

      sprites[0].draw();
      sprites[1].draw();
      // todo: change bbox to square around Link
    }
  }
}
