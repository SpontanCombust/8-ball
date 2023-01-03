// docs/dist/Vec2.js
var _Vec2 = class {
  constructor(x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
  }
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  negated() {
    return new _Vec2(-this.x, -this.y);
  }
  normalized() {
    const len = this.len();
    const normX = this.x / len;
    const normY = this.y / len;
    return new _Vec2(isNaN(normX) ? 0 : normX, isNaN(normY) ? 0 : normY);
  }
  reflected(normal) {
    return _Vec2.diff(this, _Vec2.scaled(normal.normalized(), 2 * _Vec2.dot(normal.normalized(), this)));
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
  constructor(position, radius, lookVariant, mass) {
    this.pushForce = new Vec2_default();
    this.acceleration = new Vec2_default();
    this.velocity = new Vec2_default();
    this.position = position;
    this.radius = radius;
    this.lookVariant = lookVariant != void 0 ? lookVariant : 0;
    this.mass = mass != void 0 ? mass : 1;
  }
  resistanceForce() {
    const HALT_VELOCITY_THRESHOLD = 10;
    let resistanceMultip = 1;
    if (this.velocity.len() < HALT_VELOCITY_THRESHOLD) {
      resistanceMultip = this.velocity.len() / HALT_VELOCITY_THRESHOLD;
    }
    return Vec2_default.scaled(this.velocity.normalized(), -_Ball.RESISTANCE_FORCE_MAGN * resistanceMultip);
  }
  momentum() {
    return Vec2_default.scaled(this.velocity, this.mass);
  }
  kineticEnergy() {
    return this.mass * this.velocity.len() * this.velocity.len() / 2;
  }
  isStripedVariant() {
    return this.lookVariant >= 9 && this.lookVariant <= 15;
  }
  isSolidVariant() {
    return this.lookVariant >= 1 && this.lookVariant <= 8;
  }
  resolveCollision(collider) {
    if (collider instanceof _Ball) {
      return this.resolveCollisionWithBall(collider);
    } else {
      return this.resolveCollisionWithWall(collider);
    }
  }
  resolveCollisionWithBall(other) {
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
  resolveCollisionWithWall(wall) {
    const normal = wall.normalTo(this.position);
    const possibleCollisionPoint = Vec2_default.diff(this.position, normal);
    if (normal.len() < this.radius) {
      if (wall.contains(possibleCollisionPoint) || Vec2_default.diff(this.position, wall.p1).len() < this.radius || Vec2_default.diff(this.position, wall.p2).len() < this.radius) {
        this.position = Vec2_default.sum(possibleCollisionPoint, Vec2_default.scaled(normal.normalized(), this.radius));
        return true;
      }
    }
    return false;
  }
  impact(impacted) {
    if (impacted instanceof _Ball) {
      this.impactWithBall(impacted);
    } else {
      this.impactWithWall(impacted);
    }
  }
  impactWithBall(impacted) {
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
  impactWithWall(impacted) {
    const normal = impacted.normalTo(this.position);
    this.velocity = Vec2_default.scaled(this.velocity.reflected(normal.normalized()), 1 - _Ball.WALL_VELOCITY_ABSORPTION_FACTOR);
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
    switch (this.lookVariant) {
      case 1:
        this.drawSolid(ctx, "yellow");
        break;
      case 2:
        this.drawSolid(ctx, "blue");
        break;
      case 3:
        this.drawSolid(ctx, "red");
        break;
      case 4:
        this.drawSolid(ctx, "purple");
        break;
      case 5:
        this.drawSolid(ctx, "orange");
        break;
      case 6:
        this.drawSolid(ctx, "green");
        break;
      case 7:
        this.drawSolid(ctx, "brown");
        break;
      case 8:
        this.drawSolid(ctx, "black");
        break;
      case 9:
        this.drawStriped(ctx, "yellow");
        break;
      case 10:
        this.drawStriped(ctx, "blue");
        break;
      case 11:
        this.drawStriped(ctx, "red");
        break;
      case 12:
        this.drawStriped(ctx, "purple");
        break;
      case 13:
        this.drawStriped(ctx, "orange");
        break;
      case 14:
        this.drawStriped(ctx, "green");
        break;
      case 15:
        this.drawStriped(ctx, "brown");
        break;
      default:
        this.drawWhite(ctx);
    }
  }
  drawWhite(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  drawSolid(ctx, color) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius * 0.5, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.font = "17px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(this.lookVariant.toString(), this.position.x, this.position.y + 5);
  }
  drawStriped(ctx, color) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, Math.PI * 0.25, Math.PI * 1.75, true);
    ctx.arc(this.position.x, this.position.y, this.radius, Math.PI * 1.25, Math.PI * 0.75, true);
    ctx.arc(this.position.x, this.position.y, this.radius, Math.PI * 0.25, Math.PI * 1.75, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius * 0.5, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.font = "17px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(this.lookVariant.toString(), this.position.x, this.position.y + 5);
  }
};
var Ball = _Ball;
Ball.RESISTANCE_FORCE_MAGN = 50;
Ball.WALL_VELOCITY_ABSORPTION_FACTOR = 0.1;
var Ball_default = Ball;

// docs/dist/Utils.js
function roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = true) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

// docs/dist/Cue.js
var _Cue = class {
  constructor(canvas2) {
    this.enabled = false;
    this.target = null;
    this.mousePos = new Vec2_default();
    this.strength = 0.5;
    this.onHit = () => {
    };
    this.setupCanvasObserver(canvas2);
  }
  setupCanvasObserver(canvas2) {
    canvas2.addEventListener("mousemove", (ev) => {
      const rect = canvas2.getBoundingClientRect();
      this.mousePos = new Vec2_default(ev.clientX - rect.left, ev.clientY - rect.top);
    });
    canvas2.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      this.strength = clamp(this.strength - ev.deltaY / 100, 0, 1);
    });
    canvas2.addEventListener("click", (ev) => {
      if (ev.button == 0) {
        this.hitTarget();
      }
    });
  }
  directionFromTarget() {
    if (this.target && this.enabled) {
      return Vec2_default.diff(this.mousePos, this.target.position).normalized();
    }
    return Vec2_default.ZERO;
  }
  getHitStrengh() {
    return this.strength * _Cue.STRENGH_MULTIPLIER;
  }
  hitTarget() {
    if (this.target && this.enabled) {
      this.target.velocity = Vec2_default.scaled(this.directionFromTarget().negated(), this.getHitStrengh());
      this.onHit();
    }
  }
  draw(ctx) {
    if (this.target && this.enabled) {
      const dir = this.directionFromTarget();
      let offset = Vec2_default.scaled(dir, this.target.radius + this.strength * _Cue.MAX_OFFSET_FROM_TARGET);
      const lineToRelative = (from, to) => {
        const fromPos = Vec2_default.sum(this.target.position, Vec2_default.scaled(dir, offset.len() + from));
        const toPos = Vec2_default.sum(this.target.position, Vec2_default.scaled(dir, offset.len() + to));
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
      };
      ctx.beginPath();
      ctx.lineWidth = 10;
      lineToRelative(0, 10);
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.beginPath();
      lineToRelative(10, 60);
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.beginPath();
      lineToRelative(60, 450);
      ctx.strokeStyle = "burlywood";
      ctx.stroke();
      ctx.beginPath();
      lineToRelative(450, 750);
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  }
};
var Cue = _Cue;
Cue.MAX_OFFSET_FROM_TARGET = 200;
Cue.STRENGH_MULTIPLIER = 1e3;
var Cue_default = Cue;

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

