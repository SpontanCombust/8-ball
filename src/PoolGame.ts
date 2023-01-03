import Ball from "./Ball";
import Cue from "./Cue";
import Game from "./Game";
import Line from "./Line";
import Pocket from "./Pocket";
import type PoolGameState from "./PoolGameState";
import PoolGameContext_Init from "./poolGameContexts/PoolGameState_Init";
import { roundRect } from "./Utils";
import Vec2 from "./Vec2";

/**
 * 4 main game states:
    1. ball placement
    2. aiming
    3. balls boucing
    4. end of the round - evaluation
        4.1. player scored - continue with the same player to state 2.
        4.2. player didn't score or scored incorrect ball type - continue wiht the other player to state 2.
        4.3. player put the white ball in the pocket  - switch to the other player and go back to state 1.
        4.4. player put the black ball in the pocket
            4.4.1 it is not the last ball - instant fail
            4.4.2 it is the last ball - win
*/

/**
 * Central processing class of game's logic and rendering
 * @class PoolGame
*/
export default class PoolGame extends Game {
    /**
     * Radius of pool balls
     */
    public static BALL_RADIUS = 20;
    /**
     * Dimensions of the inside of the pool table
     */
    public static PLAYABLE_AREA = [180, 200, 1440, 640]; // x, y, w, h

    /**
     * Array of balls on the table
     */
    public ballsOnTable: Ball[] = [];
    /**
     * Array of walls bounding the play area
     */
    public walls: Line[] = [];
    /**
     * Array of scoring pockets
     */
    public pockets: Pocket[] = [];
    /**
     * Cue used to hit balls
     */
    public cue: Cue;
    
    public whiteBall: Ball;
    public currentPlayer: 1 | 2 = 1;
    public scoredBallsP1: Ball[] = [];
    public scoredBallsP2: Ball[] = [];

    /**
     * Current game state
     */
    public state: PoolGameState;

    /**
     * Text displayed during end of the round 
     */
    public announcementText = "";


    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.cue = new Cue(this.canvas);
        this.whiteBall = new Ball(Vec2.ZERO, PoolGame.BALL_RADIUS, 0);
        
        this.setupWallColliders();
        this.setupPockets();
        
        this.state = new PoolGameContext_Init(this);
        this.state.onEnterState();

