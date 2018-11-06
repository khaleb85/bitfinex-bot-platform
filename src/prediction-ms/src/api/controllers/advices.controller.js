import express from 'express';
import Debug from '../../tools/debug';
import AdviceService from '../../services/advice.service';

const router = new express.Router();

router.post('/buy', (req, res) => {
    Debug.success('Buy Advice - Received');
    const json = req.body;
    json.type = 'buy';
    AdviceService.storeAdvice(json).then(added => {
        if (added) {
            AdviceService.verifyWeight(req.body.timeframe);
        }
    });

    res.json({
        status: 'received',
    });
});

router.post('/sell', (req, res) => {
    Debug.success('Sell Advice - Received');
    const json = req.body;
    json.type = 'sell';

    AdviceService.storeAdvice(json).then(added => {
        if (added) {
            AdviceService.verifyWeight(req.body.timeframe);
        }
    });

    res.json({
        status: 'received',
    });
});

export default router;
