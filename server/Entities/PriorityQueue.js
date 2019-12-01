function sortBySpeedInitiativeAndPosition (elemA, elemB) {
  const initiative = getInitiative(elemB, elemA)
  if (initiative < 0) return -1
  if (initiative > 0) return 1
  if (elemA.armyIndex > elemB.armyIndex) return 1
  if (elemA.armyIndex < elemB.armyIndex) return -1
  return 0
}

function swapElementsWithSameInitiativeIfPlayerAlreadyHadItsTurn (queue, lastPlayerLastRound, secondElem, firstElem) {
  const initiative = getInitiative(secondElem, firstElem)
  if (initiative === 0) {
    if (lastPlayerLastRound === firstElem.playerIndex && firstElem.playerIndex !== secondElem.playerIndex) {
      console.log('swapping first player from', firstElem.playerIndex, firstElem.creature.stackMultiplier, secondElem.playerIndex, secondElem.creature.stackMultiplier)
      queue.splice(0, 1, secondElem)
      queue.splice(1, 1, firstElem)
      console.log('to', secondElem.playerIndex, secondElem.creature.stackMultiplier, firstElem.playerIndex, firstElem.creature.stackMultiplier)
    }
  }
}

function getInitiative (nextElem, elem) {
  return nextElem.creature.stackMultiplier * nextElem.creature.spd - elem.creature.stackMultiplier * elem.creature.spd
}

function needsSwapToBeAlternating (prevElem, elem, nextElem) {
  return prevElem.playerIndex === elem.playerIndex && elem.playerIndex !== nextElem.playerIndex
}

function findIndexOfNextWithSameInitiativeOfDifferentPlayer (elem, slicedQueue) {
  let result = -1
  for (let i = 0; i < slicedQueue.length + 1; i++) {
    const candidate = slicedQueue.shift()
    const initiative = getInitiative(candidate, elem)
    if (initiative === 0) {
      if (elem.playerIndex !== candidate.playerIndex) {
        result = parseInt(i)
        break
      } else {
        continue
      }
    } else {
      result = -1
      break
    }
  }
  return result
}

function swapElements (queue, i, j, nextElem, elem) {
  queue.splice(i, 1, nextElem)
  queue.splice(j, 1, elem)
}

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
        const elemToPush = {
          tileIndex: parseInt(tileIndex),
          armyIndex: board[tileIndex].creature.armyIndex,
          playerIndex: this.players.indexOf(board[tileIndex].creature.player),
          creature: board[tileIndex].creature
        }
        this.queue.push({ ...elemToPush })
      }
    }
    this.updateQueue()
  }

  updateQueue () {
    // sort by speed initiative and army position
    this.queue.sort(sortBySpeedInitiativeAndPosition)

    // sort by making sure that in case of first two stacks have the same initiative, and are of different
    // players, first plays the player who didn't play last round (or in case of first round, player on the left)
    const firstElem = { ...this.queue[0] }
    const index = findIndexOfNextWithSameInitiativeOfDifferentPlayer(firstElem, this.queue.slice(1)) + 1
    if (index - 1 !== -1) {
      const secondElem = { ...this.queue[index] }
      swapElementsWithSameInitiativeIfPlayerAlreadyHadItsTurn(
        this.queue, this.lastPlayerLastRound, secondElem, firstElem)
    }

    // sort by alternating players when they have stacks of same initiative
    for (let i = 1; i < this.queue.length - 1; i++) {
      const prevElem = this.queue[i - 1]
      const elem = this.queue[i]
      const nextElem = this.queue[i + 1]
      const initiative = getInitiative(nextElem, elem)
      if (initiative === 0) {
        const index = findIndexOfNextWithSameInitiativeOfDifferentPlayer(elem, this.queue.slice(i)) + i
        if (index - i !== -1) {
          console.log(index)
          if (needsSwapToBeAlternating(prevElem, elem, this.queue[index])) {
            console.log('swappint', this.queue[i - 1].playerIndex, this.queue[i - 1].creature.stackMultiplier, this.queue[i].playerIndex, this.queue[i].creature.stackMultiplier, this.queue[index].playerIndex, this.queue[index].creature.stackMultiplier)
            swapElements(this.queue, i, index, this.queue[index], elem)
            console.log('to', this.queue[i - 1].playerIndex, this.queue[i - 1].creature.stackMultiplier, this.queue[i].playerIndex, this.queue[i].creature.stackMultiplier, this.queue[index].playerIndex, this.queue[index].creature.stackMultiplier)
          } else {
            console.log('smtin wrong with swapping logic')
            console.log('didnt swap', this.queue[i - 1].playerIndex, this.queue[i - 1].creature.stackMultiplier, this.queue[i].playerIndex, this.queue[i].creature.stackMultiplier, this.queue[index].playerIndex, this.queue[index].creature.stackMultiplier)
            console.log('to', this.queue[i - 1].playerIndex, this.queue[i - 1].creature.stackMultiplier, this.queue[i].playerIndex, this.queue[i].creature.stackMultiplier, this.queue[index].playerIndex, this.queue[index].creature.stackMultiplier)
          }
        }
      }
    }
    this.lastPlayerLastRound = this.queue[this.queue.length - 1].playerIndex
    const queueCopy = this.queue.map(elem => { return { plInd: elem.playerIndex, armInd: elem.armyIndex, stack: elem.creature.stackMultiplier } })
    console.log('initiative for current round\n', queueCopy)
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
