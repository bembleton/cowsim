//const white = 0x20;
const black = 0x3f;
const gray = 0x00;
const white = 0x30;

const navy = 0x02;
const blue = 0x12;
const lightblue = 0x22;

const darkred = 0x06;
const red = 0x16;

const darkbrown = 0x07;
const brown = 0x17;
const gold = 0x27;
const tan = 0x37;

const darkgreen = 0x0a;
const green = 0x2A;
const lightgreen = 0x1b;

// terrain colors
const darkblue = 0x12;
const darkgray = 0x2d;
const lightgray = 0x3d;


const blues = [black, blue, gray, white];
const miniMap = [blue, darkgreen, tan, gray];
const reds = [black, red, gold, white];
const seagreens = [black, 0x0b, 0x2b, white]
const golds = [black, black, gold, white];
const blueRedWhite = [black, blue, red, white];


// terrain palettes
const grassAndWater = [lightgreen, darkgreen, blue, lightblue];
const grassAndDirt = [lightgreen, darkgreen, tan, 0x26];
const grays = [tan, black, darkgray, lightgray];

const blacks1 = [black, black, black, black];
const blacks2 = [black, black, black, darkgray];
const blacks3 = [darkgray, black, darkgray, darkgray];
const blacks4 = [lightgray, black, darkgray, lightgray];

// sprite palettes
const greenTanBrown = [black, green, gold, brown];
const redGoldWhite = [black, red, gold, white];
const navyBlueWhite = [black, navy, lightblue, white];
const redBlackBlue = [black, black, 0x0b, red];

export const colors = {
  black,
  red,
  darkred,
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
  greenTanBrown,
  redGoldWhite,
  navyBlueWhite,
  blueRedWhite,
  redBlackBlue,
  blacks1,
  blacks2,
  blacks3,
  blacks4
};
