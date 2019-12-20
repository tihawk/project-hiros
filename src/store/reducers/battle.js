import * as actionTypes from '../actions/actionTypes'

const initialState = {
  battleAddress: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_BATTLE_ADDRESS:
      return {
        ...state,
        battleAddress: action.battle
      }
    default: return state
  }
}

export default reducer