// docs/dist/Line.js
var Line = class {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.a = (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x);
    this.b = this.p1.y - this.a * this.p1.x;
  }
  isPerfectlyHorizontal() {
    return Math.abs(this.p1.y - this.p2.y) < 1e-5;
  }
  isPerfectlyVertical() {
    return Math.abs(this.p1.x - this.p2.x) < 1e-5;
  }
  contains(p) {
    function numberInRange(x, n1, n2) {
      if (n1 < n2) {
        return n1 <= x && x <= n2;
      } else {
        return n2 <= x && x <= n1;
      }
    }
    if (numberInRange(p.x, this.p1.x, this.p2.x) && numberInRange(p.y, this.p1.y, this.p2.y)) {
      if (this.isPerfectlyVertical() || this.isPerfectlyHorizontal()) {
        return true;
      }
      const y = this.a * p.x + this.b;
      return Math.abs(y - p.y) < 1e-5;
    }
    return false;
  }
  normalTo(p0) {
    if (this.isPerfectlyVertical()) {
      return new Vec2_default(p0.x - this.p1.x, 0);
    } else if (this.isPerfectlyHorizontal()) {
      return new Vec2_default(0, p0.y - this.p1.y);
    }
    const a0 = -1 / this.a;
    const b0 = p0.y + p0.x / this.a;
    const x = (b0 - this.b) / (this.a - a0);
    const y = a0 * x + b0;
    return Vec2_default.diff(p0, new Vec2_default(x, y));
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
};
var Line_default = Line;

