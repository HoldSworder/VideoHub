const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const configPath = path.resolve('./data/config.json')

const layout = {
  dirPath: ''
}

function saveConfig(newData) {
  const oldData = readConfig()
  let data = {...oldData, ...newData}

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
    fs.writeFileSync(configPath, JSON.stringify(layout), 'utf-8')
    data = JSON.stringify(layout)
    console.log(err) 
  }
  return JSON.parse(data)
}

function isJSON(str) {
  if (typeof str == 'string') {
      try {
          var obj=JSON.parse(str);
          if(typeof obj == 'object' && obj ){
              return true;
          }else{
              return false;
          }

      } catch(e) {
          console.log('error：'+str+'!!!'+e);
          return false;
      }
  }
  console.log('It is not a string!')
}

module.exports = {saveConfig, readConfig}