import macd from 'macd';
import Debug from '../tools/debug';

class Macd {
    constructor(Opt) {
        this.indicatorId = 'macd';
        this.candles = [];
        this.opt = new Opt(this.indicatorId);

        this.threshold = 4;
    }

    init() {
        Debug.highlight('Init MACD');
        this.opt.data.getHistoricalCandles().then(hist => {
            this.candles = hist;
        });
    }

    update(candle) {
        Debug.log('Update MACD');
        const result = macd(this.candles.map(x => x.close), 26, 12, 9);

        if (!result.histogram) { return; }

        const lastThree = result.histogram.slice(Math.max(result.histogram.length - 3, 1));

        if (lastThree[0] > this.threshold && lastThree[1] > lastThree[0] && lastThree[2] > lastThree[1]) {
            this.opt.advices.buyAdvice(candle.msTimeStamp);
        }

        if (lastThree[0] < this.threshold - (2 * this.threshold) && lastThree[1] < lastThree[0] && lastThree[2] < lastThree[1]) {
            this.opt.advices.sellAdvice(candle.msTimeStamp);
        }
    }

    complete(candle) {
        Debug.success('Complete MACD');
        this.addOrUpdateCandle(candle);
    }

    addOrUpdateCandle(candle) {
        const index = this.candles.findIndex(x => x.msTimeStamp === candle.msTimeStamp);

        if (index === -1) {
            this.candles.push(candle);
        } else {
            this.candles[index] = candle;
        }
    }
}

export default Macd;
