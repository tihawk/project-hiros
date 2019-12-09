const Creature = require('../Creature')
const { attackTypes } = require('../Enums').creature

class Zealot extends Creature {
  constructor (stack, action, orientation, player) {
    super('Zealot', 'Castle', 5, 12, 10, 10, 12, 30, 7, 3, 750, 450, undefined, attackTypes.ranged)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // specials are Ranged (24 shots) and No melee penalty
  }
}

module.exports = Zealot
