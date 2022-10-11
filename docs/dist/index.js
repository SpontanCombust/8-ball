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
    return `[${this.x}, ${this.y}]`;
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
  constructor(position, radius) {
    this.mass = 1;
    this.pushForce = new Vec2_default();
    this.acceleration = new Vec2_default();
    this.velocity = new Vec2_default();
    this.position = position;
    this.radius = radius;
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
    let finalForce = Vec2_default.diff(f, this.resistanceForce());
    this.acceleration = Vec2_default.scaled(finalForce, 1 / this.mass);
  }
  resetPushForce() {
    this.pushForce = Vec2_default.ZERO;
  }
  impact(other) {
    const dirToImpacted = Vec2_default.diff(other.position, this.position).normalized();
    const angleOfAttackDotProd = Vec2_default.dot(this.velocity.normalized(), dirToImpacted);
    const transferredMomentum = Vec2_default.scaled(dirToImpacted, angleOfAttackDotProd * this.velocity.len());
    other.velocity = Vec2_default.sum(other.velocity, transferredMomentum);
    this.velocity = Vec2_default.diff(this.velocity, transferredMomentum);
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
    this.velocity = Vec2_default.sum(this.acceleration, this.velocity);
    this.position = Vec2_default.sum(this.position, Vec2_default.scaled(this.velocity, dt));
  }
  draw(ctx2) {
    ctx2.beginPath();
    ctx2.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    ctx2.fillStyle = "blue";
    ctx2.fill();
    ctx2.lineWidth = 3;
    ctx2.stroke();
  }
};
var Ball = _Ball;
Ball.RESISTANCE_FORCE_MAGN = 0.5;
var Ball_default = Ball;

// docs/dist/index.js
var canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var ctx = canvas.getContext("2d");
var balls = [
  new Ball_default(new Vec2_default(canvas.width / 2 - 200, canvas.height / 2), 50),
  new Ball_default(new Vec2_default(canvas.width / 2 + 200, canvas.height / 2), 50)
];
var DELTA_TIME_SEC = 1 / 60;
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let ball of balls) {
    ball.update(DELTA_TIME_SEC);
  }
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      if (balls[i].resolveCollision(balls[j])) {
        balls[i].impact(balls[j]);
      }
    }
  }
  for (let ball of balls) {
    ball.draw(ctx);
  }
}
canvas.addEventListener("mousedown", (ev) => {
  let f = Vec2_default.diff(new Vec2_default(ev.x, ev.y), balls[0].position);
  f = Vec2_default.scaled(f, 1 / 100);
  balls[0].applyPushForce(f);
});
canvas.addEventListener("mouseup", (ev) => {
  balls[0].resetPushForce();
});
setInterval(gameLoop, DELTA_TIME_SEC * 1e3);
//# sourceMappingURL=index.js.map
