const defaultState = {
  videoList: [1],
  filePath: ''
}

export default (state = defaultState, action) => {
  console.log(action)
  switch (action.type) {
    case 'add_watch':
      let newState = JSON.parse(JSON.stringify(state))
      newState.videoList.push(action.val)
      return newState
    case 'change_filePath':
      console.log(state)
      return action.val
  }

  return state
}