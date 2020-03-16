// import basePath from '@/common/basePath.js'
// import getVideoDuration from '@/script/fixVideo.js'
import { saveConfig, readConfig } from '@/script/handleData/handleConfig.js'
// import { genId } from '@/common/tool.js'

// const path = window.require('path')
// const fse = window.require('fs-extra')

const dataObj = readConfig()


// console.log(dataObj)

async function getConfig() {
  return dataObj
}

export { getConfig }