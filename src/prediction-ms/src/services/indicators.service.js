import ServiceComunication from './service-comunication.service';

class IndicatorService {
    sendUpdate(candle) {
        return ServiceComunication.makePostRequest('indicators', '/updates/change', candle);
    }

    sendComplete(candle) {
        return ServiceComunication.makePostRequest('indicators', '/updates/complete', candle);
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
