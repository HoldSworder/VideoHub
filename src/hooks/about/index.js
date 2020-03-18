import React, { useEffect } from 'react'
import { Modal, Descriptions } from 'antd'

const ipc = window.require('electron').ipcRenderer

const useAbout = () => {
  useEffect(() => {
    ipc.on('showAbout', function(event, arg) {
      showAbout()
    })
    return () => {
      ipc.removeAllListener('showAbout')
    }
  }, [])

  function showAbout() {
    Modal.info({
      icon: '',
      content: (
        <Descriptions 
          column={1}
          title="关于" >
          <Descriptions.Item key='author' label="作者">Qzr</Descriptions.Item>
          <Descriptions.Item key='github' label="项目地址">https://github.com/HoldSworder/VideoHub</Descriptions.Item>
          <Descriptions.Item key='content'>欢迎大家来github提意见</Descriptions.Item>
        </Descriptions>
      )
    })
  }

  return showAbout
}

export default useAbout
