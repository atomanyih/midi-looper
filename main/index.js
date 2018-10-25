const { app, BrowserWindow } = require('electron')
const controls = require('../looper/controls');


function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600 });


  win.loadURL('http://localhost:8080')

  controls({
    outputName: '',
    callbacks: {
      onUnassigned: (msg) => {
        win.webContents.send('midi-msg', msg)
      }
    }
  });
}

app.on('ready', createWindow);