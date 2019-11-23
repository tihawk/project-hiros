const update = require('immutability-helper')

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
  this.loading = false
  this.action = {
    inAction: false,
    time: null,
    type: null,
    indexOfTileToMoveTo: null
  }
}

const oddRowHexToCube = ({ x, y }) => {
  const cubeX = x - (y - (y & 1)) / 2
  const cubeZ = y
  const cubeY = -cubeX - cubeZ
  return { x: cubeX, y: cubeY, z: cubeZ }
}

const calculateCubeDistance = ({ x, y, z }, cx, cy, cz) => {
  return (Math.abs(cx - x) + Math.abs(cy - y) + Math.abs(cz - z)) / 2
}

const calculateRange = () => {
  const { tileIndex } = this.turn.creature
  const { spd } = this.board[tileIndex].creature
  const { x, y, z } = oddRowHexToCube(this.board[tileIndex])
  const coordsCube = this.board.map(tile => oddRowHexToCube(tile))

  const range = []
  for (let i = 0; i < coordsCube.length; i++) {
    const dist = calculateCubeDistance(coordsCube[i], x, y, z)
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
exports.loading = false
exports.action = {
  inAction: false,
  time: null,
  type: null,
  indexOfTileToMoveTo: null
}

exports.populateGrid = () => {
  const grid = []
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 15; x++) {
      const gridObj = {}
      gridObj.x = x
      gridObj.y = y
      if (x === 0 || x === 14) {
        gridObj.hasCreature = true
        gridObj.creature = {
          player: x === 0 ? 1 : 2,
          type: 'swordsman',
          action: 'idle',
          spd: Math.floor(Math.random() * 22),
          oriented: x === 0 ? 1 : -1
        }
      }
      grid.push(gridObj)
    }
  }
  this.board = grid
  calculateRange()
}

exports.handleTileClicked = (tileIndex) => {
  if (this.turn.creature.range.includes(tileIndex)) {
    if (!this.board[tileIndex].hasCreature) {
      console.log('calling moving')
      handleCreatureMoved(tileIndex)
    } else if (this.board[tileIndex].hasCreature) {
      console.log('calling selecting')
      // handleCreatureSelect(tileIndex)
      handleCreatureAttack(tileIndex)
    } else {
    // placeholder condition
    }
  }
  return this.action
}

const handleCreatureAttack = (tileIndex) => {

}

const handleCreatureMoved = (indexOfTileToMoveTo) => {
  this.action.inAction = true
  this.action.indexOfTileToMoveTo = indexOfTileToMoveTo
  this.indexOfTileToMoveTo = indexOfTileToMoveTo

  if (!this.board[indexOfTileToMoveTo].hasCreature) {
    console.log('moving...')
    this.board = update(this.board, { [this.turn.creature.tileIndex]: { creature: { action: { $set: 'walk' } } } })
    const distanceX = (this.board[indexOfTileToMoveTo].x - this.board[this.turn.creature.tileIndex].x)
    const distanceY = (this.board[indexOfTileToMoveTo].y - this.board[this.turn.creature.tileIndex].y)
    const orientation = distanceX > 0 ? 1 : -1
    this.action.time = Math.sqrt(distanceX ** 2 + distanceY ** 2) * 300
    this.action.type = 'walk'
    this.board = update(this.board, { [this.turn.creature.tileIndex]: { creature: { oriented: { $set: orientation } } } })
  } else {
    // placeholder condition
  }
}

exports.handleFinishedMoving = () => {
  console.log('finished moving')
  if (this.action.inAction) {
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { $set: this.board[this.turn.creature.tileIndex].creature } } })
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { action: { $set: 'idle' } } } })
    this.board = update(this.board, { [this.turn.creature.tileIndex]: { hasCreature: { $set: false } } })
    this.board = update(this.board, { [this.turn.creature.tileIndex]: { creature: { $set: undefined } } })
    this.turn.creature.tileIndex = this.indexOfTileToMoveTo
    calculateRange()
    this.action.indexOfTileToMoveTo = null
    this.indexOfTileToMoveTo = null
    this.action.inAction = false
  }
  return this.action
}
