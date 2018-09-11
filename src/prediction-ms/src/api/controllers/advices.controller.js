import express from 'express';
import Debug from '../../tools/debug';
import AdviceService from '../../services/advice.service';

const router = new express.Router();

router.post('/buy', (req, res) => {
    Debug.success('buy advice');
    let json = req.body;
    json.type = 'buy';

    AdviceService.ajustWeight(req.body.timeframe);
    AdviceService.storeAdvice(json)
        .then(added => {
            if (added) {
                AdviceService.verifyWeight(req.body.timeframe);
            }
        });

    res.json({
        status: 'received',
    });
});

router.post('/sell', (req, res) => {
    Debug.success('sell advice');
    res.json({
        status: 'received',
    });
});

export default router;
