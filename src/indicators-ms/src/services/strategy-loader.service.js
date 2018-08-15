/* eslint import/no-dynamic-require: 0 new-cap:0 */

import fs from 'fs';

/**
 * Service that makes communication with all the strategies files
 *
 * @class StrategyLoaderService
 */
class StrategyLoaderService {
    constructor() {
        this.strategiesBasePath = './build/src/strategies';
        this.strategiesDynamicPath = '../strategies';
        this.cache = [];
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
        return new Promise(resolve => {
            if (this.cache.length > 0) {
                this.cache.forEach(instance => {
                    instance[method](data);
                });
                return resolve();
            }

            throw new Error('You should call the init method before run a strategy function');
        });
    }

    init() {
        return new Promise(resolve => {
            this._getStrategiesFilesPath().then(files => {
                files.forEach(x => {
                    const temp = require(`${this.strategiesDynamicPath}/${x}`);
                    const instance = new temp.default();
                    this.cache.push(instance);
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
