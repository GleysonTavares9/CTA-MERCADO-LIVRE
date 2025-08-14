// Canvas roundRect polyfill for older browsers
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, width: number, height: number, radius: number): void;
  }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    radius: number
  ) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
}

export {};