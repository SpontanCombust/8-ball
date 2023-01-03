/**
 * Draws a rounded rectangle
 * 
 * @param ctx rendering context
 * @param x x position
 * @param y y position
 * @param width width of the rectangle
 * @param height height of the rectangle
 * @param radius corner rounding radious
 * @param fill if rectangle should be filled with color
 * @param stroke if edges of the rectangle should be emphasized
 */
export function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 5,
    fill = false,
    stroke = true
) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
 
/**
 * @param x input value
 * @param min minimal possible value
 * @param max maximal possible value
 * @returns Value x clamped between min and max values 
 */
export function clamp(x: number, min: number, max: number) {
    return Math.min(Math.max(x, min), max);
}