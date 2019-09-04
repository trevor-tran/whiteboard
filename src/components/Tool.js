import React, { useContext } from 'react'
import { Paper } from '@material-ui/core';
import {TwitterPicker} from 'react-color'
import { Context } from '../store/store';
import {types} from '../store/types'

function Tool() {
  const {state, dispatch} = useContext(Context)

  const pickColor = (color, event) => {
    dispatch({type: types.SET_COLOR, payload: color.hex})
  }
  return (
    <Paper>
      <TwitterPicker 
      color={state.color} 
      onChangeComplete = {pickColor}
    />
    </Paper>
  )
}

export default Tool