// docs/dist/Game.js
var Game = class {
  constructor(canvas2) {
    this.lastTimestamp = 0;
    this.canvas = canvas2;
    this.ctx = canvas2.getContext("2d");
  }
  start() {
    window.requestAnimationFrame((ts) => this.gameLoop(ts));
  }
  gameLoop(timestamp) {
    const dt = (timestamp - this.lastTimestamp) / 1e3;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.onUpdate(dt);
    this.onDraw();
    this.lastTimestamp = timestamp;
    window.requestAnimationFrame((ts) => this.gameLoop(ts));
  }
};
var Game_default = Game;

// docs/dist/PoolGame.js
var PoolGame = class extends Game_default {
  constructor() {
    super(...arguments);
    this.balls = [];
  }
  onUpdate(dt) {
    for (let ball of this.balls) {
      ball.update(dt);
    }
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        if (this.balls[i].resolveCollision(this.balls[j])) {
          this.balls[i].impact(this.balls[j]);
        }
      }
    }
  }
  onDraw() {
    for (const ball of this.balls) {
      ball.draw(this.ctx);
    }
  }
};
var PoolGame_default = PoolGame;

// docs/dist/Vec2.js
var _Vec2 = class {
  constructor(x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
  }
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalized() {
    const len = this.len();
    const normX = this.x / len;
    const normY = this.y / len;
    return new _Vec2(isNaN(normX) ? 0 : normX, isNaN(normY) ? 0 : normY);
  }
  toString() {
    return `[${this.x.toFixed(4)}, ${this.y.toFixed(4)}]`;
  }
  static sum(v1, v2) {
    return new _Vec2(v1.x + v2.x, v1.y + v2.y);
  }
  static diff(v1, v2) {
    return new _Vec2(v1.x - v2.x, v1.y - v2.y);
  }
  static scaled(v, s) {
    return new _Vec2(v.x * s, v.y * s);
  }
  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
};
var Vec2 = _Vec2;
Vec2.ZERO = new _Vec2(0, 0);
Vec2.UP = new _Vec2(0, -1);
Vec2.DOWN = new _Vec2(0, 1);
Vec2.LEFT = new _Vec2(-1, 0);
Vec2.RIGHT = new _Vec2(1, 0);
var Vec2_default = Vec2;

// docs/dist/Ball.js
var _Ball = class {
  constructor(position, radius, mass, elasticity) {
    this.pushForce = new Vec2_default();
    this.acceleration = new Vec2_default();
    this.velocity = new Vec2_default();
    this.position = position;
    this.radius = radius;
    this.mass = mass != void 0 ? mass : 1;
    this.elasticity = elasticity != void 0 ? Math.min(Math.max(0, elasticity), 1) : 1;
  }
  resolveCollision(other) {
    const posDiff = Vec2_default.diff(other.position, this.position);
    const radiusSum = this.radius + other.radius;
    const intersectLen = radiusSum - posDiff.len();
    if (intersectLen > 0) {
      const displacement = Vec2_default.scaled(posDiff.normalized(), intersectLen / 2);
      this.position = Vec2_default.diff(this.position, displacement);
      other.position = Vec2_default.sum(other.position, displacement);
      return true;
    }
    return false;
  }
  resistanceForce() {
    return Vec2_default.scaled(this.velocity.normalized(), -_Ball.RESISTANCE_FORCE_MAGN);
  }
  applyPushForce(f) {
    this.pushForce = f;
  }
  resetPushForce() {
    this.pushForce = Vec2_default.ZERO;
  }
  momentum() {
    return Vec2_default.scaled(this.velocity, this.mass);
  }
  kineticEnergy() {
    return this.mass * this.velocity.len() * this.velocity.len() / 2;
  }
  impact(impacted) {
    const dirToImpacted = Vec2_default.diff(impacted.position, this.position).normalized();
    const thisTransferableMomentumMagn = this.momentum().len() * Vec2_default.dot(this.velocity.normalized(), dirToImpacted);
    const thisTransferableMomentum = Vec2_default.scaled(dirToImpacted, thisTransferableMomentumMagn);
    const impactedTransferableMomentumMagn = impacted.momentum().len() * Vec2_default.dot(impacted.velocity.normalized(), dirToImpacted);
    const impactedTransferableMomentum = Vec2_default.scaled(dirToImpacted, impactedTransferableMomentumMagn);
    this.velocity = this.velocityFromMomentum(Vec2_default.diff(this.momentum(), thisTransferableMomentum));
    impacted.velocity = impacted.velocityFromMomentum(Vec2_default.diff(impacted.momentum(), impactedTransferableMomentum));
    const thisTransferableVelocity = this.velocityFromMomentum(thisTransferableMomentum);
    const impactedTransferableVelocity = impacted.velocityFromMomentum(impactedTransferableMomentum);
    const distributedVelocity = this.computeImpactVelocityDistribution(impacted, thisTransferableVelocity, impactedTransferableVelocity);
    const totalTransferableVelocity = Vec2_default.sum(thisTransferableVelocity, impactedTransferableVelocity);
    this.velocity = Vec2_default.sum(this.velocity, distributedVelocity);
    impacted.velocity = Vec2_default.sum(impacted.velocity, Vec2_default.diff(totalTransferableVelocity, distributedVelocity));
  }
  velocityFromMomentum(momentum) {
    return Vec2_default.scaled(momentum, 1 / this.mass);
  }
  computeImpactVelocityDistribution(impacted, thisTransferableVelocity, impactedTransferableVelocity) {
    return Vec2_default.sum(Vec2_default.scaled(thisTransferableVelocity, (this.mass - impacted.mass) / (this.mass + impacted.mass)), Vec2_default.scaled(impactedTransferableVelocity, 2 * impacted.mass / (this.mass + impacted.mass)));
  }
  update(dt) {
    let finalForce;
    if (this.pushForce.len() >= this.resistanceForce().len()) {
      finalForce = Vec2_default.diff(this.pushForce, this.resistanceForce());
    } else if (this.velocity.len() > 1e-4) {
      finalForce = this.resistanceForce();
    } else {
      finalForce = Vec2_default.ZERO;
    }
    this.acceleration = Vec2_default.scaled(finalForce, 1 / this.mass);
    this.velocity = Vec2_default.sum(this.velocity, Vec2_default.scaled(this.acceleration, dt));
    this.position = Vec2_default.sum(this.position, Vec2_default.scaled(this.velocity, dt));
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.stroke();
  }
};
var Ball = _Ball;
Ball.RESISTANCE_FORCE_MAGN = 0.5;
var Ball_default = Ball;

