import React, { useEffect, useState } from 'react'
import getFiles from '@/script/getProgram'
import { Card, Input } from 'antd';
import delProgram from '@/script/delProgram'

import './index.css'

const {remote} = window.require('electron')
const {shell, Menu} = remote 
const { Meta } = Card


function Index() {
  const [fileArr, setFiles] = useState([])
  const [showArr, setShow]  = useState([])

  useEffect(() => {
    (async () => {
      const files = await getFiles()
      console.log(files)
      setFiles(files)
      setShow(files)
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

  return (
    <div className="container">
      <Input 
        placeholder="输入关键字进行搜索"
        onChange={searchVideo}
        style={{ width: 200 }} />
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