// docs/dist/Pocket.js
var _Pocket = class {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
  }
  isBallCaptured(ball) {
    const dist = Vec2_default.diff(ball.position, this.position).len();
    if (dist < this.radius) {
      return this.radius + ball.radius - dist < 2 * this.radius * _Pocket.CAPTURE_DIAMETER_TRESHOLD;
    }
    return false;
  }
  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
};
var Pocket = _Pocket;
Pocket.CAPTURE_DIAMETER_TRESHOLD = 0.7;
var Pocket_default = Pocket;

// docs/dist/PoolGameState.js
var PoolGameState = class {
  constructor(game2) {
    this.game = game2;
  }
  onUpdate(dt) {
  }
};
var PoolGameState_default = PoolGameState;

// docs/dist/poolGameContexts/PoolGameState_RoundConclusion.js
var PoolGameState_RoundConclusion = class extends PoolGameState_default {
  constructor(game2, scoredBalls) {
    super(game2);
    this.scoredBalls = scoredBalls;
  }
  onEnterState() {
    if (this.scoredBalls.length == 0) {
      this.game.switchPlayer();
      this.game.makeAnnouncement("No ball scored! Player " + this.game.currentPlayer + "'s turn!", 2e3);
      this.game.changeState(new PoolGameState_Aiming_default(this.game));
      return;
    }
    let scoredWhite = false;
    let scoredBlack = false;
    let scoredIncorrectVariant = false;
    let won = false;
    for (let i = 0; i < this.scoredBalls.length; i++) {
      const ball = this.scoredBalls[i];
      if (ball.isStripedVariant()) {
        this.game.scoredBallsP2.push(ball);
      } else if (ball.isSolidVariant() && ball.lookVariant != 8) {
        this.game.scoredBallsP1.push(ball);
      }
      if (!ball.isSolidVariant() && !ball.isStripedVariant()) {
        scoredWhite = true;
      } else if (ball.lookVariant == 8) {
        scoredBlack = true;
        if (i == this.scoredBalls.length - 1 && this.game.ballsOnTable.length <= 1) {
          won = true;
        }
      } else if (this.game.currentPlayer == 1 && ball.isStripedVariant() || this.game.currentPlayer == 2 && ball.isSolidVariant()) {
        scoredIncorrectVariant = true;
      }
    }
    if (scoredBlack) {
      const opponent = this.game.currentPlayer == 1 ? 2 : 1;
      if (won) {
        this.game.announcementText = "Player " + this.game.currentPlayer + " won!";
      } else {
        this.game.announcementText = "Faul! Player " + opponent + " won!";
      }
    } else if (scoredWhite) {
      this.game.makeAnnouncement("Faul! White ball scored! Player " + this.game.currentPlayer + "'s turn!", 4e3);
      this.game.ballsOnTable.push(this.game.whiteBall);
      this.game.switchPlayer();
      this.game.changeState(new PoolGameState_BallPlacement_default(this.game, false));
    } else if (scoredIncorrectVariant) {
      this.game.makeAnnouncement("Faul! Incorrect ball scored! Player " + this.game.currentPlayer + "'s turn!", 4e3);
      this.game.switchPlayer();
      this.game.changeState(new PoolGameState_Aiming_default(this.game));
    } else {
      this.game.makeAnnouncement("Scored!", 2e3);
      this.game.changeState(new PoolGameState_Aiming_default(this.game));
    }
  }
  onLeaveState() {
  }
};
var PoolGameState_RoundConclusion_default = PoolGameState_RoundConclusion;

