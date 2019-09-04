import React from 'react'
import {types} from './types'

export const initialState = {
  color: "black",
  width: 2
}

export function reducer (state, action) {
  switch (action.types) {
    case types.SET_COLOR:
      return {...state, color: action.payload}
    case types.SET_WIDTH:
      return {...state, width: action.payload}
    default:
      return initialState
  }
}

export const Context = React.createContext(null)

