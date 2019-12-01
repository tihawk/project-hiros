const { actionTypes } = require('./Enums').creature

class Board {
  constructor () {
    const grid = []
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 15; x++) {
        const gridObj = {}
        gridObj.x = x
        gridObj.y = y
        grid.push(gridObj)
      }
    }
    this.board = grid

    this.populateBoard = this.populateBoard.bind(this)
  }

  populateBoard (armies) {
    const spread = 2
    let army1Counter = 0
    let army2Counter = 0
    for (const tile of this.board) {
      if (tile.x === 0 && tile.y % spread === 0) {
        if (armies[0].army[army1Counter]) {
          tile.hasCreature = true
          tile.creature = armies[0].army[army1Counter]
          army1Counter += 1
        }
      } else if (tile.x === 14 && tile.y % spread === 0) {
        if (armies[1].army[army2Counter]) {
          tile.hasCreature = true
          tile.creature = armies[1].army[army2Counter]
          army2Counter += 1
        }
      }
    }
  }

  getBoard () {
    return this.board
  }

  moveCreature (indexOfTileFrom, indexOfTileTo) {
    this.board[indexOfTileTo].hasCreature = true
    this.board[indexOfTileTo].creature = this.board[indexOfTileFrom].creature
    this.board[indexOfTileTo].creature.resetAction()
    this.board[indexOfTileFrom].hasCreature = false
    this.board[indexOfTileFrom].creature = undefined
  }

  addCorpse (tileIndex) {
    this.board[tileIndex].hasCreature = false
    this.board[tileIndex].hasCorpse = true
    this.board[tileIndex].corpse = this.board[tileIndex].creature
    this.board[tileIndex].creature = undefined
  }
}

module.exports = Board
