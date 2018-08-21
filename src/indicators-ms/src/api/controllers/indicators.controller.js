import express from 'express';

const router = new express.Router();

router.get('/all', (req, res) => {
    const data = req.strLoader.getAllStrategies();
    res.json(data);
});


export default router;