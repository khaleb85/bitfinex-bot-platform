import AdviceRepository from '../repositories/advice.repository';
import Repository from '../repositories/repository';
import ComunicationService from '../services/service-comunication.service';

class AdviceService {
    static storeAdvice(advice) {
        return new Promise(resolve => {
            AdviceRepository.getAdvicesByTimeFrame(advice.timeframe)
                .then(adv => {
                    if (adv) { return resolve(); } // Ignore advice if it already exists

                    Repository.insert(AdviceRepository.advTable, advice).then(() => {
                        return resolve();
                    });
                });
        });
    }

    static verifyWeight(timeframe) {
        ComunicationService.makeGetRequest('indicators', '/indicators/all')
            .then(response => {
                let json = null;
                if (typeof response === 'string') { json = JSON.parse(response); }

                if (json.strategiesIds.length === 0) { return; }

                const advPromises = [];
                json.strategiesIds.forEach(x => {
                    advPromises.push(AdviceRepository.getAdvicesByTimeFrameAndId(timeframe, x));
                });

                Promise.all(advPromises)
                    .then(values => {

                        if (Array.isArray(values)) {
                            let weightSum = 0;
                            values.forEach(x => {
                                weightSum += x.weight;
                            });
                        }
                        console.log(values);
                    });
            });
    }
}

export default AdviceService;