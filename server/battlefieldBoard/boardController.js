const update = require('immutability-helper')

exports.reset = () => {
  this.board = [{ x: 0, y: 0 }]
  this.isCreatureSelected = true
  this.indexOfTileToMoveTo = null
  this.turn = {
    player: 1,
    creatureTileIndex: 0,
    number: 0
  }
  this.loading = false
  this.inAction = false
}

exports.board = [{ x: 0, y: 0 }]
exports.isCreatureSelected = true
exports.indexOfTileToMoveTo = null
exports.turn = {
  player: 1,
  creatureTileIndex: 0,
  number: 0
}
exports.loading = false
exports.inAction = false

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
          speed: Math.floor(Math.random() * 22),
          oriented: x === 0 ? 1 : -1
        }
      }
      grid.push(gridObj)
    }
  }
  this.board = grid
}

exports.handleTileClicked = (tileIndex) => {
  if (!this.board[tileIndex].hasCreature) {
    if (this.isCreatureSelected) {
      console.log('calling moving')
      handleCreatureMoved(tileIndex)
    } else {
      // clicked on empty tile i guess
    }
  } else if (this.board[tileIndex].hasCreature) {
    console.log('calling selecting')
    // handleCreatureSelect(tileIndex)
    handleCreatureAttack(tileIndex)
  } else {
    // placeholder condition
  }
}

const handleCreatureAttack = (tileIndex) => {

}

// const handleCreatureSelect = (tileIndex) => {
//   if (tileIndex === this.turn.creatureTileIndex) {
//     // deselect
//     console.log('deselect')
//     this.turn.creatureTileIndex = null
//     this.isCreatureSelected = false
//   } else {
//     // select
//     console.log('select')
//     this.turn.creatureTileIndex = tileIndex
//     this.isCreatureSelected = true
//   }
// }

const handleCreatureMoved = (indexOfTileToMoveTo) => {
  this.inAction = true
  this.indexOfTileToMoveTo = indexOfTileToMoveTo
  if (!this.board[indexOfTileToMoveTo].hasCreature) {
    console.log('moving...')
    // this.board = update(this.board, { [this.turn.creatureTileIndex]: { creature: { action: { $set: 'walk' } } } })

    this.board = update(this.board, { [this.turn.creatureTileIndex]: { creature: { action: { $set: 'walk' } } } })
    const orientation = (this.board[indexOfTileToMoveTo].x - this.board[this.turn.creatureTileIndex].x) > 0 ? 1 : -1
    this.board = update(this.board, { [this.turn.creatureTileIndex]: { creature: { oriented: { $set: orientation } } } })
  } else {
    // placeholder condition
  }
}

exports.handleFinishedMoving = () => {
  console.log('finished moving')
  if (this.inAction) {
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { $set: this.board[this.turn.creatureTileIndex].creature } } })
    this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { action: { $set: 'idle' } } } })
    this.board = update(this.board, { [this.turn.creatureTileIndex]: { hasCreature: { $set: false } } })
    this.board = update(this.board, { [this.turn.creatureTileIndex]: { creature: { $set: undefined } } })
    // this.isCreatureSelected = false
    this.turn.creatureTileIndex = this.indexOfTileToMoveTo
    this.indexOfTileToMoveTo = null
    this.inAction = false
  }
}
