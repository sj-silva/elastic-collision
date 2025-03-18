let balls = [];
let noiseOffset = 0;
let frictionCoef = 0.1;
let canvas;
class Ball {
  #maxVelocity = 5;
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(1, 5));
    this.acceleration = createVector(0, 0);
    this.mass = random(1, 6);
    this.radius = sqrt(this.mass) * 10;
    this.color = color || [255, 0, 0];
  }

  display() {
    stroke(0, 255, 0);
    fill(this.color[0], this.color[1], this.color[2]);
    strokeWeight(4);
    circle(this.position.x, this.position.y, 2 * this.radius);
  }

  move() {
    this.#update();
    this.#checkEdges();
  }

  friction() {
    let dif = height - (this.position.y + this.radius);
    if (dif < 1) {
      let frictionForce = this.velocity.copy();
      frictionForce.normalize();
      frictionForce.mult(-1);
      let normalForce = this.mass;

      frictionForce.setMag(frictionCoef * normalForce);
      this.applyForce(frictionForce);
    }
  }

  drag() {
    const speedSq = this.velocity.magSq();
    // Only apply drag when velocity is significant
    if (speedSq < 0.01) return;

    let dragForce = this.velocity.copy();
    dragForce.normalize().mult(-1);
    const dragCoef = 0.0008;

    dragForce.setMag(dragCoef * speedSq);
    this.applyForce(dragForce);
  }
  collide(other) {
    // Position Difference vector (from this to other)
    const positionDiffVector = p5.Vector.sub(other.position, this.position);
    const distance = positionDiffVector.mag();
    const minDistance = this.radius + other.radius;

    if (distance < minDistance) {
      // Normalize once for efficiency
      const normal = positionDiffVector.copy().normalize();

      // Prevent overlap - move balls apart immediately
      const overlap = minDistance - distance;
      const correctionAmount = overlap * 0.8; // Make correction stronger (80% of overlap)

      // Apply position correction based on mass ratio
      const totalMass = this.mass + other.mass;
      const thisCorrection = normal
        .copy()
        .mult(-correctionAmount * (other.mass / totalMass));
      const otherCorrection = normal
        .copy()
        .mult(correctionAmount * (this.mass / totalMass));

      this.position.add(thisCorrection);
      other.position.add(otherCorrection);

      // Calculate relative velocity
      const relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);

      // Calculate velocity along normal
      const velocityAlongNormal = relativeVelocity.dot(normal);

      // Only proceed if objects are moving toward each other
      if (velocityAlongNormal > 0) return;

      // Calculate restitution (bounciness)
      const restitution = 1.0; // 1.0 = perfectly elastic, 0.0 = inelastic

      // Calculate impulse scalar
      const impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
      const impulseScalar = impulseMagnitude / totalMass;

      // Apply impulse
      const impulse = normal.copy().mult(impulseScalar);

      this.velocity.sub(impulse.copy().mult(other.mass));
      other.velocity.add(impulse.copy().mult(this.mass));

      // Add a minimum impulse to prevent sticking
      const minImpulse = 0.1;
      if (this.velocity.mag() < minImpulse) {
        this.velocity.add(p5.Vector.random2D().mult(minImpulse));
      }
      if (other.velocity.mag() < minImpulse) {
        other.velocity.add(p5.Vector.random2D().mult(minImpulse));
      }
    }
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }
  // ------------------
  // Private Functions
  // ------------------

  #update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  #checkEdges() {
    if (this.position.x + this.radius > width) {
      this.position.x = width - this.radius;
      this.velocity.x *= -1;

      //Reduce overall velocity after collision
      this.velocity.mult(0.95);
    }
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x *= -1;
      this.velocity.mult(0.95);
    }
    if (this.position.y + this.radius > height) {
      this.position.y = height - this.radius;
      this.velocity.y *= -1;
    }
    if (this.position.y - this.radius < 0) {
      this.position.y = this.radius;
      this.velocity.y *= -1;
    }
  }
}

function initializeBalls() {
  balls = [];
  const colors = [
    [255, 0, 0], //Red
    [0, 0, 255], //Blue
    [255, 255, 0], //Yellow
  ];

  balls.push(new Ball(width / 3, height / 4, colors[0]));
  balls.push(new Ball((2 * width) / 3, height / 2, colors[1]));
  balls.push(new Ball(width / 2, height / 3, colors[2]));
}

function setup() {
  canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.6);
  canvas.parent(document.body);
  gravity = createVector(0, 0.5);
  initializeBalls();
}

function draw() {
  background(25);

  let gravity = createVector(0, 0.5);

  for (let ball of balls) {
    let weightForce = p5.Vector.mult(gravity, ball.mass);
    ball.applyForce(weightForce);
    ball.move();
    ball.display();
    ball.drag();
    ball.friction();
    for (let otherBall of balls) {
      if (otherBall != ball) {
        ball.collide(otherBall);
      }
    }
  }
}

function restartSimulation() {
  initializeBalls();
}
