import Repository from '../repositories/repository';

class Indicator {
    constructor(indicatorId, weight) {
        this.indicatorId = indicatorId;
        this.weight = weight;
    }

    static getIndicatorInDb(indicatorId) {
        if (!indicatorId) { return; }

        Repository.getIndicator(indicatorId).then(data => {
            console.log(data);
            if (!data) {
                Repository.insertIndicator(indicatorId);
            }
        });
    }
}

export default Indicator;
