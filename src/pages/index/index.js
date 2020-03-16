import React, { useEffect, useState } from 'react'
import { getFiles, fixVideoInfo, saveVideoData } from '@/script/getProgram'
import { getConfig } from '@/script/handleData/getConfig.js'
import { Card, Input, Select, Modal } from 'antd'
import delProgram from '@/script/delProgram'
import sort from '@/script/sort.js'
import fixVideoLoading from '@/components/getInfoLoading.js'
import { connect } from 'react-redux'
import './index.css'


const url = require('url')
const ipc = window.require('electron').ipcRenderer

const InputGroup = Input.Group;
const {remote} = window.require('electron')
const {shell, Menu, webContents} = remote 
const { Meta } = Card
const { Option } = Select


function Index(props) {
  const {watchList, addWatch} = props
  const [fileArr, setFiles] = useState([])
  const [showArr, setShow]  = useState([])

  useEffect(() => {
    (async () => {
      console.log(webContents.getAllWebContents()[0].getURL())
      await loadVideo()

    })()
  }, [])

  async function loadVideo() {
    const files = await getFiles()
    setFiles(files)
    setShow(files)

    fixVideoLoading('open')
    const fixDurationFiles = await fixVideoInfo(files)
    setFiles(fixDurationFiles)
    setShow(fixDurationFiles.filter(x => {
      return x.canplay === 1
    }))
    fixVideoLoading('close')
  }

  function playVideo(info) {
    shell.openItem(info.file)
  }

  function delVideo(info, e) {
    e.preventDefault()
    const rightTemplate = [{
      label: '删除',
      click() {
        delProgram(info.menu)
      }
    }, {
      label: '资源管理器中打开',
      click() {
        shell.showItemInFolder(info.file)
      }
    }, {
      label: '属性',
      click() {
        setInfo(info)
      }
    }, {
      label: '同屏观看',
      click() {
        let content = findContent()

        console.log('watch')
        if(!content) {
          window.open('/watch')
          setTimeout(() => {
            sendWatch()
          }, 1000)
        }else {
          sendWatch()
        }

        function sendWatch() {
          content = findContent()
          ipc.sendTo(content.id, 'watch', info)
        }
      }
    }]

    const m = Menu.buildFromTemplate(rightTemplate)
    m.popup({window: remote.getCurrentWindow()})
  }

  function findContent() {
    const allWebContents = webContents.getAllWebContents()
    const content = allWebContents.find(x => {
      const contentURL = x.getURL()
      if(!contentURL) return false
      return new URL(x.getURL()).pathname === '/watch'
    })
    return content
  }

  function searchVideo(e) {
    const value = e.target.value
    if(value === '') {
      setShow(fileArr)
      return
    }
    const filterVal = fileArr.filter(x => {
      return x.title.includes(value) || x.id === Number(value) || String(x.name).includes(value)
    })

    setShow(filterVal)
  }

  function sortFiles(value) {
    if(value === 'default') {
      setShow(fileArr)
      return
    }
    setShow(sort(value, fileArr))
  }

  

  function setInfo(info) {
    Modal.info({
      title: `${info.title}的属性`,
      content: (
        <div>
          <p>文件地址：{info.file}</p>
          <p>id：{info.id}</p>
          <p>文件夹地址：{info.menu}</p>
          <p>时长：{info.duration}</p>
        </div>
      ),
      onOk() {},
    });
  }

  return (
    <div className="container">
      <div className="header">
        <Input 
          placeholder="输入关键字进行搜索"
          onChange={searchVideo}
          style={{ width: 200 }} />

        <InputGroup
          style={{ width: 'auto' }}>
          <Select defaultValue="default"
            onChange={sortFiles}>
            <Option value="default">默认排序</Option>
            <Option value="TIME POSITIVE">日期升序</Option>
            <Option value="TIME NEGATIVE">日期降序</Option>
            <Option value="DURATION POSITIVE">时长升序</Option>
            <Option value="DURATION NEGATIVE">时长降序</Option>
            <Option value="CAN NOT PLAY">特殊文件</Option>
            <Option value="ERROR">错误文件</Option>
          </Select>
        </InputGroup>
      </div>
      <div className="videoBox">
        {
          showArr.map((item, index) => {
            return (

                <Card 
                  className="card"
                  style={{ width: 240 }}
                  cover={<img alt={item.title} src={item.img} />}
                  key={index}
                  onContextMenu={delVideo.bind(this, item)}
                  onDoubleClick={playVideo.bind(this, item)}> 
                  <Meta title={item.title} description={item.duration}></Meta>
                </Card>
            )
          })
        }
      </div>
    </div>
  )
}

// ipc.on('watch', function(event, arg) {
//   console.log(event, arg)
// })

const stateToProps = state => ({
    watchList: state.watchList,
    filePath: state.filePath
})

const dispatchToProps = dispatch => {
  return {
    addWatch(info) {
      let action = {
        type: 'add_watch',
        val: info
      }
      dispatch(action)
    },
    changeFilePath(path) {
      let action = {
        type: 'change_filePath',
        val: path
      }
      dispatch(action)
    }
  }
}

export default connect(stateToProps, dispatchToProps)(Index)
