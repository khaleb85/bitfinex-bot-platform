class Macd {
    constructor(Opt) {
        this.indicatorId = 'macd';
        this.candles = [];
        this.opt = new Opt(this.indicatorId);
    }

    init() {
        console.log('---');
        console.log('init Macd');
    }

    update(candle) {
        console.log('---');
        console.log('update Macd');
        this.candles.push(candle);
        this.opt.buyAdvice(1536609600000);
    }

    complete(candle) {
        console.log('---');
        console.log('complete Macd');
    }
}

export default Macd;
