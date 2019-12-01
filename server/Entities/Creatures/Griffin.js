const Creature = require('../Creature')

class Griffin extends Creature {
  constructor (stack, action, orientation, player) {
    super('Griffin', 'Castle', 3, 8, 8, 3, 6, 25, 6, 7, 351, 200)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // specials are Flying and Two retaliations
  }
}

module.exports = Griffin