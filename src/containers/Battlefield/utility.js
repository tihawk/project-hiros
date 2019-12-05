import * as hexFuncs from '../../utility/hexHelper'

export function isTileWithEnemyAndNeighbourInRangeAndNeighbourEmpty (creature, player, isNeighbourInRange, tileOfNeighbour) {
  return creature.player !== player && isNeighbourInRange && !tileOfNeighbour.hasCreature
}

export function getNeighbourIndex (board, tileIndex, corner) {
  if (board[tileIndex]) {
    const { x, y, z } = hexFuncs.oddRowHexToCube(board[tileIndex])
    const resultCube = hexFuncs.cubeNeighbourFromCube(x, y, z, corner)
    const neighbour = hexFuncs.cubeHexToOddRow(resultCube)
    return hexFuncs.indexFromOddRow(neighbour)
  }
}
