// import keyevents from 'key-events';

//const keys = keyevents();
const keystate = {};
let debug = false;

document.addEventListener('keydown', (event) => {
    const { key, keyCode } = event;
    if (keystate[key]) return;
    keystate[key] = true;
    if (key === '`') debug = !debug;
    if (debug) console.log(`keydown: ${key}`);
}, false);

document.addEventListener('keyup', (event) => {
    const { key, keyCode } = event;
    if (keystate[key] === false) return;
    keystate[key] = false;
    if (debug) console.log(`keyup: ${key}`);
}, false);


const UP = 'ArrowUp';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const DOWN = 'ArrowDown';
const ACTION = '';
const JUMP = ' ';

export default keystate;
