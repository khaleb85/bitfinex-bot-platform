import dotenv from 'dotenv';
import hydra from 'hydra';
import hydraConfig from './hydra.json';
import MultiProcess from './src/tools/multi-process';
import Api from './src/api';

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
});

