import React, { useContext } from 'react'
import { TwitterPicker } from 'react-color'
import { Context } from '../store/store';
import { types } from '../store/types'
import Draggable from 'react-draggable';

function Tool() {
  const { state, dispatch } = useContext(Context)
  const pickColor = (color, event) => {
    dispatch({ type: types.SET_COLOR, payload: color.hex })
  }
  return (
    <Draggable bounds='parent'>
      <div style={{display: "inline-flex"}}>
        <TwitterPicker
          color={state.color}
          onChangeComplete={pickColor}
        />
      </div>
    </Draggable>
  )
}

export default Tool