const update = require('immutability-helper')
const helper = require('./helper')
const Swordsman = require('../Entities/Creatures/Swordsman')
const Army = require('../Entities/Army')
const Board = require('../Entities/Board')
const battlefield = new Board()
const { actionTypes, orientations } = require('../Entities/Enums').creature

class ActionController {
  constructor () {
    this.players = []
    this.battlefield = new Board()
    this.board = battlefield.getBoard()
    this.armies = []
    this.turn = {
      player: '',
      creature: {
        tileIndex: 0,
        range: []
      },
      number: 0
    }
    this.loading = {
      isLoading: true,
      message: 'WaitingForPlayers'
    }
    this.action = {
      inAction: false,
      time: null,
      type: null,
      indexOfTileToMoveTo: null
    }

    this.isToAttack = false
    this.indexOfTileToAttack = null
  }

  resetAll () {
    this.players = []
    this.battlefield = new Board()
    this.board = battlefield.getBoard()
    this.armies = []
    this.turn = {
      player: '',
      creature: {
        tileIndex: 0,
        range: []
      },
      number: 0
    }
    this.resetLoading()
    this.resetAction()

    this.isToAttack = false
    this.indexOfTileToAttack = null
  }

  addPlayer (id) {
    this.players.push(id)
  }

  setFirstTurn () {
    this.turn = {
      player: this.players[0],
      creature: {
        tileIndex: 0,
        range: []
      },
      number: 0
    }
  }

  setLoading (message) {
    this.loading = {
      isLoading: true,
      message
    }
  }

  resetLoading () {
    this.loading = {
      isLoading: false,
      message: ''
    }
  }

  setAction (inAction, type, time = null, indexOfTileToMoveTo = null) {
    this.action = {
      inAction,
      time,
      type,
      indexOfTileToMoveTo
    }
  }

  resetAction () {
    this.action = {
      inAction: false,
      time: null,
      type: null,
      indexOfTileToMoveTo: null
    }
  }

  getNeighbour (tileIndex, corner) {
    const { x, y, z } = helper.oddRowHexToCube(this.board[tileIndex])
    const resultCube = helper.cubeNeighbourFromCube(x, y, z, corner)
    return helper.cubeHexToOddRow(resultCube)
  }

  getDistanceOrientationAndDepth (tileFrom, tileTo) {
    const result = {}

    const cubeTileFrom = helper.oddRowHexToCube(tileFrom)
    const cubeTileTo = helper.oddRowHexToCube(tileTo)
    const dist = helper.calculateCubeDistance(cubeTileFrom, cubeTileTo.x, cubeTileTo.y, cubeTileTo.z)
    result.distance = dist

    const y = cubeTileTo.y - cubeTileFrom.y
    const z = cubeTileTo.z - cubeTileFrom.z
    if (y > 0 || (y === 0 && z > 0)) {
      result.orientation = orientations.left
    } else {
      result.orientation = orientations.right
    }

    if (z === 0) {
      result.depth = 'WE'
    } else if (z < 0) {
      result.depth = 'NWNE'
    } else {
      result.depth = 'SWSE'
    }

    return result
  }

  calculateRange () {
    const { tileIndex } = this.turn.creature
    const { spd } = this.board[tileIndex].creature
    const { x, y, z } = helper.oddRowHexToCube(this.board[tileIndex])
    const coordsCube = this.board.map(tile => helper.oddRowHexToCube(tile))

    const range = []
    for (let i = 0; i < coordsCube.length; i++) {
      const dist = helper.calculateCubeDistance(coordsCube[i], x, y, z)
      if (dist <= spd) range.push(i)
    }
    this.turn.creature.range = range
  }

  populateArmies () {
    for (let i = 0; i < 2; i++) {
      const army = new Army(this.players[i])
      for (let j = 0; j < 7; j++) {
        army.addMember(new Swordsman(1,
          actionTypes.idle, i === 0 ? orientations.right : orientations.left,
          this.players[i]), j)
      }
      this.armies.push(army)
    }
  }

