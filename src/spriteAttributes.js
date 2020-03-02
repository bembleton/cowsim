export const SPRITE_FLIP_X = 0x80;
export const SPRITE_FLIP_Y = 0x40;
export const SPRITE_PRIORITY = 0x20;
export const SPRITE_PALETTE = 0x03;

export const getAttributeByte = (flipx, flipy, priority, palette) => {
    return (flipx << 7) | (flipy << 6) | (priority << 5) | (palette & 0x03);
};

export default {
    SPRITE_FLIP_X,
    SPRITE_FLIP_Y,
    SPRITE_PRIORITY,
    SPRITE_PALETTE,
    getAttributeByte
};
