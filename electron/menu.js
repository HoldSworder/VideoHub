const electron = require('electron')
const { Menu, app, webContents, BrowserWindow, ipcMain } = electron

const template = [{
    label: 'test',
    submenu: [{
        label: 'test1',
        click() {
            const focuseWin = webContents.getFocusedWebContents()
            focuseWin.webContents.openDevTools()
        }
    }]
}, {
    label: 'test2',
    submenu: [{
      label: 'test22',
      click() {
          
      }
    }]
}, {
    label: '设置',
    submenu:[{
        label: '清空缓存',
        click() {

        }
    }]
}]

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)