import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Moveable from 'react-moveable'
import { Slider } from 'antd';
import { useImmer } from 'use-immer'

import './watch.css'


const ipc = window.require('electron').ipcRenderer

function Watch(props) {
  const [watchList, setWatchList] = useImmer([])
  const [playerHeight, setPlayerHeight] = useState(300)

  useEffect(() => {
    ipc.on('watch', function(event, arg) {
      console.log(event)
      console.log('set')
      const newList = setWatch(arg)
      console.log(newList)
      if(newList) {
        setWatchList(list => {
          list.push(newList)
        })
      }
    })
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

  return (
    <>
      <Slider defaultValue={playerHeight / 10} onChange={changeHeight} />
    <div className="playBox">
      {
        watchList.map(item => {
          return (
            <div key={item.id}>
              <video  className="player"
                      style={{height: playerHeight + 'px'}}
                      src={item.file}
                      controls></video>
            </div>                      
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
