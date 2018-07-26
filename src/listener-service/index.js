import MultiProcess from './src/tools/multi-process';
import Api from './src/api';
import BitfinexWsService from './src/services/bitfinex-ws.service';

const mProcess = new MultiProcess();
mProcess.start(() => {
    const api = new Api();
    api.start();
}, () => {
    new BitfinexWsService().start();
});

