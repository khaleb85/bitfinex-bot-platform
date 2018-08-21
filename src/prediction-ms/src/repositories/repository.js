import r from 'rethinkdb';

class Repository {
    /**
     * Open connection with database.
     */
    static openDbConnection() {
        const con = process.env.RETHINKDB_CONNECTION;
        this.indicatorTable = 'indicators';
        this.database = 'bitfinex';
        return r.connect(JSON.parse(con));
    }

    /**
     * On a data inserted in the database,
     * callback will be called with the new data passed as param.
     *
     * Can filter data with a function.
     *
     * @param  {string} table
     * @param  {function} filter
     * @param  {function} callBack
     */
    onInsert(table, filter, callBack) {
        this.openDbConnection().then(conn => {
            const changes = r.db(this.database).table(table).changes();
            if (filter !== null) changes.filter(filter);

            changes.run(conn, (err, cursor) => {
                if (err) throw err;

                cursor.each((error, row) => {
                    if (error) throw error;

                    if (row < 0) {
                        row.close();
                        return false;
                    } else if (row.old_val === null) {
                        callBack(row.new_val);
                    }
                });
            });
        });
    }

    /**
     * Insert a json in a table.
     *
     * @param  {string} table
     * @param  {json} item
     */
    static insert(table, item) {
        return new Promise(resolve => {
            this.openDbConnection().then(conn => {
                r.db(this.database).table(table)
                    .insert(item)
                    .run(conn, resolve);
            });
        });
    }
}

export default Repository;
