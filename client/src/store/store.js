import React from 'react'
import {types} from './types'

export const initialState = {
  color: "#00000",
  width: 2,
  clear: false,
  room: ""
}

export function reducer (state, action) {
  switch (action.type) {
    case types.SET_COLOR:
      return {...state, color: action.payload}
    case types.SET_WIDTH:
      return {...state, width: action.payload}
    case types.SET_CLEAR:
      return {...state, clear: action.payload}
    case types.SET_ROOM:
      console.log(action.payload)
      return {...state, room: action.payload}
    case types.ALL:
      return action.payload
    default:
      return initialState
  }
}

export const Context = React.createContext(null)

