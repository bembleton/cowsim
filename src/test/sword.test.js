import { getRandomSword } from "../games/cowsim/sword"

describe('sword', () => {
  describe('getRandomSword', () => {
    it('should return a random sword', () => {
      const results = [];
      for (let i=0; i<200; i++) {
        const sword = getRandomSword();
        results.push(sword);
      }

      const histo = {
        green: 0,
        red: 0,
        blue: 0,
      };

      const colors = ['green','red','blue'];
      for (const x of results) {
        const { name, palette, attack, speed } = x;
        const color = colors[palette];
        histo[color] += 1;
        histo[name] = histo[name] || {
          green: 0, red: 0, blue: 0, total: 0,
          avg_attack: 0, avg_speed: 0
        };
        histo[name][color] += 1;
        histo[name].total += 1;
        histo[name].avg_attack = (histo[name].avg_attack * (histo[name].total-1) + attack) / histo[name].total;
        histo[name].avg_speed = (histo[name].avg_speed * (histo[name].total-1) + speed) / histo[name].total;
      }

      // console.log(JSON.stringify(histo, null, 2));
    })
  })
})