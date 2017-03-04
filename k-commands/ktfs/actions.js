const path = require('path'),
    qbuild = require(path.resolve(__dirname, './qbuild.action')),
    register = require(path.resolve(__dirname, './register.action')),
    userinfo = require(path.resolve(__dirname, './userinfo.action'));

module.exports = {
    'register': {
        id: 1,
        description: 'Register you Slack user with TFS services.',
        method: register,
        params: {
            tfsToken: '',
            tfsUser: ''
        }
    },
    'userinfo': {
        id: 2,
        description: 'Get registered user infos.',
        method: userinfo,
        params: {}
    },
    'qbuild': {
        id: 3,
        description: 'Queue a new build on your TFS instance',
        method: qbuild,
        params: {
            id: 0,
            project: '',
            branch: 'master'
        }
    }
};