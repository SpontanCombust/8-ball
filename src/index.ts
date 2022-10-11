import Ball from "./Ball";
import Vec2 from "./Vec2";

const canvas: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const balls = [new Ball(new Vec2(100, 100), 50), new Ball(new Vec2(300, 100), 50)]

const DELTA_TIME_SEC = 1.0 / 60.0;

function gameLoop(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let ball of balls) {
        ball.update(DELTA_TIME_SEC);
    }

    for(let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            if(balls[i].resolveCollision(balls[j])) {
                balls[i].impact(balls[j]);
            }
        }
    }

    for(let ball of balls) {
        ball.draw(ctx);
    }

    // if(balls[0].pushForce.len() > 0) {
    //     ctx.beginPath();
    //     ctx.moveTo(balls[0].position.x, balls[0].position.y);
    // }
}

canvas.addEventListener("mousedown", (ev: MouseEvent) => {
    let f = Vec2.diff(new Vec2(ev.x, ev.y), balls[0].position);
    f = Vec2.scaled(f, 1 / 100);
    balls[0].applyPushForce(f);
});

canvas.addEventListener("mouseup", (ev: MouseEvent) => {
    balls[0].resetPushForce();
});

setInterval(gameLoop, DELTA_TIME_SEC * 1000.0);

export {};