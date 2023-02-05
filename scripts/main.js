import {Renderer} from "./renderer.js";
import {Board} from "./board.js";
import {Listeners} from "./listeners.js";

export var instance;

window.onload = () => {
    init();
}

function init() {
    new Main();
}

export class Main {
    constructor() {
        instance = this;

        let canvas = document.getElementById("canvas");

        this.renderer = new Renderer(canvas);

        let boards = {
            "Easy": new Board(9, 9, 5),
            "Medium": new Board(15, 15, 15),
            "Hard": new Board(18, 18, 40),
            "Extreme": new Board(24, 24, 99)
        }

        let input = "";

        while(!(input in boards)) {
            input = window.prompt("Enter difficulty (Easy, Medium, Hard, Extreme)");
        }

        this.board = boards[input];

        document.getElementById("text").innerText = "Flags Remaining: " + this.board.mines;

        new Listeners();

        this.renderer.render();
    }

    start(x, y) {
        this.board.set(x, y, " ");
        this.board.init();
        this.started = true;
        this.board.set(x, y, " ");
    }

    die() {
        this.#end("rip :(", "red");
    }

    winCheck() {
        if(!this.board.contains(null)) {
            this.#end("conglaturations", "lime");
        }
    }

    #end(text, colour) {
        let elem = document.getElementById("text");

        elem.innerText = text;
        elem.style = `color:${colour};`;

        this.over = true;
    }
}