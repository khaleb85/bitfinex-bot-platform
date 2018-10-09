import ServiceComunication from '../services/service-comunication.service';

class AdviceServicee {
    constructor(strategyId) {
        this.strategyId = strategyId;
    }

    buyAdvice(timeframe) {
        const data = {
            indicatorId: this.strategyId,
            timeframe,
        };

        ServiceComunication.makePostRequest('prediction', '/advice/buy', data);
    }

    sellAdvice(timeframe) {
        const data = {
            indicatorId: this.strategyId,
            timeframe,
        };

        ServiceComunication.makePostRequest('prediction', '/advice/sell', data);
    }
}

export default AdviceServicee;
