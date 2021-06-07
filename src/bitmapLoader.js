import bmp from 'bmp-js';

const loadBitmap = async (url, setData) => {
    const res = await fetch(url);
    const arryBuffer = await res.arrayBuffer();
    var bmpData = bmp.decode(Buffer.from(arryBuffer));
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
            setData(adr, value); // 4 pixels per byte
        }
    }
};

export const loadBitmapInto = async (url, bitmapArray) => {
  await loadBitmap(url, (adr, val) => bitmapArray[adr] = val);
}

/** Copies an 8x8 sprite from one buffer into another  */
export const copyBitmap = (source, target, srcIndex, targetIndex) => {
  // 2x8 bytes
  const sOffset = srcIndex << 4;
  const tOffset = targetIndex << 4;
  for (let i=0; i<8; i++) {
    const sIdx = sOffset + (i<<4);
    const tIdx = tOffset + (i<<4);
    target[tIdx] = source[sIdx];
    target[tIdx+1] = source[sIdx+1];
  }
};

export default loadBitmap;
