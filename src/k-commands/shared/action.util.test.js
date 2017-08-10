const path = require('path');
const actionUtil = require(path.resolve(__dirname, 'action.util'));

describe('buildDescription tests', function () {
  test('match the expected built string for an action with no params', function () {
    // arrange
    const action1 = {
      id: 1,
      description: 'action1 description',
      params: {}
    };

    expect(actionUtil.buildDescription(
      'action1',
      'myCommand',
      action1.description,
      action1.params
    ))
      .toBe('*action1 description*\nmyCommand action1 \n\n');
  });

  test('match the expected built string for an action with 1 param', function () {
    // arrange
    const action1 = {
      id: 1,
      description: 'action1 description',
      params: {
        text: 'string',
      }
    };

    expect(actionUtil.buildDescription(
      'action1',
      'myCommand',
      action1.description,
      action1.params
    ))
      .toBe('*action1 description*\nmyCommand action1 text:{value} \n\n');
  });

  test('match the expected built string for an action with 2 params', function () {
    // arrange
    const action1 = {
      id: 1,
      description: 'action1 description',
      params: {
        text: 'string',
        id: 100
      }
    };

    expect(actionUtil.buildDescription(
      'action1',
      'myCommand',
      action1.description,
      action1.params
    ))
      .toBe('*action1 description*\nmyCommand action1 text:{value} id:{value} \n\n');
  });
});

describe('getHelpDescription tests', function () {
  test('match the expected built string for a list of actions with no params', function () {
    // arrange
    const actions = {
      action1: {
        description: 'action1 description',
        params: {}
      },
      action2: {
        description: 'action2 description2',
        params: {}
      }
    };

    expect(actionUtil.getHelpDescription(actions, 'myCommand'))
      .toBe('*action1 description*\nmyCommand action1 \n\n*action2 description2*\nmyCommand action2 \n\n');
  });

  test('match the expected built string for a list of actions with params', function () {
    // arrange
    const actions = {
      action1: {
        description: 'action1 description',
        params: {
          id: 2,
          text: 'my text'
        }
      },
      action2: {
        description: 'action2 description2',
        params: {
          name: '',
          surname: ''
        }
      }
    };

    expect(actionUtil.getHelpDescription(actions, 'myCommand'))
      .toBe('*action1 description*\nmyCommand action1 id:{value} text:{value} \n\n*action2 description2*\nmyCommand action2 name:{value} surname:{value} \n\n');
  });
});