import basePath from '@/common/basePath.js'
import getVideoDuration from '@/script/fixVideo.js'
// import PromiseLimit from '@/script/PromiseLimit.js'
import { saveData, readData } from '@/script/handleData.js'

const path = window.require('path')
const fse = window.require('fs-extra')

const videoType = ['mp4', 'avi', 'rmvb', 'flv', 'wmv', 'mov', 'mtv', 'amv']
const videoFix = fixType(videoType)
const videoArr = []
let resArr = readData()
let index = resArr.length

let videoNumber = 0
let wallpaperNumber = 0



async function getAllVideo(filePath = basePath, res = resArr) {

  const fileArr = await fse.readdir(filePath)

  for (const item of fileArr) {
    const childPath = path.join(filePath, item)
    const stats = await fse.stat(childPath)
    if(stats.isDirectory()) await getAllVideo(childPath)
    if(stats.isFile()) {
      const extName = path.extname(item).toLowerCase()
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

// async function fixVideoImg(data) {
//   const p = []
//   for (const item of data) {
//     if(item.img === '') {
//       const filePath = item.file
//       const width = 240
//       const height = 240
//       const base64 = await getVideoBase64({width, height, url: filePath})
//       p.push(base64)
//       item.img = base64
//     }
//   }
//   await Promise.allSettled(p)
// }

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

    target.name = content.title
    target.img = path.join(filePath ,content.preview)
    target.file = path.join(filePath ,content.file)
    target.title = content.title
    target.menu = filePath
    target.id = index
    target.create = stats.birthtimeMs
    target.stats = target
  }else {
    res.push({
      name: content.title,
      img: path.join(filePath ,content.preview),
      file: path.join(filePath ,content.file),
      title: content.title,
      menu: filePath,
      id: index,
      create: stats.birthtimeMs,
      stats
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
      create: stats.birthtimeMs,
      stats
    })
  }

  index ++
  videoNumber ++
}

function fixType(type) {
  return type.map(x => {return "." + x})
}

async function fixVideoDuration(data) {
  for (const item of data) {
    const func = await getVideoDuration({item})
  }
  // const durationLimit = new PromiseLimit(10, getVideoDuration)
  // const tets = await durationLimit.start(data)
  return data
}

async function getFiles() {
  const data = await getAllVideo()
  // saveData(data)
  console.log('所有视频的数量为', videoNumber)
  console.log('wallpaper视频的数量为', wallpaperNumber)
  return data
}

export { getFiles, fixVideoDuration }