const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const server = http.Server(app)
const io = socketIO(server)

const boardController = require('./battlefieldBoard/boardController')

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log('Starting server on port', PORT)
})

io.on('connection', (socket) => {
  socket.on('new-battle', () => {
    boardController.populateGrid()
  })
  socket.on('disconnect', () => {
    console.log('resetting')
    boardController.reset()
    boardController.populateGrid()
  })
  socket.on('click', data => {
    const action = boardController.handleTileClicked(data)
    io.sockets.emit('action', action)

    const stoppedAction = new Promise((resolve, reject) => {
      setInterval(() => {
        resolve('should be finished moving')
      }, action.time * 0.9)
    })

    stoppedAction.then(res => {
      console.log(res)
      const stopAction = boardController.handleFinishedMoving()
      io.sockets.emit('action', stopAction)
    })
  })
  socket.on('finished-moving', () => {
    const action = boardController.handleFinishedMoving()
    io.sockets.emit('action', action)
  })
})
setInterval(() => {
  io.sockets.emit('state', {
    board: boardController.board,
    // indexOfSelectedTileWithCreature: boardController.indexOfSelectedTileWithCreature,
    isCreatureSelected: boardController.isCreatureSelected,
    indexOfTileToMoveTo: boardController.indexOfTileToMoveTo,
    turn: boardController.turn,
    loading: boardController.loading,
    // inAction: boardController.inAction
    action: boardController.action
  })
}, 1000 / 10)

// let lastUpdateTime = new Date().getTime()
// setInterval(() => {
//   const currentTime = new Date().getTime()
//   const timeDiff = currentTime - lastUpdateTime
//   io.sockets.emit('message', `hi from server socket ${timeDiff}`)
//   lastUpdateTime = currentTime
// }, 1000)
