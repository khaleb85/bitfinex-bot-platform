import AdviceRepository from '../repositories/advice.repository';
import IndicatorsRepository from '../repositories/indicator.repository';
import Repository from '../repositories/repository';
import ComunicationService from '../services/service-comunication.service';

class AdviceService {
    static storeAdvice(advice) {
        return new Promise(resolve => {
            AdviceRepository.getAdvicesByTimeFrame(advice.timeframe)
                .then(adv => {
                    if (adv.length > 0) {
                        return resolve();
                    } // Ignore advice if it already exists

                    IndicatorsRepository.getIndicator(advice.indicatorId).then(x => {
                        if (x.length === 0) {
                            IndicatorsRepository.insertIndicator(advice.indicatorId);
                        }

                        advice.indicatorId = x[0].id;

                        Repository.insert(AdviceRepository.advTable, advice).then(() => {
                            return resolve();
                        });
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
                        console.log('sell signal');
                    } else
                    if (buyWeight >= (totalWeight / 2)) {
                        console.log('buy signal');
                    }
       
                    console.log(advices);
                    console.log(totalWeight);
                    return resolve();
                });
            });
        });
    }

    static getAdvicesWeightByType(advices, type) {
        return advices
            .filter(x => x.type === type)
            .map(x => x.weight)
            .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }

    static getAllTimeframeAdvices(timeframe) {

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
