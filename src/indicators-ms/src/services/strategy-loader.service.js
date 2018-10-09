/* eslint no-underscore-dangle:0 */
/* eslint import/no-dynamic-require:0 */
/* eslint  new-cap:0  */

import fs from 'fs';
import Opt from '../models/opt';

/**
 * Service that makes communication with all the strategies files
 *
 * @class StrategyLoaderService
 */
class StrategyLoaderService {
    constructor() {
        this.strategiesBasePath = './build/src/strategies';
        this.strategiesDynamicPath = '../strategies';

        if (!global.strategyCache) { global.strategyCache = []; }
    }

    /**
     * Run the given method in all strategies passing the given data
     *
     * @param {string} method
     * @param {Any} data
     * @memberof {StrategyLoaderService}
     * @since 1.0.0
     */
    runStrategiesMethod(method, data) {
        const self = this;
        return new Promise(resolve => {
            if (global.strategyCache.length === 0) {
                self._init().then(() => {
                    self._runAllStrategies(method, data);
                    return resolve();
                });
            } else {
                self._runAllStrategies(method, data).then(() => {
                    return resolve();
                });
            }
        });
    }

    getAllStrategies() {
        return {
            total: global.strategyCache.length,
            strategiesIds: global.strategyCache.map(x => x.indicatorId),
        };
    }

    /**
     * Private method to run all the given method in all strategies
     *
     * @param {string} method
     * @param {Any} data
     * @memberof {StrategyLoaderService}
     * @since 1.0.0
     */
    _runAllStrategies(method, data) {
        return new Promise(resolve => {
            if (global.strategyCache.length > 0) {
                global.strategyCache.forEach(instance => {
                    instance[method](data);
                });
                return resolve();
            }
        });
    }

    /**
     * Register all strategies in the cache
     *
     * @memberof {StrategyLoaderService}
     * @since 1.0.0
     */
    _init() {
        return new Promise(resolve => {
            if (global.hasInited === true || global.strategyCache.length > 0) { return resolve(); }

            global.hasInited = true;
            this._getStrategiesFilesPath().then(files => {
                files.forEach(x => {
                    const temp = require(`${this.strategiesDynamicPath}/${x}`);
                    const instance = new temp.default(Opt);
                    global.strategyCache.push(instance);
                    instance.init();
                });

                return resolve();
            });
        });
    }

    /**
     * Returns a array with the name of all files in the strategies folder
     *
     * @return {Promise<Array>} - filesName
     * @memberof {StrategyLoaderService}
     * @since 1.0.0
     */
    _getStrategiesFilesPath() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.strategiesBasePath, (err, files) => {
                if (err) {
                    return reject(err);
                }
                return resolve(files);
            });
        });
    }
}

export default StrategyLoaderService;
