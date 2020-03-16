const { saveConfig } = require('./script/handleConfig')
const path = require('path')
const configPath = path.resolve('./data/config.json')
const electron = require('electron')
const { Menu, app, webContents, BrowserWindow, ipcMain, dialog } = electron
const fsp = require('fs').promises

const template = [{
    label: '设置',
    submenu: [{
        label: '打开调试窗口',
        click() {
            const focuseWin = webContents.getFocusedWebContents()
            focuseWin.webContents.openDevTools()
        }
    }, {
        label: '选择文件夹路径',
        click() {
            dialog.showOpenDialog({
                title: '选择视频文件夹',
                properties: ['openFile', 'openDirectory']
            }).then(res => {
                saveConfig({
                    dirPath: res.filePaths[0]
                })

                const mainWindow = webContents.getAllWebContents()[0]
                mainWindow.send('setVideoFile')
            })
        }
    }]
}, {
    label: 'test2',
    submenu: [{
      label: 'test22',
      click() {
          
      }
    }]
}]

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)