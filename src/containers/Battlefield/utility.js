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

export function getNeighbourIndex (board, tileIndex, corner) {
  if (board[tileIndex]) {
    const { x, y, z } = hexFuncs.oddRowHexToCube(board[tileIndex])
    const resultCube = hexFuncs.cubeNeighbourFromCube(x, y, z, corner)
    const neighbour = hexFuncs.cubeHexToOddRow(resultCube)
    return hexFuncs.indexFromOddRow(neighbour)
  }
}
