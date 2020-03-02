export default class gametime {
    constructor (timestamp, elapsed, totalElapsed) {
        this.timestamp = timestamp || Date.now();
        this.elapsed = elapsed || 0;
        this.totalElapsed = totalElapsed || 0;
    }
};