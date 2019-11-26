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

    this.currentHP = hp
    this.isAlive = true
    this.action = null
    this.orientation = null
    this.stackMultiplier = null

    this.setAction = this.setAction.bind(this)
    this.setOrientation = this.setOrientation.bind(this)
    this.resetAction = this.resetAction.bind(this)
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

  attack (enemy) {
    const randDamage = Math.random() * (this.dMax - this.dMin) + this.dMin
    const X = this.att > enemy.def ? 0.05 : 0.02
    const damage = (1 + ((this.att - enemy.def) * X)) * this.stackMultiplier * randDamage

    const currentHealthOfEnemy = enemy.currentHP - damage
    console.log(currentHealthOfEnemy)
    if (currentHealthOfEnemy < 0) {
      enemy.stackMultiplier -= 1
      enemy.currentHP = enemy.hp - damage - enemy.currentHP
    } else {
      enemy.currentHP = currentHealthOfEnemy
    }
  }

  checkIfAlive () {
    let actionType
    if (this.stackMultiplier <= 0) {
      this.isAlive = false
      actionType = actionTypes.dying
    } else {
      actionType = actionTypes.attacked
    }
    this.setAction(actionType)
    return { isAlive: this.isAlive, actionType }
  }
}

module.exports = Creature
