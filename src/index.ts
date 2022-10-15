import Ball from "./Ball";
import { 
    playDemoScenario1, 
    playDemoScenario2, 
    playDemoScenario3, 
    playDemoScenario4, 
    playDemoScenario5, 
    playDemoScenario6, 
    playDemoScenario7
} from "./DemoScenarios";
import PlayTable from "./PlayTable";
import Vec2 from "./Vec2";

const canvas: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const playTable = new PlayTable();

document.getElementById("playScenario1Btn")?.addEventListener("click", () => playDemoScenario1(playTable, canvas));
document.getElementById("playScenario2Btn")?.addEventListener("click", () => playDemoScenario2(playTable, canvas));
document.getElementById("playScenario3Btn")?.addEventListener("click", () => playDemoScenario3(playTable, canvas));
document.getElementById("playScenario4Btn")?.addEventListener("click", () => playDemoScenario4(playTable, canvas));
document.getElementById("playScenario5Btn")?.addEventListener("click", () => playDemoScenario5(playTable, canvas));
document.getElementById("playScenario6Btn")?.addEventListener("click", () => playDemoScenario6(playTable, canvas));
document.getElementById("playScenario7Btn")?.addEventListener("click", () => playDemoScenario7(playTable, canvas));


let lastTimestamp: number = 0;

function gameLoop(timestamp: number): void {
    const dt = (timestamp - lastTimestamp) / 1000.0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    playTable.update(dt);
    playTable.draw(ctx);

    lastTimestamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

export {};