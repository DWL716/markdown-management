const {app, dialog, Menu} = require("electron");
const path = require("path")
const isDev = require("electron-is-dev");
const Store = require('electron-store');
const { ipcMain } = require("electron/main");
const settingsStore = new Store({ name: 'Settings'})
const fileStore = new Store({name: 'Files Data'})
const menuTemplate = require("./src/menuTemplate")
const AppWindow = require("./src/AppWindow")

let mainWindow, settingsWindow;
app.on("ready", () => {
  const urlLocation = isDev ? 'http://localhost:5010' : "no"
  mainWindow = new AppWindow({}, urlLocation)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  
})
// 设置menu菜单
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

ipcMain.on('open-settings-window', () => {
  const settingsWindowConfig = {
    width: 500,
    height: 400,
    parent: mainWindow  
  }
  const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
  settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
  settingsWindow.removeMenu()
  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
})

ipcMain.on("selectFile", (event, args) => {
  dialog.showOpenDialog({
    title: "请选择需要导入的 md 文件",
    properties: ['openFile', 'multiSelections'],
    filters: [
      {name: 'Markdown files', extensions: ['md']}
    ]
  }).then((data) => {
    event.reply("getSelectFile", data.filePaths)
  })
})

ipcMain.on('config-is-saved', () => {
  // 注意mac和windows的菜单项索引
  let qiniuMenu = process.platform === 'darwin' ? menu.items[3] : menu.items[2]
  const switchItems = (toggle) => {
    [1, 2, 3].forEach(number => {
      qiniuMenu.submenu.items[number].enabled = toggle
    })
  }
  const qiniuIsConfiged =  ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
  if (qiniuIsConfiged) {
    switchItems(true)
  } else {
    switchItems(false)
  }
})