var main;

import * as Main from "./main.js";

export class Listeners {
    constructor() {
        main = Main.instance;
        main.renderer.canvas.onmouseup = onClick;
    }
}

function onClick(e) {
    if(main.over) {
        return;
    }
    
    let canvas = main.renderer.canvas;
    let board = main.board;

    let x = Math.floor((e.pageX - canvas.offsetLeft) / board.ws);
    let y = Math.floor((e.pageY - canvas.offsetTop) / board.hs);

    let flagKey = e.shiftKey || e.ctrlKey || e.altKey || e.button == 1;

    if(!main.started) {
        main.start(x, y);
    } else {
        let space = board.get(x, y);

        if(space === null || flagKey) {
            if(flagKey) {
                board.flag(x, y);
            } else {
                board.set(x, y, " ");
            }
            
        } else if(space == "*" && !flagKey) {
            main.die();
        }
        //TODO
    }

    main.winCheck();
    board.render();
}