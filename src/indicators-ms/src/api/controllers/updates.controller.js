import express from 'express';

const router = new express.Router();

router.post('/change', (req, res) => {
    req.strLoader.runStrategiesMethod('update', req.body);
    res.json({
        status: 'received',
    });
});

router.post('/complete', (req, res) => {
    req.strLoader.runStrategiesMethod('complete', req.body);
    res.json({
        status: 'received',
    });
});

export default router;
