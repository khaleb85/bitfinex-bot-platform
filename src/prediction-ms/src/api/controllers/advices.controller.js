import express from 'express';
import Debug from '../../tools/debug';
import Indicator from '../../models/indicator';

const router = new express.Router();

router.post('/buy', (req, res) => {
    Debug.success('buy advice');
    Indicator.getIndicatorInDb(req.body.indicatorId);

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
