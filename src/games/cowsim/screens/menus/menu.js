import ppu from '~/ppu';
import Animation from '~/animation';
import spriteManager from '~/spriteManager';
import { isPressed, buttons } from '~/controller';
import { randInt, Randy } from '~/random';
import { palettes } from '../../data/colors';
import Link from '../../link';
import { drawTile, fillBlocks, drawMetaTile, SubPixels } from '../../utils';
//import { setSeed, drawArea, elevation, isSolid, isWater, isDesert } from '../terrain';
import Hud from '../hud';
const { dir } = Link;

const {
  HORIZONTAL,
  VERTICAL,
  setCommonBackground,
  setMirroring,
  setScroll,
  setNametable,
  setAttribute,
  setBgPalette,
  setSpritePalette,
} = ppu;

const tiles = {
  blank: 0x30,
  horizontal: 0x32,
  vertical: 0x33,
  topleft: 0x34,
  topright: 0x35,
  bottomleft: 0x36,
  bottomright: 0x37
};

export class Menu {
  constructor (parent, name, icon) {
    this.parent = parent;
    this.name = name;
    this.icon = icon;
    this.isSelected = false;
  }

  update () {}
  clear () {
    // fill screen with black
    fillBlocks(2, 4, 12, 6, 0x30, 0);
  }
  drawFrame () {
    // draw tabs
    // draw main box
  }

  //drawBackground (nx, ny) {}
  //drawSprites () {}
}