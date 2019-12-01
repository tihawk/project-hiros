const Creature = require('../Creature')

class Archer extends Creature {
  constructor (stack, action, orientation, player) {
    super('Archer', 'Castle', 2, 6, 3, 2, 3, 10, 4, 9, 126, 100)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // special is Ranged (12 shots)
  }
}

module.exports = Archer
