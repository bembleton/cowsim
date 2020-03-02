import bmp from 'bmp-js';

const loadBitmap = (bmpBuffer, setData) => {
    var bmpData = bmp.decode(bmpBuffer);
    const width = bmpData.width;
    const height = bmpData.height;
    if (width !== 128 || height !== 128) {
        throw new Error(`incorrect bitmap size ${width}x${height}`);
    }
    const data = bmpData.data;
    const length = data.length / 4; // 4 bytes per pixel
    let value = 0;
    for (var i=0;i<length;i++) {
        const blue = data[i*4 + 1];
        const color = (blue >> 6) & 0x03; // 0,1,2,3
        value = (value << 2) & 0xff | color;
        if (i % 4 === 3) {
            const adr = i >> 2;
            setData(adr, value);
        }
    }
};

export default loadBitmap;
