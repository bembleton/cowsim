import { choice } from "../../random";
import { Moblin } from "./moblin";
import { Octorok } from "./Octorok";
import { Biome } from "./terrain";

const RedMoblin = { type: Moblin, palette: 1 };
const BlueMoblin = { type: Moblin, palette: 2 };
const BlackMoblin = { type: Moblin, palette: 3 };

const RedOctorok = { type: Octorok, palette: 1 };
const BlueOctorok = { type: Octorok, palette: 2 };

const enemyGroups = {
  0: [RedOctorok],
  1: [RedOctorok, BlueOctorok],
  2: [RedMoblin],
  3: [RedMoblin, BlueMoblin],
  4: [BlackMoblin],
  5: [RedMoblin, BlackMoblin, BlueOctorok],
  6: '',
  7: '',
  8: 'peahats',
  9: 'peahats_and_lynels',
  10: 'lynels_red',
  11: 'ghost', // custom
  12: 'lynels_blue',
  13: 'tektites_blue',
  14: 'none',  // custom
  15: 'custom' // based on screen type
};

const enemyGroupsByBiome = {
  [Biome.water]:     [1],
  [Biome.plains]:    [0, 1],
  [Biome.forest]:    [2, 3, 4],
  [Biome.hills]:     [1, 4, 5],
  [Biome.desert]:    [],
  [Biome.mountains]: [],
};

export const getEnemiesForBiome = (biome) => {
  const groups = enemyGroupsByBiome[biome];
  if (!groups.length) return [];
  const group = choice(groups);
  return enemyGroups[group];
}

export const createEnemy = (type, x, y, options) => new type(x, y, options);
