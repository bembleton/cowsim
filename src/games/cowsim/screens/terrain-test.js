const WIDTH = 128;
const HEIGHT = 96;
const BYTES_PER_PIXEL = 4;
const BYTES_PER_ROW = BYTES_PER_PIXEL * WIDTH;

const exp = 1.3;
const scale = 5.0;

// const colors = [
//   0x155FD9, // water
//   0x008F32, // light green
//   0x005200, // dark green
//   0x994E00, // dirt
//   0x008F32, // sand
//   0x666666, // rock
// ];

const map_colors = [
  0x155FD9, // water
  0x005200, // grass
  0x005200,
  0x005200,
  0xFECCC5, // sand
  0x666666  // rock
];

const elevation_colors = [
  0x155FD9, // water
  0x008F32, // light grass
  0x005200, // grass
  0x002200, // dark grass
  0xFECCC5, // sand
  0x666666  // rock
];

const cv = document.querySelector('#canvas');
const cv2 = document.querySelector('#canvas2');
const ctx = cv.getContext('2d');
const ctx2 = cv2.getContext('2d');
const buffer = new ImageData(WIDTH, HEIGHT);
const pixels = buffer.data;

simplex = new SimplexNoise();
const noise2d = function (x, y) {
  // x and y should be from 0 to +1 (to prevent tiling)
  // noise2D return values -1 to +1
  // normalize to 0 to +1
  return (simplex.noise2D(x, y) + 1) / 2;
};

const oceanFilter = (x, y) => {
  const nx = x/WIDTH;
  const ny = y/HEIGHT;
  return (1 - Math.pow(2*nx-1, 4)) * (1 - Math.pow(2*ny-1, 4));
};

const elevation = (x, y) => {
  const [nx, ny] = [x / WIDTH, y / WIDTH];

  // oceans
  let n = noise2d(nx * scale, ny * scale);
  n += 0.5 * noise2d(2 * nx * scale, 2 * ny * scale);
  //if (n < 0.5) {
    n += 0.20 * noise2d(4 * nx * scale, 4 * ny * scale);
    n /= 1.7;
  // } else {
  //   n /= 1.5;
  // }
  n *= oceanFilter(x, y);
  const r = Math.pow(n, exp);
  return Math.floor(Math.min(5, r * 8));
};

const getMapColor = (e) => {
  
  return map_colors[e];
};

const setPixel = (idx, color) => {
  const r = 0xff & (color>>16);
  const g = 0xff & (color>>8);
  const b = 0xff & (color);
  pixels.set([r, g, b, 0xFF], idx);
};

const render = () => {
  for (let y=0; y<HEIGHT; y++)
  for (let x=0; x<WIDTH; x++) {
    const idx = (BYTES_PER_ROW * y) + (x * BYTES_PER_PIXEL);
    const e = elevation(x, y);
    const color = map_colors[e];
    setPixel(idx, color);
  }
  ctx.putImageData(buffer, 0, 0);

  for (let y=0; y<HEIGHT; y++)
  for (let x=0; x<WIDTH; x++) {
    const idx = (BYTES_PER_ROW * y) + (x * BYTES_PER_PIXEL);
    const e = elevation(x, y);
    const color = e == 2 
      ? idx%5 == 0 ? 0x666666 : 0x005200
      : map_colors[e];
    setPixel(idx, color);
  }
  ctx2.putImageData(buffer, 0, 0);
};

window.terrain = {
  render
};

render();