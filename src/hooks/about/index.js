import React, { useEffect } from 'react'
import { Modal, Descriptions, Typography } from 'antd'
import sponsor from '@/assets/img/收钱码.jpg'


const { remote } = window.require('electron')
const { shell } = remote


const { Text } = Typography


const ipc = window.require('electron').ipcRenderer

const useAbout = () => {
  useEffect(() => {
    ipc.on('showAbout', function(event, arg) {
      showAbout()
    })
    return () => {
      ipc.removeAllListeners('showAbout')
    }
  }, [])

  useEffect(() => {
    ipc.on('showSponsor', function(event, arg) {
      showSponsor()
    })
    return () => {
      ipc.removeAllListeners('showSponsor')
    }
  })

  function showAbout() {
    Modal.info({
      icon: '',
      content: (
        <Descriptions 
          column={1}
          title="关于" >
          <Descriptions.Item key='author' label="作者">Qzr</Descriptions.Item>
          <Descriptions.Item key='github' label="项目地址"><a onClick={shell.openItem('https://github.com/HoldSworder/VideoHub')}>https://github.com/HoldSworder/VideoHub</a></Descriptions.Item>
          <Descriptions.Item key='content'>欢迎大家来github提意见</Descriptions.Item>
        </Descriptions>
      )
    })
  }

  function showSponsor() {
    Modal.info({
      icon: '',
      content: (
        <div>
          <img src={sponsor} style={{width: '100%'}}></img>
          <Text strong>你的打赏,是我更新的动力</Text>
        </div>
      )
    })
  }

  return showAbout
}

export default useAbout
