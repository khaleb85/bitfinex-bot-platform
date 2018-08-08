/**
 * Model that represents a candle
 *
 * @class Candle
 * @since 1.0.0
 */
class Candle {
    /**
     *Creates an instance of Candle.
     *
     * @param {number} msTimeStamp
     * @param {number} open
     * @param {number} close
     * @param {number} high
     * @param {number} low
     * @param {number} volume
     * @memberof Candle
     * @since 1.0.0
     */
    constructor(msTimeStamp, open, close, high, low, volume) {
        this.msTimeStamp = msTimeStamp;
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
        this.volume = volume;
    }

    /**
     * Make a Candle object with a api Array response.
     *
     * @param {Array} arr - Array de update, bitfinex
     * @memberof BitfinexWsService
     * @returns {Candle}
     * @since 1.0.0
     */
    static create(arr) {
        if (!Array.isArray(arr)) {
            return null;
        }

        const data = arr[1];

        if (!Array.isArray(data)) {
            return new Candle(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
        }

        if (data.length !== 6) {
            return null;
        }

        return new Candle(data[0], data[1], data[2], data[3], data[4], data[5]);
    }

    /**
     * Verify if a candle is equals this.
     *
     * @param {Candle} candle
     * @returns {boolean}
     * @memberof Candle
     * @since 1.0.0
     */
    equals(candle) {
        let isValid = true;

        if (this.msTimeStamp !== candle.msTimeStamp) { isValid = false; }
        if (this.open !== candle.open) { isValid = false; }
        if (this.close !== candle.close) { isValid = false; }
        if (this.high !== candle.high) { isValid = false; }
        if (this.low !== candle.low) { isValid = false; }
        if (this.volume !== candle.volume) { isValid = false; }

        return isValid;
    }
}

export default Candle;
