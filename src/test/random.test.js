import { accumulateChance, getRareItem } from "../random"

describe('random', () => {
  describe('accumulateChance', () => {
    it('should return 50% chance for two items of equal rarity', () => {
      const items = [
        { rarity: 10 },
        { rarity: 10 }
      ]

      accumulateChance(items);

      expect(items[0].chance).toEqual(0.5)
    });

    it('should return % chance based on the accumulated chance', () => {
      const items = [
        { rarity: 10 },
        { rarity: 40 },
        { rarity: 20 },
        { rarity: 30 }
      ]

      accumulateChance(items);

      expect(items[0].chance).toEqual(0.1)
      expect(items[1].chance).toEqual(0.1 + 0.4)
      expect(items[2].chance).toEqual(0.1 + 0.4 + 0.2)
      expect(items[3].chance).toEqual(0.1 + 0.4 + 0.2 + 0.3)
    })

    
  })

  describe('getRareItem', () => {
    it('should return the first item over a % chance', () => {
      const items = [
        { name: 'a', rarity: 10 }, // 0.1
        { name: 'b', rarity: 40 }, // 0.5
        { name: 'c', rarity: 20 }, // 0.7
        { name: 'd', rarity: 30 }  // 1.0
      ]

      accumulateChance(items);
      expect(getRareItem(items, 0.0).name).toBe('a');
      expect(getRareItem(items, 0.5).name).toBe('b');
      expect(getRareItem(items, 0.6).name).toBe('c');
      expect(getRareItem(items, 0.9).name).toBe('d');
    })
  })
})