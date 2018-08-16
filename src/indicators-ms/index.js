import dotenv from 'dotenv';
import hydraConfig from './hydra.json';
import Api from './src/api';
import MultiProcess from './src/tools/multi-process';

dotenv.config();

hydraConfig.hydra.redis.host = process.env.HYDRA_REDIS_HOST;
hydraConfig.hydra.redis.port = process.env.HYDRA_REDIS_PORT;
hydraConfig.hydra.redis.password = process.env.HYDRA_REDIS_PASS;


hydraConfig.hydra.redis.host = process.env.HYDRA_REDIS_HOST;
hydraConfig.hydra.redis.port = process.env.HYDRA_REDIS_PORT;
hydraConfig.hydra.redis.password = process.env.HYDRA_REDIS_PASS;

const mProcess = new MultiProcess();
mProcess.start(() => {
    const api = new Api();
    api.start(hydraConfig);
}, () => {
});
