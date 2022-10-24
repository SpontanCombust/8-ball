import type Line from "./Line";
import Vec2 from "./Vec2";

export default class Ball {
    public static RESISTANCE_FORCE_MAGN = 50;
    public static WALL_VELOCITY_ABSORPTION_FACTOR = 0.1;

    public position: Vec2;
    public radius: number;
    public lookVariant: number;
    public mass: number;
    
    public pushForce: Vec2 = new Vec2();
    public acceleration: Vec2 = new Vec2();
    public velocity: Vec2 = new Vec2();
    
    constructor(position: Vec2, radius: number, lookVariant?: number, mass?: number) {
        this.position = position;
        this.radius = radius;
        this.lookVariant = (lookVariant != undefined) ? lookVariant : 0;
        this.mass = (mass != undefined) ? mass : 1.0;
    }




    public resistanceForce(): Vec2 {
        const HALT_VELOCITY_THRESHOLD = 10; 

        let resistanceMultip = 1.0;
        if(this.velocity.len() < HALT_VELOCITY_THRESHOLD) {
            //HACK that causes the velocity to not overflow from the resistance force
            // under the threshold resistance lessens and in consequence the deceleration
            // too much deceleration would cause the velocity to go in the opposite direction
            // with this simple dynamics setup in update()
            resistanceMultip = this.velocity.len() / HALT_VELOCITY_THRESHOLD; 
        }

        return Vec2.scaled(this.velocity.normalized(), -Ball.RESISTANCE_FORCE_MAGN * resistanceMultip);
    }

    public momentum(): Vec2 {
        return Vec2.scaled(this.velocity, this.mass);
    }

    public kineticEnergy(): number {
        return this.mass * this.velocity.len() * this.velocity.len() / 2; 
    }

    public isStripedVariant(): boolean {
        return this.lookVariant >= 9 && this.lookVariant <= 15;
    }

    public isSolidVariant(): boolean {
        return this.lookVariant >= 1 && this.lookVariant <= 8;
    }




    public resolveCollision(collider: Ball | Line): boolean {
        if(collider instanceof Ball) {
            return this.resolveCollisionWithBall(collider);
        } else {
            return this.resolveCollisionWithWall(collider);
        }
    }

