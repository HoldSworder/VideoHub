# eletron + react开发到部署

## 构建开发目录

使用create-react-app进行react的构建

在根目录下新建main.js文件

```js

const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')
 
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win
 
function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false  //跨域
    }
  })
 
  // 加载应用----适用于 react 开发时项目
   win.loadURL("http://localhost:3000")
 
  // 打开开发者工具
  win.webContents.openDevTools()
 
  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}
 
// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  require('./electron/menu.js') //目录文件
  createWindow()
})
 
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
 
app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})
 
// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
```

更改package.json
```js
{
  "main": "main.js",
  "scripts": {
    "electron": "electron ."
  }
}
```

使用**npm run electron**跑起服务

## 打包项目

1. 修改main.js中loadURL
    ```js

    // 加载应用----react 打包
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    }))
    ```

2. 修改webpack

    ```js
    //添加homepage属性
    "homepage": "."
    ```

3. 进行打包

        npm run build

4. 打包electron
    ```js
    // knownsec-fed目录下安装electron-packager包
    npm install electron-packager --save-dev
    // 安装electron-packager命令
    npm install electron-packager -g
    ```
        electron-packager <location of project> <name of project> <platform> <architecture> <electron version> <optional options>

    * location of project: 项目的本地地址，此处我这边是 ~/knownsec-fed
    * location of project: 项目名称，此处是 knownsec-fed
    * platform: 打包成的平台
    * architecture: 使用 x86 还是 x64 还是两个架构都用
    * electron version: electron 的版本

    ```js
    //配置package.json
    "packager": "electron-packager ./ videoHub --all --out ./outputs"

    npm run packager
    ```

    第一次使用npm run packager时会下载打包所需的文件会非常慢 使用淘宝镜像可解决
    ```js
    npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
    //但是下载时会指向 http://npm.taobao.org/mirrors/electron/v8.0.2 淘宝实际地址并没有v
    //所以还需要执行
    npm config set electron_custom_dir "8.0.2"
    ```
   


## 开发过程

1. 使用shell模块以默认方式打开文件

    ```js
    const shell = require('shell)
    shell.openItem(fullPath)
    ```

2. 使用remote在组件中引入electron

    除了main.js为主进程以外 其他页面均为渲染进程 需要使用remote模块调用主进程的方法
    ```js
    const {shell} = require('electron')
    import {shell} from 'electron'
    // 都无效时 可以试试

    const {shell} = window.require('electron').remote
    ```

3. 使用react-app-rewired修改webpack配置

    在没有改动初始文件的时候 可以使用**npm run eject**来得到webpack.config.js文件

    ```js
    //npm i react-app-rewired -S-D
    //修改package.json
    "start": "react-app-rewired start"

    //根目录新建config-overrides.js 配置webpack
    const path = require('path')

    function resolve (dir) {
      return path.join(__dirname, '.', dir)
    }

    module.exports = function override(config, env) {

      config.resolve.alias = {
        "@": resolve('src')
      }

      return config;
    }
    ```

4. 获取当前窗口

    ```js
    const focuseWin = webContents.getFocusedWebContents()
    focuseWin.webContents.openDevTools()
    ```

5. 打开调试界面
    ```js
    const focuseWin = webContents.getFocusedWebContents()
    focuseWin.webContents.openDevTools()
    ```

6. 通信
    ```js
    //主进程中只能进行监听 并返回事件
    ipcMain.on('xxx', function(event, arg) {
      event.sender.send('aaa', list)
    })
    //也可以利用webcontent主动推送事件
    const focuse = BrowserWindow.getFocusedWindow()
    focuse.send('xxx')

    //渲染进程中 监听事件
    ipcRenderer.on('xxx', function(event, arg) {

    })

    ipcRenderer.removeAllListener('xxx')

    //渲染进程主动发送事件
    ipcRenderer.send('xxx')
    ```


## 遇到的坑

1. 视频名中带有'#'的视频会提示无法找到 只能跳过处理

2. react中的重复渲染问题

  在react中使用useState定义复杂对象时（对象、数组），改变state会导致state重新指向新的对象，导致页面依赖的dom重新刷新。

  使用immer、useImmer替代useState可以解决这个问题

3. react-electron中ipcRenderer重复callback的问题

  放在useEffact中 只运行一次即可

4. 跨渲染进程无法共用redux 

  可以通过跨进程通信方法解决
