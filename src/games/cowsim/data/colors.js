//const white = 0x20;
const black = 0x3f;
const red = 0x16;
const gray = 0x00;
const blue = 0x11;

// terrain colors
const lightgreen = 0x1b;
const darkgreen = 0x0a;
const darkblue = 0x12;
const lightblue = 0x21;
const tan = 0x37;
const brown = 0x07;
const darkgray = 0x2d;
const lightgray = 0x3d;
const white = 0x30;

const grassAndWater = [lightgreen, darkgreen, darkblue, lightblue];
const grassAndDirt = [lightgreen, darkgreen, tan, brown];
const grays = [tan, darkgray, lightgray, white];
const brownTanGreen = [black, 0x06, 0x27, 0x2A];
const blues = [black, blue, gray, white];
const miniMap = [blue, 0x0a, 0x36, gray];
const reds = [black, 0x06, 0x16, white];
const seagreens = [black, 0x0b, 0x2b, white]
const golds = [black, black, 0x27, white];
const blueRedWhite = [black, blue, red, white];

export const colors = {
  black,
  red,
  gray,
  blue,
  lightgreen,
  darkgreen,
  darkblue,
  lightblue,
  tan,
  brown,
  darkgray,
  lightgray,
  white,
};

export const palettes = {
  grassAndWater,
  grassAndDirt,
  grays,
  miniMap,
  reds,
  blues,
  seagreens,
  golds,
  brownTanGreen,
  blueRedWhite
};
