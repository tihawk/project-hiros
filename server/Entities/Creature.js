class Creature {
  constructor (name, town, lvl, att, def, dMin, dMax, hp, spd, grw, val, cost, special = {}) {
    this.name = name
    this.town = town
    this.lvl = lvl
    this.att = att
    this.def = def
    this.dMin = dMin
    this.dMax = dMax
    this.hp = hp
    this.spd = spd
    this.grw = grw
    this.val = val
    this.cost = cost
    this.special = { ...special }
  }
}

module.exports = Creature