// docs/dist/poolGameContexts/PoolGameState_RoundSimulation.js
var PoolGameState_RoundSimulation = class extends PoolGameState_default {
  constructor() {
    super(...arguments);
    this.ballsInPockets = [];
  }
  onEnterState() {
    this.game.cue.enabled = false;
  }
  onLeaveState() {
  }
  updateBallPhysics(dt) {
    for (let ball of this.game.ballsOnTable) {
      ball.update(dt);
    }
  }
  computeCollisions() {
    for (let i = 0; i < this.game.ballsOnTable.length; i++) {
      for (let j = 0; j < this.game.walls.length; j++) {
        if (this.game.ballsOnTable[i].resolveCollision(this.game.walls[j])) {
          this.game.ballsOnTable[i].impact(this.game.walls[j]);
        }
      }
      for (let k = i + 1; k < this.game.ballsOnTable.length; k++) {
        if (this.game.ballsOnTable[i].resolveCollision(this.game.ballsOnTable[k])) {
          this.game.ballsOnTable[i].impact(this.game.ballsOnTable[k]);
        }
      }
    }
  }
  isAnyBallMoving() {
    for (let ball of this.game.ballsOnTable) {
      if (ball.velocity.len() > 0.01) {
        return true;
      }
    }
    return false;
  }
  checkPockets() {
    for (let i = 0; i < this.game.pockets.length; i++) {
      for (let j = 0; j < this.game.ballsOnTable.length; j++) {
        if (this.game.pockets[i].isBallCaptured(this.game.ballsOnTable[j])) {
          this.ballsInPockets.push(this.game.ballsOnTable[j]);
          this.game.ballsOnTable.splice(j, 1);
          break;
        }
      }
    }
  }
  onUpdate(dt) {
    this.updateBallPhysics(dt);
    this.computeCollisions();
    this.checkPockets();
    if (!this.isAnyBallMoving()) {
      this.game.changeState(new PoolGameState_RoundConclusion_default(this.game, this.ballsInPockets));
    }
  }
};
var PoolGameState_RoundSimulation_default = PoolGameState_RoundSimulation;

// docs/dist/poolGameContexts/PoolGameState_Aiming.js
var PoolGameState_Aiming = class extends PoolGameState_default {
  onEnterState() {
    this.game.cue.enabled = true;
    this.game.cue.onHit = () => this.game.changeState(new PoolGameState_RoundSimulation_default(this.game));
  }
  onLeaveState() {
    this.game.cue.enabled = false;
    this.game.cue.onHit = () => {
    };
  }
};
var PoolGameState_Aiming_default = PoolGameState_Aiming;

// docs/dist/poolGameContexts/PoolGameState_BallPlacement.js
var PoolGameContext_BallPlacement = class extends PoolGameState_default {
  constructor(game2, startingRound) {
    super(game2);
    this.handleMouseMove = (ev) => {
      let newPos = new Vec2_default(ev.offsetX, ev.offsetY);
      let horizontalBoundry;
      if (this.canPlaceAnywhere) {
        horizontalBoundry = PoolGame_default.PLAYABLE_AREA[0] + PoolGame_default.PLAYABLE_AREA[2] - PoolGame_default.BALL_RADIUS;
      } else {
        horizontalBoundry = PoolGame_default.PLAYABLE_AREA[0] + PoolGame_default.PLAYABLE_AREA[2] / 4 - PoolGame_default.BALL_RADIUS;
      }
      newPos.x = clamp(newPos.x, PoolGame_default.PLAYABLE_AREA[0] + PoolGame_default.BALL_RADIUS, horizontalBoundry);
      newPos.y = clamp(newPos.y, PoolGame_default.PLAYABLE_AREA[1] + PoolGame_default.BALL_RADIUS, PoolGame_default.PLAYABLE_AREA[1] + PoolGame_default.PLAYABLE_AREA[3] - PoolGame_default.BALL_RADIUS);
      this.game.whiteBall.position = newPos;
    };
    this.handleMouseClick = (ev) => {
      if (ev.button == 0) {
        this.game.changeState(new PoolGameState_Aiming_default(this.game));
      }
    };
    this.canPlaceAnywhere = !startingRound;
  }
  onEnterState() {
    this.game.cue.enabled = false;
    this.game.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.game.canvas.addEventListener("click", this.handleMouseClick);
  }
  onLeaveState() {
    this.game.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.game.canvas.removeEventListener("click", this.handleMouseClick);
  }
};
var PoolGameState_BallPlacement_default = PoolGameContext_BallPlacement;

