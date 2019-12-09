const creature = {
  actionTypes: {
    idle: 'idle',
    walk: 'walk',
    attackWE: 'attack-w-e',
    attackNWNE: 'attack-nw-ne',
    attackSWSE: 'attack-sw-se',
    attacked: 'attacked',
    defend: 'defend',
    dying: 'dying',
    dead: 'dead'
  },
  orientations: {
    left: -1,
    right: 1
  },
  movementTypes: {
    walk: 'walk',
    fly: 'fly'
  },
  attackTypes: {
    melee: 'melee',
    ranged: 'ranged'
  }
}

const formations = {
  loose: {
    1: [5],
    2: [2, 8],
    3: [2, 5, 8],
    4: [0, 4, 6, 10],
    5: [0, 2, 5, 8, 10],
    6: [0, 2, 4, 6, 8, 10],
    7: [0, 2, 4, 5, 6, 8, 10]
  }
}

module.exports = {
  creature,
  formations
}
