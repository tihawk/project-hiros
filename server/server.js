const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const server = http.Server(app)
const io = socketIO(server)

const boardController = require('./battlefieldBoard/boardController')

const PORT = process.env.PORT || 5000
// const SERVERTICKS = 1000 / 10

server.listen(PORT, () => {
  console.log('Starting server on port', PORT)
})

const players = new Set([])
io.on('connection', (socket) => {
  if (players.size >= 2) {
    sendStateTo(socket)
  }
  socket.on('player-ready', () => {
    if (players.size < 2) {
      players.add(socket.id)
      if (players.size === 2) {
        console.log('populating grid')
        boardController.populateGrid()
      }
    }
    updateState()
    console.log(players)
  })
  socket.on('player-disconnect', () => {
    if (players.has(socket.id)) {
      console.log('user disconnected')
      boardController.reset()
      boardController.setLoading('WaitingForPlayers')
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
    updateState()
    socket.emit('state', {
      loading: {
        isLoading: true,
        message: 'ClickReady'
      }
    })
  })
  socket.on('click', data => {
    if (players.has(socket.id)) {
      const action = boardController.handleTileClicked(data.tileIndex, data.corner)
      updateState()
      io.sockets.emit('action', action)

      if (action.type === 'walk') {
        const finishedMoving = new Promise((resolve, reject) => {
          setInterval(() => {
            resolve('should be finished moving')
          }, action.time)
        })

        finishedMoving.then(res => {
          console.log(res)
          const action = boardController.handleFinishedMoving()

          if (action.type === 'attack-w-e') {
            const action = boardController.handleFinishedAttacking()
            updateState()
            io.sockets.emit('action', action)

            const finishedAttacking = new Promise((resolve, reject) => {
              setInterval(() => {
                resolve('enough attacking')
              }, action.time)
            })

            finishedAttacking.then(res => {
              console.log(res)
              const action = boardController.returnCreatureToIdle()
              updateState()
              io.sockets.emit('action', action)
            })
          } else {
            updateState()
            io.sockets.emit('action', action)
          }
        })
      }
    }
  })
})

const updateState = () => {
  console.log('updating state')
  io.sockets.emit('state', {
    board: boardController.board,
    turn: boardController.turn,
    loading: boardController.loading,
    action: boardController.action
  })
}

const sendStateTo = (socket) => {
  socket.emit('state', {
    board: boardController.board,
    turn: boardController.turn,
    loading: boardController.loading,
    action: boardController.action
  })
}

// setInterval(() => {
//   io.sockets.emit('state', {
//     board: boardController.board,
//     // indexOfSelectedTileWithCreature: boardController.indexOfSelectedTileWithCreature,
//     // isCreatureSelected: boardController.isCreatureSelected,
//     // indexOfTileToMoveTo: boardController.indexOfTileToMoveTo,
//     turn: boardController.turn,
//     loading: boardController.loading,
//     // inAction: boardController.inAction
//     action: boardController.action
//   })
// }, SERVERTICKS)
