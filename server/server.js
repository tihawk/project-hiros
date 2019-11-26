const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const server = http.Server(app)
const io = socketIO(server)

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
      players.add(socket.id)
      if (players.size === 2) {
        console.log('populating grid')
        players.forEach(value => {
          actions.addPlayer(value)
        })
        actions.setFirstTurn()
        actions.populateGrid()
      }
    }
    updateState()
    console.log(players)
  })
  socket.on('player-disconnect', () => {
    if (players.has(socket.id)) {
      console.log('user disconnected')
      actions.resetAll()
      actions.setLoading('WaitingForPlayers')
      players.delete(socket.id)
      console.log(players)
    }
    updateState()
    socket.emit('state', {
      loading: {
        isLoading: true,
        message: 'ClickReady'
      }
    })
  })
  socket.on('disconnect', () => {
    console.log('[disconnect]', players)
    actions.resetAll()
    actions.setLoading('WaitingForPlayers')
    players.delete(socket.id)
    updateState()
    socket.emit('state', {
      loading: {
        isLoading: true,
        message: 'ClickReady'
      }
    })
  })
  socket.on('click', data => {
    if (players.has(socket.id) && actions.turn.player === socket.id) {
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
})

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
