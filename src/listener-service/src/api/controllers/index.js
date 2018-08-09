import hydra from 'hydra-express';
import CandlesController from './candles.controller';

class Controllers {
    /**
     * Add all controllers in the Express app
     * @since 1.0.0
     */
    start() {
        // this.app.use('/', ListenController);
        hydra.registerRoutes({
            '/candles': CandlesController,
        });
    }
}
export default Controllers;
