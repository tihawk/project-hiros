const { actionTypes } = require('./Enums').creature

class Creature {
  constructor (name, town, lvl, att, def, dMin, dMax, hp, spd, grw, val, cost, special = {}) {
    this.name = name
    this.town = town
    this.level = lvl
    this.att = att
    this.def = def
    this.dMin = dMin
    this.dMax = dMax
    this.hp = hp
    this.spd = spd
    this.grw = grw
    this.value = val
    this.cost = cost
    this.special = { ...special }

    this.action = null
    this.orientation = null
    this.stackMultiplier = null

    this.setAction = this.setAction.bind(this)
    this.setOrientation = this.setOrientation.bind(this)
    this.resetAction = this.resetAction.bind(this)
    this.move = this.move.bind(this)
    this.attack = this.attack.bind(this)
  }

  setAction (actionType) {
    this.action = actionType
  }

  setOrientation (orientation) {
    this.orientation = orientation
  }

  resetAction () {
    this.action = actionTypes.idle
  }

  move (orientation) {
    this.action = actionTypes.walk
    this.orientation = orientation
  }

  attack (indexOfTileToAttack) {
    this.action = actionTypes.attack
  }
}

module.exports = Creature
