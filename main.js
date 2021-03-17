const {app, BrowserWindow} = require("electron");
const isDev = require("electron-is-dev");
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings'})
const fileStore = new Store({name: 'Files Data'})

let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    // show: false, 
  })

  const urlLocation = isDev ? "http://localhost:5010" : "no";
  mainWindow.loadURL(urlLocation);
})