import React, { useContext, useState, useRef, useEffect } from 'react'

import { Context } from '../store/store';
import { types } from '../store/types'
import randomstring from 'randomstring'
import { ToolConsts, BACKGROUND_COLOR, ERASER_WIDTH } from '../consts';
// components
import { GithubPicker } from 'react-color'
import Draggable from 'react-draggable';
import { Button, Paper, Input, Tooltip, Grid, Typography } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

//icons
import EraserIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import PenIcon from '@material-ui/icons/Create'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'


export default function Tool() {
  // this is global state. Go to ../store/store.js to see what state is available
  const { state, dispatch } = useContext(Context)
  // room code user enters into the HTML Input tag
  const [roomCode, setRoomCode] = useState("")
  // open/close dialog
  const [open, setOpen] = useState(false)

  const [is_erasing, setIsErasing] = useState(false)


  const _color = useRef(state.color)
  const _width = useRef(state.width)

  useEffect( () => {
    if (state.color === BACKGROUND_COLOR && state.width === ERASER_WIDTH){
      setIsErasing(true)
    } else {
      setIsErasing(false)
    }
  }, [state.color, state.width])

  const pickColor = (color, event) => {
    // update local color when new color picked
    _color.current = color.hex
    dispatch({ type: types.SET_COLOR, payload: color.hex })
    // this dispatch preventing bug when users click Eraser then choose a color
    // without this dispatch, it would expose Eraser implementation
    dispatch({ type: types.SET_WIDTH, payload: _width.current })
  }

  const clearDrawing = () => {
    dispatch({ type: types.SET_CLEAR, payload: true })
    //restore color and width
    dispatch({type: types.SET_COLOR, payload: _color.current})
    dispatch({type: types.SET_WIDTH, payload: _width.current})
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
    // save current color and width to restore later
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
        <Paper style={styles.container}>
          <GithubPicker triangle="hide" color={state.color} colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']} onChangeComplete={pickColor} />
          {/* container of the first line of buttons */}
          <Grid container direction="row" justify="space-between">
            <Tooltip title="Clear Canvas">
              <Button size="small" variant="contained" color="secondary" onClick={clearDrawing}> <DeleteIcon style={styles.iconSize}/> </Button>
            </Tooltip>

            <Tooltip title="Eraser">
              {/* https://github.com/mui-org/material-ui/issues/8416 */}
              <div>
                <Button size="small" variant="contained" color="default" onClick={setEraser} disabled={is_erasing}> <EraserIcon style={styles.iconSize}/> </Button>
              </div>
            </Tooltip>

            <Tooltip title="Pen">
              <div>
                <Button size="small" variant="contained" color="primary" onClick={setPen} disabled={!is_erasing}> <PenIcon style={styles.iconSize}/> </Button>
              </div>
            </Tooltip>
          </Grid>
          {/* second lines: buttons and text input */}
          <Grid container direction="row" justify="space-between">
            <Tooltip title="Share your canvas">
              <Button size="small" variant="contained" color="primary" onClick={handleShare}> <ScreenShareIcon style={styles.iconSize}/> </Button>
            </Tooltip>
            <Tooltip title="Join canvas by entering a room code">
              <Button size="small" variant="contained" color="primary" onClick={handleRoomInput}> <MeetingRoomIcon style={styles.iconSize}/> </Button>
            </Tooltip>
            {/* https://github.com/atlassian/react-beautiful-dnd/issues/110#issuecomment-331304943 */}
            <Input style={styles.codeInput} value={roomCode} placeholder="room #" onMouseDown={e => e.stopPropagation()} onChange={roomChange} />
            </Grid>
        </Paper>
      </Draggable>

      {/* a dialog display the generated room code when user clicks share button */}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{"Share this room code"}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{state.room}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary"> Close </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

const styles = {
  container: {
    backgroundColor: "white",
    position: "absolute",
    left:"42%",
    display: "inline-flex",
    flexDirection: "column",
    cursor:"move"
  },
  codeInput: {
    width: 85
  },
  iconSize: {
    fontSize: 20
  }
}