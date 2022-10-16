import PhysicsDemoPoolGame from "./physics_demo/PhysicsDemoPoolGame";

const canvas: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const game = new PhysicsDemoPoolGame(canvas);
game.start();

export { };

