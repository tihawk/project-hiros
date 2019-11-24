const update = require('immutability-helper')
const helper = require('./helper')
const Swordsman = require('../Entities/Creatures/Swordsman')
const Army = require('../Entities/Army')
const Board = require('../Entities/Board')
const battlefield = new Board()
const { actionTypes, orientations } = require('../Entities/Enums').creature

class ActionController {
  constructor () {
    this.battlefield = new Board()
    this.board = battlefield.getBoard()
    this.armies = []
    this.turn = {
      player: 1,
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
    this.battlefield = new Board()
    this.board = battlefield.getBoard()
    this.armies = []
    this.turn = {
      player: 1,
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
    for (let i = 1; i <= 2; i++) {
      const army = new Army(i)
      for (let j = 0; j < 7; j++) {
        army.addMember(new Swordsman(1,
          actionTypes.idle, i === 1 ? orientations.right : orientations.left,
          i), j)
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
          // handleCreatureSelect(tileIndex)
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

      const distanceX = (this.board[indexOfTileToMoveTo].x - this.board[this.turn.creature.tileIndex].x)
      const distanceY = (this.board[indexOfTileToMoveTo].y - this.board[this.turn.creature.tileIndex].y)
      const orientation = distanceX > 0 ? orientations.right : orientations.left
      this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes.walk)
      this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)

      const time = Math.sqrt(distanceX ** 2 + distanceY ** 2) * 300
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
    this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes.attackWE)
    return this.action
  }

  returnCreatureToIdle () {
    this.resetAction()
    this.board[this.turn.creature.tileIndex].creature.resetAction()
    return this.action
  }
}

module.exports = ActionController
