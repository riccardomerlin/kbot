const path = require('path');
const qbuild = require( path.resolve(__dirname, './qbuild.action' ) );

module.exports = {
    'qbuild': {
        id: 1,
        description: 'Queue a new build on your TFS instance',
        method: qbuild,
        params: { id: 0, project: '', branch: 'master' }
    }
};