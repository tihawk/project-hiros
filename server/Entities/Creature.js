const { actionTypes, movementTypes, attackTypes } = require('./Enums').creature

class Creature {
  constructor (
    name, town, lvl, att, def, dMin, dMax, hp, spd, grw, val, cost,
    movementType = movementTypes.walk,
    attackType = attackTypes.melee,
    size = 1,
    retaliations = 1,
    special = {}
  ) {
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
    this.movementType = movementType
    this.attackType = attackType
    this.size = size
    this.special = { ...special }
    this.retaliationsPerRound = retaliations

    this.currentRetaliations = retaliations
    this.isDefend = false
    this.currentDef = def
    this.currentHP = hp
    this.isAlive = true
    this.action = null
    this.orientation = null
    this.originalOrientation = null
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
    this.orientation = this.originalOrientation
  }

  setDefend (isDefend) {
    this.isDefend = isDefend
    this.currentDef = isDefend === true ? this.def + 0.3 * this.def : this.def
  }

  resetRoundStats () {
    this.currentRetaliations = this.retaliationsPerRound
  }

  calculateBaseDamage (enemy) {
    const randDamage = Math.random() * (this.dMax - this.dMin) + this.dMin
    const enemyDef = enemy.currentDef
    const X = this.att > enemyDef ? 0.05 : 0.02
    return (1 + ((this.att - enemyDef) * X)) * this.stackMultiplier * randDamage
  }

  assignEnemyHealth (currentHealthOfEnemy, enemy) {
    if (currentHealthOfEnemy <= 0) {
      enemy.stackMultiplier += -1 + Math.ceil(currentHealthOfEnemy / enemy.hp)
      enemy.currentHP = enemy.hp + (currentHealthOfEnemy % enemy.hp)
      console.log(enemy.stackMultiplier, currentHealthOfEnemy, enemy.hp, -1 + Math.ceil(currentHealthOfEnemy / enemy.hp), enemy.currentHP)
    } else {
      enemy.currentHP = currentHealthOfEnemy
    }
  }

  attack (enemy) {
    let damage = this.calculateBaseDamage(enemy)
    if (this.attackType === attackTypes.ranged) {
      damage = 0.5 * damage
    }

    const currentHealthOfEnemy = enemy.currentHP - damage
    console.log(enemy.stackMultiplier, damage)
    this.assignEnemyHealth(currentHealthOfEnemy, enemy)
  }

  shoot (enemy, distance) {
    if (this.attackType === attackTypes.ranged) {
      let damage = this.calculateBaseDamage(enemy)
      if (distance > 10) {
        damage = 0.5 * damage
      }
      const currentHealthOfEnemy = enemy.currentHP - damage
      console.log(enemy.stackMultiplier, damage)
      this.assignEnemyHealth(currentHealthOfEnemy, enemy)
    }
  }

  checkIfAlive () {
    let actionType
    if (this.stackMultiplier <= 0) {
      this.isAlive = false
      actionType = actionTypes.dying
    } else {
      if (this.isDefend) {
        actionType = actionTypes.defend
      } else {
        actionType = actionTypes.attacked
      }
    }
    this.setAction(actionType)
    return { isAlive: this.isAlive, actionType }
  }

  checkIfRetaliates (other) {
    if (this.isAlive && !other.special.noEnemyRetaliation) {
      if (this.currentRetaliations > 0) {
        this.currentRetaliations -= 1
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}

module.exports = Creature
