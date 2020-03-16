const defaultState = {
  watchList: [],
  filePath: ''
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'add_watch':
      let newState = JSON.parse(JSON.stringify(state))
      newState.watchList.push(action.val)
      return newState
    case 'change_filePath':
      return action.val
      
  }

  return state
}