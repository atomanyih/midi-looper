const EasyMidi = require('easymidi');

const RECORDING_NOTE = 25;
const RECORDING_CHANNEL = 0;
const STOP_NOTE = 23;
const STOP_CHANNEL = 0;
const START_NOTE = 20;
const START_CHANNEL = 0;
const OUTPUT_NAME = 'MIDILOOP';

const output = new EasyMidi.Output(OUTPUT_NAME, true);

const replay = (msgEvents) =>
  msgEvents.map(
    ({t, msg: {_type, ...msgParams}}) => setTimeout(
      () => {
        output.send(_type, msgParams);
      },
      t
    )
  );

const state = {
  recording: false,
  recordingStartTimestamp: null,
  recordingStopTimestamp: null,
  loop: null,
  loops: [],
  loopInterval: null,
  loopTimeouts: []
};


const Actions = {
  startRecording() {
    state.recording = true;
    state.loop = {
      recordingStartTimestamp: Date.now(),
      events: []
    };
  },
  stopRecording() {
    state.recording = false;
    const {loop} = state;

    const events = loop.events.map(({t, msg}) => (
      {
        t: t - loop.recordingStartTimestamp,
        msg
      }
    ));

    state.loops = [
      {
        duration: Date.now() - loop.recordingStartTimestamp,
        events
      }
    ];

    Actions.startLoop()
  },
  stopLoop() {
    clearInterval(state.loopInterval);

    state.loopTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    state.loopInterval = null;
    state.loopTimeouts = [];
  },
  startLoop() {
    const loop = state.loops[0];

    const {events, duration} = loop;

    state.loopTimeouts = replay(events);

    state.loopInterval = setInterval(() => {
      state.loopTimeouts = replay(events);
    }, duration);
  },
  recordMessage(msg) {
    state.loop = {
      ...state.loop,
      events: [
        ...state.loop.events,
        {
          msg,
          t: Date.now()
        }
      ]
    }
  },
};

const msgToString = (msg) =>
  Object.keys(msg)
    .map(key => key + ": " + msg[key])
    .join(', ');

EasyMidi.getOutputs().map(output => console.log(output));

function handleMessage(msg) {
  const {note, channel, velocity} = msg;

  if (note === RECORDING_NOTE && channel === RECORDING_CHANNEL) {
    if (velocity === 0) {
      Actions.stopRecording();
    }

    if (velocity === 127) {
      Actions.startRecording();
    }
  } else if (note === STOP_NOTE && channel === STOP_CHANNEL) {
    if (velocity === 127) {
      Actions.stopLoop();
    }
  } else if (note === START_NOTE && channel === START_CHANNEL) {
    if (velocity === 127) {
      Actions.stopLoop();
      Actions.startLoop();
    }
  } else {
    if (state.recording) {
      Actions.recordMessage(msg);
    }
  }
}

EasyMidi.getInputs().forEach(inputName => {
  const input = new EasyMidi.Input(inputName);
  input.on('message', msg => {
    console.log(`${inputName} - ${msgToString(msg)}`);
    if (inputName !== OUTPUT_NAME) {
      handleMessage(msg);
    }
  });
});
