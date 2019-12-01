const Creature = require('../Creature')

class Angel extends Creature {
  constructor (stack, action, orientation, player) {
    super('Angel', 'Castle', 7, 20, 20, 50, 50, 200, 12, 1, 5019, 3000)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // specials are Flying, Hates Devils, Morale +1
  }
}

module.exports = Angel
