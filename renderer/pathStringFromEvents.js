const groupBy = require('lodash/groupBy');

const pathStringFromEvents = (events) =>
  Object.values(groupBy(events, (event) => `${event.msg.channel}_${event.msg.controller}`))
    .map(
      eventsForChannelController => eventsForChannelController.map(({t, msg: {value}}) => [t, 127 - value])
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
    );


module.exports = pathStringFromEvents;