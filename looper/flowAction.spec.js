const flowAction = require("./flowAction");

describe('flowAction', () => {
  it('does actions sequentially, ignores argument, merges state', () => {
    const addOne = (state) => () => ({
      ...state,
      what: state.what + 1
    });

    const timesTwo = (state) => () => ({
      ...state,
      what: state.what * 2
    });

    expect(
      flowAction(
        addOne,
        timesTwo,
      )({
        what: 4,
        who: 2
      })()
    ).toEqual({
      what: 10,
      who: 2
    });

    expect(
      flowAction(
        timesTwo,
        addOne,
      )({
        what: 4,
        who: 2
      })()
    ).toEqual({
      what: 9,
      who: 2
    });
  });
});