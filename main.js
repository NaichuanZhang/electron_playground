
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray




console.log(Menu)
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let pop_up

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 387, height: 653})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function quick_add(){
  pop_up = new BrowserWindow({width: 300, height: 62})
  pop_up.loadURL(url.format({
    pathname: path.join(__dirname, 'quick_add.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.webContents.openDevTools()

  pop_up.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    pop_up = null
  })

}




//set the icon to be used in both dark and light mode
const nativeImage = require('electron').nativeImage;
const iconName ='icons/icon.ico_16x16.png'
const iconPath = path.join(__dirname, iconName)
var image = nativeImage.createFromPath(iconPath);
image.setTemplateImage(true);
console.log(image)
let appIcon = null

//tray icon and the menu for tray.
ipc.on('put-in-tray', function (event) {
  const iconName ='icons/icon.ico_16x16.png'

  const iconPath = path.join(__dirname, iconName)
  console.log(iconPath)
  appIcon = new Tray(image)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Start Deep Work Session',
    click: function (){
      quick_add()
    }},
    {label: 'Stop',
    click: function () {
      event.sender.send('tray-removed')
    }
  }
  ])
  appIcon.setToolTip('Deek Work Helper / Event Logger')
  appIcon.setContextMenu(contextMenu)
})

ipc.on('remove-tray', function () {
  appIcon.destroy()
})

app.on('window-all-closed', function () {
  if (appIcon) appIcon.destroy()
})
