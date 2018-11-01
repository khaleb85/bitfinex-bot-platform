
import request from 'request';
import Candle from '../models/candle';
import bitfinexConf from '../configs/bitfinex.json';
import hist from '../mock/hist';

/**
 * Service that make comunication with bitfinex api.
 *
 * @class BitfinexService
 */
class BitfinexService {
    /**
     * Get last candle of bitfinex historical data
     *
     * @returns {Candle}
     * @memberof BitfinexWsService
     * @since 1.0.0
     */
    getLastCandle() {
        return new Promise((resolve) => {
            let body = '';
            const mockIps = process.env.MOCK_IP;
            if (mockIps) {
                return resolve(Candle.create([1540335600000, 6544.5, 6552.1, 6552.28374, 6544.5, 35.31529344]));
            }

            request.get(`${bitfinexConf.basePublicRestUrl}/v2/candles/trade:${bitfinexConf.timeFrame}:${bitfinexConf.symbol}/last`)
                .on('response', (response) => {
                    response.on('data', chunk => {
                        if (Buffer.isBuffer(chunk)) {
                            body += chunk.toString();
                        } else {
                            body += chunk;
                        }
                    });

                    response.on('end', () => {
                        const arr = JSON.parse(body);
                        const candle = Candle.create(arr);
                        resolve(candle);
                    });
                });
        });
    }

    /**
     * Get candle by timeframe
     *
     * @returns {Candle}
     * @memberof BitfinexWsService
     * @since 1.0.0
     */
    getCandle(timeframe) {
        return new Promise(resolve => {
            let body = '';
            request.get(`${bitfinexConf.basePublicRestUrl}/v2/candles/trade:${bitfinexConf.timeFrame}:${bitfinexConf.symbol}/hist?start=${timeframe}&limit=1&sort=1`)
                .on('response', (response) => {
                    response.on('data', chunk => {
                        if (Buffer.isBuffer(chunk)) {
                            body += chunk.toString();
                        } else {
                            body += chunk;
                        }
                    });

                    response.on('end', () => {
                        const arr = JSON.parse(body);
                        const candle = Candle.create(...arr);
                        resolve(candle);
                    });
                });
        });
    }

    /**
     * Returns top 100 historical data
     *
     * @returns {Candle[]}
     * @memberof BitfinexWsService
     * @since 1.0.0
     */
    getHist() {
        return new Promise(resolve => {
            const mockIps = process.env.MOCK_IP;
            if (mockIps) {
                const arr = [];
                hist.forEach(x => arr.push(Candle.create(x)));
                return resolve(arr);
            }

            let body = '';
            request.get(`${bitfinexConf.basePublicRestUrl}/v2/candles/trade:${bitfinexConf.timeFrame}:${bitfinexConf.symbol}/hist`)
                .on('response', (response) => {
                    response.on('data', chunk => {
                        if (Buffer.isBuffer(chunk)) {
                            body += chunk.toString();
                        } else {
                            body += chunk;
                        }
                    });

                    response.on('end', () => {
                        const candles = [];
                        const arr = JSON.parse(body);
                        arr.forEach(x => candles.push(Candle.create(x)));
                        return resolve(candles);
                    });
                });
        });
    }
}

export default BitfinexService;
