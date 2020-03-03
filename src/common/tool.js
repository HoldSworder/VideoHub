function getVideoBase64 ({url, width, height}) {
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
  })
}

function getVideoDuration(url) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.setAttribute('crossOrigin', 'anonymous')
    video.setAttribute('src', url)
    video.addEventListener('loadeddata', function() {
      const duration = video.duration
      // console.log(duration)
      const data = transTime(duration)
      resolve(data) 
    })
  })
}

function transTime(time) {
  console.log(time)
  let hour = String(parseInt((time) / 3600))
  let minute = String(parseInt((time % 3600) / 60))
  let second = String(Math.ceil(time % 60))
  hour = hour.length > 1 ? hour : 0
  minute = minute.length > 1 ? minute : 0 + minute
  second = second.length > 1 ? second : 0 + second
  return `${hour == 0 ? '' : hour + ':'}${minute == 0 ? '' : minute + ':'}${second}`
}

export {getVideoBase64, getVideoDuration}