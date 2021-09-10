import { inputs, isPressed as gamepadPressed, getAxis } from './input/gamepad';
import keystate from './input/keybindings';
import touchstate from './input/touch';

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
};

const buttonsToGamepadInputs = {
  UP: inputs.dpad.UP,
  DOWN: inputs.dpad.DOWN,
  LEFT: inputs.dpad.LEFT,
  RIGHT: inputs.dpad.RIGHT,
  A: inputs.A,
  B: inputs.B,
  SELECT: inputs.BACK,
  START: inputs.START
};

const hasAnalogStickEquivalent = (button) => {
  switch (button) {
    case buttons.UP:
      return getAxis(inputs.axis.left.Y) < -0.38;
    case buttons.DOWN:
      return getAxis(inputs.axis.left.Y) > 0.38;
    case buttons.RIGHT:
      return getAxis(inputs.axis.left.X) > 0.38;
    case buttons.LEFT:
      return getAxis(inputs.axis.left.X) < -0.38;
    default:
      return false;
  }
};

/**
 * Checks keyboard and gamepad inputs
 * This only detects if the button is currently pressed and does not know if it was pressed in a previous frame.
 * @param {*} button 
 */
const isPressed = (button) => {
  const key = buttonsToKeys[button];
  const input = buttonsToGamepadInputs[button];

  return keystate[key] || touchstate[key] || gamepadPressed(input) || hasAnalogStickEquivalent(button);
};

const getButtonState = () => {
  const state = {};
  for (const button in buttons) {
    state[button] = isPressed(button);
  }
  return state;
}

// handle gamepad 
export { isPressed, buttons, getButtonState };
