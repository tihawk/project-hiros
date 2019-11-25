const creature = {
  actionTypes: {
    idle: 'idle',
    walk: 'walk',
    attackWE: 'attack-w-e',
    attackNWNE: 'attack-nw-ne',
    attackSWSE: 'attack-sw-se',
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
