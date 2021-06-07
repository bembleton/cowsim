import { bbox } from "../boundingBox"

describe('bbox', () => {
  describe('{x:2, y:3, width:4, height:5}', () => {
    it.each([
      [0, 0, false],
      [3, 2, false],
      [2, 3, true],
      [6, 8, false],
      [5, 8, false],
      [5, 7, true],
      [10, 10, false],
    ])('contains(%s, %s) should return %s', (x, y, expected) => {
      const box = new bbox(2, 3, 4, 5);
      const actual = box.contains(x, y);
      expect(actual).toBe(expected);
    });

    it.each([
      [0,0,4,5],
      [5,7,2,2],
      [3,0,10,10]
    ])('intersects should return true for overlapping boxes', (x,y,w,h) => {
      const a = new bbox(2, 3, 4, 5); // (2,3) - (6,8)
      const b = new bbox(x, y, w, h); //
      const actual = a.intersects(b);
      expect(actual).toBe(true);
    });

    it.each([
      [0,0,0,0],
      [6,8,2,2],
      [3,0,10,2],
      [0,4,2,10]
    ])('intersects should return false for non-overlapping boxes', (x,y,w,h) => {
      const a = new bbox(2, 3, 4, 5); // (2,3) - (6,8)
      const b = new bbox(x, y, w, h); // 
      const actual = a.intersects(b);
      expect(actual).toBe(false);
    });
  });
});
