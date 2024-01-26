import { useState } from 'react'
import randomstring from 'randomstring';
import { connection } from "../../utils/const";

import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

//icons
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';


function Sharing({ room, onRoomChange }) {
  const [roomValue, setRoomValue] = useState("");
  const [isEnteringRoomNumber, setIsEnteringRoomNumber] = useState(false);
  // open/close dialog
  const [open, setOpen] = useState(false);

  // generate and update room code in global state
  function handleGenerateRoom() {
    const { roomNumberRule } = connection;
    let roomNumber = randomstring.generate({ length: roomNumberRule.ROOM_LENGTH, charset: roomNumberRule.CHARSET })
    onRoomChange(roomNumber);
    setOpen(true)
  }

  function handleRoomNumberDialog() {
    setIsEnteringRoomNumber(true);
    setOpen(true);
  }

  function handleJoinRoom() {
    onRoomChange(roomValue.trim());
    closeDialog();
  }

  function closeDialog() {
    setOpen(false);
    setIsEnteringRoomNumber(false);
  }

  return (
    <div>
      <button
        type="button"
        className="btn"
        title="Share your canvas"
        onClick={handleGenerateRoom}>
        <ScreenShareIcon />
      </button>
      <button
        type="button"
        className="btn"
        title="Join a canvas"
        onClick={handleRoomNumberDialog}>
        <MeetingRoomIcon />
      </button>


      {/* a dialog display the generated room code when user clicks share button */}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{"Copy and share room number"}</DialogTitle>
        <DialogContent>
          {isEnteringRoomNumber ?
            <>
              <label htmlFor="room_code">Enter room code:</label>
              <input name="room_code" value={roomValue} onChange={e => setRoomValue(e.target.value)}/>
            </>
            :
            <Typography gutterBottom>{room}</Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary"> Close </Button>
          { isEnteringRoomNumber ? 
            <Button onClick={handleJoinRoom} color="primary"> OK </Button> :
            null
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Sharing;
