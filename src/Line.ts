import Vec2 from "./Vec2";

/**
 * Class representing an edge between two points
 * @class Line
 */
export default class Line {
    /**
     * First line point
     */
    public p1: Vec2;
    /**
     * Second line point
     */
    public p2: Vec2;


    // calculated coefficients
    private a: number;
    private b: number;

    constructor(p1: Vec2, p2: Vec2) {
        this.p1 = p1;
        this.p2 = p2;

        // if both x'es are the same, a will be Infinite
        this.a = (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x);
        this.b = this.p1.y - this.a * this.p1.x;
    }

    
    /**
     * Says whether this line is aligned to the x axis 
     * @returns true if horizontal
     */
    private isPerfectlyHorizontal(): boolean {
        return Math.abs(this.p1.y - this.p2.y) < 0.00001;
    }
    /**
     * Says whether this line is aligned to the y axis 
     * @returns true if vertical
     */
    private isPerfectlyVertical(): boolean {
        return Math.abs(this.p1.x - this.p2.x) < 0.00001;
    }

    /**
     * Tests whether point p can be placed on this line
     * @param p point
     * @returns true if this line contains the point
     */
    public contains(p: Vec2): boolean {
        function numberInRange(x: number, n1: number, n2: number) {
            if(n1 < n2) {
                return n1 <= x && x <= n2; 
            } else {
                return n2 <= x && x <= n1;
            }
        }

        if(numberInRange(p.x, this.p1.x, this.p2.x) && numberInRange(p.y, this.p1.y, this.p2.y)) {
            // if it's perfectly pararrel to one of the axis there is no need to check ranges further
            // we also prevent doing calculations with Infinite value, which would be the case
            // with perfectly vertical line ('a' coefficient is Infinite) 
            if(this.isPerfectlyVertical() || this.isPerfectlyHorizontal()) {
                return true;
            }

            const y = this.a * p.x + this.b;
    
            return Math.abs(y - p.y) < 0.00001;
        }

        return false;
    }

    /**
     * Returns a non-unit normal vector of this (unbound) line, going through p0
     * @param p0 intersection point
     * @returns vector perpendicular to this line
     */
    public normalTo(p0: Vec2): Vec2 {
        if(this.isPerfectlyVertical()) {
            return new Vec2(p0.x - this.p1.x, 0);
        }
        else if(this.isPerfectlyHorizontal()) {
            return new Vec2(0, p0.y - this.p1.y);
        }
        
        // get the coefficients of the perpendicular line going through p0
        const a0 = -1 / this.a;
        const b0 = p0.y + p0.x / this.a;

        // get the coords of the point where this (unconstrained) line and perpendicular to it cross
        const x = (b0 - this.b) / (this.a - a0);
        const y = a0 * x + b0;

        return Vec2.diff(p0, new Vec2(x, y));
    }





    /**
     * Draws the line; used for debugging purposes
     * @param ctx rendering context
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}