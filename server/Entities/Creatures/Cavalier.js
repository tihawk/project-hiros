const Creature = require('../Creature')

class Cavalier extends Creature {
  constructor (stack, action, orientation, player) {
    super('Cavalier', 'Castle', 6, 15, 15, 15, 25, 100, 7, 2, 1946, 1000, undefined, undefined, 2)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // special is Jousting
  }
}

module.exports = Cavalier
