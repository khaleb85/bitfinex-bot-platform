import IndicatorRepository from '../repositories/indicator.repository';
import ServiceComunication from './service-comunication.service';

class IndicatorService {
    static get weightBias() { return parseFloat(process.env.WEIGHT_BIAS); }

    sendUpdate(candle) {
        return ServiceComunication.makePostRequest('indicators', '/updates/change', candle);
    }

    sendComplete(candle) {
        return ServiceComunication.makePostRequest('indicators', '/updates/complete', candle);
    }

    static addWeight(indicatorId) {
        IndicatorRepository.getIndicatorByTableId(indicatorId).then(indicator => {
            const weight = parseFloat(indicator.weight) + this.weightBias;
            IndicatorRepository.updateWeight(indicator.id, weight).then(data => {
                console.log(data);
            });
        });
        console.log('add weight!');
    }

    static removeWeight(indicatorId) {
        IndicatorRepository.getIndicatorByTableId(indicatorId).then(indicator => {
            const weight = parseFloat(indicator.weight) + this.weightBias;
            IndicatorRepository.updateWeight(indicator.id, weight).then(data => {
                console.log(data);
            });
        });
        console.log('remove Weight!');
    }

    getAllIndicators() {
        return new Promise(resolve => {
            ServiceComunication.makeGetRequest('indicators', '/indicators/all').then(response => {
                let json = null;
                if (typeof response === 'string') { json = JSON.parse(response); }

                if (json.strategiesIds.length === 0) { return; }

                return resolve(json);
            });
        });
    }
}

export default IndicatorService;
