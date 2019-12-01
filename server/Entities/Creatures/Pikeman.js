const Creature = require('../Creature')

class Pikeman extends Creature {
  constructor (stack, action, orientation, player) {
    super('Pikeman', 'Castle', 1, 4, 5, 1, 3, 10, 4, 14, 80, 60)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // special is Immune to jousting
  }
}

module.exports = Pikeman
