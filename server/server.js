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
const actions = new ActionController()
io.on('connection', (socket) => {
  if (players.size >= 2) {
    sendStateTo(socket)
  }
  socket.on('player-ready', () => {
    if (players.size < 2) {
      players.add(socket.handshake.headers['x-clientid'])
      if (players.size === 2) {
        console.log('populating grid')
        actions.resetAll()
        actions.initBattlefield(players)
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
      const action = actions.handleTileClicked(data.tileIndex, data.corner)
      updateState()
      io.sockets.emit('action', action)

      if (action.type === 'walk') {
        movingAndMaybeAttacking(action.time)
      } else if (String(action.type).startsWith('attack-')) {
        attacking()
      }
    }
  })
  socket.on('defend', () => {
    if (playerExistsAndIsHisTurn(socket)) {
      actions.handleDefending()
      updateState()
    }
  })
})

const playerExistsAndIsHisTurn = (socket) => {
  return players.has(socket.handshake.headers['x-clientid']) && actions.turn.player === socket.handshake.headers['x-clientid']
}

const movingAndMaybeAttacking = (time) => {
  const finishedMoving = new Promise((resolve, reject) => {
    setInterval(() => {
      resolve('should be finished moving')
    }, time)
  })

  finishedMoving
    .then(res => {
      console.log(res)
      const action = actions.handleFinishedMoving()

      if (String(action.type).startsWith('attack-')) {
        attacking()
      } else {
        actions.endTurn()
        updateState()
        io.sockets.emit('action', action)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const attacking = () => {
  const action = actions.performTheAttack()
  updateState()
  io.sockets.emit('action', action)

  const finishedAttacking = new Promise((resolve, reject) => {
    setInterval(() => {
      resolve('enough attacking')
    }, action.time)
  })

  finishedAttacking.then(res => {
    console.log(res)
    const action = actions.handleCreatureAttacked()
    updateState()
    io.sockets.emit('action', action)

    const finishedBeingAttacked = new Promise((resolve, reject) => {
      setInterval(() => {
        resolve('enough of being attacked')
      }, action.time)
    })

    finishedBeingAttacked.then(res => {
      console.log(res)
      const action = actions.finishBeingAttacked()
      actions.endTurn()
      updateState()
      io.sockets.emit('action', action)
    })
      .catch(err => {
        console.log(err)
      })
  })
    .catch(err => {
      console.log(err)
    })
}

const updateState = () => {
  console.log('updating state')
  io.sockets.emit('state', {
    players: actions.players,
    board: actions.board,
    turn: actions.turn,
    loading: actions.loading,
    action: actions.action
  })
}

const sendStateTo = (socket) => {
  socket.emit('state', {
    players: actions.players,
    board: actions.board,
    turn: actions.turn,
    loading: actions.loading,
    action: actions.action
  })
}
