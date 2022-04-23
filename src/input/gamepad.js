const haveEvents = 'ongamepadconnected' in window;
const controllers = {};

// callbacks raised whenever any input is detected
const inputCallbacks = [];
const raiseInputEvent = () => {
  inputCallbacks.forEach(x => x());
};

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

// backwards compatibility
function scangamepads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }

  requestAnimationFrame(scangamepads);
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  requestAnimationFrame(scangamepads);
}

// 360 gamepad mapping
const inputs = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  BACK: 8,
  START: 9,

  dpad: {
    UP: 12,
    DOWN: 13,
    LEFT: 14,
    RIGHT: 15,
  },
  trigger: {
    LEFT: 6,
    RIGHT: 7
  },
  axis: {
    left: {
      X: 0,
      Y: 1
    },
    right: {
      X: 2,
      Y: 3
    }
  }
};

const isPressed = (input) => {
  if (!controllers[0]) return false;
  const val = controllers[0].buttons[input];
  const pressed = typeof(val) == "object" ? val.pressed : val > 0.7;
  if (pressed) raiseInputEvent();
  return pressed;
};

const getAxis = (axis) => {
  if (!controllers[0]) return false;
  return controllers[0].axes[axis];  // -1 to 1
};

export const addInputListener = (callback) => {
  inputCallbacks.push(callback);
};
export const removeInputListener = (callback) => {
  inputCallbacks.filter2(x => x === callback);
}

export default { inputs, isPressed, getAxis };
