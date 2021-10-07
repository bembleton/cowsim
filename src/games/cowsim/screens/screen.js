import { getButtonState, buttons } from '~/controller';

export class GameScreen {
  constructor(game) {
    this.game = game;
  }

  updateButtonStates() {
    this.previousButtonState = this.buttonState || {};
    this.buttonState = getButtonState();
  }

  wasPressed(button) {
    const { previousButtonState = {}, buttonState = {} } = this;
    return previousButtonState[button] === false && buttonState[button] === true;
  }
  
  wasReleased(button) {
    const { previousButtonState = {}, buttonState = {} } = this;
    return previousButtonState[button] === true && buttonState[button] === false;
  }
}