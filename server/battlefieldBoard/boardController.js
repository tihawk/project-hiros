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
  this.loading = {
    isLoading: false,
    message: ''
  }
  this.action = {
    inAction: false,
    time: null,
    type: null,
    indexOfTileToMoveTo: null
  }
}

exports.setLoading = (message) => {
  this.loading = {
    isLoading: true,
    message
  }
}

const oddRowHexToCube = ({ x, y }) => {
  const cubeX = x - (y - (y & 1)) / 2
  const cubeZ = y
  const cubeY = -cubeX - cubeZ
  return { x: cubeX, y: cubeY, z: cubeZ }
}

const cubeHexToOddRow = ({ x, z }) => {
  const oddRowX = x + (z - (z & 1)) / 2
  const oddRowY = z
  return { x: oddRowX, y: oddRowY }
}

const calculateCubeDistance = ({ x, y, z }, cx, cy, cz) => {
  return (Math.abs(cx - x) + Math.abs(cy - y) + Math.abs(cz - z)) / 2
}

const cubeNeighbourFromCube = (x, y, z, corner) => {
  switch (corner) {
    case ('w'):
      return { x: x - 1, y: y + 1, z: z }
    case ('nw'):
      return { x: x, y: y + 1, z: z - 1 }
    case ('ne'):
      return { x: x + 1, y: y, z: z - 1 }
    case ('e'):
      return { x: x + 1, y: y - 1, z: z }
    case ('se'):
      return { x: x, y: y - 1, z: z + 1 }
    case ('sw'):
      return { x: x - 1, y: y, z: z + 1 }
    default:
      return null
  }
}

const getNeighbour = (tileIndex, corner) => {
  const { x, y, z } = oddRowHexToCube(this.board[tileIndex])
  const resultCube = cubeNeighbourFromCube(x, y, z, corner)
  return cubeHexToOddRow(resultCube)
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

exports.populateGrid = () => {
  this.loading = false
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

const handleCreatureAttack = (tileIndex, corner) => {
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
    this.action.inAction = true
    this.action.indexOfTileToMoveTo = indexOfTileToMoveTo
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
