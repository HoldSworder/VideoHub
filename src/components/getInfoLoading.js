import { notification } from 'antd'
  
function fixVideoLoading(type) {
  const key = 'fixVideo'
  if(type === 'open') {
    notification['info']({
      message: '获取视频信息中...',
      description: '获取视频时长及缩略图片',
      key,
      duration: null,
      placement: "bottomRight"
    })
  }else {
    notification['success']({
      message: '获取视频信息成功',
      key,
      duration: 3,
      placement: "bottomRight"
    })
  }
}

function getVideoLoading(type) {
  const key = 'fixVideo'
  if(type === 'open') {
    notification['info']({
      message: '获取视频文件中...',
      description: '获取视频内容',
      key,
      duration: null,
      placement: "bottomRight"
    })
  }else {
    notification['success']({
      message: '获取视频成功',
      key,
      duration: 3,
      placement: "bottomRight"
    })
  }
}

function getWallpaper() {
  notification.open({
    message: '获取视频文件中...',
    description:  '检测到Wallpaper文件夹，获取文件中......',
  })
}

export { fixVideoLoading, getVideoLoading, getWallpaper }