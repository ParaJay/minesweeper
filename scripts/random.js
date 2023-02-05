export class Random {
    constructor() {

    }

    nextInt(int) {
        return Math.floor(Math.random() * (int - 1)) + 1;
    }
}