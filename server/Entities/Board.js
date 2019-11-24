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
    for (const tile of this.board) {
      if (tile.x === 0 && tile.y < 7) {
        if (armies[0].army[tile.y]) {
          tile.hasCreature = true
          tile.creature = armies[0].army[tile.y]
        }
      } else if (tile.x === 14 && tile.y < 7) {
        if (armies[1].army[tile.y]) {
          tile.hasCreature = true
          tile.creature = armies[1].army[tile.y]
        }
      }
    }
  }

  getBoard () {
    return this.board
  }
}

module.exports = Board
