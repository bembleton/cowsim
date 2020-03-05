export const SPRITE_FLIP_X = 0x80;
export const SPRITE_FLIP_Y = 0x40;
export const SPRITE_PRIORITY = 0x20;
export const SPRITE_IN_USE = 0x10;
export const SPRITE_PALETTE = 0x03;

export const getAttributeByte = (flipx, flipy, priority, inUse, palette) => {
    return (flipx << 7) | (flipy << 6) | (priority << 5) | (inUse << 4) | (palette & 0x03);
};

export default {
    SPRITE_FLIP_X,
    SPRITE_FLIP_Y,
    SPRITE_PRIORITY,
    SPRITE_PALETTE,
    SPRITE_IN_USE,
    getAttributeByte
};
