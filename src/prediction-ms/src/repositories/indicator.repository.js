
    // /**
    //  * Returns the selected indicator by Id
    //  *
    //  * @param {string} indicatorId
    //  * @returns {Promise<Indicator>}
    //  */
    // static getIndicator(indicatorId) {
    //     return new Promise(resolve => {
    //         this._openDbConnection().then(conn => {
    //             r.db(this.database).table(this.indicatorTable)
    //                 .filter({ indicatorId })
    //                 .run(conn, resolve);
    //         });
    //     });
    // }

    // static insertIndicator(indicatorId) {
    //     return new Promise(resolve => {
    //         this._openDbConnection().then(conn => {
    //             let weight = process.env.DEFAULT_WEIGHT;
    //             if (!weight) { weight = 1; }

    //             r.db(this.database).table(this.indicatorTable)
    //                 .insert({ indicatorId, weight })
    //                 .run(conn, resolve);
    //         });
    //     });
    // }
