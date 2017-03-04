'use strict';
const Datastore = require('nedb');

module.exports = new DbConnector();

function DbConnector() {
    this.users = new Datastore({
        filename: './data/users.db',
        autoload: true
    });

    this.users.ensureIndex({ fieldName: 'username', unique: true }, function (err) {
        if (err) {
            console.log('Error: ' + err);
            throw 'Cannot ensure indexes on db.';
        }
    });
}