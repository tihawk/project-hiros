import * as hexFuncs from '../../utility/hexHelper'

export function isValidToAttack (creature, turn, isNeighbourInRange, tileOfNeighbour, indexOfNeighbour) {
  if (creature.player !== turn.player) {
    if (isNeighbourInRange) {
      if (tileOfNeighbour.hasCreature) {
        if (indexOfNeighbour === turn.creature.tileIndex) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    } else if (indexOfNeighbour === turn.creature.tileIndex) {
      return true
    } else {
      return false
    }
  }
}

export function getShootOrAttack (creature, turn, tileOfTurn, tileOfHover) {
  if (creature.player !== turn.player) {
    const attackerCube = hexFuncs.oddRowHexToCube(tileOfTurn)
    const attackedCube = hexFuncs.oddRowHexToCube(tileOfHover)
    const distanceBetweenTiles = hexFuncs.calculateCubeDistance(attackerCube, attackedCube.x, attackedCube.y, attackedCube.z)
    if (distanceBetweenTiles > 1) {
      if (distanceBetweenTiles > 10) {
        return 'shootpenalty'
      } else {
        return 'shoot'
      }
    } else {
      return 'attack'
    }
  } else {
    return null
  }
}

export function getNeighbourIndex (board, tileIndex, corner) {
  if (board[tileIndex]) {
    const { x, y, z } = hexFuncs.oddRowHexToCube(board[tileIndex])
    const resultCube = hexFuncs.cubeNeighbourFromCube(x, y, z, corner)
    const neighbour = hexFuncs.cubeHexToOddRow(resultCube)
    return hexFuncs.indexFromOddRow(neighbour)
  }
}
