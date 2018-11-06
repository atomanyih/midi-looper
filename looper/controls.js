const EasyMidi = require('easymidi');

const RECORDING_NOTE = 25;
const RECORDING_CHANNEL = 0;
const STOP_NOTE = 23;
const STOP_CHANNEL = 0;
const START_NOTE = 20;
const START_CHANNEL = 0;

const msgToString = (msg) =>
  Object.keys(msg)
    .map(key => key + ": " + msg[key])
    .join(', ');

const controls = ({
                    outputName,
                    callbacks: {
                      onPressRecord,
                      onReleaseRecord,
                      onPressStop,
                      onPressStart,
                      onUnassigned
                    }
                  }) => {
  function handleMessage(msg) {
    const {note, channel, velocity} = msg;

    if (note === RECORDING_NOTE && channel === RECORDING_CHANNEL) {
      if (velocity === 0) {
        onReleaseRecord()
      }

      if (velocity === 127) {
        onPressRecord()
      }
    } else if (note === STOP_NOTE && channel === STOP_CHANNEL) {
      if (velocity === 127) {
        onPressStop()
      }
    } else if (note === START_NOTE && channel === START_CHANNEL) {
      if (velocity === 127) {
        onPressStart()
      }
    } else {
      onUnassigned(msg);
    }
  }

  EasyMidi.getInputs().forEach(inputName => {
    const input = new EasyMidi.Input(inputName);
    input.on('message', msg => {
//      console.log(`${inputName} - ${msgToString(msg)}`);
      if (inputName !== outputName) {
        handleMessage(msg);
      }
    });
  });
}

module.exports = controls;
