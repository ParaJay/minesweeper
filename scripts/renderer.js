import * as Main from "./main.js";

export class Renderer {
    constructor(canvas) {
        this.main = Main.instance;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }

    render() {
        this.main.board.render();
    }

    clear() {
        this.fill(0, 0, this.canvas.width, this.canvas.height, "white");
    }

    fill(x, y, w, h, c) {       
        this.context.beginPath();
        let oc = this.context.fillStyle;
        this.context.fillStyle = c;
        this.context.fillRect(x, y, w, h);
        this.context.stroke();
        this.context.fillStyle = oc;
    }
}