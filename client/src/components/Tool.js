import React, { useContext, useState } from 'react'

import { Context } from '../store/store';
import { types } from '../store/types'

// components
import { TwitterPicker } from 'react-color'
import Draggable from 'react-draggable';
import { Button, Paper, Input } from '@material-ui/core'

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

import randomstring from 'randomstring'



function Tool() {
  const { state, dispatch } = useContext(Context)
  const [roomCode, setRoomCode] = useState("")

  const pickColor = (color, event) => {
    dispatch({ type: types.SET_COLOR, payload: color.hex })
  }

  const clearDrawing = () => {
    dispatch({ type: types.SET_CLEAR, payload: true })
  }

  // generate and update room code in global state
  const generateRoomCode = () => {
    let code = randomstring.generate({ length: 6, charset: '0123456789' })
    updateRoomCode(code)
  }

  const updateRoomCode = (value = roomCode) => {
    dispatch({ type: types.SET_ROOM_CODE, payload: value })
  }

  // use entered room code
  const enterRoomCode = (e) => {
    setRoomCode(e.target.value)
  }

  return (
    <Draggable bounds='parent'>
      <Paper style={{ display: "inline-flex", backgroundColor: "white", flexDirection: "column" }}>
        <TwitterPicker triangle="hide" color={state.color} onChangeComplete={pickColor} />
        <div style={{ display: 'flex', flexDirection: "column"  }}>
          <Button
            variant="contained" color="secondary"
            onClick={clearDrawing}
          > <DeleteIcon /> </Button>
          </div>
        <div style={{ display: 'flex', flexDirection: "row" }}>
          <Button
            style={{marginRight: "1%" }}
            variant="contained"
            color="primary"
            onClick={generateRoomCode}
          > <ScreenShareIcon /> </Button>
          <Button
            style={{ marginRight: '1%' }} 
            variant="contained"
            color="primary"
            onClick={() => updateRoomCode()}
          > <MeetingRoomIcon /> </Button>
          <Input 
          value={roomCode} 
          placeholder="Room Code" 
          // https://github.com/atlassian/react-beautiful-dnd/issues/110#issuecomment-331304943
          onMouseDown={e => e.stopPropagation()} 
          onChange={enterRoomCode} />
        </div>
      </Paper>
    </Draggable>
  )
}

export default Tool