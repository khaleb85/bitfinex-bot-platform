
import request from 'request';
import Candle from '../models/candle';
import bitfinexConf from '../configs/bitfinex.json';

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
}

export default BitfinexService;
