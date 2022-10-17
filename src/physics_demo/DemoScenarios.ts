import Line from "../Line";
import Ball from "../Ball";
import type PoolGame from "../PoolGame";
import Vec2 from "../Vec2";

export function playDemoScenario1(table: PoolGame) {
    table.balls = [
        new Ball(new Vec2(300, 400), 50), 
        new Ball(new Vec2(700, 400), 50)
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(300, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}

export function playDemoScenario2(table: PoolGame) {
    table.balls = [
        new Ball(new Vec2(300, 400), 50), 
        new Ball(new Vec2(700, 400), 50)
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(400, -60));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}

export function playDemoScenario3(table: PoolGame) {
    table.balls = [
        new Ball(new Vec2(300, 400), 50), 
        new Ball(new Vec2(700, 400), 50)
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(300, 0));
    table.balls[1].applyPushForce(new Vec2(60, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}

export function playDemoScenario4(table: PoolGame, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(300, 400), 50), 
        new Ball(new Vec2(800, 400), 50)
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(300, 0));
    table.balls[1].applyPushForce(new Vec2(-300, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
        table.balls[1].resetPushForce();
    }, 1000);
}

export function playDemoScenario5(table: PoolGame, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(300, 200), 50), 
        new Ball(new Vec2(800, 600), 50)
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(400, 400));
    table.balls[1].applyPushForce(new Vec2(-200, -200));

    setTimeout(() => {
        table.balls[0].resetPushForce();
        table.balls[1].resetPushForce();
    }, 1000);
}

export function playDemoScenario6(table: PoolGame, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(300, 200), 50), 
        new Ball(new Vec2(700, 230), 50)
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(400, 400));
    table.balls[1].applyPushForce(new Vec2(-300, 500));

    setTimeout(() => {
        table.balls[0].resetPushForce();
        table.balls[1].resetPushForce();
    }, 1000);
}

export function playDemoScenario7(table: PoolGame, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(100, 400), 48), 
        new Ball(new Vec2(400, 400), 48), 
        new Ball(new Vec2(500, 400), 48), 
        new Ball(new Vec2(600, 400), 48),
        new Ball(new Vec2(700, 400), 48),
        new Ball(new Vec2(800, 400), 48),
    ];
    table.walls = [];

    table.balls[0].applyPushForce(new Vec2(400, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}

export function playDemoScenario8(table: PoolGame, canvas: HTMLCanvasElement) {
    table.balls = [
        new Ball(new Vec2(300, 250), 50),   
    ];
    table.walls = [];

    table.walls = [
        new Line(
            new Vec2(1000, 150), 
            new Vec2(1100, 250)),

        new Line(
            new Vec2(1100, 450), 
            new Vec2(1000, 550)),

        new Line(
            new Vec2(400, 400), 
            new Vec2(400, 500)),

        new Line(
            new Vec2(200, 200), 
            new Vec2(100, 300)),

        new Line(
            new Vec2(100, 600), 
            new Vec2(250, 600)),
    ];

    table.balls[0].applyPushForce(new Vec2(800, 0));

    setTimeout(() => {
        table.balls[0].resetPushForce();
    }, 1000);
}