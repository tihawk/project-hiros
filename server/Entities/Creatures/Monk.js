const Creature = require('../Creature')
const { attackTypes } = require('../Enums').creature

class Monk extends Creature {
  constructor (stack, action, orientation, player) {
    super('Monk', 'Castle', 5, 12, 7, 10, 12, 30, 5, 3, 485, 400, undefined, attackTypes.ranged)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // special is Ranged (12 shots)
  }
}

module.exports = Monk
