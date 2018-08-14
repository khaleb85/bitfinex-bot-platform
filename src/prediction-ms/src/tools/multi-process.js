import cluster from 'cluster';
import os from 'os';
import Debug from './debug';

/**
 * Process manager class
 *
 * @class MultiProcess
 *
 * @since 1.0.0
 */
class MultiProcess {
    /**
    * @typedef {function()} callback
    */

    /**
     * Call the function in multiple process based on machine cpus
     *
     * @param  {callback} worker Function called in clusters workers
     * @param  {callback} worker Function called in master cluster
     * @since 1.0.0
     */
    start(worker, master) {
        if (cluster.isMaster) {
            const cpuCount = os.cpus().length;

            for (let i = 0; i < cpuCount; i++) {
                cluster.fork();
            }

            if (master) { master(); }
        } else if (worker) { worker(); }

        this.onWorderExit();
    }

    /**
     * Replace a dead worker when it is exited
     *
     * @since 1.0.0
     */
    onWorderExit() {
        cluster.on('exit', (worker) => {
            Debug.error('Worker %d died :(', worker.id);
            cluster.fork();
        });
    }
}

export default MultiProcess;
