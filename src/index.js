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

game.reset();
game.start();
