import express from 'express';
import IndicatorsService from '../../services/indicators.service';

const router = new express.Router();

router.post('/change', (req, res) => {
    const indicatorsService = new IndicatorsService();
    console.log(req.body);
    indicatorsService.sendUpdate(req.body);
    res.json({
        status: 'received',
    });
});

router.post('/complete', (req, res) => {
    const indicatorsService = new IndicatorsService();
    indicatorsService.sendComplete(req.body);
    res.json({
        status: 'received',
    });
});

export default router;
