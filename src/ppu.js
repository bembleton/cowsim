import {
    colors,
    getColorByte
} from './palette';

/**
 * bg_palette_1: 0
 * bg_palette_2: 4
 * bg_palette_3: 8
 * bg_palette_4: 12
 * sprite_pal_1: 16
 * sprite_pal_2: 20
 * sprite_pal_3: 24
 * sprite_pal_4: 28
 */
const palettes = new Uint8Array(32);

/*
    128x128 pixels
    4 pixels/byte,
    32x128 = 4096 bytes
*/
const spriteTable = new Uint8Array(4096);
const backgroundTable = new Uint8Array(4096);

const nametables = new Uint8Array(32*30 * 2);
const attributes = new Uint8Array(64 * 2);
const spriteScanline = new Uint8Array(64);

const HORIZONTAL = 0;
const VERTICAL = 1;

const state = {
    mirroring: HORIZONTAL,
    scroll: {
        x: 0,
        y: 0
    },
    common_background: 0x3f // black
};

// 0x00-0x3f
/**
 * Sets the common background NES color
 * @param {*} color 0x00-0x3f
 */
const setCommonBackground = (color) => {
    state.common_background = color;
};

const getCommonBackground = () => state.common_background;

// HORIZONTAL:0, VERTICAL:1
const setMirroring = (mode) => {
    state.mirroring = mode;
};

/**
 * Sets the amount of horizontal and vertical scrolling in pixels
 * @param {*} x 0-512
 * @param {*} y 0-479
 */
const setScroll = (x, y) => {
    state.scroll.x = x >= 0 ? x : x + 512;
    state.scroll.y = y > 0 ? y : y + 479;
};

// with mirroring
// 32+32 x 30+30 = 64x60
/**
 * 
 * @param {*} x horizontal index, 0-63
 * @param {*} y vertical index, 0-59
 * @param {*} tile tile index
 */
const setNametable = (x, y, tile) => {
    const adr = getNametableAdr(x, y);
    nametables[adr] = tile;
};

// with mirroring
// 32+32 x 30+30 = 64x60 tiles
/**
 * 
 * @param {*} x horizontal index, 0-63
 * @param {*} y vertical index, 0-59
 * @returns a resolved nametable address offset, 0 - 0x0780
 */
const getNametableAdr = (x, y) => {
    const X = x % 32; // x is either 0-31 or 0-63
    const Y = (state.mirroring == HORIZONTAL) ?
        y : (y % 30) << (x >> 5);

    // X,Y = 32x60
    return Y * 32 + X;
};

// with mirroring
// 16+16 x 15+15 = 32x30
// palette 0-3
/**
 * Sets the palette for a 2x2 area of tiles
 * @param {*} x horizontal attribute index, 0-31
 * @param {*} y vertical attribute index, 0-29
 * @param {*} palette palette number, 0-3
 */
const setAttribute = (x, y, palette) => {
    const adr = getAttributeAdr(x, y);
    const offset = getAttributeOffset(x, y);
    const current_value = attributes[adr];
    const mask = ~(0x03 << offset);
    const value = (palette & 0x03) << offset;
    attributes[adr] = (current_value & mask) | value;
};

const getAttributeAdr = (x, y) => {
    const X = x % 16;
    let Y = (state.mirroring == HORIZONTAL) ?
        y : (y % 15) << (x >> 4);

    // the bottom row does not have attributes c or d
    if (Y > 14) Y++;

    // X,Y = 16x30
    // BX,BY = 8x15
    const BX = X >> 1;
    const BY = Y >> 1;
    return BY * 8 + BX;
};

const getAttributeOffset = (x, y) => {
    const X = x % 16;
    let Y = (state.mirroring == HORIZONTAL) ?
        y : (y % 15) << (x >> 4);

    // the bottom row does not have attributes c or d
    if (Y > 14) Y++;

    const shiftX = (X % 2) << 1;
    const shiftY = (Y % 2) << 2;
    return shiftX << shiftY;
};

/**
 * 
 * @param {*} idx palette index 0-3
 * @param {*} c0 color 0: common background
 * @param {*} c1 color 1
 * @param {*} c2 color 2
 * @param {*} c3 color 3
 */
