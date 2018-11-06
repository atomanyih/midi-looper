const EasyMidi = require('easymidi');
const Looper = require('./Looper');
const controls = require('./controls');

const OUTPUT_NAME = 'MIDILOOP';

const looper = new Looper({
  output: new EasyMidi.Output(OUTPUT_NAME, true)
});

controls({
  outputName: OUTPUT_NAME,
  callbacks: {
    onPressRecord: looper.actions.startRecording,
    onReleaseRecord: looper.actions.stopRecording,
    onPressStop: looper.actions.stopLoop,
    onPressStart() {
      looper.actions.restartLoop();
    },
    onUnassigned: looper.actions.recordMessage
  }
});
