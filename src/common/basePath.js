import { saveConfig, readConfig } from '@/script/handleData/handleConfig.js'

const path = window.require('path')
const fs = window.require('fs')

// let BasePath = 'E:/steam/steamapps/workshop/content/431960'
function getBasePath() {
  let BasePath = readConfig().dirPath
  
  if(BasePath === '') {
    const nowPath = path.resolve('./')
    if(nowPath.includes(431960)) {
      BasePath = nowPath.slice(0, nowPath.indexOf(431960) + 6)
    }else {
      BasePath = nowPath
    }
  }
  
  try {
    fs.accessSync(path.normalize(BasePath))
  } catch (error) {
    console.log(error)
    BasePath = path.resolve('./')
  }
  
  console.log(BasePath)
  return BasePath
}

export default getBasePath