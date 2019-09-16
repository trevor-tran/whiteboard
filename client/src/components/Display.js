import React, { useReducer, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import { Fab } from '@material-ui/core'
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

import { Context, initialState, reducer } from '../store/store'

// components
import Tool from './Tool'
import Canvas from './Canvas'

function Display() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [showTool, setShowTool] = useState(false)
  const IsDesktop = useMediaQuery({ minWidth: 1024 })

  return (
    <Context.Provider value={{ state, dispatch }}>
      <React.Fragment>
        {(IsDesktop || showTool) && <Tool />}
        {!IsDesktop && (
          <Fab
            size="small"
            style={{ position: 'absolute', bottom: '1%', right: '1%', backgroundColor: '#6aaf6a', color: 'white' }}
            onClick={() => setShowTool(!showTool)}>
            {showTool ? <DownIcon /> : <UpIcon />}
          </Fab>
        )}
        <Canvas />
      </React.Fragment>
    </Context.Provider>
  )
}

export default Display;