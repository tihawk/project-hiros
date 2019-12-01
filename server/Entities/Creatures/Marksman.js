const Creature = require('../Creature')

class Marksman extends Creature {
  constructor (stack, action, orientation, player) {
    super('Marksman', 'Castle', 2, 6, 3, 2, 3, 10, 6, 9, 184, 150)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // specials are Ranged (24 shots) and Double attack
  }
}

module.exports = Marksman