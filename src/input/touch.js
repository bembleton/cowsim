//const keys = keyevents();
const touchstate = {};
let debug = false;
// keys
const UP = 'ArrowUp';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const DOWN = 'ArrowDown';
const A = 'z';
const B = 'x';
const SELECT = 'a';
const START = 's';

// callbacks raised whenever any input is detected
const inputCallbacks = [];
const raiseInputEvent = () => {
  inputCallbacks.forEach(x => x());
};

/** Adds touch+mouse input to the following html button controls */
/** Inputs are mapped to keystate */

// UI elements
const touchPanel = document.getElementById('touchPanel');

const dpad = document.getElementById('btnDpad');
const dpadGradient = document.getElementById('dpadGradient');

const btnSelect = document.getElementById('btnSelect');
const btnStart = document.getElementById('btnStart');
const btnB = document.getElementById('btnB');
const btnA = document.getElementById('btnA');


touchPanel.addEventListener('touchstart', startTouches, { passive: false });
touchPanel.addEventListener('touchmove', updateTouches, { passive: false });
touchPanel.addEventListener('touchend', endTouches, { passive: false });

// desktop support
touchPanel.addEventListener('mousedown', handleMousedown, true);
touchPanel.addEventListener('mousemove', handleMousedown, true);
touchPanel.addEventListener('mouseup', handleMouseRelease, true);


const ongoingTouches = [];
function copyTouch({ pageX, pageY, identifier }) { return { pageX, pageY, identifier } };

function startTouches(ev) {
  ev.preventDefault();
  const touches = [...ev.changedTouches].map(copyTouch);
  ongoingTouches.push(...touches);
  raiseInputEvent();
  checkTouchState();
}
function updateTouches(ev) {
  ev.preventDefault();
  const touches = [...ev.changedTouches].map(copyTouch);
  touches.forEach(t => {
    const idx = ongoingTouches.findIndex(x => x.identifier === t.identifier);
    if (idx > -1) ongoingTouches[idx] = t;
  });
  checkTouchState();
}
function endTouches(ev) {
  ev.preventDefault();
  [...ev.changedTouches].forEach(t => {
    const idx = ongoingTouches.findIndex(x => x.identifier === t.identifier);
    if (idx > -1) ongoingTouches.splice(idx, 1);
  });
  checkTouchState();
}

function checkTouchState() {
  const dpadBounds = dpad.getBoundingClientRect();
  const dpadTouch = ongoingTouches.find(t => contains(dpadBounds, t.pageX, t.pageY));
  if (dpadTouch) {
    handleDpadPress(dpadTouch.pageX, dpadTouch.pageY);
  } else {
    handleDpadRelease();
  }

  const selectBounds = btnSelect.getBoundingClientRect();
  const startBounds = btnStart.getBoundingClientRect();
  const bBounds = btnB.getBoundingClientRect();
  const aBounds = btnA.getBoundingClientRect();

  const selectPressed = ongoingTouches.some(t => contains(selectBounds, t.pageX, t.pageY));
  const startPressed = ongoingTouches.some(t => contains(startBounds, t.pageX, t.pageY));
  const bPressed = ongoingTouches.some(t => contains(bBounds, t.pageX, t.pageY));
  const aPressed = ongoingTouches.some(t => contains(aBounds, t.pageX, t.pageY));

  updateButton(btnSelect, SELECT, 'system-button', selectPressed);
  updateButton(btnStart, START, 'system-button', startPressed);
  updateButton(btnB, B, 'action-button', bPressed);
  updateButton(btnA, A, 'action-button', aPressed);
}


function handleMousedown(ev) {
  ev.preventDefault();
  raiseInputEvent();
  if (ev.buttons === 1) {
    const dpadBounds = dpad.getBoundingClientRect();
    if (contains(dpadBounds, ev.x, ev.y)) handleDpadPress(ev.x, ev.y);
    checkButton(ev, btnSelect, SELECT, 'system-button');
    checkButton(ev, btnStart, START, 'system-button');
    checkButton(ev, btnB, B, 'action-button');
    checkButton(ev, btnA, A, 'action-button');
  } else {
    handleMouseRelease();
  }
}

function handleMouseRelease() {
  handleDpadRelease();
  touchstate[SELECT] = false;
  touchstate[START] = false;
  touchstate[B] = false;
  touchstate[A] = false;
  btnSelect.setAttribute('class', 'system-button');
  btnStart.setAttribute('class', 'system-button');
  btnB.setAttribute('class', 'action-button');
  btnA.setAttribute('class', 'action-button');
}


function contains(bounds, x, y) {
  return x >= bounds.left && x<= bounds.right && y <= bounds.bottom && y >= bounds.top;
}

function checkButton(ev, button, input, buttonClass) {
  const bounds = button.getBoundingClientRect();
  const pressed = contains(bounds, ev.x, ev.y);
  updateButton(button, input, buttonClass, pressed)
}

function updateButton(button, input, buttonClass, pressed) {
  button.setAttribute('class', `${buttonClass}${pressed ? ' pressed' : ''}`);
  touchstate[input] = pressed;
}

// dpad
function handleDpadPress(x, y) {
  // distance from dpad center
  const bounds = dpad.getBoundingClientRect();
  const [dx, dy] = [x - bounds.x - bounds.width/2, y - bounds.y - bounds.height/2];
  // convert to 8-way direction
  if (Math.sqrt(dx*dx + dy*dy)/(bounds.width/2) > 0.3) {
    const theta = Math.atan2(-dy, dx);
    const deg = theta > 0 ? theta * 360/(2*Math.PI) : 360 + theta * 360/(2*Math.PI);

    const dir = Math.floor(deg / 45 + 0.5) % 8;
    touchstate[RIGHT] = dir == 7 || dir <= 1;
    touchstate[UP] = dir >= 1 && dir <= 3;
    touchstate[LEFT] = dir >= 3 && dir <= 5;
    touchstate[DOWN] = dir >= 5;
    dpad.setAttribute('class', 'dpad pressed');
    dpadGradient.setAttribute('gradientTransform', `rotate(${-dir * 45} 0.5 0.5)`);
  } else {
    handleDpadRelease();
  }
}

function handleDpadRelease(ev) {
  touchstate[RIGHT] = false;
  touchstate[UP] = false;
  touchstate[LEFT] = false;
  touchstate[DOWN] = false;
  dpad.setAttribute('class', 'dpad');
}

// [
//   ['btnUp', UP],
//   ['btnDown', DOWN],
//   ['btnLeft', LEFT],
//   ['btnRight', RIGHT],
//   ['btnSelect', SELECT],
//   ['btnStart', START],
//   ['btnB', B],
//   ['btnA', A],
// ].forEach(([btn, input]) => {
//   const el = document.getElementById(btn);
//   if (!el) return;
//   el.ontouchstart = (e) => {
//     touchstate[input] = true;
//     e.preventDefault();
//   };
//   el.onmousedown = (e) => {
//     touchstate[input] = true;
//     e.preventDefault();
//   };
//   el.ontouchend = (e) => {
//     touchstate[input] = false;
//     e.preventDefault();
//   };
//   el.onmouseup = (e) => {
//     touchstate[input] = false;
//     e.preventDefault();
//   };
// });



export const addInputListener = (callback) => {
  inputCallbacks.push(callback);
};
export const removeInputListener = (callback) => {
  inputCallbacks.filter2(x => x === callback);
}

export default touchstate;
