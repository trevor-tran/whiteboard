import { useState } from 'react'
import randomstring from 'randomstring';
import { connection } from "../../utils/const";

import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

//icons
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

function Sharing({ room, onRoomChange, onHost }) {
  const [roomValue, setRoomValue] = useState("");
  const [isEnteringRoomNumber, setIsEnteringRoomNumber] = useState(false);
  const [open, setOpen] = useState(false);

  // generate and update room code in global state
  function handleGenerateRoom() {
    const { roomNumberRule } = connection;
    let roomNumber = randomstring.generate({ length: roomNumberRule.ROOM_LENGTH, charset: roomNumberRule.CHARSET })
    onRoomChange(roomNumber);
    setOpen(true);
    onHost(true);
  }

  function handleRoomNumberDialog() {
    setIsEnteringRoomNumber(true);
    setOpen(true);
  }

  function handleJoinRoom() {
    onRoomChange(roomValue.trim());
    onHost(false);
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
        disabled={room}
        onClick={handleGenerateRoom}>
        <ScreenShareIcon />
      </button>
      <button
        type="button"
        className="btn"
        title="Join a canvas"
        disabled={room}
        onClick={handleRoomNumberDialog}>
        <LoginIcon />
      </button>
      <button
        type="button"
        className="btn"
        title="Leave"
        disabled={!room}
        onClick={() => onRoomChange("")}>
        <LogoutIcon color="error" />
      </button>



      {/* a dialog display the generated room code when user clicks share button */}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>
          {isEnteringRoomNumber ? "Host's room number" : "Share your room"}
        </DialogTitle>
        <DialogContent>
          {isEnteringRoomNumber ?
            <input className="form-control mt-1" name="room_code" value={roomValue} onChange={e => setRoomValue(e.target.value)} />
            :
            <Typography gutterBottom>{room}</Typography>
          }
        </DialogContent>
        <DialogActions>
          <button onClick={closeDialog} className="btn btn-secondary"> Close </button>
          {isEnteringRoomNumber ?
            <button onClick={handleJoinRoom} className="btn btn-primary"> OK </button> :
            null
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Sharing;
