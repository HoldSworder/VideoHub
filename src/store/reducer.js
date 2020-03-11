const defaultState = {
  watchList: ['111']
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'add_watch':
      let newState = JSON.parse(JSON.stringify(state))
      newState.watchList.push(action.val)
      return newState
  }

  return state
}