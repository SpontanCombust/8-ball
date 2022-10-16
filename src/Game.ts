export default abstract class Game {
    private lastTimestamp: number = 0;

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
    }

    public start() {
        window.requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    private gameLoop(timestamp: number): void {
        const dt = (timestamp - this.lastTimestamp) / 1000.0;
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.onUpdate(dt);
        this.onDraw();
    
        this.lastTimestamp = timestamp;
        window.requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    protected abstract onUpdate(dt: number): void;
    protected abstract onDraw(): void;
}