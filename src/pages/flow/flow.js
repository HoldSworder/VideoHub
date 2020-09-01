import React, { useEffect,  useState, useRef } from 'react'
import { readData } from '@/script/handleData/handleData.js'
import { shuffle } from '@/common/tool.js'
import { useImmer } from 'use-immer'
import { Spin, Card } from 'antd';
import useAbout from '@/hooks/about'
import './flow.css'

const Flow = () => {
  const showNum = 10

  const flowBox = useRef(null)
  const fileArrRef = useRef()
  const showArrRef = useRef()
  // const nowPlayRef = useRef()
  const [fileArr, setFiles] = useState([])
  const [showArr, setShow] = useImmer([])
  const [nowPlay, setNowPlay] = useState()
  // const [playArr, setPlay] = useState([])
  // let nowPlay

  useAbout()

  useEffect(() => {
    fileArrRef.current = fileArr
  }, [fileArr])

  useEffect(() => {
    showArrRef.current = showArr
  }, [showArr])

  // useEffect(() => {
  //   nowPlayRef.current = nowPlay
  // }, [nowPlay])

  useEffect(() => {
    const data = readData()
    const files = shuffle(data.videoFiles)
    setFiles(files)
    setShow(list => {
      list.push(...files.slice(0, showNum))
      console.log(list)
    })
  }, [])

  useEffect(() => {
    loadMore()
    // videoH = document.querySelector('.videoItem').offsetHeight
  }, [])

  function setIntersection(e) {
    e.persist()
    const target = e.target
    const videoH = document.querySelector('.videoItem').offsetHeight
    const windwH = document.body.clientHeight

    const margin = (windwH - videoH - 10) / 2

    const option = {
      root: document.querySelector('#showBox'),
      threshold: [0.5],
      rootMargin: `-${margin}px 0px`
    }

    const callback = function(entries) {
      const target = entries[0].target

      if(entries[0].isIntersecting) {
        if(nowPlay) nowPlay.pause()
        setNowPlay(target)
        target.play()
        console.log(nowPlay)
      }else {
        if(target !== nowPlay) target.pause()
      }
    }
    
    const io = new IntersectionObserver(callback, option)
    
    io.observe(target)
  }


  function loadMore() {
    const io = new IntersectionObserver(function(entries) {
      if(entries[0].isIntersecting) {
        setShow(list => {
          const length = showArrRef.current.length
          const newArr = fileArrRef.current.slice(length, length + showNum)
          list.push(...newArr)
        })
      }
    }, {
      threshold: [0],
      rootMargin: `100px 0px`
    })

    io.observe(document.querySelector('#loadMore'))
  }

  return (
    <div id="flowBox" ref={flowBox}>
        <div id="videoBox">
          {
            showArr.map(item => {
              return (
                <Card key={item.id}  title={item.name}>
                  <video onCanPlay={setIntersection}
                          className='videoItem'
                          src={item.file}
                          controls></video>
                </Card>
              )
            })
          }
        </div>
        <div id="loadMore">
          <Spin tip="没有更多了" />
        </div>
    </div>
  )
}

export default Flow
