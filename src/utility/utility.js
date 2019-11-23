export const range = (start, end) => {
  if (start === end) {
    return [start]
  } else {
    return [start, ...range(start + 1, end)]
  }
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

export const whichCornerOfHex = (e) => {
  const { offsetWidth, offsetHeight } = e.target
  const { x, y } = e.target.getBoundingClientRect()
  const dx = x - e.clientX + offsetWidth / 2
  const dy = y - e.clientY + offsetHeight / 2

  const leftRight = 3.5
  const up = 14
  const down = 0

  if (dx > leftRight) {
    if (dy <= up && dy >= down) {
      return 'w'
    } else if (dy > up) {
      return 'nw'
    } else if (dy < down) {
      return 'sw'
    }
  } else if (dx < leftRight) {
    if (dy <= up && dy >= down) {
      return 'e'
    } else if (dy > up) {
      return 'ne'
    } else if (dy < down) {
      return 'se'
    }
  }
}
