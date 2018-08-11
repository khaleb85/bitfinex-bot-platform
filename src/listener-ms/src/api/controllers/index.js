import hydra from 'hydra-express';
import CandlesController from './candles.controller';

class Controllers {
    /**
     * Add all controllers in the Express app
     *
     * @memberof Controllers
     * @since 1.0.0
     */
    start() {
        hydra.registerRoutes({
            '/candles': CandlesController,
        });
    }
}
export default Controllers;
