import Repository from './repository';
import r from 'rethinkdb';

class AdviceRepository {
    static get database() { return 'bitfinex'; }
    static get advTable() { return 'advices'; }

    static getAdvicesByTimeFrame(timeframe) {
        return new Promise(resolve => {
            Repository.openDbConnection().then(conn => {
                r.db(this.database).table(this.advTable)
                    .filter({ timeframe })
                    .run(conn, (err, cursor) => {
                        if (err) { throw err; }

                        cursor.toArray((errz, results) => {
                            if (errz) throw errz;

                            resolve(results);
                        });
                    });
            });
        });
    }

    static getAdvicesByTimeFrameAndId(timeframe, indicatorId) {
        return new Promise(resolve => {
            Repository.openDbConnection().then(conn => {
                r.db(this.database).table(this.advTable)
                    .filter({ timeframe, indicatorId })
                    .run(conn, (err, cursor) => {
                        if (err) { throw err; }

                        cursor.toArray((errz, results) => {
                            if (errz) throw errz;
                            
                            resolve(results);
                        });
                    });
            });
        });
    }

    static insertIndicator(indicatorId) {
        return new Promise(resolve => {
            this._openDbConnection().then(conn => {
                let weight = process.env.DEFAULT_WEIGHT;
                if (!weight) { weight = 1; }

                r.db(this.database).table(this.indicatorTable)
                    .insert({ indicatorId, weight })
                    .run(conn, resolve);
            });
        });
    }

}

export default AdviceRepository;
