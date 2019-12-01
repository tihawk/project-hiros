const Creature = require('../Creature')

class RoyalGriffin extends Creature {
  constructor (stack, action, orientation, player) {
    super('Royal Griffin', 'Castle', 3, 9, 9, 3, 6, 25, 9, 7, 448, 240)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // specials are Flying and Unlimited retaliations
  }
}

module.exports = RoyalGriffin
