const Creature = require('../Creature')

class Naga extends Creature {
  constructor (stack, action, orientation, player) {
    super('Naga', 'Tower', 6, 16, 13, 20, 20, 110, 5, 2, 2016, 1100)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // special is No Enemy Retaliation
  }
}

module.exports = Naga
