/**
 * Abstract base game class
 * @class Game
 */
export default abstract class Game {
    private lastTimestamp: number = 0;

    /**
     * Instance of the HTML canvas
     */
    public canvas: HTMLCanvasElement;
    /**
     * Instance of the rendering context
     */
    public ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
    }

    /**
     * Method that sets up the game loop
     */
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

    /**
     * Method called on every game update
     * @param dt time since last frame
     */
    protected abstract onUpdate(dt: number): void;
    /**
     * Method called on every game drawing procedure
     */
    protected abstract onDraw(): void;
}