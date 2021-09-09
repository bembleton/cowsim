import Console from './console';
import Game from './games/cowsim';

const canvas = document.getElementById('canvas');
const powerButton = document.getElementById('btnPower');
const resetButton = document.getElementById('btnReset');
const pauseButton = document.getElementById('btnPause');
const stepButton = document.getElementById('btnStep');

const volumeSlider = document.getElementById('sliderVolume');
// todo: run and step controls

const console = new Console(canvas);
window.cowsim = console;

powerButton.onclick = async () => {
  await console.power();
  updateButtons();
};

resetButton.onclick = async () => {
  await console.reset();
};

pauseButton.onclick = () => {
  if(console.paused) {
    console.run();
  } else {
    console.pause();
  }
  updateButtons();
};

stepButton.onclick = () => {
  console.step();
};

function updateButtons() {
  powerButton.className = console.on ? 'ON' : 'OFF';
  const icon = console.paused ? '#icon-play' : '#icon-pause';
  pauseButton.innerHTML = `<svg viewBox="0 0 100 100" class="icon"><use xlink:href="${icon}"></use></svg>`;
  stepButton.disabled = !console.paused;
}

volumeSlider.oninput = () => {
  console.setVolume(volumeSlider.value);
};

// load a game
const game = new Game();
console.load(game);

// turn on now
powerButton.click();