const EasyMidi = require('easymidi');

const RECORDING_NOTE = 25;
const RECORDING_CHANNEL = 0;
const STOP_NOTE = 23;
const STOP_CHANNEL = 0;
const START_NOTE = 20;
const START_CHANNEL = 0;

const output = new EasyMidi.Output('test output', true);

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
  loop: [],
  loopInterval: null,
  loopTimeouts: []
};


const Actions = {
  startRecording() {
    state.recording = true;
    state.recordingStartTimestamp = Date.now();
    state.loop = [];
  },
  stopRecording() {
    state.recording = false;
    state.recordingStopTimestamp = Date.now();

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
    const relativeEvents = state.loop.map(({t, msg}) => (
      {
        t: t - state.recordingStartTimestamp,
        msg
      }
    ));

    state.loopTimeouts = replay(relativeEvents);

    const loopDuration = state.recordingStopTimestamp - state.recordingStartTimestamp;
    state.loopInterval = setInterval(() => {
      state.loopTimeouts = replay(relativeEvents);
    }, loopDuration);
  },
  recordMessage(msg) {
    state.loop = [
      ...state.loop,
      {
        msg,
        t: Date.now()
      }
    ]
  },
};

const msgToString = (msg) =>
  Object.keys(msg)
    .map(key => key + ": " + msg[key])
    .join(', ');

EasyMidi.getOutputs().map(output => console.log(output));
EasyMidi.getInputs().forEach(inputName => {
  const input = new EasyMidi.Input(inputName);
  input.on('message', msg => {
    const {note, channel, velocity} = msg;
    console.log(`${inputName} - ${msgToString(msg)}`);

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
  });
});


// setInterval()