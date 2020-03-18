const { saveConfig, resetData } = require('./script/handleConfig')
const path = require('path')
const electron = require('electron')
const { Menu, app, webContents, BrowserWindow, ipcMain, dialog } = electron
const fsp = require('fs').promises

const template = [{
    label: '设置',
    submenu: [{
        label: '选择文件夹路径',
        click() {
            dialog.showOpenDialog({
                title: '选择视频文件夹',
                properties: ['openFile', 'openDirectory']
            }).then(res => {
                saveConfig({
                    dirPath: res.filePaths[0]
                })

                const focuse = BrowserWindow.getFocusedWindow()
                focuse.send('setVideoFile')
            })
        }
    }, {
        label: '清空视频信息',
        click() {
            resetData()
            
            const focuse = BrowserWindow.getFocusedWindow()
            focuse.send('setVideoFile')
        }
    }, {
        label: '打开调试窗口',
        click() {
            const focuseWin = webContents.getFocusedWebContents()
            focuseWin.webContents.openDevTools()
        }
    }]
}, {
    label: '关于',
    submenu: [{
        label: '关于作者',
        click() {
            const focuse = BrowserWindow.getFocusedWindow()
            focuse.send('showAbout')
        }
    }]
}]

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)