const Creature = require('../Creature')

class Archangel extends Creature {
  constructor (stack, action, orientation, player) {
    super('Archangel', 'Castle', 7, 30, 30, 50, 50, 250, 18, 1, 8776, 5000)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // specials are Flying, Hates Devils, Ressurection, Morale +1
  }
}

module.exports = Archangel