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

export function playDemoScenario4(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 300, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 + 200, canvas.height / 2), 50)
    ];

    table.balls[0].applyPushForce(new Vec2(15, 0));
    table.balls[1].applyPushForce(new Vec2(-15, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
        table.balls[1].resetPushForce();
    }, 1000);
}

export function playDemoScenario5(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 300, canvas.height / 2 - 200), 50), 
        new Ball(new Vec2(canvas.width / 2 + 200, canvas.height / 2 + 200), 50)
    ];

    table.balls[0].applyPushForce(new Vec2(20, 20));
    table.balls[1].applyPushForce(new Vec2(-10, -10));

    setTimeout(() => {
        table.balls[0].resetPushForce();
        table.balls[1].resetPushForce();
    }, 1000);
}

export function playDemoScenario6(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 300, canvas.height / 2 - 200), 50), 
        new Ball(new Vec2(canvas.width / 2 + 100, canvas.height / 2 - 50), 50)
    ];

    table.balls[0].applyPushForce(new Vec2(20, 20));
    table.balls[1].applyPushForce(new Vec2(-15, 15));

    setTimeout(() => {
        table.balls[0].resetPushForce();
        table.balls[1].resetPushForce();
    }, 1000);
}

export function playDemoScenario7(table: PlayTable, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(canvas.width / 2 - 500, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 - 200, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 - 100, canvas.height / 2), 50), 
        new Ball(new Vec2(canvas.width / 2 + 0, canvas.height / 2), 50),
        new Ball(new Vec2(canvas.width / 2 + 100, canvas.height / 2), 50),
        new Ball(new Vec2(canvas.width / 2 + 200, canvas.height / 2), 50),
    ];

    table.balls[0].applyPushForce(new Vec2(20, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}