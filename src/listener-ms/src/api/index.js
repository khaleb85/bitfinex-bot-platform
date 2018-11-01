import hydraExpress from 'hydra-express';
import express from 'express';
import cluster from 'cluster';
import BodyParser from 'body-parser';
import packageJson from '../../package.json';
import Debug from '../tools/debug';
import CandlesController from './controllers/candles.controller';

/**
 * Class that represents the whole application API setup
 *
 * @class Api
 * @since 1.0.0
 */
class Api {
    /**
     * Start the express server with all middlewares.
     *
     * @memberof Api
     * @param {object} config
     * @since 1.0.0
     */
    start(config) {
        const mockIps = process.env.MOCK_IP;
        if (mockIps) {
            const app = express();

            app.use(BodyParser.json());
            app.use('/candles', CandlesController);

            app.listen(3010, () => Debug.success('We are living on port 3010'));
        } else {
            hydraExpress.init(config, packageJson.version, this.registerRoutesCallback, this.registerMiddlewareCallback)
                .then((serviceinfo) => {
                    Debug.success(`${serviceinfo.serviceName} service is living on ${serviceinfo.serviceIP}:${serviceinfo.servicePort} with worker id: ${cluster.worker.id}`);
                });
        }
    }

    /**
     * Register all controllers in the Express app
     *
     * @memberof Controllers
     * @since 1.0.0
     */
    registerRoutesCallback() {
        hydraExpress.registerRoutes({
            '/candles': CandlesController,
        });
    }

    /**
     * Register all middlewares
     *
     * @memberof Api
     * @since 1.0.0
     */
    registerMiddlewareCallback() {
        const app = hydraExpress.getExpressApp();

        app.use(BodyParser.json());
    }
}

export default Api;
