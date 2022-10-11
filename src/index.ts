import Ball from "./Ball";
import { playDemoScenario1, playDemoScenario2, playDemoScenario3 } from "./DemoScenarios";
import PlayTable from "./PlayTable";
import Vec2 from "./Vec2";

const canvas: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const playTable = new PlayTable();
const DELTA_TIME_SEC = 1.0 / 60.0;

document.getElementById("playScenario1Btn")?.addEventListener("click", () => playDemoScenario1(playTable, canvas));
document.getElementById("playScenario2Btn")?.addEventListener("click", () => playDemoScenario2(playTable, canvas));
document.getElementById("playScenario3Btn")?.addEventListener("click", () => playDemoScenario3(playTable, canvas));


function gameLoop(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    playTable.update(DELTA_TIME_SEC);
    playTable.draw(ctx);
}

// function onMouseDown(pos: Vec2) {
//     let f = Vec2.diff(pos, playTable.balls[0].position);
//     f = Vec2.scaled(f, 1 / 100);
//     playTable.balls[0].applyPushForce(f);
// }

// function onMouseUp(pos: Vec2) {
//     playTable.balls[0].resetPushForce();
// }

// canvas.addEventListener("mousedown", (ev: MouseEvent) => onMouseDown(new Vec2(ev.x, ev.y)));
// canvas.addEventListener("mouseup", (ev: MouseEvent) => onMouseUp(new Vec2(ev.x, ev.y)));
//TODO add support for mobile

setInterval(gameLoop, DELTA_TIME_SEC * 1000.0);

export {};