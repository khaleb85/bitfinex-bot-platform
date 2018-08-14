class Ecm {
    constructor() {
        this.indicatorId = 'ecm';
    }

    init() {
        console.log('---');
        console.log('init ECM');
        console.log('---');
    }

    update(candle) {
        console.log('---');
        console.log('update ECM');
        console.log(candle);
        console.log('---');
    }

    complete(candle) {
        console.log('---');
        console.log('complete ECM');
        console.log(candle);
        console.log('---');
    }
}

export default Ecm;
