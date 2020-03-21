import React, { useEffect, useState, useRef } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import Moveable from 'react-moveable'
import { Slider, Card } from 'antd';
import { useImmer } from 'use-immer'

import useAbout from '@/hooks/about'

import './watch.css'


const ipc = window.require('electron').ipcRenderer

function Watch(props) {
  const [watchList, setWatchList] = useImmer([])
  const [playerHeight, setPlayerHeight] = useState(300)

  const playBox = useRef(null)

  const showAbout = useAbout()

  useEffect(() => {
    ipc.on('watch', function(event, arg) {
      const newList = setWatch(arg)
      console.log(newList)
      if(newList) {
        setWatchList(list => {
          list.push(newList)
        })
      }
    })

    return () => {
      ipc.removeAllListener('watch')
    }
  }, [])

  
  function setWatch(info) {
    const hasInfo = watchList.find(x => {
      return x.id === info.id
    })

    if(!hasInfo) return info
    return false
  }

  function changeHeight(val) {
    console.log(val)
    setPlayerHeight(10 * val)
  }

  function delVideo(id) {
    setWatchList(state => (
      state.filter(x => {
        return x.id !== id
      })
    ))
  }

  return (
    <>
      <Slider defaultValue={playerHeight / 10} onChange={changeHeight} />
      <div className="playBox" ref={playBox}>
        {
          watchList.map(item => {
            return (
              <Card className='videoCard' key={item.id} title={item.name} data-i={item.id} extra={<a onClick={delVideo.bind(this, item.id)}><CloseOutlined style={{color: "red"}} /></a>}>
                <video  className="player"
                        style={{height: playerHeight + 'px'}}
                        src={item.file}
                        controls></video>
              </Card>                      
            )
          })
        }
      </div>
    </>
  )
}



const stateToProps = state => {
  return {
    watchList: state.watchList
  }
}

const dispatchToProps = dispatch => {
  return {
    subWatch(info) {
      let action = {
        type: 'sub_watch',
        val: info
      }
      dispatch(action)
    },
    addWatch(info) {
      let action = {
        type: 'add_watch',
        val: info
      }
      dispatch(action)
      window.opener.postMessage(info)
    }
  }
}

export default connect(stateToProps, dispatchToProps)(Watch)
