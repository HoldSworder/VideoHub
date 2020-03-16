import { isJSON } from '@/common/tool.js'

const fs = window.require('fs')
const fsp = window.require('fs').promises
const path = window.require('path')
const configPath = path.resolve('./data/config.json')

const layout = {
  dirPath: ''
}

function saveConfig(newData) {
  let data = {...layout, ...newData}

  const str = JSON.stringify(data)
  try {
     fsp.writeFile(configPath, str, 'utf-8')
  } catch (error) {
    throw error
  }
}

function readConfig() {
  let data
  try {
    data = fs.readFileSync(configPath, 'utf-8')
    if(!isJSON(data)) fs.writeFileSync(configPath, JSON.stringify(layout), 'utf-8')
  }catch (err) {
    fsp.writeFile(configPath, JSON.stringify(layout), 'utf-8')
    data = JSON.stringify(layout)
    console.log(err) 
    return layout
  }
  return JSON.parse(data)
}

export {saveConfig, readConfig}