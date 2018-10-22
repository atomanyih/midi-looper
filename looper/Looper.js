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

const playLoop = (state, {output}) => (loopIndex) => {
  const replay = (msgEvents) =>
    msgEvents.map(
      ({t, msg: {_type, ...msgParams}}) => setTimeout(
        () => {
          output.send(_type, msgParams);
        },
        t
      )
    );

  const loops = state.loops.map((loop, index) => {
    if(loopIndex === index) {
      return {
        ...loop,
        timeoutIds: replay(loop.events)
      }
    }

    return loop
  });

  return {
    ...state,
    loops
  }
};

const startLoop = (state, {actions}) => () => {
  const loops = state.loops.map((loop, index) => {
    const {duration} = loop;
    actions.playLoop(index);

    const intervalId = setInterval(
      () => actions.playLoop(index),
      duration
    );

    return {
      ...loop,
      intervalId
    }
  });

  return {
    ...state,
    loops
  }
};

const stopRecording = (state, {actions}) => () => {
  const {loop} = state;

  const events = loop.events.map(({t, msg}) => (
    {
      t: t - loop.recordingStartTimestamp,
      msg
    }
  ));

  actions.stopLoop();
  actions.startLoop();

  return {
    ...state,
    recording: false,
    loops: [
      ...state.loops,
      {
        duration: Date.now() - loop.recordingStartTimestamp,
        events,
        timeoutIds: []
      }
    ]
  }
};

class Looper {
  constructor({output, onUpdate = () => {}}) {
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

    const bindAction = action => (...args) => setImmediate(
      () => {
        const state = action(
          this.state,
          {
            output: this.output,
            actions: this.actions
          }
        )(...args);

        onUpdate(state);

        return this.state = state;
      }
    );

    this.actions = {
      startRecording: bindAction(startRecording),
      stopRecording: bindAction(stopRecording),
      stopLoop: bindAction(stopLoop),
      playLoop: bindAction(playLoop),
      startLoop: bindAction(startLoop),
      recordMessage: bindAction(recordMessage)
    };
  };
}


module.exports = Looper;