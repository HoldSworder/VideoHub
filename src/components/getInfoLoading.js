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

export default fixVideoLoading