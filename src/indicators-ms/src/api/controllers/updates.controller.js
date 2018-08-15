import express from 'express';

const router = new express.Router();

router.post('/change', (req, res) => {
    console.log('change indicator');
    res.json({
        status: 'received',
    });
});

router.post('/complete', (req, res) => {
    console.log('complete indicator');
    res.json({
        status: 'received',
    });
});

export default router;
