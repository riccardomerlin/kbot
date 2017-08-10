'use strict';
const Datastore = require('nedb');

module.exports = new DbConnector();

function DbConnector() {
    /*
    {
        dtatime: 2017-01-01T12:00:30.999999Z,
        username: TFGR40DE,
        order: '3 pancakes + Americano'
    }
    */
    this.orders = new Datastore({
        filename: './data/orders.db',
        autoload: true
    });

    // this.orders.ensureIndex({ fieldName: 'id', unique: true }, function (err) {
    //     if (err) {
    //         console.log('Error: ' + err);
    //         throw 'Cannot ensure indexes on orders db.';
    //     }
    // });
}