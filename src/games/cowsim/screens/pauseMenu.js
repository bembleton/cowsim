import ppu from '~/ppu';
import Menus from './menus';

const {
  HORIZONTAL,
  VERTICAL,
  enableCommonBackground,
  setMirroring,
  getNametable,
  setBgPalette,
  setSpritePalette,
  setScroll,
} = ppu;

export default class PauseMenu {
  constructor (game, hud, player) {
    this.game = game;

    this.menus = [
      new Menus.Map(this),
      new Menus.Weapons(this)
    ];

    // [opening, opened, closing, closed]
    this.state = 'closed';
    
    this.scroll = {
      x: 0,
      y: 0
    };

    this.mirroring = HORIZONTAL;

    // current map position
    // each 'screen' is 16x12
    // the full map is 16 screens wide (16x16 = 256 blocks wide)
    // and 16 screens tall (16x12 = 192 blocks tall)
    this.position = {
      x: 0,
      y: 0,
    };

    this.sprites = {};
    this.mapIndicator = {
      sprite: null,
      x: 0,
      y: 0,
      visible: true
    };

    this.hud = hud;
    this.player = player;
  }

  load () {
    // we have to wait until the menu scrolls up (becomes opened) before loading assets
   
    // switch to horizontal mirroring
    // render menu to last 12 rows of the lower page
    // scroll up 12 rows
    // hide all sprites?
    // maintain HUD rendering as it scrolls to bottom of the screen via onScanline interrupt
    setScroll(0, 0);
    setMirroring(HORIZONTAL);
    // clear lower table, or at least the lower portion of
    // this will make the menu completely black while we scroll up
    // once we're done scrolling, we can render the menu
    fillBlocks(0, 18, 16, 12, 0x30, 0);

    // render the menu shell
    this.menus[0].drawFrame();

    // start scrolling up 12 blocks
    this.state = 'opening';
  }

  update () {
    switch (this.state) {
      case 'opening':
      case 'closing':
        this.this.doScroll();
        break;
      case 'closed':
        // dispatch closed event?
        return;
      case 'open':

    }

    if (isPressed(buttons.SELECT)) {
      // switch menus
      this.next();
    }
  }

  doScroll () {
    const { scroll, state } = this;
    const scrollAmt = 4;
    switch (state) {
      case 'opening':
        scroll.y -= scrollAmt;
        if (scroll.y === -12*16) {
          this.state = 'open';
          this.show();
        }
        break;
      case 'closing':
        scroll.y += scrollAmt;
        if (scroll.y === 0) {
          this.state = 'closed';
        }
        break;
    }
    setScroll(scroll.x, scroll.y);

    /* 
      +###### HUD ######+       +#################+
      |                 |       |###### MENU #####|
      |      screen     |       |#################|
      |                 |       |###### HUD ######|
      +=================+  ==>  +=================+
      |                 |       |                 |
      |#################|       |      screen     |
      |###### MENU #####|       |                 |
      +#################+       +=================+

    */
  }

  setBgPalettes() {
    setBgPalette(0, palettes.grassAndWater);
    setBgPalette(1, palettes.grassAndDirt);
    setBgPalette(2, palettes.grays);
  }

  unload () {

  }

  onScanline (y) {
    const { scroll } = this;
    const hudY = -scroll.y;
    if (y === 0) {
      this.setBgPalettes();
    }

    // draw hud
    if (y === hudY) {
      // draw one row of black tiles from the bottom,
      // and 1 column of tiles from the right side, of the hud
      setScroll(0, 32);
      setMirroring(HORIZONTAL);
      this.hud.setPalettes();
    } else if (y === hudY + 8) {
      // set scroll-y to -8 to center the hud
      setScroll(-16, -8);
    } else if (y === hudY + 48) {
      // set the scroll and mirror mode back to normal
      setMirroring(this.mirroring);
      setScroll(scroll.x, scroll.y);
      // set the camera palettes
      //this.setBgPalettes();
    }
  }

  currentMenu () {
    return this.menus[0];
  }

  show () {
    this.currentMenu().load();
  }

  hide () {
    this.currentMenu().clear();
  }

  next () {
    this.hide();
    this.menus.push(this.menus.shift());
    this.show();
  }

  prev () {
    this.hide();
    this.menus.unshift(this.menus.pop());
    this.show();
  }

  
}