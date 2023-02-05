import * as Main from "./main.js";
import {Random} from "./random.js";

export class Board {
    #board;
    
    constructor(width, height, mines) {
        this.#board = [];

        this.main = Main.instance;
        this.width = width;
        this.height = height;
        this.renderer = this.main.renderer;
        this.canvas = this.renderer.canvas;
        this.context = this.renderer.context;
        this.ws = this.canvas.width / this.width;
        this.hs = this.canvas.height / this.height;
        this.mines = mines;
        this.flags = [];

        this.renderer.context.font = `${(this.ws + this.hs) / 2}px arial`;

        for(let i = 0; i < this.width; i++) {
            let yb = [];

            for(let j = 0; j < this.height; j++) {
                yb.push(null);
            }

            this.#board.push(yb);
        }
    }

    init() {
        for(let i = 0; i < this.mines; i++) {
            let x = 0;
            let y = -1;

            let space = this.get(x, y);

            while(space === undefined || space !== null) {
                x = new Random().nextInt(this.width);
                y = new Random().nextInt(this.height);

                space = this.get(x, y);
            }

            this.set(x, y, "*");
        }
    }

    get(x, y) {
        if(x < 0 || x >= this.width) {
            return undefined;
        }

        if(y < 0 || y >= this.height) {
            return undefined;
        }

        return this.#board[x][y];
    }
    
    set(x, y, v) {
        this.#board[x][y] = v;

        if(this.#getConnectedMines(x, y) > 0) {
            return;
        }

        if(this.main.started && v == " ") {
            let neighbours = this.#getNeighbours(x, y);

            for(let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];
                let space = this.get(neighbour.x, neighbour.y);

                if(space != null) {
                    continue;
                }

                let xdist = Math.abs(x - neighbour.x);
                let ydist = Math.abs(y - neighbour.y);

                if(xdist + ydist == 1) {
                    this.set(neighbour.x, neighbour.y, " ");
                }
            }
        }
    }

    flag(x, y) {
        let space = this.get(x, y);

        if(space != " ") {
            if(this.isFlagged(x, y)) {
                this.unflag(x, y);
            } else {
                if(this.flags.length == this.mines) {
                    return;
                }

                this.flags.push([x, y]);
            }
        }

        let remaining = (this.mines - this.flags.length);
        document.getElementById("text").innerText = "Flags Remaining: " + remaining;
    }

    unflag(x, y) {
        for(let i = 0; i < this.flags.length; i++) {
            let flag = this.flags[i];

            if(flag[0] == x && flag[1] == y) {
                this.flags.splice(i, 1);
                break;
            }
        }
    }

    isFlagged(x, y) {
        for(let i = 0; i < this.flags.length; i++) {
            let flag = this.flags[i];

            if(flag[0] == x && flag[1] == y) {
                return true;
            }
        }

        return false;
    }

    contains(v) {
        for(let i = 0 ; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                let space = this.get(i, j);

                if(space == v) {
                    return true;
                }
            }
        }

        return false;
    }

    #getNeighbours(x, y) {
        let res = [];
        let neighbours = [];

        res.push({"x": x - 1, "y": y - 1});
        res.push({"x": x, "y": y - 1});
        res.push({"x": x + 1, "y": y - 1});

        res.push({"x": x - 1, "y": y});
        res.push({"x": x + 1, "y": y});

        res.push({"x": x - 1, "y": y + 1});
        res.push({"x": x, "y": y + 1});
        res.push({"x": x + 1, "y": y + 1});

        //filter out of bounds
        for(let i = 0; i < res.length; i++) {
            let e = res[i];

            if(this.get(e.x, e.y) === undefined) {
                continue;
            }

            neighbours.push(e);
        }

        return neighbours;
    }

    #getConnectedMines(x, y) {
        let neighbours = this.#getNeighbours(x, y);
        let count = 0;

        for(let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];

            let space = this.get(neighbour.x, neighbour.y);

            if(space == "*") {
                count++;
            }
        }

        return count;
    }

    render() {
        this.renderer.clear();

        this.#renderSquares();

        this.context.beginPath();
        this.context.strokeStyle = "black";

        for(let i = 0; i < this.width; i++) {
            let x = (i * this.ws);

            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
        }

        for(let i = 0; i < this.height; i++) {
            let y = (i * this.hs);

            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
        }

        this.context.stroke();
    }

    #renderSquares() {
        for(let i = 0 ; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                let space = this.#board[i][j];
                let colour = "gray";
                let image = null;

                if(this.isFlagged(i, j)) {
                    image = this.main.flagImage;
                } else {
                    if(space == "*") {
                        if(this.main.over) {
                            image = this.main.bombImage;
                        }
                    } else if(space == " ") {
                        colour = "white";
                    }
                }
                
                this.renderer.fill(i * this.ws, j * this.hs, this.ws, this.hs, colour);

                if(image) {
                    this.context.beginPath();
                    this.context.drawImage(image, i * this.ws, j * this.hs, this.ws, this.hs);
                    this.context.stroke();
                    console.log("rendered image");
                }

                if(colour == "white") {
                    let mines = this.#getConnectedMines(i, j);

                    if(mines > 0) {
                        this.context.beginPath();
                        this.context.fillStyle = "black";
                        this.context.fillText(mines.toString(), (i * this.ws) + (this.ws * 0.2), (j * this.hs) + (this.hs * 0.8));
                        this.context.stroke();
                    }
                }
            }
        }
    }
}