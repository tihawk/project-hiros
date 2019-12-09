const Creature = require('../Creature')
const { movementTypes } = require('../Enums').creature

class Archangel extends Creature {
  constructor (stack, action, orientation, player) {
    super('Archangel', 'Castle', 7, 30, 30, 50, 50, 250, 18, 1, 8776, 5000, movementTypes.fly)

    this.stackMultiplier = stack
    this.action = action
    this.originalOrientation = orientation
    this.orientation = orientation
    this.player = player

    // specials are Flying, Hates Devils, Ressurection, Morale +1
  }
}

module.exports = Archangel
