/**
 * Using UUID to generate a random user ID
 */

const uuidv4 = require("uuid/v4");

/**
 * This is where all the data that everyone needs to know about lives
 */

class PlayerData {
  constructor(playerName, settings) {
    this.uid = uuidv4(); // This will generate a random string as an ID
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 100);
    this.locY = Math.floor(settings.worldWidth * Math.random() + 100);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
    this.orbsAbsorved = 0;
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 200 + 50);
    const g = Math.floor(Math.random() * 200 + 50);
    const b = Math.floor(Math.random() * 200 + 50);

    return `rgb(${r}, ${g}, ${b})`;
  }
}

module.exports = PlayerData;
