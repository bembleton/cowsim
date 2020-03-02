import Game from './game';
import './dark.css';

const canvas = document.getElementById('canvas');
const game = new Game(canvas);

window.game = game;

document.getElementById('btnReset').onclick = (e) => {
    game.reset();
};

game.reset();
game.start();
