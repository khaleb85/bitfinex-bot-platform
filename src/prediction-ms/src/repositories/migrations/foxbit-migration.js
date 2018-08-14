import r from 'rethinkdb';
import Repository from '../repository';
import Debug from '../../tools/debug';

class FoxbitMigration {
    /**
     * @constructor
     */
    constructor() {
        this.repository = new Repository();
    }

    /**
     * Create a database with the name passed as param.
     *
     * @param  {string} dbName
     */
    createDatabase(dbName) {
        return this.repository.openDbConnection().then(conn => {
            r.dbList().run(conn).then(dbs => {
                if (dbs.indexOf(dbName) === -1) {
                    Debug.highlight(`Database ${dbName}, created!`);
                    r.dbCreate(dbName).run(conn);
                }
            });
        });
    }

    /**
     * Create a table in database passed as param,
     *
     * @param  {string} database
     * @param  {string} tableName
     */
    createTable(database, tableName) {
        return this.repository.openDbConnection().then(conn => {
            r.db(database).tableList().run(conn).then(tbs => {
                if (tbs.indexOf(tableName) === -1) {
                    Debug.highlight(`Table ${tableName}, created in the ${database} database!`);
                    r.db(database).tableCreate(tableName).run(conn);
                }
            });
        });
    }
}

export default FoxbitMigration;
