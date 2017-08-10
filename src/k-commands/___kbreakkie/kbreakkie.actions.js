const path = require('path'),
    orderAction = require(path.resolve(__dirname, './order.action')),
    ordersAction = require(path.resolve(__dirname, './orders.action')),
    menuAction = require(path.resolve(__dirname, './menu.action')),
    confirmAction = require(path.resolve(__dirname, './confirm.action')),
    schedulerAction = require(path.resolve(__dirname, './scheduler.action'));

module.exports = {
    'schedule': {
        id: 1,
        description: 'Control the scheduler for breakkie reminders.',
        method: schedulerAction,
        params: {
            when: '',
            repeat: '',
        }
    },
    'order': {
        id: 2,
        description: 'Make an order for breakfast.',
        method: orderAction,
        params: {}
    },
    'orders':{
        id: 3,
        description: 'Get the list of today\'s orders.',
        method: ordersAction,
        params: {
        }
    },
    'menu':{
        id: 4,
        description: 'Get the breakfast menu.',
        method: menuAction,
        params: {
        }
    },
    'confirm':{
        id: 5,
        description: 'Palce orders and send a confirmation to all the users with their own orders.',
        method: confirmAction,
        params: {
        }
    }
};