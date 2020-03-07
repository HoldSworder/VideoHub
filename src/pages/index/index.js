import React, { useEffect, useState } from 'react'
import { getFiles, fixVideoInfo, saveVideoData } from '@/script/getProgram'
import { Card, Input, Select, notification, Modal } from 'antd'
import delProgram from '@/script/delProgram'
import sort from '@/script/sort.js'


import './index.css'

const InputGroup = Input.Group;
const {remote} = window.require('electron')
const {shell, Menu} = remote 
const { Meta } = Card
const { Option } = Select


function Index() {
  const [fileArr, setFiles] = useState([])
  const [showArr, setShow]  = useState([])

  useEffect(() => {
    (async () => {
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
    })()
  }, [])

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
    }]

    const m = Menu.buildFromTemplate(rightTemplate)
    m.popup({window: remote.getCurrentWindow()})
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

export default Index
