import Repository from '../repositories/repository';

class Indicator {
    constructor(indicatorId, weight) {
        this.indicatorId = indicatorId;
        this.weight = weight;
    }

    static getIndicatorInDb(indicatorId) {
        if (!indicatorId) { return; }

        return new Promise(resolve => {
            Repository.getIndicator(indicatorId).then(data => {
                if (!data) {
                    Repository.insertIndicator(indicatorId);
                }
                return resolve(data);
            });
        });
    }
}

export default Indicator;
