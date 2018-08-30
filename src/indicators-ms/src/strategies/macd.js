class Macd {
    constructor(Opt) {
        this.indicatorId = 'macd';
        this.candles = [];
        this.opt = new Opt(this.indicatorId);
    }

    init() {
        console.log('---');
        console.log('init Macd');
        console.log('---');
    }

    update(candle) {
        console.log('---');
        console.log(candle);
        console.log('update Macd');
        this.candles.push(candle);
        this.opt.buyAdvice(1534798800000);
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
