import { isJSON } from '@/common/tool.js'

const fs = window.require('fs')
const fsp = window.require('fs').promises
const path = window.require('path')
const dataPath = path.resolve('./data/data.json')

async function saveData(newData) {
  debugger
  let data = await readData()
  const newArr = [...data, ...newData]
  console.log(newArr)
  const str = JSON.stringify(newArr)
  console.log(str)
  try {
    // debugger
     fsp.writeFile(dataPath, str, 'utf-8')
    //  fs.writeFile(dataPath, str, res => {
    //    console.log(res)
    //  })
  } catch (error) {
    // debugger
    throw error
  }
}

function readData() {
  // debugger
  let data
  try {
    data = fs.readFileSync(dataPath, 'utf-8')
    if(!isJSON(data)) fs.writeFileSync(dataPath, JSON.stringify([]), 'utf-8')
  }catch (err) {
    fsp.writeFile(dataPath, JSON.stringify([]), 'utf-8')
    data = '[]'
    console.log(err) 
  }
  return JSON.parse(data)
}

export { saveData, readData }