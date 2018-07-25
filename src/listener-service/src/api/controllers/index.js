import ListenController from './home.controller';

class Controllers {
    /**
     * @constructor
     * @param  {Express} app
     *
     * @since 1.0.0
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * Add all controllers in the Express app
     *
     * @since 1.0.0
     */
    start() {
        this.app.use('/', ListenController);
    }
}
export default Controllers;
