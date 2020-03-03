import basePath from '@/common/basePath.js'
import { getVideoBase64, getVideoDuration } from '@/common/tool.js'

const path = window.require('path')
const fse = window.require('fs-extra')
const videoType = ['mp4', 'avi', 'rmvb', 'flv', 'wmv', 'mov', 'mtv', 'amv']
// const imgType = ['jpg', 'png']
const videoFix = fixType(videoType)
const videoArr = []
const resArr = []
let index = 0

let videoNumber = 0
let wallpaperNumber = 0

async function getAllVideo(filePath = basePath, res = resArr) {
  const fileArr = await fse.readdir(filePath)

  for (const item of fileArr) {
    const childPath = path.join(filePath, item)
    const stats = await fse.stat(childPath)
    if(stats.isDirectory()) await getAllVideo(childPath)
    if(stats.isFile()) {
      const extName = path.extname(item)
      const baseName = path.basename(item)
      
      if(videoFix.includes(extName)) {
        await video({res, filePath, childPath, baseName, stats})
      }

      if(item === 'project.json') {
        await wallpaperVideo({res, filePath, childPath, stats})
      }
    } 
  }
  

  return res
}

async function fixVideoImg(data) {
  for (const item of data) {
    if(item.img === '') {
      const filePath = item.file
      const width = 240
      const height = 240
      const base64 = await getVideoBase64({width, height, url: filePath})
      item.img = base64
    }
  }
}

async function wallpaperVideo({res, filePath, childPath, stats}) {
  const content = JSON.parse(await fse.readFile(childPath))
  const type = String(content.type).toLowerCase()
  if(type !== 'video') return
  const file = path.join(filePath ,content.file)
  const target = res.find(x => {
    return x.file === file
  })
  
  if(target) {
    target.img = path.join(filePath ,content.preview)
    target.title = content.title
  }else {
    res.push({
      name: content.title,
      img: path.join(filePath ,content.preview),
      file: path.join(filePath ,content.file),
      title: content.title,
      menu: filePath,
      id: index,
      create: stats.birthtimeMs
    })
    index ++
  }
  wallpaperNumber ++
}

async function video({res, filePath, childPath, baseName, stats}) {

  const target = res.find(x => {
    return x.file === childPath
  })

  if(!target) {
    res.push({
      name: baseName,
      file: childPath,
      id: index,
      menu: filePath,
      title: baseName,
      img: '',
      create: stats.birthtimeMs
    })
  }

  index ++
  videoNumber ++
}

function fixType(type) {
  return type.map(x => {return "." + x})
}

async function fixVideo(data) {
  for (const item of data) {
    const duration = await getVideoDuration(item.file)
    
    item.duration = duration
    console.log(item.duration)
  }
}

async function main() {
  const data = await getAllVideo()
  fixVideoImg(data)
  fixVideo(data)

  console.log('所有视频的数量为', videoNumber)
  console.log('wallpaper视频的数量为', wallpaperNumber)
  return data
}

export default main