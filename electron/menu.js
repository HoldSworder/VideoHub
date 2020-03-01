const { Menu } = require('electron')

const template = [{
    label: 'test',
    submenu: [{
        label: 'test1'
    }]
}, {
    label: 'test2',
    submenu: [{
      label: 'test22'
    }]
}]

const m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)