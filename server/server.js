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
  socket.on('player-ready', () => {
    if (players.size < 2) {
      players.add(socket.id)
      if (players.size === 2) {
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
  })
  socket.on('disconnect', () => {
    console.log('[disconnect]', players)
    updateState()
  })
  socket.on('click', data => {
    if (players.has(socket.id)) {
      const action = boardController.handleTileClicked(data.tileIndex, data.corner)
      updateState()
      io.sockets.emit('action', action)

      const stoppedAction = new Promise((resolve, reject) => {
        setInterval(() => {
          resolve('should be finished moving')
        }, action.time)
      })

      stoppedAction.then(res => {
        console.log(res)
        const action = boardController.handleFinishedMoving()
        updateState()
        io.sockets.emit('action', action)
      })
    }
  })
})

const updateState = () => {
  io.sockets.emit('state', {
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
