import getBasePath from '@/common/basePath.js'
import getVideoDuration from '@/script/fixVideo.js'
import { saveData, readData } from '@/script/handleData/handleData.js'
import { genId } from '@/common/tool.js'

const path = window.require('path')
const fse = window.require('fs-extra')

const videoType = ['mp4', 'avi', 'rmvb', 'flv', 'wmv', 'mov', 'mtv', 'amv', 'mkv']
const videoFix = fixType(videoType)

// const dataObj = readData()
// let resArr = [...dataObj.videoFiles, ...dataObj.otherFiles]
// let option = dataObj.option

let videoNumber = 0
let wallpaperNumber = 0

/**
 * 测试文件路径是否存在
 * @param {*} res 
 */
function checkFiles() {
  const dataObj = readData()
  let resArr = [...dataObj.videoFiles, ...dataObj.otherFiles]

  resArr.forEach(async(x, index, arr) => {
    try {
      await fse.access(x.file)
    } catch (error) {
      arr.splice(index, 1)
      // console.log(error)
    }
  })
  return resArr
}

async function getAllVideo(filePath, res) {

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

async function wallpaperVideo({res, filePath, childPath, stats}) {
  const content = JSON.parse(await fse.readFile(childPath))
  const type = String(content.type).toLowerCase()
  if(type !== 'video') {
    res.push({
      img: path.join(filePath, content.preview),
      file: path.join(filePath, content.file || ''),
      id: genId(),
      create: stats.birthtimeMs,
      title: content.title,
      menu: filePath,
      name: content.title,
      canplay: 2,
      duration: '非视频文件格式',
      stats: {...stats}
    })
    return
  }

  const file = path.join(filePath ,content.file)

  //测试描述文件地址是否存在
  try {
    await fse.access(file)
  } catch (error) {
    // console.log('文件描述地址错误', error)
    return
  }

  //json描述文件非视频文件
  if(!videoFix.includes(path.extname(file).toLowerCase())) {
    console.log(content.title, '格式错误')
    res.push({
      name: content.title,
      img: path.join(filePath, content.preview),
      file: path.join(filePath, content.file),
      title: content.title,
      menu: filePath,
      id: genId(),
      create: stats.birthtimeMs,
      stats: {...stats},
      canplay: 2,
      duration: '格式错误 无法播放'
    })
    return
  }

  const target = res.find(x => {
    return x.file === file
  })
  
  if(target) {
    target.img = path.join(filePath ,content.preview)
    target.title = content.title

    target.name = content.title
    target.create = stats.birthtimeMs
    target.wallpaper = true
  }else {
    res.push({
      name: content.title,
      img: path.join(filePath, content.preview),
      file: path.join(filePath, content.file),
      title: content.title,
      menu: filePath,
      id: genId(),
      create: stats.birthtimeMs,
      stats: {...stats}
    })
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
      id: genId(),
      menu: filePath,
      title: baseName,
      img: '',
      create: stats.birthtimeMs,
      stats: {...stats}
    })
  }

  videoNumber ++
}

function fixType(type) {
  return type.map(x => {return "." + x})
}

async function fixVideoInfo(data) {
  for (const item of data) {
    if(item.duration) continue
    await getVideoDuration({item})
  }
  // const durationLimit = new PromiseLimit(10, getVideoDuration)
  // const tets = await durationLimit.start(data)
  saveData(data, 'data')
  return data
}

async function getFiles() {
  const checked = checkFiles()
  const filePath = getBasePath()
  const data = await getAllVideo(filePath, checked)
  
  console.log('所有视频的数量为', videoNumber)
  console.log('wallpaper视频的数量为', wallpaperNumber)
  console.log(data)
  return data
}

export { getFiles, fixVideoInfo }