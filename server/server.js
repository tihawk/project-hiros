const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const server = http.Server(app)
const io = socketIO(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-clientid',
      'Access-Control-Allow-Origin': req.headers.origin, // or the specific origin you want to give access to,
      'Access-Control-Allow-Credentials': true
    }
    res.writeHead(200, headers)
    res.end()
  }
})

const ActionController = require('./battlefieldBoard/ActionController')

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log('Starting server on port', PORT)
})

const players = new Set([])
const actionController = new ActionController()
io.on('connection', (socket) => {
  if (players.size >= 2) {
    sendStateTo(socket)
  }
  socket.on('player-ready', () => {
    if (players.size < 2) {
      players.add(socket.handshake.headers['x-clientid'])
      if (players.size === 2) {
        console.log('populating grid')
        actionController.resetAll()
        actionController.initBattlefield(players)
      }
    }
    updateState()
    console.log(players)
  })
  socket.on('player-disconnect', () => {
    console.log('user disconnected')
    players.delete(socket.handshake.headers['x-clientid'])
    socket.emit('state', {
      loading: {
        isLoading: true,
        message: 'ClickReady'
      }
    })
  })
  socket.on('disconnect', (reason) => {
    console.log('[disconnect]', players, socket.id, socket.handshake.headers['x-clientid'], reason)
  })
  socket.on('click', data => {
    if (playerExistsAndIsHisTurn(socket)) {
      const actions = actionController.handleTileClicked(data.tileIndex, data.corner)
      if (actions.length > 0) {
        io.sockets.emit('actions', actions)
        actionController.endTurn()
      }
    }
  })
  socket.on('completed-actions', () => {
    sendStateTo(socket)
  })
  socket.on('wait', () => {
    if (playerExistsAndIsHisTurn(socket)) {
      if (actionController.queue.currentPhase !== 'wait') {
        actionController.handleWaiting()
        updateState()
      } else {
        console.log('[socket.on.wait] tried to wait during a wait phase')
      }
    }
  })
  socket.on('defend', () => {
    if (playerExistsAndIsHisTurn(socket)) {
      actionController.handleDefending()
      updateState()
    }
  })
})

const playerExistsAndIsHisTurn = (socket) => {
  return players.has(socket.handshake.headers['x-clientid']) && actionController.turn.player === socket.handshake.headers['x-clientid']
}

const updateState = () => {
  console.log('updating state')
  io.sockets.emit('state', {
    players: actionController.players,
    board: actionController.board,
    turn: actionController.turn,
    loading: actionController.loading,
    actions: actionController.actions,
    phase: actionController.queue.currentPhase
  })
}

const sendStateTo = (socket) => {
  socket.emit('state', {
    players: actionController.players,
    board: actionController.board,
    turn: actionController.turn,
    loading: actionController.loading,
    actions: actionController.actions,
    phase: actionController.queue.currentPhase
  })
}