        this.resetGame(true);
    }


    /**
     * Change the current state of the game
     * @param state new state
     */
    public changeState(state: PoolGameState) {
        this.state.onLeaveState();
        this.state = state;
        this.state.onEnterState();
    }


    /**
     * Array of line coordinates which form pool table walls
     */
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
        this.pockets = [
            new Pocket(new Vec2(150, 170), 40),
            new Pocket(new Vec2(900, 160), 35),
            new Pocket(new Vec2(1650, 170), 40),
            new Pocket(new Vec2(150, 870), 40),
            new Pocket(new Vec2(900, 880), 35),
            new Pocket(new Vec2(1650, 870), 40),
        ];
    }



    /**
     * Sets the game back to its initial state
     * @param init if it's done the first time
     */
    public resetGame(init = false) {
        this.resetPlayerScore();
        this.resetBallFormation();

        this.currentPlayer = 1;

        if(!init) {
            this.changeState(new PoolGameContext_Init(this));
        }
    }

    private resetBallFormation() {
        this.ballsOnTable = [
            this.whiteBall,

            new Ball(new Vec2(1275, 520), PoolGame.BALL_RADIUS, 1),

            new Ball(new Vec2(1310, 500), PoolGame.BALL_RADIUS, 2),
            new Ball(new Vec2(1310, 540), PoolGame.BALL_RADIUS, 3),

            new Ball(new Vec2(1345, 480), PoolGame.BALL_RADIUS, 4),
            new Ball(new Vec2(1345, 520), PoolGame.BALL_RADIUS, 5),
            new Ball(new Vec2(1345, 560), PoolGame.BALL_RADIUS, 6),

            new Ball(new Vec2(1380, 460), PoolGame.BALL_RADIUS, 7),
            new Ball(new Vec2(1380, 500), PoolGame.BALL_RADIUS, 8),
            new Ball(new Vec2(1380, 540), PoolGame.BALL_RADIUS, 9),
            new Ball(new Vec2(1380, 580), PoolGame.BALL_RADIUS, 10),

            new Ball(new Vec2(1415, 440), PoolGame.BALL_RADIUS, 11),
            new Ball(new Vec2(1415, 480), PoolGame.BALL_RADIUS, 12),
            new Ball(new Vec2(1415, 520), PoolGame.BALL_RADIUS, 13),
            new Ball(new Vec2(1415, 560), PoolGame.BALL_RADIUS, 14),
            new Ball(new Vec2(1415, 600), PoolGame.BALL_RADIUS, 15),
        ];

        this.whiteBall.position = new Vec2(525, 520);
        this.cue.target = this.whiteBall;
    }

    private resetPlayerScore() {
        this.scoredBallsP1 = [];
        this.scoredBallsP2 = [];
    }

    /**
     * Signal player choice
     */
    public switchPlayer() {
        this.currentPlayer = (this.currentPlayer == 1) ? 2 : 1;
    }

    /**
     * Set announcement text and for how long it should be displayed
     * @param text announcement
     * @param howLong time in millis
     */
    public makeAnnouncement(text: string, howLong: number) {
        this.announcementText = text;
        setTimeout(() => {
            this.announcementText = "";
        }, howLong);
    }


   

    protected onUpdate(dt: number): void {
        this.state.onUpdate(dt);
    }




    private drawPlayerScoresPanel() {
        this.ctx.fillStyle = "black";
        this.ctx.font = '30px arial';
        this.ctx.textBaseline = 'bottom';

        this.ctx.textAlign = 'right';
        this.ctx.fillText("Player 1", 850, 50);

        this.ctx.textAlign = 'left';
        this.ctx.fillText("Player 2", 950, 50);


        this.ctx.beginPath();
        if(this.currentPlayer == 1) {
            this.ctx.arc(870, 35, 10, 0, Math.PI * 2, false);
        } else {
            this.ctx.arc(930, 35, 10, 0, Math.PI * 2, false);
        }
        this.ctx.fillStyle = "red";
        this.ctx.fill();


        for(let i = 0; i < 7; i++) {
            let ballPos: Vec2;

            const drawEmpty = () => {
                this.ctx.beginPath();
                this.ctx.arc(ballPos.x, ballPos.y, PoolGame.BALL_RADIUS, 0, Math.PI * 2, false);
                this.ctx.fillStyle = "black";
                this.ctx.fill();
            }


            ballPos = new Vec2(570 + i * (2 * PoolGame.BALL_RADIUS + 5), 80);

            if(i < this.scoredBallsP1.length) {
                this.scoredBallsP1[i].position = ballPos;
                this.scoredBallsP1[i].draw(this.ctx);
            } else {
                drawEmpty();
            }


            ballPos = new Vec2(960 + i * (2 * PoolGame.BALL_RADIUS + 5), 80);

            if(i < this.scoredBallsP2.length) {
                this.scoredBallsP2[i].position = ballPos;
                this.scoredBallsP2[i].draw(this.ctx);
            } else {
                drawEmpty();
            }
        }
    }

    private drawTable() {
        // brown outer border
        this.ctx.fillStyle = "brown";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 5;
        roundRect(this.ctx, 100, 120, 1600, 800, 50, true);


        // green padding
        this.ctx.fillStyle = "darkgreen";
        this.ctx.strokeStyle = "darkgreen";
        this.ctx.fillRect(150, 170, 1500, 700);


        // pockets
        for(let pocket of this.pockets) {
            pocket.draw(this.ctx);
        }


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

    private drawAnnouncementText() {
        const x = PoolGame.PLAYABLE_AREA[0] + PoolGame.PLAYABLE_AREA[2] / 2;
        const y = PoolGame.PLAYABLE_AREA[1] + PoolGame.PLAYABLE_AREA[3] * 0.1;

        this.ctx.fillStyle = "yellow";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.font = '70px arial';
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.announcementText, x, y);
        this.ctx.strokeText(this.announcementText, x, y);
    }

    /**
     * Draw the playing table, cue, balls and score on top
     */
    protected onDraw(): void {
        this.drawTable();
        
        for(const ball of this.ballsOnTable) {
            ball.draw(this.ctx);
        }
        
        if(this.cue.enabled) {
            this.cue.draw(this.ctx);
        }

        this.drawPlayerScoresPanel();

        if(this.announcementText.length > 0) {
            this.drawAnnouncementText();
        }
    }
}