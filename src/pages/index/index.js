import React, { useEffect, useState } from 'react'
import getFiles from '../../script/getProgram'
import './index.css'
import { Card } from 'antd';

const {shell} = window.require('electron').remote
const { Meta } = Card;


function Index() {
  const [fileArr, setFiles] = useState([])

  useEffect(() => {
    (async () => {
      const files = await getFiles()
      console.log(files)
      setFiles(files)
    })()
  }, [])

  function playVideo(info) {
    console.log(info)
    shell.openItem(info.file)
  }

  return (
    <div className="container">
      {
        fileArr.map((item, index) => {
          return (
            <Card 
              className="card"
              style={{ width: 240 }}
              cover={<img alt={item.title} src={item.img} />}
              key={index}
              onClick={playVideo.bind(this, item)}> 
              <Meta title={item.title} ></Meta>
            </Card>
          )
        })
      }
    </div>
  )
}

export default Index
