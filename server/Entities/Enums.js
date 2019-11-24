const creature = {
  actionTypes: {
    idle: 'idle',
    walk: 'walk',
    attack: 'attack',
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
