const { app, BrowserWindow, Menu, dialog } = require('electron')   // Line 1: First, you import the app and BrowserWindow modules of the electron package to be able to manage your application's lifecycle events, as well as create and control browser windows.

const knex = require('knex');
const isMac = process.platform === 'darwin'

let win = null;

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: async () => {
          const dbFile = await openDB();
          win.webContents.send('menu_open', dbFile)
          //getDataFromDB(dbFile);
        }
      },
      {
        label: 'Save',
        click: async () => {
          console.log('======file Save======')
          win.webContents.send('menu_save')
        }
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow () {  // Line 3: After that, you define a function that creates a new browser window with node integration enabled, loads index.html file into this window (line 12, we will discuss the file later).
  win = new BrowserWindow({
    width: 1120,
    height: 840,
    minWidth: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.setIcon('src/icon-application_16x16.png');
//  win.setMenuBarVisibility(false)
  win.loadFile('index.html')

}

app.whenReady().then(createWindow)  // Line 15: You create a new browser window by invoking the createWindow function once the Electron application is initialized.

app.on('window-all-closed', () => {  // Line 17: You add a new listener that tries to quit the application when it no longer has any open windows. This listener is a no-op on macOS due to the operating system's window management behavior.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {  // Line 23: You add a new listener that creates a new browser window only if when the application has no visible windows after being activated. For example, after launching the application for the first time, or re-launching the already running application.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})

let options_open = {
  title : "Select SQLite files for DB", 
  buttonLabel : "Select DB File",
  filters :[
    {name: 'Sqlite Files', extensions: ['sqlite']},
    {name: 'Custom File Type', extensions: ['as']},
    {name: 'All Files', extensions: ['*']}
  ],
  properties: ['openFile','multiSelections']
 }
 
 async function openDB(){
  let dbFilePath='';
  console.log('======= DB file open ======')
  await dialog.showOpenDialog(options_open)
  .then(result => {
    if(!result.canceled){
      let filePath = result.filePaths[0]
      dbFilePath = filePath.replace('\\', '/');
      console.log('Open DB sqlite file path : '+ dbFilePath)
    }
  }).catch(err => {
    console.log(err)
    dbFilePath = ''
  })
  return dbFilePath;
}

