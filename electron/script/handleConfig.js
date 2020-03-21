const { dataPath, configPath } = require('./dataPath.js')
const { configLayout, dataLayout } = require('./layout.js')


const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')



function saveConfig(newData) {
  const oldData = readConfig()
  let data = {...oldData, ...newData}

  const str = JSON.stringify(data)
  try {
     fsp.writeFile(configPath, str, 'utf-8')
  } catch (error) {
    try {
      fs.mkdirSync(path.resolve('./data'))
      fsp.writeFile(configPath, str, 'utf-8')
    } catch(err) {
      console.log(err) 
    }
    throw error
  }
}

function readConfig() {
  let data
  try {
    data = fs.readFileSync(configPath, 'utf-8')
    if(!isJSON(data)) fs.writeFileSync(configPath, JSON.stringify(configLayout), 'utf-8')
  }catch (err) {
    fs.writeFileSync(configPath, JSON.stringify(configLayout), 'utf-8')
    data = JSON.stringify(configLayout)
    console.log(err) 
  }
  return JSON.parse(data)
}

function resetData() {
  let data = {...dataLayout}
  let config = {...configLayout}

  const str = JSON.stringify(data)
  const configStr = JSON.stringify(config)
  try {
     fs.writeFileSync(dataPath, str, 'utf-8')
     fs.writeFileSync(configPath, configStr, 'utf-8')
  } catch (error) {
    throw error
  }
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

module.exports = {saveConfig, readConfig, resetData}