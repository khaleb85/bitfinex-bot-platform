import SignalRepository from '../repositories/signal.repository';
import Signal from '../models/signal';
import Debug from '../tools/debug';

class SignalService {
    static sendBuySignal(timeframe) {
        const signal = new Signal('buy', timeframe);
        Debug.success('Emitted Buy Signal');
        return SignalRepository.storeSignal(signal);
    }

    static sendSellSignal(timeframe) {
        const signal = new Signal('sell', timeframe);
        Debug.success('Emitted Sell Signal');
        return SignalRepository.storeSignal(signal);
    }
}

export default SignalService;
