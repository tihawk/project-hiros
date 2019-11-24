const creature = {
  actionTypes: {
    idle: 'idle',
    walk: 'walk',
    attackWE: 'attack-w-e',
    attacked: 'attacked',
    dying: 'dying'
  },
  orientations: {
    left: -1,
    right: 1
  }
}

module.exports = {
  creature
}
