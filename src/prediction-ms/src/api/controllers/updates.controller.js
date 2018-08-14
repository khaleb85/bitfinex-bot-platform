import express from 'express';

const router = new express.Router();

router.post('/change', (req, res) => {
    console.log(req.body);
    res.json({
        status: 'received',
    });
});

router.post('/complete', (req, res) => {
    console.log(req.body);
    res.json({
        status: 'received',
    });
});

export default router;
