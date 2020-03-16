import { isJSON } from '@/common/tool.js'

const fs = window.require('fs')
const fsp = window.require('fs').promises
const path = window.require('path')
const dataPath = path.resolve('./data/data.json')


const layout = {
  videoFiles: [],
  otherFiles: [],
  option: {}
}

async function saveData(newData, type) {
  let data = {...layout}

  switch(type) {
    case 'data':
      data.videoFiles = newData.filter(x => {
        return x.canplay === 1
      })
      data.otherFiles = newData.filter(x => {
        return x.canplay === 0 || x.canplay === 2
      })
      break
    case 'option': 
      data.option = newData
  }
  const str = JSON.stringify(data)
  try {
     fsp.writeFile(dataPath, str, 'utf-8')
  } catch (error) {
    throw error
  }
}

function readData() {
  let data
  try {
    data = fs.readFileSync(dataPath, 'utf-8')
    if(!isJSON(data)) fs.writeFileSync(dataPath, JSON.stringify(layout), 'utf-8')
  }catch (err) {
    fsp.writeFile(dataPath, JSON.stringify(layout), 'utf-8')
    data = JSON.stringify(layout)
    console.log(err) 
  }
  return JSON.parse(data)
}

export { saveData, readData }