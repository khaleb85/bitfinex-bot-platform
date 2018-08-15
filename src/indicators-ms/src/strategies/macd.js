class Macd {
    constructor() {
        this.indicatorId = 'macd';
        this.candles = [];
    }

    init() {
        console.log('---');
        console.log('init Macd');
        console.log('---');
    }

    update(candle) {
        console.log('---');
        console.log('update Macd');
        this.candles.push(candle);
        console.log(this.candles);
        console.log('---');
    }

    complete(candle) {
        console.log('---');
        console.log('complete Macd');
        console.log(candle);
        console.log('---');
    }
}

export default Macd;
