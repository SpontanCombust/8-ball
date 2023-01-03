import type Line from "./Line";
import Vec2 from "./Vec2";

/**
 * Represents the pool ball that can react with other balls of the same kind and walls
 * @class Ball
 */
export default class Ball {
    /**
     * Magnitude of the restistance force that the ball experiences when it is moving
     */
    public static RESISTANCE_FORCE_MAGN = 50;
    /**
     * Factor which dictates how much velocity is lost by the ball when it hits a wall
     */
    public static WALL_VELOCITY_ABSORPTION_FACTOR = 0.1;

    /**
     * Position of the ball on the table
     */
    public position: Vec2;
    /**
     * Radius of the ball
     */
    public radius: number;
    /**
     * Number by which the ball is identified, which dictates how it should look
     */
    public lookVariant: number;
    /**
     * Mass of the ball
     */
    public mass: number;
    
    /**
     * Current force that is exerted onto the ball
     */
    public pushForce: Vec2 = new Vec2();
    /**
     * Ball's acceleration in space
     */
    public acceleration: Vec2 = new Vec2();
    /**
     * Ball's current velocity
     */
    public velocity: Vec2 = new Vec2();
    
    constructor(position: Vec2, radius: number, lookVariant?: number, mass?: number) {
        this.position = position;
        this.radius = radius;
        this.lookVariant = (lookVariant != undefined) ? lookVariant : 0;
        this.mass = (mass != undefined) ? mass : 1.0;
    }



    /**
     * Calculates the vector of the resistance force that should currently be exerted onto the ball
     * @returns Current resistance force
     */
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

    /**
     * @returns Ball's momentum (product of mass and velocity)
     */
    public momentum(): Vec2 {
        return Vec2.scaled(this.velocity, this.mass);
    }

    /**
     * @returns Ball's kinetic energy
     */
    public kineticEnergy(): number {
        return this.mass * this.velocity.len() * this.velocity.len() / 2; 
    }


    /**
     * @returns Returns whether this ball's variant will give it a striped color appearance
     */
    public isStripedVariant(): boolean {
        return this.lookVariant >= 9 && this.lookVariant <= 15;
    }

    /**
     * @returns Returns whether this ball's variant will give it a solid color appearance
     */
    public isSolidVariant(): boolean {
        return this.lookVariant >= 1 && this.lookVariant <= 8;
    }



    /**
     * Detects and if necessary corrects position of the ball and collider object resulting from their collision
     * @param collider ball or wall collider
     * @returns if collision happened
     */
    public resolveCollision(collider: Ball | Line): boolean {
        if(collider instanceof Ball) {
            return this.resolveCollisionWithBall(collider);
        } else {
            return this.resolveCollisionWithWall(collider);
        }
    }

    /**
     * Detects and if necessary corrects position of this ball and other ball resulting from their collision
     * @param collider other ball
     * @returns if collision happened
     */
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

    /**
     * Detects and if necessary corrects position of this ball resulting from collision with a wall
     * @param collider wall
     * @returns if collision happened
     */
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



    /**
     * Resolves the transfer of momentum between this and other physical object
     * @param impacted other object this object got in contact with 
     */
    public impact(impacted: Ball | Line) {
        if(impacted instanceof Ball) {
            this.impactWithBall(impacted);
        } else {
            this.impactWithWall(impacted);
        }
    }

    /**
     * Resolves the transfer of momentum between this and other ball
     * @param impacted other ball
     */
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

    /**
     * Resolves the transfer of momentum between this ball and a wall
     * @param impacted hit wall
     */
    private impactWithWall(impacted: Line) {
        const normal = impacted.normalTo(this.position);
        // DISCUSS absorption should probably be done only to the velocity component parallel to wall's normal
        this.velocity = Vec2.scaled(this.velocity.reflected(normal.normalized()), 1.0 - Ball.WALL_VELOCITY_ABSORPTION_FACTOR);
    }

    /**
     * @param momentum momentum
     * @returns velocity calculated from given momentum
     */
    private velocityFromMomentum(momentum: Vec2): Vec2 {
        return Vec2.scaled(momentum, 1 / this.mass);
    }

    /**
     * Calculates the amount of velocity that should be transferred to this ball 
     * based on conservation of momentum and conservation of kinetic energy
     * @param impacted other impacted ball
     * @param thisTransferableVelocity 
     * @param impactedTransferableVelocity 
     * @returns final velocity of 'this' in the direction axis
     * @private
     */
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



    /**
     * Update this ball's physics
     * @param dt time since last frame
     */
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



    /**
     * Draw this ball onto canvas
     * @param ctx rendering context
     */
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

    /**
     * Draw this ball as plain white
     * @param ctx rendering context
     */
    private drawWhite(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * Draw this ball as a solid color variant
     * @param ctx rendering context
     * @param color fill color
     */
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

    /**
     * Draw this ball as a striped color variant
     * @param ctx rendering context
     * @param color fill color
     */
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