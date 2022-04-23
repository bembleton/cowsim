import gamepadstate, * as gamepad from './input/gamepad';
import keystate, * as keyboard from './input/keybindings';
import touchstate, * as touchDevice from './input/touch';

const { inputs, isPressed: gamepadPressed, getAxis } = gamepadstate;

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


// callbacks raised whenever any input is detected
const inputCallbacks = [];
const raiseInputEvent = () => inputCallbacks.forEach(x => x());

touchDevice.addInputListener(raiseInputEvent);
keyboard.addInputListener(raiseInputEvent);
gamepad.addInputListener(raiseInputEvent);

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

export const addInputListener = (callback) => {
  inputCallbacks.push(callback);
};

export { isPressed, buttons, getButtonState };
