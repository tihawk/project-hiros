const helper = require('./helper')

class Node {
  constructor (parent, position) {
    this.parent = parent
    this.position = position

    this.g = 0
    this.h = 0
    this.f = 0
  }

  isEqualTo (other) {
    return this.position.x === other.position.x && this.position.y === other.position.y && this.position.z === other.position.z
  }
}

function aStar (board, range, startOddRow, goalOddRow) {
  const open = []
  const closed = []

  const start = helper.oddRowHexToCube({ ...startOddRow })
  const goal = helper.oddRowHexToCube({ ...goalOddRow })

  const startNode = new Node(null, start)
  startNode.g = startNode.h = startNode.f = 0
  const endNode = new Node(null, goal)
  endNode.g = endNode.h = endNode.f = 0

  open.push(startNode)

  while (open.length > 0) {
    let currentNode = open[0]
    let currentIndex = 0

    open.forEach((node, index) => {
    //   console.log(node.f, currentNode.f)
      if (node.f < currentNode.f) {
        currentNode = node
        currentIndex = index
      }
    })

    // console.log(currentIndex)

    open.splice(currentIndex, 1)
    closed.push(currentNode)

    if (currentNode.isEqualTo(endNode)) {
      const path = []
      let current = currentNode
      while (current) {
        const oddRow = helper.cubeHexToOddRow(current.position)
        const index = helper.indexFromOddRow(oddRow)
        path.push(index)
        current = current.parent
      }
      return path.reverse()
    }

    // generate children
    const children = []
    for (const neighbour of helper.cubeNeighboursList) {
      const nodePosition = {
        x: currentNode.position.x + neighbour.x,
        y: currentNode.position.y + neighbour.y,
        z: currentNode.position.z + neighbour.z
      }

      const nodePositionOddRow = helper.cubeHexToOddRow(nodePosition)
      const indexOfNodePosition = helper.indexFromOddRow(nodePositionOddRow)

      // make sure in range
      if (!range.includes(indexOfNodePosition)) {
        continue
      }

      // make sure walkable
      if (board[indexOfNodePosition].hasCreature || board[indexOfNodePosition].hasObstacle || board[indexOfNodePosition].hasWall) {
        continue
      }

      const newNode = new Node(currentNode, nodePosition)
      children.push(newNode)
    }

    // loop through children
    for (const child of children) {
      let isToContinue = false
      // child is in closed
      for (const closedChild of closed) {
        if (child.isEqualTo(closedChild)) {
          isToContinue = true
          break
        }
      }

      if (isToContinue) continue

      // generate f g h
      child.g = currentNode.g + 1
      child.h = helper.calculateCubeDistance({ ...child.position }, endNode.position.x, endNode.position.y, endNode.position.z)
      child.f = child.g + child.f

      // child is in open already, and with a smaller g
      for (const openNode of open) {
        if (child.isEqualTo(openNode) && child.g > openNode.g) {
          isToContinue = true
          break
        }
      }

      if (isToContinue) continue

      open.push(child)
    }
  }
}

module.exports = aStar