// docs/dist/poolGameContexts/PoolGameState_Init.js
var PoolGameContext_Init = class extends PoolGameState_default {
  onEnterState() {
    this.game.changeState(new PoolGameState_BallPlacement_default(this.game, true));
  }
  onLeaveState() {
  }
};
var PoolGameState_Init_default = PoolGameContext_Init;

// docs/dist/PoolGame.js
var _PoolGame = class extends Game_default {
  constructor(canvas2) {
    super(canvas2);
    this.ballsOnTable = [];
    this.walls = [];
    this.pockets = [];
    this.currentPlayer = 1;
    this.scoredBallsP1 = [];
    this.scoredBallsP2 = [];
    this.announcementText = "";
    this.cue = new Cue_default(this.canvas);
    this.whiteBall = new Ball_default(Vec2_default.ZERO, _PoolGame.BALL_RADIUS, 0);
    this.setupWallColliders();
    this.setupPockets();
    this.state = new PoolGameState_Init_default(this);
    this.state.onEnterState();
    this.resetGame(true);
  }
  changeState(state) {
    this.state.onLeaveState();
    this.state = state;
    this.state.onEnterState();
  }
  setupWallColliders() {
    for (const wall of _PoolGame.WALL_VERTICES) {
      for (let i = 0; i < wall.length - 1; i++) {
        this.walls.push(new Line_default(wall[i], wall[i + 1]));
      }
    }
  }
  setupPockets() {
    this.pockets = [
      new Pocket_default(new Vec2_default(150, 170), 40),
      new Pocket_default(new Vec2_default(900, 160), 35),
      new Pocket_default(new Vec2_default(1650, 170), 40),
      new Pocket_default(new Vec2_default(150, 870), 40),
      new Pocket_default(new Vec2_default(900, 880), 35),
      new Pocket_default(new Vec2_default(1650, 870), 40)
    ];
  }
  resetGame(init = false) {
    this.resetPlayerScore();
    this.resetBallFormation();
    this.currentPlayer = 1;
    if (!init) {
      this.changeState(new PoolGameState_Init_default(this));
    }
  }
  resetBallFormation() {
    this.ballsOnTable = [
      this.whiteBall,
      new Ball_default(new Vec2_default(1275, 520), _PoolGame.BALL_RADIUS, 1),
      new Ball_default(new Vec2_default(1310, 500), _PoolGame.BALL_RADIUS, 2),
      new Ball_default(new Vec2_default(1310, 540), _PoolGame.BALL_RADIUS, 3),
      new Ball_default(new Vec2_default(1345, 480), _PoolGame.BALL_RADIUS, 4),
      new Ball_default(new Vec2_default(1345, 520), _PoolGame.BALL_RADIUS, 5),
      new Ball_default(new Vec2_default(1345, 560), _PoolGame.BALL_RADIUS, 6),
      new Ball_default(new Vec2_default(1380, 460), _PoolGame.BALL_RADIUS, 7),
      new Ball_default(new Vec2_default(1380, 500), _PoolGame.BALL_RADIUS, 8),
      new Ball_default(new Vec2_default(1380, 540), _PoolGame.BALL_RADIUS, 9),
      new Ball_default(new Vec2_default(1380, 580), _PoolGame.BALL_RADIUS, 10),
      new Ball_default(new Vec2_default(1415, 440), _PoolGame.BALL_RADIUS, 11),
      new Ball_default(new Vec2_default(1415, 480), _PoolGame.BALL_RADIUS, 12),
      new Ball_default(new Vec2_default(1415, 520), _PoolGame.BALL_RADIUS, 13),
      new Ball_default(new Vec2_default(1415, 560), _PoolGame.BALL_RADIUS, 14),
      new Ball_default(new Vec2_default(1415, 600), _PoolGame.BALL_RADIUS, 15)
    ];
    this.whiteBall.position = new Vec2_default(525, 520);
    this.cue.target = this.whiteBall;
  }
  resetPlayerScore() {
    this.scoredBallsP1 = [];
    this.scoredBallsP2 = [];
  }
  switchPlayer() {
    this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
  }
  makeAnnouncement(text, howLong) {
    this.announcementText = text;
    setTimeout(() => {
      this.announcementText = "";
    }, howLong);
  }
  onUpdate(dt) {
    this.state.onUpdate(dt);
  }
  drawPlayerScoresPanel() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "30px arial";
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Player 1", 850, 50);
    this.ctx.textAlign = "left";
    this.ctx.fillText("Player 2", 950, 50);
    this.ctx.beginPath();
    if (this.currentPlayer == 1) {
      this.ctx.arc(870, 35, 10, 0, Math.PI * 2, false);
    } else {
      this.ctx.arc(930, 35, 10, 0, Math.PI * 2, false);
    }
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    for (let i = 0; i < 7; i++) {
      let ballPos;
      const drawEmpty = () => {
        this.ctx.beginPath();
        this.ctx.arc(ballPos.x, ballPos.y, _PoolGame.BALL_RADIUS, 0, Math.PI * 2, false);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
      };
      ballPos = new Vec2_default(570 + i * (2 * _PoolGame.BALL_RADIUS + 5), 80);
      if (i < this.scoredBallsP1.length) {
        this.scoredBallsP1[i].position = ballPos;
        this.scoredBallsP1[i].draw(this.ctx);
      } else {
        drawEmpty();
      }
      ballPos = new Vec2_default(960 + i * (2 * _PoolGame.BALL_RADIUS + 5), 80);
      if (i < this.scoredBallsP2.length) {
        this.scoredBallsP2[i].position = ballPos;
        this.scoredBallsP2[i].draw(this.ctx);
      } else {
        drawEmpty();
      }
    }
  }
  drawTable() {
    this.ctx.fillStyle = "brown";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 5;
    roundRect(this.ctx, 100, 120, 1600, 800, 50, true);
    this.ctx.fillStyle = "darkgreen";
    this.ctx.strokeStyle = "darkgreen";
    this.ctx.fillRect(150, 170, 1500, 700);
    for (let pocket of this.pockets) {
      pocket.draw(this.ctx);
    }
    for (let wall of _PoolGame.WALL_VERTICES) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "green";
      this.ctx.moveTo(wall[0].x, wall[0].y);
      for (let i = 1; i < wall.length; i++) {
        this.ctx.lineTo(wall[i].x, wall[i].y);
      }
      this.ctx.fill();
    }
  }
  drawAnnouncementText() {
    const x = _PoolGame.PLAYABLE_AREA[0] + _PoolGame.PLAYABLE_AREA[2] / 2;
    const y = _PoolGame.PLAYABLE_AREA[1] + _PoolGame.PLAYABLE_AREA[3] * 0.1;
    this.ctx.fillStyle = "yellow";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.font = "70px arial";
    this.ctx.textBaseline = "alphabetic";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.announcementText, x, y);
    this.ctx.strokeText(this.announcementText, x, y);
  }
  onDraw() {
    this.drawTable();
    for (const ball of this.ballsOnTable) {
      ball.draw(this.ctx);
    }
    if (this.cue.enabled) {
      this.cue.draw(this.ctx);
    }
    this.drawPlayerScoresPanel();
    if (this.announcementText.length > 0) {
      this.drawAnnouncementText();
    }
  }
};
var PoolGame = _PoolGame;
PoolGame.BALL_RADIUS = 20;
PoolGame.PLAYABLE_AREA = [180, 200, 1440, 640];
PoolGame.WALL_VERTICES = [
  [new Vec2_default(190, 170), new Vec2_default(220, 200), new Vec2_default(850, 200), new Vec2_default(865, 170)],
  [new Vec2_default(935, 170), new Vec2_default(950, 200), new Vec2_default(1580, 200), new Vec2_default(1610, 170)],
  [new Vec2_default(150, 210), new Vec2_default(180, 240), new Vec2_default(180, 800), new Vec2_default(150, 830)],
  [new Vec2_default(1650, 210), new Vec2_default(1620, 240), new Vec2_default(1620, 800), new Vec2_default(1650, 830)],
  [new Vec2_default(190, 870), new Vec2_default(220, 840), new Vec2_default(850, 840), new Vec2_default(865, 870)],
  [new Vec2_default(935, 870), new Vec2_default(950, 840), new Vec2_default(1580, 840), new Vec2_default(1610, 870)]
];
var PoolGame_default = PoolGame;

// docs/dist/index.js
var canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var game = new PoolGame_default(canvas);
game.start();
//# sourceMappingURL=index.js.map
