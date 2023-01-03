import type Ball from "./Ball";
import { clamp } from "./Utils";
import Vec2 from "./Vec2";

/**
 * Represents the cue used to hit the white ball
 * @class Cue
 */
export default class Cue {
    /**
     * How far cue can be offset away from the ball
     */
    private static MAX_OFFSET_FROM_TARGET = 200;
    private static STRENGH_MULTIPLIER = 1000;

    /**
     * If the cue is active
     */
    public enabled = false;
    /**
     * Target ball of the cue
     */
    public target: Ball | null = null;

    /**
     * Current position of the mouse cursor
     */
    private mousePos = new Vec2();
    /**
     * Coefficient of the hit strength in range [0;1]
     */
    private strength = 0.5;

    /**
     * Delegate for when the cue is used
     */
    public onHit: () => void = () => {};

    
    constructor(canvas: HTMLCanvasElement) {
        this.setupCanvasObserver(canvas);
    }

    /**
     * Sets up all the move and hit strength controllers
     * @param canvas 
     */
    private setupCanvasObserver(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousemove", (ev) => {
            const rect = canvas.getBoundingClientRect();
            this.mousePos = new Vec2(ev.clientX - rect.left, ev.clientY - rect.top);
        });

        canvas.addEventListener("wheel", (ev) => {
            ev.preventDefault();
            this.strength = clamp(this.strength - ev.deltaY / 100, 0.0, 1.0);
        });

        canvas.addEventListener("click", (ev) => {
            if(ev.button == 0) {
                this.hitTarget();
            }
        });
    }

    private directionFromTarget(): Vec2 {
        if(this.target && this.enabled) {
            return Vec2.diff(this.mousePos, this.target.position).normalized();
        }

        return Vec2.ZERO;
    }

    public getHitStrengh(): number {
        return this.strength * Cue.STRENGH_MULTIPLIER;
    }

    public hitTarget() {
        if(this.target && this.enabled) {
            this.target.velocity = Vec2.scaled(
                this.directionFromTarget().negated(),
                this.getHitStrengh()
            );

            this.onHit();
        }
    }



    /**
     * Draw the cue onto the canvas
     * @param ctx rendering context
     */
    public draw(ctx: CanvasRenderingContext2D) {
        if(this.target && this.enabled) {
            const dir = this.directionFromTarget();
            let offset = Vec2.scaled(dir, this.target.radius + this.strength * Cue.MAX_OFFSET_FROM_TARGET);
    
            const lineToRelative = (from: number, to: number) => {
                const fromPos = Vec2.sum(this.target!.position, Vec2.scaled(dir, offset.len() + from));
                const toPos = Vec2.sum(this.target!.position, Vec2.scaled(dir, offset.len() + to));
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.lineTo(toPos.x, toPos.y);
            }
    
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
}