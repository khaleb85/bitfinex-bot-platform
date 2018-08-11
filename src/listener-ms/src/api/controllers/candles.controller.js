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

export default router;
