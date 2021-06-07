const keystate = {};
let debug = false;



document.addEventListener('keydown', (event) => {
  const { key, keyCode } = event;
  if (keys.hasOwnProperty(key)) event.preventDefault();
  else return;

  if (keystate[key]) return;
  keystate[key] = true;
  if (key === '`') debug = !debug;
  if (debug) console.log(`keydown: ${key}`);
}, false);

document.addEventListener('keyup', (event) => {
  const { key, keyCode } = event;
  if (keys.hasOwnProperty(key)) event.preventDefault();
  else return;
  event.preventDefault();
  if (keystate[key] === false) return;
  keystate[key] = false;
  if (debug) console.log(`keyup: ${key}`);
}, false);

const keys = {
  ArrowUp: 'ArrowUp',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  z: 'z',
  x: 'x',
  a: 'a',
  s: 's'
}

const UP = 'ArrowUp';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const DOWN = 'ArrowDown';
const A = 'z';
const B = 'x';
const SELECT = 'a';
const START = 's';

export default keystate;
