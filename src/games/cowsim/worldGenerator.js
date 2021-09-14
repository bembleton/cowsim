import { Randy } from "../../random";
import { Terrain } from "./terrain";

const screenWidth = 16;  // tiles
const screenHeight = 12; // tiles
const mapWidth = screenWidth * 16;  // 256 tiles
const mapHeight = screenHeight * 16; // 192 tiles



export class World {
  /** gets a unique id for a world position, normalized to an area */
  static getAreaId(posx, posy) {
    const { x, y} = World.getAreaTopLeft(posx, posy);
    return (x/screenWidth) + (16 * y/screenHeight);
  }
  static getAreaPosition(id) {
    const x = (id % 16) * screenWidth;
    const y = Math.floor(id / 16) * screenHeight;
    return { x, y };
  }
  static getAreaTopLeft(x, y) {
    return {
      x: x - (x % screenWidth),
      y: y - (y % screenHeight)
    }
  }
}

/**
 * Finds a map tile {x,y} meeting the specified filter constraints.
 * Returns null if a suitable tile cannot be found in the number of attempts specified,
 */
const findTile = (terrain, randomizer, { areaId, elevation, position }, attempts = 20) => {
  let pos;
  while (attempts-- > 0) {
    let area_id = areaId;
    if (area_id === undefined) {
      // random area
      area_id = randomizer.nextInt(16*16);
    }
    const { x: posx, y: posy } = World.getAreaPosition(area_id);

    // avoiding screen edges
    pos = {
      x: randomizer.nextInt(screenWidth-2) + 1 + posx,
      y: randomizer.nextInt(screenHeight-2) + 1 + posy
    }
    
    if (elevation) {
      let e = terrain.elevation(pos.x, pos.y);
      if (!elevation(e)) continue;
    }

    if (position && !position(pos)) continue;

    return pos;
  }
  return null; // sadness
};

export default class WorldGenerator {
  static generate(seed) {
    const randomizer = new Randy(seed + 0x131D1957);
    const terrain = new Terrain(seed);

    // draw the world map
    const ctx = document.getElementById('mapCanvas').getContext('2d');
    terrain.drawMapImage(ctx);

    const startingLocation = findTile(terrain, randomizer, {
      elevation: Terrain.isGrass
    });
    const mapEntities = []; // chests, dungeons, etc.  One entity per Area

    // add starting area chest
    const { x, y } = startingLocation;
    const startingArea = World.getAreaId(x, y);
    // find a tile that isnt the starting location
    const tile = findTile(terrain, randomizer, {
      areaId: startingArea,
      elevation: Terrain.isPassable,
      position: (pos) => (pos.x !== x && pos.y !== y)
    });

    mapEntities[startingArea] = { type: 'Chest', x: tile.x, y: tile.y, contents: 'WOODEN_SWORD' };

    // todo: add other entities

    return {
      terrain,
      startingLocation,
      mapEntities
    }
  }
}