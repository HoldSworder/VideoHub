const { saveConfig, resetData } = require('./script/handleConfig')
const path = require('path')
const electron = require('electron')
const { Menu, app, webContents, BrowserWindow, ipcMain, dialog } = electron
const fsp = require('fs').promises

const template = [{
    label: '视频流模式',
    click() {
        const focuse = webContents.getFocusedWebContents()
        const focuseURL = focuse.getURL()
        
        const content = findContent('flow')
        if(content) return

        let win = new BrowserWindow({
            width: 1500,
            height: 1000,
            webPreferences: {
              nodeIntegration: true,
              webSecurity: false
            }
        })
        win.loadURL(focuseURL + 'flow')
    }
}, {
    label: '同屏播放模式',
    click() {
        const focuse = webContents.getFocusedWebContents()
        const focuseURL = focuse.getURL()
        
        const content = findContent('watch')
        if(content) return

        let win = new BrowserWindow({
            width: 1500,
            height: 1000,
            webPreferences: {
              nodeIntegration: true,
              webSecurity: false
            }
        })
        win.loadURL(focuseURL + 'watch')
    }
}, {
    label: '设置',
    submenu: [{
        label: '选择文件夹路径',
        click() {
            dialog.showOpenDialog({
                title: '选择视频文件夹',
                properties: ['openFile', 'openDirectory']
            }).then(res => {
                if(!res.filePaths[0]) return
                saveConfig({
                    dirPath: res.filePaths[0]
                })
                
                const focuse = BrowserWindow.getFocusedWindow()
                focuse.send('setVideoFile')
            }).catch(err => {
                console.log(err)
            })
        }
    }, {
        label: '清空视频信息',
        click() {
            resetData()
            
            const focuse = BrowserWindow.getFocusedWindow()
            focuse.send('resetFile')
        }
    }, {
        label: '打开调试窗口',
        accelerator: 'f12',
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
    }, {
        label: '资助作者',
        click() {
            const focuse = BrowserWindow.getFocusedWindow()
            focuse.send('showSponsor')
        }
    }]
}]

function findContent(url) {
    const allWebContents = webContents.getAllWebContents()
    for (const item of allWebContents) {
    //   console.log(item.getURL())
    }
    const content = allWebContents.find(x => {
      const contentURL = x.getURL()
      if(!contentURL) return false
      return new URL(x.getURL()).hash === '#/' + url
    })
    return content
  }

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)