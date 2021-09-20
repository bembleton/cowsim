const keystate = {};
let debug = false;

document.addEventListener('keydown', (event) => {
  const { code, key } = event;
  if (keyCodes.hasOwnProperty(code) || keys.hasOwnProperty(key)) event.preventDefault();
  else return;

  const keyCode = keys[key] || keyCodes[code];  // try key first and fallback to the physical Key
  keystate[keyCode] = true;
  
}, false);

document.addEventListener('keyup', (event) => {
  const { code, key } = event;
  if (keyCodes.hasOwnProperty(code) || keys.hasOwnProperty(key)) event.preventDefault();
  else return;

  const keyCode = keys[key] || keyCodes[code];  // try key first and fallback to the physical Key
  keystate[keyCode] = false;
}, false);

/** KeyboardEvent.key should map to the printed character it produces,
 * or the effect it has for control and navigation.
 * 
 * This might not work on mac keyboards? */
const keys = {
  ArrowUp: 'ArrowUp',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  z: 'z',
  Z: 'z',
  x: 'x',
  X: 'x',
  a: 'a',
  A: 'a',
  s: 's',
  S: 's',
  "`": 'Tilde'
}

/** KeyboardEvent.code are physical layout codes and not representative of the imprinted key
 * The codes below are only for qwerty keyboards. =[
 */
const keyCodes = {
  KeyA: 'a',
  KeyS: 's',
  KeyZ: 'z',
  KeyX: 'x',
  ArrowUp: 'ArrowUp',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
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
