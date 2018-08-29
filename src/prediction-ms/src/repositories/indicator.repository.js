import r from 'rethinkdb';
import Repository from './repository';

class IndicatorRepository extends Repository {
    /**
     * Returns the selected indicator by Id
     *
     * @param {string} indicatorId
     * @returns {Promise<Indicator>}
     */
    static getIndicator(indicatorId) {
        return new Promise(resolve => {
            this.openDbConnection().then(conn => {
                r.db(this.database).table(this.indicatorTable)
                    .filter({ indicatorId })
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
            this.openDbConnection().then(conn => {
                let weight = process.env.DEFAULT_WEIGHT;
                if (!weight) { weight = 1; }

                r.db(this.database).table(this.indicatorTable)
                    .insert({ indicatorId, weight })
                    .run(conn, resolve);
            });
        });
    }
}

export default IndicatorRepository;

