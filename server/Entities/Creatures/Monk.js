const Creature = require('../Creature')

class Monk extends Creature {
  constructor (stack, action, orientation, player) {
    super('Monk', 'Castle', 5, 12, 7, 10, 12, 30, 5, 3, 485, 400)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // special is Ranged (12 shots)
  }
}

module.exports = Monk
