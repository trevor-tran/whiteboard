import { useContext, useState, useRef, useEffect } from 'react'

import { Context } from '../../store/store';
import { types } from '../../store/types'
import randomstring from 'randomstring'
import { ToolConsts, BACKGROUND_COLOR, ERASER_WIDTH } from '../../consts';

import {
  Button,
  Input,
  Tooltip,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

//icons
import EraserIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PenIcon from '@mui/icons-material/Create';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function Sharing() {
  // this is global state. Go to ../store/store.js to see what state is available
  const { state, dispatch } = useContext(Context)

  // room code user enters into the HTML Input tag
  const [roomCode, setRoomCode] = useState("")
  // open/close dialog
  const [open, setOpen] = useState(false)

  const [is_erasing, setIsErasing] = useState(false)


  const _color = useRef(state.color)
  const _width = useRef(state.width)

  useEffect(() => {
    if (state.color === BACKGROUND_COLOR && state.width === ERASER_WIDTH) {
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
    dispatch({ type: types.SET_COLOR, payload: _color.current })
    dispatch({ type: types.SET_WIDTH, payload: _width.current })
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
    <>
      {/* <CirclePicker triangle="hide" color={state.color} colors={['#B80000', '#FCCB00', '#006B76', '#1273DE', '#5300EB']} onChangeComplete={pickColor} /> */}
      {/* container of the first line of buttons */}
      <Grid container direction="row" justify="space-between">
        <Tooltip title="Clear Canvas">
          <Button size="small" variant="contained" color="secondary" onClick={clearDrawing}> <DeleteForeverIcon style={styles.iconSize} /> </Button>
        </Tooltip>

        <Tooltip title="Eraser">
          {/* https://github.com/mui-org/material-ui/issues/8416 */}
          <div>
            <Button size="small" variant="contained" onClick={setEraser} disabled={is_erasing}> <EraserIcon style={styles.iconSize} /> </Button>
          </div>
        </Tooltip>

        <Tooltip title="Pen">
          <div>
            <Button size="small" variant="contained" color="primary" onClick={setPen} disabled={!is_erasing}> <PenIcon style={styles.iconSize} /> </Button>
          </div>
        </Tooltip>
      </Grid>
      {/* second lines: buttons and text input */}
      <Grid container direction="row" justify="space-between">
        <Tooltip title="Share your canvas">
          <Button size="small" variant="contained" color="primary" onClick={handleShare}> <ScreenShareIcon style={styles.iconSize} /> </Button>
        </Tooltip>
        <Tooltip title="Join canvas by entering a room code">
          <Button size="small" variant="contained" color="primary" onClick={handleRoomInput}> <MeetingRoomIcon style={styles.iconSize} /> </Button>
        </Tooltip>
        {/* https://github.com/atlassian/react-beautiful-dnd/issues/110#issuecomment-331304943 */}
        <Input style={styles.codeInput} value={roomCode} placeholder="room #" onMouseDown={e => e.stopPropagation()} onChange={roomChange} />
      </Grid>

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
    </>
  )
}

const styles = {
  container: {
    backgroundColor: "white",
    position: "absolute",
    left: "42%",
    display: "inline-flex",
    flexDirection: "column",
    cursor: "move"
  },
  codeInput: {
    width: 85
  },
  iconSize: {
    fontSize: 20
  }
}