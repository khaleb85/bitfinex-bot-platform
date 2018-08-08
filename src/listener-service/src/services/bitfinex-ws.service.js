/* eslint-disable no-underscore-dangle */
import EventEmitter from 'events';
import WebSocket from 'ws';
import bitfinexConf from '../configs/bitfinex.json';
import BitfinexService from '../services/bitfinex.service';
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
        this.completedCandles = [];
        this.candlesChannelId = 0;
        this.restApi = new BitfinexService();
    }

    /**
     * Start listen the bitfinex candle websocket.
     *
     * @memberof BitfinexWsService
     * @event Candle#change
     * @event Candle#complete
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
                const candle = Candle.create(json);
                if (this.isCandleOutdated(candle)) {
                    emitter.emit('complete', candle);
                }

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
     *
     * @returns {boolean}
     * @since 1.0.0
     */
    _hasChanges(candle) {
        const i = this.tempCandles.findIndex(x => x.msTimeStamp === candle.msTimeStamp);

        if (i === -1) {
            this.tempCandles.push(candle);
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

    /**
     * Verify if the candle is outdated based in the api last candle
     *
     * @memberof BitfinexWsService
     * @param {Candle} candle
     * @returns {boolean}
     * @since 1.0.0
     */
    isCandleOutdated(candle) {
        if (this.tempCandles.length > 1) {
            const i = this.completedCandles.findIndex(x => x.msTimeStamp === candle.msTimeStamp);

            if (i !== -1) { return; }

            this.restApi.getLastCandle().then(lastCandle => {
                if (candle.msTimeStamp < lastCandle.msTimeStamp) {
                    this.completedCandles.push(candle);
                    return true;
                }
            });
        }

        return false;
    }
}

export default BitfinexWsService;