// docs/dist/physics_demo/DemoScenarios.js
function playDemoScenario1(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 300, canvas2.height / 2), 50),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 100, canvas2.height / 2), 50)
  ];
  table.balls[0].applyPushForce(new Vec2_default(300, 0));
  setTimeout(() => {
    table.balls[0].resetPushForce();
  }, 1e3);
}
function playDemoScenario2(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 300, canvas2.height / 2), 50),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 100, canvas2.height / 2), 50)
  ];
  table.balls[0].applyPushForce(new Vec2_default(400, -60));
  setTimeout(() => {
    table.balls[0].resetPushForce();
  }, 1e3);
}
function playDemoScenario3(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 300, canvas2.height / 2), 50),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 100, canvas2.height / 2), 50)
  ];
  table.balls[0].applyPushForce(new Vec2_default(300, 0));
  table.balls[1].applyPushForce(new Vec2_default(60, 0));
  setTimeout(() => {
    table.balls[0].resetPushForce();
  }, 1e3);
}
function playDemoScenario4(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 300, canvas2.height / 2), 50),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 200, canvas2.height / 2), 50)
  ];
  table.balls[0].applyPushForce(new Vec2_default(300, 0));
  table.balls[1].applyPushForce(new Vec2_default(-300, 0));
  setTimeout(() => {
    table.balls[0].resetPushForce();
    table.balls[1].resetPushForce();
  }, 1e3);
}
function playDemoScenario5(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 300, canvas2.height / 2 - 200), 50),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 200, canvas2.height / 2 + 200), 50)
  ];
  table.balls[0].applyPushForce(new Vec2_default(400, 400));
  table.balls[1].applyPushForce(new Vec2_default(-200, -200));
  setTimeout(() => {
    table.balls[0].resetPushForce();
    table.balls[1].resetPushForce();
  }, 1e3);
}
function playDemoScenario6(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 300, canvas2.height / 2 - 200), 50),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 100, canvas2.height / 2 - 170), 50)
  ];
  table.balls[0].applyPushForce(new Vec2_default(400, 400));
  table.balls[1].applyPushForce(new Vec2_default(-300, 500));
  setTimeout(() => {
    table.balls[0].resetPushForce();
    table.balls[1].resetPushForce();
  }, 1e3);
}
function playDemoScenario7(table, canvas2) {
  table.balls = [
    new Ball_default(new Vec2_default(canvas2.width / 2 - 500, canvas2.height / 2), 48),
    new Ball_default(new Vec2_default(canvas2.width / 2 - 200, canvas2.height / 2), 48),
    new Ball_default(new Vec2_default(canvas2.width / 2 - 100, canvas2.height / 2), 48),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 0, canvas2.height / 2), 48),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 100, canvas2.height / 2), 48),
    new Ball_default(new Vec2_default(canvas2.width / 2 + 200, canvas2.height / 2), 48)
  ];
  table.balls[0].applyPushForce(new Vec2_default(400, 0));
  setTimeout(() => {
    table.balls[0].resetPushForce();
  }, 1e3);
}

// docs/dist/physics_demo/PhysicsDemoPoolGame.js
var PhysicsDemoPoolGame = class extends PoolGame_default {
  constructor(canvas2) {
    super(canvas2);
    this.style = `
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        
        li {
            float: left;
            padding: 5px;
        }
    `;
    this.demos = [
      playDemoScenario1,
      playDemoScenario2,
      playDemoScenario3,
      playDemoScenario4,
      playDemoScenario5,
      playDemoScenario6,
      playDemoScenario7
    ];
    const styleSheet = document.createElement("style");
    styleSheet.innerText = this.style;
    document.head.appendChild(styleSheet);
    const ul = document.createElement("ul");
    this.canvas.parentNode?.insertBefore(ul, this.canvas);
    for (let i = 0; i < this.demos.length; i++) {
      const li = document.createElement("li");
      ul.appendChild(li);
      const button = document.createElement("button");
      button.onclick = () => this.demos[i](this, this.canvas);
      button.textContent = "Scenario " + (i + 1);
      li.appendChild(button);
    }
  }
};
var PhysicsDemoPoolGame_default = PhysicsDemoPoolGame;

// docs/dist/index.js
var canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var game = new PhysicsDemoPoolGame_default(canvas);
game.start();
//# sourceMappingURL=index.js.map
