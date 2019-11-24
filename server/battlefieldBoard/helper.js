exports.oddRowHexToCube = ({ x, y }) => {
  const cubeX = x - (y - (y & 1)) / 2
  const cubeZ = y
  const cubeY = -cubeX - cubeZ
  return { x: cubeX, y: cubeY, z: cubeZ }
}

exports.cubeHexToOddRow = ({ x, z }) => {
  const oddRowX = x + (z - (z & 1)) / 2
  const oddRowY = z
  return { x: oddRowX, y: oddRowY }
}

exports.calculateCubeDistance = ({ x, y, z }, cx, cy, cz) => {
  return (Math.abs(cx - x) + Math.abs(cy - y) + Math.abs(cz - z)) / 2
}

exports.cubeNeighbourFromCube = (x, y, z, corner) => {
  switch (corner) {
    case ('w'):
      return { x: x - 1, y: y + 1, z: z }
    case ('nw'):
      return { x: x, y: y + 1, z: z - 1 }
    case ('ne'):
      return { x: x + 1, y: y, z: z - 1 }
    case ('e'):
      return { x: x + 1, y: y - 1, z: z }
    case ('se'):
      return { x: x, y: y - 1, z: z + 1 }
    case ('sw'):
      return { x: x - 1, y: y, z: z + 1 }
    default:
      return null
  }
}
