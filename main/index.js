const { app, BrowserWindow } = require('electron')

const EasyMidi = require('easymidi');
const Looper = require('../looper/Looper');
const controls = require('../looper/controls');

const OUTPUT_NAME = 'MIDILOOP';



function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600 });


  win.loadURL('http://localhost:8080')

  const looper = new Looper({
    output: new EasyMidi.Output(OUTPUT_NAME, true),
    onUpdate: state => win.webContents.send('state-update', state)
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


  // controls({
  //   outputName: '',
  //   callbacks: {
  //     onUnassigned: (msg) => {
  //       win.webContents.send('midi-msg', msg)
  //     }
  //   }
  // });
}

app.on('ready', createWindow);