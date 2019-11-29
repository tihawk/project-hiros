const helper = require('./helper')
const Swordsman = require('../Entities/Creatures/Swordsman')
const Army = require('../Entities/Army')
const InitiativeQueue = require('../Entities/PriorityQueue')
const Board = require('../Entities/Board')
const { actionTypes, orientations } = require('../Entities/Enums').creature

class ActionController {
  constructor () {
    this.players = []
    this.battlefield = new Board()
    this.board = this.battlefield.getBoard()
    this.armies = []
    this.turn = {
      player: '',
      creature: {
        tileIndex: 0,
        range: []
      },
      roundNum: 0,
      turnNum: 0
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
    this.board = this.battlefield.getBoard()
    this.armies = []
    this.turn = {
      player: '',
      creature: {
        tileIndex: 0,
        range: []
      },
      roundNum: 0,
      turnNum: 0
    }
    this.resetLoading()
    this.resetAction()

    this.isToAttack = false
    this.indexOfTileToAttack = null
  }

  addPlayer (id) {
    this.players.push(id)
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
    this.armies = []
    for (let i = 0; i < 2; i++) {
      const army = new Army(this.players[i])
      for (let j = 0; j < 7; j++) {
        army.addMember(new Swordsman(Math.floor(Math.random() * (3 - 1)) + 1,
          actionTypes.idle, i === 0 ? orientations.right : orientations.left,
          this.players[i]), j)
      }
      this.armies.push(army)
    }
  }

  initBattlefield (players) {
    players.forEach(value => {
      this.addPlayer(value)
    })
    this.resetLoading()
    this.populateArmies()
    this.battlefield.populateBoard(this.armies)
    this.board = this.battlefield.getBoard()
    this.queue = new InitiativeQueue(this.board, this.players)
    // console.log(this.queue.queue)
    this.turn = this.queue.getNextTurnObject()
    console.log(this.turn)
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

    if (indexOfNeighbour !== -1) {
      this.handleCreatureMove(indexOfNeighbour)
    }
  }

  handleCreatureMove (indexOfTileToMoveTo) {
    if (!this.board[indexOfTileToMoveTo].hasCreature) {
      console.log('moving...')

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
      this.battlefield.moveCreature(this.turn.creature.tileIndex, this.action.indexOfTileToMoveTo)
      this.turn.creature.tileIndex = this.action.indexOfTileToMoveTo
      this.calculateRange()

      if (this.isToAttack) {
        // this.isToAttack = false
        this.setAction(true, actionTypes.attackWE, 500)
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

    this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes[attackType])
    this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)
    this.board[this.turn.creature.tileIndex].creature.attack(this.board[this.indexOfTileToAttack].creature)

    return this.action
  }

  handleCreatureAttacked () {
    this.board[this.turn.creature.tileIndex].creature.resetAction()
    const { actionType, isAlive } = this.board[this.indexOfTileToAttack].creature.checkIfAlive()
    if (!isAlive) {
      this.battlefield.addCorpse(this.indexOfTileToAttack)
    }

    this.setAction(true, actionType, 500)
    return this.action
  }

  finishBeingAttacked () {
    this.resetAction()
    if (this.board[this.indexOfTileToAttack].hasCreature) {
      this.board[this.indexOfTileToAttack].creature.resetAction()
    }
    this.indexOfTileToAttack = null

    return this.action
  }

  endTurn () {
    this.turn = this.queue.getNextTurnObject()
    this.calculateRange()
  }
}

module.exports = ActionController
