import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import battleReducer from './reducers/battle'
import playerReducer from './reducers/player'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
  battle: battleReducer,
  player: playerReducer
})

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
))

export default store