  populateGrid () {
    this.resetLoading()
    this.populateArmies()
    battlefield.populateBoard(this.armies)
    // this.board = battlefield.getBoard()
    this.calculateRange()
  }

  handleTileClicked (tileIndex, corner) {
    if (this.turn.creature.range.includes(tileIndex)) {
      if (!this.board[tileIndex].hasCreature) {
        console.log('calling moving')
        this.handleCreatureMove(tileIndex)
      } else if (this.board[tileIndex].hasCreature) {
        if (this.board[tileIndex].creature.player !== this.turn.player) {
          console.log('calling attack')
          this.handleCreatureAttack(tileIndex, corner)
        }
      } else {
      // placeholder condition
      }
    }
    return this.action
  }

  handleCreatureAttack (tileIndex, corner) {
    this.isToAttack = true
    this.indexOfTileToAttack = tileIndex

    const neighbour = this.getNeighbour(tileIndex, corner)
    const indexOfNeighbour = this.board.findIndex(tile => tile.x === neighbour.x && tile.y === neighbour.y)
    console.log(neighbour)
    console.log(indexOfNeighbour)
    if (indexOfNeighbour !== -1) {
      this.handleCreatureMove(indexOfNeighbour)
    }
  }

  handleCreatureMove (indexOfTileToMoveTo) {
    if (!this.board[indexOfTileToMoveTo].hasCreature) {
      console.log('moving...')

      // const distanceX = (this.board[indexOfTileToMoveTo].x - this.board[this.turn.creature.tileIndex].x)
      // const distanceY = (this.board[indexOfTileToMoveTo].y - this.board[this.turn.creature.tileIndex].y)
      const { distance, orientation } = this.getDistanceOrientationAndDepth(this.board[this.turn.creature.tileIndex], this.board[indexOfTileToMoveTo])
      this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes.walk)
      this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)

      const time = distance * 300
      this.setAction(true, actionTypes.walk, time, indexOfTileToMoveTo)
    } else if (indexOfTileToMoveTo === this.turn.creature.tileIndex) {
      this.setAction(true, actionTypes.attackWE, 600)
    }
  }

  handleFinishedMoving () {
    console.log('finished moving')
    if (this.action.inAction) {
      this.board = update(this.board, { [this.action.indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
      this.board = update(this.board, { [this.action.indexOfTileToMoveTo]: { creature: { $set: this.board[this.turn.creature.tileIndex].creature } } })
      this.board[this.action.indexOfTileToMoveTo].creature.setAction(actionTypes.idle)
      this.board = update(this.board, { [this.turn.creature.tileIndex]: { hasCreature: { $set: false } } })
      this.board = update(this.board, { [this.turn.creature.tileIndex]: { creature: { $set: undefined } } })
      this.turn.creature.tileIndex = this.action.indexOfTileToMoveTo
      this.calculateRange()

      if (this.isToAttack) {
        this.isToAttack = false
        this.setAction(true, actionTypes.attackWE, 600)
      } else {
        this.resetAction()
      }
    }
    return this.action
  }

  performTheAttack () {
    this.isToAttack = false
    const { orientation, depth } = this.getDistanceOrientationAndDepth(this.board[this.turn.creature.tileIndex], this.board[this.indexOfTileToAttack])
    const attackType = 'attack' + depth
    console.log(attackType)
    this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes[attackType])
    this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)
    this.indexOfTileToAttack = null
    return this.action
  }

  returnCreatureToIdle () {
    this.resetAction()
    this.board[this.turn.creature.tileIndex].creature.resetAction()
    return this.action
  }

  endTurn () {
    // TODOONLY A PROTOTYPE
    const currentTurn = { ...this.turn }
    this.turn.number = currentTurn.number + 1
    if (currentTurn.player === this.players[0]) {
      this.turn.player = this.players[1]
    } else {
      this.turn.player = this.players[0]
    }
    this.turn.creature.tileIndex = this.board.findIndex(tile => tile.hasCreature && tile.creature.player === this.turn.player)
    this.calculateRange()
  }
}

module.exports = ActionController
