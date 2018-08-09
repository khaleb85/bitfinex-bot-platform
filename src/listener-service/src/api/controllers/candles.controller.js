import express from 'express';
import BitfinexService from '../../services/bitfinex.service';

const router = new express.Router();

router.get('/last', (req, res) => {
    const service = new BitfinexService();
    service.getLastCandle().then(candle => {
        return res.json(candle);
    });
});

export default router;
