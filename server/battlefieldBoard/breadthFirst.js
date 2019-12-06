/* eslint-disable no-labels */
const helper = require('./helper')

class Node {
  constructor (parent, position) {
    this.parent = parent
    this.position = position
    this.cost = 0
  }

  isEqualTo (other) {
    return this.position.x === other.position.x && this.position.y === other.position.y && this.position.z === other.position.z
  }
}

function calculateRange (board, startIndex, speed) {
  const frontier = []
  const visited = []

  const startOddRow = { x: board[startIndex].x, y: board[startIndex].y }
  const start = helper.oddRowHexToCube(startOddRow)
  const startNode = new Node(null, start)
  frontier.push(startNode)

  visited.push(startNode)
  while (frontier.length > 0) {
    const currentNode = frontier[0]

    const neighbourNodes = []
    for (const neighbour of helper.cubeNeighboursList) {
      const nodePosition = {
        x: currentNode.position.x + neighbour.x,
        y: currentNode.position.y + neighbour.y,
        z: currentNode.position.z + neighbour.z
      }

      const nodeOddRow = helper.cubeHexToOddRow(nodePosition)
      if (nodeOddRow.x < 0 || nodeOddRow.x > 14) continue

      const nodeIndex = helper.indexFromOddRow(nodeOddRow)
      if (!board[nodeIndex]) continue
      if (board[nodeIndex].hasCreature || board[nodeIndex].hasObstacle || board[nodeIndex].hasWall) continue

      const neighbourNode = new Node(currentNode, nodePosition)
      neighbourNode.cost = currentNode.cost + 1
      if (neighbourNode.cost >= speed) continue

      neighbourNodes.push(neighbourNode)
    }

    frontier.shift()

    loop1: for (const neighbour of neighbourNodes) {
      for (const visitedNode of visited) {
        if (visitedNode.isEqualTo(neighbour)) {
          continue loop1
        }
      }
      frontier.push(neighbour)
      visited.push(neighbour)
    }
  }

  const path = []
  let current = visited.shift()
  while (current) {
    const oddRow = helper.cubeHexToOddRow(current.position)
    const index = helper.indexFromOddRow(oddRow)
    path.push(index)
    current = visited.shift()
  }
  path.shift()
  if (path.length > 0) return path
  else return false
}

module.exports = calculateRange
