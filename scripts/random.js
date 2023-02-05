export class Random {
    constructor() {

    }

    nextInt(int) {
        return this.randint(0, int);
    }

    randint(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
    
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}