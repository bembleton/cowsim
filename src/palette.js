/* 64 colors */
const colors = [
    0x7C, 0x7C, 0x7C,
    0x00, 0x00, 0xFC,
    0x00, 0x00, 0xBC,
    0x44, 0x28, 0xBC,
    0x94, 0x00, 0x84,
    0xA8, 0x00, 0x20,
    0xA8, 0x10, 0x00,
    0x88, 0x14, 0x00,
    0x50, 0x30, 0x00,
    0x00, 0x78, 0x00,
    0x00, 0x68, 0x00,
    0x00, 0x58, 0x00,
    0x00, 0x40, 0x58,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0xBC, 0xBC, 0xBC,
    0x00, 0x78, 0xF8,
    0x00, 0x58, 0xF8,
    0x68, 0x44, 0xFC,
    0xD8, 0x00, 0xCC,
    0xE4, 0x00, 0x58,
    0xF8, 0x38, 0x00,
    0xE4, 0x5C, 0x10,
    0xAC, 0x7C, 0x00,
    0x00, 0xB8, 0x00,
    0x00, 0xA8, 0x00,
    0x00, 0xA8, 0x44,
    0x00, 0x88, 0x88,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0xF8, 0xF8, 0xF8,
    0x3C, 0xBC, 0xFC,
    0x68, 0x88, 0xFC,
    0x98, 0x78, 0xF8,
    0xF8, 0x78, 0xF8,
    0xF8, 0x58, 0x98,
    0xF8, 0x78, 0x58,
    0xFC, 0xA0, 0x44,
    0xF8, 0xB8, 0x00,
    0xB8, 0xF8, 0x18,
    0x58, 0xD8, 0x54,
    0x58, 0xF8, 0x98,
    0x00, 0xE8, 0xD8,
    0x78, 0x78, 0x78,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0xFC, 0xFC, 0xFC,
    0xA4, 0xE4, 0xFC,
    0xB8, 0xB8, 0xF8,
    0xD8, 0xB8, 0xF8,
    0xF8, 0xB8, 0xF8,
    0xF8, 0xA4, 0xC0,
    0xF0, 0xD0, 0xB0,
    0xFC, 0xE0, 0xA8,
    0xF8, 0xD8, 0x78,
    0xD8, 0xF8, 0x78,
    0xB8, 0xF8, 0xB8,
    0xB8, 0xF8, 0xD8,
    0x00, 0xFC, 0xFC,
    0xF8, 0xD8, 0xF8,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00
];

// returns red, blue, or green value for a 
// color between 0x00 and 0x3f
// offsets: 0-red, 1-green, 2-blue
const getColorByte = (color, offset) => {
    return colors[color * 3 + offset];
};

export {
    colors,
    getColorByte
};