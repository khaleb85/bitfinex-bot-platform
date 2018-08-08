import hydra from 'hydra-express';
import ListenController from './home.controller';

class Controllers {
    /**
     * Add all controllers in the Express app
     * @since 1.0.0
     */
    start() {
        // this.app.use('/', ListenController);
        hydra.registerRoutes({
            '': ListenController,
        });
    }
}
export default Controllers;
