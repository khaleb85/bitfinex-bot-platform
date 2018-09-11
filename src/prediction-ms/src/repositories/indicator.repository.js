import r from 'rethinkdb';
import Repository from './repository';

class IndicatorRepository extends Repository {
    static get advTable() { return 'advices'; }

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

    /**
     * Returns the selected indicator by table Id
     *
     * @param {string} indicatorId
     * @returns {Promise<Indicator>}
     */
    static getIndicatorByTableId(indicatorTableId) {
        return new Promise(resolve => {
            this.openDbConnection().then(conn => {
                r.db(this.database).table(this.indicatorTable)
                    .get(indicatorTableId)
                    .run(conn, (err, cursor) => {
                        if (err) { throw err; }

                        return resolve(cursor);
                    });
            });
        });
    }

    /**
     * Update the weight of a indicator
     *
     * @param {string} indicatorId
     * @param {string} weight
     * @returns {Promise<Indicator>}
     */
    static updateWeight(indicatorId, weight) {
        return new Promise(resolve => {
            this.openDbConnection().then(con => {
                r.db(this.database).table(this.indicatorTable)
                    .get(indicatorId).update({ weight }).run(con, (err, cursor) => {
                        if (err) { throw err; }

                        return resolve(cursor);
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

