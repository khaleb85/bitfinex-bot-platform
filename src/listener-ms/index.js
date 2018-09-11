import dotenv from 'dotenv';
import hydra from 'hydra';
import hydraConfig from './hydra.json';
import MultiProcess from './src/tools/multi-process';
import Api from './src/api';
import BitfinexWsService from './src/services/bitfinex-ws.service';
import Debug from './src/tools/debug';
import ServiceComunicationService from './src/services/service-comunication.service';

dotenv.config();

hydraConfig.hydra.redis.host = process.env.HYDRA_REDIS_HOST;
hydraConfig.hydra.redis.port = process.env.HYDRA_REDIS_PORT;
hydraConfig.hydra.redis.password = process.env.HYDRA_REDIS_PASS;

const mProcess = new MultiProcess();
mProcess.start(() => {
    const api = new Api();
    api.start(hydraConfig);
}, () => {
    hydra.init(hydraConfig);
    new BitfinexWsService().start()
        .on('change', candle => {
            Debug.log(`change: ${JSON.stringify(candle)}`);
            // ServiceComunicationService.makePostRequest('prediction', '/updates/change', candle);
        })
        .on('complete', candle => {
            Debug.highlight(`complete: ${JSON.stringify(candle)}`);
            // ServiceComunicationService.makePostRequest('prediction', '/updates/complete', candle);
        });
});
