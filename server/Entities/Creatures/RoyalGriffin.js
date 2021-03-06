const Creature = require('../Creature')
const { movementTypes } = require('../Enums').creature

class RoyalGriffin extends Creature {
  constructor (stack, action, orientation, player) {
    super('Royal Griffin', 'Castle', 3, 9, 9, 3, 6, 25, 9, 7, 448, 240, movementTypes.fly, undefined, 2, 999)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // specials are Flying and Unlimited retaliations
  }
}

module.exports = RoyalGriffin
