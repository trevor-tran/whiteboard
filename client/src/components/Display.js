import React, { useReducer } from 'react'

import { Context, initialState, reducer } from '../store/store'

// components
import Tool from './Tool'
import Canvas from './Canvas'

function Display() {
  
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <React.Fragment>
        <Tool/>
        <Canvas/>
      </React.Fragment>
    </Context.Provider>
  )
}

export default Display;