import * as actionTypes from './actionTypes'

export const setBattleAddress = (battle) => {
  return {
    type: actionTypes.SET_BATTLE_ADDRESS,
    battle
  }
}
