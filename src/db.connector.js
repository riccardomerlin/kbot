'use strict';
const Datastore = require('nedb');
const path = require('path');

module.exports = new DbConnector();

function DbConnector() {
    this.users = new Datastore({
        filename: path.resolve(__dirname, './data/users.db'),
        autoload: true
    });

    this.users.ensureIndex({ fieldName: 'username', unique: true }, function (err) {
        if (err) {
            console.log('Error: ' + err);
            throw 'Cannot ensure indexes on db.';
        }
    });
}