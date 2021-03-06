import React, { useEffect, useState } from 'react'
import { getFiles, fixVideoInfo, saveVideoData } from '@/script/getProgram'
import { saveConfig } from '@/script/handleData/handleConfig.js'
import { Card, Input, Select, Modal, Button } from 'antd'
import delProgram from '@/script/delProgram'
import sort from '@/script/sort.js'
import { fixVideoLoading, getVideoLoading } from '@/components/getInfoLoading.js'
import { connect } from 'react-redux'
import './index.css'
import useAbout from '@/hooks/about'


const url = require('url')
const ipc = window.require('electron').ipcRenderer

const InputGroup = Input.Group;
const {remote} = window.require('electron')
const {shell, Menu, webContents, dialog} = remote 
const { Meta } = Card
const { Option } = Select


export default function Index(props) {
  const {watchList, addWatch} = props
  const [fileArr, setFiles] = useState([])
  const [showArr, setShow]  = useState([])
  const watchListHooks = useSelector(state => state.video.videoList)
  const filePathHooks = useSelector(state => state.video.filePath)
  const dispatch = useDispatch()

  const showAbout = useAbout()

  useEffect(() => {
    ipc.on('setVideoFile', function(event, arg) {
      setFiles([])
      setShow([])
      loadVideo()
    })

    return () => {
      ipc.removeAllListener('setVideoFile')
    }
  }, [])

  useEffect(() => {
    ipc.on('resetFile', function(event, arg) {
      setFiles([])
      setShow([])
    })

    return () => {
      ipc.removeAllListener('resetFile')
    }
  }, [])

  useEffect(() => {
    (async () => {
      await loadVideo()
    })()
  }, [])



  async function loadVideo() {
    getVideoLoading('open')
    const files = await getFiles()
    getVideoLoading('close')

    setFiles(files)
    setShow(files)

    fixVideoLoading('open')

    const fixDurationFiles = await fixVideoInfo(files)
    setFiles(fixDurationFiles)
    setShow(fixDurationFiles.filter(x => {
      return x.canplay === 1
    }))
    console.log(watchListHooks, filePathHooks)
    dispatch({
      type: 'add_watch',
      val: fixDurationFiles
    })
    dispatch({
      type: 'change_filePath',
      val: '111'
    })
    console.log(watchListHooks, filePathHooks)

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

        console.log(content)
        if(!content) {
          const focuse = webContents.getFocusedWebContents()
          const focuseURL = focuse.getURL()
          window.open(focuseURL + 'watch')
          setTimeout(() => {
            sendWatch()
          }, 1000)
        }else {
          sendWatch()
        }
        
        function sendWatch() {
          content = findContent()
          console.log(content)
          ipc.sendTo(content.id, 'watch', info)
        }
      }
    }]

    const m = Menu.buildFromTemplate(rightTemplate)
    m.popup({window: remote.getCurrentWindow()})
  }

  function findContent() {
    const allWebContents = webContents.getAllWebContents()
    for (const item of allWebContents) {
      console.log(item.getURL())
    }
    const content = allWebContents.find(x => {
      const contentURL = x.getURL()
      if(!contentURL) return false
      return new URL(x.getURL()).hash === '#/watch'
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

  function chooseFile() {
    dialog.showOpenDialog({
      title: '选择视频文件夹',
      properties: ['openFile', 'openDirectory']
    }).then(res => {
        saveConfig({
            dirPath: res.filePaths[0]
        })

        setFiles([])
        loadVideo()
    })
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
      
        <div style={{display: fileArr.length === 0 ? 'block' : 'none'}}>
          <Button type="primary" onClick={chooseFile}>选择文件夹开始</Button>
        </div>
      

      <div style={{display: fileArr.length === 0 ? 'none' : 'block'}}>
        
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
    </div>
  )
}




// const stateToProps = state => ({
//     watchList: state.watchList,
//     filePath: state.filePath
// })

// const dispatchToProps = dispatch => {
//   return {
//     addWatch(info) {
//       let action = {
//         type: 'add_watch',
//         val: info
//       }
//       dispatch(action)
//     },
//     changeFilePath(path) {
//       let action = {
//         type: 'change_filePath',
//         val: path
//       }
//       dispatch(action)
//     }
//   }
// }

// export default connect(stateToProps, dispatchToProps)(Index)
