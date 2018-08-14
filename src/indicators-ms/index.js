import dotenv from 'dotenv';
import hydraConfig from './hydra.json';
import StrategyLoaderService from './src/services/strategy-loader.service';

dotenv.config();

hydraConfig.hydra.redis.host = process.env.HYDRA_REDIS_HOST;
hydraConfig.hydra.redis.port = process.env.HYDRA_REDIS_PORT;
hydraConfig.hydra.redis.password = process.env.HYDRA_REDIS_PASS;


    const a = new StrategyLoaderService();
    a.runStrategiesMethod('init');
