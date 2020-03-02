export default class gametime {
    constructor (timestamp, elapsed) {
        this.timestamp = timestamp || Date.now();
        this.elapsed = elapsed || 0;
    }
};