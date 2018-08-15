import dotenv from 'dotenv';
import hydraConfig from './hydra.json';
import StrategyLoaderService from './src/services/strategy-loader.service';

dotenv.config();

hydraConfig.hydra.redis.host = process.env.HYDRA_REDIS_HOST;
hydraConfig.hydra.redis.port = process.env.HYDRA_REDIS_PORT;
hydraConfig.hydra.redis.password = process.env.HYDRA_REDIS_PASS;


    const a = new StrategyLoaderService();
    a.init().then(() => {



        a.runStrategiesMethod('update', {a: 12}).then(x => {

            a.runStrategiesMethod('update', {a: 14});
            a.runStrategiesMethod('update', {a: 15});
            a.runStrategiesMethod('update', {a: 16});
        });
    });
