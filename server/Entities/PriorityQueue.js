class PriorityQueue {
  constructor (board) {
    this.board = board
    this.queue = []
    this.dequeued = []

    this.getNewQueue()
  }

  getNewQueue () {
    const board = this.board
    for (const tileIndex in board) {
      if (board[tileIndex].hasCreature) {
        this.queue.push({ tile: tileIndex, creature: board[tileIndex].creature })
      }
    }
    this.updateQueue()
  }

  updateQueue () {
    this.queue.sort((elemA, elemB) => {
      let initiative = elemB.creature.stackMultiplier * elemB.creature.spd - elemA.creature.stackMultiplier * elemA.creature.spd
      if (initiative === 0) {
        initiative = elemA.tile - elemB.tile
      }
      return initiative
    })
    return this.queue
  }

  getNextTurnObject () {
    if (this.queue.length === 0) {
      this.getNewQueue()
    }
    let next = this.queue.splice(0, 1)
    while (!this.board[next[0].tile].hasCreature) {
      if (this.queue.length === 0) {
        this.getNewQueue()
      }
      next = this.queue.splice(0, 1)
    }
    console.log(next)
    this.dequeued.push(...next)
    const { tile, creature } = next[0]
    const turn = {
      player: creature.player,
      creature: {
        tileIndex: tile,
        range: []
      },
      number: null
    }
    return turn
  }
}

module.exports = PriorityQueue
