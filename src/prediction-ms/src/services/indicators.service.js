import ServiceComunication from './service-comunication.service';

class IndicatorService {
    sendUpdate(candle) {
        ServiceComunication.makePostRequest('indicators', '/updates/change', candle)
            .then(x => console.log(x));
    }

    sendComplete(candle) {
        ServiceComunication.makePostRequest('indicators', '/updates/complete', candle)
            .then(x => console.log(x));
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
