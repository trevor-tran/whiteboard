import React from 'react'
import {types} from './types'

export const initialState = {
  color: "#00000",
  width: 2
}

export function reducer (state, action) {
  switch (action.type) {
    case types.SET_COLOR:
      console.log(action.payload)
      return {...state, color: action.payload}
    case types.SET_WIDTH:
      return {...state, width: action.payload}
    default:
      return initialState
  }
}

export const Context = React.createContext(null)

