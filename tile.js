export class Tile {
  constructor(width, height, color,x,y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
  }

drawTile() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d");
  ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  // console.log("drawtile");
  }
}
