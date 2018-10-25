const { app, BrowserWindow } = require('electron')

const url = require('url');
const path = require('path');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600 });


  win.loadURL('http://localhost:8080')

  setInterval(() => {win.webContents.send('store-data', 'hello');}, 2000)

}

app.on('ready', createWindow);