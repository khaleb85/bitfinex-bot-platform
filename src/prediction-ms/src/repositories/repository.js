import r from 'rethinkdb';

class Repository {
    /**
     * Open connection with database.
     */
    openDbConnection() {
        const con = process.env.RETHINKDB_CONNECTION;
        console.log(con);
        console.log(typeof con);
        return r.connect(JSON.parse(con));
    }

    /**
     * Returns last candles limited by quantity.
     *
     * @param  {string} table
     * @param  {number} qnt
     * @param  {function} callBack
     */
    getCandlesByTime(table, qnt, callBack) {
        return this.openDbConnection().then(conn => {
            r.table(table)
                .orderBy(r.desc('time'))
                .limit(qnt)
                .run(conn, callBack);
        });
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
            const changes = r.table(table).changes();
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
    insert(table, item) {
        this.openDbConnection().then(conn => {
            r.table(table)
                .insert(item)
                .run(conn);
        });
    }
}

export default Repository;
