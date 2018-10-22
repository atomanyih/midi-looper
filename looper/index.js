const EasyMidi = require('easymidi');
const Brain = require('./Brain');

const RECORDING_NOTE = 25;
const RECORDING_CHANNEL = 0;
const STOP_NOTE = 23;
const STOP_CHANNEL = 0;
const START_NOTE = 20;
const START_CHANNEL = 0;
const OUTPUT_NAME = 'MIDILOOP';

const brain = new Brain(
  new EasyMidi.Output(OUTPUT_NAME, true)
);

const msgToString = (msg) =>
  Object.keys(msg)
    .map(key => key + ": " + msg[key])
    .join(', ');

EasyMidi.getOutputs().map(output => console.log(output));

function handleMessage(msg) {
  const {note, channel, velocity} = msg;

  if (note === RECORDING_NOTE && channel === RECORDING_CHANNEL) {
    if (velocity === 0) {
      brain.actions.stopRecording();
    }

    if (velocity === 127) {
      brain.actions.startRecording();
    }
  } else if (note === STOP_NOTE && channel === STOP_CHANNEL) {
    if (velocity === 127) {
      brain.actions.stopLoop();
    }
  } else if (note === START_NOTE && channel === START_CHANNEL) {
    if (velocity === 127) {
      brain.actions.stopLoop();
      brain.actions.startLoop();
    }
  } else {
    brain.actions.recordMessage(msg);
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
