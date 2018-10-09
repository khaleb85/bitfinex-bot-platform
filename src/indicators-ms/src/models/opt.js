import AdviceService from '../services/advice.service';
import DataService from '../services/data.service';

class Opt {
    constructor(strategyId) {
        this.advices = new AdviceService(strategyId);
        this.data = new DataService(strategyId);
    }
}

export default Opt;
