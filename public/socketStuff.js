let socket = io.connect("http://space-agar-io.herokuapp.com:80");

/**
 * Gets called when player presses start game button
 */

function init() {
  // Start drawing the screen
  draw();
  alive = true;

  // Can the init event when the client is ready to receive data
  socket.emit("init", {
    playerName: player.name
  });
}

/**
 * Server sends back all of the information on client init
 */

socket.on("initReturn", data => {
  player.uid = data.uid;
  orbs = data.orbs;

  setInterval(() => {
    if (player.xVector) {
      socket.emit("tick", {
        xVector: player.xVector,
        yVector: player.yVector
      });
    }
  }, 33);
});

/**
 * Server sends back all players information at 30 fps
 */

socket.on("tock", data => {
  players = data.players;
});

/**
 * Updates the orbs
 */

socket.on("orbSwitch", data => {
  // console.log(data);
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on("tickTock", data => {
  player.locX = data.playerX;
  player.locY = data.playerY;
});

socket.on("updateLeaderBoard", data => {
  document.querySelector(".leader-board").innerHTML = "";
  data.forEach(curPlayer => {
    document.querySelector(
      ".leader-board"
    ).innerHTML += `<li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>`;
  });

  console.log(player);

  // document.querySelector(".player-score").innerText = player.score;
});

socket.on("playerDeath", data => {
  document.querySelector(
    "#game-message"
  ).innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`;
  $("#game-message").css({
    "background-color": "#00e6e6",
    opacity: 1
  });
  $("#game-message").show();
  $("#game-message").fadeOut(5000);

  // Get the uid
  // If it matches this players id
  // then set boolean alive false
  // Block the camera clamp
  // trigger rejoin modal
  if (data.died.uid === player.uid) {
    alive = false;
    $("#loginModal").modal("show");
  }
});
