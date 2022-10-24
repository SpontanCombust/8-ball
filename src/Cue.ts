import type Ball from "./Ball";
import { clamp } from "./Utils";
import Vec2 from "./Vec2";

export default class Cue {
    private static MAX_OFFSET_FROM_TARGET = 200;
    private static STRENGH_MULTIPLIER = 1000;

    public enabled = true;
    public target: Ball | null = null;

    private mousePos = new Vec2();
    private strength = 0.5;

    constructor(canvas: HTMLCanvasElement) {
        this.setupCanvasObserver(canvas);
    }

    private setupCanvasObserver(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousemove", (ev) => {
            const rect = canvas.getBoundingClientRect();
            this.mousePos = new Vec2(ev.clientX - rect.left, ev.clientY - rect.top);
        });

        canvas.addEventListener("wheel", (ev) => {
            this.strength = clamp(this.strength - ev.deltaY / 100, 0.0, 1.0);
        });

        canvas.addEventListener("click", (ev) => {
            if(ev.button == 0) {
                this.hitTarget();
            }
        });
    }

    public isTargetMoving(): boolean {
        if(this.target != null) {
            return this.target.velocity.len() < 0.01;
        }

        return false;
    }

    private directionFromTarget(): Vec2 {
        return Vec2.diff(this.mousePos, this.target!.position).normalized();
    }

    public getHitStrengh(): number {
        return this.strength * Cue.STRENGH_MULTIPLIER;
    }

    public hitTarget() {
        if(this.enabled) {
            this.target!.velocity = Vec2.scaled(
                this.directionFromTarget().negated(),
                this.getHitStrengh()
            );
        }
    }




    public draw(ctx: CanvasRenderingContext2D) {
        if(this.enabled) {
            const dir = this.directionFromTarget();
            let offset = Vec2.scaled(dir, this.target!.radius + this.strength * Cue.MAX_OFFSET_FROM_TARGET);

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