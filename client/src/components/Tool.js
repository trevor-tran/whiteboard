import React, { useContext, useState, useRef } from 'react'

import { Context } from '../store/store';
import { types } from '../store/types'

// components
import { GithubPicker } from 'react-color'
import Draggable from 'react-draggable';
import { Button, Paper, Input, Tooltip } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

//icons
import EraserIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import PenIcon from '@material-ui/icons/Create'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

import randomstring from 'randomstring'
import { ToolConsts } from '../consts';



function Tool() {
  // this is global state. Go to ../store/store.js to see what state is available 
  const { state, dispatch } = useContext(Context)
  // room code user enters into the HTML Input tag
  const [roomCode, setRoomCode] = useState("")
  // open/close dialog
  const [open, setOpen] = useState(false)

  // 
  const _color = useRef(null)
  const _width = useRef(null)

  const pickColor = (color, event) => {
    dispatch({ type: types.SET_COLOR, payload: color.hex })
  }

  const clearDrawing = () => {
    dispatch({ type: types.SET_CLEAR, payload: true })
  }

  // generate and update room code in global state
  const handleShare = () => {
    let code = randomstring.generate({ length: ToolConsts.ROOM_LENGTH, charset: ToolConsts.CHARSET })
    dispatch({ type: types.SET_ROOM, payload: code })
    setOpen(true)
  }

  const handleRoomInput = () => {
    if (roomCode) {
      alert("Ok:)")
      dispatch({ type: types.SET_ROOM, payload: roomCode })
    }
  }

  // use entered room code
  const roomChange = (e) => {
    setRoomCode(e.target.value)
  }

  const closeDialog = () => {
    setOpen(false)
  }
  const setEraser = () => {
    _color.current = state.color
    _width.current = state.width
    dispatch({ type: types.SET_ERASER })
  }

  const setPen = () => {
    dispatch({ type: types.SET_PEN, payload: { color: _color.current, width: _width.current } })
  }

  return (
    <React.Fragment>
      <Draggable bounds='parent'>
        <Paper style={{ position: "absolute", display: "inline-flex", backgroundColor: "white", flexDirection: "column" }}>
          {/* <TwitterPicker triangle="hide" color={state.color} onChangeComplete={pickColor} /> */}
          <GithubPicker triangle="hide" color={state.color} onChangeComplete={pickColor} />
          <div style={{ display: 'flex', flexDirection: "row" }}>
            <Tooltip title="Clear Canvas">
              <Button
                variant="contained" color="secondary"
                onClick={clearDrawing}
              > <DeleteIcon /> </Button>
            </Tooltip>
            <Tooltip title="Eraser">
              <Button
                variant="contained" color="default"
                onClick={setEraser}
              > <EraserIcon /> </Button>
            </Tooltip>
            <Tooltip title="Pen">
              <Button
                variant="contained" color="primary"
                onClick={setPen}
              > <PenIcon /> </Button>
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
                onClick={handleRoomInput}
              > <MeetingRoomIcon /> </Button>
            </Tooltip>
            <Input
              value={roomCode}
              placeholder="Room Code"
              // https://github.com/atlassian/react-beautiful-dnd/issues/110#issuecomment-331304943
              onMouseDown={e => e.stopPropagation()}
              onChange={roomChange} />
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