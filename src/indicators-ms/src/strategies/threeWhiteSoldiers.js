import Debug from '../tools/debug';

class ThreeWhiteSoldiers {
    constructor(Opt) {
        this.indicatorId = 'threeWhiteSoldiers';
        this.candles = [];
        this.opt = new Opt(this.indicatorId);
    }

    init() {
        Debug.highlight('Init TWS');
        this.opt.data.getHistoricalCandles().then(hist => {
            this.candles = hist;
        });
    }

    update(candle) {
        Debug.highlight('Update TWS');
        this.addOrUpdateCandle(candle);

        const lastThree = this.candles.slice(this.candles.length - 3);

        const firstdaysOpen   = lastThree.open[0];
        const firstdaysClose  = lastThree.close[0];
        const firstdaysHigh   = lastThree.high[0];

        const seconddaysOpen  = lastThree.open[1];
        const seconddaysClose = lastThree.close[1];
        const seconddaysHigh  = lastThree.high[1];

        const thirddaysOpen   = lastThree.open[2];
        const thirddaysClose  = lastThree.close[2];
        const thirddaysHigh   = lastThree.high[2];

        const isUpTrend = seconddaysHigh > firstdaysHigh &&
                            thirddaysHigh > seconddaysHigh;

        const isAllBullish = firstdaysOpen < firstdaysClose &&
                            seconddaysOpen < seconddaysClose &&
                            thirddaysOpen < thirddaysClose;
        const doesOpenWithinPreviousBody = firstdaysClose > seconddaysOpen &&
                                        seconddaysOpen <  firstdaysHigh &&
                                        seconddaysHigh > thirddaysOpen  &&
                                        thirddaysOpen < seconddaysClose;

        if (isUpTrend && isAllBullish && doesOpenWithinPreviousBody) {
            this.opt.advices.buyAdvice(candle.msTimeStamp);
        }
    }

    complete(candle) {
        Debug.success('Complete TWS');
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

export default ThreeWhiteSoldiers;
