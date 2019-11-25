/**
 * Drawing
 */

// Random start in the world
// player.locX = Math.floor(500 * Math.random() + 10);
// player.locY = Math.floor(500 * Math.random() + 10);

function draw() {
  // Reset the transform translate
  context.setTransform(1, 0, 0, 1, 0, 0);

  // Clean the entire canvas out from top left corner until bottom
  // So the old stuff is gone from the last frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (alive) {
    // Clamp the camera to the player
    const camX = -player.locX + canvas.width / 2;
    const camY = -player.locY + canvas.height / 2;
    // Translate allows us to move the canvas around
    context.translate(camX, camY);
  }

  /**
   * Draw all the players
   */

  players.forEach(p => {
    // Begin drawing in the context
    context.beginPath();
    // Whatever we draw, this is the colour
    context.fillStyle = p.color;
    // Gives us the ability to draw an arc on canvas
    // The first two arguements are x and y for the center of the circle
    // The third arg is the radius
    // The fourth arg is where to begin drawing (Radians)
    // The fith arg is where to stop (Radians)
    context.arc(p.locX, p.locY, p.radius, 0, Math.PI * 2);
    // context.arc(200, 200, 10, 0, Math.PI * 2);

    // Actually draw it
    context.fill();
    // The border
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0, 255, 0)";
    context.stroke();
  });

  /**
   * Draw the orbs
   */

  orbs.forEach(orb => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });

  // Recursively call the function
  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", event => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});
