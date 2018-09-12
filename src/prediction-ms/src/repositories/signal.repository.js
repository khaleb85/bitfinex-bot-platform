import r from 'rethinkdb';
import Repository from './repository';

class SignalRepository extends Repository {
    static get signalTable() { return 'signal'; }

    static getAll() {
        return new Promise(resolve => {
            Repository.openDbConnection().then(conn => {
                r.db(this.database).table(this.signalTable)
                    .run(conn, (err, cursor) => {
                        if (err) { throw err; }

                        cursor.toArray((errz, results) => {
                            if (errz) throw errz;

                            return resolve(results);
                        });
                    });
            });
        });
    }

    static storeSignal(signal) {
        return this.insert(this.signalTable, signal);
    }
}

export default SignalRepository;
