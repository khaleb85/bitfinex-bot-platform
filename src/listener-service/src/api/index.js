import express from 'express';
import cluster from 'cluster';
import BodyParser from 'body-parser';
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
   * @constructor
   */
    constructor() {
        this.port = process.env.port || 3000;
    }

    /**
   * Start the express server with all middlewares.
   *
   * @since 1.0.0
   */
    start() {
        const app = express();

        app.use(BodyParser.json());

        const controllers = new Controllers(app);
        controllers.start();

        app.listen(this.port, () => {
            Debug.success(`Listener service is living on the port: ${this.port} with worker id: ${cluster.worker.id}`);
        });
    }
}

export default Api;
