import ServiceComunication from './service-comunication.service';

class IndicatorService {
    sendUpdate(candle) {
        const con = new ServiceComunication();
        con.makePostRequest('indicators', '/update/change', candle)
            .then(x => console.log(x));
    }

    sendComplete(candle) {
        const con = new ServiceComunication();
        con.makePostRequest('indicators', '/update/complete', candle)
            .then(x => console.log(x));
    }
}

export default IndicatorService;
