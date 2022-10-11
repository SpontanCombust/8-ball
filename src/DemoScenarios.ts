import Ball from "./Ball";
import type PlayTable from "./PlayTable";
import Vec2 from "./Vec2";

export function playDemoScenario1(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 300, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 + 100, canvas.height / 2), 50)
    ];

    table.balls[0].applyPushForce(new Vec2(15, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}

export function playDemoScenario2(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 300, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 + 100, canvas.height / 2), 50)
    ];

    table.balls[0].applyPushForce(new Vec2(20, 3));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}

export function playDemoScenario3(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 300, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 + 100, canvas.height / 2), 50)
    ];

    table.balls[0].applyPushForce(new Vec2(20, -4.75));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}