import PoolGame from "./PoolGame";

const canvas: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const game = new PoolGame(canvas);
game.start();

export { };

