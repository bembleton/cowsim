import Console from './console';
import Game from './games/cowsim';

const canvas = document.getElementById('canvas');
const powerButton = document.getElementById('btnPower');
const resetButton = document.getElementById('btnReset');
const pauseButton = document.getElementById('btnPause');
const stepButton = document.getElementById('btnStep');

const volumeSlider = document.getElementById('sliderVolume');
const volumeButton = document.getElementById('btnMute');

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
  const playIcon = console.paused ? '#icon-play' : '#icon-pause';
  pauseButton.innerHTML = `<svg viewBox="0 0 100 100" class="icon"><use xlink:href="${playIcon}"></use></svg>`;
  stepButton.disabled = !console.paused;
  const volumeIcon = console.muted ? '#icon-mute' : '#icon-volume';
  volumeButton.innerHTML = `<svg viewBox="0 0 100 100" class="icon"><use xlink:href="${volumeIcon}"></use></svg>`;
}

volumeSlider.oninput = () => {
  console.setVolume(volumeSlider.value);
};

volumeButton.onclick = () => {
  console.toggleMute();
  updateButtons();
}

// load a game
const game = new Game();
console.load(game);

// turn on now
powerButton.click();