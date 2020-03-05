import {transTime} from '@/common/tool.js'

const fsp = window.require('fs').promises
const path = window.require('path')

function getVideoBase64 ({item, width = 240, height = 240}) {
  const url = item.file
  return new Promise((resolve, reject) => {
    let video = document.createElement('video')
    video.setAttribute('crossOrigin', 'anonymous')
    video.setAttribute('src', url)
    video.setAttribute('width', width)
    video.setAttribute('height', height)
    video.setAttribute("preload", 'auto')
    video.addEventListener('loadeddata', function() {
      let canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(video, 0, 0, width, height)
      const data = canvas.toDataURL('image/jpeg')
      resolve(data)
    })
    video.addEventListener('error', function() {
      reject(path.basename(url) + 'can not play')
    })
  }).catch(err => {
    item.duration = '格式错误 无法播放'
    item.canplay = false
    console.log(err)
  })
}

async function getVideoDuration({item, width = 240, height = 240}) {
  const url = item.file
  if(!fsp.access(url)) return
  if(url.includes('#')) return
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.setAttribute('crossOrigin', 'anonymous')
    video.setAttribute('src', url)
    if(item.img === '') {
      video.setAttribute('width', width)
      video.setAttribute('height', height)
      video.setAttribute("preload", 'auto')
      video.addEventListener('loadeddata', function() {
        let canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(video, 0, 0, width, height)
        const data = canvas.toDataURL('image/jpeg')
        item.img = data

        const duration = transTime(video.duration)
        item.duration = duration
        item.canplay = true
        resolve()
      })
    }else {
      video.addEventListener('durationchange', function() {
          const duration = video.duration
          const data = transTime(duration)
          item.duration = data
          item.canplay = true
          console.log(data)
          resolve() 
      })
    }
    video.addEventListener('error', function() {
      reject(path.basename(url) + 'can not play')
    })
  }).catch(err => {
    item.duration = '格式错误 无法播放'
    item.canplay = false
    console.log(err)
  })
}

export default getVideoDuration