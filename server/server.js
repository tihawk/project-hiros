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
  socket.on('click', data => {
    boardController.handleTileClicked(data)
  })
  socket.on('finished-moving', () => {
    boardController.handleFinishedMoving()
  })
})
setInterval(() => {
  io.sockets.emit('state', {
    board: boardController.board,
    indexOfSelectedTileWithCreature: boardController.indexOfSelectedTileWithCreature,
    isCreatureSelected: boardController.isCreatureSelected
  })
}, 1000 / 30)

// let lastUpdateTime = new Date().getTime()
// setInterval(() => {
//   const currentTime = new Date().getTime()
//   const timeDiff = currentTime - lastUpdateTime
//   io.sockets.emit('message', `hi from server socket ${timeDiff}`)
//   lastUpdateTime = currentTime
// }, 1000)
