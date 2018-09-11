import Repository from './repository';
import r from 'rethinkdb';

class AdviceRepository {
    static get database() { return 'bitfinex'; }
    static get advTable() { return 'advices'; }
    static get indiTable() { return 'indicators'; }

    static getAdvicesByTimeFrame(timeframe) {
        return new Promise(resolve => {
            Repository.openDbConnection().then(conn => {
                r.db(this.database).table(this.advTable)
                    .eqJoin('indicatorId', r.db(this.database).table(this.indiTable))
                    .zip()
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

    static getPreviousAdvice(timeframe) {
        return new Promise(resolve => {
            Repository.openDbConnection().then(conn => {
                r.db(this.database).table(this.advTable)
                    .orderBy(r.desc('timeframe')).limit(3)
                    .run(conn, (err, cursor) => {
                        if (err) { throw err; }

                        cursor.toArray((errz, results) => {
                            if (errz) throw errz;

                            for (let i = 0; i < results.length; i++) {
                                if (results[i].timeframe === timeframe) {
                                    return resolve(results[i + 1]);
                                }
                            }
                            return resolve(results[1]);
                        });
                    });
            });
        });
    }

}

export default AdviceRepository;
