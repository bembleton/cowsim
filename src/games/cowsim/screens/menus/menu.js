import ppu from '~/ppu';
import Animation from '~/animation';
import spriteManager from '~/spriteManager';
import { isPressed, buttons } from '~/controller';
import { randInt, Randy } from '~/random';
import { palettes } from '../../data/colors';
import Link from '../../link';
import { drawTile, fillBlocks, drawMetaTile, SubPixels } from '../../utils';
import { setSeed, drawArea, elevation, isSolid, isWater, isDesert } from '../terrain';
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