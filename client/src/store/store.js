import React from 'react'
import {types} from './types'

export const initialState = {
  color: "#000000",
  width: 2,
  clear: false,
  room: ""
}

export function reducer (state, action) {
  switch (action.type) {
    case types.SET_COLOR:
      console.log("color in store:" + action.payload)
      return {...state, color: action.payload}
    case types.SET_WIDTH:
      return {...state, width: action.payload}
    case types.SET_CLEAR:
      return {...state, clear: action.payload}
    case types.SET_ROOM:
      return {...state, room: action.payload}
    // case types.ALL:
    //   // console.log(action.payload)
    //   return {...state, color: action.payload.color, width: action.payload.width}
    default:
      return initialState
  }
}

export const Context = React.createContext(null)

