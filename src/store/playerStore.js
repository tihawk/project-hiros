import { createStore } from 'redux'
import playerReducer from './reducers/player'

const store = createStore(playerReducer)

export default store
