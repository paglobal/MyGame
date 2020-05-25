//Ship nose class
class ShipNose {
  constructor(x, y, radius, color) {
    this.visible = true;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vel = { x: 0, y: 0 };
    this.distanceFromCenter = 18;
  }

  //Ship rotate method
  rotate(dir) {
    if (angle <= Math.PI * 2) {
      angle += angularVel * dir;
    } else {
      angle = 0;
    }
  }

  //Ship explode method
  explode() {
    for (let i = 0; i < shipExplosionBitNumber; i++) {
      explosionBits.push(
        new ExplosionBit(
          this.x,
          this.y,
          explosionBitSize,
          randomColor(asteroidColors)
        )
      );
    }
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.vel = { x: 0, y: 0 };
    angle = 0;
    lives -= 1;
  }

  //Ship nose draw method
  draw() {
    c.beginPath();
    c.arc(this.x1, this.y1, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  //Ship nose update method
  update() {
    //Move ship forward or backward on keypress
    if (movingForward) {
      this.vel.x += Math.cos(radians) * velocityFactor;
      this.vel.y += Math.sin(radians) * velocityFactor;
    }

    if (movingBackward) {
      this.vel.x -= Math.cos(radians) * velocityFactor;
      this.vel.y -= Math.sin(radians) * velocityFactor;
    }

    //Handle ship movement through screen borders
    if (this.x + (this.radius + this.distanceFromCenter) < 0) {
      this.x = canvas.width + this.radius + this.distanceFromCenter;
    }
    if (this.x - (this.radius + this.distanceFromCenter) > canvas.width) {
      this.x = -(this.radius + this.distanceFromCenter);
    }
    if (this.y + (this.radius + this.distanceFromCenter) < 0) {
      this.y = canvas.height + this.radius + this.distanceFromCenter;
    }
    if (this.y - (this.radius + this.distanceFromCenter) > canvas.height) {
      this.y = -(this.radius + this.distanceFromCenter);
    }

    //Deceleration
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;

    //Set coordinates for ship movement
    this.x -= this.vel.x;
    this.y -= this.vel.y;

    //Move ship
    this.x1 =
      this.x - (this.radius + this.distanceFromCenter) * Math.cos(radians);
    this.y1 =
      this.y - (this.radius + this.distanceFromCenter) * Math.sin(radians);

    this.draw();
  }
}

//Ship fragment class
class ShipFragment {
  constructor(radius, color) {
    this.radius = radius;
    this.color = color;
    this.staticAngularVel = 0.05;
    this.staticRadians = Math.random() * Math.PI * 2;
    this.distanceFromCenter = randomIntFromRange(
      10,
      shipNose.distanceFromCenter
    );
  }

  //Ship fragment draw method
  draw() {
    c.beginPath();
    c.arc(this.x1, this.y1, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  //Ship fragment update method
  update() {
    //Move points over time
    this.staticRadians += this.staticAngularVel;

    //Circular motion
    this.x1 =
      shipNose.x + Math.sin(this.staticRadians) * this.distanceFromCenter;
    this.y1 =
      shipNose.y + Math.cos(this.staticRadians) * this.distanceFromCenter;

    this.draw();
  }
}

//Bullet class
class Bullet {
  constructor(radius, color, vel) {
    this.x = shipNose.x1;
    this.y = shipNose.y1;
    this.lastPoint = { x: this.x, y: this.y };
    this.radius = radius;
    this.color = color;
    this.vel = vel;
    // this.angle = angle;
    this.radians = radians;
  }

  // //Bullet rotate method
  // rotate(dir) {
  //   if (angle <= Math.PI * 2) {
  //     this.angle += angularVel * dir;
  //   } else {
  //     this.angle = 0;
  //   }
  // }

  //Bullet draw method
  draw() {
    c.beginPath();
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.moveTo(this.lastPoint.x, this.lastPoint.y);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.closePath();
  }

  //Bullet update method
  update() {
    //Grab last bullet point
    this.lastPoint = { x: this.x, y: this.y };

    // //Change bullet direction
    // this.radians = (this.angle / Math.PI) * 180;
    // if (keys[37]) {
    //   this.rotate(1);
    // }
    // if (keys[39]) {
    //   this.rotate(-1);
    // }

    //Move bullet
    this.x -= Math.cos(this.radians) * this.vel;
    this.y -= Math.sin(this.radians) * this.vel;

    this.draw();
  }
}

//Asteroid class
class Asteroid {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vel = {
      x: (Math.random() - 0.5) * 2.5,
      y: (Math.random() - 0.5) * 2.5,
    };
    this.mass = 1;
    this.opacity = 0.1;
  }

  //Asteroid explode method
  explode() {
    for (let i = 0; i < explosionBitNumber; i++) {
      explosionBits.push(
        new ExplosionBit(this.x, this.y, explosionBitSize, this.color)
      );
    }
    score += 2;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.shadowColor = this.color;
    c.shadowBlur = 7;
    c.fill();
    c.restore();
    c.closePath();
  }

  update() {
    this.draw();

    //Collision between asteroids
    for (let i = 0; i < asteroids.length; i++) {
      if (this === asteroids[i]) continue;
      if (
        distance(this.x, this.y, asteroids[i].x, asteroids[i].y) -
          (this.radius + asteroids[i].radius) <
        0
      ) {
        resolveCollision(this, asteroids[i]);
      }
    }

    //Behaviour of asteroid relative to proximity of ship
    if (
      distance(shipNose.x, shipNose.y, this.x, this.y) < 120 &&
      this.opacity < 1
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0.1) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    //Handle asteroid movement through screen borders
    if (this.x + this.radius < 0) {
      this.x = canvas.width + this.radius;
    }
    if (this.x - this.radius > canvas.width) {
      this.x = -this.radius;
    }
    if (this.y + this.radius < 0) {
      this.y = canvas.height + this.radius;
    }
    if (this.y - this.radius > canvas.height) {
      this.y = -this.radius;
    }

    this.x += this.vel.x;
    this.y += this.vel.y;
  }
}

//ExplosionBit class
class ExplosionBit {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vel = {
      x: randomIntFromRange(-2, 2),
      y: randomIntFromRange(-2, 2),
    };
    this.ttl = 100;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.shadowColor = this.color;
    c.shadowBlur = 10;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    //Move explosion bit
    this.y += this.vel.y;
    this.x += this.vel.x;

    //Countdown for explosion bit removal and decrease opacity of explosion bit
    this.ttl -= 1;
    if (this.opacity > 0) {
      this.opacity -= 1 / this.ttl;
      this.opacity = Math.max(0, this.opacity);
    }

    this.draw();
  }
}
