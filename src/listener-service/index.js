import MultiProcess from './src/tools/multi-process';
import Api from './src/api';
import BitfinexService from './src/services/bitfinex.service';

const mProcess = new MultiProcess();
mProcess.start(() => {
    const api = new Api();
    api.start();
}, () => {
    new BitfinexService().start();
});

