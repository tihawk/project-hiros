const Creature = require('../Creature')

class Champion extends Creature {
  constructor (stack, action, orientation, player) {
    super('Champion', 'Castle', 6, 16, 16, 20, 25, 100, 9, 2, 2100, 1200)

    this.stackMultiplier = stack
    this.action = action
    this.orientation = orientation
    this.player = player

    // special is Jousting
  }
}

module.exports = Champion
