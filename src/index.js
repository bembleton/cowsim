import Game from './game';
import './dark.css';

const canvas = document.getElementById('canvas');
const game = new Game(canvas);

const fps = document.getElementById('fps');

game.onUpdate = () => {
    if (fps) fps.textContent = game.fps;
};

window.game = game;

document.getElementById('btnReset').onclick = (e) => {
    game.reset();
};

var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    game.pause();
  } else {
    game.play();
  }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false);

// start
game.reset();
game.play();