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

        const firstdaysOpen   = lastThree[0].open;
        const firstdaysClose  = lastThree[0].close;
        const firstdaysHigh   = lastThree[0].high;

        const seconddaysOpen  = lastThree[1].open;
        const seconddaysClose = lastThree[1].close;
        const seconddaysHigh  = lastThree[1].high;

        const thirddaysOpen   = lastThree[2].open;
        const thirddaysClose  = lastThree[2].close;
        const thirddaysHigh   = lastThree[2].high;

        const isUpTrend = seconddaysHigh > firstdaysHigh &&
                            thirddaysHigh > seconddaysHigh;

        const isAllBullish = firstdaysOpen < firstdaysClose &&
                            seconddaysOpen < seconddaysClose &&
                            thirddaysOpen < thirddaysClose;
        const doesOpenWithinPreviousBody = firstdaysClose > seconddaysOpen &&
                                        seconddaysOpen <  firstdaysHigh &&
                                        seconddaysHigh > thirddaysOpen  &&
                                        thirddaysOpen < seconddaysClose;
        console.log(`isUpTrend:${isUpTrend} isAllBullish:${isAllBullish} doesOpenWithinPreviousBody:${doesOpenWithinPreviousBody}`);
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
