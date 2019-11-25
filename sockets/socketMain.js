/**
 * Where all our main socket stuff will live.
 * Begin by bringing in IO
 */

const io = require("../servers").io;

/**
 * Get our collisions checker
 */

const checkForOrbCollisions = require("./checkCollisions")
  .checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollisions")
  .checkForPlayerCollisions;

/**
 * Get our player classes
 */

const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");

/**
 * Get our Orb class
 */

const Orb = require("./classes/Orb");
let orbs = [];

/**
 * All the players
 */

let players = [];

/**
 * Our game settings
 */

let settings = {
  defaultOrbs: 800,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5, // As a player gets bigger this needs to zoom out,
  worldWidth: 2200,
  worldHeight: 2200
};

/**
 * Runs once at the beginning of server start up
 */

initGame();

setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("tock", {
      players
    });
  }
}, 33);

/**
 * On new client connection
 */

io.sockets.on("connect", socket => {
  // A player has connected
  let player = {};

  socket.on("init", data => {
    // Add the player to the namespace
    socket.join("game");
    // Make a player config object
    let playerConfig = new PlayerConfig(settings);
    // Make a player data object
    let playerData = new PlayerData(data.playerName, settings);
    // Make a master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);

    /**
     * Issue a message to this client with its loc at a rate of 30 fps
     */

    setInterval(() => {
      socket.emit("tickTock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY
      });
    }, 33); // There are 30 33s in 1000 milliseconds or 1/30th a sec = 30fps

    socket.emit("initReturn", {
      uid: playerData.uid, // Send back ID to access later
      orbs
    });

    players.push(playerData);
  });

  /**
   * The client sent over a tick
   * that means we know what direction to move the player
   */

  socket.on("tick", data => {
    speed = player.playerConfig.speed;
    // update the playerConfig object with the new direction in data
    // and at the same time create a local variable for this callback for readability
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }

    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    /**
     * ORB COLLISION AND UPDATE
     */

    capturedOrb
      .then(data => {
        // Then runs if resolved runs
        // A collision happened
        // Emit to all sockets the orb to remove
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data]
        };

        // Every socket needs to know the leaderboard has changed
        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        io.sockets.emit("orbSwitch", orbData);
      })
      .catch(() => {
        // Catch runs if reject runs
      });

    /**
     * PLAYER COLLISION
     */
    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );

    playerDeath
      .then(data => {
        // Player collision
        // Every socket needs to know the leaderboard has changed
        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        // A player was absorbed let everyone know
        io.sockets.emit("playerDeath", data);
      })
      .catch(() => {
        // No player collision
      });
  });

  socket.on("disconnect", data => {
    // Find out who just left
    // Find out which player / element to splice out of players array
    // Make sure the player exists first
    if (player.playerData) {
      players.forEach((curPlayer, i) => {
        // If they match...
        if (curPlayer.uid === player.playerData.uid) {
          // Found match
          players.splice(i, 1);
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        }
      });
    }
  });
});

function getLeaderBoard() {
  // sort players in desc order
  players.sort((a, b) => {
    return a.score - b.score;
  });

  let leaderBoard = players.map(curPlayer => {
    return {
      name: curPlayer.name,
      score: curPlayer.score
    };
  });

  return leaderBoard;
}

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
