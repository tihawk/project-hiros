const Creature = require('../Creature')
const { attackTypes } = require('../Enums').creature

class Archer extends Creature {
  constructor (stack, action, orientation, player) {
    super('Archer', 'Castle', 2, 6, 3, 2, 3, 10, 4, 9, 126, 100, undefined, attackTypes.ranged)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // special is Ranged (12 shots)
  }
}

module.exports = Archer
