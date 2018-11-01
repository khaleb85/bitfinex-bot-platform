import hydraExpress from 'hydra-express';
import express from 'express';
import cluster from 'cluster';
import BodyParser from 'body-parser';
import packageJson from '../../package.json';
import Debug from '../tools/debug';
import UpdatesController from './controllers/updates.controller';
import AdvicesController from './controllers/advices.controller';
import SignalController from './controllers/signals.controller';

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
            app.use('/updates', UpdatesController);
            app.use('/advice', AdvicesController);
            app.use('/signal', SignalController);

            app.listen(3020, () => Debug.success('We are living on port 3020'));
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
            '/updates': UpdatesController,
            '/advice': AdvicesController,
            '/signal': SignalController,
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
