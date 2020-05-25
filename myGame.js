//Variable initialization
let canvas;
let c;
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
let shipNose;
let shipFragments = [];
let keys = [];
let bullets = [];
let asteroids = [];
let explosionBits = [];
let explosionBitSize = 0.8;
let shipExplosionBitNumber = 20;
let explosionBitNumber = 8;
let score = 0;
let lives = 7;
let movingForward = false;
let movingBackward = false;
let angle = 0;
let angularVel = 0.0005;
let velocityFactor = 0.09;
let colors;
let bulletColors;
let asteroidColors;
let radians;
let freshlySpawned;
let isPaused = true;

//Game instantiation
addEventListener("DOMContentLoaded", instantiate);

//Instantiate function
function instantiate() {
  //Canvas instantiation
  canvas = document.querySelector("#vortex");
  c = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  colors = ["#2185C5", "#7ECEFD", "#FFCAD4", "#FFF6E5"];
  bulletColors = ["#FF7F66", "#B0D0D3", "#C08497", "#FFFFFF"];
  asteroidColors = [
    "blue",
    "red",
    "yellow",
    "green",
    "indigo",
    "violet",
    "orange",
    "black",
  ];

  //Object instantiation
  //Ship nose instantiation
  shipNose = new ShipNose(canvas.width / 2, canvas.height / 2, 2, "red");

  //Ship fragments instantiation
  for (let i = 0; i < 50; i++) {
    let radius = Math.random() * 1 + 1;
    shipFragments.push(new ShipFragment(radius, randomColor(colors)));
  }

  //Asteroids instantiation
  // for (let i = 0; i < 10; i++) {
  //   const radius =
  //     Math.floor(Math.random() * 3 + 1) * randomIntFromRange(5, 17);
  //   let x = randomIntFromRange(radius, canvas.width - radius);
  //   let y = randomIntFromRange(radius, canvas.height - radius);
  //   const color = randomColor(asteroidColors);

  //   if (i !== 0) {
  //     for (let j = 0; j < asteroids.length; j++) {
  //       if (
  //         distance(x, y, asteroids[j].x, asteroids[j].y) -
  //           (radius + asteroids[j].radius) <
  //         0
  //       ) {
  //         x = randomIntFromRange(radius, canvas.width - radius);
  //         y = randomIntFromRange(radius, canvas.height - radius);
  //         j = -1;
  //       }
  //     }
  //   }

  //   asteroids.push(new Asteroid(x, y, radius, color));
  // }

  //Event listeners
  addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  });

  addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    if (e.keyCode === 32) {
      e.preventDefault();
    }
    if (e.keyCode === 38) {
      e.preventDefault();
    }
    if (e.keyCode === 40) {
      e.preventDefault();
    }
    if (e.keyCode === 87) {
      freshlySpawned = false;
    }
  });
  addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
  });

  //Clear screen timeout
  window.setInterval(clearScreen, 15000);

  function clearScreen() {
    c.clearRect(0, 0, canvas.width, canvas.height);
  }

  //Spawn asteroids timeout
  window.setInterval(spawnAsteroid, 2000);

  function spawnAsteroid() {
    if (asteroids.length < 30) {
      for (let i = 0; i < 1; i++) {
        const radius =
          Math.floor(Math.random() * 3 + 1) * randomIntFromRange(5, 17);
        let x = randomIntFromRange(canvas.width, canvas.width + 4 * radius);
        let y = randomIntFromRange(canvas.height, canvas.height + 4 * radius);
        const color = randomColor(asteroidColors);

        if (i !== 0) {
          for (let j = 0; j < asteroids.length; j++) {
            if (
              distance(x, y, asteroids[j].x, asteroids[j].y) -
                (radius + asteroids[j].radius) <
              0
            ) {
              x = randomIntFromRange(canvas.width, canvas.width + 4 * radius);
              y = randomIntFromRange(canvas.height, canvas.height + 4 * radius);
              j = -1;
            }
          }
        }

        asteroids.push(new Asteroid(x, y, radius, color));
      }
    }
  }
  letTheMagicBegin();
}

