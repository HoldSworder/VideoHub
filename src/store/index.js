import { createStore, combineReducers } from 'redux'
import video from './video'

const rootReducers = combineReducers({video})

const store = createStore(rootReducers)

export default store