const startRecording = state => () => {
  return {
    ...state,
    recording: true,
    loop: {
      recordingStartTimestamp: Date.now(),
      events: []
    }
  }
};

const stopLoop = state => () => {
  const loops = state.loops.map((loop) => {
    clearInterval(loop.intervalId);

    loop.timeoutIds.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });

    return {
      ...loop,
      intervalId: null,
      timeoutIds: []
    }
  });

  return {
    ...state,
    loops
  }
};

const recordMessage = state => msg => {
  if (!state.recording) {
    return state
  }

  const loop = {
    ...state.loop,
    events: [
      ...state.loop.events,
      {
        msg,
        t: Date.now()
      }
    ]
  };

  return {
    ...state,
    loop
  }
};

class Brain {
  constructor(output) {
    this.output = output;

    this.state = {
      recording: false,
      recordingStartTimestamp: null,
      recordingStopTimestamp: null,
      loop: null,
      loops: [],
      loopInterval: null,
      loopTimeouts: []
    };

    const bindAction = action => (...args) => this.state = action(this.state)(...args);

    this.actions = {
      startRecording: bindAction(startRecording),
      stopRecording: () => {
        this.state.recording = false;
        const {loop} = this.state;

        const events = loop.events.map(({t, msg}) => (
          {
            t: t - loop.recordingStartTimestamp,
            msg
          }
        ));

        this.state.loops = [
          {
            duration: Date.now() - loop.recordingStartTimestamp,
            events
          }
        ];

        this.actions.startLoop()
      },
      stopLoop: bindAction(stopLoop),
      startLoop: () => {
        const replay = (msgEvents) =>
          msgEvents.map(
            ({t, msg: {_type, ...msgParams}}) => setTimeout(
              () => {
                this.output.send(_type, msgParams);
              },
              t
            )
          );

        const loops = this.state.loops.map((loop) => {
          const {events, duration} = loop;
          const timeoutIds = replay(events);

          const intervalId = setInterval(
            () => {
              this.state.loops = [
                {
                  ...this.state.loops[0],
                  timeoutIds: replay(events)
                }
              ];
            },
            duration
          );

          return {
            ...loop,
            timeoutIds,
            intervalId
          }
        });

        this.state.loops = loops;
      },
      recordMessage: bindAction(recordMessage)
    };
  };
}


module.exports = Brain;