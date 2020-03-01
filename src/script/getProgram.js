import basePath from '../common/basePath.js'
const path = window.require('path')
const fse = window.require('fs-extra')
const movieType = ['mp4', 'avi', 'rmvb', 'flv', 'wmv', 'mov', 'mtv', 'amv', 'dat']
const imgType = ['jpg', 'png']
const resArr = []

async function getProgram(filePath = basePath, res = resArr) {
  const fileArr = await fse.readdir(filePath)
  const fileObj = {}

  for (const item of fileArr) {
    const childPath = path.join(filePath, item)
    const stats = await fse.stat(childPath)
    if(stats.isDirectory()) getProgram(childPath)
    if(stats.isFile()) {
      const extname = path.extname(item)
      // if(fixType(movieType).includes(extname)) {
        //   fileObj.file = childPath
        //   res.push(fileObj)
        // }else if(fixType(imgType).includes(extname)) {
          //   fileObj.img = childPath
          // }
      
      if(extname == '.json' && item == 'project.json') {
        const content = JSON.parse(await fse.readFile(childPath))
        if(content.type != 'video') return
        console.log(item)
        res.push({
          img: path.join(filePath ,content.preview),
          file: path.join(filePath ,content.file),
          title: content.title
        })
      }

    } 
  }
  // console.log(res)
  return res
}

function fixType(type) {
  return type.map(x => {return "." + x})
}

export default getProgram