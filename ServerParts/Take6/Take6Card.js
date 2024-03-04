class Take6Card {
    constructor(value) {
        this.value = value;
        this.pointAmount = this.analysePointAmount(value);
    }

    analysePointAmount(value) {
        if (value == 55) {
            return 7;
        } else if (value % 10 == 5) {
            return 2;
        } else if (value % 10 == 0) {
            return 3;
        } else if (value % 11 == 0) {
            return 5;
        } else {
            return 1;
        }
    }
}

module.exports = Take6Card;