const pathStringFromEvents = require('./pathStringFromEvents');

describe('pathStringFromEvents', () => {
  it('creates a path for each channel/controller combination, inverts value', () => {
    const events = [
      {
        "msg": {
          "_type": "cc",
          "channel": 0,
          "controller": 13,
          "value": 0
        },
        "t": 0
      },
      {
        "msg": {
          "_type": "cc",
          "channel": 1,
          "controller": 13,
          "value": 0
        },
        "t": 20
      },
      {
        "msg": {
          "_type": "cc",
          "channel": 1,
          "controller": 12,
          "value": 0
        },
        "t": 40
      },
      {
        "msg": {
          "_type": "cc",
          "channel": 0,
          "controller": 13,
          "value": 127
        },
        "t": 50
      },
      {
        "msg": {
          "_type": "cc",
          "channel": 1,
          "controller": 13,
          "value": 127
        },
        "t": 70
      },
      {
        "msg": {
          "_type": "cc",
          "channel": 1,
          "controller": 12,
          "value": 127
        },
        "t": 90
      },
    ];

    expect(
      pathStringFromEvents(events)
    ).toEqual([
      'M 0 127 L 50 0',
      'M 20 127 L 70 0',
      'M 40 127 L 90 0'
    ])
  });
});