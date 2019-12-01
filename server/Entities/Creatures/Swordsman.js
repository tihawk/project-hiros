const Creature = require('../Creature')

class Swordsman extends Creature {
  constructor (stack, action, orientation, player) {
    super('Swordsman', 'Castle', 4, 10, 12, 6, 9, 35, 5, 4, 445, 300)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player
  }
}

module.exports = Swordsman
