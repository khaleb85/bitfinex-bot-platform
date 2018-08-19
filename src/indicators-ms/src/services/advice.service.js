import ServiceComunication from '../services/service-comunication.service';

class AdviceServicee {
    buyAdvice(strategyId) {
        const data = {
            strategyId,
        };

        ServiceComunication.makePostRequest('prediction', '/advice/buy', data);
    }

    sellAdvice(strategyId) {
        const data = {
            strategyId,
        };

        ServiceComunication.makePostRequest('prediction', '/advice/sell', data);
    }
}

export default AdviceServicee;
