const helper = require('./helper')
const Creatures = require('../Entities/Creatures')
const Army = require('../Entities/Army')
const InitiativeQueue = require('../Entities/PriorityQueue')
const Board = require('../Entities/Board')
const findPath = require('./aStar')
const findRange = require('./breadthFirst')
const { actionTypes, orientations } = require('../Entities/Enums').creature

function getNeighbourIndex (tile, corner) {
  const { x, y, z } = helper.oddRowHexToCube(tile)
  const resultCube = helper.cubeNeighbourFromCube(x, y, z, corner)
  const neighbourOddRow = helper.cubeHexToOddRow(resultCube)
  return helper.indexFromOddRow(neighbourOddRow)
}

function getDistanceOrientationAndDepth (tileFrom, tileTo) {
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

function calculateRange (board, tileIndex) {
  const { spd, movementType } = board[tileIndex].creature
  if (movementType === 'walk') {
    return findRange(board, tileIndex, spd)
  } else if (movementType === 'fly') {
    return helper.calculateFlyerRange(board, tileIndex)
  }
}

class ActionController {
  constructor () {
    this.players = []
    this.battlefield = new Board()
    this.board = this.battlefield.getBoard()
    this.armies = []
    this.queue = {
      currentPhase: 'normal'
    }
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
    this.actions = []

    this.isToAttack = false
    this.indexOfTileToAttack = null
  }

  resetAll () {
    this.players = []
    this.battlefield = new Board()
    this.board = this.battlefield.getBoard()
    this.armies = []
    this.actions = []
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

  addAction (type, orientation, time = null, indexOfTileToMoveTo = null) {
    const action = {
      time,
      type,
      orientation,
      indexOfTileToMoveTo
    }
    this.actions.push(action)
  }

  populateArmies () {
    this.armies = []
    for (let i = 0; i < 2; i++) {
      const army = new Army(this.players[i])
      for (let j = 0; j < 5; j++) {
        const random = Math.random()
        const member = random < 0.5 ? new Creatures.Swordsman(Math.floor(Math.random() * (10 - 1)) + 1,
          actionTypes.idle, i === 0 ? orientations.right : orientations.left,
          this.players[i]) : new Creatures.Angel(Math.floor(Math.random() * (10 - 1)) + 1,
          actionTypes.idle, i === 0 ? orientations.right : orientations.left,
          this.players[i])
        if (i === 0) {
          army.addMember(member, j)
        } else {
          army.addMember(member, j)
        }
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
    this.turn = this.queue.getNextTurnObject()
    console.log(this.turn)
    this.turn.creature.range = calculateRange(this.board, this.turn.creature.tileIndex)
  }

  handleTileClicked (tileIndex, corner) {
    this.isToAttack = false
    if (this.board[tileIndex].hasCreature) {
      if (this.board[tileIndex].creature.player !== this.turn.player) {
        console.log('[handleTileClicked] calling attack')
        this.handleCreatureAttack(tileIndex, corner)
      }
    } else if (this.turn.creature.range.includes(tileIndex)) {
      console.log('[handleTileClicked] calling moving')
      this.handleCreatureMove(tileIndex)
    }
    return this.actions
  }

  handleCreatureAttack (tileIndex, corner) {
    this.isToAttack = true
    this.indexOfTileToAttack = tileIndex

    const indexOfNeighbour = getNeighbourIndex(this.board[tileIndex], corner)
    console.log('[handleCreatureAttack] found neighbour to be', indexOfNeighbour, 'and attacker is at', this.turn.creature.tileIndex)

    if (indexOfNeighbour !== -1) {
      if (this.board[indexOfNeighbour].hasCreature) {
        if (this.turn.creature.tileIndex === indexOfNeighbour) {
          this.handleCreatureMove(indexOfNeighbour)
        }
      } else {
        this.handleCreatureMove(indexOfNeighbour)
      }
    }
  }

  handleCreatureMove (indexOfTileToMoveTo) {
    console.log('[handleCreatureMove]')
    let path
    if (this.board[this.turn.creature.tileIndex].creature.movementType === 'walk') {
      console.log('[handleCreatureMove] running pathfinding')
      path = findPath(
        this.board,
        this.turn.creature.range,
        this.board[this.turn.creature.tileIndex],
        this.board[indexOfTileToMoveTo]
      )
    } else if (this.board[this.turn.creature.tileIndex].creature.movementType === 'fly') {
      if (this.turn.creature.tileIndex !== indexOfTileToMoveTo) {
        path = [indexOfTileToMoveTo]
      }
    }
    console.log('[handleCreatureMove] found path:\n', path)
    if (path) {
      console.log('[handleCreatureMove] moving...')

      let previousNode = this.turn.creature.tileIndex
      for (const node of path) {
        const { distance, orientation } = getDistanceOrientationAndDepth(this.board[previousNode], this.board[node])
        this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes.walk)
        this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)

        const time = distance * 300
        this.addAction(actionTypes.walk, orientation, time, node)
        previousNode = node
      }

      console.log('finished moving')
      this.battlefield.moveCreature(this.turn.creature.tileIndex, indexOfTileToMoveTo)
      this.turn.creature.tileIndex = indexOfTileToMoveTo
      this.turn.creature.range = calculateRange(this.board, this.turn.creature.tileIndex)

      if (this.isToAttack) {
        this.performTheAttack()
      }
    } else if (indexOfTileToMoveTo === this.turn.creature.tileIndex) {
      this.performTheAttack()
    }
  }

  performTheAttack () {
    this.isToAttack = false
    const { orientation, depth } = getDistanceOrientationAndDepth(this.board[this.turn.creature.tileIndex], this.board[this.indexOfTileToAttack])
    const attackType = 'attack' + depth
    console.log('[performTheAttack] setting action to attack')
    this.addAction(actionTypes[attackType], orientation, 600, this.turn.creature.tileIndex)

    this.board[this.turn.creature.tileIndex].creature.setAction(actionTypes[attackType])
    this.board[this.turn.creature.tileIndex].creature.setOrientation(orientation)
    this.board[this.turn.creature.tileIndex].creature.attack(this.board[this.indexOfTileToAttack].creature)

    this.handleCreatureAttacked()
  }

  handleCreatureAttacked () {
    this.board[this.turn.creature.tileIndex].creature.resetAction()
    const { actionType, isAlive } = this.board[this.indexOfTileToAttack].creature.checkIfAlive()
    this.addAction(actionType, this.board[this.indexOfTileToAttack].creature.orientation, 1000, this.indexOfTileToAttack)

    if (!isAlive) {
      this.battlefield.addCorpse(this.indexOfTileToAttack)
    } else {
      this.board[this.indexOfTileToAttack].creature.resetAction()
      this.handleRetaliation()
    }
  }

  handleRetaliation () {
    const retaliates = this.board[this.indexOfTileToAttack].creature.checkIfRetaliates(this.board[this.turn.creature.tileIndex].creature)
    if (retaliates) {
      const { orientation, depth } = getDistanceOrientationAndDepth(this.board[this.indexOfTileToAttack], this.board[this.turn.creature.tileIndex])
      const attackType = 'attack' + depth
      console.log('[handleRetaliation] setting action to attack (retaliates)')
      this.addAction(actionTypes[attackType], orientation, 600, this.indexOfTileToAttack)

      this.board[this.indexOfTileToAttack].creature.setAction(actionTypes[attackType])
      this.board[this.indexOfTileToAttack].creature.setOrientation(orientation)
      this.board[this.indexOfTileToAttack].creature.attack(this.board[this.turn.creature.tileIndex].creature)

      this.board[this.indexOfTileToAttack].creature.resetAction()
      const { actionType, isAlive } = this.board[this.turn.creature.tileIndex].creature.checkIfAlive()
      this.addAction(actionType, this.board[this.turn.creature.tileIndex].creature.orientation, 1000, this.turn.creature.tileIndex)

      if (!isAlive) {
        this.battlefield.addCorpse(this.turn.creature.tileIndex)
      } else {
        this.board[this.turn.creature.tileIndex].creature.resetAction()
      }
    }

    this.indexOfTileToAttack = null
  }

  handleWaiting () {
    console.log('[handleWaiting]')
    this.turn = this.queue.setToWaitingAndGetNextTurnObject()
    this.turn.creature.range = calculateRange(this.board, this.turn.creature.tileIndex)
    this.startNewTurn()
  }

  handleDefending () {
    console.log('[handleDefending]')
    this.board[this.turn.creature.tileIndex].creature.setDefend(true)
    this.endTurn()
  }

  endTurn () {
    this.actions = []
    this.turn = this.queue.getNextTurnObject()
    this.turn.creature.range = calculateRange(this.board, this.turn.creature.tileIndex)
    this.startNewTurn()
  }

  startNewTurn () {
    // this.board[this.turn.creature.tileIndex].creature.setDefend(false)
    this.board[this.turn.creature.tileIndex].creature.resetRoundStats()
  }
}

module.exports = ActionController