//DrawLifeShips Function
function DrawLifeShips() {
  //Declare points
  let startX = 0.98 * canvas.width;
  let startY = 0.01 * canvas.height;
  let points = [
    [0.02 * canvas.height, 0.02 * canvas.height],
    [-0.02 * canvas.height, 0.02 * canvas.height],
  ];

  //Draw life ships
  for (let i = 0; i < lives; i++) {
    c.fillStyle = [...colors, ...asteroidColors][i];
    c.beginPath();
    c.moveTo(startX, startY);
    for (let j = 0; j < points.length; j++) {
      c.lineTo(startX + points[j][0], startY + points[j][1]);
    }
    c.closePath();
    c.fill();
    startX -= 0.02 * canvas.width;
  }
}

//Where the magic begins
function letTheMagicBegin() {
  // //Create background gradient
  // const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
  // backgroundGradient.addColorStop(0, "rgba(23, 30, 38, 0.5)");
  // backgroundGradient.addColorStop(1, "rgba(63,84,107, 0.5)");

  if (
    shipNose.x == canvas.width / 2 &&
    shipNose.y == canvas.height / 2 &&
    angle == 0
  ) {
    freshlySpawned = true;
  } else {
    freshlySpawned = false;
  }

  //Clear screen with trail effect
  c.fillStyle = "rgba(255, 255, 255, 0.08)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Update ship
  //Update ship linear displacement
  if (!isPaused) {
    movingForward = keys[38];
    movingBackward = keys[40];

    //Update ship angular displacement
    radians = (angle / Math.PI) * 180;
    if (keys[39]) {
      freshlySpawned = false;
      shipNose.rotate(1);
      shipFragments.forEach((shipFragment) => {
        shipFragment.staticRadians -= 2 * shipFragment.staticAngularVel;
      });
    }
    if (keys[37]) {
      freshlySpawned = false;
      shipNose.rotate(-1);
    }
  }

  //Relay parameter changes and draw ship nose
  if (shipNose.visible) {
    if (!isPaused) {
      shipNose.update();
    } else {
      shipNose.draw();
    }
  }

  //Relay parameter changes and draw ship fragments
  shipFragments.forEach((shipFragment) => {
    if (shipNose.visible) {
      if (!isPaused) {
        shipFragment.update();
      } else {
        //Move points over time
        shipFragment.staticRadians += shipFragment.staticAngularVel;
        //Circular motion
        shipFragment.x1 =
          shipNose.x +
          Math.sin(shipFragment.staticRadians) *
            shipFragment.distanceFromCenter;
        shipFragment.y1 =
          shipNose.y +
          Math.cos(shipFragment.staticRadians) *
            shipFragment.distanceFromCenter;

        shipFragment.draw();
      }
    }
  });

  //Relay parameter changes and draw ship direction line
  if (shipNose.visible) {
    c.save();
    c.beginPath();
    c.strokeStyle = shipNose.color;
    c.shadowColor = shipNose.color;
    c.shadowBlur = 1;
    c.lineWidth = 1;
    c.moveTo(shipNose.x, shipNose.y);
    c.lineTo(shipNose.x1, shipNose.y1);
    c.stroke();
    c.closePath();
    c.restore();
  }

  //Draw And Update Bullets
  if (shipNose.visible) {
    if (keys[32]) {
      freshlySpawned = false;
      if (!isPaused) {
        bullets.push(new Bullet(2, randomColor(bulletColors), 5));
      }
      if (bullets.length >= 30) {
        bullets.splice(30, bullets.length);
      }
    }
    if (bullets.length !== 0) {
      bullets.forEach((bullet, index) => {
        if (
          bullet.x < 0 ||
          bullet.x > canvas.width ||
          bullet.y < 0 ||
          bullet.y > canvas.height
        ) {
          bullets.splice(index, 1);
        } else {
          if (!isPaused) {
            bullet.update();
          } else {
            bullet.draw();
          }
        }
      });
    }
  }

  //Draw and update asteroids
  if (asteroids.length !== 0) {
    asteroids.forEach((asteroid) => {
      if (!isPaused) {
        asteroid.update();
      } else {
        asteroid.draw();
      }
    });
  }

  //Draw and update explosion bits
  if (explosionBits.length !== 0) {
    explosionBits.forEach((explosionBit, index) => {
      if (!isPaused) {
        explosionBit.update();
      } else {
        explosionBit.draw();
      }
      if (explosionBit.ttl == 0) {
        explosionBits.splice(index, 1);
      }
    });
  }

  //Handle collision detection and life subtraction
  //Ship and asteroid collision detection
  if (asteroids.length !== 0) {
    for (let i = 0; i < asteroids.length; i++) {
      if (
        distance(shipNose.x, shipNose.y, asteroids[i].x, asteroids[i].y) -
          (shipNose.distanceFromCenter + asteroids[i].radius) <
          0 &&
        !freshlySpawned
      ) {
        shipNose.explode();
      }
    }
  }

  //Bullet And Asteroid Collision Detection
  if (asteroids.length !== 0 && bullets.length !== 0) {
    loop1: for (let i = 0; i < asteroids.length; i++) {
      for (let j = 0; j < bullets.length; j++) {
        if (
          distance(asteroids[i].x, asteroids[i].y, bullets[j].x, bullets[j].y) -
            (asteroids[i].radius + bullets[j].radius) <
          0
        ) {
          if (asteroids[i].radius > 9) {
            asteroids[i].radius -= 9;
            asteroids[i].explode();
            asteroids.push(
              new Asteroid(
                asteroids[i].x,
                asteroids[i].y,
                asteroids[i].radius,
                asteroids[i].color
              )
            );
            asteroids.push(
              new Asteroid(
                asteroids[i].x,
                asteroids[i].y,
                asteroids[i].radius,
                asteroids[i].color
              )
            );
          } else {
            asteroids[i].explode();
          }
          asteroids.splice(i, 1);
          bullets.splice(j, 1);
          break loop1;
        }
      }
    }
  }

  //Handle lives and score display, game over, reset, pause and play
  //Handle lives
  if (lives <= 0) {
    shipNose.visible = false;
  }

  //Handle reset
  if (keys[82]) {
    freshlySpawned = true;
    shipNose.visible = true;
    score = 0;
    lives = 7;
    angle = 0;
    shipNose.vel = { x: 0, y: 0 };
    bullets.splice(0, bullets.length);
    asteroids.splice(0, asteroids.length);
  }

  //Handle pause
  if (keys[79]) {
    isPaused = true;
  }

  if (isPaused) {
    c.fillStyle = "#2185C5";
    c.font = `${0.05 * canvas.height}px Candara`;
    c.fillText(
      `Paused`,
      canvas.width / 2 - 0.09 * canvas.width,
      canvas.height / 2 - 0.08 * canvas.height
    );
    c.fillText(
      `Press P To Proceed`,
      canvas.width / 2 - 0.09 * canvas.width,
      canvas.height / 2 + 0.05 * canvas.height - 0.08 * canvas.height
    );
    c.fillText(
      `Scroll down for further instructions`,
      canvas.width / 2 - 0.09 * canvas.width,
      canvas.height / 2 + 0.1 * canvas.height - 0.08 * canvas.height
    );
  }

  //Handle play
  if (keys[80]) {
    isPaused = false;
  }

  //Handle score display
  c.fillStyle = "#2185C5";
  c.font = `${0.03 * canvas.height}px Candara`;
  c.fillText(
    `SCORE: ${score.toString()}`,
    0.015 * canvas.width,
    0.035 * canvas.height
  );

  //Handle game over
  if (!shipNose.visible) {
    c.fillStyle = "#2185C5";
    c.font = `${0.05 * canvas.height}px Candara`;
    c.fillText(
      `GAME OVER!!!`,
      canvas.width / 2 - 0.09 * canvas.width,
      canvas.height / 2 - 0.08 * canvas.height
    );
    c.fillText(
      `You scored ${score} points`,
      canvas.width / 2 - 0.09 * canvas.width,
      canvas.height / 2 + 0.05 * canvas.height - 0.08 * canvas.height
    );
    c.fillText(
      `Press R to reset`,
      canvas.width / 2 - 0.09 * canvas.width,
      canvas.height / 2 + 0.1 * canvas.height - 0.08 * canvas.height
    );
  }
  DrawLifeShips();

  requestAnimationFrame(letTheMagicBegin);
}
