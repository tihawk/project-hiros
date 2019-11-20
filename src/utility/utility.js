export const range = (start, end) => {
  if (start === end) {
    return [start]
  } else {
    return [start, ...range(start + 1, end)]
  }
}

export const populateGrid = () => {
  const grid = []
  // const gridObj = {
  //   x: 0,
  //   y: 0,
  //   hasCreature: false
  // }
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 15; x++) {
      const gridObj = {}
      gridObj.x = x
      gridObj.y = y
      if (x === 0) {
        gridObj.hasCreature = true
      }
      grid.push(gridObj)
    }
  }
  return grid
}

export const drawHexagon = (context, size, { x, y }) => {
  context.beginPath()
  context.moveTo(x + size * Math.cos(0), y + size * Math.sin(0))

  for (let side = 0; side < 7; side++) {
    context.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6))
  }

  // context.fillStyle = '#333333'
  context.stroke()
}
