import ServiceComunication from '../services/service-comunication.service';

class DataService {
    getHistoricalCandles() {
        return new Promise(resolve => {
            ServiceComunication.makeGetRequest('listener', '/candles/hist').then(data => {
                return resolve(JSON.parse(data));
            });
        });
    }
}

export default DataService;
