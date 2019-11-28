class PriorityQueue {
  constructor (board, players) {
    this.board = board
    this.players = players
    this.queue = []
    this.dequeued = []

    this.roundNum = 0
    this.turnNum = 0
    this.lastPlayerLastRound = 1

    this.getNewQueue()
  }

  getNewQueue () {
    this.roundNum += 1
    this.turnNum = 0
    const board = this.board
    for (const tileIndex in board) {
      if (board[tileIndex].hasCreature) {
        this.queue.push({
          tileIndex: tileIndex,
          armyIndex: board[tileIndex].creature.armyIndex,
          playerIndex: this.players.indexOf(board[tileIndex].creature.player),
          creature: board[tileIndex].creature
        })
      }
    }
    this.updateQueue()
  }

  updateQueue () {
    // sort by speed initiative and army position
    this.queue.sort((elemA, elemB) => {
      const initiative = elemB.creature.stackMultiplier * elemB.creature.spd - elemA.creature.stackMultiplier * elemA.creature.spd
      if (initiative < 0) return -1
      if (initiative > 0) return 1
      if (elemA.armyIndex > elemB.armyIndex) return 1
      if (elemA.armyIndex < elemB.armyIndex) return -1
      return 0
    })
    // sort by making sure that in case of first two stacks have the same initiative, and are of different
    // players, first plays the player who didn't play last round (or in case of first round, player on the left)
    const firstElem = { ...this.queue[0] }
    const secondElem = { ...this.queue[1] }
    const initiative = secondElem.creature.stackMultiplier * secondElem.creature.spd - firstElem.creature.stackMultiplier * firstElem.creature.spd
    if (initiative === 0) {
      if (this.lastPlayerLastRound === firstElem.playerIndex && firstElem.playerIndex !== secondElem.playerIndex) {
        this.queue.splice(0, 1, secondElem)
        this.queue.splice(1, 1, firstElem)
      }
    }
    // sort by alternating players when they have stacks of same initiative
    for (let i = 1; i < this.queue.length - 1; i++) {
      const prevElem = this.queue[i - 1]
      const elem = this.queue[i]
      const nextElem = this.queue[i + 1]
      const initiative = nextElem.creature.stackMultiplier * nextElem.creature.spd - elem.creature.stackMultiplier * elem.creature.spd
      if (initiative === 0) {
        if (prevElem.playerIndex === elem.playerIndex && elem.playerIndex !== nextElem.playerIndex) {
          console.log('swappint', this.queue[i - 1].playerIndex, this.queue[i - 1].creature.stackMultiplier, this.queue[i].playerIndex, this.queue[i].creature.stackMultiplier, this.queue[i + 1].playerIndex, this.queue[i + 1].creature.stackMultiplier)
          this.queue.splice(i, 1, nextElem)
          this.queue.splice(i + 1, 1, elem)
          console.log('to', this.queue[i - 1].playerIndex, this.queue[i - 1].creature.stackMultiplier, this.queue[i].playerIndex, this.queue[i].creature.stackMultiplier, this.queue[i + 1].playerIndex, this.queue[i + 1].creature.stackMultiplier)
        }
      }
    }
    this.lastPlayerLastRound = this.queue[this.queue.length - 1].playerIndex
    return this.queue
  }

  getNextTurnObject () {
    this.turnNum += 1
    if (this.queue.length === 0) {
      this.getNewQueue()
    }
    let next = this.queue.splice(0, 1)
    while (!this.board[next[0].tileIndex].hasCreature) {
      if (this.queue.length === 0) {
        this.getNewQueue()
      }
      next = this.queue.splice(0, 1)
    }
    // console.log(next)
    this.dequeued.push(...next)
    const { tileIndex, creature } = next[0]
    const turn = {
      player: creature.player,
      creature: {
        tileIndex: tileIndex,
        range: []
      },
      roundNum: this.roundNum,
      turnNum: this.turnNum
    }
    return turn
  }
}

module.exports = PriorityQueue
