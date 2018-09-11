import AdviceRepository from '../repositories/advice.repository';
import IndicatorsRepository from '../repositories/indicator.repository';
import Repository from '../repositories/repository';
import IndicatorService from './indicators.service';
import ComunicationService from '../services/service-comunication.service';
import SignalService from './signal.service';
import Debug from '../tools/debug';

class AdviceService {
    static storeAdvice(advice) {
        return new Promise(resolve => {
            AdviceRepository.getAdvicesByTimeFrame(advice.timeframe)
                .then(adv => {
                    if (adv.length !== 0) {
                        return resolve(false);
                    } // Ignore advice if it already exists

                    IndicatorsRepository.getIndicator(advice.indicatorId).then(indicator => {
                        if (indicator.length === 0) {
                            IndicatorsRepository.insertIndicator(advice.indicatorId);
                        }

                        if (indicator[0]) {
                            const temp = advice;
                            temp.indicatorId = indicator[0].id;

                            Repository.insert(AdviceRepository.advTable, temp).then(() => {
                                return resolve(true);
                            });
                        }
                    });
                });
        });
    }

    static verifyWeight(timeframe) {
        return new Promise(resolve => {
            this.getTotalWeight().then(totalWeight => {
                AdviceRepository.getAdvicesByTimeFrame(timeframe).then(advices => {
                    // if buy or sell is bigger then half od the totalweight then send signal
                    const buyWeight = this.getAdvicesWeightByType(advices, 'buy');
                    const sellWeight = this.getAdvicesWeightByType(advices, 'sell');

                    if (sellWeight >= (totalWeight / 2)) {
                        SignalService.sendSellSignal(timeframe);
                    } else
                    if (buyWeight >= (totalWeight / 2)) {
                        SignalService.sendBuySignal(timeframe);
                    }

                    this._ajustWeight(timeframe).then(() => {
                        return resolve();
                    });
                });
            });
        });
    }

    static _ajustWeight(currentTimeframe) {
        return new Promise(resolve => {
            AdviceRepository.getPreviousAdvice(currentTimeframe).then(adv => {
                this.getCandle(currentTimeframe).then(currentCandleStr => {
                    this.getCandle(adv.timeframe).then(previousCandleStr => {
                        const currentCandle = JSON.parse(currentCandleStr);
                        const previousCandle = JSON.parse(previousCandleStr);

                        const currentClose = parseFloat(currentCandle.close);
                        const previousClose = parseFloat(previousCandle.close);
                        const trashHolder = parseFloat(process.env.TRASHHOLDER);
                        let isToAdd = false;

                        Debug.log(`Previous close: ${previousClose} / Current close: ${currentClose}`);
                        if (adv.type === 'buy') {
                            isToAdd = currentClose >= (previousClose + trashHolder);
                        } else {
                            isToAdd = currentClose <= (previousClose - trashHolder);
                        }

                        this._changeIndicatorWeight(isToAdd, adv.indicatorId);
                        return resolve();
                    });
                });
            });
        });
    }

    static _changeIndicatorWeight(isToAdd, indicatorId) {
        if (isToAdd) {
            IndicatorService.addWeight(indicatorId);
        } else {
            IndicatorService.removeWeight(indicatorId);
        }
    }

    static getCandle(timeframe) {
        return new Promise(resolve => {
            ComunicationService.makeGetRequest('listener', `/candles?timeframe=${timeframe}`)
                .then(candle => {
                    return resolve(candle);
                });
        });
    }

    static getAdvicesWeightByType(advices, type) {
        return advices
            .filter(x => x.type === type)
            .map(x => x.weight)
            .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }

    static getTotalWeight() {
        return new Promise(resolve => {
            ComunicationService.makeGetRequest('indicators', '/indicators/all')
                .then(response => {
                    let json = null;
                    if (typeof response === 'string') {
                        json = JSON.parse(response);
                    }

                    if (json.strategiesIds.length === 0) {
                        return;
                    }

                    const advPromises = [];
                    json.strategiesIds.forEach(x => {
                        advPromises.push(IndicatorsRepository.getIndicator(x));
                    });

                    let weightSum = 0;
                    Promise.all(advPromises)
                        .then(values => {
                            values.forEach(y => {
                                if (Array.isArray(y)) {
                                    y.forEach(x => {
                                        if (x.weight) {
                                            weightSum += parseInt(x.weight);
                                        }
                                    });
                                }
                            });

                            return resolve(weightSum);
                        });
                });
        });
    }
}

export default AdviceService;
