class Ecm {
    constructor() {
        this.indicatorId = 'ecm';
    }

    init() {
        console.log('---');
        console.log('init ECM');
    }

    update(candle) {
        console.log('---');
        console.log('update ECM');
    }

    complete(candle) {
        console.log('---');
        console.log('complete ECM');
    }
}

export default Ecm;
