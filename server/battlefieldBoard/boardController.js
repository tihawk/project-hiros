const update = require('immutability-helper')
const helper = require('./helper')
const Swordsman = require('../Entities/Creatures/Swordsman')
const Army = require('../Entities/Army')
const { actionTypes, orientations } = require('../Entities/Enums').creature

exports.reset = () => {
  this.board = []
  this.turn = {
    player: 1,
    creature: {
      tileIndex: 0,
      range: []
    },
    number: 0
  }
  resetLoading()
  resetAction()
}

exports.setLoading = (message) => {
  this.loading = {
    isLoading: true,
    message
  }
}

const resetLoading = () => {
  this.loading = {
    isLoading: false,
    message: ''
  }
}

const setAction = (inAction, type, time = null, indexOfTileToMoveTo = null) => {
  this.action = {
    inAction,
    time,
    type,
    indexOfTileToMoveTo
  }
}

const resetAction = () => {
  this.action = {
    inAction: false,
    time: null,
    type: null,
    indexOfTileToMoveTo: null
  }
}

const getNeighbour = (tileIndex, corner) => {
  const { x, y, z } = helper.oddRowHexToCube(this.board[tileIndex])
  const resultCube = helper.cubeNeighbourFromCube(x, y, z, corner)
  return helper.cubeHexToOddRow(resultCube)
}

const calculateRange = () => {
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

exports.board = []
exports.turn = {
  player: 1,
  creature: {
    tileIndex: 0,
    range: []
  },
  number: 0
}
exports.loading = {
  isLoading: true,
  message: 'WaitingForPlayers'
}
exports.action = {
  inAction: false,
  time: null,
  type: null,
  indexOfTileToMoveTo: null
}

const populateArmies = () => {
  const armies = []

  for (let i = 1; i <= 2; i++) {
    const army = new Army(i)
    for (let j = 0; j < 7; j++) {
      army.addMember(new Swordsman(1,
        actionTypes.idle, i === 1 ? orientations.right : orientations.left,
        i), j)
    }
    armies.push(army)
  }
  return armies
}

exports.populateGrid = () => {
  resetLoading()
  const armies = populateArmies()

  const grid = []
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 15; x++) {
      const gridObj = {}
      gridObj.x = x
      gridObj.y = y
      if (x === 0 && y < 7) {
        if (armies[0].army[y]) {
          gridObj.hasCreature = true
          gridObj.creature = armies[0].army[y]
        }
      } else if (x === 14 && y < 7) {
        if (armies[1].army[y]) {
          gridObj.hasCreature = true
          gridObj.creature = armies[1].army[y]
        }
      }
      grid.push(gridObj)
    }
  }
  this.board = grid
  calculateRange()
}

exports.handleTileClicked = (tileIndex, corner) => {
  if (this.turn.creature.range.includes(tileIndex)) {
    if (!this.board[tileIndex].hasCreature) {
      console.log('calling moving')
      handleCreatureMove(tileIndex)
    } else if (this.board[tileIndex].hasCreature) {
      if (this.board[tileIndex].creature.player !== this.turn.player) {
        console.log('calling attack')
        // handleCreatureSelect(tileIndex)
        handleCreatureAttack(tileIndex, corner)
      }
    } else {
    // placeholder condition
    }
  }
  return this.action
}

this.indexOfTileToMoveTo = null
this.isToAttack = false
this.indexOfTileToAttack = null

const handleCreatureAttack = (tileIndex, corner) => {
  this.isToAttack = true

  const neighbour = getNeighbour(tileIndex, corner)
  const indexOfNeighbour = this.board.findIndex(tile => tile.x === neighbour.x && tile.y === neighbour.y)
  console.log(neighbour)
  console.log(indexOfNeighbour)
  if (indexOfNeighbour !== -1) {
    handleCreatureMove(indexOfNeighbour)
  }
}

const handleCreatureMove = (indexOfTileToMoveTo) => {
  if (!this.board[indexOfTileToMoveTo].hasCreature) {
    this.indexOfTileToMoveTo = indexOfTileToMoveTo
    console.log('moving...')

    const distanceX = (this.board[indexOfTileToMoveTo].x - this.board[this.turn.creature.tileIndex].x)
    const distanceY = (this.board[indexOfTileToMoveTo].y - this.board[this.turn.creature.tileIndex].y)
    const orientation = distanceX > 0 ? orientations.right : orientations.left
    this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes.walk)
    this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)

    const time = Math.sqrt(distanceX ** 2 + distanceY ** 2) * 300
    setAction(true, actionTypes.walk, time, indexOfTileToMoveTo)
  } else if (indexOfTileToMoveTo === this.turn.creature.tileIndex) {
    setAction(true, actionTypes.attackWE, 600)
  }
}

exports.handleFinishedMoving = () => {
  console.log('finished moving')
  if (this.action.inAction) {
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { $set: this.board[this.turn.creature.tileIndex].creature } } })
    this.board[this.indexOfTileToMoveTo].creature.setAction(actionTypes.idle)
    this.board = update(this.board, { [this.turn.creature.tileIndex]: { hasCreature: { $set: false } } })
    this.board = update(this.board, { [this.turn.creature.tileIndex]: { creature: { $set: undefined } } })
    this.turn.creature.tileIndex = this.indexOfTileToMoveTo
    calculateRange()

    if (this.isToAttack) {
      this.isToAttack = false
      setAction(true, actionTypes.attackWE, 600)
    } else {
      resetAction()
    }
  }
  return this.action
}

exports.handleFinishedAttacking = () => {
  this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes.attackWE)
  return this.action
}

exports.returnCreatureToIdle = () => {
  resetAction()
  this.board[this.turn.creature.tileIndex].creature.resetAction()
  return this.action
}
