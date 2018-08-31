import Repository from './repository';

class SignalRepository extends Repository {
    static get signalTable() { return 'signal'; };

    static storeSignal(signal) {
        return this.insert(this.signalTable, signal);
    }
}

export default SignalRepository;
