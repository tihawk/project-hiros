class PriorityQueue {
  constructor (board, players) {
    this.board = board
    this.players = players
    this.queue = []
    this.queueCopy = []
    this.dequeued = []

    this.getNewQueue()
  }

  getNewQueue () {
    const board = this.board
    // const armies = this.armies
    // for (const army of armies) {
    //   for (const memberIndex in army.army) {
    //     this.queue.push({ armyIndex: memberIndex })
    //   }
    // }
    for (const tileIndex in board) {
      if (board[tileIndex].hasCreature) {
        const elemToPush = {
          tileIndex: tileIndex,
          armyIndex: board[tileIndex].creature.armyIndex,
          playerIndex: this.players.indexOf(board[tileIndex].creature.player),
          creature: board[tileIndex].creature
        }
        this.queue.push({ ...elemToPush })
        this.queueCopy.push({ ...elemToPush })
      }
    }
    this.updateQueue()
  }

  updateQueue () {
    this.queue.sort((elemA, elemB) => {
      const initiative = elemB.creature.stackMultiplier * elemB.creature.spd - elemA.creature.stackMultiplier * elemA.creature.spd
      if (initiative < 0) return -1
      if (initiative > 0) return 1
      //   if (elemA.playerIndex > elemB.playerIndex) return 1
      //   if (elemA.playerIndex < elemB.playerIndex) return -1
      if (elemA.armyIndex > elemB.armyIndex) return 1
      if (elemA.armyIndex < elemB.armyIndex) return -1
      return 0
      //   if (initiative === 0) {
      // if (elemA.playerIndex === elemB.playerIndex) {
      //   const elemAIndex = this.queueCopy.findIndex(elem => elem.armyIndex === elemA.armyIndex && elem.tileIndex === elemA.tileIndex)
      //   if (elemAIndex === -1) console.log(elemA)
      //   if (elemAIndex !== 0) {
      //     const prevElem = this.queueCopy[elemAIndex - 1]
      //     if (prevElem.playerIndex === elemAIndex.playerIndex) {
      //       initiative = 1
      //     } else {
      //       initiative = -1
      //     }
      //   } else {
      //     initiative = elemA.playerIndex - elemB.playerIndex
      //   }
      // }
    //   }
    //   return initiative
    })
    // this.queue.sort((elemA, elemB) => elemB.creature.stackMultiplier * elemB.creature.spd - elemA.creature.stackMultiplier * elemA.creature.spd)
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
    return this.queue
  }

  getNextTurnObject () {
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
      number: null
    }
    return turn
  }
}

module.exports = PriorityQueue
