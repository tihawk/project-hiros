const update = require('immutability-helper')

exports.board = [{ x: 0, y: 0 }]
exports.isCreatureSelected = false
exports.indexOfSelectedTileWithCreature = null
this.indexOfTileToMoveTo = null

exports.populateGrid = () => {
  const grid = []
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 15; x++) {
      const gridObj = {}
      gridObj.x = x
      gridObj.y = y
      if (x === 0) {
        gridObj.hasCreature = true
        gridObj.creature = {
          type: 'swordsman',
          action: 'idle',
          oriented: 1
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
    handleCreatureSelect(tileIndex)
  } else {
    // placeholder condition
  }
}

const handleCreatureSelect = (tileIndex) => {
  if (tileIndex === this.indexOfSelectedTileWithCreature) {
    // deselect
    console.log('deselect')
    this.indexOfSelectedTileWithCreature = null
    this.isCreatureSelected = false
  } else {
    // select
    console.log('select')
    this.indexOfSelectedTileWithCreature = tileIndex
    this.isCreatureSelected = true
  }
}

const handleCreatureMoved = (indexOfTileToMoveTo) => {
  this.indexOfTileToMoveTo = indexOfTileToMoveTo
  if (!this.board[indexOfTileToMoveTo].hasCreature) {
    console.log('moving...')
    this.board = update(this.board, { [this.indexOfSelectedTileWithCreature]: { creature: { action: { $set: 'walk' } } } })

    this.board = update(this.board, { [this.indexOfSelectedTileWithCreature]: { creature: { action: { $set: 'walk' } } } })
    const orientation = (this.board[indexOfTileToMoveTo].x - this.board[this.indexOfSelectedTileWithCreature].x) > 0 ? 1 : -1
    this.board = update(this.board, { [this.indexOfSelectedTileWithCreature]: { creature: { oriented: { $set: orientation } } } })
  } else {
    // placeholder condition
  }
}

exports.handleFinishedMoving = () => {
  this.board = update(this.board, { [this.indexOfTileToMoveTo]: { hasCreature: { $set: true } } })
  this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { $set: this.board[this.indexOfSelectedTileWithCreature].creature } } })
  this.board = update(this.board, { [this.indexOfTileToMoveTo]: { creature: { action: { $set: 'idle' } } } })
  this.board = update(this.board, { [this.indexOfSelectedTileWithCreature]: { hasCreature: { $set: false } } })
  this.board = update(this.board, { [this.indexOfSelectedTileWithCreature]: { creature: { $set: undefined } } })
  this.isCreatureSelected = false
  this.indexOfSelectedTileWithCreature = null
  this.indexOfTileToMoveTo = null
}
