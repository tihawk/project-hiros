import * as hexFuncs from '../../utility/hexHelper'

export function getDistanceOrientationAndDepth (tileFrom, tileTo) {
  const result = {}

  const cubeTileFrom = hexFuncs.oddRowHexToCube(tileFrom)
  const cubeTileTo = hexFuncs.oddRowHexToCube(tileTo)
  const dist = hexFuncs.calculateCubeDistance(cubeTileFrom, cubeTileTo.x, cubeTileTo.y, cubeTileTo.z)
  result.distance = dist

  const y = cubeTileTo.y - cubeTileFrom.y
  const z = cubeTileTo.z - cubeTileFrom.z
  if (y > 0 || (y === 0 && z > 0)) {
    result.orientation = -1
  } else {
    result.orientation = 1
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

export function isTileWithEnemyAndNeighbourInRangeAndNeighbourEmptyOrOfActiveCreature (creature, turn, isNeighbourInRange, tileOfNeighbour, indexOfNeighbour) {
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
