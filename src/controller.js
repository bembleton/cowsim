// import { inputs, isPressed } from './gamepad';
import keystate from './keybindings';

const buttons = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  A: 'A',
  B: 'B',
  SELECT: 'SELECT',
  START: 'START'
};

const buttonsToKeys = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  A: 'z',
  B: 'x',
  SELECT: 'a',
  START: 's'
}

const isPressed = (button) => {
  const key = buttonsToKeys[button];
  return keystate[key]; // or controller pressed
};

// handle gamepad 
export { isPressed, buttons };
