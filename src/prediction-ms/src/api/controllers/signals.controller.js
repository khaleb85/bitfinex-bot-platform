import express from 'express';
import SignalRepository from '../../repositories/signal.repository';


const router = new express.Router();

router.get('/all', (req, res) => {
    SignalRepository.getAll()
        .then(signals => {
            res.json({
                status: 'success',
                data: signals,
            });
        });
});

export default router;
