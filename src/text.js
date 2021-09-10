import ppu from './ppu';
const { setNametable } = ppu;

const characters= "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:!$'.? ";
const unknown = characters.indexOf(' ');
const text = (tilex, tiley, str) => {
    const upper = str.toUpperCase();
    for (let i=0; i<upper.length; i++) {
        const char = upper.charAt(i);
        let tile = characters.indexOf(char);
        if (tile < 0) tile = unknown;
        setNametable(tilex + i, tiley, tile);
    }
};

export default text;