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

// const players = new Set([])
// const actionController = new ActionController()

const battles = {}
io.on('connection', (socket) => {
  sendBattlesList()
  socket.on('get-battle-list', () => {
    sendBattlesList(socket)
  })
  socket.on('create-battle', (battleName, func) => {
    console.log('[create-battle]', battleName)
    if (!battles[battleName]) {
      battles[battleName] = { players: new Set([]) }
      sendBattlesList()
      func(true)
    } else {
      func(false)
    }
  })
  socket.on('join-battle', ({ battleName }, func) => {
    console.log(battleName)
    const { players } = battles[battleName]
    if (players.size === 0) battles[battleName].actionController = new ActionController()
    if (battles[battleName] && players.size < 2) {
      battles[battleName].players.add(socket.handshake.headers['x-clientid'])
      sendBattlesList(socket.broadcast)
      socket.join(battleName)
      if (players.size === 2) {
        console.log('creating game')
        const { actionController } = battles[battleName]
        actionController.resetAll()
        actionController.initBattlefield(players)
        updateState(battleName)
        console.log(players)
      }
    }
    func(battleName)
  })
  socket.on('player-disconnect', (battle, func) => {
    console.log('user disconnected')
    console.log(battle)
    socket.leave(battle)
    console.log(io.nsps['/'].adapter.rooms)
    if (battles[battle]) battles[battle].players.delete(socket.handshake.headers['x-clientid'])
    if (battles[battle] && battles[battle].players.size === 0) delete battles[battle]
    socket.emit('state', {
      loading: {
        isLoading: true,
        message: 'ClickReady'
      }
    })
    socket.in(battle).emit('state', {
      loading: {
        isLoading: true,
        message: 'WaitingForPlayers'
      }
    })
    func(true)
  })
  socket.on('disconnect', (reason) => {
    console.log('[disconnect]', socket.id, socket.handshake.headers['x-clientid'], reason)
  })
  socket.on('click', data => {
    if (playerExistsAndIsHisTurn(socket, data.battle)) {
      const { actionController } = battles[data.battle]
      const actions = actionController.handleTileClicked(data.tileIndex, data.corner)
      if (actions.length > 0) {
        io.sockets.in(data.battle).emit('actions', actions)
        actionController.endTurn()
      }
    }
  })
  socket.on('completed-actions', (battle) => {
    sendStateTo(socket, battle)
  })
  socket.on('wait', (battle) => {
    if (playerExistsAndIsHisTurn(socket, battle)) {
      const { actionController } = battles[battle]
      if (actionController.queue.currentPhase !== 'wait') {
        actionController.handleWaiting()
        updateState(battle)
      } else {
        console.log('[socket.on.wait] tried to wait during a wait phase')
      }
    }
  })
  socket.on('defend', (battle) => {
    if (playerExistsAndIsHisTurn(socket, battle)) {
      const { actionController } = battles[battle]
      actionController.handleDefending()
      updateState(battle)
    }
  })
})

const playerExistsAndIsHisTurn = (socket, battle) => {
  if (!battles[battle]) return false
  const { players } = battles[battle]
  const player = socket.handshake.headers['x-clientid']
  const { actionController } = battles[battle]
  return players && players.has(player) && actionController.turn.player === player
}

const updateState = (battle) => {
  console.log('updating state')
  const { actionController } = battles[battle]
  io.sockets.in(battle).emit('state', {
    players: actionController.players,
    board: actionController.board,
    turn: actionController.turn,
    loading: actionController.loading,
    actions: actionController.actions,
    phase: actionController.queue.currentPhase
  })
}

const sendStateTo = (socket, battle) => {
  if (!battles[battle] || !battles[battle].actionController) return
  const { actionController } = battles[battle]
  socket.emit('state', {
    players: actionController.players,
    board: actionController.board,
    turn: actionController.turn,
    loading: actionController.loading,
    actions: actionController.actions,
    phase: actionController.queue.currentPhase
  })
}

const sendBattlesList = (socket = io) => {
  const battlesCopy = { ...battles }
  const battleNames = Object.keys(battlesCopy)
  for (const battle of battleNames) {
    battlesCopy[battle] = {
      players: [...battles[battle].players]
    }
  }

  socket.emit('battles-list', {
    battles: battlesCopy
  })
}
