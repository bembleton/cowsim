export class Direction {
  static up = 'up';
  static down = 'down';
  static left = 'left';
  static right = 'right';

  static flipped = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }

  static isVertical = (dir) => dir === Direction.up || dir === Direction.down;
  static isHorizontal = (dir) => !Direction.isVertical(dir);
}