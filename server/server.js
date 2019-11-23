const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const server = http.Server(app)
const io = socketIO(server)

const boardController = require('./battlefieldBoard/boardController')

const PORT = process.env.PORT || 5000
const SERVERTICKS = 1000 / 10

server.listen(PORT, () => {
  console.log('Starting server on port', PORT)
})

const players = new Set([])
io.on('connection', (socket) => {
  socket.on('player-ready', () => {
    if (players.size < 2) {
      players.add(socket.id)
      if (players.size === 2) {
        boardController.populateGrid()
      }
    }
    console.log(players)
  })
  socket.on('player-disconnect', () => {
    if (players.has(socket.id)) {
      console.log('resetting')
      players.delete(socket.id)
      console.log(players)
      boardController.reset()
    }
  })
  socket.on('disconnect', () => {
    console.log('[disconnect]', players)
  })
  socket.on('click', data => {
    if (players.has(socket.id)) {
      const action = boardController.handleTileClicked(data)
      io.sockets.emit('action', action)

      const stoppedAction = new Promise((resolve, reject) => {
        setInterval(() => {
          resolve('should be finished moving')
        }, action.time - SERVERTICKS)
      })

      stoppedAction.then(res => {
        console.log(res)
        const action = boardController.handleFinishedMoving()
        io.sockets.emit('action', action)
      })
    }
  })
  // socket.on('finished-moving', () => {
  //   const action = boardController.handleFinishedMoving()
  //   io.sockets.emit('action', { action })
  // })
})
setInterval(() => {
  io.sockets.emit('state', {
    board: boardController.board,
    // indexOfSelectedTileWithCreature: boardController.indexOfSelectedTileWithCreature,
    // isCreatureSelected: boardController.isCreatureSelected,
    // indexOfTileToMoveTo: boardController.indexOfTileToMoveTo,
    turn: boardController.turn,
    loading: boardController.loading,
    // inAction: boardController.inAction
    action: boardController.action
  })
}, SERVERTICKS)

// let lastUpdateTime = new Date().getTime()
// setInterval(() => {
//   const currentTime = new Date().getTime()
//   const timeDiff = currentTime - lastUpdateTime
//   io.sockets.emit('message', `hi from server socket ${timeDiff}`)
//   lastUpdateTime = currentTime
// }, 1000)
