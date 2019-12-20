import * as actionTypes from './actionTypes'

export const setPlayerData = (player) => {
  return {
    type: actionTypes.SET_PLAYER_DATA,
    player
  }
}
