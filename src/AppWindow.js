const { BrowserWindow } = require("electron");

class AppWindow extends BrowserWindow {
  constructor(config, urlLocation) {
    const basicConfig = {
      width: 1024,
      height: 680,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
      show: false,
    };
    const finalConfig = { ...basicConfig, ...config };
    super(finalConfig);
    this.loadURL(urlLocation);
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow;
