import SignalRepository from '../repositories/signal.repository';
import Singal from '../models/signal';

class SignalService {
    static sendBuySignal(timeframe) {
        const signal = new Singal('buy', timeframe); 
        return SignalRepository.storeSignal(signal);
    }

    static sendSellSignal(timeframe) {
        const signal = new Singal('buy', timeframe); 
        return SignalRepository.storeSignal(signal);
    }
}

export default SignalService;
