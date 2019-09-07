import React, { useContext, useState } from 'react'

import { Context } from '../store/store';
import { types } from '../store/types'

// components
import { TwitterPicker } from 'react-color'
import Draggable from 'react-draggable';
import { Button, Paper, Input, Tooltip } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

import randomstring from 'randomstring'



function Tool() {
   // this is global state. Go to ../store/store.js to see what state is available 
  const { state, dispatch } = useContext(Context)
  // room code user enters into the HTML Input tag
  const [roomCode, setRoomCode] = useState("")  
  // open/close dialog
  const [open, setOpen] = useState(false)

  const pickColor = (color, event) => {
    dispatch({ type: types.SET_COLOR, payload: color.hex })
  }

  const clearDrawing = () => {
    dispatch({ type: types.SET_CLEAR, payload: true })
  }

  // generate and update room code in global state
  const handleShare = () => {
    let code = randomstring.generate({ length: 6, charset: '0123456789' })
    updateRoomCode(code)
    setOpen(true)
  }

  const updateRoomCode = (value = roomCode) => {
    dispatch({ type: types.SET_ROOM, payload: value })
  }

  // use entered room code
  const enterRoomCode = (e) => {
    setRoomCode(e.target.value)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
    <Draggable bounds='parent'>
      <Paper style={{ display: "inline-flex", backgroundColor: "white", flexDirection: "column" }}>
        <TwitterPicker triangle="hide" color={state.color} onChangeComplete={pickColor} />
        <div style={{ display: 'flex', flexDirection: "column" }}>
          <Tooltip title="Clear Canvas">
            <Button
              variant="contained" color="secondary"
              onClick={clearDrawing}
            > <DeleteIcon /> </Button>
          </Tooltip>
        </div>
        <div style={{ display: 'flex', flexDirection: "row" }}>
          <Tooltip title="Share your canvas">
            <Button
              style={{ marginRight: "1%" }}
              variant="contained"
              color="primary"
              onClick={handleShare}
            > <ScreenShareIcon /> </Button>
          </Tooltip>
          <Tooltip title="Join canvas by entering a room code">
            <Button
              style={{ marginRight: '1%' }}
              variant="contained"
              color="primary"
              onClick={() => updateRoomCode()}
            > <MeetingRoomIcon /> </Button>
          </Tooltip>
          <Input
            value={roomCode}
            placeholder="Room Code"
            // https://github.com/atlassian/react-beautiful-dnd/issues/110#issuecomment-331304943
            onMouseDown={e => e.stopPropagation()}
            onChange={enterRoomCode} />
        </div>
      </Paper>
    </Draggable>

    {/* a dialog display the generated room code when user clicks share button */}
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{"Share this room code"}</DialogTitle>
      <DialogContent>
        <DialogContentText>{state.room}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary"> Close </Button>
      </DialogActions>
    </Dialog>
  </React.Fragment>
  )
}

export default Tool