class Army {
  constructor (player) {
    this.player = player
    this.army = [null, null, null, null, null, null, null]
  }

  addMember (creature, position) {
    if (position < 7) {
      if (!this.army[position]) {
        creature.armyIndex = position
        this.army.splice(position, 1, creature)
      }
    }
  }

  moveMember (posFrom, posTo) {
    if (this.army[posFrom]) {
      const member = this.army.splice(posFrom, 1)
      this.addMember(...member, posTo)
    }
  }

  removeMember (pos) {
    if (this.army[pos]) {
      this.army.splice(pos, 1, null)
    }
  }
}

module.exports = Army
