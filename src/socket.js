import socketIOClient from 'socket.io-client'
import store from './store'
import * as actions from './store/actions'

const endpoint = 'http://localhost:5000'
store.dispatch(actions.setPlayerData(String(Math.random())))
const state = store.getState()
const nickname = state.player.player
console.log(nickname)

const socket = socketIOClient(endpoint, {
  transportOptions: {
    polling: {
      extraHeaders: {
        'x-clientid': nickname
      }
    }
  }
})

export default socket
