import dotenv from 'dotenv';
import hydraConfig from './hydra.json';
import MultiProcess from './src/tools/multi-process';
import Api from './src/api';
import BitfinexWsService from './src/services/bitfinex-ws.service';
import Debug from './src/tools/debug';

dotenv.config();
const mProcess = new MultiProcess();

mProcess.start(() => {
    hydraConfig.hydra.redis.host = process.env.HYDRA_REDIS_HOST;
    hydraConfig.hydra.redis.port = process.env.HYDRA_REDIS_PORT;
    hydraConfig.hydra.redis.password = process.env.HYDRA_REDIS_PASS;

    const api = new Api();
    api.start(hydraConfig);
}, () => {
    new BitfinexWsService().start()
        .on('change', candle => Debug.log(`change: ${JSON.stringify(candle)}`))
        .on('complete', x => Debug.highlight(`complete: ${JSON.stringify(x)}`));
});
