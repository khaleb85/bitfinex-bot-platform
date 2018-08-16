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
}

export default IndicatorService;
