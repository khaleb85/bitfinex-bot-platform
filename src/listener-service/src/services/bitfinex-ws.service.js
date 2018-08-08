/* eslint-disable no-underscore-dangle */
import EventEmitter from 'events';
import WebSocket from 'ws';
import request from 'request';
import bitfinexConf from '../configs/bitfinex.json';
import Candle from '../models/candle';

/**
 * Service that make comunication with bitfinex api.
 *
 * @class BitfinexService
 */
class BitfinexWsService {
    /**
     *Creates an instance of BitfinexWsService.
     * @property {Candle[]} tempCandles - temporary candles that are used to test if has changes
     * @property {number} candlesChannelId - candles connection channel id
     *
     * @memberof BitfinexWsService
     * @since 1.0.0
     */
    constructor() {
        this.tempCandles = [];
        this.candlesChannelId = 0;
    }

    /**
     * Start listen the bitfinex candle websocket.
     *
     * @memberof BitfinexWsService
     * @event Candle#change
     * @since 1.0.0
     */
    start() {
        const emitter = new EventEmitter();
        const ws = new WebSocket(bitfinexConf.baseWssUrl);

        ws.on('message', (msg) => {
            const json = JSON.parse(msg);

            if (this.candlesChannelId === 0) {
                this._setCandlesChannelId(json);
            }

            if (!this._isHeartBeat(json)) {
                const candle = this._createCandle(json);

                if (candle === null) {
                    return;
                }

                if (this._hasChanges(candle)) {
                    emitter.emit('change', candle);
                }
            }
        });

        const msgC = JSON.stringify({
            event: 'subscribe',
            channel: 'candles',
            key: `trade:${bitfinexConf.timeFrame}:${bitfinexConf.symbol}`,
        });

        ws.on('open', () => ws.send(msgC));
        return emitter;
    }

    /**
     * Get last candle of bitfinex historical data
     *
     * @returns {Candle}
     * @memberof BitfinexWsService
     * @since 1.0.0
     */
    getLastCandle() {
        const self = this;
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
                        const candle = self._createCandle([self.candlesChannelId, arr]);
                        resolve(candle);
                    });
                });
        });
    }

    /**
     * Make a Candle object with a api response.
     *
     * @param {Array} arr - Array de update, bitfinex
     * @memberof BitfinexWsService
     * @returns {Candle}
     * @since 1.0.0
     */
    _createCandle(arr) {
        if (!Array.isArray(arr)) {
            return null;
        }

        const data = arr[1];

        if (data.length !== 6) {
            return null;
        }

        return new Candle(data[0], data[1], data[2], data[3], data[4], data[5]);
    }

    /**
     * Verify if the message is a heart beat.
     *
     * @param {ws.Data} msg
     * @memberof BitfinexWsService
     * @returns {boolean}
     * @since 1.0.0
     */
    _isHeartBeat(msg) {
        return msg[1] === 'hb';
    }

    /**
     * Verify if is a valid subscribed event and set the channel Id
     *
     * @param {ws.Data} msg
     * @memberof BitfinexWsService
     * @returns {boolean}
     * @since 1.0.0
     */
    _setCandlesChannelId(msg) {
        if (!Array.isArray(msg) && msg.channel === 'candles') {
            this.candlesChannelId = msg.chanId;
        }
    }

    /**
     * Verify if the candle has changed, comparing with 'tempCandles'.
     *
     * @param {Candle} candle
     * @memberof BitfinexWsService
     * @returns {boolean}
     * @since 1.0.0
     */
    _hasChanges(candle) {
        const i = this.tempCandles.findIndex(x => x.msTimeStamp === candle.msTimeStamp);

        if (i === -1) {
            this.tempCandles.push(candle);

            if (this.tempCandles.length > 1) {
                this.getLastCandle().then(x => {
                    console.log(x);
                });
            }

        } else {
            if (this.tempCandles[i] === undefined) {
                this.tempCandles.push(candle);
            }

            if (!candle.equals(this.tempCandles[i])) {
                this.tempCandles[i] = candle;
            } else {
                return false;
            }
        }

        return true;
    }
}

export default BitfinexWsService;
