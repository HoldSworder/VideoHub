import { saveConfig, readConfig } from '@/script/handleData/handleConfig.js'

const path = window.require('path')
const fs = window.require('fs')

// let BasePath = 'E:/steam/steamapps/workshop/content/431960'
let BasePath = readConfig().dirPath

if(BasePath === '') {
  const nowPath = path.resolve('./')
  if(nowPath.includes(431960)) {
    BasePath = nowPath.slice(0, nowPath.indexOf(431960) + 6)
  }
}

try {
  fs.access(BasePath)
} catch (error) {
  BasePath = path.resolve('./')
}


export default BasePath