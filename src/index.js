import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './utility/i18next/i18next'
import { Provider } from 'react-redux'
import store from './store'
// import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// import thunk from 'redux-thunk'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
// import battleReducer from './store/reducers/battle'
// import playerReducer from './store/reducers/player'

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// const rootReducer = combineReducers({
//   battle: battleReducer,
//   player: playerReducer
// })

// const store = createStore(rootReducer, composeEnhancers(
//   applyMiddleware(thunk)
// ))

const app = (
  <Provider store={store} >
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
