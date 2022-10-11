import Vec2 from "./Vec2";

export default class Ball {
    public static RESISTANCE_FORCE_MAGN = 0.5;

    public position: Vec2;
    public radius: number;
    
    public mass: number = 1;
    public pushForce: Vec2 = new Vec2();
    public acceleration: Vec2 = new Vec2();
    public velocity: Vec2 = new Vec2();
    
    constructor(position: Vec2, radius: number) {
        this.position = position;
        this.radius = radius;
    }

    public resolveCollision(other: Ball): boolean {
        const posDiff = Vec2.diff(other.position, this.position);
        const radiusSum = this.radius + other.radius;
        const intersectLen = radiusSum - posDiff.len();

        if(intersectLen > 0.0) {
            const displacement = Vec2.scaled(posDiff.normalized(), (intersectLen / 2.0));
            this.position = Vec2.diff(this.position, displacement);
            other.position = Vec2.sum(other.position, displacement);

            return true;
        }

        return false;
    }

    public resistanceForce(): Vec2 {
        return Vec2.scaled(this.velocity.normalized(), -Ball.RESISTANCE_FORCE_MAGN);
    }

    public applyPushForce(f: Vec2) {
        this.pushForce = f;
    }

    public resetPushForce() {
        this.pushForce = Vec2.ZERO;
    }

    public momentum() {
        return Vec2.scaled(this.velocity, this.mass);
    }

    public impact(impacted: Ball) {
        // doesn't account for elasicity factor
        
        const transferredMomentumToImpacted = this.transferredImpactMomentum(impacted);
        const transferredMomentumToThis = impacted.transferredImpactMomentum(this);
        
        impacted.velocity = Vec2.sum(impacted.velocity, transferredMomentumToImpacted);
        this.velocity = Vec2.diff(this.velocity, transferredMomentumToImpacted);
        impacted.velocity = Vec2.diff(impacted.velocity, transferredMomentumToThis);
        this.velocity = Vec2.sum(this.velocity, transferredMomentumToThis);
    }

    private transferredImpactMomentum(impacted: Ball): Vec2 {
        const dirToImpacted = Vec2.diff(impacted.position, this.position).normalized();
        const angleOfAttackDotProd = Vec2.dot(this.velocity.normalized(), dirToImpacted);
        if(angleOfAttackDotProd > 0.0) {
            return Vec2.scaled(dirToImpacted, angleOfAttackDotProd * this.velocity.len());
        }

        return Vec2.ZERO;
    }


    public update(dt: number) {
        let finalForce: Vec2;
        if(this.pushForce.len() >= this.resistanceForce().len()) {
            finalForce = Vec2.diff(this.pushForce, this.resistanceForce());
        } else if(this.velocity.len() > 0.0001) {
            finalForce = this.resistanceForce();
        } else {
            finalForce = Vec2.ZERO;
        }

        this.acceleration = Vec2.scaled(finalForce, 1 / this.mass);
        this.velocity = Vec2.sum(this.acceleration, this.velocity);
        this.position = Vec2.sum(this.position, Vec2.scaled(this.velocity, dt));
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}