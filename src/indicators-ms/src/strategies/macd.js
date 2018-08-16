class Macd {
    constructor(opt) {
        this.indicatorId = 'macd';
        this.candles = [];
        this.opt = opt;
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
        this.opt.advice('ADVICE');
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