    private resolveCollisionWithBall(other: Ball): boolean {
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

    private resolveCollisionWithWall(wall: Line): boolean {
        const normal = wall.normalTo(this.position);
        const possibleCollisionPoint = Vec2.diff(this.position, normal); // add a negative of normal vec
        
        if(normal.len() < this.radius) {
            if(wall.contains(possibleCollisionPoint)
                || Vec2.diff(this.position, wall.p1).len() < this.radius
                || Vec2.diff(this.position, wall.p2).len() < this.radius) {

                this.position = Vec2.sum(possibleCollisionPoint, Vec2.scaled(normal.normalized(), this.radius));
                return true;
            }
        }
        
        return false;
    } 



    
    public impact(impacted: Ball | Line) {
        if(impacted instanceof Ball) {
            this.impactWithBall(impacted);
        } else {
            this.impactWithWall(impacted);
        }
    }

    private impactWithBall(impacted: Ball) {
        //TODO make balls less bouncy
        // console.log(`BEFORE: p = ${Vec2.sum(this.momentum(), impacted.momentum())}, Ek = ${this.kineticEnergy() + impacted.kineticEnergy()}`);

        const dirToImpacted = Vec2.diff(impacted.position, this.position).normalized();

        // Here we transfer from normal coordinate system to the local one, where the main axis 
        // is denoted by vector coming from 'this' object position to 'impacted' position;
        // the secondary axis is perpendicular to the main axis.
        //
        // We do this, because this way to calculate the distribution of velocity we will have two pararrel vectors at our disposal:
        // one of them represents the momentum vector that can be transferred to the 'impated' object,
        // the other represents the momentum retained fully by the object.
        // Since those momentum vectors are pararrel we can apply simpler 1D physics rules to them. 

        // Dot product between normalized direction from one object to other and normalized velocity vector is equal cosine between those two.
        // Multiplied by the direction vector itself gives you aformentioned momentum that can be transferred.
        const thisTransferableMomentumMagn = this.momentum().len() * Vec2.dot(this.velocity.normalized(), dirToImpacted);
        const thisTransferableMomentum = Vec2.scaled(dirToImpacted, thisTransferableMomentumMagn);
        const impactedTransferableMomentumMagn = impacted.momentum().len() * Vec2.dot(impacted.velocity.normalized(), dirToImpacted);
        const impactedTransferableMomentum = Vec2.scaled(dirToImpacted, impactedTransferableMomentumMagn);

        // Assigning the remaining momentums first
        this.velocity = this.velocityFromMomentum(Vec2.diff(this.momentum(), thisTransferableMomentum));
        impacted.velocity = impacted.velocityFromMomentum(Vec2.diff(impacted.momentum(), impactedTransferableMomentum));
        
        // Now adding the distributed momentums from the impact
        const thisTransferableVelocity = this.velocityFromMomentum(thisTransferableMomentum);
        const impactedTransferableVelocity = impacted.velocityFromMomentum(impactedTransferableMomentum);

        const distributedVelocity = this.computeImpactVelocityDistribution(
            impacted,
            thisTransferableVelocity,
            impactedTransferableVelocity
        );

        const totalTransferableVelocity = Vec2.sum(thisTransferableVelocity, impactedTransferableVelocity);

        this.velocity = Vec2.sum(this.velocity, distributedVelocity);
        impacted.velocity = Vec2.sum(impacted.velocity, Vec2.diff(totalTransferableVelocity, distributedVelocity));
        
        // console.log(`AFTER: p = ${Vec2.sum(this.momentum(), impacted.momentum())}, Ek = ${this.kineticEnergy() + impacted.kineticEnergy()}`);
    }

    private impactWithWall(impacted: Line) {
        const normal = impacted.normalTo(this.position);
        // DISCUSS absorption should probably be done only to the velocity component parallel to wall's normal
        this.velocity = Vec2.scaled(this.velocity.reflected(normal.normalized()), 1.0 - Ball.WALL_VELOCITY_ABSORPTION_FACTOR);
    }

    private velocityFromMomentum(momentum: Vec2): Vec2 {
        return Vec2.scaled(momentum, 1 / this.mass);
    }

    // Based on conservation of momentum and conservation of kinetic energy
    // Returns final velocity of 'this' in the direction axis
    private computeImpactVelocityDistribution(impacted: Ball, thisTransferableVelocity: Vec2, impactedTransferableVelocity: Vec2): Vec2 {
        return Vec2.sum(
            Vec2.scaled(
                thisTransferableVelocity,
                (this.mass - impacted.mass) / (this.mass + impacted.mass)
            ),
            Vec2.scaled(
                impactedTransferableVelocity,
                2 * impacted.mass / (this.mass + impacted.mass)
            )
        );
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
        this.velocity = Vec2.sum(this.velocity, Vec2.scaled(this.acceleration, dt));
        this.position = Vec2.sum(this.position, Vec2.scaled(this.velocity, dt));
    }




    public draw(ctx: CanvasRenderingContext2D) {
        switch(this.lookVariant) {
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

    private drawWhite(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    private drawSolid(ctx: CanvasRenderingContext2D, color: string) {
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

    private drawStriped(ctx: CanvasRenderingContext2D, color: string) {
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
        // have to repeat so that stroke is drawn on the bottom too
        ctx.arc(this.position.x, this.position.y, this.radius, Math.PI * 0.25, Math.PI * 1.75, true); 
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 0.5, 0, Math.PI * 2, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();

        ctx.font = "17px serif"
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(this.lookVariant.toString(), this.position.x, this.position.y + 5);
    }

}