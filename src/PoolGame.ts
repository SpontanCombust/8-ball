import type Ball from "./Ball";
import Game from "./Game";
import Line from "./Line";
import { roundRect } from "./Utils";
import Vec2 from "./Vec2";

export default class PoolGame extends Game {
    public balls: Ball[] = [];
    public walls: Line[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.setupWallColliders();
        this.setupPockets();

        this.resetGame();
    }




    private static WALL_VERTICES = [
        // upper wall
        [new Vec2(190, 170), new Vec2(220, 200), new Vec2(850, 200), new Vec2(865, 170)],
        [new Vec2(935, 170), new Vec2(950, 200), new Vec2(1580, 200), new Vec2(1610, 170)],
        
        // side walls
        [new Vec2(150, 210), new Vec2(180, 240), new Vec2(180, 800), new Vec2(150, 830)],
        [new Vec2(1650, 210), new Vec2(1620, 240), new Vec2(1620, 800), new Vec2(1650, 830)],

        // lower wall
        [new Vec2(190, 870), new Vec2(220, 840), new Vec2(850, 840), new Vec2(865, 870)],
        [new Vec2(935, 870), new Vec2(950, 840), new Vec2(1580, 840), new Vec2(1610, 870)],
    ];

    private setupWallColliders() {
        for(const wall of PoolGame.WALL_VERTICES) {
            for(let i = 0; i < wall.length - 1; i++) {
                this.walls.push(new Line(wall[i], wall[i+1]));
            }
        }
    }

    private setupPockets() {
        // TODO implement
        // Fill this.pockets array
    }




    public resetGame() {
        this.resetPlayerScore();
        this.resetBallFormation();
    }

    private resetBallFormation() {
        // TODO implement
        // Should fill this.balls array with balls in the triangle formation on the table,
        // position the white ball and the cue to it.
    }

    private resetPlayerScore() {
        // TODO implement
    }



    
    protected onUpdate(dt: number): void {
        for(let ball of this.balls) {
            ball.update(dt);
        }
    
        for(let i = 0; i < this.balls.length; i++) {
            for (let j = 0; j < this.walls.length; j++) {
                if(this.balls[i].resolveCollision(this.walls[j])) {
                    this.balls[i].impact(this.walls[j]);
                }
            }

            for (let k = i + 1; k < this.balls.length; k++) {
                if(this.balls[i].resolveCollision(this.balls[k])) {
                    this.balls[i].impact(this.balls[k]);
                }
            }
        }
    }




    private drawPlayerScoresPanel() {
        //TODO implement
        // Draw panel which is split in half.
        // In each half on top there's either "Player 1" or "Player 2"
        // and under the name there is a row of balls currently scored by said player.
    }

    private drawTable() {
        // brown outer border
        this.ctx.fillStyle = "brown";
        this.ctx.strokeStyle = "black";
        roundRect(this.ctx, 100, 120, 1600, 800, 50, true);


        // green padding
        this.ctx.fillStyle = "darkgreen";
        this.ctx.strokeStyle = "darkgreen";
        this.ctx.fillRect(150, 170, 1500, 700);


        // pockets
        this.ctx.fillStyle = "black";

        this.ctx.beginPath();
        this.ctx.arc(150, 170, 40, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(900, 160, 35, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(1650, 170, 40, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(150, 870, 40, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(900, 880, 35, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(1650, 870, 40, 0, 2 * Math.PI);
        this.ctx.fill();



        // walls
        for(let wall of PoolGame.WALL_VERTICES) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "green";
            
            this.ctx.moveTo(wall[0].x, wall[0].y);
            for(let i = 1; i < wall.length; i++) {
                this.ctx.lineTo(wall[i].x, wall[i].y);
            }

            this.ctx.fill();
        }
    }

    protected onDraw(): void {
        this.drawPlayerScoresPanel();
        this.drawTable();

        for(const ball of this.balls) {
            ball.draw(this.ctx);
        }

        // Uncomment to see wall colliders
        // for(const wall of this.walls) {
        //     wall.draw(this.ctx);
        // }
    }
}