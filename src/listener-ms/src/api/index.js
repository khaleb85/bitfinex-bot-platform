import hydra from 'hydra-express';
import cluster from 'cluster';
import BodyParser from 'body-parser';
import packageJson from '../../package.json';
import Debug from '../tools/debug';
import Controllers from './controllers';

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
        const controllers = new Controllers();
        hydra.init(config, packageJson.version, controllers.start, this.registerMiddlewareCallback)
            .then((serviceinfo) => {
                Debug.success(`${serviceinfo.serviceName} service is living on ${serviceinfo.serviceIP}:${serviceinfo.servicePort} with worker id: ${cluster.worker.id}`);
            });
    }

    /**
     * Register all middlewares
     *
     * @memberof Api
     * @since 1.0.0
     */
    registerMiddlewareCallback() {
        const app = hydra.getExpressApp();

        app.use(BodyParser.json());
    }
}

export default Api;