const setBgPalette = (idx, c0, c1, c2, c3) => {
    palettes[idx * 4 + 0] = c0;
    palettes[idx * 4 + 1] = c1;
    palettes[idx * 4 + 2] = c2;
    palettes[idx * 4 + 3] = c3;
};

/**
 * 
 * @param {*} idx 0-3
 * @param {*} colors [c0, c1, c2, c3]
 */
const setSpritePalette = (idx, c0, c1, c2, c3) => {
    palettes[16 + idx * 4 + 0] = c0;
    palettes[16 + idx * 4 + 1] = c1;
    palettes[16 + idx * 4 + 2] = c2;
    palettes[16 + idx * 4 + 3] = c3;
};

const getBgColor = (idx, colorIdx) => {
    return palettes[idx * 4 + colorIdx];
};

const getSpriteColor = (idx, colorIdx) => {
    return palettes[16 + idx * 4 + colorIdx];
};

/** Sets sprite pixel data for a single byte */
const setSpriteData = (adr, value) => {
    spriteTable[adr] = value;
};

/** Sets background tile pixel data for a single byte*/
const setBackgroundData = (adr, value) => {
    backgroundTable[adr] = value;
};

const getAttribute = (tilex, tiley) => {
    const x = tilex >> 1;
    const y = tiley >> 1;
    const adr = getAttributeAdr(x, y);
    const offset = getAttributeOffset(x, y);
    return (attributes[adr] >> offset) & 0x03;
};

/**
 * Gets the tile number for a screen-space tiled offset
 * @param {*} tilex 0-63
 * @param {*} tiley 0-59
 */
const getTile = (tilex, tiley) => {
    const adr = getNametableAdr(tilex, tiley);
    return nametables[adr];
};

// idx: 0-255
// pixelx: 0-7
// pixely: 0-7
// returns color 0-3
const getTilePixel = (idx, pixelx, pixely) => {
    // 128x128 pixels
    // 16, 8x8 pixel tiles per row
    // 4 pixels per byte. 32 bytes per row
    // 2 bytes per row of pixels per sprite

    const top_left = ((idx >> 4) * 256) + ((idx % 16) * 2);
    const adr = top_left + (pixely * 32) + (pixelx >> 2);
    const data = backgroundTable[adr];
    const offset = 6 - ((pixelx % 4) * 2);
    const color = (data >> offset) & 0x03;
    return color;
};

/**
 * Gets the background pixel color value
 * @param {*} screenx pixel 0-255
 * @param {*} screeny pixel 0-239
 * @returns NES color
 */
const getPixel = (screenx, screeny) => {
    const x = (screenx + state.scroll.x) % 512;
    if (x < 0) x += 512;
    const y = (screeny + state.scroll.y) % 480;
    if (y < 0) y += 480;

    const tilex = x >> 3; // 0-31 (0-63)
    const tiley = y >> 3; // 0-29 (0-59)

    const tile = getTile(tilex, tiley);
    const palette = getAttribute(tilex, tiley);

    const tile_pixel_x = x % 8;
    const tile_pixel_y = y % 8;
    const color = getTilePixel(tile, tile_pixel_x, tile_pixel_y)

    return color === 0 ? 
        state.common_background :
        getBgColor(palette, color);
};



// idx: 0-255
// pixelx: 0-7
// pixely: 0-7
// returns color 0-3
const getSpritePixel = (idx, pixelx, pixely) => {
    // 128x128 pixels
    // 16, 8x8 pixel tiles per row
    // 4 pixels per byte. 32 bytes per row
    // 2 bytes per row of pixels per sprite

    const top_left = ((idx >> 5) * 256) + ((idx % 16) * 2);
    const adr = top_left + (pixely * 32) + (pixelx >> 2);
    const data = spriteTable[adr];
    const offset = 6 - ((pixelx % 4) * 2);
    const color = (data >> offset) & 0x03;
    return color;
};

const draw = () => {

};

export default {
    HORIZONTAL,
    VERTICAL,
    setCommonBackground,
    getCommonBackground,
    setMirroring,
    setScroll,
    setNametable,      // sets the tile index for a nametable entry
    setAttribute,      // sets the palette for an attribute entry
    getBgColor,
    getSpriteColor,
    setBgPalette,
    setSpritePalette,
    setSpriteData,     // writes pixel data to the tile sheet
    setBackgroundData, // writes pixel data to the tile sheet
    getPixel,
    getSpritePixel
};