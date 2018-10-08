import express from 'express';
import BitfinexService from '../../services/bitfinex.service';

const router = new express.Router();
const service = new BitfinexService();

/**
 * Returns the last candle in bitfinex api
 *
 * @since 1.0.0
 */
router.get('/last', (req, res) => {
    service.getLastCandle().then(candle => {
        return res.json(candle);
    });
});

router.get('/hist', (req, res) => {
    service.getHist().then(candles => {
        return res.json(candles);
    });
});

/**
 * Returns the request candle by timeframe
 *
 * @since 1.0.0
 */
router.get('/', (req, res) => {
    if (!req.query.timeframe) {
        return res.json('not found');
    }
    console.log(req.query.timeframe);

    service.getCandle(req.query.timeframe).then(candle => {
        return res.json(candle);
    });
});

export default router;
