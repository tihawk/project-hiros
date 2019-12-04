const helper = require('./helper')

class Node {
  constructor (parent, position) {
    this.parent = parent
    this.position = position

    this.g = 0
    this.h = 0
    this.f = 0
  }

  isEqual (other) {
    return this.position === other.position
  }
}

function aStar (board, start, goal) {
  const open = []
  const closed = []

  const startNode = new Node(null, start)
  startNode.g = startNode.h = startNode.f = 0
  const endNode = new Node(null, goal)
  endNode.g = endNode.h = endNode.f = 0

  open.push(startNode)

  while (open.length > 0) {
    let currentNode = open[0]
    let currentIndex = 0

    open.forEach((node, index) => {
      if (node.f < currentNode.f) {
        currentNode = node
        currentIndex = index
      }
    })

    closed.push(...open.slice(0, 1))

    if (currentNode === endNode) {
      const path = []
      let current = currentNode
      while (current) {
        path.push(current.position)
        current = current.parent
      }
      return path.reverse()
    }

    // generate children
    const children = []

    // loop through children
    for (const child of children) {
      // child is in closed
      for (const closedChild of closed) {
        if (child === closedChild) {
          continue
        }
      }

      // generate f g h
      child.g = currentNode.g + 1
      child.h = // distance from child node to end node
        child.f = child.g + child.f

      // child is in open already, and with a smaller g
      for (const openNode of open) {
        if (child === openNode && child.g > openNode.g) {
          continue
        }
      }

      open.push(child)
    }
  }
}

module.exports = aStar
