import * as actionTypes from '../actions/actionTypes'

const initialState = {
  player: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PLAYER_DATA:
      return {
        ...state,
        player: action.player
      }
    default: return state
  }
}

export default reducer
