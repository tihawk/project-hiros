const Creature = require('../Creature')

class Crusader extends Creature {
  constructor (stack, action, orientation, player) {
    super('Crusader', 'Castle', 4, 12, 12, 7, 10, 35, 6, 4, 558, 400)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // special is Double attack
  }
}

module.exports = Crusader
